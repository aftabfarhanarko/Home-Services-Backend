import { IsArray, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { Permission } from '../enums/permission.enum';
import { RoleType } from '../entities/role.entity';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsEnum(RoleType)
  name: RoleType;

  @IsOptional()
  @IsArray()
  @IsEnum(Permission, { each: true })
  permissions?: Permission[];
}
