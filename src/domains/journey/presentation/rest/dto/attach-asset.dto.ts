import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

import { JourneyAssetType } from '../../../domain/value-objects/journey-asset-type.vo';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * Request body for attaching an external Asset to a Journey.
 *
 * The Journey public ID is supplied by the route:
 *
 *     POST /journeys/:journeyPublicId/assets
 *
 * The asset itself belongs to the Asset domain and is referenced by its
 * public ID. The JourneyAsset child entity is created by the application
 * layer and attached to the Journey aggregate.
 *
 * Correlation and causation identifiers are application concerns and are
 * therefore not supplied by the HTTP client.
 */
export class AttachAssetDto {
  @ApiProperty({
    example: 'AST-ABC12345',
    description: 'Public ID of the external Asset to attach to the Journey.',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  assetPublicId!: string;

  @ApiProperty({
    enum: JourneyAssetType,
    example: JourneyAssetType.GALLERY,
    description: 'Role of the Asset within the Journey.',
  })
  @IsEnum(JourneyAssetType)
  type!: JourneyAssetType;

  @ApiProperty({
    example: 0,
    description:
      'Zero-based display order of the Asset within the Journey assets.',
  })
  @IsNumber()
  @Min(0)
  sortOrder!: number;
}
