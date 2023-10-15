import { Module, forwardRef } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskResolver } from './task.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from '../../entities/task.entity';
import { TaskMemberModule } from '../taskMember/taskMember.module';

@Module({
  imports: [
    forwardRef(() => TaskMemberModule),
    TypeOrmModule.forFeature([TaskEntity]),
  ],
  providers: [TaskService, TaskResolver],
  exports: [TaskService],
})
export class TaskModule {}
