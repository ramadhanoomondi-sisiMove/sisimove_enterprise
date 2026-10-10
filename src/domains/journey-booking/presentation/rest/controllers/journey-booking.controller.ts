import { randomUUID } from 'node:crypto';

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
  UseGuards,
} from '@nestjs/common';

// -----------------------------------------------------------------------------
// Swagger
// -----------------------------------------------------------------------------

import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Authentication / Authorization
// -----------------------------------------------------------------------------

import * as auth from '../../../../../foundation/security/auth';

// -----------------------------------------------------------------------------
// Foundation Application Contracts
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_BOOKING_TOKENS } from '../../../application/journey-booking.tokens';

// -----------------------------------------------------------------------------
// Commands
// -----------------------------------------------------------------------------

import {
  AuthorizeJourneyBookingPaymentCommand,
  CancelJourneyBookingCommand,
  CaptureJourneyBookingPaymentCommand,
  CompleteJourneyBookingCommand,
  ConfirmJourneyBookingWithPaymentCommand,
  CreateJourneyBookingCommand,
  CreateJourneyBookingPaymentCommand,
  CreateJourneyBookingSnapshotCommand,
  ExpireJourneyBookingCommand,
  FailJourneyBookingPaymentCommand,
  PartiallyRefundJourneyBookingPaymentCommand,
  RefundJourneyBookingPaymentCommand,
  SetJourneyBookingPricingCommand,
} from '../../../application/commands';

// -----------------------------------------------------------------------------
// Queries
// -----------------------------------------------------------------------------

import {
  FindJourneyBookingByTransactionQuery,
  FindJourneyBookingsByJourneyAndPassengerQuery,
  FindJourneyBookingsByJourneyQuery,
  FindJourneyBookingsByPassengerQuery,
  FindJourneyBookingsByStatusQuery,
  GetJourneyBookingByPublicIdQuery,
  GetJourneyBookingDetailQuery,
  GetMyJourneyBookingDetailsQuery,
  GetMyJourneyBookingsQuery,
} from '../../../application/queries';

// -----------------------------------------------------------------------------
// Domain Aggregate / Entity
// -----------------------------------------------------------------------------

import type { JourneyBookingAggregate } from '../../../domain/aggregates/journey-booking.aggregate';

import type { JourneyBookingEntity } from '../../../domain/entities/journey-booking.entity';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import {
  JourneyBookingAdjustmentAmount,
  JourneyBookingArrivalAt,
  JourneyBookingCancellationReason,
  JourneyBookingCoordinates,
  JourneyBookingCurrency,
  JourneyBookingDepartureAt,
  JourneyBookingDestinationName,
  JourneyBookingDiscountAmount,
  JourneyBookingJourneyPublicId,
  JourneyBookingOriginName,
  JourneyBookingPassengerPublicId,
  JourneyBookingPaymentAmount,
  JourneyBookingPaymentFailureReason,
  JourneyBookingPaymentStatus,
  JourneyBookingPricePerSeat,
  JourneyBookingPublicId,
  JourneyBookingSeats,
  JourneyBookingStatus,
  JourneyBookingSubtotal,
  JourneyBookingTimezone,
  JourneyBookingTotalAmount,
  JourneyBookingTransactionPublicId,
} from '../../../domain/value-objects';

// -----------------------------------------------------------------------------
// DTOs
// -----------------------------------------------------------------------------

// src/domains/journey-booking/presentation/http/controllers/journey-booking.controller.ts

import {
  AuthorizeJourneyBookingPaymentDto,
  CancelJourneyBookingDto,
  CreateJourneyBookingDto,
  CreateJourneyBookingPaymentDto,
  CreateJourneyBookingSnapshotDto,
  FailJourneyBookingPaymentDto,
  PartiallyRefundJourneyBookingPaymentDto,
  SetJourneyBookingPricingDto,
} from '../dto/request';

// -----------------------------------------------------------------------------
// REST Response Mapper
// -----------------------------------------------------------------------------

import {
  JourneyBookingResponseMapper,
  type JourneyBookingResponse,
} from '../mappers/journey-booking-response.mapper';

// -----------------------------------------------------------------------------
// Detail REST Response Mapper
// -----------------------------------------------------------------------------

import { JourneyBookingDetailResponseMapper } from '../mappers/journey-booking-detail-response.mapper';

import type { JourneyBookingDetailResponse } from '../../../application/responses/journey-booking-detail.response';

// =============================================================================
// Controller
// =============================================================================

