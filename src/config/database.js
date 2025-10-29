const mysql = require('mysql2/promise');


const databaseUrl = process.env.DATABASE_URL;

let pool;

if (databaseUrl) {
    console.log('🚂 Using Railway DATABASE_URL');
    pool = mysql.createPool(databaseUrl);
} else {
    console.log('💻 Using local database configuration');
    pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'country_api',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
}

async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Database connected successfully');
        connection.release();
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        console.error('Error details:', error.message);
        process.exit(1);
    }
}

module.exports = { pool, testConnection };
