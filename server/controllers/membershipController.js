import {getAllMemberships,getMembershipById,createMembership,getActiveMembershipByUserId} from "../models/membership.js";
import {userExists} from "../models/user.js";




export const fetchMemberships = async (req,res)=>{
    try{

        const memberships = await getAllMemberships();

        res.json(memberships);
    }catch (error){
        res.status(500).json(error);
    }
};

export const fetchMembershipById = async(req,res)=>{
    try{
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

        const result = await createMembership(req.body);

        res.status(201).json({
            message:"Membership created successfully",
            id: result.insertId
        });
    } catch (error){
        res.status(500).json(error);
    }
};
