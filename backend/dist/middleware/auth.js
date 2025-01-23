import jwt from "jsonwebtoken";
export const authorizationMiddleware = (req, res, next) => {
    for (const v of ["PRIVATE_KEY"]) {
        if (!process.env[v]) {
            res.status(500).json({ error: `${v} not set in environment` });
            return;
        }
    }
    const authHeader = req.headers.authorization;
    const refreshToken = req.cookies.refreshToken;
    if (!authHeader || !authHeader.startsWith("Bearer ") || !refreshToken) {
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
