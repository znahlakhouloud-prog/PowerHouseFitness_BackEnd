import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import db from "../config/database.js";

import {
    createUser,
    getUserByEmail,
     saveResetToken,
    getUserByResetToken,
    clearResetToken,
    updatePassword
} from "../models/user.js";
import { createMembership } from "../models/membership.js";
import { createPayment } from "../models/payment.js";
import { getPlanRowById } from "../models/plan.js";
import { buildMembershipDataFromPlan } from "./membershipService.js";
import {
    sendPasswordResetEmail
} from "./emailService.js";

import { notifyAdmins } from "./notificationService.js";

const PAYMENT_TYPES = ["cash", "card", "transfer"];

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

    const newUser = {
        user_name: userData.user_name,
        birth_date: userData.birth_date,
        email: userData.email,
        password: hashedPassword,
        role: userData.role
    };

    // No membership requested - plain registration, exactly as
    // before. Every non-member registration (and a member registered
    // with no plan yet) goes through this path.
    if (!userData.membership) {

        const result = await createUser(newUser);

        try {

            await notifyAdmins({
                title: "New User Registered",
                descrip: `${userData.user_name} joined as ${userData.role}`,
                type: "registration"
            });

        } catch (notifyError) {

            console.error("NOTIFY ADMINS ERROR (registration):", notifyError);

        }

        return {
            result,
            temporaryPassword
        };

    }

    // A membership was requested - only members have memberships.
    if (userData.role !== "member") {
        throw new Error("MEMBERSHIP_ONLY_FOR_MEMBERS");
    }

    // The plan and its price/duration are looked up from the
    // database here, before the transaction even opens - the
    // frontend's plan/price/duration are never trusted.
    const planRows = await getPlanRowById(userData.membership.id_plan);

    if (planRows.length === 0) {
        throw new Error("PLAN_NOT_FOUND");
    }

    const plan = planRows[0];

    let paymentAmount = null;

    if (userData.payment) {

        if (!PAYMENT_TYPES.includes(userData.payment.type)) {
            throw new Error("INVALID_PAYMENT_TYPE");
        }

        paymentAmount = Number(userData.payment.amount);

        if (!(paymentAmount > 0)) {
            throw new Error("INVALID_PAYMENT_AMOUNT");
        }

        if (paymentAmount > plan.price) {
            throw new Error("PAYMENT_EXCEEDS_PRICE");
        }

    }

    // User + membership + optional initial payment must all succeed
    // together, or none of them do.
    const conn = await db.getConnection();

    try {

        await conn.beginTransaction();

        const userResult = await createUser(newUser, conn);
        const userId = userResult.insertId;

        const membershipData = buildMembershipDataFromPlan(
            plan,
            { ...userData.membership, id_user: userId }
        );

        const membershipResult = await createMembership(
            membershipData,
            conn
        );

        const membershipId = membershipResult.insertId;

        let paymentResult = null;
        let paymentRecord = null;

        if (paymentAmount !== null) {

            paymentRecord = {
                id_membership: membershipId,
                p_date: new Date().toISOString().split("T")[0],
                amount: paymentAmount,
                type: userData.payment.type,
                rest: plan.price - paymentAmount,
                status: "approved",
                receipt_file: null
            };

            paymentResult = await createPayment(paymentRecord, conn);

        }

        await conn.commit();

        // Non-fatal, outside the transaction - a notification failure
        // must never roll back a successful registration.
        try {

            await notifyAdmins({
                title: "New User Registered",
                descrip: `${userData.user_name} joined as ${userData.role}`,
                type: "registration"
            });

        } catch (notifyError) {

            console.error("NOTIFY ADMINS ERROR (registration):", notifyError);

        }

        return {
            result: userResult,
            temporaryPassword,
            membership: {
                id: membershipId,
                ...membershipData
            },
            payment: paymentResult ? {
                id: paymentResult.insertId,
                ...paymentRecord
            } : null
        };

    } catch (error) {

        await conn.rollback();
        throw error;

    } finally {

        conn.release();

    }

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