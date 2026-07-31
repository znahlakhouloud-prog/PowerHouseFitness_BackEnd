import express from "express";
import {fetchMemberships,
        fetchMembershipById,
        addMembership,
        checkMembershipAccess} from "../controllers/membershipController.js";

const router = express.Router();


router.get("/",fetchMemberships);
router.get("/check/:id_user", checkMembershipAccess);
router.get("/:id",fetchMembershipById);
router.post("/",addMembership);



export default router;
