import { Router } from "express";

const router = Router();

router.get('/', (req, res) =>{
    res.json({message:"audit route"});
})

export default router;