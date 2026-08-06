import { body, validationResult } from "express-validator";

export const validateEquipment = [

    body("maint_date")
        .isISO8601()
        .withMessage("Valid maintenance date is required"),

    body("state")
        .isIn([
            "available",
            "maintenance",
            "broken"
        ])
        .withMessage(
            "State must be available, maintenance or broken"
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