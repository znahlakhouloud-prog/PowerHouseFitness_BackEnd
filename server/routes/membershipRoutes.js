import express from "express";
import {fetchMemberships,fetchMembershipById,addMembership} from "../controllers/membershipController.js";

const router = express.Router();


router.get("/",fetchMemberships);
router.get("/:id",fetchMembershipById);
router.post("/",addMembership);



export default router;
