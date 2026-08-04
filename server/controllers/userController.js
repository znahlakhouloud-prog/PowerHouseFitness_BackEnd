import bcrypt from "bcrypt";
import {getAllUsers,createUser,getUserById,updateUser,deleteUser} from "../models/user.js";

export const fetchUsers = async (req, res) => {

    try {

        const users = await getAllUsers();

        res.json(users);

    } catch (error) {

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

        const currentUser = await getUserById(id);

        if (currentUser.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const updatedUser = {
            ...currentUser[0],
            ...req.body,
            password: req.body.password
                ? await bcrypt.hash(req.body.password, 10)
                : currentUser[0].password
        };

        const result = await updateUser(id, updatedUser);

        res.json({
            message: "User updated successfully"
        });

    } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to update user" });
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
