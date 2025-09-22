import express from 'express';

//Import routes
import taskRoutes from './routes/taskRoute.ts';
import authRoutes from './routes/authRoutes.ts';
import auditRoutes from './routes/auditRoutes.ts';

const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));


//Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/auth/', authRoutes);
app.use('/api/audit', auditRoutes);

//404 handler
app.use('*', (req,res)=>{
    res.status(404).json({
        success:false,
        error: "Route not found"
    });
})

export default app;