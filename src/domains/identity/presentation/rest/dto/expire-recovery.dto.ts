import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ExpireRecoveryDto {
  @ApiProperty({
    description: 'Recovery public identifier.',
    example: 'RCV-01JYH8V8R9M2K5A7B6C4D3E2F1',
  })
  @IsString()
  recoveryPublicId!: string;
}
