import { Resolver, Mutation, Args, Scalar, Context } from '@nestjs/graphql';
import { TaskService } from './task.service';
import { UseGuards } from '@nestjs/common';
import { CreateTaskInput } from './dto/task.create.input';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Resolver()
export class TaskResolver {
  constructor(private taskService: TaskService) {}

  @Mutation()
  @UseGuards(JwtAuthGuard)
  async createTask(
    @Args('taskData') taskData: CreateTaskInput,
    @Context() context,
  ): Promise<any> {
    try {
      const userId = context.req.user.userId;
      const task = await this.taskService.createTask(taskData, userId);
      return { data: task };
    } catch (error) {
      throw new Error(error);
    }
  }
}
