// src/domains/identity/presentation/rest/dto/rotate-mfa-secret.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { Transform, type TransformFnParams } from 'class-transformer';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class RotateMfaSecretDto {
  @ApiProperty({
    example: 'IDT-WQC6Y7G',
    description: 'Public identifier of the owning identity.',
  })
  @Transform(trimString)
  @IsString()
  @Matches(/^IDT-[A-Z0-9]+$/, {
    message: 'identityPublicId must be a valid public identity identifier.',
  })
  identityPublicId!: string;

  @ApiProperty({
    example: 'JBSWY3DPEHPK3PXP',
    description:
      'New plaintext MFA secret. It will be encrypted before persistence.',
  })
  @Transform(trimString)
  @IsString()
  @MinLength(16)
  @MaxLength(255)
  secret!: string;
}
