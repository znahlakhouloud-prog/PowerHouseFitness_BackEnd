import bcrypt from "bcrypt";

import {
    getAllUsers,
    getUserById,
    getUserByEmail,
    updateUser,
    deleteUser,
    changePassword
} from "../models/user.js";

// GET ALL USERS
export const fetchUsersService = async () => {

    return await getAllUsers();

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
    age: user.age,
    email: user.email,
    role: user.role,
    must_change_password: user.must_change_password
};
};

// UPDATE USER
export const updateUserService = async (id, data) => {

    const users = await getUserById(id);

    if (users.length === 0) {
        throw new Error("USER_NOT_FOUND");
    }

    // Check duplicate email
    const existingUsers = await getUserByEmail(data.email);

    if (
        existingUsers.length > 0 &&
        existingUsers[0].id !== Number(id)
    ) {
        throw new Error("EMAIL_ALREADY_EXISTS");
    }

    await updateUser(id, {
        user_name: data.user_name,
        age: data.age,
        email: data.email,
        role: data.role
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