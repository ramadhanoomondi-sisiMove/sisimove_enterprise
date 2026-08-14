// src/domains/social/presentation/rest/dto/change-traveller-profile-avatar.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ChangeTravellerProfileAvatarDto {
  @ApiProperty({
    example: 'AST-ABC12345',
    description: 'Public ID of the new avatar asset',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  avatarAssetPublicId?: string | null;
}
