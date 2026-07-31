import { body, validationResult } from "express-validator";

export const validateCoach = [

    body("id_user")
        .isInt({ min: 1 })
        .withMessage("Valid user ID is required"),

    body("state")
        .notEmpty()
        .withMessage("State is required"),

    body("nbr_hr")
        .isInt({ min: 0 })
        .withMessage("Number of hours must be positive"),

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