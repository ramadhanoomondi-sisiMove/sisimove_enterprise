// src/domains/assets/presentation/rest/requests/upload-asset.request.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Transform, type TransformFnParams } from 'class-transformer';

import {
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import {
  ChecksumAlgorithm,
  type JsonValue,
} from '../../../domain/value-objects';

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class UploadAssetRequest {
  @ApiProperty({
    enum: ChecksumAlgorithm,
    example: ChecksumAlgorithm.SHA256,
    description: 'Checksum algorithm used for the uploaded file.',
  })
  @IsEnum(ChecksumAlgorithm)
  checksumAlgorithm!: ChecksumAlgorithm;

  @ApiProperty({
    example: '8d969eef6ecad3c29a3a629280e686cff8fabd7d6b8a1e9d4cb0c8b8d3d4e5f1',
    description: 'Computed checksum of the uploaded file.',
  })
  @Transform(trimString)
  @IsString()
  @MinLength(8)
  @MaxLength(512)
  checksum!: string;

  @ApiPropertyOptional({
    type: Object,
    additionalProperties: true,
    description: 'Additional metadata discovered during upload.',
  })
  @IsOptional()
  @IsObject()
  metadata?: JsonValue;
}
