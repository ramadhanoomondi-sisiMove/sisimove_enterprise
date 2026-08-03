// src/domains/asset/presentation/rest/requests/bulk-delete-assets.request.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, type TransformFnParams } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class BulkDeleteAssetsRequest {
  @ApiProperty({
    description: 'Public identifiers of the assets to delete.',
    type: [String],
    example: ['AST-X7Q29KD', 'AST-M8A21PQ', 'AST-R4T83LW'],
    minItems: 1,
    maxItems: 100,
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  @Transform(({ value }: TransformFnParams): unknown => {
    if (!Array.isArray(value)) {
      return value;
    }

    return value.map((item): unknown =>
      typeof item === 'string' ? item.trim() : item,
    );
  })
  @IsString({ each: true })
  @Matches(/^AST-[A-Z0-9]+$/, {
    each: true,
    message: 'Each assetPublicId must be a valid asset public identifier.',
  })
  assetPublicIds!: string[];

  @ApiPropertyOptional({
    example: false,
    description:
      'If true, permanently deletes the assets instead of performing a soft delete.',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  permanent?: boolean;

  @ApiPropertyOptional({
    example: true,
    description:
      'Continue processing the remaining assets if one deletion fails.',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  continueOnError?: boolean;
}
