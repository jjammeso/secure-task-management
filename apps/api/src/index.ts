import app from "./app";
import { AppDataSource } from "./db/database";
import { seed } from "./db/database";
import dotenv from 'dotenv';
import path from 'path'

//Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') }); 

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

console.log(`🌍 Environment: ${NODE_ENV}`);

AppDataSource.initialize()
    .then(async () => {

        await AppDataSource.synchronize();
        console.log('✅ Data source initialized');
        // only seed if db is empty
        try {
            await seed();
        } catch (seedError) {
            console.error('⚠️ Seeding failed:', seedError);
        }
        app.listen(PORT, () => {
            console.log("Server running on port: ", PORT);
        });
    })
    .catch(err => console.error("Error during Data Source initialization:", err));
