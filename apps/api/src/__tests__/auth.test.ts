import request from 'supertest';
import App from '../app';
import { setDataSource } from '../db/database';
import { testDataSource } from './setup';

describe('Authentication', () => {
    let app: App;

    beforeAll(async () => {
        app = new App();
        setDataSource(testDataSource);
    })

    describe('POST /api/auth/login', () => {

        it('should login with valid credentials', async ()=>{
            const response = await request(app.app).post('/api/auth/login')
            .send({
                email: 'alice@email.com',
                password: 'Alice123'
            })
            .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.user.email).toBe('alice@email.com');
            expect(response.body.data.token).toBeDefined();
        })



        it('should not login with invalid password', async ()=>{
            const response = await request(app.app)
            .post('/api/auth/login')
            .send({
                email: 'alice@email.com',
                password: 'wrongpassword'
            })
            .expect(401);

            expect(response.body.success).toBe(false);
            expect(response.body.error).toBe('Invalid password');
        })

         it('should not login with invalid email', async ()=>{
            const response = await request(app.app)
            .post('/api/auth/login')
            .send({
                email: 'alice@wrongemail.com',
                password: 'Alice123'
            })
            .expect(401);

            expect(response.body.success).toBe(false);
            expect(response.body.error).toBe('No user with this email');
        })
    })
})

