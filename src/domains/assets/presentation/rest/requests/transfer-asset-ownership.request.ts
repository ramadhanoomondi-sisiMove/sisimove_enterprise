// src/domains/asset/presentation/rest/requests/transfer-asset-ownership.request.ts

import { ApiProperty } from '@nestjs/swagger';
import { Transform, type TransformFnParams } from 'class-transformer';
import { IsString, Matches } from 'class-validator';

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class TransferAssetOwnershipRequest {
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
    example: 'IDT-WQC6Y7G',
    description: 'Public identifier of the new asset owner.',
  })
  @Transform(trimString)
  @IsString()
  @Matches(/^IDT-[A-Z0-9]+$/, {
    message:
      'newOwnerIdentityPublicId must be a valid public identity identifier.',
  })
  newOwnerIdentityPublicId!: string;
}
