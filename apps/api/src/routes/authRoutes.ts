import { LoginDto } from "@myorg/data";
import { Router } from "express";
import { AppDataSource } from "../db/database";
import { User } from "../entities";
import { jwtService } from "@myorg/auth";

const authRouter = Router();

authRouter.post('/login', async (req, res) => {

    try {
        const { email, password }: LoginDto = req.body;

        if (!email) return res.status(400).json({
            success: false,
            error: "Email is required"
        })
        if (!password) return res.status(400).json({
            success: false,
            error: "No password is provided"
        })

        const userRepository = AppDataSource.getRepository(User);

        const user = await userRepository.findOne({
            where: { email }
        })

        if (!user)
            return res.status(401).json({
                success: false,
                error: "No user with this email"
            })

        const isValidPassword = await jwtService.comparePassword(password, user.password);
        
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                error: "Invalid password"
            })
        }

        const token = jwtService.generateToken(user);

        return res.json({
            success: true,
            data: {
                token,
                user: {
                    id: user.id, email: user.email, name: user.firstName + " " + user.lastName
                }
            }
        })
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            error: 'Login failed'
        });
    }
})

export default authRouter;