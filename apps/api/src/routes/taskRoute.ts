import { Router } from "express";

const router = Router()

//Create task
router.post('/', (req,res) => {
    res.json({message:"create tasks"})
})

//List accessible tasks
router.get('/', (req, res) => {
    res.json({message:"list tasks"});
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