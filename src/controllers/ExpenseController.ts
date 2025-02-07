import type { Request, Response } from 'express'
import Expense from "../models/Expense";

export class ExpensesController {


    static create = async (req: Request, res: Response) => {
       try {
           const expense = new Expense(req.body);
           expense.budgetId = req.budget.id;
           await expense.save();
           res.json('Expense created');
       }catch (error) {
           res.status(500).send({message: error.message})
       }
    }

    static getById = async (req: Request, res: Response) => {
        res.status(200).json(req.expense);
    }

    static updateById = async (req: Request, res: Response) => {
        await req.expense.update(req.body);
        res.json('Expense was updated');
    }

    static deleteById = async (req: Request, res: Response) => {
        await req.expense.destroy();
        res.json('Expense was deleted');
    }
}