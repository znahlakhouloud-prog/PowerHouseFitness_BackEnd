import {getAllMemberships,
        getMembershipById,
        getActiveMembershipByUserId,
        updateExpiredMemberships} from "../models/membership.js";
import { createMembershipService } from "../services/membershipService.js";




export const fetchMemberships = async (req,res)=>{
    try{
        // update expired memberships first
        await updateExpiredMemberships();

        // then fetch all memberships
        const memberships = await getAllMemberships();

        res.json(memberships);
    }catch (error){
        res.status(500).json(error);
    }
};

export const fetchMembershipById = async(req,res)=>{
    try{
        await updateExpiredMemberships();
        const id=req.params.id;
        const memberships= await getMembershipById(id);
        
           if(memberships.length===0){
            return res.status(404).json({
                message: "Membership not found"
            });
           }
           res.json(memberships[0]);
    } catch(error){
        res.status(500).json(error);
    }
};

export const addMembership = async (req, res) => {

    try {

        const result =
            await createMembershipService(req.body);

        res.status(201).json({
            message: "Membership created successfully",
            id: result.insertId
        });

    } catch (error) {

       res.status(error.status || 500).json({
        message: error.message
    });
    }

};

export const checkMembershipAccess = async (req,res)=>{
    try{
        // first update expired memberships
        await updateExpiredMemberships();

        const memberships = await getActiveMembershipByUserId(req.params.id_user);

         if(memberships.length===0){
            return res.status(404).json ({
                allowed: false,
                message: "No active membership found"
            });
         }
         res.json({
            allowed: true,
            message:"Access granted",
            membership:memberships[0]
         });
    } catch (error){
        res.status(500).json(error);
        console.log(error);

    }
    
};

export const renewMembership = async (req, res) => {

    try {

        const result =
            await createMembershipService(req.body);

        res.status(201).json({
            message: "Membership renewed successfully",
            id: result.insertId
        });

    } catch (error) {

        res.status(error.status || 500).json({
        message: error.message
    });
    }

};