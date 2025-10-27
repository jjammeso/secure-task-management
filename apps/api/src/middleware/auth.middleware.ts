import { Request, Response, NextFunction } from "express";
import { Permission, rbacService, jwtService } from '@myorg/auth';
import { Role } from "@myorg/data";
import { AppDataSource } from "../db/database";
import { User } from "../entities";

export interface AuthenticatedRequest extends Request {
    user?: User
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

        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOne({
            where: { id: decoded.userId },
            relations: ['organization']
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'User not found'
            });
        }

        req.user = user;
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
