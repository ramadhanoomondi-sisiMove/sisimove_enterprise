// src/domains/identity/presentation/rest/dto/assign-role.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class AssignRoleDto {
  @ApiProperty({
    example: 'IDT-ABC12345',
    description: 'Public ID of the identity receiving the role',
  })
  @IsString()
  identityPublicId!: string;

  @ApiProperty({
    example: 'ADMIN',
    description: 'Role code to assign',
  })
  @IsString()
  roleCode!: string;

  @ApiProperty({
    example: 'IDT-SUPERADMIN',
    description: 'Public ID of the identity assigning the role',
    required: false,
  })
  @IsOptional()
  @IsString()
  assignedByPublicId?: string;
}
