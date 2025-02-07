import {NextFunction, Request, Response} from "express";
import {body, param} from "express-validator";
import Expense from "../models/Expense";

declare global {
    namespace Express {
        interface Request {
            expense?: Expense
        }
    }
}


export const validateExpenseInput =async (req: Request, res: Response, next: NextFunction) => {
    await body('name').notEmpty().withMessage('Name is required').run(req)
    await body('amount').isNumeric().withMessage('Amount is required').custom(value =>  value > 0).withMessage('Amount must be greater than 0').run(req)
    next();
}



export const validateExpenseId =async (req: Request, res: Response, next: NextFunction) => {
    await param('expenseId').isInt().withMessage('Id must be a number').custom(value => value > 0).withMessage('Id is not valid').run(req)
    next();
}


export const validateExpenseExists  = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { expenseId } = req.params
        const expense = await Expense.findByPk(expenseId);
        if (!expense) {
            const error = new Error('Expense not found');
            res.status(404).json({message: error.message});
            return;
        }
        req.expense = expense;

        next();
    }catch (error) {
        res.status(500).json({message: error.message});
    }
}