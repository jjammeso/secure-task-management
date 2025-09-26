import { Router } from "express";

const router = Router();

//View access logs
router.get('/', (req, res) =>{
    res.json({message:"View access logs"});
})

export default router;