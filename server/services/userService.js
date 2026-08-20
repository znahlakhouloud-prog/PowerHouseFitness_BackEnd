import bcrypt from "bcrypt";

import {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    changePassword
} from "../models/user.js";

// GET ALL USERS
export const fetchUsersService = async (requesterRole) => {

    const users = await getAllUsers();

    // Receptionists only ever see member accounts - enforced
    // here, not just hidden in the UI, since this list can also
    // include admins/coaches/employees.
    if (requesterRole === "receptionist") {

        return users.filter(
            (user) => user.role === "member"
        );

    }

    return users;

};

// GET USER BY ID
export const fetchUserByIdService = async (id) => {

    const users = await getUserById(id);

    if (users.length === 0) {
        throw new Error("USER_NOT_FOUND");
    }

  const user = users[0];

return {
    id: user.id,
    user_name: user.user_name,
    birth_date: user.birth_date,
    email: user.email,
    role: user.role,
    must_change_password: user.must_change_password
};
};

// UPDATE USER (admin editing another user's account - email and
// birth_date are authentication/identity data and are never taken
// from the request body, only ever carried over from the existing
// record, exactly like role already was for self-service updates)
export const updateUserService = async (id, data) => {

    const users = await getUserById(id);

    if (users.length === 0) {
        throw new Error("USER_NOT_FOUND");
    }

    await updateUser(id, {
        user_name: data.user_name,
        birth_date: users[0].birth_date,
        email: users[0].email,
        role: data.role
    });

};

// UPDATE OWN PROFILE (member self-service - role, email and
// birth_date are never taken from the request, only ever carried
// over from the existing record)
export const updateOwnProfileService = async (id, data) => {

    const users = await getUserById(id);

    if (users.length === 0) {
        throw new Error("USER_NOT_FOUND");
    }

    await updateUser(id, {
        user_name: data.user_name,
        birth_date: users[0].birth_date,
        email: users[0].email,
        role: users[0].role
    });

};

// DELETE USER
export const deleteUserService = async (id) => {

    const users = await getUserById(id);

    if (users.length === 0) {
        throw new Error("USER_NOT_FOUND");
    }

    await deleteUser(id);

};

// CHANGE PASSWORD
export const changePasswordService = async (
    id,
    oldPassword,
    newPassword
) => {
    const users = await getUserById(id);

    if (users.length === 0) {
        throw new Error("USER_NOT_FOUND");
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(
        oldPassword,
        user.password
    );

    if (!isMatch) {
        throw new Error("INVALID_PASSWORD");
    }

    if (oldPassword === newPassword) {
        throw new Error("SAME_PASSWORD");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await changePassword(id, hashedPassword);

};