import {
    fetchUsersService,
    fetchUserByIdService,
    updateUserService,
    deleteUserService
} from "../services/userService.js";

// GET ALL USERS
export const fetchUsers = async (req, res) => {

    try {

        const users = await fetchUsersService(req.user.role);

        res.status(200).json(users);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// GET USER BY ID
export const fetchUserById = async (req, res) => {

    try {

        const user = await fetchUserByIdService(
            req.params.id
        );

        res.status(200).json(user);

    } catch (error) {

        if (error.message === "USER_NOT_FOUND") {

            return res.status(404).json({
                message: "User not found"
            });

        }

        res.status(500).json({
            message: error.message
        });

    }

};

// UPDATE USER
export const editUser = async (req, res) => {

    try {

        await updateUserService(
            req.params.id,
            req.body
        );

        res.status(200).json({
            message: "User updated successfully"
        });

    } catch (error) {

        if (error.message === "USER_NOT_FOUND") {

            return res.status(404).json({
                message: "User not found"
            });

        }

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

// DELETE USER
export const removeUser = async (req, res) => {

    try {

        await deleteUserService(
            req.params.id
        );

        res.status(200).json({
            message: "User deleted successfully"
        });

    } catch (error) {

        if (error.message === "USER_NOT_FOUND") {

            return res.status(404).json({
                message: "User not found"
            });

        }

        res.status(500).json({
            message: error.message
        });

    }

};