@ApiTags('Journey Bookings')
@Controller('journey-bookings')
@UseGuards(auth.JwtAuthGuard, auth.PermissionsGuard)
export class JourneyBookingController {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    // =========================================================================
    // Lifecycle Command Handlers
    // =========================================================================

    @Inject(JOURNEY_BOOKING_TOKENS.COMMAND_HANDLERS.CREATE)
    private readonly createJourneyBookingHandler: CommandHandler<
      CreateJourneyBookingCommand,
      JourneyBookingAggregate
    >,

    // -------------------------------------------------------------------------
    // Atomic Payment + Booking Confirmation
    //
    // This is the production confirmation workflow.
    //
    // Payment authorization, financial hold creation, booking authorization,
    // booking confirmation, and journey capacity reservation are executed
    // inside ONE application transaction.
    //
    // If any step fails, the complete transaction is rolled back.
    // -------------------------------------------------------------------------

    @Inject(JOURNEY_BOOKING_TOKENS.COMMAND_HANDLERS.CONFIRM_WITH_PAYMENT)
    private readonly confirmJourneyBookingWithPaymentHandler: CommandHandler<
      ConfirmJourneyBookingWithPaymentCommand,
      JourneyBookingAggregate
    >,

    @Inject(JOURNEY_BOOKING_TOKENS.COMMAND_HANDLERS.CANCEL)
    private readonly cancelJourneyBookingHandler: CommandHandler<
      CancelJourneyBookingCommand,
      JourneyBookingAggregate
    >,

    @Inject(JOURNEY_BOOKING_TOKENS.COMMAND_HANDLERS.COMPLETE)
    private readonly completeJourneyBookingHandler: CommandHandler<
      CompleteJourneyBookingCommand,
      JourneyBookingAggregate
    >,

    @Inject(JOURNEY_BOOKING_TOKENS.COMMAND_HANDLERS.EXPIRE)
    private readonly expireJourneyBookingHandler: CommandHandler<
      ExpireJourneyBookingCommand,
      JourneyBookingAggregate
    >,

    // =========================================================================
    // Payment Command Handlers
    // =========================================================================

    // -------------------------------------------------------------------------
    // Standalone payment authorization remains available for payment workflows
    // that intentionally authorize payment without confirming the booking.
    //
    // The normal booking confirmation flow MUST use
    // confirmJourneyBookingWithPaymentHandler above.
    // -------------------------------------------------------------------------

    @Inject(JOURNEY_BOOKING_TOKENS.COMMAND_HANDLERS.AUTHORIZE_PAYMENT)
    private readonly authorizeJourneyBookingPaymentHandler: CommandHandler<
      AuthorizeJourneyBookingPaymentCommand,
      JourneyBookingAggregate
    >,

    @Inject(JOURNEY_BOOKING_TOKENS.COMMAND_HANDLERS.CAPTURE_PAYMENT)
    private readonly captureJourneyBookingPaymentHandler: CommandHandler<
      CaptureJourneyBookingPaymentCommand,
      JourneyBookingAggregate
    >,

    @Inject(JOURNEY_BOOKING_TOKENS.COMMAND_HANDLERS.FAIL_PAYMENT)
    private readonly failJourneyBookingPaymentHandler: CommandHandler<
      FailJourneyBookingPaymentCommand,
      JourneyBookingAggregate
    >,

    @Inject(JOURNEY_BOOKING_TOKENS.COMMAND_HANDLERS.REFUND_PAYMENT)
    private readonly refundJourneyBookingPaymentHandler: CommandHandler<
      RefundJourneyBookingPaymentCommand,
      JourneyBookingAggregate
    >,

    @Inject(JOURNEY_BOOKING_TOKENS.COMMAND_HANDLERS.PARTIALLY_REFUND_PAYMENT)
    private readonly partiallyRefundJourneyBookingPaymentHandler: CommandHandler<
      PartiallyRefundJourneyBookingPaymentCommand,
      JourneyBookingAggregate
    >,

    // =========================================================================
    // Booking Component Command Handlers
    // =========================================================================

    @Inject(JOURNEY_BOOKING_TOKENS.COMMAND_HANDLERS.CREATE_SNAPSHOT)
    private readonly createJourneyBookingSnapshotHandler: CommandHandler<
      CreateJourneyBookingSnapshotCommand,
      JourneyBookingAggregate
    >,

    @Inject(JOURNEY_BOOKING_TOKENS.COMMAND_HANDLERS.SET_PRICING)
    private readonly setJourneyBookingPricingHandler: CommandHandler<
      SetJourneyBookingPricingCommand,
      JourneyBookingAggregate
    >,

