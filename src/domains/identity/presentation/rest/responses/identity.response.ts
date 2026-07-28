// src/domains/identity/presentation/rest/responses/identity.response.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IdentityStatus } from '../../../domain/value-objects/identity-status.enum';
import { IdentityType } from '../../../domain/value-objects/identity-type.enum';

export class IdentityResponse {
  @ApiProperty({
    example: 'IDN-8XK3M7PQ',
    description: 'Public identifier of the identity.',
  })
  publicId!: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Primary email address.',
  })
  email!: string;

  @ApiPropertyOptional({
    example: '+254712345678',
    description: 'Primary phone number.',
  })
  phoneNumber?: string;

  @ApiProperty({
    enum: IdentityType,
    example: IdentityType.PERSON,
    description: 'Identity type.',
  })
  type!: IdentityType;

  @ApiProperty({
    enum: IdentityStatus,
    example: IdentityStatus.ACTIVE,
    description: 'Current identity status.',
  })
  status!: IdentityStatus;

  @ApiProperty({
    example: true,
    description:
      'Convenience flag indicating whether the identity is currently active.',
  })
  active!: boolean;

  @ApiPropertyOptional({
    example: '2026-07-27T08:15:10.000Z',
    description: 'Timestamp when the identity was activated.',
  })
  activatedAt?: Date;

  @ApiPropertyOptional({
    example: '2026-08-05T12:00:00.000Z',
    description: 'Timestamp when the identity was suspended.',
  })
  suspendedAt?: Date;

  @ApiPropertyOptional({
    example: '2026-08-20T18:30:00.000Z',
    description: 'Timestamp when the identity was permanently closed.',
  })
  closedAt?: Date;

  @ApiProperty({
    example: '2026-07-20T13:41:22.000Z',
    description: 'Timestamp when the identity was created.',
  })
  createdAt!: Date;

  @ApiProperty({
    example: '2026-07-27T08:15:10.000Z',
    description: 'Timestamp of the most recent update.',
  })
  updatedAt!: Date;
}
