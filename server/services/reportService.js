import {createReport,
        getTotalIncome,
        getNewMembers,
        getExpiredMemberships,
        getTopMembership } from "../models/report.js";

export const generateReportService = async ()=>{

    const report ={

        income:await getTotalIncome(),

        nbr_new_member:await getNewMembers(),

        nbr_expired_membership:await getExpiredMemberships(),

        top_membership:await getTopMembership(),

        nbr_attendance:0

    };

    return await createReport(report);

};