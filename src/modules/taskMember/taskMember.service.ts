import { TaskMemberEntity } from './../../entities/taskMember.entity';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateTaskMemberInput } from './dto/taskMember.create.input';
import { RoleCode } from '../../config/constants/validate.input';
import { TaskService } from '../tasks/task.service';
import { UserService } from '../users/user.service';
import { RoleService } from '../role/role.service';

@Injectable()
export class TaskMemberService {
  constructor(
    @InjectRepository(TaskMemberEntity)
    private taskMemberRepository: Repository<TaskMemberEntity>,

    private userService: UserService,
    private roleService: RoleService,

    @Inject(forwardRef(() => TaskService))
    private taskService: TaskService,
  ) {}

  async taskMemberExists(
    userId: number,
    taskId: number,
  ): Promise<TaskMemberEntity> {
    return await this.taskMemberRepository.findOne({
      where: {
        user: { userId },
        task: { taskId },
      },
    });
  }

  async createTaskMember(taskMemberData: CreateTaskMemberInput): Promise<any> {
    const { userId, taskId } = taskMemberData;
    const roleId = await this.roleService.changeCodeToRoleId(
      taskMemberData.roleCode,
    );

    const taskMemberExists = await this.taskMemberExists(userId, taskId);
    if (taskMemberExists) {
      throw new HttpException(
        'This user has been assigned to the task',
        HttpStatus.CONFLICT,
      );
    }

    const userExists = await this.userService.findByUserId(userId);
    if (!userExists) {
      throw new HttpException('User do not exist', HttpStatus.NOT_FOUND);
    }
    try {
      const taskMember = this.taskMemberRepository.create({
        user: { userId },
        task: { taskId },
        role: { roleId },
      });
      const savedTaskMember = await this.taskMemberRepository.save(taskMember);
      if (savedTaskMember) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUsersByTaskId(taskId: number): Promise<any> {
    const taskMembers = await this.taskMemberRepository.find({
      where: { task: { taskId } },
      relations: ['user', 'role'],
    });

    const users = taskMembers.map((taskMember) => ({
      userId: taskMember.user.userId,
      name: taskMember.user.name,
      roleCode: taskMember.role.code,
    }));
    return users;
  }

  async assignTask(assignData: CreateTaskMemberInput): Promise<any> {
    const savedTaskMember = await this.createTaskMember(assignData);
    if (savedTaskMember) {
      const taskInfo = await this.taskService.getTaskById(assignData.taskId);
      const userInfo = await this.getUsersByTaskId(assignData.taskId);
      return { taskInfo, userInfo };
    }
  }

  async checkUserRoleForTask(
    userId: number,
    taskId: number,
    roles: RoleCode[],
  ): Promise<boolean> {
    const taskMember = await this.taskMemberRepository.findOne({
      where: {
        user: { userId },
        task: { taskId },
        role: { code: In(roles) },
      },
    });
    return !!taskMember;
  }
}
