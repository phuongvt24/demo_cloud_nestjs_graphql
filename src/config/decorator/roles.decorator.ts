import { SetMetadata } from '@nestjs/common';
import { RoleCode } from '../constants/validate.input';

export const Roles = (...roles: RoleCode[]) => SetMetadata('roles', roles);
