import { Router } from "express";
import { AppDataSource } from "../db/database";
import { Task } from "../entities";
import { TaskStatus, TaskCategory } from '@myorg/data';

const router = Router()

const taskData = {
  title: "Finish TypeORM tutorial",
  description: "Complete all the TypeORM entity and relation exercises",
  status: TaskStatus.TODO,
  category: TaskCategory.WORK,
  priority: 2,
  dueDate: new Date("2025-09-30T17:00:00.000Z"),
  assignedToId: "a1b2c3d4-5678-90ab-cdef-1234567890ab",
  createdById: "b1c2d3e4-6789-01ab-cdef-2345678901bc",
  organizationId: "org-1234-5678-9012"
};

//Create task
router.post('/', async (req,res) => {
})

//List accessible tasks
router.get('/', async (req, res) => {
    try {
    const taskRepository = AppDataSource.getRepository(Task);

    // Insert sample task
    const savedTask = await taskRepository.save(taskData);

    // Fetch all tasks
    const tasks = await taskRepository.find();

    res.json({ success: true, insertedTask: savedTask, allTasks: tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "DB test failed" });
  }
})

//Edit tasks
router.put('/:id', (req,res) => {
    res.json({message:"edit task"})
})

//Delete tasks
router.delete('/:id', (req, res) => {
    res.json({messge:"delete task"})
} )


export default router;