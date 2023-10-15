import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleCode } from '../config/constants/validate.input';
import { TaskMemberService } from '../modules/taskMember/taskMember.service';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly taskMemberService: TaskMemberService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.getRequiredRoles(context);

    if (!requiredRoles) {
      return true;
    }

    const userId = this.getUserIdFromContext(context);
    const taskId = this.getTaskIdFromContext(context);

    return this.taskMemberService.checkUserRoleForTask(
      userId,
      taskId,
      requiredRoles,
    );
  }

  private getRequiredRoles(context: ExecutionContext): RoleCode[] | undefined {
    return this.reflector.getAllAndOverride<RoleCode[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
  }

  private getUserIdFromContext(context: ExecutionContext): number {
    const gqlContext = GqlExecutionContext.create(context);
    return gqlContext.getContext().req.user.userId;
  }

  private getTaskIdFromContext(context: ExecutionContext): number {
    const gqlContext = GqlExecutionContext.create(context);
    return gqlContext.getContext().req.body.variables.AssignTaskInput.taskId;
  }
}
