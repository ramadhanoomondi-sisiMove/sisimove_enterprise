// -----------------------------------------------------------------------------
// Commercial Booking Commission — HTTP Controller
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

import { COMMERCIAL_BOOKING_COMMISSION_TOKENS } from '../../../application/commercial-booking-commission.tokens';

// -----------------------------------------------------------------------------
// Application — Commands
// -----------------------------------------------------------------------------

import {
  AssessCommercialBookingCommissionCommand,
  CancelCommercialBookingCommissionCommand,
  CreateCommercialBookingCommissionCommand,
} from '../../../application/commands';

// -----------------------------------------------------------------------------
// Application — Queries
// -----------------------------------------------------------------------------

import {
  GetCommercialBookingCommissionByBookingQuery,
  GetCommercialBookingCommissionByJourneyQuery,
  GetCommercialBookingCommissionQuery,
  ListCommercialBookingCommissionsQuery,
} from '../../../application/queries';

// -----------------------------------------------------------------------------
// Domain — Aggregates
// -----------------------------------------------------------------------------

import type { CommercialBookingCommissionAggregate } from '../../../domain/aggregates/commercial-booking-commission.aggregate';

// -----------------------------------------------------------------------------
// Domain — Entities
// -----------------------------------------------------------------------------

import type { CommercialBookingCommissionEntity } from '../../../domain/entities/commercial-booking-commission.entity';

// -----------------------------------------------------------------------------
// Domain — Value Objects
// -----------------------------------------------------------------------------

import {
  CommercialBookingCommissionAmount,
  CommercialBookingCommissionBaseAmount,
  CommercialBookingCommissionBookingPublicId,
  CommercialBookingCommissionCurrency,
  CommercialBookingCommissionJourneyPublicId,
  CommercialBookingCommissionPercentage,
  CommercialBookingCommissionPublicId,
  CommercialCommissionRulePublicId,
} from '../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Presentation — Request DTOs
// -----------------------------------------------------------------------------

import {
  AssessCommercialBookingCommissionDto,
  CancelCommercialBookingCommissionDto,
  CreateCommercialBookingCommissionDto,
} from '../dto/request';

// -----------------------------------------------------------------------------
// Presentation — Query DTOs
// -----------------------------------------------------------------------------

import {
  GetCommercialBookingCommissionByBookingQueryDto,
  GetCommercialBookingCommissionsByJourneyQueryDto,
} from '../dto/query';

// -----------------------------------------------------------------------------
// Controller
// -----------------------------------------------------------------------------

