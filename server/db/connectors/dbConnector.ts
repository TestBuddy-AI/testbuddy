import dotenv from "dotenv";
import { ConnectionPool } from 'mssql';

dotenv.config();

if (!process.env.WH_SERVER || !process.env.DB || !process.env.DB_USER || !process.env.DB_PASS || !process.env.DB_PORT) {
    throw new Error("Required environment variables are not set!");
}

const config = {
    server: process.env.WH_SERVER,
    database: process.env.DB,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: parseInt(process.env.DB_PORT),
    options: {
        encrypt: true,
        trustServerCertificate: false,
    }
};

const pool = new ConnectionPool(config);

export const getDbConnection = async () => {
    if (!pool.connected && !pool.connecting) await pool.connect();
    return pool;
};
