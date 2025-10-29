import { Response, Router } from "express";
import { AppDataSource } from "../db/database";
import { Organization, Task, User } from "../entities";
import { TaskStatus, CreateTaskDto, UpdateTaskDto } from '@myorg/data';
import { AuthenticatedRequest, authenticateJWT, requirePermission } from "../middleware/auth.middleware";
import { Permission, rbacService } from "@myorg/auth";
import { auditLogger } from "../middleware/audit.middleware";

const taskRouter = Router()
taskRouter.use(authenticateJWT);

//Create task
taskRouter.post('/', requirePermission(Permission.CREATE_TASK), auditLogger(Permission.CREATE_TASK, "Task"), async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { title, description, category, priority, dueDate, assignedToId }: CreateTaskDto = req.body;

        if (!title || !category) {
            return res.status(400).json({
                success: false,
                error: 'Title and category are required'
            });
        }

        const taskRepository = AppDataSource.getRepository(Task);
        const userRepository = AppDataSource.getRepository(User);

        let assignedUser = null;

        if (!assignedToId) {
            assignedUser = req.user;
        } else {
            assignedUser = await userRepository.findOne({
                where: { id: assignedToId }
            })
            if (!assignedUser)
                return res.status(400).json({
                    success: false,
                    error: 'Assigned user not found.'
                })
        }

        const orgRepo = AppDataSource.getRepository(Organization);
        const allOrgs: Organization[] = await orgRepo.find();

        if (!req.user?.organizationId) {
            return res.status(400).json({ success: false, error: 'User organization missing' });
        }

        if (!assignedUser?.organizationId) {
            return res.status(400).json({ success: false, error: 'Assigned user organization missing' });
        }

        if (!rbacService.canAccessOrganization(req.user.organizationId, assignedUser.organizationId, allOrgs)) {
            return res.status(403).json({
                success: false,
                error: 'Cannnot assign task to user from different organization'
            })
        }

        const task = taskRepository.create({
            title,
            description,
            category,
            priority: priority || 3,
            dueDate: dueDate ? new Date(dueDate) : undefined,
            assignedToId: assignedUser.id,
            createdById: req.user.id,
            organizationId: assignedUser?.organizationId || req.user.organizationId,
            status: TaskStatus.TODO
        })

        const savedTask = await taskRepository.save(task);

        res.status(201).json({
            success: true,
            data: savedTask
        })

    } catch (error) {
        console.error('Create task error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create task'
        });
    }
})

//List accessible tasks
taskRouter.get('/', requirePermission(Permission.READ_TASK), auditLogger(Permission.READ_TASK, "Task"), async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userOrgId = req.user!.organizationId;
        const query = req.query;

        const page = parseInt(query.page as string) || 1;
        const limit = Math.min(parseInt(query.limit as string) || 50, 100);
        const skip = (page - 1) * limit;

        const taskRepo = AppDataSource.getRepository(Task);
        const orgRepo = AppDataSource.getRepository(Organization);

        const allOrgs = await orgRepo.find();
        const accessibleOrgIds = rbacService.getAccessibleOrganizationIds(req.user!.role, userOrgId, allOrgs);

        const queryBuilder = taskRepo.createQueryBuilder('task')
            .leftJoinAndSelect('task.createdBy', 'createdBy')
            .leftJoinAndSelect('task.assignedTo', 'assignedTo')
            .leftJoinAndSelect('task.organization', 'organization')
            .where('task.organizationId IN (:...orgIds)', { orgIds: accessibleOrgIds });

        if (query.status) {
            queryBuilder.andWhere('task.status = :status', { status: query.status });
        }

        if (query.category) {
            queryBuilder.andWhere('task.category = :category', { category: query.category });
        }

        if (query.assignedToId) {
            queryBuilder.andWhere('task.assignedToId = :assignedToId', { assignedToId: query.assignedToId });
        }

        const sortBy = query.sortBy || 'createdAt';
        const sortOrder = query.sortOrder as string || 'desc';

        queryBuilder.orderBy(`task.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC');

        const total = await queryBuilder.getCount();

        const tasks = await queryBuilder.skip(skip).take(limit).getMany();

        res.json({ success: true, data: { tasks, total, page, limit } });
    } catch (error) {
        console.error('List tasks error', error);
        res.status(500).json({ success: false, error: "Internal Server error" });
    }
})

//Edit tasks
taskRouter.put('/:id', requirePermission(Permission.UPDATE_TASK), auditLogger(Permission.UPDATE_TASK, "Task"), async (req: AuthenticatedRequest, res: Response) => {
    try {

        const { id } = req.params;

        const taskRepo = AppDataSource.getRepository(Task);

        const task = await taskRepo.findOne({ where: { id }, relations: ['createdBy', 'assignedTo', 'organization'] });

        if (!task) return res.status(404).json({
            success: false,
            errror: "Task not found"
        });

        const updateData: UpdateTaskDto = req.body;
        const user = req.user;


        const orgRepo = AppDataSource.getRepository(Organization);
        const userRepo = AppDataSource.getRepository(User);

        const allOrgs = await orgRepo.find();

        if (!rbacService.canAccessOrganization(user!.organizationId, task.organizationId, allOrgs)) {
            return res.status(403).json({
                success: false,
                error: "Access denied"
            });
        }

        if (updateData.assignedToId && updateData.assignedToId !== task.assignedToId) {
            const assignedUser = await userRepo.findOne({ where: { id: updateData.assignedToId } });

            if (!assignedUser) {
                return res.status(400).json({ success: false, error: "Assigned User not found" })
            }

            if (!rbacService.canAccessOrganization(user?.organizationId!, assignedUser.organizationId, allOrgs)) {
                return res.status(403).json({ success: false, error: "Assigned user is outside your organization" });
            }
        }
        const changes: Record<string, any> = {};

        Object.keys(updateData).forEach((key) => {
            if (updateData[key as keyof UpdateTaskDto] !== undefined && updateData[key as keyof UpdateTaskDto] !== (task as any)[key]) {

                changes[key] = {
                    from: (task as any)[key],
                    to: updateData[key as keyof UpdateTaskDto]
                };
            }
        });

        Object.assign(task, {
            ...updateData, dueDate: updateData.dueDate ? new Date(updateData.dueDate) : task.dueDate
        });

        const updatedTask = await taskRepo.save(task);

        const taskWithRelation = await taskRepo.findOne({
            where: { id: updatedTask.id },
            relations: ['createdBy', 'assignedTo', 'organization']
        });

        return res.status(200).json({
            success: true, data: taskWithRelation
        });
    } catch (error) {
        console.error('Update task error', error);
        res.status(500).json({
            success: false, error: "Internal server error"
        })
    }
})

//Delete tasks
taskRouter.delete('/:id', requirePermission(Permission.DELETE_TASK), auditLogger(Permission.DELETE_TASK, "Task"), async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;
        const user = req.user;

        const taskRepo = AppDataSource.getRepository(Task);
        const task = await taskRepo.findOne({ where: { id } });

        if (!task) return res.status(404).json({ success: false, error: "Task not found" });

        const orgRepo = AppDataSource.getRepository(Organization);
        const allOrgs = await orgRepo.find();

        if (!rbacService.canAccessOrganization(user?.organizationId!, task.organizationId, allOrgs))
            return res.status(403).json({
                success: false,
                error: "Cannot delete task outside your organization"
            });

        await taskRepo.remove(task);

        return res.json({
            success: true,
            message: 'Task deleted successfully'
        });

    } catch (error) {
        console.error('Delete task error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
})


export default taskRouter;