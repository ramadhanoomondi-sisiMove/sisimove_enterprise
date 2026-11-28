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
// Presentation — Response Mapper
// -----------------------------------------------------------------------------

import { CommercialBookingCommissionResponseMapper } from '../mappers/commercial-booking-commission.response.mapper';

import type { CommercialBookingCommissionResponse } from '../mappers/commercial-booking-commission.response.mapper';

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
      CommercialBookingCommissionAggregate[]
    >,
  ) {}

  // ===========================================================================
  // Queries
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // List Commercial Booking Commissions
  // ---------------------------------------------------------------------------

  @Get()
  @RequirePermissions('admin:read')
  public async list(): Promise<CommercialBookingCommissionResponse[]> {
    const commissions =
      await this.listCommercialBookingCommissionsHandler.execute(
        new ListCommercialBookingCommissionsQuery(),
      );

    return CommercialBookingCommissionResponseMapper.fromAggregates(
      commissions,
    );
  }

  // ---------------------------------------------------------------------------
  // Get Commercial Booking Commission By Booking
  // ---------------------------------------------------------------------------

  @Get('by-booking')
  @RequirePermissions('admin:read')
  public async getByBooking(
    @Query() dto: GetCommercialBookingCommissionByBookingQueryDto,
  ): Promise<CommercialBookingCommissionResponse | null> {
    const bookingPublicId = CommercialBookingCommissionBookingPublicId.create(
      dto.bookingPublicId,
    );

    const aggregate =
      await this.getCommercialBookingCommissionByBookingHandler.execute(
        new GetCommercialBookingCommissionByBookingQuery(bookingPublicId),
      );

    return aggregate
      ? CommercialBookingCommissionResponseMapper.toResponse(aggregate)
      : null;
  }

  // ---------------------------------------------------------------------------
  // Get Commercial Booking Commissions By Journey
  // ---------------------------------------------------------------------------

  @Get('by-journey')
  @RequirePermissions('admin:read')
  public async getByJourney(
    @Query() dto: GetCommercialBookingCommissionsByJourneyQueryDto,
  ): Promise<CommercialBookingCommissionResponse[]> {
    const aggregates =
      await this.getCommercialBookingCommissionsByJourneyHandler.execute(
        new GetCommercialBookingCommissionByJourneyQuery(
          new CommercialBookingCommissionJourneyPublicId(dto.journeyPublicId),
        ),
      );

    return CommercialBookingCommissionResponseMapper.fromAggregates(aggregates);
  }

  // ---------------------------------------------------------------------------
  // Get Commercial Booking Commission By Public ID
  // ---------------------------------------------------------------------------

  @Get(':commercialBookingCommissionPublicId')
  @RequirePermissions('admin:read')
  public async get(
    @Param('commercialBookingCommissionPublicId')
    commercialBookingCommissionPublicId: string,
  ): Promise<CommercialBookingCommissionResponse | null> {
    const aggregate = await this.getCommercialBookingCommissionHandler.execute(
      new GetCommercialBookingCommissionQuery(
        new CommercialBookingCommissionPublicId(
          commercialBookingCommissionPublicId,
        ),
      ),
    );

    return aggregate
      ? CommercialBookingCommissionResponseMapper.toResponse(aggregate)
      : null;
  }

  // ===========================================================================
  // Commands
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Create Commercial Booking Commission
  // ---------------------------------------------------------------------------

  @Post()
  @RequirePermissions('admin:read')
  public async create(
    @Body() dto: CreateCommercialBookingCommissionDto,
  ): Promise<CommercialBookingCommissionResponse> {
    const aggregate =
      await this.createCommercialBookingCommissionHandler.execute(
        new CreateCommercialBookingCommissionCommand(
          new CommercialCommissionRulePublicId(dto.commissionRulePublicId),

          CommercialBookingCommissionBookingPublicId.create(
            dto.bookingPublicId,
          ),

          new CommercialBookingCommissionJourneyPublicId(dto.journeyPublicId),

          CommercialBookingCommissionPercentage.create(dto.percentage),

          CommercialBookingCommissionBaseAmount.create(dto.baseAmount),

          CommercialBookingCommissionAmount.create(dto.commissionAmount),

          CommercialBookingCommissionCurrency.create(dto.currency),

          dto.correlationId,
          dto.causationId,
        ),
      );

    return CommercialBookingCommissionResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Assess Commercial Booking Commission
  // ---------------------------------------------------------------------------

  @Post(':commercialBookingCommissionPublicId/assess')
  @RequirePermissions('admin:read')
  public async assess(
    @Param('commercialBookingCommissionPublicId')
    commercialBookingCommissionPublicId: string,
    @Body() dto: AssessCommercialBookingCommissionDto,
  ): Promise<CommercialBookingCommissionResponse> {
    const aggregate =
      await this.assessCommercialBookingCommissionHandler.execute(
        new AssessCommercialBookingCommissionCommand(
          new CommercialBookingCommissionPublicId(
            commercialBookingCommissionPublicId,
          ),

          new Date(dto.assessedAt),

          dto.correlationId,
          dto.causationId,
        ),
      );

    return CommercialBookingCommissionResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Cancel Commercial Booking Commission
  // ---------------------------------------------------------------------------

  @Post(':commercialBookingCommissionPublicId/cancel')
  @RequirePermissions('admin:read')
  public async cancel(
    @Param('commercialBookingCommissionPublicId')
    commercialBookingCommissionPublicId: string,
    @Body() dto: CancelCommercialBookingCommissionDto,
  ): Promise<CommercialBookingCommissionResponse> {
    const aggregate =
      await this.cancelCommercialBookingCommissionHandler.execute(
        new CancelCommercialBookingCommissionCommand(
          new CommercialBookingCommissionPublicId(
            commercialBookingCommissionPublicId,
          ),

          new Date(dto.cancelledAt),

          dto.correlationId,
          dto.causationId,
        ),
      );

    return CommercialBookingCommissionResponseMapper.toResponse(aggregate);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CommercialBookingCommissionController;
