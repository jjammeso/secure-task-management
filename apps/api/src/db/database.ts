import { DataSource } from "typeorm";
import { AuditLog, Organization, Task, User } from "../entities";
import { Role } from "@myorg/data";
import * as bcrypt from 'bcrypt';

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: process.env.NODE_ENV === 'test' ? ':memory' : 'database.sqlite',
    synchronize: true,
    logging: process.env.NODE_ENV === 'development',
    entities: [User, Organization, Task, AuditLog],
    migrations: ['src/migrations/**/*.ts'],
    subscribers: ['src/subscribers/**/*.ts'],
})

//Populate database with organization and some users

const orgNames = ['Org Alpha', 'Org Beta', 'Org Gamma'];

const usersData = [
    // Owners (one per org)
    { firstName: 'Alice', lastName: 'Smith', email: 'alice@alpha.com', role: Role.OWNER, orgIndex: 0 },
    { firstName: 'Bob', lastName: 'Johnson', email: 'bob@beta.com', role: Role.OWNER, orgIndex: 1 },
    { firstName: 'Carol', lastName: 'Williams', email: 'carol@gamma.com', role: Role.OWNER, orgIndex: 2 },

    // Admins
    { firstName: 'Dave', lastName: 'Brown', email: 'dave@alpha.com', role: Role.ADMIN, orgIndex: 0 },
    { firstName: 'Eve', lastName: 'Jones', email: 'eve@beta.com', role: Role.ADMIN, orgIndex: 1 },
    { firstName: 'Frank', lastName: 'Garcia', email: 'frank@gamma.com', role: Role.ADMIN, orgIndex: 2 },

    // Viewers
    { firstName: 'Grace', lastName: 'Miller', email: 'grace@alpha.com', role: Role.VIEWER, orgIndex: 0 },
    { firstName: 'Heidi', lastName: 'Davis', email: 'heidi@beta.com', role: Role.VIEWER, orgIndex: 1 },
    { firstName: 'Ivan', lastName: 'Rodriguez', email: 'ivan@gamma.com', role: Role.VIEWER, orgIndex: 2 },
    { firstName: 'Judy', lastName: 'Martinez', email: 'judy@alpha.com', role: Role.VIEWER, orgIndex: 0 },
];

export async function seed() {
    const orgRepo = AppDataSource.getRepository(Organization);
    const userRepo = AppDataSource.getRepository(User);

    //Load Json data
    const orgs: Organization[] = [];

    for (const name of orgNames) {
        const org = orgRepo.create({ name });
        await orgRepo.save(org);
        orgs.push(org);
    }

    for (const u of usersData) {
        const user = userRepo.create({
            firstName: u.firstName,
            lastName: u.lastName,
            email: u.email,
            role: u.role,
            organization: orgs[u.orgIndex],
            organizationId: orgs[u.orgIndex].id,
            password: await bcrypt.hash(`${u.firstName}123`, 10),
        })

        await userRepo.save(user);

        if (u.role === Role.OWNER) {
            const org = orgs[u.orgIndex];
            org.ownerId = user.id;
            await orgRepo.save(org);
        }
    }

    console.log('Data seeded with 3 organizations and 10 users');
}
