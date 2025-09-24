import app from "./app";
import { AppDataSource } from "./db/database";
import { seed } from "./db/database";
import { Organization } from "./entities";

const PORT = process.env.PORT || 5000;

AppDataSource.initialize()
  .then(async () => {
    await AppDataSource.synchronize();
    console.log('✅ Data source initialized');
    // only seed if db is empty
    await seed();
    // then start your express server
    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch(err => console.error("Error during Data Source initialization:", err));
