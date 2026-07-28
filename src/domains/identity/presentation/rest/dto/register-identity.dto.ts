// src/domains/identity/presentation/rest/dto/register-identity.dto.ts

import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { IdentityType } from '../../../domain/value-objects/identity-type.enum';

export class RegisterIdentityDto {
  @ApiProperty({
    enum: IdentityType,
    example: IdentityType.PERSON,
  })
  @IsEnum(IdentityType)
  type!: IdentityType;

  @ApiProperty({
    example: 'john.doe@sisimove.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: '+254712345678',
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  @ApiProperty({
    example: 'StrongPassword123!',
    minLength: 12,
  })
  @IsString()
  @MinLength(12)
  password!: string;
}
