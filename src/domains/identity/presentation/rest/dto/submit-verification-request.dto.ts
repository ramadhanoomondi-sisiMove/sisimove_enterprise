// src/domains/identity/presentation/rest/dto/submit-verification-request.dto.ts

import { IsEnum, IsObject, IsOptional, IsUUID } from 'class-validator';

import { VerificationRequestType } from '../../../domain/enums/verification-request-type.enum';

export class SubmitVerificationRequestDto {
  @IsEnum(VerificationRequestType)
  type!: VerificationRequestType;

  @IsUUID()
  assetPublicId!: string;

  @IsOptional()
  @IsObject()
  metadata?: Readonly<Record<string, unknown>>;
}
