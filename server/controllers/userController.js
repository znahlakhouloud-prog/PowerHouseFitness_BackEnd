import {getAllUsers,createUser,getUserById,updateUser,deleteUser} from "../models/user.js";


export const fetchUsers = (req,res)=>{
    getAllUsers((err,results)=>{
        if(err) {
            return
            res.status(500).json(err);
        }
        res.json(results);
    });
};

export const addUser = (req, res) => {

    createUser(req.body, (err, result) => {

        if (err) {

            if (err.code === "ER_DUP_ENTRY") {
                return res.status(409).json({
                    message: "Email already exists"
                });
            }

            return res.status(500).json(err);
        }

        res.status(201).json({
            message: "User created successfully",
            id: result.insertId
        });

    });

};

export const fetchUserById = (req,res)=>{

    const id= req.params.id;

    getUserById(id,(err,results)=>{
        if(err) {
            return
            res.status(500).json(err);
        }
        if (results.length===0){
            return
            res.status(404).json({
                message:"User not found"
            });
        };
})};


export const editUser=(req,res)=>{
    const id = req.params.id;

    updateUser(id,req.body,(err,result)=>{
        if(err){
            return res.status(500).json(err);
        };
        if(result.affectedRows===0){
            return res.status(404).json({
                message:"User not found"
            });
        };
        res.json({
            message:"User updated successfully"
        });
    });
};

export const removeUser =(req,res)=>{
    const id=req.params.id;

    deleteUser(id,(err,result)=>{
        if (err){
             return res.status(500).json(err);
        }
         if(result.affectedRows===0){
            return res.status(404).json({
                message:"User not found"
            });
        };
        res.json({
            message:"User deleted successfully"
    });
});
};
