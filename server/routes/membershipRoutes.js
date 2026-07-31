import express from "express";
import {fetchMemberships,
        fetchMembershipById,
        addMembership,
        checkMembershipAccess} from "../controllers/membershipController.js";
import { validateMembership } from "../middleware/validateMembership.js";
const router = express.Router();


router.get("/",fetchMemberships);
router.get("/check/:id_user", checkMembershipAccess);
router.get("/:id",fetchMembershipById);
router.post("/",validateMembership,addMembership);



export default router;
