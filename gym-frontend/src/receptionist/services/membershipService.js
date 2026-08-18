import api from "../../services/api";


// GET ALL MEMBERSHIPS
export const getMemberships = async () => {

    const response = await api.get(
        "/memberships"
    );

    return response.data;
};


// CREATE MEMBERSHIP
export const createMembership = async (
    data
) => {

    const response = await api.post(
        "/memberships",
        data
    );

    return response.data;
};


// UPDATE MEMBERSHIP
export const updateMembership = async (
    id,
    data
) => {

    const response = await api.put(
        `/memberships/${id}`,
        data
    );

    return response.data;
};


// CHECK ACTIVE MEMBERSHIP FOR A USER
export const checkMembershipAccess = async (
    id_user
) => {

    const response = await api.get(
        `/memberships/check/${id_user}`
    );

    return response.data;
};
