import api from "../../services/api";


// GET ALL MEMBERSHIPS
export const getMemberships = async () => {

    const response = await api.get(
        "/memberships"
    );

    return response.data;
};
