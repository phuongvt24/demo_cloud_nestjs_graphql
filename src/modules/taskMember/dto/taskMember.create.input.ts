import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { RoleCode } from '../../../config/constants/validate.input';
export class CreateTaskMemberInput {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  taskId: number;

  @IsOptional()
  @IsEnum(RoleCode)
  roleCode: RoleCode;

  constructor(taskId: number, userId: number, roleCode: RoleCode) {
    this.taskId = taskId;
    this.userId = userId;
    this.roleCode = roleCode;
  }
}
