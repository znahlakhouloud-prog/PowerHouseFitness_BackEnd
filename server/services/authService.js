import bcrypt from "bcrypt";
import { createUser, getUserByEmail } from "../models/user.js";

export const registerService = async (userData) => {

    // 1. Email already exists?
    const users = await getUserByEmail(userData.email);

    if (users.length > 0) {
        throw new Error("EMAIL_ALREADY_EXISTS");
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // 3. Create user
    const newUser = {
        ...userData,
        password: hashedPassword
    };

    return await createUser(newUser);
};

export const loginService = async (email, password) => {

    // We'll do this later.

};