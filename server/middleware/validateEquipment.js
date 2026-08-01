import { body, validationResult } from "express-validator";

export const validateEquipment = [

    body("maint_date")
        .isISO8601()
        .withMessage("Maintenance date is required"),

    body("state")
        .notEmpty()
        .withMessage("State is required"),

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