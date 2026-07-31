import {
    createCoach,
    getCoachByUserId } from "../models/coach.js";

import {getUserById} from "../models/user.js";

export const createCoachService = async (data)=>{

    const user = await getUserById(data.id_user);

    if(user.length===0){

        const error = new Error("User not found");
        error.status =404;
        throw error;

    }

    if(user[0].role !== "coach"){

        const error = new Error("User is not a coach");
        error.status =409;
        throw error;

    }

    const exists = await getCoachByUserId(data.id_user);

    if(exists.length>0){

        const error = new Error("Coach already exists");
        error.status =409;
        throw error;

    }

    return await createCoach(data);

};