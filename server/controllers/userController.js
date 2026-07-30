import {getAllUsers,createUser,getUserById,updateUser,deleteUser} from "../models/user.js";
import bcrypt from "bcrypt";

export const fetchUsers = async (req, res) => {

    try {

        const users = await getAllUsers();

        res.json(users);

    } catch (error) {

        res.status(500).json(error);

    }

};

export const addUser = async(req, res) => {
    try{
        const hashedPassword = await bcrypt.hash(req.body.password,10);

        const newUser = {
            ...req.body,
            password : hashedPassword
        };

        const result = await createUser(newUser);

        res.status(201).json({
             message: "User created successfully",
             id: result.insertId
        });
    

} catch (error){
    if(error.code==="ER_DUP_ENTRY"){
        return res.status(409).json({
            message : "Email already exists"
        });
    }
    res.status(500).json(error);
    
}
};

export const fetchUserById =async (req,res)=>{

    try{
    const id= req.params.id;

    const users = await getUserById(id);
        
        if (users.length===0){
            return  res.status(404).json({
                message:"User not found"
            });
        }
        res.json (users[0]);
} catch (error) {

    res.status(500).json(error);
}
};


export const editUser = async (req, res) => {

    try {

        const id = req.params.id;

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const updatedUser = {
            ...req.body,
            password: hashedPassword
        };

        const result = await updateUser(id, updatedUser);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            message: "User updated successfully"
        });

    } catch (error) {
    console.error(error);

    res.status(500).json({
        message: error.message,
        stack: error.stack
    });
}

};

export const removeUser =async(req,res)=>{
    try{
    const id=req.params.id;

    const result = await deleteUser(id);
        
         if(result.affectedRows=== 0){
            return res.status(404).json({
                message:"User not found"
            });
        };
        res.json({
            message:"User deleted successfully"
    });
} catch (error) {
    res.status(500).json(error);
}
};
