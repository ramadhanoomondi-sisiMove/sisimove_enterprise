// src/domains/identity/presentation/rest/dto/lock-authentication.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { Transform, type TransformFnParams } from 'class-transformer';
import { IsDateString, IsEnum, IsString, Matches } from 'class-validator';

import { AuthenticationFailureReason } from '../../../domain/value-objects/authentication-failure-reason.enum';

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class LockAuthenticationDto {
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
    example: '2026-08-01T12:00:00.000Z',
    description: 'Timestamp when the authentication lock expires.',
  })
  @IsDateString()
  lockedUntil!: string;

  @ApiProperty({
    enum: AuthenticationFailureReason,
    example: AuthenticationFailureReason.TOO_MANY_ATTEMPTS,
    description: 'Reason for locking the authentication.',
  })
  @IsEnum(AuthenticationFailureReason)
  reason!: AuthenticationFailureReason;
}
