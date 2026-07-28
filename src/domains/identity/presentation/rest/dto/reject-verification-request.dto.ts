// src/domains/identity/presentation/rest/dto/reject-verification-request.dto.ts

import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class RejectVerificationRequestDto {
  @IsUUID()
  reviewerIdentityPublicId!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  rejectionReason!: string;
}
