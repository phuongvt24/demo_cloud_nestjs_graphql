import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { TaskMemberEntity } from './taskMember.entity';
import { Priority, Status } from '../config/constants/validate.input';

@Entity({ name: 'task' })
export class TaskEntity {
  @PrimaryGeneratedColumn({ name: 'task_id' })
  taskId: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: Priority,
    default: Priority.HIGH,
  })
  priority: Priority;

  @Column()
  start: Date;

  @Column()
  end: Date;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.PENDING,
  })
  status: Status;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @OneToMany(() => TaskMemberEntity, (taskMember) => taskMember.task)
  members: TaskMemberEntity[];
}
