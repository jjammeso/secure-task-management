import App from "./app";
import { AppDataSource, getDataSource, setDataSource } from "./db/database";
import { seed } from "./db/database";
import dotenv from 'dotenv';
import path from 'path'

//Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const PORT = parseInt(process.env.PORT || '5000');
const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_TEST = NODE_ENV === 'test';

console.log(`🌍 Environment: ${NODE_ENV}`);

const dataSource = getDataSource();

dataSource.initialize()
    .then(async () => {
        const app = new App();
        await seed(dataSource);
        app.listen(PORT);
    }).catch(error => console.error("Error during Data Source initialization:", error));