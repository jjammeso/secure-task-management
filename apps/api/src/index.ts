import App from "./app";
import { AppDataSource } from "./db/database";
import { seed } from "./db/database";
import dotenv from 'dotenv';
import path from 'path'

//Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const PORT = parseInt(process.env.PORT || '5000');
const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_TEST = NODE_ENV === 'test';

console.log(`🌍 Environment: ${NODE_ENV}`);

async function startServer() {
    try {
        const app = new App();
        await app.initialize();
        app.listen(PORT);
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();