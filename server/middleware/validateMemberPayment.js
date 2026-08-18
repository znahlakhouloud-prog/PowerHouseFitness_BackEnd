import { body, validationResult } from "express-validator";

export const validateMemberPayment = [

    body("id_membership")
        .isInt({ min: 1 })
        .withMessage("Valid membership ID is required"),

    body("amount")
        .isFloat({ min: 0.01 })
        .withMessage("Amount must be greater than 0"),

    body("type")
        .isIn(["card", "transfer"])
        .withMessage("Payment type must be card or transfer"),

    (req, res, next) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            return res.status(400).json({
                errors: errors.array()
            });

        }

        if (req.body.type === "transfer" && !req.file) {

            return res.status(400).json({
                errors: [{
                    msg: "A receipt file is required for bank transfer payments"
                }]
            });

        }

        next();

    }

];
