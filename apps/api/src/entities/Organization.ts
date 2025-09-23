import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './User';
import { Task } from './Task';

@Entity('Organizations')
export class Organization {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    name!: string;

    @Column({ nullable: true })
    parentId?: string;

    @ManyToOne(() => Organization, org => org.children, { nullable: true })
    parent?: Organization;

    @OneToMany(() => Organization, org => org.parent)
    children!: Organization[];

    @Column()
    ownderId!: string;

    @OneToMany(() => User, user => user.organization)
    users!: User[];

    @OneToMany(() => Task, task => task.organization)
    tasks!: Task[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

}