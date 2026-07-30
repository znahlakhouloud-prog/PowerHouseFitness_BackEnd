import bcrypt from "bcrypt";
// import { findUserByEmail } from "../models/authModel.js";
import {getUserByEmail} from "../models/user.js";
import jwt from "jsonwebtoken";

// export const login =(req,res)=>{

//     const {email,password} = req.body;

//     findUserByEmail(email,async(err,results)=>{
//         if(err){
//             return res.status(500).json(err);
//         }
//         if(results.length===0){
//             return res.status(401).json({
//                 message : "Invalid email or password"
//             });
//         }

//         const user= results[0];
        
//         const isMatch= await bcrypt.compare(password,user.password);

//         if(!isMatch){
//             return res.status(401).json({
//                 message : "Invalid email or password"
//             });
//         }

//         res.status(200).json({
//             message :"Login successful",
//             user :{
//                 id : user.id,
//                 user_name : user.user_name,
//                 email : user.email,
//                 role : user.role
//             }
//         });
//     });
// };


export const login = async(req,res) => {
     try{
        const {email,password} = req.body;
        const users = await getUserByEmail(email);
        if (users.length===0){
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isMatch = await bcrypt.compare(password,users[0].password);

        if(!isMatch){
            return res.status(401).json({
                message : "Invalid email or password"
            });
        }

        const token= jwt.sign({
            id: users[0].id,
            role: users[0].role
        },
    process.env.JWT_SECRET,
{
    expiresIn: "1h"
}
);
return res.json({
    message : "Login successful",
    token
});
     } catch (error){
            res.status(500).json(error);
        }
     };
