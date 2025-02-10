import {NextFunction, Request, Response} from 'express';
import User from "../models/User";
import {generateToken, hashPassword, comparePassword} from '../utils/auth'
import {AuthEmail} from "../emails/AuthEmail";
import {generateJWT} from "../utils/jwt";
import jwt from "jsonwebtoken";


export class AuthController {
    static createAccount = async (req:Request, res:Response, next:NextFunction) => {

        const {email, password } = req.body;
        const userExists = await User.findOne({where: {email}});

        if (userExists) {
            res.status(400).json('User already exists');
            return;
        }

      try {
        const user = new User(req.body);
        user.password = await hashPassword(password);
        user.token = generateToken();
        await user.save();

        await AuthEmail.sendConfirmationEmail({name: user.name, email: user.email, token: user.token});
        res.status(201).json('Account created successfully');
      }catch (error) {
          console.log(error);
          res.status(500).json('An error occurred while creating account');
      }
    }

    static confirmAccount = async (req:Request, res:Response, next:NextFunction) => {
        const {token} = req.body;

        const user = await User.findOne({where: {token}});
        if (!user) {
            res.status(401).json('User not found');
            return;
        }

        user.token = null;
        user.confirmed = true;
        await user.save();
        res.status(200).json('Account confirmed successfully');
    }

    static login = async (req:Request, res:Response, next:NextFunction) => {
        const {email, password} = req.body;

        const user = await User.findOne({where: {email}});

        if (!user) {
            res.status(404).json('User not found');
            return;
        }

        if (!user.confirmed) {
            res.status(403).json('Account not confirmed');
            return;
        }

        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json('Invalid password');
            return;
        }

        const token = generateJWT(user.id);
        res.status(200).json(token);


    }


    static forgotPassword = async (req:Request, res:Response, next:NextFunction) => {
        const {email} = req.body;

        const user = await User.findOne({where: {email}});

        if (!user) {
            res.status(404).json('User not found');
            return;
        }

        user.token = generateToken();
        await user.save();

        await AuthEmail.sendPasswordResetToken({name: user.name, email: user.email, token: user.token});
        res.status(200).json('Reset password email sent');

    }

    static validateToken = async (req:Request, res:Response, next:NextFunction) => {
        const {token} = req.body;

        const user = await User.findOne({where: {token}});
        if (!user) {
            res.status(404).json('Token is not valid');
            return;
        }

        res.status(200).json('Token is valid');
    }

    static resetPassword = async (req:Request, res:Response, next:NextFunction) => {
        const {token} = req.params;
        const {password} = req.body;

        const user = await User.findOne({where: {token}});

        if (!user) {
            res.status(404).json('Token is not valid');
            return;
        }

        user.password = await hashPassword(password);
        user.token = null;
        await user.save();
        res.status(200).json('Password reset successfully');

    }

    static user = async (req:Request, res:Response, next:NextFunction) => {
        res.status(200).json(req.user);
    }

    static updateCurrentPassword = async (req:Request, res:Response, next:NextFunction) => {
        const { current_password, password } = req.body;

        const user = await User.findByPk(req.user.id);

        const isPasswordValid = await comparePassword(current_password, user.password);

        if (!isPasswordValid) {
           const error = new Error('Invalid password');
              res.status(401).json({error:error.message});
                return;
        }

        user.password = await hashPassword(password);
        await user.save();
        res.status(200).json('Password updated successfully');
    }


    static checkPassword = async (req:Request, res:Response, next:NextFunction) => {
        const { password } = req.body;

        try{
            const user = await User.findByPk(req.user.id);

            const isPasswordValid = await comparePassword(password, user.password);

            if (!isPasswordValid) {
                const error = new Error('Invalid password');
                res.status(401).json({error:error.message});
                return;
            }
            res.status(200).json('Password is valid');
        }catch (e) {
            const error = new Error('An error occurred while checking password');
            res.status(500).json({error:error.message});
        }

    }

}