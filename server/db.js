import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes("render") ? { rejectUnauthorized: false } : false
});

// Initialize Database Schema
const initializeDatabase = async () => {
    try {
        const client = await pool.connect();
        console.log('Connected to PostgreSQL database.');

        // Create machines table
        await client.query(`
            CREATE TABLE IF NOT EXISTS machines (
                id VARCHAR(50) PRIMARY KEY,
                "displayId" VARCHAR(50),
                status VARCHAR(50),
                "startTime" BIGINT,
                "accumulatedTime" BIGINT,
                "targetTime" BIGINT,
                "wasRunningBeforeOutage" BOOLEAN
            );
        `);

        // Create users table
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE,
                password VARCHAR(255)
            );
        `);

        // Seed admin user
        const checkUser = await client.query('SELECT * FROM users WHERE username = $1', ['admin']);
        if (checkUser.rows.length === 0) {
            await client.query('INSERT INTO users (username, password) VALUES ($1, $2)', ['admin', 'admin123']);
            console.log("Users table ready (seeded with admin).");
        }

        console.log('Database schema initialized.');
        client.release();
    } catch (err) {
        console.error('Error initializing database', err);
    }
};

initializeDatabase();

export default pool;
