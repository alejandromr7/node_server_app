import express from 'express'
import colors from 'colors'
import morgan from 'morgan'
import {createDatabaseIfNotExists, db} from './config/db'

import budgetRouter from './routes/budgetRouter'
import authRouter from "./routes/authRouter";
import {limiter} from "./config/limiter";

async function connectDB(){
    try {
        await createDatabaseIfNotExists();
        await db.authenticate();
        await db.sync();
        console.log(colors.blue('DB conectada'))
    } catch (error) {
        console.log(colors.red('Error al conectar a la DB' + error));
        console.log(colors.red('Error al conectar a la DB'));
    }
}

connectDB();

const app = express()
app.use(morgan('dev'))
app.use(express.json())

app.use('/api/budgets', budgetRouter);
app.use('/api/auth', authRouter);

export default app