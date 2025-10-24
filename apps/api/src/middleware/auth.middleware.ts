import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { Permission, rbacService } from '@myorg/auth';
import { Role } from "@myorg/data";

export interface JwtUserPayload {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;     // ✅ Enum instead of string
  organizationId: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
    user?: JwtUserPayload
}

export const authenticateJWT = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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
        const decoded = jwt.verify(token, JWT_SECRET) as JwtUserPayload;

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ success: false, error: "Invalid or expired token" });
    }
}

export const requirePermission = (permission: Permission) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Not authenticated'
            });
        }

        if (!rbacService.hasPermission(req.user.role, permission)) {
            return res.status(403).json({
                success: false,
                error: "Insufficient permissioin"
            })
        }
        next();
    }
}
