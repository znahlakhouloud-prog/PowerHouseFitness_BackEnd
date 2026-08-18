import express from "express";
import {fetchUsers,fetchUserById,editUser,updateOwnProfile,removeUser} from "../controllers/userController.js";
import {validateUser} from "../middleware/validateUser.js";
import {authenticateToken} from "../middleware/authMiddleware.js";
import {authorizeRoles, authorizeOwnerOrRoles} from "../middleware/roleMiddleware.js";
import { validateUpdateUser } from "../middleware/validateUpdateUser.js";
import { validateOwnProfile } from "../middleware/validateOwnProfile.js";

const router = express.Router();

router.get("/", authenticateToken, authorizeRoles("admin", "receptionist"), fetchUsers);

// Must be registered before /:id so "me" isn't swallowed as an id param
router.put(
    "/me",
    authenticateToken,
    validateOwnProfile,
    updateOwnProfile
);

router.get(
    "/:id",
    authenticateToken,
    authorizeOwnerOrRoles("id", "admin", "receptionist"),
    fetchUserById
);

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
