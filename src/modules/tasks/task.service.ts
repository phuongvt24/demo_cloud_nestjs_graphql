import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from '../../entities/task.entity';
import { Repository } from 'typeorm';
import { CreateTaskInput } from './dto/task.create.input';
import { TaskMemberService } from '../taskMember/taskMember.service';
import { CreateTaskMemberInput } from '../taskMember/dto/taskMember.create.input';
import { Priority, RoleCode } from '../../config/constants/validate.input';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private taskRepository: Repository<TaskEntity>,
    @Inject(forwardRef(() => TaskMemberService))
    private taskMemberService: TaskMemberService,
  ) {}

  async createTask(taskData: CreateTaskInput, userId: number): Promise<any> {
    const mappedTaskData = {
      ...taskData,
      start: new Date(taskData.start),
      end: new Date(taskData.end),
      priority: taskData.priority as Priority,
    };
    const task = this.taskRepository.create(mappedTaskData);
    const savedTask = await this.taskRepository.save(task);

    if (savedTask) {
      const createTaskMemberInput = new CreateTaskMemberInput(
        savedTask.taskId,
        userId,
        RoleCode.OWNER,
      );
      const savedTaskMember = this.taskMemberService.createTaskMember(
        createTaskMemberInput,
      );
      if (savedTaskMember) {
        try {
          const { taskId, title, priority, status } = savedTask;
          return { taskId, title, priority, status };
        } catch (error) {
          throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }
    }
  }

  async getTaskById(id: number): Promise<any> {
    const task = await this.taskRepository.findOne({
      where: { taskId: id },
    });
    const { taskId, title, description, priority, status, start, end } = task;
    return { taskId, title, description, priority, status, start, end };
  }
}
