import { DataSource } from "typeorm";
import { User, Organization, Task, AuditLog } from "../entities";

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
})

afterAll(async () =>{
    await testDataSource.destroy();
})

beforeEach(async ()=>{
    const entities = testDataSource.entityMetadatas;

    for(const entity of entities){
        const repository = testDataSource.getRepository(entity.name);
        await repository.clear();
    }
})
