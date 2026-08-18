import { body, validationResult } from "express-validator";

export const validateEquipmentReport = [

    body("equipment_name")
        .notEmpty()
        .withMessage("Equipment name is required"),

    body("description")
        .optional({ checkFalsy: true })
        .isString(),

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
