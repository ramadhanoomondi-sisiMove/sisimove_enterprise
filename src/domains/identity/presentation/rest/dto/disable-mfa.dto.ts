// src/domains/identity/presentation/rest/dto/disable-mfa.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { Transform, type TransformFnParams } from 'class-transformer';
import { IsString, Matches } from 'class-validator';

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class DisableMfaDto {
  @ApiProperty({
    example: 'IDT-WQC6Y7G',
    description:
      'Public identifier of the identity whose MFA should be disabled.',
  })
  @Transform(trimString)
  @IsString()
  @Matches(/^IDT-[A-Z0-9]+$/, {
    message: 'identityPublicId must be a valid public identity identifier.',
  })
  identityPublicId!: string;
}
