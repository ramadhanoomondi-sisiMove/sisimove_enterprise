// -----------------------------------------------------------------------------
// Commercial Commission Rule — HTTP Controller
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

// -----------------------------------------------------------------------------
// Swagger
// -----------------------------------------------------------------------------

import { ApiTags } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Identity — Authentication & Authorization
// -----------------------------------------------------------------------------

import {
  JwtAuthGuard,
  PermissionsGuard,
  RequirePermissions,
} from '../../../../../foundation/security/auth';

// -----------------------------------------------------------------------------
// Foundation — Application
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { COMMERCIAL_COMMISSION_RULE_TOKENS } from '../../../application/commercial-commission-rule.tokens';

// -----------------------------------------------------------------------------
// Application — Commands
// -----------------------------------------------------------------------------

import {
  ActivateCommercialCommissionRuleCommand,
  CreateCommercialCommissionRuleCommand,
  DeactivateCommercialCommissionRuleCommand,
  UpdateCommercialCommissionRuleCommand,
} from '../../../application/commands';

// -----------------------------------------------------------------------------
// Application — Queries
// -----------------------------------------------------------------------------

import {
  GetActiveCommercialCommissionRuleQuery,
  GetCommercialCommissionRuleByTypeQuery,
  GetCommercialCommissionRuleQuery,
  ListCommercialCommissionRulesQuery,
} from '../../../application/queries';

// -----------------------------------------------------------------------------
// Domain — Aggregates
// -----------------------------------------------------------------------------

import type { CommercialCommissionRuleAggregate } from '../../../domain/aggregates/commercial-commission-rule.aggregate';

// -----------------------------------------------------------------------------
// Domain — Entities
// -----------------------------------------------------------------------------

import type { CommercialCommissionRuleEntity } from '../../../domain/entities/commercial-commission-rule.entity';

// -----------------------------------------------------------------------------
// Domain — Value Objects
// -----------------------------------------------------------------------------

import {
  CommercialCommissionPercentage,
  CommercialCommissionRuleEffectiveFrom,
  CommercialCommissionRuleEffectiveTo,
  CommercialCommissionRulePublicId,
  CommercialCommissionRuleVersion,
  CommercialCommissionType,
} from '../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Presentation — Request DTOs
// -----------------------------------------------------------------------------

import {
  ActivateCommercialCommissionRuleDto,
  CreateCommercialCommissionRuleDto,
  DeactivateCommercialCommissionRuleDto,
  UpdateCommercialCommissionRuleDto,
} from '../dto/request';

// -----------------------------------------------------------------------------
// Presentation — Query DTOs
// -----------------------------------------------------------------------------

import {
  GetActiveCommercialCommissionRuleQueryDto,
  GetCommercialCommissionRuleByTypeQueryDto,
} from '../dto/query';

// -----------------------------------------------------------------------------
// Controller
// -----------------------------------------------------------------------------

