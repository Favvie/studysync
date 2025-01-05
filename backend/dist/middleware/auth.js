import jwt from 'jsonwebtoken'; //jwt exports default commonjs module, avoid named exports
export const authorizationMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const privateKey = process.env.PRIVATE_KEY;
    const idFromParam = req.params.id;
    const idFromBody = req.body.id;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }
    const tokenString = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(tokenString, privateKey);
        if (!decoded) {
            res.status(401).json({ success: false, msg: "You are not Authorized!" });
            return;
        }
        const id = decoded.sub;
        //how do I check if the right person is accessing their information:
        if ((id !== idFromParam) && (id !== idFromBody)) {
            res.status(401).json({ success: false, msg: "You are not Authorized!" });
            return;
        }
        next();
    }
    catch (error) {
        return res.status(401).json({ success: false, msg: (error instanceof Error) ? error.message : 'An error occurred' });
    }
};
