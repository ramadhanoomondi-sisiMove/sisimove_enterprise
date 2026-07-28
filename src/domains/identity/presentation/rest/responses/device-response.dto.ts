import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { DeviceType } from '../../../domain/value-objects/device-type.enum';

export class DeviceResponseDto {
  @ApiProperty({
    example: 'DEV-7GJQ3R8Y',
  })
  publicId!: string;

  @ApiProperty({
    example: 'IDT-WQC6Y7G',
  })
  identityPublicId!: string;

  @ApiProperty({
    example: DeviceType.DESKTOP,
    enum: DeviceType,
  })
  deviceType!: DeviceType;

  @ApiProperty({
    example: true,
  })
  trusted!: boolean;

  @ApiProperty({
    example: false,
  })
  revoked!: boolean;

  @ApiProperty()
  fingerprint!: string;

  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  platform?: string;

  @ApiPropertyOptional()
  operatingSystem?: string;

  @ApiPropertyOptional()
  operatingSystemVersion?: string;

  @ApiPropertyOptional()
  browser?: string;

  @ApiPropertyOptional()
  browserVersion?: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
