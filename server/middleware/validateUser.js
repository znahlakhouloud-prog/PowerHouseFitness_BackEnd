import { body, validationResult } from "express-validator";

export const validateUser = [

    body("user_name")
        .notEmpty()
        .withMessage("User name is required"),

    body("birth_date")
        .notEmpty()
        .withMessage("Birth date is required")
        .isISO8601()
        .withMessage("Birth date must be a valid date (YYYY-MM-DD)")
        .custom((value) => {

            if (new Date(value) > new Date()) {
                throw new Error("Birth date cannot be in the future");
            }

            return true;

        }),

    body("email")
        .isEmail()
        .withMessage("Invalid email address"),

    body("role")
        .isIn([
            "receptionist",
            "employee",
            "coach",
            "member"
        ])
        .withMessage("Invalid role"),

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