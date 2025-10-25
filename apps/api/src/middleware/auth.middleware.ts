import { Request, Response, NextFunction } from "express";
import { Permission, rbacService, jwtService } from '@myorg/auth';
import { Role } from "@myorg/data";

export interface JwtUserPayload {
  userId: string;
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

    const token = jwtService.extractTokenFromHeader(authHeader);

    if (!token) return res.status(401).json({
        success: false,
        error: "Access token required"
    });

    try {
        const decoded = jwtService.verifyToken(token);
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
