import express from "express";

import {
    fetchNotifications,
    fetchNotificationById,
    fetchNotificationsByUserId,
    addNotification,
    editNotification,
    removeNotification,
    readNotification,
    fetchUnreadCount,
    readAllNotifications
} from "../controllers/notificationController.js";

import { validateNotification } from "../middleware/validateNotification.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { authorizeRoles, authorizeOwnerOrRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// GET ALL NOTIFICATIONS
router.get(
    "/",
    authenticateToken,
    authorizeRoles("admin", "receptionist"),
    fetchNotifications
);

// GET USER NOTIFICATIONS (own only, unless admin/receptionist - same
// ownership pattern used for /users/:id)
router.get(
    "/user/:id_user",
    authenticateToken,
    authorizeOwnerOrRoles("id_user", "admin", "receptionist"),
    fetchNotificationsByUserId
);

// GET MY UNREAD COUNT
router.get(
    "/unread-count",
    authenticateToken,
    fetchUnreadCount
);

// MARK ALL MY NOTIFICATIONS AS READ
router.patch(
    "/read-all",
    authenticateToken,
    readAllNotifications
);

// GET NOTIFICATION BY ID
router.get(
    "/:id",
    authenticateToken,
    fetchNotificationById
);

// CREATE NOTIFICATION
router.post(
    "/",
    authenticateToken,
    authorizeRoles("admin", "receptionist"),
    validateNotification,
    addNotification
);

// UPDATE NOTIFICATION
router.put(
    "/:id",
    authenticateToken,
    authorizeRoles("admin", "receptionist"),
    validateNotification,
    editNotification
);

// MARK AS READ
router.patch(
    "/:id/read",
    authenticateToken,
    readNotification
);

// DELETE NOTIFICATION
router.delete(
    "/:id",
    authenticateToken,
    authorizeRoles("admin"),
    removeNotification
);

export default router;