import {body, param, validationResult} from 'express-validator'
import {NextFunction, Request, Response} from "express";
import Budget from "../models/Budget";

declare global {
    namespace Express {
        interface Request {
            budget?: Budget
        }
    }
}

export const validateBudgetId  = async (req: Request, res: Response, next: NextFunction) => {
    await param('budgetId').isInt().withMessage('Id must be a number').custom(value => value > 0).withMessage('Id is not valid').run(req)
    next()
}

export const validateBudgetExists  = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { budgetId } = req.params
        const budget = await Budget.findByPk(budgetId);
        if (!budget) {
            const error = new Error('Budget not found');
            res.status(404).json({message: error.message});
            return;
        }
        req.budget = budget;

    next();
    }catch (error) {
        res.status(500).json({message: error.message});
    }
}


export const validateBudgetInput =async (req: Request, res: Response, next: NextFunction) => {
    await body('name').notEmpty().withMessage('Name is required').run(req)
       await body('amount').isNumeric().withMessage('Amount is required').custom(value =>  value > 0).withMessage('Amount must be greater than 0').run(req)
    next()
}