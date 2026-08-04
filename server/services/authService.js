import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
    createUser,
    getUserByEmail
} from "../models/user.js";

// REGISTER
export const registerService = async (userData) => {

    const users = await getUserByEmail(userData.email);

    if (users.length > 0) {
        throw new Error("EMAIL_ALREADY_EXISTS");
    }

    const hashedPassword = await bcrypt.hash(
        userData.password,
        10
    );

    const newUser = {
        ...userData,
        password: hashedPassword
    };

    return await createUser(newUser);
};

// LOGIN
export const loginService = async (email, password) => {

    const users = await getUserByEmail(email);

    if (users.length === 0) {
        throw new Error("INVALID_CREDENTIALS");
    }

    const user = users[0];

    const isPasswordCorrect = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordCorrect) {
        throw new Error("INVALID_CREDENTIALS");
    }

    const token = jwt.sign(
        {
            id: user.id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h"
        }
    );

    return {
        token,
        user: {
            id: user.id,
            user_name: user.user_name,
            age: user.age,
            email: user.email,
            role: user.role,
            must_change_password: user.must_change_password
        }
    };
};