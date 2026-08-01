import { body, validationResult } from "express-validator";

export const validateNotification = [

    body("id_user")
        .isInt({ min: 1 })
        .withMessage("Valid user ID is required"),

    body("title")
        .notEmpty()
        .withMessage("Title is required"),

    body("descrip")
        .notEmpty()
        .withMessage("Description is required"),

    body("type")
        .notEmpty()
        .withMessage("Type is required"),

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