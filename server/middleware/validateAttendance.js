import { body, validationResult } from "express-validator";

export const validateAttendance = [

    body("id_user")
        .isInt({ min: 1 })
        .withMessage("Valid user ID is required"),

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