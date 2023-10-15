import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { Priority, DATE_START } from '../../../config/constants/validate.input';
import { IsStartBeforeEnd } from '../../../config/custom/start-before-end.validator';

export class CreateTaskInput {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsEnum(Priority)
  priority: Priority;

  @IsStartBeforeEnd({ message: DATE_START.MESSAGE })
  @IsDateString()
  @IsOptional()
  start: Date;

  @IsDateString()
  @IsOptional()
  end: Date;
}
