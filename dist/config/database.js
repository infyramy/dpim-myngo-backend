import knex from 'knex';
import dotenv from 'dotenv';
dotenv.config();
const config = {
    client: 'mysql2',
    connection: {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'myngo_dev',
    },
    pool: {
        min: 2,
        max: 10,
    },
};
export const db = knex(config);
export const testConnection = async () => {
    try {
        await db.raw('SELECT 1');
        console.log('✅ Database connection successful');
        return true;
    }
    catch (error) {
        console.error('❌ Database connection failed:', error);
        return false;
    }
};
export default db;
//# sourceMappingURL=database.js.map