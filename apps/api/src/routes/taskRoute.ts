import { Router } from "express";
import { AppDataSource } from "../db/database";
import { Organization, Task, User } from "../entities";
import { TaskStatus, TaskCategory, Role } from '@myorg/data';

const router = Router()

//Create task
router.post('/', async (req, res) => {
})

//List accessible tasks
router.get('/', async (req, res) => {
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