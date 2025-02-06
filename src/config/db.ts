import { Sequelize } from 'sequelize-typescript'
import dotenv from 'dotenv'
dotenv.config();



export const db = new Sequelize(process.env.DATABASE_URL, {
    logging: false,

    // dialectOptions: {
    //     ssl: {
    //         require: true,
    //         rejectUnauthorized: false
    //     }
    // }

});
