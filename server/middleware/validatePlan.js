import { body, validationResult } from "express-validator";

export const validatePlan = [

    body("name")
        .notEmpty()
        .withMessage("Plan name is required"),

    body("type")
        .notEmpty()
        .withMessage("Plan type is required"),

    body("duration_days")
        .isInt({ min: 1 })
        .withMessage("Duration in days must be greater than 0"),

    body("options")
        .isArray({ min: 1 })
        .withMessage("At least one session/price option is required"),

    body("options.*.nbr_sessions")
        .isInt({ min: 1 })
        .withMessage("Number of sessions must be greater than 0"),

    body("options.*.price")
        .isFloat({ min: 0 })
        .withMessage("Price must be greater than or equal to 0"),

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
