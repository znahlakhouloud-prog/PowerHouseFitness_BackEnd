import { body, validationResult } from "express-validator";

export const validateCoach = [

    body("id_user")
        .isInt({ min: 1 })
        .withMessage("Valid user ID is required"),

    body("state")
        .isIn([
            "available",
            "busy",
            "vacation"
        ])
        .withMessage(
            "State must be available, busy or vacation"
        ),

    body("nbr_hr")
        .isInt({ min: 0 })
        .withMessage("Number of hours must be greater than or equal to 0"),

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