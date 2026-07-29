// src/domains/identity/presentation/rest/dto/get-identity-audit.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { Transform, type TransformFnParams } from 'class-transformer';
import { IsString, Matches } from 'class-validator';

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class GetIdentityAuditDto {
  @ApiProperty({
    example: 'AUD-7Q4K9M2',
    description: 'Public identifier of the identity audit record.',
  })
  @Transform(trimString)
  @IsString()
  @Matches(/^AUD-[A-Z0-9]+$/, {
    message: 'publicId must be a valid public identity audit identifier.',
  })
  publicId!: string;
}
