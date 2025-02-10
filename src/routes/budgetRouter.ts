import { Router } from 'express'
const router = Router();
import {BudgetController} from '../controllers/BudgetController'
import {handleInputErrors} from "../middleware/validations";
import {hasAccess, validateBudgetExists, validateBudgetId, validateBudgetInput} from "../middleware/budget";
import {ExpensesController} from "../controllers/ExpenseController";
import {validateExpenseExists, validateExpenseId, validateExpenseInput} from "../middleware/expense";
import {authenticate} from "../middleware/auth";

router.use(authenticate);
router.param('budgetId', validateBudgetId);
router.param('budgetId', validateBudgetExists);
router.param('budgetId', hasAccess);

router.param('expenseId', validateExpenseId);
router.param('expenseId', validateExpenseExists);


router.post('/', validateBudgetInput, handleInputErrors, BudgetController.creteBudget);
router.get('/', BudgetController.getAll);
router.get('/:budgetId', BudgetController.getById);
router.put('/:budgetId', validateBudgetInput, handleInputErrors, BudgetController.updateBudget);
router.delete('/:budgetId', BudgetController.deleteBudget);



// Routes for Expenses
router.post('/:budgetId/expenses', validateExpenseInput, handleInputErrors, ExpensesController.create);
router.get('/:budgetId/expenses/:expenseId', handleInputErrors, ExpensesController.getById);
router.put('/:budgetId/expenses/:expenseId', ExpensesController.updateById);
router.delete('/:budgetId/expenses/:expenseId', ExpensesController.deleteById);


export default router;