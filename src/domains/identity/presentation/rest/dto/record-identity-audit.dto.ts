// src/domains/identity/presentation/rest/dto/record-identity-audit.dto.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, type TransformFnParams } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

import {
  AuditActorType,
  AuditResourceType,
  AuditResult,
  AuditSeverity,
  IdentityAuditEventType,
} from '@prisma/client';

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class RecordIdentityAuditDto {
  @ApiPropertyOptional({
    example: 'IDT-WQC6Y7G',
    description: 'Public identifier of the affected identity.',
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @Matches(/^IDT-[A-Z0-9]+$/, {
    message: 'identityId must be a valid public identity identifier.',
  })
  identityId?: string;

  @ApiPropertyOptional({
    example: 'IDT-X8N3R7P',
    description: 'Public identifier of the actor identity.',
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @Matches(/^IDT-[A-Z0-9]+$/, {
    message: 'actorIdentityId must be a valid public identity identifier.',
  })
  actorIdentityId?: string;

  @ApiProperty({
    enum: AuditActorType,
    description: 'Type of actor that performed the action.',
  })
  @IsEnum(AuditActorType)
  actorType!: AuditActorType;

  @ApiProperty({
    enum: IdentityAuditEventType,
    description: 'Identity audit event type.',
  })
  @IsEnum(IdentityAuditEventType)
  eventType!: IdentityAuditEventType;

  @ApiProperty({
    enum: AuditSeverity,
    description: 'Severity of the audit event.',
  })
  @IsEnum(AuditSeverity)
  severity!: AuditSeverity;

  @ApiProperty({
    enum: AuditResult,
    description: 'Result of the audited operation.',
  })
  @IsEnum(AuditResult)
  result!: AuditResult;

  @ApiProperty({
    enum: AuditResourceType,
    description: 'Type of the affected resource.',
  })
  @IsEnum(AuditResourceType)
  resourceType!: AuditResourceType;

  @ApiPropertyOptional({
    example: 'DEV-A9K8L3P',
    description: 'Public identifier of the affected resource.',
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  resourcePublicId?: string;

  @ApiPropertyOptional({
    example: '2026-07-29T10:15:00.000Z',
    description: 'Time at which the audited event occurred.',
  })
  @IsOptional()
  @IsDateString()
  occurredAt?: string;

  @ApiPropertyOptional({
    example: '192.168.1.25',
    description: 'Client IP address.',
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiPropertyOptional({
    example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    description: 'Client User-Agent.',
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  userAgent?: string;

  @ApiPropertyOptional({
    type: Object,
    example: {
      sessionId: 'SES-9HF73LQ',
      deviceId: 'DEV-A9K8L3P',
      reason: 'MFA verification failed',
    },
    description: 'Additional structured audit metadata.',
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
