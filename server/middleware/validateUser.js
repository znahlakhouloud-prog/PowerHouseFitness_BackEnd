import { body, validationResult } from "express-validator";

export const validateUser = [

    body("user_name")
        .notEmpty()
        .withMessage("User name is required"),

    body("birth_date")
        .notEmpty()
        .withMessage("Birth date is required")
        .isISO8601()
        .withMessage("Birth date must be a valid date (YYYY-MM-DD)")
        .custom((value) => {

            if (new Date(value) > new Date()) {
                throw new Error("Birth date cannot be in the future");
            }

            return true;

        }),

    body("email")
        .isEmail()
        .withMessage("Invalid email address"),

    body("role")
        .isIn([
            "receptionist",
            "employee",
            "coach",
            "member"
        ])
        .withMessage("Invalid role"),

    /*
     * membership/payment are optional - only present when registering
     * a member with a plan attached. Only their shape is checked here;
     * the actual plan/price lookup and financial validation happens in
     * registerService, which never trusts a client-supplied price.
     */
    body("membership")
        .optional()
        .isObject()
        .withMessage("Membership must be an object"),

    body("membership.id_plan")
        .if(body("membership").exists())
        .isInt({ min: 1 })
        .withMessage("A valid membership plan is required"),

    body("membership.start_date")
        .if(body("membership").exists())
        .isISO8601()
        .withMessage("A valid membership start date is required"),

    body("membership.duration_promo")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Promotion duration must be 0 or greater"),

    body("payment")
        .optional()
        .isObject()
        .withMessage("Payment must be an object"),

    // Cash is the only payment method - the service layer hardcodes
    // type to "cash" regardless of what's sent, so there is nothing
    // else about the payment method to validate here.
    body("payment.amount")
        .if(body("payment").exists())
        .isFloat({ min: 0.01 })
        .withMessage("Payment amount must be greater than 0"),

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