import dotenv from "dotenv";
dotenv.config();

import mysql from "mysql2/promise";



const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

try {
    const connection = await db.getConnection();
    console.log("Connected to MySQL");
    connection.release();
} catch (err) {
    console.error("Database connection failed:", err);
};

export default db;