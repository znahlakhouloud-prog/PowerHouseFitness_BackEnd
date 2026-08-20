import { body, validationResult } from "express-validator";

/*
 * Cash is the only payment method a member can submit - card and bank
 * transfer (and the receipt upload that only bank transfer needed)
 * have been removed entirely. `type` is optional (the service layer
 * hardcodes "cash" regardless of what's sent), but if a caller does
 * send it, it must explicitly be "cash" - this rejects anything else
 * loudly instead of silently ignoring it.
 */
export const validateMemberPayment = [

    body("id_membership")
        .isInt({ min: 1 })
        .withMessage("Valid membership ID is required"),

    body("amount")
        .isFloat({ min: 0.01 })
        .withMessage("Amount must be greater than 0"),

    body("type")
        .optional()
        .equals("cash")
        .withMessage("Cash is the only payment method accepted"),

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
