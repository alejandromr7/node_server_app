import { Sequelize } from 'sequelize-typescript'
import dotenv from 'dotenv'
dotenv.config();
import { Client } from 'pg';

const databaseUrl = process.env.DATABASE_URL;

export  const createDatabaseIfNotExists = async () => {
    const dbName = new URL(databaseUrl).pathname.substring(1); // Extract DB name
    const dbUrlWithoutDbName = databaseUrl.replace(`/${dbName}`, '/postgres'); // Default DB connection

    const client = new Client({
        connectionString: dbUrlWithoutDbName,
    });

    try {
        await client.connect();
        const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${dbName}'`);
        if (res.rowCount === 0) {
            await client.query(`CREATE DATABASE "${dbName}"`);
            console.log(`Database "${dbName}" created successfully.`);
        } else {
            console.log(`Database "${dbName}" already exists.`);
        }
    } catch (error) {
        console.error('Error creating database:', error);
    } finally {
        await client.end();
    }
};

export const db = new Sequelize(process.env.DATABASE_URL, {
    models: [__dirname + '/../models/**/*'],
    logging: true,

    // dialectOptions: {
    //     ssl: {
    //         require: true,
    //         rejectUnauthorized: false
    //     }
    // }

});
