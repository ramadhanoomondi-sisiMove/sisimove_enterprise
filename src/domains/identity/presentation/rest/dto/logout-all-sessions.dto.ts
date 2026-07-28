// src/domains/identity/presentation/rest/dto/logout-all-sessions.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LogoutAllSessionsDto {
  @ApiProperty({
    description: 'Public ID of the identity whose sessions should be revoked',
    example: 'IDT-PYRJSKM',
  })
  @IsString()
  @IsNotEmpty()
  identityPublicId!: string;
}
