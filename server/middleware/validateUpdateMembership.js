import { body, validationResult } from "express-validator";

export const validateUpdateMembership = [

    body("name")
        .notEmpty()
        .withMessage("Membership name is required"),

    body("duration")
        .isInt({ min: 1 })
        .withMessage("Duration must be greater than 0"),

    body("price")
        .isFloat({ min: 0 })
        .withMessage("Price must be greater than or equal to 0"),

    body("start_date")
        .isISO8601()
        .withMessage("Invalid start date"),

    body("duration_promo")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Promotion duration must be 0 or greater"),

    body("type")
        .notEmpty()
        .withMessage("Membership type is required"),

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
