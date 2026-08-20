import { body, validationResult } from "express-validator";

/*
 * Cash is the only payment method a member can submit - card and bank
 * transfer (and the receipt upload that only bank transfer needed)
 * have been removed entirely, so this only ever validates the
 * membership and the amount.
 */
export const validateMemberPayment = [

    body("id_membership")
        .isInt({ min: 1 })
        .withMessage("Valid membership ID is required"),

    body("amount")
        .isFloat({ min: 0.01 })
        .withMessage("Amount must be greater than 0"),

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
