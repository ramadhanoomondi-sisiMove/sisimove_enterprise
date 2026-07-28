// src/domains/identity/presentation/rest/responses/authentication.response.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { AuthenticationFailureReason } from '../../domain/value-objects/authentication-failure-reason.enum';
import { AuthenticationMfaMethod } from '../../domain/value-objects/authentication-mfa-method.enum';
import { AuthenticationStatus } from '../../domain/value-objects/authentication-status.enum';
import { MfaStatus } from '../../domain/value-objects/mfa-status.enum';

export class AuthenticationResponse {
  @ApiProperty({
    example: 'AUT-8XK3M7PQ',
    description: 'Public identifier of the authentication account.',
  })
  publicId!: string;

  @ApiProperty({
    enum: AuthenticationStatus,
    example: AuthenticationStatus.ACTIVE,
    description: 'Current authentication account status.',
  })
  status!: AuthenticationStatus;

  @ApiProperty({
    example: 3,
    description: 'Current password version.',
  })
  passwordVersion!: number;

  @ApiProperty({
    example: false,
    description:
      'Indicates whether the user must change their password before the next successful authentication.',
  })
  passwordMustChange!: boolean;

  @ApiPropertyOptional({
    example: '2026-07-25T09:14:37.000Z',
    description: 'Timestamp when the password was last changed.',
  })
  passwordChangedAt?: Date;

  @ApiPropertyOptional({
    example: '2026-10-25T09:14:37.000Z',
    description: 'Timestamp when the current password expires.',
  })
  passwordExpiresAt?: Date;

  @ApiProperty({
    example: 0,
    description:
      'Current number of consecutive failed authentication attempts.',
  })
  failedAuthenticationCount!: number;

  @ApiPropertyOptional({
    example: '2026-07-27T08:15:10.000Z',
    description: 'Timestamp of the most recent successful authentication.',
  })
  lastAuthenticatedAt?: Date;

  @ApiProperty({
    example: false,
    description:
      'Convenience flag indicating whether the account is currently locked.',
  })
  locked!: boolean;

  @ApiPropertyOptional({
    example: '2026-07-27T08:00:00.000Z',
    description: 'Timestamp when the authentication account was locked.',
  })
  lockedAt?: Date;

  @ApiPropertyOptional({
    example: '2026-07-27T09:15:10.000Z',
    description: 'Timestamp when the current lock expires.',
  })
  lockedUntil?: Date;

  @ApiPropertyOptional({
    enum: AuthenticationFailureReason,
    example: AuthenticationFailureReason.TOO_MANY_ATTEMPTS,
    description: 'Reason why the account was locked.',
  })
  lockReason?: AuthenticationFailureReason;

  @ApiProperty({
    enum: MfaStatus,
    example: MfaStatus.ENABLED,
    description: 'Current multi-factor authentication status.',
  })
  mfaStatus!: MfaStatus;

  @ApiPropertyOptional({
    enum: AuthenticationMfaMethod,
    example: AuthenticationMfaMethod.TOTP,
    description: 'Configured multi-factor authentication method.',
  })
  mfaMethod?: AuthenticationMfaMethod;

  @ApiProperty({
    example: true,
    description: 'Convenience flag indicating whether MFA is enabled.',
  })
  mfaEnabled!: boolean;

  @ApiPropertyOptional({
    example: '2026-07-20T13:41:22.000Z',
    description: 'Timestamp when MFA was enabled.',
  })
  mfaEnabledAt?: Date;

  @ApiProperty({
    example: '2026-07-20T13:41:22.000Z',
    description: 'Timestamp when the authentication account was created.',
  })
  createdAt!: Date;

  @ApiProperty({
    example: '2026-07-27T08:15:10.000Z',
    description:
      'Timestamp of the most recent update to the authentication account.',
  })
  updatedAt!: Date;
}
