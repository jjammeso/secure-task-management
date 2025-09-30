import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./auth.middleware";
import { Permission } from "@myorg/auth";
import { AppDataSource } from "../db/database";
import { AuditLog } from "../entities";

export const auditLogger = (action: Permission, resource: string) => {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const orginalSend = res.send;

        res.send = function (data) {
            if (res.statusCode < 400 && req.user) {
                const auditRepository = AppDataSource.getRepository(AuditLog);

                auditRepository.save({
                    userId: req.user.id,
                    action,
                    resource,
                    resourceId: req.params.id || 'N/A',
                    ipAddress: req.ip
                }).catch(err => console.error('Audit logging failed', err));
            }

            return orginalSend.call(this, data);
        }
    }
}