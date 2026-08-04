import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {getUserByEmail} from "../models/user.js";
import { changePasswordService} from "../services/userService.js";
import { registerService} from "../services/authService.js";

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

export const register = async (req, res) => {

    try {

        const result = await registerService(req.body);

        res.status(201).json({
            message: "User created successfully",
            id: result.insertId
        });

    } catch (error) {

        if (error.message === "EMAIL_ALREADY_EXISTS") {
            return res.status(409).json({
                message: "Email already exists"
            });
        }

        res.status(500).json(error);

    }

};

export const login = async(req,res) => {
     try{
        const {email,password} = req.body;
        const users = await getUserByEmail(email);
        if (users.length===0){
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }
        const user = users[0];

        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.status(401).json({
                message : "Invalid email or password"
            });
        }

        const token= jwt.sign({
            id: user.id,
            role: user.role
        },
    process.env.JWT_SECRET,
{
    expiresIn: "1h"
}
);
return res.status(200).json({
    message : "Login successful",
    token,
    user:{
        id: user.id,
        user_name: user.user_name,
        email: user.email,
        role: user.role,
         must_change_password: user.must_change_password
    }
});
     } catch (error){
            res.status(500).json(error);
        }
     };


export const changePassword = async (req, res) => {

    try {

        const id = req.user.id; // obtained from JWT

        const { oldPassword, newPassword } = req.body;

        await changePasswordService(
            id,
            oldPassword,
            newPassword
        );

        res.status(200).json({
            message: "Password changed successfully"
        });

    } catch (error) {

        if (error.message === "USER_NOT_FOUND") {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (error.message === "INVALID_PASSWORD") {
            return res.status(401).json({
                message: "Old password is incorrect"
            });
        }

        res.status(500).json(error);

    }

};