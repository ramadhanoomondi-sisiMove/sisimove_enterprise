// src/domains/asset/presentation/rest/requests/update-asset-metadata.request.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString, Matches } from 'class-validator';
import { Transform, type TransformFnParams } from 'class-transformer';

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class UpdateAssetMetadataRequest {
  @ApiProperty({
    example: 'AST-X7Q29KD',
    description: 'Public identifier of the asset.',
  })
  @Transform(trimString)
  @IsString()
  @Matches(/^AST-[A-Z0-9]+$/, {
    message: 'assetPublicId must be a valid asset public identifier.',
  })
  assetPublicId!: string;

  @ApiProperty({
    example: {
      title: 'Sunset at Diani Beach',
      description: 'Taken during the December holiday.',
      alt: 'Beach during sunset',
      tags: ['beach', 'sunset', 'travel'],
      location: {
        country: 'Kenya',
        county: 'Kwale',
      },
      camera: {
        make: 'Canon',
        model: 'EOS R6',
      },
    },
    description: 'Asset metadata to replace the current metadata document.',
  })
  @IsObject()
  metadata!: Record<string, unknown>;
}
