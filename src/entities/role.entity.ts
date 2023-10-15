import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { TaskMemberEntity } from '../entities/taskMember.entity';
import { RoleCode } from '../config/constants/validate.input';

@Entity({ name: 'roles' })
export class RoleEntity {
  @PrimaryGeneratedColumn({ name: 'role_id' })
  roleId: number;

  @Column()
  code: RoleCode;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @OneToMany(() => TaskMemberEntity, (taskMember) => taskMember.role)
  taskMembers: TaskMemberEntity[];
}
