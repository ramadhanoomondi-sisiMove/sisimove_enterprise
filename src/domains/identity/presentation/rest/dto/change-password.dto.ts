// src/domains/identity/presentation/rest/dto/change-password.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { Transform, type TransformFnParams } from 'class-transformer';
import {
  IsString,
  Matches,
  MaxLength,
  MinLength,
  NotEquals,
} from 'class-validator';

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class ChangePasswordDto {
  @ApiProperty({
    example: 'IDT-WQC6Y7G',
    description: 'Public identifier of the identity.',
  })
  @Transform(trimString)
  @IsString()
  @Matches(/^IDT-[A-Z0-9]+$/, {
    message: 'identityPublicId must be a valid public identity identifier.',
  })
  identityPublicId!: string;

  @ApiProperty({
    example: 'CurrentP@ssw0rd!',
    description: 'Current plaintext password.',
    minLength: 8,
  })
  @Transform(trimString)
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  currentPassword!: string;

  @ApiProperty({
    example: 'N3wStrongerP@ssw0rd!',
    description: 'New plaintext password.',
    minLength: 8,
  })
  @Transform(trimString)
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  @NotEquals(undefined, {
    message: 'newPassword is required.',
  })
  newPassword!: string;
}
