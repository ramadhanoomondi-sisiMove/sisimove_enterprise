import { ApiProperty } from '@nestjs/swagger';

export class VerificationRequestCreatedResponseDto {
  @ApiProperty({
    example: 'vrq_01JYZ8P2M2MZ7P2V7MABCDEF12',
  })
  requestPublicId!: string;
}
