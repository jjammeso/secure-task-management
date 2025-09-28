import { Router } from "express";
import { AppDataSource } from "../db/database";
import { Organization, Task, User } from "../entities";
import { TaskStatus, TaskCategory, Role, CreateTaskDto } from '@myorg/data';
import { authenticateJWT } from "../middleware/auth.middleware";

const router = Router()

//Create task
router.post('/', async (req, res) => {
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

        if (assignedToId) {
            assignedUser = await userRepository.findOne({
                where: { id: assignedToId }
            })
            if (!assignedUser)
                return res.status(400).json({
                    success: false,
                    error: 'Assigned user not found.'
                })
        }

        const task = taskRepository.create({
            title,
            description,
            category,
            priority: priority || 3,
            dueDate: dueDate ? new Date(dueDate) : undefined,
            assignedToId: assignedToId,
            // createdById: req.user.id,
            // organizationId: assignedUser?.organizationId || req.user.organizationId,
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
router.get('/', authenticateJWT, async (req, res) => {
    try {

        const userRepository = AppDataSource.getRepository(User);

        const user = await userRepository.find();

        res.json({ success: true, User: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "DB test failed" });
    }
})

//Edit tasks
router.put('/:id', (req, res) => {
    res.json({ message: "edit task" })
})

//Delete tasks
router.delete('/:id', (req, res) => {
    res.json({ messge: "delete task" })
})


export default router;