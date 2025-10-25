import { Response, Router } from "express";
import { AuthenticatedRequest, authenticateJWT, requirePermission } from "../middleware/auth.middleware";
import { Permission, rbacService } from "@myorg/auth";
import { AppDataSource } from "../db/database";
import { AuditLog, Organization } from "../entities";

const auditRouter = Router();

auditRouter.use(authenticateJWT);
//View access logs
auditRouter.get('/', requirePermission(Permission.VIEW_AUDIT_LOG), async (req: AuthenticatedRequest, res: Response) => {
    try {
        const user = req.user;

        const {
            page = 1,
            limit = 50,
        } = req.query;

        const orgRepo = AppDataSource.getRepository(Organization);
        const allOrgs = await orgRepo.find();

        const accessibleOrgIds = rbacService.getAccessibleOrganizationIds(req.user!.role, req.user!.organizationId, allOrgs);

        if(!accessibleOrgIds){
            return res.status(500).json({
                success:false,
                error: "You do not have permission to view logs for any organization"
            })
        }

        const auditRepository = AppDataSource.getRepository(AuditLog);

        const query = auditRepository.createQueryBuilder('audit')
            .leftJoinAndSelect('audit.user', 'user')
            .where('user.organizationId IN (:...orgIds)', { orgIds: accessibleOrgIds });

        query.orderBy('audit.timestamp', 'DESC');

        const pageNum = Math.max(1, Number(page));
        const limitNum = Math.min(100, Math.max(1, Number(limit)));
        query.skip((pageNum - 1) * limitNum).take(limitNum);

        const [logs, total] = await query.getManyAndCount();

        res.json({
            success: true,
            data: {
                logs,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total,
                    pages: Math.ceil(total / limitNum),
                }
            }
        })
    } catch (error) {
        console.error('Get audit logs error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch audit logs'
        });
    }
})

export default auditRouter;