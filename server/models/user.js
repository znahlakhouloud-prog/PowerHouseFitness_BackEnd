import db from "../config/database.js";


export const getAllUsers = 
   (callback)=>{
      const sql = "SELECT * from user";
      
      db.query(sql, callback);
   };

