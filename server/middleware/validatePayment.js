import { body, validationResult } from "express-validator";

/*
 * Cash is the only payment method the application accepts - the
 * service layer always hardcodes type to "cash" regardless of what's
 * sent. `type` is optional here, but if a caller does send it, it
 * must explicitly be "cash" - this rejects anything else loudly
 * instead of silently ignoring it.
 */
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
