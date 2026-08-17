import {
    getAllPlanRows,
    getPlanRowById,
    insertPlanRow,
    deletePlanRowsByNameType
} from "../models/plan.js";

/*
 * The "plan" table is flat - one row per session/price option,
 * sharing name+type across rows that belong to the same plan.
 * Group those rows back into {id, name, type, options: [...]}
 * so the API/frontend keep seeing one object per plan.
 */
const groupPlanRows = (rows) => {

    const plansByKey = new Map();

    for (const row of rows) {

        const key = `${row.name}::${row.type}`;

        if (!plansByKey.has(key)) {

            plansByKey.set(key, {
                id: row.id,
                name: row.name,
                type: row.type,
                options: []
            });

        }

        plansByKey.get(key).options.push({
            id: row.id,
            nbr_sessions: row.nbr_sessions,
            price: row.price
        });

    }

    return Array.from(plansByKey.values());

};

// GET ALL PLANS
export const fetchPlansService = async () => {

    const rows = await getAllPlanRows();

    return groupPlanRows(rows);

};

// CREATE PLAN
export const createPlanService = async (data) => {

    for (const opt of data.options) {

        await insertPlanRow({
            name: data.name,
            type: data.type,
            nbr_sessions: Number(opt.nbr_sessions),
            price: Number(opt.price)
        });

    }

    const rows = await getAllPlanRows();

    return groupPlanRows(rows).find(
        (plan) =>
            plan.name === data.name &&
            plan.type === data.type
    );

};

// UPDATE PLAN
export const updatePlanService = async (id, data) => {

    const existingRows = await getPlanRowById(id);

    if (existingRows.length === 0) {

        const error = new Error("Plan not found");
        error.status = 404;
        throw error;

    }

    const { name: oldName, type: oldType } = existingRows[0];

    // Replace the whole group: delete the old rows, insert the new set
    await deletePlanRowsByNameType(oldName, oldType);

    for (const opt of data.options) {

        await insertPlanRow({
            name: data.name,
            type: data.type,
            nbr_sessions: Number(opt.nbr_sessions),
            price: Number(opt.price)
        });

    }

    const rows = await getAllPlanRows();

    return groupPlanRows(rows).find(
        (plan) =>
            plan.name === data.name &&
            plan.type === data.type
    );

};

// DELETE PLAN
export const deletePlanService = async (id) => {

    const existingRows = await getPlanRowById(id);

    if (existingRows.length === 0) {

        const error = new Error("Plan not found");
        error.status = 404;
        throw error;

    }

    const { name, type } = existingRows[0];

    await deletePlanRowsByNameType(name, type);

};