    @Inject(JOURNEY_BOOKING_TOKENS.COMMAND_HANDLERS.CREATE_PAYMENT)
    private readonly createJourneyBookingPaymentHandler: CommandHandler<
      CreateJourneyBookingPaymentCommand,
      JourneyBookingAggregate
    >,

    // =========================================================================
    // Journey Booking Query Handlers
    // =========================================================================

    @Inject(JOURNEY_BOOKING_TOKENS.QUERY_HANDLERS.GET_BY_PUBLIC_ID)
    private readonly getJourneyBookingByPublicIdHandler: QueryHandler<
      GetJourneyBookingByPublicIdQuery,
      JourneyBookingAggregate
    >,

    @Inject(JOURNEY_BOOKING_TOKENS.QUERY_HANDLERS.GET_DETAIL)
    private readonly getJourneyBookingDetailHandler: QueryHandler<
      GetJourneyBookingDetailQuery,
      JourneyBookingDetailResponse
    >,

    @Inject(JOURNEY_BOOKING_TOKENS.QUERY_HANDLERS.GET_MY)
    private readonly getMyJourneyBookingsHandler: QueryHandler<
      GetMyJourneyBookingsQuery,
      JourneyBookingEntity[]
    >,

    @Inject(JOURNEY_BOOKING_TOKENS.QUERY_HANDLERS.GET_MY_DETAILS)
    private readonly getMyJourneyBookingDetailsHandler: QueryHandler<
      GetMyJourneyBookingDetailsQuery,
      JourneyBookingDetailResponse[]
    >,

    // =========================================================================
    // Discovery Query Handlers
    // =========================================================================

    @Inject(JOURNEY_BOOKING_TOKENS.QUERY_HANDLERS.FIND_BY_JOURNEY)
    private readonly findJourneyBookingsByJourneyHandler: QueryHandler<
      FindJourneyBookingsByJourneyQuery,
      JourneyBookingEntity[]
    >,

    @Inject(JOURNEY_BOOKING_TOKENS.QUERY_HANDLERS.FIND_BY_PASSENGER)
    private readonly findJourneyBookingsByPassengerHandler: QueryHandler<
      FindJourneyBookingsByPassengerQuery,
      JourneyBookingEntity[]
    >,

    @Inject(JOURNEY_BOOKING_TOKENS.QUERY_HANDLERS.FIND_BY_STATUS)
    private readonly findJourneyBookingsByStatusHandler: QueryHandler<
      FindJourneyBookingsByStatusQuery,
      JourneyBookingEntity[]
    >,

    @Inject(JOURNEY_BOOKING_TOKENS.QUERY_HANDLERS.FIND_BY_JOURNEY_AND_PASSENGER)
    private readonly findJourneyBookingsByJourneyAndPassengerHandler: QueryHandler<
      FindJourneyBookingsByJourneyAndPassengerQuery,
      JourneyBookingEntity[]
    >,

