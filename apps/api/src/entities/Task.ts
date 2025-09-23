import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './User';
import { Organization } from './Organization';
import { TaskStatus, TaskCategory } from '@myorg/data';

@Entity('tasks')
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    title!: string;

    @Column({ nullable: true })
    description?: string;

    @Column({
        type: 'varchar',
        enum: TaskStatus,
        default: TaskStatus.TODO
    })
    status!: TaskStatus;

    @Column({
        type: 'varchar',
        enum: TaskCategory,
        default: TaskCategory.WORK
    })
    category!: TaskCategory;

    @Column({ default: 3 })
    priority!: number;

    @Column({ nullable: true })
    dueDate?: Date;

    @Column()
    assignedToId!: string;

    @ManyToOne(() => User, user => user.assignedTasks)
    assignedTo!: User;

    @Column()
    createdById!: string;

    @ManyToOne(() => User, user => user.createdTasks)
    createdBy!: User;

    @Column()
    organizationId!: string;

    @ManyToOne(() => Organization, org => org.tasks)
    organization!: Organization;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}