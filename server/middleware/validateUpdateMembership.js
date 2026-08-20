import { body, validationResult } from "express-validator";

/*
 * name/duration/price/type are intentionally not accepted here -
 * they are never trusted from the client. The caller only picks a
 * real plan (id_plan); updateMembershipService looks that plan up
 * from the database and derives all financial fields from it.
 */
export const validateUpdateMembership = [

    body("id_plan")
        .isInt({ min: 1 })
        .withMessage("A valid membership plan is required"),

    body("start_date")
        .isISO8601()
        .withMessage("Invalid start date"),

    body("duration_promo")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Promotion duration must be 0 or greater"),

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
