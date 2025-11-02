import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
//Import routes
import taskRoutes from './routes/taskRoute';
import authRoutes from './routes/authRoutes';
import auditRoutes from './routes/auditRoutes';
import userRoutes from './routes/userRoutes';
import { DataSource } from 'typeorm';
import { AppDataSource, seed } from './db/database';

class App {
    public app: express.Application;
    private dataSource: DataSource;

    constructor(dataSource:DataSource = AppDataSource) {
        this.app = express();
        this.dataSource = dataSource;
        this.initializeMiddlewares();
        this.initializeRoutes();
    }

    private initializeMiddlewares(): void {
        //Middleware
        this.app.use(cors({
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            credentials: true
        }))

        this.app.use(express.json());
        this.app.use(cookieParser());
        this.app.use(express.urlencoded({ extended: true }));

        //Health Check
        this.app.get('/health', (req, res) => {
            res.json({ success: true, meassage: "API is running" });
        })
    }

    private initializeRoutes(): void {
        //Routes
        this.app.use('/api/tasks', taskRoutes);
        this.app.use('/api/auth', authRoutes);
        this.app.use('/api/audit-log', auditRoutes);
        this.app.use('/api/users', userRoutes);

        //Global error handler
        this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            console.error(err.stack);
            res.status(500).json({
                success: false,
                error: 'Something went wrong!'
            });
        })

        //404 handler
        this.app.use((req, res, next) => {
            res.status(404).json({
                success: false,
                error: "Route not found"
            });
        })
    }

    public async initialize(): Promise<void> {
        try {
            await this.dataSource.initialize();
            console.log('Database connection established');
            await seed(this.dataSource);
        } catch (error) {
            console.error('Database connection failed:', error);
            throw error;
        }
    }

    public listen(port: number): void {
        this.app.listen(port, () => {
            console.log('Server running on port ' + port + '!');
        })
    }
}

export default App;








