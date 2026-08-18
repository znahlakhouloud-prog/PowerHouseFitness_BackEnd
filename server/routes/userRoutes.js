import express from "express";
import {fetchUsers,fetchUserById,editUser,removeUser} from "../controllers/userController.js";
import {validateUser} from "../middleware/validateUser.js";
import {authenticateToken} from "../middleware/authMiddleware.js";
import {authorizeRoles} from "../middleware/roleMiddleware.js";
import { validateUpdateUser } from "../middleware/validateUpdateUser.js";

const router = express.Router();

router.get("/", authenticateToken, authorizeRoles("admin", "receptionist"), fetchUsers);

router.get("/:id", authenticateToken, fetchUserById);

router.put(
    "/:id",
    authenticateToken,
    authorizeRoles("admin"),
    validateUpdateUser,
    editUser
);

router.delete(
    "/:id",
    authenticateToken,
    authorizeRoles("admin"),
    removeUser
);

export default router;