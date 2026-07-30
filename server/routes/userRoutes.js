import express from "express";
import {fetchUsers,addUser,fetchUserById,editUser,removeUser} from "../controllers/userController.js";
import {validateUser} from "../middleware/validateUser.js";
import {authenticateToken} from "../middleware/authMiddleware.js";
import {authorizeRoles} from "../middleware/roleMiddleware.js";
const router = express.Router();

router.get("/",authenticateToken,fetchUsers);
router.post("/",validateUser,addUser);
router.get("/:id",fetchUserById);
router.put("/:id",editUser);
router.delete("/:id",authenticateToken,authorizeRoles("admin"),removeUser);

export default router;