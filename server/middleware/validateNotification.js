import { body, validationResult } from "express-validator";

export const validateNotification = [

    body("id_user")
        .isInt({ min: 1 })
        .withMessage("Valid user ID is required"),

    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ max: 45 })
        .withMessage("Title must not exceed 45 characters"),

    body("descrip")
        .trim()
        .notEmpty()
        .withMessage("Description is required")
        .isLength({ max: 225 })
        .withMessage("Description must not exceed 225 characters"),

    body("type")
        .isIn([
            "membership",
            "payment",
            "attendance",
            "general"
        ])
        .withMessage(
            "Type must be membership, payment, attendance or general"
        ),

    (req, res, next) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            return res.status(400).json({
                errors: errors.array()
            });

        }

        next();

    }

];