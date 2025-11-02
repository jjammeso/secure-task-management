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

const orgStructure = [
    // Parent organizations (Level 1)
    { name: 'Engineering', isParent: true },
    { name: 'Operation', isParent: true },

    // Child organizations (Level 2)
    { name: 'Software', parentName: 'Engineering' },
    { name: 'Electronic', parentName: 'Engineering' },
    { name: 'Production', parentName: 'Operation' },
    { name: 'Safety', parentName: 'Operation' }
];

const usersData = [
    // Owners for parent organizations
    { firstName: 'Alice', lastName: 'Smith', email: 'alice@email.com', role: Role.OWNER, orgName: 'Engineering' },
    { firstName: 'Bob', lastName: 'Johnson', email: 'bob@email.com', role: Role.OWNER, orgName: 'Operation' },

    // Admins for child organizations
    { firstName: 'Carol', lastName: 'Williams', email: 'carol@email.com', role: Role.ADMIN, orgName: 'Software' },
    { firstName: 'Dave', lastName: 'Brown', email: 'dave@email.com', role: Role.ADMIN, orgName: 'Electronic' },
    { firstName: 'Eve', lastName: 'Jones', email: 'eve@email.com', role: Role.ADMIN, orgName: 'Production' },

    // Additional users across organizations
    { firstName: 'Frank', lastName: 'Garcia', email: 'frank@email.com', role: Role.ADMIN, orgName: 'Engineering' },
    { firstName: 'Grace', lastName: 'Miller', email: 'grace@email.com', role: Role.VIEWER, orgName: 'Software' },
    { firstName: 'Henry', lastName: 'Davis', email: 'henry@email.com', role: Role.VIEWER, orgName: 'Safety' },
    { firstName: 'Iris', lastName: 'Rodriguez', email: 'iris@email.com', role: Role.VIEWER, orgName: 'Operation' },
    { firstName: 'Jack', lastName: 'Martinez', email: 'jack@email.com', role: Role.VIEWER, orgName: 'Safety' },
];

export async function seed(appDataSource: DataSource) {
    const orgRepo = appDataSource.getRepository(Organization);
    const userRepo = appDataSource.getRepository(User);

    // Check if tables are empty - corrected syntax
    const orgCount = await orgRepo.count();
    const userCount = await userRepo.count();

    if (orgCount > 0 || userCount > 0) {
        console.log('📋 Tables already contain data, skipping seed');
        return;
    }

    console.log('🌱 Tables are empty, starting seed...');

    const orgs: { [key: string]: Organization } = {};

    //Load Json data
    for (const orgData of orgStructure.filter(o => o.isParent)) {
        const org = orgRepo.create({
            name: orgData.name,
        });
        const savedOrg = await orgRepo.save(org);
        orgs[orgData.name] = savedOrg;
        console.log(`  ✓ Created parent org: ${orgData.name}`);
    }

    // Step 2: Create child organizations
    console.log('📊 Creating child organizations...');
    for (const orgData of orgStructure.filter(o => !o.isParent)) {
        const parentOrg = orgs[orgData.parentName!];
        if (!parentOrg) {
            throw new Error(`Parent organization not found: ${orgData.parentName}`);
        }

        const org = orgRepo.create({
            name: orgData.name,
            parentId: parentOrg.id,
            parent: parentOrg
        });
        const savedOrg = await orgRepo.save(org);
        orgs[orgData.name] = savedOrg;
        console.log(`  ✓ Created child org: ${orgData.name} (parent: ${orgData.parentName})`);
    }

    // Step 3: Create users
    console.log('👥 Creating users...');
    for (const u of usersData) {
        const targetOrg = orgs[u.orgName];
        if (!targetOrg) {
            throw new Error(`Organization not found: ${u.orgName}`);
        }

        const user = userRepo.create({
            firstName: u.firstName,
            lastName: u.lastName,
            email: u.email,
            role: u.role,
            organization: targetOrg,
            organizationId: targetOrg.id,
            password: await bcrypt.hash(`${u.firstName}123`, 10),
        });

        const savedUser = await userRepo.save(user);
        console.log(`  ✓ Created user: ${u.firstName} ${u.lastName} (${u.role}) in ${u.orgName}`);

        // Step 4: Set organization owner
        if (u.role === Role.OWNER) {
            targetOrg.ownerId = savedUser.id;
            await orgRepo.save(targetOrg);
            console.log(`    ➤ Set ${u.firstName} as owner of ${u.orgName}`);
        }
    }

}
