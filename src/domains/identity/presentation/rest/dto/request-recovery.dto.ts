import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsEnum } from 'class-validator';

import { RecoveryType } from '../../../domain/value-objects/recovery-type.enum';

export class RequestRecoveryDto {
  @ApiProperty({
    description: 'Internal Identity UUID.',
    example: 'c4d95d55-8899-4f81-a80b-fb04cf2fc0a6',
  })
  @IsUUID()
  identityId!: string;

  @ApiProperty({
    enum: RecoveryType,
    description: 'Type of recovery being requested.',
  })
  @IsEnum(RecoveryType)
  recoveryType!: RecoveryType;
}
