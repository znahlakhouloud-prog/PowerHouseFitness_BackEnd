import express from "express";
import {fetchUsers,addUser,fetchUserById} from "../controllers/userController.js";


const router = express.Router();

router.get("/",fetchUsers);
router.post("/",addUser);
router.get("/:id",fetchUserById);

export default router;