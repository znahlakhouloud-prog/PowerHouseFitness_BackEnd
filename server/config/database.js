import mysql from "mysql2";


const db=
mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"nahlakhztn2401=",
    database:"gym_management",
});

db.connect((err)=>{
    if(err){
        console.log("Database connection failes:",err);
    } else{
        console.log("Connected to MySQL");
    }
});


export default db;