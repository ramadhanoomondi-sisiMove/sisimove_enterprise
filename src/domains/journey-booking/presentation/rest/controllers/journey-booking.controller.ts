// src/domains/journey-booking/presentation/rest/controllers/journey-booking.controller.ts

// -----------------------------------------------------------------------------
// Journey Booking — REST Controller
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
  Req,
  UseGuards,
} from '@nestjs/common';

// -----------------------------------------------------------------------------
// Swagger
// -----------------------------------------------------------------------------

import { ApiTags } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Authentication / Authorization
// -----------------------------------------------------------------------------

import {
  JwtAuthGuard,
  PermissionsGuard,
  RequirePermissions,
} from '../../../../identity/presentation/auth';

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
  ConfirmJourneyBookingCommand,
  CreateJourneyBookingCommand,
  ExpireJourneyBookingCommand,
  FailJourneyBookingPaymentCommand,
  PartiallyRefundJourneyBookingPaymentCommand,
  RefundJourneyBookingPaymentCommand,
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
  JourneyBookingCancellationReason,
  JourneyBookingCancelledByPublicId,
  JourneyBookingCancellationReasonDescription,
  JourneyBookingJourneyPublicId,
  JourneyBookingPassengerPublicId,
  JourneyBookingPaymentFailureReason,
  JourneyBookingPublicId,
  JourneyBookingSeats,
  JourneyBookingStatus,
  JourneyBookingTransactionPublicId,
} from '../../../domain/value-objects';

// -----------------------------------------------------------------------------
// DTOs
// -----------------------------------------------------------------------------

import {
  AuthorizeJourneyBookingPaymentDto,
  CancelJourneyBookingDto,
  CaptureJourneyBookingPaymentDto,
  CompleteJourneyBookingDto,
  ConfirmJourneyBookingDto,
  CreateJourneyBookingDto,
  ExpireJourneyBookingDto,
  FailJourneyBookingPaymentDto,
  PartiallyRefundJourneyBookingPaymentDto,
  RefundJourneyBookingPaymentDto,
} from '../dto/request';

// -----------------------------------------------------------------------------
// Request Type
// -----------------------------------------------------------------------------

interface AuthenticatedRequest {
  user: {
    publicId: string;
  };
}

// -----------------------------------------------------------------------------
// Controller
// -----------------------------------------------------------------------------

