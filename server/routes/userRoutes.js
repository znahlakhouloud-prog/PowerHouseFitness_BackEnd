import express from "express";
import {fetchUsers,addUser,fetchUserById,editUser,removeUser} from "../controllers/userController.js";


const router = express.Router();

router.get("/",fetchUsers);
router.post("/",addUser);
router.get("/:id",fetchUserById);
router.put("/:id",editUser);
router.delete("/:id",removeUser);

export default router;