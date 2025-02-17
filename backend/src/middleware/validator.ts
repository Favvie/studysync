import { Request, Response, NextFunction } from "express";
import Joi, { ObjectSchema } from "joi";

/**
 * Middleware to validate incoming requests.
 * @param schema - Joi validation schema
 * @returns Middleware function to validate the request
 */
export const validateRequest = (schema: ObjectSchema) => {
    return (
        req: Request,
        res: Response,
        next: NextFunction
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): any => {
        // Validate the request body against the provided schema
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            // If validation fails, respond with a 400 status code and the validation errors
            return res.status(400).json({
                success: false,
                errors: error.details.map(({ message, path }) => ({
                    field: path.join("."),
                    message,
                })),
            });
        }
        // If validation passes, proceed to the next middleware
        next();
    };
};

/**
 * Validation schemas for different routes.
 */
export const schemas = {
    // Schema for signup route
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

    // Schema for signin route
    signin: Joi.object({
        email: Joi.string().email().required().messages({
            "string.email": "Invalid email address",
            "string.empty": "Email is required",
        }),
        password: Joi.string().required().messages({
            "string.empty": "Password is required",
        }),
    }),

    // Schema for patchUser route
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

    // Schema for forgotPassword route
    forgotPassword: Joi.object({
        email: Joi.string().email().required().messages({
            "string.email": "Invalid email address",
            "string.empty": "Email is required",
        }),
    }),

    // Schema for resetPassword route
    resetPassword: Joi.object({
        password: Joi.string().min(8).required().messages({
            "string.min": "Password must be at least 8 characters long",
            "string.empty": "Password is required",
        }),
    }),
};
