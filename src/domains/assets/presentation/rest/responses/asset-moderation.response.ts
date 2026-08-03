import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { BaseResponse } from './base.response';

import {
  AssetModerationStatus,
  AssetModerationType,
} from '../../../domain/value-objects';

export class AssetModerationResponse extends BaseResponse {
  @ApiProperty({
    enum: AssetModerationType,
    example: AssetModerationType.AI,
  })
  type!: AssetModerationType;

  @ApiProperty({
    enum: AssetModerationStatus,
    example: AssetModerationStatus.APPROVED,
  })
  status!: AssetModerationStatus;

  @ApiPropertyOptional({
    example: 'IDT-WQC6Y7G',
    description: 'Public identifier of the moderator that reviewed the asset.',
  })
  moderatorIdentityPublicId?: string | null;

  @ApiPropertyOptional({
    example: 0.98,
    minimum: 0,
    maximum: 1,
  })
  confidence?: number | null;

  @ApiPropertyOptional({
    example: 'Content complies with moderation policies.',
  })
  reason?: string | null;

  @ApiPropertyOptional({
    type: Object,
    additionalProperties: true,
    example: {
      provider: 'OpenAI',
      model: 'omni-moderation',
      categories: {
        violence: false,
        sexual: false,
        hate: false,
      },
    },
  })
  metadata?: Record<string, unknown> | null;

  @ApiPropertyOptional({
    example: '2026-08-03T10:35:00.000Z',
  })
  moderatedAt?: Date | null;
}