@ApiTags('Commercial Commission Rules')
@Controller('commercial-commission-rules')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CommercialCommissionRuleController {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    // -------------------------------------------------------------------------
    // Command Handlers
    // -------------------------------------------------------------------------

    @Inject(COMMERCIAL_COMMISSION_RULE_TOKENS.COMMAND_HANDLERS.CREATE)
    private readonly createCommercialCommissionRuleHandler: CommandHandler<
      CreateCommercialCommissionRuleCommand,
      CommercialCommissionRuleAggregate
    >,

    @Inject(COMMERCIAL_COMMISSION_RULE_TOKENS.COMMAND_HANDLERS.ACTIVATE)
    private readonly activateCommercialCommissionRuleHandler: CommandHandler<
      ActivateCommercialCommissionRuleCommand,
      CommercialCommissionRuleAggregate
    >,

    @Inject(COMMERCIAL_COMMISSION_RULE_TOKENS.COMMAND_HANDLERS.UPDATE)
    private readonly updateCommercialCommissionRuleHandler: CommandHandler<
      UpdateCommercialCommissionRuleCommand,
      CommercialCommissionRuleAggregate
    >,

    @Inject(COMMERCIAL_COMMISSION_RULE_TOKENS.COMMAND_HANDLERS.DEACTIVATE)
    private readonly deactivateCommercialCommissionRuleHandler: CommandHandler<
      DeactivateCommercialCommissionRuleCommand,
      CommercialCommissionRuleAggregate
    >,

    // -------------------------------------------------------------------------
    // Query Handlers
    // -------------------------------------------------------------------------

    @Inject(COMMERCIAL_COMMISSION_RULE_TOKENS.QUERY_HANDLERS.GET)
    private readonly getCommercialCommissionRuleHandler: QueryHandler<
      GetCommercialCommissionRuleQuery,
      CommercialCommissionRuleAggregate | null
    >,

    @Inject(COMMERCIAL_COMMISSION_RULE_TOKENS.QUERY_HANDLERS.GET_BY_TYPE)
    private readonly getCommercialCommissionRuleByTypeHandler: QueryHandler<
      GetCommercialCommissionRuleByTypeQuery,
      CommercialCommissionRuleAggregate | null
    >,

    @Inject(COMMERCIAL_COMMISSION_RULE_TOKENS.QUERY_HANDLERS.GET_ACTIVE)
    private readonly getActiveCommercialCommissionRuleHandler: QueryHandler<
      GetActiveCommercialCommissionRuleQuery,
      CommercialCommissionRuleAggregate | null
    >,

    @Inject(COMMERCIAL_COMMISSION_RULE_TOKENS.QUERY_HANDLERS.LIST)
    private readonly listCommercialCommissionRulesHandler: QueryHandler<
      ListCommercialCommissionRulesQuery,
      CommercialCommissionRuleEntity[]
    >,
  ) {}

  // ===========================================================================
  // Queries
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // List Commercial Commission Rules
  // ---------------------------------------------------------------------------

  @Get()
  @RequirePermissions('commercial-commission-rule:read')
  public async list(): Promise<CommercialCommissionRuleEntity[]> {
    return this.listCommercialCommissionRulesHandler.execute(
      new ListCommercialCommissionRulesQuery(),
    );
  }

  // ---------------------------------------------------------------------------
  // Get Active Commercial Commission Rule
  // ---------------------------------------------------------------------------

  @Get('active')
  @RequirePermissions('commercial-commission-rule:read')
  public async getActive(
    @Query() dto: GetActiveCommercialCommissionRuleQueryDto,
  ): Promise<CommercialCommissionRuleAggregate | null> {
    return this.getActiveCommercialCommissionRuleHandler.execute(
      new GetActiveCommercialCommissionRuleQuery(
        CommercialCommissionType.create(dto.type),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Get Commercial Commission Rule By Type
  // ---------------------------------------------------------------------------

  @Get('by-type')
  @RequirePermissions('commercial-commission-rule:read')
  public async getByType(
    @Query() dto: GetCommercialCommissionRuleByTypeQueryDto,
  ): Promise<CommercialCommissionRuleAggregate | null> {
    return this.getCommercialCommissionRuleByTypeHandler.execute(
      new GetCommercialCommissionRuleByTypeQuery(
        CommercialCommissionType.create(dto.type),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Get Commercial Commission Rule By Public ID
  // ---------------------------------------------------------------------------

  @Get(':commercialCommissionRulePublicId')
  @RequirePermissions('commercial-commission-rule:read')
  public async get(
    @Param('commercialCommissionRulePublicId')
    commercialCommissionRulePublicId: string,
  ): Promise<CommercialCommissionRuleAggregate | null> {
    return this.getCommercialCommissionRuleHandler.execute(
      new GetCommercialCommissionRuleQuery(
        new CommercialCommissionRulePublicId(commercialCommissionRulePublicId),
      ),
    );
  }

  // ===========================================================================
  // Commands
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Create Commercial Commission Rule
  // ---------------------------------------------------------------------------

  @Post()
  @RequirePermissions('commercial-commission-rule:create')
  public async create(
    @Body() dto: CreateCommercialCommissionRuleDto,
  ): Promise<CommercialCommissionRuleAggregate> {
    return this.createCommercialCommissionRuleHandler.execute(
      new CreateCommercialCommissionRuleCommand(
        CommercialCommissionType.create(dto.type),

        CommercialCommissionPercentage.create(dto.percentage),

        CommercialCommissionRuleEffectiveFrom.create(dto.effectiveFrom),

        dto.effectiveTo !== undefined
          ? CommercialCommissionRuleEffectiveTo.create(dto.effectiveTo)
          : undefined,

        CommercialCommissionRuleVersion.create(dto.version),

        dto.correlationId,
        dto.causationId,
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Update Commercial Commission Rule
  // ---------------------------------------------------------------------------

  @Post(':commercialCommissionRulePublicId/update')
  @RequirePermissions('commercial-commission-rule:update')
  public async update(
    @Param('commercialCommissionRulePublicId')
    commercialCommissionRulePublicId: string,
    @Body() dto: UpdateCommercialCommissionRuleDto,
  ): Promise<CommercialCommissionRuleAggregate> {
    return this.updateCommercialCommissionRuleHandler.execute(
      new UpdateCommercialCommissionRuleCommand(
        new CommercialCommissionRulePublicId(commercialCommissionRulePublicId),

        CommercialCommissionType.create(dto.type),

        CommercialCommissionPercentage.create(dto.percentage),

        CommercialCommissionRuleEffectiveFrom.create(dto.effectiveFrom),

        dto.effectiveTo !== undefined
          ? CommercialCommissionRuleEffectiveTo.create(dto.effectiveTo)
          : undefined,

        CommercialCommissionRuleVersion.create(dto.version),

        new Date(dto.updatedAt),

        dto.correlationId,
        dto.causationId,
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Activate Commercial Commission Rule
  // ---------------------------------------------------------------------------

  @Post(':commercialCommissionRulePublicId/activate')
  @RequirePermissions('commercial-commission-rule:activate')
  public async activate(
    @Param('commercialCommissionRulePublicId')
    commercialCommissionRulePublicId: string,
    @Body() dto: ActivateCommercialCommissionRuleDto,
  ): Promise<CommercialCommissionRuleAggregate> {
    return this.activateCommercialCommissionRuleHandler.execute(
      new ActivateCommercialCommissionRuleCommand(
        new CommercialCommissionRulePublicId(commercialCommissionRulePublicId),
        new Date(dto.activatedAt),
        dto.correlationId,
        dto.causationId,
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Deactivate Commercial Commission Rule
  // ---------------------------------------------------------------------------

  @Post(':commercialCommissionRulePublicId/deactivate')
  @RequirePermissions('commercial-commission-rule:deactivate')
  public async deactivate(
    @Param('commercialCommissionRulePublicId')
    commercialCommissionRulePublicId: string,
    @Body() dto: DeactivateCommercialCommissionRuleDto,
  ): Promise<CommercialCommissionRuleAggregate> {
    return this.deactivateCommercialCommissionRuleHandler.execute(
      new DeactivateCommercialCommissionRuleCommand(
        new CommercialCommissionRulePublicId(commercialCommissionRulePublicId),
        new Date(dto.deactivatedAt),
        dto.correlationId,
        dto.causationId,
      ),
    );
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CommercialCommissionRuleController;
