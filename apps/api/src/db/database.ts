import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: process.env.NODE_ENV === 'test' ? ':memory' : 'database.sqlite',
    synchronize: true,
    logging: process.env.NODE_ENV === 'development',
    entities: [],
    migrations: ['src/migrations/**/*.ts'],
    subscribers: ['src/subscribers/**/*.ts'],
})