import express from "express";

import {
    fetchNotifications,
    fetchNotificationById,
    fetchNotificationsByUserId,
    addNotification,
    editNotification,
    removeNotification
} from "../controllers/notificationController.js";

import { validateNotification } from "../middleware/validateNotification.js";

const router = express.Router();

router.get("/", fetchNotifications);

router.get("/user/:id_user", fetchNotificationsByUserId);

router.get("/:id", fetchNotificationById);

router.post("/", validateNotification, addNotification);

router.put("/:id", validateNotification, editNotification);

router.delete("/:id", removeNotification);

export default router;