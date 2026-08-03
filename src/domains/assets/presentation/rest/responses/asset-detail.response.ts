// src/domains/asset/presentation/rest/responses/asset-detail.response.ts

import { ApiProperty } from '@nestjs/swagger';

import { AssetResponse } from './asset.response';
import { AssetVariantResponse } from './asset-variant.response';
import { AssetReferenceResponse } from './asset-reference.response';
import { AssetProcessingResponse } from './asset-processing.response';
import { AssetScanResponse } from './asset-scan.response';
import { AssetModerationResponse } from './asset-moderation.response';

export class AssetDetailResponse {
  @ApiProperty({
    type: AssetResponse,
  })
  asset!: AssetResponse;

  @ApiProperty({
    type: () => [AssetVariantResponse],
  })
  variants!: AssetVariantResponse[];

  @ApiProperty({
    type: () => [AssetReferenceResponse],
  })
  references!: AssetReferenceResponse[];

  @ApiProperty({
    type: () => [AssetProcessingResponse],
  })
  processings!: AssetProcessingResponse[];

  @ApiProperty({
    type: () => [AssetScanResponse],
  })
  scans!: AssetScanResponse[];

  @ApiProperty({
    type: () => [AssetModerationResponse],
  })
  moderations!: AssetModerationResponse[];
}
