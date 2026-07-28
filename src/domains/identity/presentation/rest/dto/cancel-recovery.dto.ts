import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CancelRecoveryDto {
  @ApiProperty({
    description: 'Recovery public identifier.',
    example: 'RCV-01JYH8V8R9M2K5A7B6C4D3E2F1',
  })
  @IsString()
  recoveryPublicId!: string;

  @ApiProperty({
    description: 'Optional cancellation reason.',
    required: false,
    example: 'USER_CANCELLED',
  })
  @IsOptional()
  @IsString()
  reason?: string;
}
