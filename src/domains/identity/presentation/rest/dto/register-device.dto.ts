// src/domains/identity/presentation/rest/dto/register-device.dto.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, type TransformFnParams } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import { DeviceType } from '../../../domain/value-objects/device-type.enum';

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class RegisterDeviceDto {
  @ApiProperty({
    example: 'IDT-WQC6Y7G',
    description: 'Public identifier of the owning identity.',
  })
  @Transform(trimString)
  @IsString()
  @Matches(/^IDT-[A-Z0-9]+$/, {
    message: 'identityPublicId must be a valid public identity identifier.',
  })
  identityPublicId!: string;

  @ApiProperty({
    example: 'c71d80d5d5f03d8f6efb8b2f6d81f2a2f9d8d53b2f2c6d2b2f8c7f9b6d4a2c1e',
    description: 'Unique fingerprint of the device.',
  })
  @Transform(trimString)
  @IsString()
  @MinLength(32)
  @MaxLength(255)
  fingerprint!: string;

  @ApiProperty({
    enum: DeviceType,
    example: DeviceType.DESKTOP,
    description: 'Type of the device.',
  })
  @IsEnum(DeviceType)
  deviceType!: DeviceType;

  @ApiPropertyOptional({
    example: 'John MacBook Pro',
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({
    example: 'macOS',
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(50)
  platform?: string;

  @ApiPropertyOptional({
    example: 'macOS',
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(50)
  operatingSystem?: string;

  @ApiPropertyOptional({
    example: '15.5',
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(30)
  operatingSystemVersion?: string;

  @ApiPropertyOptional({
    example: 'Chrome',
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(50)
  browser?: string;

  @ApiPropertyOptional({
    example: '138.0.7204.184',
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(30)
  browserVersion?: string;
}
