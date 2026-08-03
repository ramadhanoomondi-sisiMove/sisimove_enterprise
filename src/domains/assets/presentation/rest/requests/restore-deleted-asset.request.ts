// src/domains/asset/presentation/rest/requests/restore-deleted-asset.request.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, type TransformFnParams } from 'class-transformer';
import {
  IsBoolean,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class RestoreDeletedAssetRequest {
  @ApiProperty({
    example: 'AST-7JYQ8M4P',
    description: 'Public identifier of the deleted asset to restore.',
  })
  @Transform(trimString)
  @IsString()
  @Matches(/^AST-[A-Z0-9]+$/, {
    message: 'assetPublicId must be a valid public asset identifier.',
  })
  assetPublicId!: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Restore all generated variants associated with the asset.',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  restoreVariants?: boolean;

  @ApiPropertyOptional({
    example: true,
    description:
      'Restore the physical object from archival storage if supported.',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  restoreStorageObject?: boolean;

  @ApiPropertyOptional({
    example: 'Asset restored after accidental deletion.',
    description: 'Optional reason for restoring the deleted asset.',
    maxLength: 500,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}
