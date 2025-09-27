import { error } from "console";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';


interface AuthenticatedRequest extends Request {
    user?: JwtPayload | string;
}

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    const token = authHeader && authHeader.startsWith('Bearer ') ?
        authHeader.slice(7) : null;

    if (!token) return res.status(401).json({
        success: false,
        error: "Access token required"
    });

    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
        console.error("JWT_SECRET is not defined in the environment variables");
        return res.status(500).json({
            success: false,
            errror: "Internal server error"
        })
    };

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({success:false, error: "Invalid or expired token"});
    }
}