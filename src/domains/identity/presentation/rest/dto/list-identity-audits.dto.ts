// src/domains/identity/presentation/rest/dto/list-identity-audits.dto.ts

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, type TransformFnParams } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';

import { AuditActorType } from '@prisma/client';
import { AuditResourceType } from '@prisma/client';
import { AuditResult } from '@prisma/client';
import { AuditSeverity } from '@prisma/client';
import { IdentityAuditEventType } from '@prisma/client';

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class ListIdentityAuditsDto {
  @ApiPropertyOptional({
    example: 'IDT-WQC6Y7G',
    description: 'Filter by identity public identifier.',
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @Matches(/^IDT-[A-Z0-9]+$/, {
    message: 'identityId must be a valid public identity identifier.',
  })
  identityId?: string;

  @ApiPropertyOptional({
    example: 'IDT-XA82NQ1',
    description: 'Filter by actor identity public identifier.',
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @Matches(/^IDT-[A-Z0-9]+$/, {
    message: 'actorIdentityId must be a valid public identity identifier.',
  })
  actorIdentityId?: string;

  @ApiPropertyOptional({
    enum: AuditActorType,
    example: AuditActorType.IDENTITY,
    description: 'Filter by actor type.',
  })
  @IsOptional()
  @IsEnum(AuditActorType)
  actorType?: AuditActorType;

  @ApiPropertyOptional({
    enum: IdentityAuditEventType,
    description: 'Filter by audit event type.',
  })
  @IsOptional()
  @IsEnum(IdentityAuditEventType)
  eventType?: IdentityAuditEventType;

  @ApiPropertyOptional({
    enum: AuditSeverity,
    example: AuditSeverity.INFORMATION,
    description: 'Filter by audit severity.',
  })
  @IsOptional()
  @IsEnum(AuditSeverity)
  severity?: AuditSeverity;

  @ApiPropertyOptional({
    enum: AuditResult,
    example: AuditResult.SUCCESS,
    description: 'Filter by audit result.',
  })
  @IsOptional()
  @IsEnum(AuditResult)
  result?: AuditResult;

  @ApiPropertyOptional({
    enum: AuditResourceType,
    description: 'Filter by resource type.',
  })
  @IsOptional()
  @IsEnum(AuditResourceType)
  resourceType?: AuditResourceType;

  @ApiPropertyOptional({
    example: 'DEV-9Q2K7L',
    description: 'Filter by resource public identifier.',
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  resourcePublicId?: string;

  @ApiPropertyOptional({
    example: 'c7e0cdb4-64ba-4c73-8b71-f61b8a2d4af2',
    description: 'Filter by correlation identifier.',
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  correlationId?: string;

  @ApiPropertyOptional({
    example: '2026-01-01T00:00:00.000Z',
    description: 'Return audits occurring on or after this date.',
  })
  @IsOptional()
  @IsDateString()
  occurredFrom?: string;

  @ApiPropertyOptional({
    example: '2026-12-31T23:59:59.999Z',
    description: 'Return audits occurring on or before this date.',
  })
  @IsOptional()
  @IsDateString()
  occurredTo?: string;

  @ApiPropertyOptional({
    example: 100,
    default: 100,
    minimum: 1,
    maximum: 500,
    description: 'Maximum number of audit records to return.',
  })
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(500)
  limit?: number;

  @ApiPropertyOptional({
    example: 0,
    default: 0,
    minimum: 0,
    description: 'Number of records to skip.',
  })
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsOptional()
  @IsInt()
  @Min(0)
  offset?: number;
}
