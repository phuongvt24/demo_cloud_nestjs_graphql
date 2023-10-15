import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleCode } from '../../config/constants/validate.input';
import { RoleEntity } from '../../entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
  ) {}

  async changeCodeToRoleId(roleCode: RoleCode): Promise<any> {
    const role = await this.roleRepository.findOne({
      where: { code: roleCode },
    });
    if (role) {
      return role.roleId;
    }
    return null;
  }
}
