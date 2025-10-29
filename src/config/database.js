const { Pool } = require('pg');

const databaseUrl = process.env.DATABASE_URL;

let pool;

if (databaseUrl) {
    console.log('🚂 Using Railway DATABASE_URL');
    pool = new Pool({
        connectionString: databaseUrl,
        ssl: {
            rejectUnauthorized: false
        }
    });
} else {
    console.log('💻 Using local database configuration');
    pool = new Pool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'country_api',
        port: process.env.DB_PORT || 5432
    });
}

async function testConnection() {
    try {
        const client = await pool.connect();
        console.log('✅ Database connected successfully');
        client.release();
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        console.error('Error details:', error.message);
        process.exit(1);
    }
}

module.exports = { pool, testConnection };