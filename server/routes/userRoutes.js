import express from "express";
import {fetchUsers,addUser,fetchUserById,editUser} from "../controllers/userController.js";


const router = express.Router();

router.get("/",fetchUsers);
router.post("/",addUser);
router.get("/:id",fetchUserById);
router.put("/:id",editUser);

export default router;