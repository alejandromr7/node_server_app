import { Request, Response } from 'express'
import Budget from "../models/Budget";


export class BudgetController{

    static creteBudget = async (req:Request, res:Response) => {
        try {
            const budget = new Budget(req.body);
            budget.userId = req.user.id;
            await budget.save();
            res.json('Budget created');
        }catch (error) {
            res.status(500).json({message: 'Error creating budget'});
        }
    }

    static getAll = async (req:Request, res:Response) => {
        try {
            const budgets = await Budget.findAll({
               order: [['createdAt', 'DESC']],
                include: ['expenses'],
                where: { userId: req.user.id }
            });
            // TODO: Filter By USER

            res.json(budgets);
        }catch (error) {
            res.status(500).json({message: error});
        }
    }

    static getById = async (req:Request, res:Response) => {
        const budget = await Budget.findByPk(req.params.budgetId, { include: ['expenses'] });
        res.json(budget);
    }

    static updateBudget = async (req:Request, res:Response) => {
        await req.budget.update(req.body);
        res.json('Budget was updated');
    }

    static deleteBudget = async (req:Request, res:Response) => {
        await req.budget.destroy();
        res.json('Budget was deleted');
    }

}