// -----------------------------------------------------------------------------
// Commercial Earning Commission — HTTP Controller
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
} from '../../../../identity/presentation/auth';

// -----------------------------------------------------------------------------
// Foundation — Application
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { COMMERCIAL_EARNING_COMMISSION_TOKENS } from '../../../application/commercial-earning-commission.tokens';

// -----------------------------------------------------------------------------
// Application — Commands
// -----------------------------------------------------------------------------

import {
  AssessCommercialEarningCommissionCommand,
  CancelCommercialEarningCommissionCommand,
  CreateCommercialEarningCommissionCommand,
} from '../../../application/commands';

// -----------------------------------------------------------------------------
// Application — Queries
// -----------------------------------------------------------------------------

import {
  GetCommercialEarningCommissionBySettlementQuery,
  GetCommercialEarningCommissionQuery,
  GetCommercialEarningCommissionsByJourneyQuery,
  GetCommercialEarningCommissionsByProviderQuery,
  ListCommercialEarningCommissionsQuery,
} from '../../../application/queries';

// -----------------------------------------------------------------------------
// Domain — Aggregates
// -----------------------------------------------------------------------------

import type { CommercialEarningCommissionAggregate } from '../../../domain/aggregates/commercial-earning-commission.aggregate';

// -----------------------------------------------------------------------------
// Domain — Value Objects
// -----------------------------------------------------------------------------

import {
  CommercialCommissionRulePublicId,
  CommercialEarningCommissionAmount,
  CommercialEarningCommissionBaseAmount,
  CommercialEarningCommissionCurrency,
  CommercialEarningCommissionJourneyPublicId,
  CommercialEarningCommissionNetAmount,
  CommercialEarningCommissionPercentage,
  CommercialEarningCommissionProviderPublicId,
  CommercialEarningCommissionPublicId,
  CommercialEarningCommissionSettlementPublicId,
} from '../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Presentation — Request DTOs
// -----------------------------------------------------------------------------

import {
  AssessCommercialEarningCommissionDto,
  CancelCommercialEarningCommissionDto,
  CreateCommercialEarningCommissionDto,
} from '../dto/request';

// -----------------------------------------------------------------------------
// Presentation — Query DTOs
// -----------------------------------------------------------------------------

import {
  GetCommercialEarningCommissionBySettlementQueryDto,
  GetCommercialEarningCommissionsByJourneyQueryDto,
  GetCommercialEarningCommissionsByProviderQueryDto,
} from '../dto/query';

// -----------------------------------------------------------------------------
// Controller
// -----------------------------------------------------------------------------

