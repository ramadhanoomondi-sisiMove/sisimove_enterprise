// src/domains/identity/presentation/rest/dto/get-identity-roles.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetIdentityRolesDto {
  @ApiProperty({
    example: 'IDT-UATT6K',
    description: 'Public ID of the identity whose roles should be retrieved',
  })
  @IsString()
  identityPublicId!: string;
}