@ApiTags('Journey Bookings')
@Controller('journey-bookings')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class JourneyBookingController {
  constructor(
    // ========================================================================
    // Lifecycle Command Handlers
    // ========================================================================

    @Inject(JOURNEY_BOOKING_TOKENS.COMMAND_HANDLERS.CREATE)
    private readonly createJourneyBookingHandler: CommandHandler<
      CreateJourneyBookingCommand,
      JourneyBookingAggregate
    >,

    @Inject(JOURNEY_BOOKING_TOKENS.COMMAND_HANDLERS.CONFIRM)
    private readonly confirmJourneyBookingHandler: CommandHandler<
      ConfirmJourneyBookingCommand,
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

    // ========================================================================
    // Payment Command Handlers
    // ========================================================================

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

    // ========================================================================
    // Journey Booking Query Handlers
    // ========================================================================

    @Inject(JOURNEY_BOOKING_TOKENS.QUERY_HANDLERS.GET_BY_PUBLIC_ID)
    private readonly getJourneyBookingByPublicIdHandler: QueryHandler<
      GetJourneyBookingByPublicIdQuery,
      JourneyBookingAggregate
    >,

    @Inject(JOURNEY_BOOKING_TOKENS.QUERY_HANDLERS.GET_MY)
    private readonly getMyJourneyBookingsHandler: QueryHandler<
      GetMyJourneyBookingsQuery,
      JourneyBookingEntity[]
    >,

    // ========================================================================
    // Discovery Query Handlers
    // ========================================================================

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
  // Get My Journey Bookings
  // ---------------------------------------------------------------------------

  @Get('mine')
  @RequirePermissions('journey-booking:read')
  public async getMine(
    @Req() request: AuthenticatedRequest,
  ): Promise<JourneyBookingEntity[]> {
    const passengerPublicId = new JourneyBookingPassengerPublicId(
      request.user.publicId,
    );

    return this.getMyJourneyBookingsHandler.execute(
      new GetMyJourneyBookingsQuery(passengerPublicId),
    );
  }

  // ---------------------------------------------------------------------------
  // Find By Journey
  // ---------------------------------------------------------------------------

  @Get('journey/:journeyPublicId')
  @RequirePermissions('journey-booking:read')
  public async findByJourney(
    @Param('journeyPublicId') journeyPublicId: string,
  ): Promise<JourneyBookingEntity[]> {
    return this.findJourneyBookingsByJourneyHandler.execute(
      new FindJourneyBookingsByJourneyQuery(
        new JourneyBookingJourneyPublicId(journeyPublicId),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Find By Passenger
  // ---------------------------------------------------------------------------

  @Get('passenger/:passengerPublicId')
  @RequirePermissions('journey-booking:read')
  public async findByPassenger(
    @Param('passengerPublicId') passengerPublicId: string,
  ): Promise<JourneyBookingEntity[]> {
    return this.findJourneyBookingsByPassengerHandler.execute(
      new FindJourneyBookingsByPassengerQuery(
        new JourneyBookingPassengerPublicId(passengerPublicId),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Find By Status
  // ---------------------------------------------------------------------------

  @Get('status/:status')
  @RequirePermissions('journey-booking:read')
  public async findByStatus(
    @Param('status') status: string,
  ): Promise<JourneyBookingEntity[]> {
    return this.findJourneyBookingsByStatusHandler.execute(
      new FindJourneyBookingsByStatusQuery(this.toJourneyBookingStatus(status)),
    );
  }

  // ---------------------------------------------------------------------------
  // Find By Journey And Passenger
  // ---------------------------------------------------------------------------

  @Get('journey/:journeyPublicId/passenger/:passengerPublicId')
  @RequirePermissions('journey-booking:read')
  public async findByJourneyAndPassenger(
    @Param('journeyPublicId') journeyPublicId: string,
    @Param('passengerPublicId') passengerPublicId: string,
  ): Promise<JourneyBookingEntity[]> {
    return this.findJourneyBookingsByJourneyAndPassengerHandler.execute(
      new FindJourneyBookingsByJourneyAndPassengerQuery(
        new JourneyBookingJourneyPublicId(journeyPublicId),
        new JourneyBookingPassengerPublicId(passengerPublicId),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Find By Transaction
  // ---------------------------------------------------------------------------

  @Get('transaction/:transactionPublicId')
  @RequirePermissions('journey-booking:read')
  public async findByTransaction(
    @Param('transactionPublicId') transactionPublicId: string,
  ): Promise<JourneyBookingEntity> {
    return this.findJourneyBookingByTransactionHandler.execute(
      new FindJourneyBookingByTransactionQuery(
        new JourneyBookingTransactionPublicId(transactionPublicId),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Get Journey Booking By Public ID
  // ---------------------------------------------------------------------------

  @Get(':journeyBookingPublicId')
  @RequirePermissions('journey-booking:read')
  public async getByPublicId(
    @Param('journeyBookingPublicId') journeyBookingPublicId: string,
  ): Promise<JourneyBookingAggregate> {
    return this.getJourneyBookingByPublicIdHandler.execute(
      new GetJourneyBookingByPublicIdQuery(
        new JourneyBookingPublicId(journeyBookingPublicId),
      ),
    );
  }

  // ===========================================================================
  // LIFECYCLE COMMANDS
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Create
  // ---------------------------------------------------------------------------

  @Post()
  @RequirePermissions('journey-booking:create')
  public async create(
    @Body() dto: CreateJourneyBookingDto,
  ): Promise<JourneyBookingAggregate> {
    return this.createJourneyBookingHandler.execute(
      new CreateJourneyBookingCommand(
        new JourneyBookingJourneyPublicId(dto.journeyPublicId),
        new JourneyBookingPassengerPublicId(dto.passengerPublicId),
        JourneyBookingSeats.create(dto.seats),
        dto.correlationId,
        dto.causationId,
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Confirm
  // ---------------------------------------------------------------------------

  @Post(':journeyBookingPublicId/confirm')
  @RequirePermissions('journey-booking:confirm')
  public async confirm(
    @Param('journeyBookingPublicId') journeyBookingPublicId: string,
    @Body() dto: ConfirmJourneyBookingDto,
  ): Promise<JourneyBookingAggregate> {
    return this.confirmJourneyBookingHandler.execute(
      new ConfirmJourneyBookingCommand(
        new JourneyBookingPublicId(journeyBookingPublicId),
        dto.correlationId,
        dto.causationId,
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Cancel
  // ---------------------------------------------------------------------------

  @Post(':journeyBookingPublicId/cancel')
  @RequirePermissions('journey-booking:cancel')
  public async cancel(
    @Param('journeyBookingPublicId') journeyBookingPublicId: string,
    @Body() dto: CancelJourneyBookingDto,
  ): Promise<JourneyBookingAggregate> {
    const reason = JourneyBookingCancellationReason.create(dto.reason);

    return this.cancelJourneyBookingHandler.execute(
      new CancelJourneyBookingCommand(
        // Journey Booking Public ID
        new JourneyBookingPublicId(journeyBookingPublicId),

        // Cancellation Reason
        reason,

        // Correlation ID
        dto.correlationId,

        // Cancelled By Public ID
        dto.cancelledByPublicId,

        // Reason Description
        dto.reasonDescription,

        // Causation ID
        dto.causationId,

        // Cancellation Time
        dto.cancelledAt !== undefined ? new Date(dto.cancelledAt) : undefined,
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Complete
  // ---------------------------------------------------------------------------

  @Post(':journeyBookingPublicId/complete')
  @RequirePermissions('journey-booking:complete')
  public async complete(
    @Param('journeyBookingPublicId') journeyBookingPublicId: string,
    @Body() dto: CompleteJourneyBookingDto,
  ): Promise<JourneyBookingAggregate> {
    return this.completeJourneyBookingHandler.execute(
      new CompleteJourneyBookingCommand(
        new JourneyBookingPublicId(journeyBookingPublicId),
        dto.correlationId,
        dto.causationId,
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Expire
  // ---------------------------------------------------------------------------

  @Post(':journeyBookingPublicId/expire')
  @RequirePermissions('journey-booking:expire')
  public async expire(
    @Param('journeyBookingPublicId') journeyBookingPublicId: string,
    @Body() dto: ExpireJourneyBookingDto,
  ): Promise<JourneyBookingAggregate> {
    return this.expireJourneyBookingHandler.execute(
      new ExpireJourneyBookingCommand(
        new JourneyBookingPublicId(journeyBookingPublicId),
        dto.correlationId,
        dto.causationId,
      ),
    );
  }

  // ===========================================================================
  // PAYMENT COMMANDS
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Authorize Payment
  // ---------------------------------------------------------------------------

  @Post(':journeyBookingPublicId/payment/authorize')
  @RequirePermissions('journey-booking:payment:authorize')
  public async authorizePayment(
    @Param('journeyBookingPublicId') journeyBookingPublicId: string,
    @Body() dto: AuthorizeJourneyBookingPaymentDto,
  ): Promise<JourneyBookingAggregate> {
    return this.authorizeJourneyBookingPaymentHandler.execute(
      new AuthorizeJourneyBookingPaymentCommand(
        new JourneyBookingPublicId(journeyBookingPublicId),
        new JourneyBookingTransactionPublicId(dto.transactionPublicId),
        dto.correlationId,
        dto.causationId,
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Capture Payment
  // ---------------------------------------------------------------------------

  @Post(':journeyBookingPublicId/payment/capture')
  @RequirePermissions('journey-booking:payment:capture')
  public async capturePayment(
    @Param('journeyBookingPublicId') journeyBookingPublicId: string,
    @Body() dto: CaptureJourneyBookingPaymentDto,
  ): Promise<JourneyBookingAggregate> {
    return this.captureJourneyBookingPaymentHandler.execute(
      new CaptureJourneyBookingPaymentCommand(
        new JourneyBookingPublicId(journeyBookingPublicId),
        dto.correlationId,
        dto.causationId,
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Fail Payment
  // ---------------------------------------------------------------------------

  @Post(':journeyBookingPublicId/payment/fail')
  @RequirePermissions('journey-booking:payment:fail')
  public async failPayment(
    @Param('journeyBookingPublicId') journeyBookingPublicId: string,
    @Body() dto: FailJourneyBookingPaymentDto,
  ): Promise<JourneyBookingAggregate> {
    return this.failJourneyBookingPaymentHandler.execute(
      new FailJourneyBookingPaymentCommand(
        new JourneyBookingPublicId(journeyBookingPublicId),
        JourneyBookingPaymentFailureReason.create(dto.failureReason),
        dto.correlationId,
        dto.causationId,
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Refund Payment
  // ---------------------------------------------------------------------------

  @Post(':journeyBookingPublicId/payment/refund')
  @RequirePermissions('journey-booking:payment:refund')
  public async refundPayment(
    @Param('journeyBookingPublicId') journeyBookingPublicId: string,
    @Body() dto: RefundJourneyBookingPaymentDto,
  ): Promise<JourneyBookingAggregate> {
    return this.refundJourneyBookingPaymentHandler.execute(
      new RefundJourneyBookingPaymentCommand(
        new JourneyBookingPublicId(journeyBookingPublicId),
        dto.correlationId,
        dto.causationId,
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Partial Refund
  // ---------------------------------------------------------------------------

  @Post(':journeyBookingPublicId/payment/refund/partial')
  @RequirePermissions('journey-booking:payment:refund')
  public async partiallyRefundPayment(
    @Param('journeyBookingPublicId') journeyBookingPublicId: string,
    @Body() dto: PartiallyRefundJourneyBookingPaymentDto,
  ): Promise<JourneyBookingAggregate> {
    return this.partiallyRefundJourneyBookingPaymentHandler.execute(
      new PartiallyRefundJourneyBookingPaymentCommand(
        new JourneyBookingPublicId(journeyBookingPublicId),
        dto.refundedAmount,
        dto.remainingAmount,
        dto.correlationId,
        dto.causationId,
      ),
    );
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

  // ---------------------------------------------------------------------------
  // Cancellation Reason
  // ---------------------------------------------------------------------------

  private toJourneyBookingCancellationReason(
    value: string,
  ): JourneyBookingCancellationReason {
    const normalized = value.trim().toUpperCase();

    switch (normalized) {
      case 'PASSENGER_REQUEST':
      case 'PROVIDER_REQUEST':
      case 'JOURNEY_CANCELLED':
      case 'NO_SHOW':
      case 'SYSTEM':
      case 'OTHER':
        return JourneyBookingCancellationReason.create(normalized);

      default:
        throw new Error(
          `Invalid Journey Booking cancellation reason '${value}'.`,
        );
    }
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default JourneyBookingController;
