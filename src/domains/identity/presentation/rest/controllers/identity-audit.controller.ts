// src/domains/identity/presentation/rest/identity-audit.controller.ts

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import type { Prisma } from '@prisma/client';

import { CorrelationId } from '../../../../../foundation/logging/correlation-id';

import { RecordIdentityAuditCommand } from '../../../application/commands/record-identity-audit.command';

import { RecordIdentityAuditHandler } from '../../../application/handlers/record-identity-audit.handler';

import { GetIdentityAuditHandler } from '../../../application/handlers/query-handlers/get-identity-audit.handler';
import { ListIdentityAuditsHandler } from '../../../application/handlers/query-handlers/list-identity-audits.handler';

import { GetIdentityAuditQuery } from '../../../application/queries/get-identity-audit.query';
import { ListIdentityAuditsQuery } from '../../../application/queries/list-identity-audits.query';

import type { IdentityAuditAggregate } from '../../../domain/aggregates/identity-audit.aggregate';

import { AuditActorType } from '../../../domain/value-objects/audit-actor-type.vo';
import { AuditContext } from '../../../domain/value-objects/audit-context.vo';
import { AuditCorrelationId } from '../../../domain/value-objects/audit-correlation-id.vo';
import { IdentityAuditEventType } from '../../../domain/value-objects/identity-audit-event-type.vo';
import { AuditMetadata } from '../../../domain/value-objects/audit-metadata.vo';
import { AuditResourceType } from '../../../domain/value-objects/audit-resource-type.vo';
import { AuditResult } from '../../../domain/value-objects/audit-result.vo';
import { AuditSeverity } from '../../../domain/value-objects/audit-severity.vo';

import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/permissions.guard';
import { RequirePermissions } from '../../auth/require-permissions.decorator';

import { ListIdentityAuditsDto } from '../dto/list-identity-audits.dto';
import { RecordIdentityAuditDto } from '../dto/record-identity-audit.dto';

@ApiTags('Identity Audits')
@ApiBearerAuth()
@Controller('identity-audits')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class IdentityAuditController {
  constructor(
    private readonly recordIdentityAuditHandler: RecordIdentityAuditHandler,
    private readonly getIdentityAuditHandler: GetIdentityAuditHandler,
    private readonly listIdentityAuditsHandler: ListIdentityAuditsHandler,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequirePermissions('IDENTITY_AUDIT_RECORD')
  @ApiOperation({
    summary: 'Record identity audit',
    description: 'Records a new identity audit event.',
  })
  @ApiCreatedResponse({
    description: 'Identity audit recorded successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required.',
  })
  @ApiForbiddenResponse({
    description: 'Insufficient permissions.',
  })
  async record(
    @Body() dto: RecordIdentityAuditDto,
  ): Promise<{ message: string }> {
    await this.recordIdentityAuditHandler.execute(
      new RecordIdentityAuditCommand(
        dto.identityId,
        dto.actorIdentityId,
        new AuditActorType(dto.actorType),
        new IdentityAuditEventType(dto.eventType),
        new AuditSeverity(dto.severity),
        new AuditResult(dto.result),
        new AuditResourceType(dto.resourceType),
        dto.resourcePublicId,
        new AuditCorrelationId(CorrelationId.generate()),
        new AuditContext(dto.ipAddress, dto.userAgent),
        new AuditMetadata((dto.metadata ?? {}) as Prisma.InputJsonObject),
        dto.occurredAt !== undefined ? new Date(dto.occurredAt) : new Date(),
      ),
    );

    return {
      message: 'Identity audit recorded successfully',
    };
  }

  @Get(':publicId')
  @RequirePermissions('IDENTITY_AUDIT_VIEW')
  @ApiOperation({
    summary: 'Get identity audit',
    description: 'Returns an identity audit by its public identifier.',
  })
  @ApiOkResponse({
    description: 'Identity audit retrieved successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required.',
  })
  @ApiForbiddenResponse({
    description: 'Insufficient permissions.',
  })
  async get(
    @Param('publicId') publicId: string,
  ): Promise<IdentityAuditAggregate> {
    return this.getIdentityAuditHandler.execute(
      new GetIdentityAuditQuery(publicId),
    );
  }

  @Get()
  @RequirePermissions('IDENTITY_AUDIT_VIEW')
  @ApiOperation({
    summary: 'List identity audits',
    description:
      'Returns identity audit records matching the supplied filters.',
  })
  @ApiOkResponse({
    description: 'Identity audits retrieved successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required.',
  })
  @ApiForbiddenResponse({
    description: 'Insufficient permissions.',
  })
  async list(
    @Query() dto: ListIdentityAuditsDto,
  ): Promise<readonly IdentityAuditAggregate[]> {
    return this.listIdentityAuditsHandler.execute(
      new ListIdentityAuditsQuery(
        dto.identityId,
        dto.actorIdentityId,
        dto.actorType,
        dto.eventType,
        dto.severity,
        dto.result,
        dto.resourceType,
        dto.resourcePublicId,
        dto.correlationId,
        dto.occurredFrom !== undefined ? new Date(dto.occurredFrom) : undefined,
        dto.occurredTo !== undefined ? new Date(dto.occurredTo) : undefined,
        dto.limit,
        dto.offset,
      ),
    );
  }
}
