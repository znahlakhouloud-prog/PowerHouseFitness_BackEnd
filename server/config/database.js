import mysql from "mysql2/promise";


const db=
mysql.createPool({
    host:"localhost",
    user:"root",
    password:"nahlakhztn2401=",
    database:"gym_management",

    waitForConnections :true,
    connectionLimit :10,
    queueLimit: 0
});

try{
    const connection = await db.getConnection();
    console.log("Connected to MySQL");
    connection.release();
} catch (err){
    console.error("Database connection failed:",err);
}



export default db;