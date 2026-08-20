import { body, validationResult } from "express-validator";

/*
 * email and birth_date are authentication/identity data and are
 * intentionally not validated here - they are never accepted from
 * the request body at all (see updateOwnProfileService), only
 * user_name can be changed through this endpoint.
 */
export const validateOwnProfile = [

    body("user_name")
        .notEmpty()
        .withMessage("User name is required"),

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
