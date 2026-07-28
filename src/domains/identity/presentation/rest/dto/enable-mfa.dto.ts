import { ApiProperty } from '@nestjs/swagger';
import { Transform, type TransformFnParams } from 'class-transformer';
import { IsEnum, IsString, Matches, MaxLength } from 'class-validator';

import { AuthenticationMfaMethod } from '../../../domain/value-objects/authentication-mfa-method.enum';

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class EnableMfaDto {
  @ApiProperty({
    example: 'IDT-WQC6Y7G',
    description:
      'Public identifier of the identity whose MFA should be enabled.',
  })
  @Transform(trimString)
  @IsString()
  @Matches(/^IDT-[A-Z0-9]+$/, {
    message: 'identityPublicId must be a valid public identity identifier.',
  })
  identityPublicId!: string;

  @ApiProperty({
    enum: AuthenticationMfaMethod,
    example: AuthenticationMfaMethod.TOTP,
    description: 'Multi-factor authentication method.',
  })
  @IsEnum(AuthenticationMfaMethod)
  method!: AuthenticationMfaMethod;

  @ApiProperty({
    example: 'JBSWY3DPEHPK3PXP',
    description:
      'Secret used by the selected MFA method (for example a TOTP secret).',
  })
  @Transform(trimString)
  @IsString()
  @MaxLength(512)
  secret!: string;
}
