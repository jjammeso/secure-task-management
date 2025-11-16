import { ApiResponse, AuthResponse, LoginDto, SafeUser } from "@myorg/data";
import { Router, Response } from "express";
import { AppDataSource } from "../db/database";
import { User } from "../entities";
import { jwtService } from "@myorg/auth";

import { AuthenticatedRequest, authenticateJWT } from "../middleware/auth.middleware";

const authRouter = Router();

authRouter.post('/login', async (req: AuthenticatedRequest, res: Response<ApiResponse<AuthResponse>>) => {

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
            where: { email: email.toLowerCase() },
            relations: ['organization']
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
        const refreshToken = jwtService.generateRefreshToken(user.id);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: 'api/auth/refresh',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        const { password: _, ...safeUser } = user;

        return res.json({
            success: true,
            data: {
                token,
                user: safeUser,
            },
        })
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            error: 'Login failed'
        });
    }
})

/**
 * GET /api/auth/me
 */
authRouter.get('/me', authenticateJWT, async (req: AuthenticatedRequest, res: Response<ApiResponse<SafeUser>>) => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                error: 'Not authenticated'
            });
            return;
        }

        const { password, ...userWithoutPassword } = req.user;

        res.json({
            success: true,
            data: userWithoutPassword
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});


authRouter.post('/refresh', async (req: AuthenticatedRequest, res: Response<ApiResponse<{ token: string }>>) => {
    try {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                error: 'Refresh token required'
            });
        }

        const { userId } = jwtService.verifyRefreshToken(refreshToken);

        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOne({
            where: { id: userId },
            relations: ['organization']
        });

        if (!user) {
            res.clearCookie('refreshToken', { path: '/api/auth/refresh' });
            return res.status(401).json({
                success: false,
                error: 'Invalid refresh token'
            });
        }

        const newToken = jwtService.generateToken(user);

        res.json({
            success: true,
            data: { token: newToken }
        });

    } catch (error) {
        res.status(401).json({
            success: false,
            error: 'Invalid refresh token'
        });
    }
})

export default authRouter;