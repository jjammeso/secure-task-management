import request from 'supertest';
import App from '../app';
import { User, Organization } from '../entities';
import { Role } from '@myorg/data';
import { jwtService } from '@myorg/auth';

describe('Authentication', () => {
    let app: App;

    beforeAll(async () => {
        app = new App();
    })

    describe('POST /api/auth/login', () => {

        it('should login with valid credentials', async ()=>{
            const response = await request(app.app).post('/api/auth/login')
            .send({
                email: 'alice@email.com',
                password:'Alice123'
            })
            .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.user.email).toBe('alice@email.com');
            expect(response.body.data.token).toBeDefined();
        })



        it('should not login with invalid credentials', async ()=>{
            const response = await request(app.app)
            .post('/api/auth/login')
            .send({
                email: 'alice@email.com',
                password: 'wrongpassword'
            })
            .expect(401);

            expect(response.body.success).toBe(false);
            expect(response.body.error).toBe('Invalid credentials');
        })
    })
})

