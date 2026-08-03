import { ApiProperty } from '@nestjs/swagger';

import { BaseResponse } from './base.response';

import {
  AssetReferenceField,
  AssetResourceType,
} from '../../../domain/value-objects';

export class AssetReferenceResponse extends BaseResponse {
  @ApiProperty({
    enum: AssetResourceType,
    example: AssetResourceType.IDENTITY,
  })
  resourceType!: AssetResourceType;

  @ApiProperty({
    example: 'IDT-WQC6Y7G',
  })
  resourcePublicId!: string;

  @ApiProperty({
    enum: AssetReferenceField,
    example: AssetReferenceField.AVATAR,
  })
  referenceField!: AssetReferenceField;
}
