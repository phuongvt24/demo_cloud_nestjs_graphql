import { RoleCode } from './../../config/constants/validate.input';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { TaskMemberService } from './taskMember.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles-auth.guard';
import { CreateTaskMemberInput } from './dto/taskMember.create.input';
import { Roles } from '../../config/decorator/roles.decorator';

@Resolver()
export class TaskMemberResolver {
  constructor(private taskMemberService: TaskMemberService) {}
  @Mutation()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.OWNER, RoleCode.EDITOR)
  async assignTask(
    @Args('assignData') assignData: CreateTaskMemberInput,
  ): Promise<any> {
    try {
      const task = await this.taskMemberService.assignTask(assignData);
      return { data: { task: task.taskInfo, members: task.userInfo } };
    } catch (error) {
      throw new Error(error);
    }
  }
}
