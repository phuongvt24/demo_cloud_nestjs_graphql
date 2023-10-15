import { Module, forwardRef } from '@nestjs/common';
import { TaskMemberResolver } from './taskMember.resolver';
import { TaskMemberService } from './taskMember.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskMemberEntity } from '../../entities/taskMember.entity';
import { TaskModule } from '../tasks/task.module';
import { RoleModule } from '../role/role.module';
import { UserModule } from '../users/user.module';

@Module({
  imports: [
    UserModule,
    RoleModule,
    forwardRef(() => TaskModule),
    TypeOrmModule.forFeature([TaskMemberEntity]),
  ],
  providers: [TaskMemberResolver, TaskMemberService],
  exports: [TaskMemberService],
})
export class TaskMemberModule {}
