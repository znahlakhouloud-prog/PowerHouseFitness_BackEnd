import { body, validationResult } from "express-validator";

export const validateOwnProfile = [

    body("user_name")
        .notEmpty()
        .withMessage("User name is required"),

    body("age")
        .isInt({ min: 1 })
        .withMessage("Age must be a positive integer"),

    body("email")
        .isEmail()
        .withMessage("Invalid email"),

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
