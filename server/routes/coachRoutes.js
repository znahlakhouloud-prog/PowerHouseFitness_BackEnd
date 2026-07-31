import express from "express";

import {
    fetchCoaches,
    fetchCoachById,
    addCoach,
    editCoach,
    removeCoach
} from "../controllers/coachController.js";

import { validateCoach } from "../middleware/validateCoach.js";

const router = express.Router();

router.get("/", fetchCoaches);

router.get("/:id", fetchCoachById);

router.post("/", validateCoach, addCoach);

router.put("/:id", validateCoach, editCoach);

router.delete("/:id", removeCoach);

export default router;