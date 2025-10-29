import {  Response, Router } from "express"
import { AuthenticatedRequest, authenticateJWT, requirePermission } from "../middleware/auth.middleware";
import { ApiResponse,  UserWithOrganization } from "@myorg/data";
import { Permission, rbacService } from "@myorg/auth";
import { AppDataSource } from "../db/database";
import { Organization, User } from "../entities";

const userRouter = Router();

userRouter.use(authenticateJWT);

userRouter.get('/', requirePermission(Permission.VIEW_USER), async(req:AuthenticatedRequest, res:Response<ApiResponse<{users:UserWithOrganization[], total:number}>>) => {
    
   try {
    const user = req.user!;

    const userRepo = AppDataSource.getRepository(User);
    const orgRepo = AppDataSource.getRepository(Organization);

    const allOrgs = await orgRepo.find();

    console.log({user})

    const accessibleOrgIds = rbacService.getAccessibleOrganizationIds(user.role, user.organizationId, allOrgs);

    accessibleOrgIds.forEach((d)=>{
        console.log('this is d',d);
    })

    const users = await userRepo.createQueryBuilder('user')
    .leftJoinAndSelect('user.organization', 'organization')
    .where('user.organizationId IN (:...orgIds)', {orgIds: accessibleOrgIds})
    .select([
        'user.id',
        'user.email',
        'user.firstName',
        'user.lastName',
        'user.role',
        'organization.id',
        'organization.name'
    ]).orderBy('user.firstName', 'ASC').getMany();

    res.json({
        success:true,
        data: {
            users,
            total:users.length
        }
    });
   } catch (error) {
    console.log(error);
    res.status(500).json({
        success:false,
        error: 'Internal server error'
    });
   }
});

export default userRouter;