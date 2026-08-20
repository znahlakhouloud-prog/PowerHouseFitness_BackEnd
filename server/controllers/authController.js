import {
    registerService,
    loginService,
    forgotPasswordService,
    resetPasswordService
} from "../services/authService.js";

import {
    changePasswordService
} from "../services/userService.js";

// REGISTER
export const register = async (req, res) => {

    try {

        const {
            result,
            temporaryPassword,
            membership,
            payment
        } = await registerService(req.body, req.user.role);

        res.status(201).json({
            message: "User created successfully",
            id: result.insertId,
            temporaryPassword,
            membership: membership || null,
            payment: payment || null
        });

    } catch (error) {

        if (error.message === "EMAIL_ALREADY_EXISTS") {
            return res.status(409).json({
                message: "Email already exists"
            });
        }

        if (
            error.message ===
            "REGISTRATION_NOT_ALLOWED"
        ) {

            return res.status(403).json({
                message:
                    "You are not allowed to create this role"
            });
        }

        if (error.message === "MEMBERSHIP_ONLY_FOR_MEMBERS") {

            return res.status(400).json({
                message: "Only member accounts can have a membership"
            });

        }

        if (error.message === "PLAN_NOT_FOUND") {

            return res.status(404).json({
                message: "Membership plan not found"
            });

        }

        if (error.message === "INVALID_PAYMENT_TYPE") {

            return res.status(400).json({
                message: "Payment type must be cash, card or transfer"
            });

        }

        if (error.message === "INVALID_PAYMENT_AMOUNT") {

            return res.status(400).json({
                message: "Payment amount must be greater than 0"
            });

        }

        if (error.message === "PAYMENT_EXCEEDS_PRICE") {

            return res.status(409).json({
                message: "Payment amount cannot exceed the membership price"
            });

        }

        res.status(500).json({
            message: error.message
        });

    }

};

// LOGIN
export const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        const result = await loginService(
            email,
            password
        );

        res.status(200).json({
            message: "Login successful",
            token: result.token,
            user: result.user
        });

    } catch (error) {

        if (error.message === "INVALID_CREDENTIALS") {

            return res.status(401).json({
                message: "Invalid email or password"
            });

        }

        res.status(500).json({
            message: error.message
        });

    }

};

// CHANGE PASSWORD
export const changePassword = async (req, res) => {

    try {

        const id = req.user.id;

        const {
            oldPassword,
            newPassword
        } = req.body;

        await changePasswordService(
            id,
            oldPassword,
            newPassword
        );

        res.status(200).json({
            message: "Password changed successfully"
        });

    } catch (error) {

        if (error.message === "USER_NOT_FOUND") {

            return res.status(404).json({
                message: "User not found"
            });

        }

        if (error.message === "INVALID_PASSWORD") {

            return res.status(401).json({
                message: "Old password is incorrect"
            });

        }

        if (error.message === "SAME_PASSWORD") {

            return res.status(400).json({
                message: "New password must be different from the old password"
            });

        }

        res.status(500).json({
            message: error.message
        });

    }

};

// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {

    try {

        const { email } = req.body;

        await forgotPasswordService(email);

        return res.status(200).json({
            message:
                "If the email exists, a reset link has been sent"
        });

    } catch (error) {

        console.error(
            "FORGOT PASSWORD ERROR:",
            error
        );

        return res.status(500).json({
            message:
                "Unable to process password reset request"
        });

    }
};

export const resetPassword = async (req, res) => {

    try {

        const {
            token,
            newPassword
        } = req.body;


        await resetPasswordService(
            token,
            newPassword
        );


        return res.status(200).json({

            message:
                "Password reset successfully"

        });

    } catch (error) {

        console.error(
            "RESET PASSWORD ERROR:",
            error
        );


        if (
            error.message ===
            "INVALID_OR_EXPIRED_TOKEN"
        ) {

            return res.status(400).json({

                message:
                    "Invalid or expired reset token"

            });
        }


        return res.status(500).json({

            message:
                "Unable to reset password"

        });
    }
};