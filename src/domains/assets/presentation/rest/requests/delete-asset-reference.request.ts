// src/domains/asset/presentation/rest/requests/delete-asset-reference.request.ts

import { ApiProperty } from '@nestjs/swagger';
import { Transform, type TransformFnParams } from 'class-transformer';
import { IsString, Matches } from 'class-validator';

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class DeleteAssetReferenceRequest {
  @ApiProperty({
    example: 'ARF-X9K72QP',
    description: 'Public identifier of the asset reference to delete.',
  })
  @Transform(trimString)
  @IsString()
  @Matches(/^ARF-[A-Z0-9]+$/, {
    message:
      'assetReferencePublicId must be a valid asset reference public identifier.',
  })
  assetReferencePublicId!: string;
}
