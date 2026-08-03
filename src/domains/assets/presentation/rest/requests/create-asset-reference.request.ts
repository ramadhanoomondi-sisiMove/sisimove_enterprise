// src/domains/asset/presentation/rest/requests/create-asset-reference.request.ts

import { ApiProperty } from '@nestjs/swagger';
import { Transform, type TransformFnParams } from 'class-transformer';
import { IsEnum, IsString, Matches } from 'class-validator';

import {
  AssetReferenceField,
  AssetResourceType,
} from '../../../domain/value-objects';

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class CreateAssetReferenceRequest {
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
    enum: AssetResourceType,
    example: AssetResourceType.IDENTITY,
    description: 'Type of resource referencing the asset.',
  })
  @IsEnum(AssetResourceType)
  resourceType!: AssetResourceType;

  @ApiProperty({
    example: 'IDT-WQC6Y7G',
    description: 'Public identifier of the referenced resource.',
  })
  @Transform(trimString)
  @IsString()
  @Matches(/^[A-Z]{3}-[A-Z0-9]+$/, {
    message: 'resourcePublicId must be a valid public identifier.',
  })
  resourcePublicId!: string;

  @ApiProperty({
    enum: AssetReferenceField,
    example: AssetReferenceField.AVATAR,
    description: 'Field on the resource that references this asset.',
  })
  @IsEnum(AssetReferenceField)
  referenceField!: AssetReferenceField;
}
