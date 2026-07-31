import db from "../config/database.js";


export const getAllUsers = async () => {

    const sql = `
        SELECT
            id,
            user_name,
            age,
            email,
            role
        FROM user
    `;

    const [rows] = await db.query(sql);

    return rows;
};

   export const createUser=async(data)=>{
 const sql=`
    INSERT INTO user
    (user_name , age , email , password , role)
    VALUES (? , ? , ? , ? , ?)`;

    const [result]= await db.query(sql,[
        data.user_name,
        data.age,
        data.email,
        data.password,
        data.role
    ]);

     return result;
  
   };


   export const getUserById =async(id)=>{
    const sql = `SELECT 
                        id,
                        user_name,
                        age,
                        email,
                        role
                   FROM user
                   WHERE id=?`;

    const [rows]= await db.query(sql,[id]);

    return rows;
   };

   export const updateUser = async(id,data)=>{
      const sql=`
      UPDATE user
      SET 
          user_name=?,
          age=?,
          email=?,
          password=?,
          role=?
      WHERE id=?`;
      const [result] = await db.query(sql,[
         data.user_name,
        data.age,
        data.email,
        data.password,
        data.role,
        id
      ]
      );
      return result;

   };

   export const deleteUser = async(id)=>{
      const sql = `
      DELETE FROM user
      WHERE id=?`;
      const [result] = await db.query(sql,[id]);
      return result;

   };


   export const getUserByEmail = async(email)=>{

    const sql=`
    SELECT *
    FROM user
    WHERE email=? `;

    const [rows]= await db.query(sql,[email]);

    return rows;
   };

   export const userExists = async(id)=>{
     const sql = `
        SELECT id
        FROM user
        WHERE id = ? `;
    
    const [rows]= await db.query(sql,[id]);

    return rows.length > 0;
   };