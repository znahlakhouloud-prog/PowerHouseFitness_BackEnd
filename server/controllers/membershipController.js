import {
    fetchMembershipsService,
    fetchMembershipByIdService,
    createMembershipService,
    updateMembershipService,
    checkMembershipAccessService,
    renewMembershipService
} from "../services/membershipService.js";

// GET ALL MEMBERSHIPS
export const fetchMemberships = async (req, res) => {

    try {

        const memberships =
            await fetchMembershipsService();

        res.status(200).json(memberships);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// GET MEMBERSHIP BY ID
export const fetchMembershipById = async (req, res) => {

    try {

        const membership =
            await fetchMembershipByIdService(
                req.params.id
            );

        res.status(200).json(membership);

    } catch (error) {

        if (error.message === "MEMBERSHIP_NOT_FOUND") {

            return res.status(404).json({
                message: "Membership not found"
            });

        }

        res.status(500).json({
            message: error.message
        });

    }

};

// CREATE MEMBERSHIP
export const addMembership = async (req, res) => {

    try {

        // A member can only ever subscribe themselves - never trust
        // an id_user from the request body for that role.
        const data = req.user.role === "member"
            ? { ...req.body, id_user: req.user.id }
            : req.body;

        const result =
            await createMembershipService(data);

        res.status(201).json({
            message: "Membership created successfully",
            id: result.insertId
        });

    } catch (error) {

        if (error.message === "USER_NOT_FOUND") {

            return res.status(404).json({
                message: "User not found"
            });

        }

        if (error.message === "ACTIVE_MEMBERSHIP_EXISTS") {

            return res.status(409).json({
                message: "User already has an active membership"
            });

        }

        res.status(500).json({
            message: error.message
        });

    }

};

// UPDATE MEMBERSHIP
export const editMembership = async (req, res) => {

    try {

        await updateMembershipService(
            req.params.id,
            req.body
        );

        res.status(200).json({
            message: "Membership updated successfully"
        });

    } catch (error) {

        if (error.message === "MEMBERSHIP_NOT_FOUND") {

            return res.status(404).json({
                message: "Membership not found"
            });

        }

        res.status(500).json({
            message: error.message
        });

    }

};

// CHECK MEMBERSHIP ACCESS
export const checkMembershipAccess = async (req, res) => {

    try {

        const membership =
            await checkMembershipAccessService(
                req.params.id_user
            );

        res.status(200).json({
            allowed: true,
            message: "Access granted",
            membership
        });

    } catch (error) {

        if (error.message === "NO_ACTIVE_MEMBERSHIP") {

            return res.status(404).json({
                allowed: false,
                message: "No active membership found"
            });

        }

        res.status(500).json({
            message: error.message
        });

    }

};

// RENEW MEMBERSHIP
export const renewMembership = async (req, res) => {

    try {

        const result =
            await renewMembershipService(req.body);

        res.status(201).json({
            message: "Membership renewed successfully",
            id: result.insertId
        });

    } catch (error) {

        if (error.message === "USER_NOT_FOUND") {

            return res.status(404).json({
                message: "User not found"
            });

        }

        if (error.message === "ACTIVE_MEMBERSHIP_EXISTS") {

            return res.status(409).json({
                message: "User already has an active membership"
            });

        }

        res.status(500).json({
            message: error.message
        });

    }

};