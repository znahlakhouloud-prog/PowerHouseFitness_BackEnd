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

   export const createUser=(data,callback)=>{
    const sql=`
    INSERT INTO user
    (user_name , age , email , password , role)
    VALUES (? , ? , ? , ? , ?)`;

    db.query(sql,[
        data.user_name,
        data.age,
        data.email,
        data.password,
        data.role
    ], callback);
   };


   export const getUserById =(id,callback)=>{
    const sql = `SELECT 
                        id,
                        user_name,
                        age,
                        email,
                        role
                   FROM user
                   WHERE id=?`;

    db.query(sql,[id],callback);
   };

   export const updateUser = (id,data,callback)=>{
      const sql=`
      UPDATE user
      SET 
          user_name=?,
          age=?,
          email=?,
          password=?,
          role=?
      WHERE id=?`;
      db.query(sql,[
         data.user_name,
        data.age,
        data.email,
        data.password,
        data.role,
        id
      ],callback
      );

   };

   export const deleteUser = (id,callback)=>{
      const sql = `
      DELETE FROM user
      WHERE id=?`;
      db.query(sql,[id],callback);

   };