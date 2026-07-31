import { body, validationResult } from "express-validator";

export const validatePayment = [

    body("id_membership")
        .isInt({ min: 1 })
        .withMessage("Valid membership ID is required"),

    body("amount")
        .isFloat({ min: 0.01 })
        .withMessage("Amount must be greater than 0"),

    body("p_date")
        .isISO8601()
        .withMessage("Invalid payment date"),

    body("type")
        .notEmpty()
        .withMessage("Payment type is required"),

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