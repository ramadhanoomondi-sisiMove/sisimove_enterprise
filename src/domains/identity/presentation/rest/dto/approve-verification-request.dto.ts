// src/domains/identity/presentation/rest/dto/approve-verification-request.dto.ts

import { IsUUID } from 'class-validator';

export class ApproveVerificationRequestDto {
  @IsUUID()
  reviewerIdentityPublicId!: string;
}
