// -----------------------------------------------------------------------------
// Authentication — Create Authentication Request DTO
// -----------------------------------------------------------------------------

import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;
const MAX_IDENTITY_PUBLIC_ID_LENGTH = 128;

export class CreateAuthenticationRequestDto {
  @ApiProperty({
    example: 'IDN-01K3R8Y7Q2',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(MAX_IDENTITY_PUBLIC_ID_LENGTH)
  identityPublicId!: string;

  @ApiProperty({
    example: 'correct-horse-battery-staple',
    minLength: MIN_PASSWORD_LENGTH,
    maxLength: MAX_PASSWORD_LENGTH,
    writeOnly: true,
  })
  @IsString()
  @MinLength(MIN_PASSWORD_LENGTH)
  @MaxLength(MAX_PASSWORD_LENGTH)
  password!: string;
}
