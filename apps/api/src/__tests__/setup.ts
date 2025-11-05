import { DataSource } from "typeorm";
import { User, Organization, Task, AuditLog } from "../entities";
import { seed } from "../db/database";

export let testDataSource: DataSource;

beforeAll(async ()=>{
    testDataSource = new DataSource({
        type: 'sqlite',
        database: ':memory:',
        entities: [User, Organization, Task, AuditLog],
        synchronize: true,
        logging: false,
    })
    await testDataSource.initialize();
    await seed(testDataSource);
})

afterAll(async () =>{
    await testDataSource.destroy();
})

it('setup file dummy test', () => {
  expect(true).toBe(true);
});