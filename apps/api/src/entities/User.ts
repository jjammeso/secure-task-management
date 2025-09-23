import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import {Role} from '@myorg/data';
import { Organization } from "./Organization";
import { Task } from "./Task";
import { AuditLog } from "./AuditLog";

@Entity('users')
export class User{
    @PrimaryGeneratedColumn('uuid')
    id!:string;

    @Column({unique: true})
    email!:string;

    @Column()
    password!:string;

    @Column()
    firstName!:string;

    @Column()
    lastName!:string;

    @Column({
        type: 'varchar',
        enum: Role,
        default: Role.VIEWER
    })
    role!: Role;

    @Column()
    organizationId!:string;

    @ManyToOne(() => Organization, org =>org.users)
    organization!:Organization

    @OneToMany(() => Task, task=> task.createdBy)
    createdTasks!: Task[];

    @OneToMany(() => Task, task => task.assignedTo)
    assignedTasks!: Task[];

    @OneToMany(() => AuditLog, log => log.user)
    auditLogs!: AuditLog[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}