@ApiTags('Commercial Booking Commissions')
@Controller('commercial-booking-commissions')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CommercialBookingCommissionController {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    // -------------------------------------------------------------------------
    // Command Handlers
    // -------------------------------------------------------------------------

    @Inject(COMMERCIAL_BOOKING_COMMISSION_TOKENS.COMMAND_HANDLERS.CREATE)
    private readonly createCommercialBookingCommissionHandler: CommandHandler<
      CreateCommercialBookingCommissionCommand,
      CommercialBookingCommissionAggregate
    >,

    @Inject(COMMERCIAL_BOOKING_COMMISSION_TOKENS.COMMAND_HANDLERS.ASSESS)
    private readonly assessCommercialBookingCommissionHandler: CommandHandler<
      AssessCommercialBookingCommissionCommand,
      CommercialBookingCommissionAggregate
    >,

    @Inject(COMMERCIAL_BOOKING_COMMISSION_TOKENS.COMMAND_HANDLERS.CANCEL)
    private readonly cancelCommercialBookingCommissionHandler: CommandHandler<
      CancelCommercialBookingCommissionCommand,
      CommercialBookingCommissionAggregate
    >,

    // -------------------------------------------------------------------------
    // Query Handlers
    // -------------------------------------------------------------------------

    @Inject(COMMERCIAL_BOOKING_COMMISSION_TOKENS.QUERY_HANDLERS.GET)
    private readonly getCommercialBookingCommissionHandler: QueryHandler<
      GetCommercialBookingCommissionQuery,
      CommercialBookingCommissionAggregate | null
    >,

    @Inject(COMMERCIAL_BOOKING_COMMISSION_TOKENS.QUERY_HANDLERS.GET_BY_BOOKING)
    private readonly getCommercialBookingCommissionByBookingHandler: QueryHandler<
      GetCommercialBookingCommissionByBookingQuery,
      CommercialBookingCommissionAggregate | null
    >,

    @Inject(COMMERCIAL_BOOKING_COMMISSION_TOKENS.QUERY_HANDLERS.GET_BY_JOURNEY)
    private readonly getCommercialBookingCommissionsByJourneyHandler: QueryHandler<
      GetCommercialBookingCommissionByJourneyQuery,
      CommercialBookingCommissionAggregate[]
    >,

    @Inject(COMMERCIAL_BOOKING_COMMISSION_TOKENS.QUERY_HANDLERS.LIST)
    private readonly listCommercialBookingCommissionsHandler: QueryHandler<
      ListCommercialBookingCommissionsQuery,
      CommercialBookingCommissionEntity[]
    >,
  ) {}

  // ===========================================================================
  // Queries
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // List Commercial Booking Commissions
  // ---------------------------------------------------------------------------

  @Get()
  @RequirePermissions('commercial-booking-commission:read')
  public async list(): Promise<CommercialBookingCommissionEntity[]> {
    return this.listCommercialBookingCommissionsHandler.execute(
      new ListCommercialBookingCommissionsQuery(),
    );
  }

  // ---------------------------------------------------------------------------
  // Get Commercial Booking Commission By Booking
  // ---------------------------------------------------------------------------

  @Get('by-booking')
  @RequirePermissions('commercial-booking-commission:read')
  public async getByBooking(
    @Query() dto: GetCommercialBookingCommissionByBookingQueryDto,
  ): Promise<CommercialBookingCommissionAggregate | null> {
    const bookingPublicId = CommercialBookingCommissionBookingPublicId.create(
      dto.bookingPublicId,
    );

    return this.getCommercialBookingCommissionByBookingHandler.execute(
      new GetCommercialBookingCommissionByBookingQuery(bookingPublicId),
    );
  }

  // ---------------------------------------------------------------------------
  // Get Commercial Booking Commissions By Journey
  // ---------------------------------------------------------------------------

  @Get('by-journey')
  @RequirePermissions('commercial-booking-commission:read')
  public async getByJourney(
    @Query() dto: GetCommercialBookingCommissionsByJourneyQueryDto,
  ): Promise<CommercialBookingCommissionAggregate[]> {
    return this.getCommercialBookingCommissionsByJourneyHandler.execute(
      new GetCommercialBookingCommissionByJourneyQuery(
        new CommercialBookingCommissionJourneyPublicId(dto.journeyPublicId),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Get Commercial Booking Commission By Public ID
  // ---------------------------------------------------------------------------

  @Get(':commercialBookingCommissionPublicId')
  @RequirePermissions('commercial-booking-commission:read')
  public async get(
    @Param('commercialBookingCommissionPublicId')
    commercialBookingCommissionPublicId: string,
  ): Promise<CommercialBookingCommissionAggregate | null> {
    return this.getCommercialBookingCommissionHandler.execute(
      new GetCommercialBookingCommissionQuery(
        new CommercialBookingCommissionPublicId(
          commercialBookingCommissionPublicId,
        ),
      ),
    );
  }

  // ===========================================================================
  // Commands
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Create Commercial Booking Commission
  // ---------------------------------------------------------------------------

  @Post()
  @RequirePermissions('commercial-booking-commission:create')
  public async create(
    @Body() dto: CreateCommercialBookingCommissionDto,
  ): Promise<CommercialBookingCommissionAggregate> {
    return this.createCommercialBookingCommissionHandler.execute(
      new CreateCommercialBookingCommissionCommand(
        new CommercialCommissionRulePublicId(dto.commissionRulePublicId),

        CommercialBookingCommissionBookingPublicId.create(dto.bookingPublicId),

        new CommercialBookingCommissionJourneyPublicId(dto.journeyPublicId),

        CommercialBookingCommissionPercentage.create(dto.percentage),

        CommercialBookingCommissionBaseAmount.create(dto.baseAmount),

        CommercialBookingCommissionAmount.create(dto.commissionAmount),

        CommercialBookingCommissionCurrency.create(dto.currency),

        dto.correlationId,
        dto.causationId,
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Assess Commercial Booking Commission
  // ---------------------------------------------------------------------------

  @Post(':commercialBookingCommissionPublicId/assess')
  @RequirePermissions('commercial-booking-commission:assess')
  public async assess(
    @Param('commercialBookingCommissionPublicId')
    commercialBookingCommissionPublicId: string,
    @Body() dto: AssessCommercialBookingCommissionDto,
  ): Promise<CommercialBookingCommissionAggregate> {
    return this.assessCommercialBookingCommissionHandler.execute(
      new AssessCommercialBookingCommissionCommand(
        new CommercialBookingCommissionPublicId(
          commercialBookingCommissionPublicId,
        ),
        new Date(dto.assessedAt),
        dto.correlationId,
        dto.causationId,
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Cancel Commercial Booking Commission
  // ---------------------------------------------------------------------------

  @Post(':commercialBookingCommissionPublicId/cancel')
  @RequirePermissions('commercial-booking-commission:cancel')
  public async cancel(
    @Param('commercialBookingCommissionPublicId')
    commercialBookingCommissionPublicId: string,
    @Body() dto: CancelCommercialBookingCommissionDto,
  ): Promise<CommercialBookingCommissionAggregate> {
    return this.cancelCommercialBookingCommissionHandler.execute(
      new CancelCommercialBookingCommissionCommand(
        new CommercialBookingCommissionPublicId(
          commercialBookingCommissionPublicId,
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

export default CommercialBookingCommissionController;
