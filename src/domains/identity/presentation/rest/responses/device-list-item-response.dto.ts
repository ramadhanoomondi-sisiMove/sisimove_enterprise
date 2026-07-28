import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { DeviceType } from '../../../domain/value-objects/device-type.enum';

export class DeviceListItemResponseDto {
  @ApiProperty({
    example: 'DEV-7GJQ3R8Y',
  })
  publicId!: string;

  @ApiProperty({
    enum: DeviceType,
  })
  deviceType!: DeviceType;

  @ApiProperty()
  trusted!: boolean;

  @ApiProperty()
  revoked!: boolean;

  @ApiPropertyOptional()
  name?: string;

  @ApiProperty()
  createdAt!: Date;
}
