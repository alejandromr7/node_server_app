import { Router } from 'express'
import {AuthController} from "../controllers/AuthController";
import {body, param} from "express-validator";
import {handleInputErrors} from "../middleware/validations";
import {limiter} from "../config/limiter";
import {authenticate} from "../middleware/auth";
const router = Router();

router.use(limiter);

router.post('/create-account',
    body('name').notEmpty().withMessage('Name is required'),
    body('password').isLength({min:8}).withMessage("Password must be greater than 8"),
    body('email').isEmail().withMessage('Email is not valid'),
    handleInputErrors,
    AuthController.createAccount
);


router.post('/confirm-account/',
    body('token').notEmpty().isLength({min:6,max:6}).withMessage('Name is required'),
    handleInputErrors,
    AuthController.confirmAccount
);

router.post('/login',
    body('email').isEmail().withMessage('Email is not valid'),
    body('password').isLength({min:8}).withMessage("Password must be greater than 8"),
    handleInputErrors,
    AuthController.login
);

router.post('/forgot-password',
    body('email').isEmail().withMessage('Email is not valid'),
    handleInputErrors,
    AuthController.forgotPassword
    );

router.post('/validate-token',
    body('token').notEmpty().isLength({min:6,max:6}).withMessage('Name is required'),
    handleInputErrors,
    AuthController.validateToken
);

router.post('/reset-password/:token',
    param('token').notEmpty().withMessage('Token is required'),
    body('password').isLength({min:8}).withMessage("Password must be greater than 8"),
    handleInputErrors,
    AuthController.resetPassword
);

router.get('/user', authenticate, AuthController.user);
router.post('/update-password', authenticate,
    body('current_password').notEmpty().withMessage("Password is required"),
    body('password').isLength({min:8}).withMessage("Password must be greater than 8"),
    AuthController.updateCurrentPassword);

router.post('/check-password',
    authenticate,
    body('password').notEmpty().withMessage("Password is required"),
    handleInputErrors,
    AuthController.checkPassword);


export default router;