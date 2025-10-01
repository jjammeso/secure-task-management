import { LoginDto } from "@myorg/data";
import { Router } from "express";
import { AppDataSource } from "../db/database";
import { User } from "../entities";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const authRouter = Router();

authRouter.post('/login' ,async (req, res) => {

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

        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                error: "Invalid password"
            })
        }

        const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';
        console.log(JWT_SECRET);
        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in environment variables");
        }

        const token = jwt.sign(
            {
                id: user.id,
                name: user.firstName +" "+ user.lastName,
                email: user.email,
                role: user.role,
                organizationId: user.organizationId
            },
            JWT_SECRET,
            { expiresIn: '1d' }
        )

        return res.json({
            success: true,
            token,
            user: {
                id: user.id, email: user.email, name: user.firstName + " " + user.lastName
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