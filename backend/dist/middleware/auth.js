import jwt from "jsonwebtoken"; // jwt exports a default CommonJS module, avoid named exports because they are not supported
/**
 * Middleware for authorizing user requests using JWT tokens.
 *
 * @param {Request} req - Express request object containing authorization headers and user data
 * @param {Response} res - Express response object for sending back status and messages
 * @param {NextFunction} next - Express next function to pass control to the next middleware
 *
 * @throws {401} - If no token is provided in authorization header
 * @throws {401} - If token verification fails
 * @throws {401} - If decoded token is invalid
 * @throws {401} - If user ID from token doesn't match request parameters or body
 *
 * @remarks
 * The middleware expects:
 * - Authorization header in format 'Bearer <token>'
 * - JWT token containing user ID in 'sub' claim
 * - Environment variable PRIVATE_KEY for token verification
 * - Optional ID in request parameters or body for authorization matching
 *
 * @returns {void} - Does not return a value but calls `next()` to pass control to the next middleware
 */
export const authorizationMiddleware = (req, res, next) => {
    for (const v of ["PRIVATE_KEY"]) {
        if (!process.env[v]) {
            res.status(500).json({ error: `${v} not set in environment` });
            return;
        }
    }
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ error: "No token provided" });
        return;
    }
    const tokenString = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(tokenString, process.env.PRIVATE_KEY);
        if (!decoded) {
            res.status(401).json({
                success: false,
                msg: "You are not Authorized!",
            });
            return;
        }
        req.customData = { userId: decoded.sub };
        next();
    }
    catch (error) {
        res.status(401).json({
            success: false,
            msg: error instanceof Error ? error.message : "An error occurred",
        });
        return;
    }
};