@ApiTags('Commercial Earning Commissions')
@Controller('commercial-earning-commissions')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CommercialEarningCommissionController {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    // -------------------------------------------------------------------------
    // Command Handlers
    // -------------------------------------------------------------------------

    @Inject(COMMERCIAL_EARNING_COMMISSION_TOKENS.COMMAND_HANDLERS.CREATE)
    private readonly createCommercialEarningCommissionHandler: CommandHandler<
      CreateCommercialEarningCommissionCommand,
      CommercialEarningCommissionAggregate
    >,

    @Inject(COMMERCIAL_EARNING_COMMISSION_TOKENS.COMMAND_HANDLERS.ASSESS)
    private readonly assessCommercialEarningCommissionHandler: CommandHandler<
      AssessCommercialEarningCommissionCommand,
      CommercialEarningCommissionAggregate
    >,

    @Inject(COMMERCIAL_EARNING_COMMISSION_TOKENS.COMMAND_HANDLERS.CANCEL)
    private readonly cancelCommercialEarningCommissionHandler: CommandHandler<
      CancelCommercialEarningCommissionCommand,
      CommercialEarningCommissionAggregate
    >,

    // -------------------------------------------------------------------------
    // Query Handlers
    // -------------------------------------------------------------------------

    @Inject(COMMERCIAL_EARNING_COMMISSION_TOKENS.QUERY_HANDLERS.GET)
    private readonly getCommercialEarningCommissionHandler: QueryHandler<
      GetCommercialEarningCommissionQuery,
      CommercialEarningCommissionAggregate | null
    >,

    @Inject(
      COMMERCIAL_EARNING_COMMISSION_TOKENS.QUERY_HANDLERS.GET_BY_SETTLEMENT,
    )
    private readonly getCommercialEarningCommissionBySettlementHandler: QueryHandler<
      GetCommercialEarningCommissionBySettlementQuery,
      CommercialEarningCommissionAggregate | null
    >,

    @Inject(COMMERCIAL_EARNING_COMMISSION_TOKENS.QUERY_HANDLERS.GET_BY_JOURNEY)
    private readonly getCommercialEarningCommissionsByJourneyHandler: QueryHandler<
      GetCommercialEarningCommissionsByJourneyQuery,
      CommercialEarningCommissionAggregate[]
    >,

    @Inject(COMMERCIAL_EARNING_COMMISSION_TOKENS.QUERY_HANDLERS.GET_BY_PROVIDER)
    private readonly getCommercialEarningCommissionsByProviderHandler: QueryHandler<
      GetCommercialEarningCommissionsByProviderQuery,
      CommercialEarningCommissionAggregate[]
    >,

    @Inject(COMMERCIAL_EARNING_COMMISSION_TOKENS.QUERY_HANDLERS.LIST)
    private readonly listCommercialEarningCommissionsHandler: QueryHandler<
      ListCommercialEarningCommissionsQuery,
      CommercialEarningCommissionAggregate[]
    >,
  ) {}

  // ===========================================================================
  // Queries
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // List Commercial Earning Commissions
  // ---------------------------------------------------------------------------

  @Get()
  @RequirePermissions('commercial-earning-commission:read')
  public async list(): Promise<CommercialEarningCommissionAggregate[]> {
    return this.listCommercialEarningCommissionsHandler.execute(
      new ListCommercialEarningCommissionsQuery(),
    );
  }

  // ---------------------------------------------------------------------------
  // Get Commercial Earning Commission By Settlement
  // ---------------------------------------------------------------------------

  @Get('by-settlement')
  @RequirePermissions('commercial-earning-commission:read')
  public async getBySettlement(
    @Query() dto: GetCommercialEarningCommissionBySettlementQueryDto,
  ): Promise<CommercialEarningCommissionAggregate | null> {
    const settlementPublicId =
      new CommercialEarningCommissionSettlementPublicId(dto.settlementPublicId);

    return this.getCommercialEarningCommissionBySettlementHandler.execute(
      new GetCommercialEarningCommissionBySettlementQuery(settlementPublicId),
    );
  }

  // ---------------------------------------------------------------------------
  // Get Commercial Earning Commissions By Journey
  // ---------------------------------------------------------------------------

  @Get('by-journey')
  @RequirePermissions('commercial-earning-commission:read')
  public async getByJourney(
    @Query() dto: GetCommercialEarningCommissionsByJourneyQueryDto,
  ): Promise<CommercialEarningCommissionAggregate[]> {
    const journeyPublicId = new CommercialEarningCommissionJourneyPublicId(
      dto.journeyPublicId,
    );

    return this.getCommercialEarningCommissionsByJourneyHandler.execute(
      new GetCommercialEarningCommissionsByJourneyQuery(journeyPublicId),
    );
  }

  // ---------------------------------------------------------------------------
  // Get Commercial Earning Commissions By Provider
  // ---------------------------------------------------------------------------

  @Get('by-provider')
  @RequirePermissions('commercial-earning-commission:read')
  public async getByProvider(
    @Query() dto: GetCommercialEarningCommissionsByProviderQueryDto,
  ): Promise<CommercialEarningCommissionAggregate[]> {
    const providerPublicId = new CommercialEarningCommissionProviderPublicId(
      dto.providerPublicId,
    );

    return this.getCommercialEarningCommissionsByProviderHandler.execute(
      new GetCommercialEarningCommissionsByProviderQuery(providerPublicId),
    );
  }

  // ---------------------------------------------------------------------------
  // Get Commercial Earning Commission By Public ID
  // ---------------------------------------------------------------------------

  @Get(':commercialEarningCommissionPublicId')
  @RequirePermissions('commercial-earning-commission:read')
  public async get(
    @Param('commercialEarningCommissionPublicId')
    commercialEarningCommissionPublicId: string,
  ): Promise<CommercialEarningCommissionAggregate | null> {
    return this.getCommercialEarningCommissionHandler.execute(
      new GetCommercialEarningCommissionQuery(
        new CommercialEarningCommissionPublicId(
          commercialEarningCommissionPublicId,
        ),
      ),
    );
  }

  // ===========================================================================
  // Commands
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Create Commercial Earning Commission
  // ---------------------------------------------------------------------------

  @Post()
  @RequirePermissions('commercial-earning-commission:create')
  public async create(
    @Body() dto: CreateCommercialEarningCommissionDto,
  ): Promise<CommercialEarningCommissionAggregate> {
    return this.createCommercialEarningCommissionHandler.execute(
      new CreateCommercialEarningCommissionCommand(
        new CommercialCommissionRulePublicId(dto.commissionRulePublicId),

        new CommercialEarningCommissionJourneyPublicId(dto.journeyPublicId),

        new CommercialEarningCommissionSettlementPublicId(
          dto.settlementPublicId,
        ),

        new CommercialEarningCommissionProviderPublicId(dto.providerPublicId),

        CommercialEarningCommissionPercentage.create(dto.percentage),

        CommercialEarningCommissionBaseAmount.create(dto.baseAmount),

        CommercialEarningCommissionAmount.create(dto.commissionAmount),

        CommercialEarningCommissionNetAmount.create(dto.netAmount),

        CommercialEarningCommissionCurrency.create(dto.currency),

        dto.correlationId,
        dto.causationId,
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Assess Commercial Earning Commission
  // ---------------------------------------------------------------------------

  @Post(':commercialEarningCommissionPublicId/assess')
  @RequirePermissions('commercial-earning-commission:assess')
  public async assess(
    @Param('commercialEarningCommissionPublicId')
    commercialEarningCommissionPublicId: string,
    @Body() dto: AssessCommercialEarningCommissionDto,
  ): Promise<CommercialEarningCommissionAggregate> {
    return this.assessCommercialEarningCommissionHandler.execute(
      new AssessCommercialEarningCommissionCommand(
        new CommercialEarningCommissionPublicId(
          commercialEarningCommissionPublicId,
        ),
        new Date(dto.assessedAt),
        dto.correlationId,
        dto.causationId,
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Cancel Commercial Earning Commission
  // ---------------------------------------------------------------------------

  @Post(':commercialEarningCommissionPublicId/cancel')
  @RequirePermissions('commercial-earning-commission:cancel')
  public async cancel(
    @Param('commercialEarningCommissionPublicId')
    commercialEarningCommissionPublicId: string,
    @Body() dto: CancelCommercialEarningCommissionDto,
  ): Promise<CommercialEarningCommissionAggregate> {
    return this.cancelCommercialEarningCommissionHandler.execute(
      new CancelCommercialEarningCommissionCommand(
        new CommercialEarningCommissionPublicId(
          commercialEarningCommissionPublicId,
        ),
        new Date(dto.cancelledAt),
        dto.correlationId,
        dto.causationId,
      ),
    );
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CommercialEarningCommissionController;
