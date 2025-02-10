import {  Request, Response, NextFunction } from 'express'
import jwt from "jsonwebtoken";
import User from "../models/User";

declare global {
    namespace Express {
        interface Request {
            user?: User
        }
    }
}


export const authenticate = async (req:Request, res:Response, next:NextFunction) => {
    const bearer = req.headers.authorization;

    if (!bearer) {
        const error = new Error('Unauthorized');
        res.status(401).json({error:error.message});
        return;
    }

    const [, token] = bearer.split(' ');

    if (!token) {
        const error = new Error('Token not provided');
        res.status(401).json({error:error.message});
        return;
    }


    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (typeof decoded === 'object' && decoded.id) {
             req.user = await User.findByPk(decoded.id, { attributes: {exclude: ['password','token','createdAt','updatedAt','confirmed']}});


            next();
        }

    }catch (e) {
        console.log(e);
        res.status(500).json('An error occurred while fetching user');
    }
}