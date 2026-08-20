import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
    createUser,
    getUserByEmail,
     saveResetToken,
    getUserByResetToken,
    clearResetToken,
    updatePassword
} from "../models/user.js";
import {
    sendPasswordResetEmail
} from "./emailService.js";

import { notifyAdmins } from "./notificationService.js";

// REGISTER
export const registerService = async (userData,creatorRole) => {

    // 1.check email
    const users = await getUserByEmail(userData.email);

    if (users.length > 0) {
        throw new Error("EMAIL_ALREADY_EXISTS");
    }

    // 2.check registration permissions
    if(
        creatorRole ==="receptionist" && 
        ![
            "coach",
            "member"
        ].includes(userData.role)
    ) {
        throw new Error (
            "REGISTRATION_NOT_ALLOWED"
        );
    }

     if (
        creatorRole === "admin" &&
        ![
            "receptionist",
            "employee",
            "coach",
            "member"
        ].includes(userData.role)
    ) {

        throw new Error(
            "REGISTRATION_NOT_ALLOWED"
        );

    }

     // 3. Generate temporary password
    const temporaryPassword =
        crypto.randomBytes(6).toString("base64url");


     // 4. Hash temporary password
    const hashedPassword = 
    await bcrypt.hash(
        temporaryPassword,
        10
    );

    // 5. Create user
    const newUser = {
        user_name: userData.user_name,
        birth_date: userData.birth_date,
        email: userData.email,
        password: hashedPassword,
        role: userData.role
    };
    const result = await createUser(newUser);

    // 6. Notify admins - non-fatal, registration must still succeed
    // even if this fails for some reason
    try {

        await notifyAdmins({
            title: "New User Registered",
            descrip: `${userData.user_name} joined as ${userData.role}`,
            type: "registration"
        });

    } catch (notifyError) {

        console.error("NOTIFY ADMINS ERROR (registration):", notifyError);

    }

     // 7. Return result + temporary password
    return {
        result,
        temporaryPassword
    };

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
            birth_date: user.birth_date,
            email: user.email,
            role: user.role,
            must_change_password: user.must_change_password
        }
    };
};

// FORGOT PASSWORD
export const forgotPasswordService = async (email) => {

    const users = await getUserByEmail(email);

    /*
     * We don't reveal whether the email exists.
     */
    if (users.length === 0) {

        return null;
    }

    const user = users[0];

    // Generate random reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token before storing it
    const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    // Token valid for 15 minutes
    const expires = new Date(
        Date.now() + 15 * 60 * 1000
    );

    await saveResetToken(
        user.id,
        hashedToken,
        expires
    );

    await sendPasswordResetEmail(
        user.email,
        resetToken
    );

    return true;
};

export const resetPasswordService = async (
    resetToken,
    newPassword
) => {

    const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    const users = await getUserByResetToken(
        hashedToken
    );

    if (users.length === 0) {

        throw new Error("INVALID_OR_EXPIRED_TOKEN");
    }

    const user = users[0];

    const hashedPassword = await bcrypt.hash(
        newPassword,
        10
    );

    await updatePassword(user.id, hashedPassword);

    await clearResetToken(user.id);

    return true;
};