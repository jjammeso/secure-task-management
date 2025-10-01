import express from 'express';

//Import routes
import taskRoutes from './routes/taskRoute';
import authRoutes from './routes/authRoutes';
import auditRoutes from './routes/auditRoutes';

const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));


//Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/audit-log', auditRoutes);

//Health Check
app.get('health', (req, res) => {
    res.json({success:true, meassage:"API is running"});
})

//Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) =>{
    console.error(err.stack);
    res.status(500).json({
        success:false,
        error: 'Something went wrong!'
    });
})

//404 handler
app.use((req,res, next)=>{
    res.status(404).json({
        success:false,
        error: "Route not found"
    });
})

export default app;