import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, type TransformFnParams } from 'class-transformer';
import {
  IsDateString,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class RegisterAuthenticationDto {
  @ApiProperty({
    example: 'IDT-WQC6Y7G',
    description:
      'Public identifier of the identity for which authentication will be created.',
  })
  @Transform(trimString)
  @IsString()
  @Matches(/^IDT-[A-Z0-9]+$/, {
    message: 'identityPublicId must be a valid public identity identifier.',
  })
  identityPublicId!: string;

  @ApiProperty({
    example: 'Str0ngP@ssw0rd!',
    description: 'Initial plaintext password.',
    minLength: 8,
    maxLength: 128,
  })
  @Transform(trimString)
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;

  @ApiPropertyOptional({
    example: '2026-10-01T00:00:00.000Z',
    description: 'Optional password expiration timestamp.',
  })
  @IsOptional()
  @IsDateString()
  passwordExpiresAt?: string;
}
