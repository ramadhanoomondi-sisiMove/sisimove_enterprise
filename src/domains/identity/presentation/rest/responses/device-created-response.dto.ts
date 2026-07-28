import { ApiProperty } from '@nestjs/swagger';

export class DeviceCreatedResponseDto {
  @ApiProperty({
    example: 'DEV-7GJQ3R8Y',
    description: 'Public identifier of the registered device.',
  })
  publicId!: string;
}
