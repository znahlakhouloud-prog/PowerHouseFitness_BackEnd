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
        .withMessage("Valid payment date is required"),

    body("type")
        .isIn([
            "cash",
            "card",
            "transfer"
        ])
        .withMessage(
            "Payment type must be cash, card or transfer"
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