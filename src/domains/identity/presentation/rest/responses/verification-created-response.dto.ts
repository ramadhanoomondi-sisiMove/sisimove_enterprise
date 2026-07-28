import { ApiProperty } from '@nestjs/swagger';

export class VerificationCreatedResponseDto {
  @ApiProperty({
    example: 'ver_01JYZ8M4RMYVSCVQ4E0R2ABCD1',
  })
  verificationPublicId!: string;
}
