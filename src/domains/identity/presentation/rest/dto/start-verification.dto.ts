// src/domains/identity/presentation/rest/dto/start-verification.dto.ts

import { IsUUID } from 'class-validator';

export class StartVerificationDto {
  @IsUUID()
  identityPublicId!: string;
}
