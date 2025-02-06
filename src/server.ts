import express from 'express'
import colors from 'colors'
import morgan from 'morgan'
import {db} from './config/db'



async function connectDB(){
    try {
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



export default app