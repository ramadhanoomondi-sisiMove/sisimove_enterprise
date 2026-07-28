// src/domains/identity/presentation/rest/dto/revoke-verification.dto.ts

import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class RevokeVerificationDto {
  @IsUUID()
  reviewerIdentityPublicId!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  revocationReason!: string;
}
