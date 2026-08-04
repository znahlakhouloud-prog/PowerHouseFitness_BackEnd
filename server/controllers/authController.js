import {
    registerService,
    loginService
} from "../services/authService.js";

import {
    changePasswordService
} from "../services/userService.js";

// REGISTER
export const register = async (req, res) => {

    try {

        const result = await registerService(req.body);

        res.status(201).json({
            message: "User created successfully",
            id: result.insertId
        });

    } catch (error) {

        if (error.message === "EMAIL_ALREADY_EXISTS") {
            return res.status(409).json({
                message: "Email already exists"
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