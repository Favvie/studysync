import Joi from "joi";
export const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({
                success: false,
                errors: error.details.map(({ message, path }) => ({
                    field: path.join("."),
                    message,
                })),
            });
        }
        next();
    };
};
export const schemas = {
    signup: Joi.object({
        name: Joi.string().trim().min(3).messages({
            "string.base": "Name must be a string",
            "string.empty": "Name is required",
            "string.min": "Name must be at least 3 characters long",
        }),
        email: Joi.string().email().required().messages({
            "string.email": "Invalid email address",
            "string.empty": "Email is required",
        }),
        password: Joi.string().min(8).required().messages({
            "string.min": "Password must be at least 8 characters long",
            "string.empty": "Password is required",
        }),
    }),
    signin: Joi.object({
        email: Joi.string().email().required().messages({
            "string.email": "Invalid email address",
            "string.empty": "Email is required",
        }),
        password: Joi.string().required().messages({
            "string.empty": "Password is required",
        }),
    }),
    patchUser: Joi.object({
        name: Joi.string().trim().min(3).messages({
            "string.base": "Name must be a string",
            "string.min": "Name must be at least 3 characters long",
        }),
        email: Joi.string().email().messages({
            "string.email": "Invalid email address",
        }),
        password: Joi.string().min(8).messages({
            "string.min": "Password must be at least 8 characters long",
        }),
    }),
    forgotPassword: Joi.object({
        email: Joi.string().email().required().messages({
            "string.email": "Invalid email address",
            "string.empty": "Email is required",
        }),
    }),
    resetPassword: Joi.object({
        password: Joi.string().min(8).required().messages({
            "string.min": "Password must be at least 8 characters long",
            "string.empty": "Password is required",
        }),
    }),
};
