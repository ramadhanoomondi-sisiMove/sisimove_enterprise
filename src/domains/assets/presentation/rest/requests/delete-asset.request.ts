// src/domains/asset/application/requests/delete-asset.request.ts

import { ApiProperty } from '@nestjs/swagger';
import { Transform, type TransformFnParams } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, Matches } from 'class-validator';

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class DeleteAssetRequest {
  @ApiProperty({
    example: 'AST-7JYQ8M4P',
    description: 'Public identifier of the asset to permanently delete.',
  })
  @Transform(trimString)
  @IsString()
  @Matches(/^AST-[A-Z0-9]+$/, {
    message: 'assetPublicId must be a valid asset public identifier.',
  })
  assetPublicId!: string;

  @ApiProperty({
    example: true,
    description:
      'Force permanent deletion even if the asset is referenced elsewhere.',
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  force?: boolean;

  @ApiProperty({
    example: true,
    description:
      'Delete all generated variants together with the original asset.',
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  deleteVariants?: boolean;

  @ApiProperty({
    example: true,
    description: 'Delete the physical object from the storage provider.',
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  deleteStorageObject?: boolean;

  @ApiProperty({
    example: false,
    description: 'Retain audit records and metadata after deletion.',
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  retainAuditTrail?: boolean;

  @ApiProperty({
    example: 'User requested permanent account deletion.',
    description: 'Reason for permanently deleting the asset.',
    required: false,
  })
  @IsOptional()
  @Transform(trimString)
  @IsString()
  reason?: string;
}
