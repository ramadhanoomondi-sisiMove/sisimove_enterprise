// src/domains/identity/presentation/rest/dto/revoke-role.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RevokeRoleDto {
  @ApiProperty({
    example: 'IDT-UATT6K',
    description: 'Public ID of the identity whose role should be revoked',
  })
  @IsString()
  identityPublicId!: string;

  @ApiProperty({
    example: 'ADMIN',
    description: 'Code of the role to revoke',
  })
  @IsString()
  roleCode!: string;

  @ApiProperty({
    example: 'IDT-SUPERADMIN',
    description: 'Public ID of the identity performing the revocation',
  })
  @IsString()
  revokedByPublicId!: string;
}
