import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsUUID } from 'class-validator';

import { RecoveryType } from '../../../domain/value-objects/recovery-type.enum';

export class CompleteRecoveryDto {
  @ApiProperty({
    description: 'Internal Identity UUID.',
    example: 'c4d95d55-8899-4f81-a80b-fb04cf2fc0a6',
  })
  @IsUUID()
  identityId!: string;

  @ApiProperty({
    enum: RecoveryType,
  })
  @IsEnum(RecoveryType)
  recoveryType!: RecoveryType;

  @ApiProperty({
    description: 'Plaintext recovery token received by the user.',
    example: 'aJd8fN3LkP91XzQ7vRwM2BtUcY5HsEgFqLpN8KdT6VmCxZjA',
  })
  @IsString()
  recoveryToken!: string;
}
