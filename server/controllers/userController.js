import {getAllUsers} from "../models/user.js";


export const fetchUsers = (req,res)=>{
    getAllUsers((err,results)=>{
        if(err) {
            return
            res.status(500).json(err);
        }
        res.json(results);
    });
};