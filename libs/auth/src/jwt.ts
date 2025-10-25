import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JwtPayload, User } from '@myorg/data';

export class JWTService {
    private readonly secret: string;

    constructor(secret = process.env.JWT_SECRET || 'your-secret-key') {
        this.secret = secret;
    }

    generateToken(user: User): string {
        const payload: JwtPayload = {
            userId: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            organizationId: user.organizationId
        };

        return jwt.sign(payload, this.secret, { expiresIn: '24h' });
    }

    verifyToken(token: string): JwtPayload {
        try {
            return jwt.verify(token, this.secret) as JwtPayload;
        } catch (error) {
            throw new Error('Invalid token');
        }
    }

    extractTokenFromHeader(authHeader: string | undefined): string|null {
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return null;
        }
        return authHeader.substring(7);
    }

    async hashPassword(password:string):Promise<string>{
        return bcrypt.hash(password, 12);
    }

    async comparePassword(password:string, hash:string):Promise<boolean>{
        return bcrypt.compare(password, hash);
    }

    generateRefreshToken(userId:string): string {
        return jwt.sign({userId, type:'refresh'}, this.secret, {expiresIn: '7d'});
    }

    verifyRefreshToken(token:string): {userId: string}{
        try {
            const payload = jwt.verify(token, this.secret) as any;
            if(payload.type !== 'refresh')
                throw new Error("Invalid refresh token");
            return {userId: payload.userId};
        } catch (error) {
            throw error;
        }
    }
}

export const jwtService = new JWTService();