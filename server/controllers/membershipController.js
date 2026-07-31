import {getAllMemberships,
        getMembershipById,
        createMembership,
        getActiveMembershipByUserId,
        updateExpiredMemberships} from "../models/membership.js";
import {userExists} from "../models/user.js";




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

export const addMembership = async(req,res)=>{
    try{
        const exists = await userExists(req.body.id_user);

          if(!exists){
            return res.status(404).json({
                message: "User not found"
            });
          }
        const activeMembership = await getActiveMembershipByUserId(req.body.id_user);

           if(activeMembership.length > 0){
              return res.status(409).json({
                message: "User already has an active membership"
              });
           }


        const startDate = new Date (req.body.start_date);
        const endDate = new Date (startDate);
        
        endDate.setDate(endDate.getDate() + req.body.duration);

        const membershipData ={
            ...req.body,
            end_date:endDate.toISOString().split("T")[0]
        };

        const result = await createMembership(membershipData);

        res.status(201).json({
            message:"Membership created successfully",
            id: result.insertId
        });
    } catch (error){
        res.status(500).json(error);
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