    @Inject(JOURNEY_BOOKING_TOKENS.QUERY_HANDLERS.FIND_BY_TRANSACTION)
    private readonly findJourneyBookingByTransactionHandler: QueryHandler<
      FindJourneyBookingByTransactionQuery,
      JourneyBookingEntity
    >,
  ) {}

  // ===========================================================================
  // QUERY ENDPOINTS
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get My Journey Booking Details
  // ---------------------------------------------------------------------------

  /**
   * Returns the authenticated passenger's detailed booking collection.
   *
   * Passenger identity is derived exclusively from the authenticated JWT.
   *
   * The application query handler resolves the passenger's bookings and
   * composes the detailed booking views with Journey, Traveller, and Trust
   * information.
   */

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get my journey booking details',
    description:
      'Returns detailed journey booking views belonging to the currently authenticated passenger.',
  })
  @Get('mine/detail')
  @auth.RequirePermissions('booking:read')
  public async getMineDetail(
    @auth.CurrentIdentity() identity: auth.AuthenticatedIdentity,
  ): Promise<JourneyBookingDetailResponse[]> {
    const passengerPublicId = new JourneyBookingPassengerPublicId(
      identity.identityPublicId,
    );

    const responses = await this.getMyJourneyBookingDetailsHandler.execute(
      new GetMyJourneyBookingDetailsQuery(passengerPublicId),
    );

    return responses.map((response) =>
      JourneyBookingDetailResponseMapper.toResponse(response),
    );
  }

  // ---------------------------------------------------------------------------
  // Get My Journey Bookings
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get my journey bookings',
    description:
      'Returns journey bookings belonging to the currently authenticated traveller.',
  })
  @Get('mine')
  @auth.RequirePermissions('booking:read')
  public async getMine(
    @auth.CurrentIdentity() identity: auth.AuthenticatedIdentity,
  ): Promise<JourneyBookingResponse[]> {
    const passengerPublicId = new JourneyBookingPassengerPublicId(
      identity.identityPublicId,
    );

    const bookings = await this.getMyJourneyBookingsHandler.execute(
      new GetMyJourneyBookingsQuery(passengerPublicId),
    );

    return JourneyBookingResponseMapper.fromEntities(bookings);
  }

  // ---------------------------------------------------------------------------
  // Find By Journey
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Find journey bookings by journey',
    description: 'Returns bookings associated with the specified journey.',
  })
  @ApiParam({
    name: 'journeyPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey.',
  })
  @Get('journey/:journeyPublicId')
  @auth.RequirePermissions('booking:read')
  public async findByJourney(
    @Param('journeyPublicId') journeyPublicId: string,
  ): Promise<JourneyBookingResponse[]> {
    const bookings = await this.findJourneyBookingsByJourneyHandler.execute(
      new FindJourneyBookingsByJourneyQuery(
        new JourneyBookingJourneyPublicId(journeyPublicId),
      ),
    );

    return JourneyBookingResponseMapper.fromEntities(bookings);
  }

  // ---------------------------------------------------------------------------
  // Find By Passenger
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Find journey bookings by passenger',
    description: 'Returns bookings associated with the specified passenger.',
  })
  @ApiParam({
    name: 'passengerPublicId',
    type: String,
    required: true,
    description: 'Public ID of the passenger.',
  })
  @Get('passenger/:passengerPublicId')
  @auth.RequirePermissions('booking:read')
  public async findByPassenger(
    @Param('passengerPublicId') passengerPublicId: string,
  ): Promise<JourneyBookingResponse[]> {
    const bookings = await this.findJourneyBookingsByPassengerHandler.execute(
      new FindJourneyBookingsByPassengerQuery(
        new JourneyBookingPassengerPublicId(passengerPublicId),
      ),
    );

    return JourneyBookingResponseMapper.fromEntities(bookings);
  }

  // ---------------------------------------------------------------------------
  // Find By Status
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Find journey bookings by status',
    description:
      'Returns bookings matching the specified journey booking status.',
  })
  @ApiParam({
    name: 'status',
    type: String,
    required: true,
    description: 'Journey Booking status.',
  })
  @Get('status/:status')
  @auth.RequirePermissions('booking:read')
  public async findByStatus(
    @Param('status') status: string,
  ): Promise<JourneyBookingResponse[]> {
    const bookingStatus = this.toJourneyBookingStatus(status);

    const bookings = await this.findJourneyBookingsByStatusHandler.execute(
      new FindJourneyBookingsByStatusQuery(bookingStatus),
    );

    return JourneyBookingResponseMapper.fromEntities(bookings);
  }

  // ---------------------------------------------------------------------------
  // Find By Journey And Passenger
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Find journey bookings by journey and passenger',
    description:
      'Returns bookings associated with the specified journey and passenger.',
  })
  @ApiParam({
    name: 'journeyPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey.',
  })
  @ApiParam({
    name: 'passengerPublicId',
    type: String,
    required: true,
    description: 'Public ID of the passenger.',
  })
  @Get('journey/:journeyPublicId/passenger/:passengerPublicId')
  @auth.RequirePermissions('booking:read')
  public async findByJourneyAndPassenger(
    @Param('journeyPublicId') journeyPublicId: string,
    @Param('passengerPublicId') passengerPublicId: string,
  ): Promise<JourneyBookingResponse[]> {
    const bookings =
      await this.findJourneyBookingsByJourneyAndPassengerHandler.execute(
        new FindJourneyBookingsByJourneyAndPassengerQuery(
          new JourneyBookingJourneyPublicId(journeyPublicId),
          new JourneyBookingPassengerPublicId(passengerPublicId),
        ),
      );

    return JourneyBookingResponseMapper.fromEntities(bookings);
  }

  // ---------------------------------------------------------------------------
  // Find By Transaction
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Find journey booking by transaction',
    description:
      'Returns the journey booking associated with the specified transaction.',
  })
  @ApiParam({
    name: 'transactionPublicId',
    type: String,
    required: true,
    description: 'Public ID of the transaction.',
  })
  @Get('transaction/:transactionPublicId')
  @auth.RequirePermissions('booking:read')
  public async findByTransaction(
    @Param('transactionPublicId') transactionPublicId: string,
  ): Promise<JourneyBookingResponse> {
    const booking = await this.findJourneyBookingByTransactionHandler.execute(
      new FindJourneyBookingByTransactionQuery(
        new JourneyBookingTransactionPublicId(transactionPublicId),
      ),
    );

    return JourneyBookingResponseMapper.fromEntity(booking);
  }

  // ---------------------------------------------------------------------------
  // Get Journey Booking Detail
  // ---------------------------------------------------------------------------

  /**
   * Returns the authenticated passenger's detailed booking view.
   *
   * Passenger identity is derived exclusively from the authenticated JWT.
   *
   * The application query handler enforces booking ownership and composes
   * the historical booking data with Journey, Traveller, and Trust details.
   */

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get journey booking detail',
    description:
      'Returns the detailed journey booking view for the currently authenticated passenger.',
  })
  @ApiParam({
    name: 'journeyBookingPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey Booking.',
  })
  @Get(':journeyBookingPublicId/detail')
  @auth.RequirePermissions('booking:read')
  public async getDetail(
    @Param('journeyBookingPublicId') journeyBookingPublicId: string,
    @auth.CurrentIdentity() identity: auth.AuthenticatedIdentity,
  ): Promise<JourneyBookingDetailResponse> {
    const passengerPublicId = new JourneyBookingPassengerPublicId(
      identity.identityPublicId,
    );

    const response = await this.getJourneyBookingDetailHandler.execute(
      new GetJourneyBookingDetailQuery(
        new JourneyBookingPublicId(journeyBookingPublicId),
        passengerPublicId,
      ),
    );

    return JourneyBookingDetailResponseMapper.toResponse(response);
  }

  // ---------------------------------------------------------------------------
  // Get Journey Booking By Public ID
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get journey booking by public ID',
    description:
      'Returns the journey booking associated with the specified public ID.',
  })
  @ApiParam({
    name: 'journeyBookingPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey Booking.',
  })
  @Get(':journeyBookingPublicId')
  @auth.RequirePermissions('booking:read')
  public async getByPublicId(
    @Param('journeyBookingPublicId') journeyBookingPublicId: string,
  ): Promise<JourneyBookingResponse> {
    const booking = await this.getJourneyBookingByPublicIdHandler.execute(
      new GetJourneyBookingByPublicIdQuery(
        new JourneyBookingPublicId(journeyBookingPublicId),
      ),
    );

    return JourneyBookingResponseMapper.toResponse(booking);
  }

  // ===========================================================================
  // COMMAND ENDPOINTS
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Create
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Create journey booking',
    description:
      'Creates a journey booking for the currently authenticated traveller.',
  })
  @Post()
  @auth.RequirePermissions('booking:create')
  public async create(
    @Body() dto: CreateJourneyBookingDto,
    @auth.CurrentIdentity() identity: auth.AuthenticatedIdentity,
  ): Promise<JourneyBookingResponse> {
    const passengerPublicId = new JourneyBookingPassengerPublicId(
      identity.identityPublicId,
    );

    const seats = JourneyBookingSeats.create(dto.seats);

    const booking = await this.createJourneyBookingHandler.execute(
      new CreateJourneyBookingCommand(
        new JourneyBookingJourneyPublicId(dto.journeyPublicId),
        passengerPublicId,
        seats,
        randomUUID(),
        undefined,
      ),
    );

    return JourneyBookingResponseMapper.toResponse(booking);
  }

  // ===========================================================================
  // BOOKING COMPONENT COMMANDS
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Create Journey Booking Snapshot
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Create journey booking snapshot',
    description:
      'Creates the immutable journey, route, schedule, and vehicle snapshot for a booking.',
  })
  @ApiParam({
    name: 'journeyBookingPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey Booking.',
  })
  @Post(':journeyBookingPublicId/snapshot')
  @auth.RequirePermissions('booking:create')
  public async createSnapshot(
    @Param('journeyBookingPublicId') journeyBookingPublicId: string,
    @Body() dto: CreateJourneyBookingSnapshotDto,
  ): Promise<JourneyBookingResponse> {
    const booking = await this.createJourneyBookingSnapshotHandler.execute(
      new CreateJourneyBookingSnapshotCommand(
        new JourneyBookingPublicId(journeyBookingPublicId),

        JourneyBookingOriginName.create(dto.originName),

        JourneyBookingDestinationName.create(dto.destinationName),

        JourneyBookingCoordinates.create(
          dto.originCoordinates.latitude,
          dto.originCoordinates.longitude,
        ),

        JourneyBookingCoordinates.create(
          dto.destinationCoordinates.latitude,
          dto.destinationCoordinates.longitude,
        ),

        JourneyBookingDepartureAt.create(new Date(dto.departureAt)),

        JourneyBookingTimezone.create(dto.timezone),

        dto.correlationId ?? randomUUID(),

        dto.arrivalAt !== undefined
          ? JourneyBookingArrivalAt.create(new Date(dto.arrivalAt))
          : undefined,

        dto.vehicleMake,
        dto.vehicleModel,
        dto.vehicleYear,
        dto.vehicleColor,
        dto.vehicleRegistration,

        dto.causationId,
      ),
    );

    return JourneyBookingResponseMapper.toResponse(booking);
  }

  // src/domains/journey-booking/presentation/http/controllers/journey-booking.controller.ts

  // ---------------------------------------------------------------------------
  // Set Journey Booking Pricing
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Set journey booking pricing',
    description:
      'Creates or updates the pricing component associated with a journey booking.',
  })
  @ApiParam({
    name: 'journeyBookingPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey Booking.',
  })
  @Post(':journeyBookingPublicId/pricing')
  @auth.RequirePermissions('booking:create')
  public async setPricing(
    @Param('journeyBookingPublicId') journeyBookingPublicId: string,
    @Body() dto: SetJourneyBookingPricingDto,
  ): Promise<JourneyBookingResponse> {
    const booking = await this.setJourneyBookingPricingHandler.execute(
      new SetJourneyBookingPricingCommand(
        new JourneyBookingPublicId(journeyBookingPublicId),

        new JourneyBookingPricePerSeat(dto.pricePerSeat),

        JourneyBookingSeats.create(dto.seats),

        new JourneyBookingSubtotal(dto.subtotal),

        new JourneyBookingTotalAmount(dto.totalAmount),

        new JourneyBookingCurrency(dto.currency),

        dto.correlationId ?? randomUUID(),

        dto.discountAmount !== undefined
          ? new JourneyBookingDiscountAmount(dto.discountAmount)
          : undefined,

        dto.adjustmentAmount !== undefined
          ? new JourneyBookingAdjustmentAmount(dto.adjustmentAmount)
          : undefined,

        dto.causationId,
      ),
    );

    return JourneyBookingResponseMapper.toResponse(booking);
  }

  // src/domains/journey-booking/presentation/http/controllers/journey-booking.controller.ts

  // ---------------------------------------------------------------------------
  // Create Journey Booking Payment
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Create journey booking payment',
    description:
      'Creates the initial payment component associated with a journey booking.',
  })
  @ApiParam({
    name: 'journeyBookingPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey Booking.',
  })
  @Post(':journeyBookingPublicId/payment')
  @auth.RequirePermissions('booking:create')
  public async createPayment(
    @Param('journeyBookingPublicId') journeyBookingPublicId: string,
    @Body() dto: CreateJourneyBookingPaymentDto,
  ): Promise<JourneyBookingResponse> {
    const booking = await this.createJourneyBookingPaymentHandler.execute(
      new CreateJourneyBookingPaymentCommand(
        new JourneyBookingPublicId(journeyBookingPublicId),

        JourneyBookingPaymentStatus.create(dto.status),

        new JourneyBookingPaymentAmount(dto.amount),

        new JourneyBookingCurrency(dto.currency),

        dto.correlationId ?? randomUUID(),

        dto.transactionPublicId !== undefined
          ? new JourneyBookingTransactionPublicId(dto.transactionPublicId)
          : new JourneyBookingTransactionPublicId(),

        dto.causationId,
      ),
    );

    return JourneyBookingResponseMapper.toResponse(booking);
  }

  // ---------------------------------------------------------------------------
  // Confirm — Atomic Payment + Booking Confirmation
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Confirm journey booking with payment',
    description:
      'Authorizes the booking payment, creates the financial hold, confirms the booking, and reserves journey capacity inside one atomic transaction. If any step fails, all changes are rolled back.',
  })
  @ApiParam({
    name: 'journeyBookingPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey Booking.',
  })
  @Post(':journeyBookingPublicId/confirm')
  @auth.RequirePermissions('booking:create')
  public async confirm(
    @Param('journeyBookingPublicId') journeyBookingPublicId: string,
    @Body() dto: AuthorizeJourneyBookingPaymentDto,
  ): Promise<JourneyBookingResponse> {
    const booking = await this.confirmJourneyBookingWithPaymentHandler.execute(
      new ConfirmJourneyBookingWithPaymentCommand(
        new JourneyBookingPublicId(journeyBookingPublicId),

        new JourneyBookingTransactionPublicId(dto.transactionPublicId),

        randomUUID(),

        undefined,

        undefined,

        undefined,
      ),
    );

    return JourneyBookingResponseMapper.toResponse(booking);
  }

  // ---------------------------------------------------------------------------
  // Cancel
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Cancel journey booking',
    description: 'Cancels a journey booking.',
  })
  @ApiParam({
    name: 'journeyBookingPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey Booking.',
  })
  @Post(':journeyBookingPublicId/cancel')
  @auth.RequirePermissions('booking:cancel')
  public async cancel(
    @Param('journeyBookingPublicId') journeyBookingPublicId: string,
    @Body() dto: CancelJourneyBookingDto,
    @auth.CurrentIdentity() identity: auth.AuthenticatedIdentity,
  ): Promise<JourneyBookingResponse> {
    const cancelledByPublicId = new JourneyBookingPassengerPublicId(
      identity.identityPublicId,
    );

    const reason = JourneyBookingCancellationReason.create(dto.reason);

    const booking = await this.cancelJourneyBookingHandler.execute(
      new CancelJourneyBookingCommand(
        new JourneyBookingPublicId(journeyBookingPublicId),
        reason,
        randomUUID(),
        cancelledByPublicId.value,
        dto.reasonDescription,
        undefined,
        dto.cancelledAt !== undefined ? new Date(dto.cancelledAt) : undefined,
      ),
    );

    return JourneyBookingResponseMapper.toResponse(booking);
  }

  // ---------------------------------------------------------------------------
  // Complete
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Complete journey booking',
    description: 'Marks a journey booking as completed.',
  })
  @ApiParam({
    name: 'journeyBookingPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey Booking.',
  })
  @Post(':journeyBookingPublicId/complete')
  @auth.RequirePermissions('booking:manage')
  public async complete(
    @Param('journeyBookingPublicId') journeyBookingPublicId: string,
  ): Promise<JourneyBookingResponse> {
    const booking = await this.completeJourneyBookingHandler.execute(
      new CompleteJourneyBookingCommand(
        new JourneyBookingPublicId(journeyBookingPublicId),
        randomUUID(),
        undefined,
      ),
    );

    return JourneyBookingResponseMapper.toResponse(booking);
  }

  // ---------------------------------------------------------------------------
  // Expire
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Expire journey booking',
    description: 'Expires an eligible journey booking.',
  })
  @ApiParam({
    name: 'journeyBookingPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey Booking.',
  })
  @Post(':journeyBookingPublicId/expire')
  @auth.RequirePermissions('booking:manage')
  public async expire(
    @Param('journeyBookingPublicId') journeyBookingPublicId: string,
  ): Promise<JourneyBookingResponse> {
    const booking = await this.expireJourneyBookingHandler.execute(
      new ExpireJourneyBookingCommand(
        new JourneyBookingPublicId(journeyBookingPublicId),
        randomUUID(),
        undefined,
      ),
    );

    return JourneyBookingResponseMapper.toResponse(booking);
  }

  // ===========================================================================
  // PAYMENT COMMANDS
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Authorize Payment
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Authorize journey booking payment',
    description:
      'Authorizes payment for a journey booking using the supplied transaction reference without confirming the booking.',
  })
  @ApiParam({
    name: 'journeyBookingPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey Booking.',
  })
  @Post(':journeyBookingPublicId/payment/authorize')
  @auth.RequirePermissions('booking:create')
  public async authorizePayment(
    @Param('journeyBookingPublicId') journeyBookingPublicId: string,
    @Body() dto: AuthorizeJourneyBookingPaymentDto,
  ): Promise<JourneyBookingResponse> {
    const booking = await this.authorizeJourneyBookingPaymentHandler.execute(
      new AuthorizeJourneyBookingPaymentCommand(
        new JourneyBookingPublicId(journeyBookingPublicId),
        new JourneyBookingTransactionPublicId(dto.transactionPublicId),
        randomUUID(),
        undefined,
      ),
    );

    return JourneyBookingResponseMapper.toResponse(booking);
  }

  // ---------------------------------------------------------------------------
  // Capture Payment
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Capture journey booking payment',
    description: 'Captures an authorized booking payment.',
  })
  @ApiParam({
    name: 'journeyBookingPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey Booking.',
  })
  @Post(':journeyBookingPublicId/payment/capture')
  @auth.RequirePermissions('booking:manage')
  public async capturePayment(
    @Param('journeyBookingPublicId') journeyBookingPublicId: string,
  ): Promise<JourneyBookingResponse> {
    const booking = await this.captureJourneyBookingPaymentHandler.execute(
      new CaptureJourneyBookingPaymentCommand(
        new JourneyBookingPublicId(journeyBookingPublicId),
        randomUUID(),
        undefined,
      ),
    );

    return JourneyBookingResponseMapper.toResponse(booking);
  }

  // ---------------------------------------------------------------------------
  // Fail Payment
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Fail journey booking payment',
    description: 'Records a failed booking payment.',
  })
  @ApiParam({
    name: 'journeyBookingPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey Booking.',
  })
  @Post(':journeyBookingPublicId/payment/fail')
  @auth.RequirePermissions('booking:manage')
  public async failPayment(
    @Param('journeyBookingPublicId') journeyBookingPublicId: string,
    @Body() dto: FailJourneyBookingPaymentDto,
  ): Promise<JourneyBookingResponse> {
    const booking = await this.failJourneyBookingPaymentHandler.execute(
      new FailJourneyBookingPaymentCommand(
        new JourneyBookingPublicId(journeyBookingPublicId),
        JourneyBookingPaymentFailureReason.create(dto.failureReason),
        randomUUID(),
        undefined,
      ),
    );

    return JourneyBookingResponseMapper.toResponse(booking);
  }

  // ---------------------------------------------------------------------------
  // Refund Payment
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Refund journey booking payment',
    description: 'Refunds the payment associated with a journey booking.',
  })
  @ApiParam({
    name: 'journeyBookingPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey Booking.',
  })
  @Post(':journeyBookingPublicId/payment/refund')
  @auth.RequirePermissions('booking:manage')
  public async refundPayment(
    @Param('journeyBookingPublicId') journeyBookingPublicId: string,
  ): Promise<JourneyBookingResponse> {
    const booking = await this.refundJourneyBookingPaymentHandler.execute(
      new RefundJourneyBookingPaymentCommand(
        new JourneyBookingPublicId(journeyBookingPublicId),
        randomUUID(),
        undefined,
      ),
    );

    return JourneyBookingResponseMapper.toResponse(booking);
  }

  // ---------------------------------------------------------------------------
  // Partial Refund
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Partially refund journey booking payment',
    description:
      'Records a partial refund against the payment associated with a journey booking.',
  })
  @ApiParam({
    name: 'journeyBookingPublicId',
    type: String,
    required: true,
    description: 'Public ID of the Journey Booking.',
  })
  @Post(':journeyBookingPublicId/payment/refund/partial')
  @auth.RequirePermissions('booking:manage')
  public async partiallyRefundPayment(
    @Param('journeyBookingPublicId') journeyBookingPublicId: string,
    @Body() dto: PartiallyRefundJourneyBookingPaymentDto,
  ): Promise<JourneyBookingResponse> {
    const booking =
      await this.partiallyRefundJourneyBookingPaymentHandler.execute(
        new PartiallyRefundJourneyBookingPaymentCommand(
          new JourneyBookingPublicId(journeyBookingPublicId),
          dto.refundedAmount,
          dto.remainingAmount,
          randomUUID(),
          undefined,
        ),
      );

    return JourneyBookingResponseMapper.toResponse(booking);
  }

  // ===========================================================================
  // VALUE OBJECT MAPPERS
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Journey Booking Status
  // ---------------------------------------------------------------------------

  private toJourneyBookingStatus(value: string): JourneyBookingStatus {
    const normalized = value.trim().toUpperCase();

    switch (normalized) {
      case 'PENDING':
        return JourneyBookingStatus.pending();

      case 'CONFIRMED':
        return JourneyBookingStatus.confirmed();

      case 'CANCELLED':
        return JourneyBookingStatus.cancelled();

      case 'COMPLETED':
        return JourneyBookingStatus.completed();

      case 'EXPIRED':
        return JourneyBookingStatus.expired();

      default:
        throw new Error(
          `Invalid Journey Booking status '${value}'. Expected PENDING, CONFIRMED, CANCELLED, COMPLETED, or EXPIRED.`,
        );
    }
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default JourneyBookingController;
