// src/domains/journey-booking/journey-booking.module.ts

import { Module } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Domain Dependencies
// -----------------------------------------------------------------------------

import { IdentityModule } from '../identity/identity.module';

// -----------------------------------------------------------------------------
// Infrastructure
// -----------------------------------------------------------------------------

import { PrismaModule } from '../../infrastructure/database/prisma/prisma.module';

// -----------------------------------------------------------------------------
// Presentation
// -----------------------------------------------------------------------------

import { JourneyBookingController } from './presentation/rest/controllers/journey-booking.controller';

// -----------------------------------------------------------------------------
// Infrastructure — Dependency Injection
// -----------------------------------------------------------------------------

import { JOURNEY_BOOKING_PROVIDERS } from './infrastructure/dependency-injection/journey-booking.providers';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_BOOKING_TOKENS } from './application/journey-booking.tokens';

// -----------------------------------------------------------------------------
// Application — Command Handlers
// -----------------------------------------------------------------------------

import {
  AuthorizeJourneyBookingPaymentHandler,
  CancelJourneyBookingHandler,
  CaptureJourneyBookingPaymentHandler,
  CompleteJourneyBookingHandler,
  ConfirmJourneyBookingHandler,
  CreateJourneyBookingHandler,
  ExpireJourneyBookingHandler,
  FailJourneyBookingPaymentHandler,
  PartiallyRefundJourneyBookingPaymentHandler,
  RefundJourneyBookingPaymentHandler,
} from './application/command-handlers';

// -----------------------------------------------------------------------------
// Application — Query Handlers
// -----------------------------------------------------------------------------

import {
  FindJourneyBookingByTransactionHandler,
  FindJourneyBookingsByJourneyAndPassengerHandler,
  FindJourneyBookingsByJourneyHandler,
  FindJourneyBookingsByPassengerHandler,
  FindJourneyBookingsByStatusHandler,
  GetJourneyBookingByPublicIdHandler,
  GetJourneyBookingHandler,
  GetMyJourneyBookingsHandler,
} from './application/query-handlers';

// -----------------------------------------------------------------------------
// Module
// -----------------------------------------------------------------------------

@Module({
  // ===========================================================================
  // Imports
  // ===========================================================================

  imports: [
    // -------------------------------------------------------------------------
    // Identity
    //
    // Provides authentication and authorization infrastructure required by the
    // Journey Booking REST presentation boundary.
    // -------------------------------------------------------------------------

    IdentityModule,

    // -------------------------------------------------------------------------
    // Prisma
    //
    // Provides the Prisma client required by Journey Booking persistence.
    // -------------------------------------------------------------------------

    PrismaModule,
  ],

  // ===========================================================================
  // Controllers
  // ===========================================================================

  controllers: [JourneyBookingController],

  // ===========================================================================
  // Providers
  // ===========================================================================

  providers: [
    // -------------------------------------------------------------------------
    // Infrastructure
    // -------------------------------------------------------------------------

    ...JOURNEY_BOOKING_PROVIDERS,

    // =========================================================================
    // Booking Lifecycle Command Handlers
    // =========================================================================

    {
      provide: JOURNEY_BOOKING_TOKENS.COMMAND_HANDLERS.CREATE,
      useClass: CreateJourneyBookingHandler,
    },

    {
      provide: JOURNEY_BOOKING_TOKENS.COMMAND_HANDLERS.CONFIRM,
      useClass: ConfirmJourneyBookingHandler,
    },

    {
      provide: JOURNEY_BOOKING_TOKENS.COMMAND_HANDLERS.CANCEL,
      useClass: CancelJourneyBookingHandler,
    },

    {
      provide: JOURNEY_BOOKING_TOKENS.COMMAND_HANDLERS.COMPLETE,
      useClass: CompleteJourneyBookingHandler,
    },

    {
      provide: JOURNEY_BOOKING_TOKENS.COMMAND_HANDLERS.EXPIRE,
      useClass: ExpireJourneyBookingHandler,
    },

    // =========================================================================
    // Payment Command Handlers
    // =========================================================================

    {
      provide: JOURNEY_BOOKING_TOKENS.COMMAND_HANDLERS.AUTHORIZE_PAYMENT,
      useClass: AuthorizeJourneyBookingPaymentHandler,
    },

    {
      provide: JOURNEY_BOOKING_TOKENS.COMMAND_HANDLERS.CAPTURE_PAYMENT,
      useClass: CaptureJourneyBookingPaymentHandler,
    },

    {
      provide: JOURNEY_BOOKING_TOKENS.COMMAND_HANDLERS.FAIL_PAYMENT,
      useClass: FailJourneyBookingPaymentHandler,
    },

    {
      provide: JOURNEY_BOOKING_TOKENS.COMMAND_HANDLERS.REFUND_PAYMENT,
      useClass: RefundJourneyBookingPaymentHandler,
    },

    {
      provide: JOURNEY_BOOKING_TOKENS.COMMAND_HANDLERS.PARTIALLY_REFUND_PAYMENT,
      useClass: PartiallyRefundJourneyBookingPaymentHandler,
    },

    // =========================================================================
    // Core Query Handlers
    // =========================================================================

    {
      provide: JOURNEY_BOOKING_TOKENS.QUERY_HANDLERS.GET,
      useClass: GetJourneyBookingHandler,
    },

    {
      provide: JOURNEY_BOOKING_TOKENS.QUERY_HANDLERS.GET_BY_PUBLIC_ID,
      useClass: GetJourneyBookingByPublicIdHandler,
    },

    {
      provide: JOURNEY_BOOKING_TOKENS.QUERY_HANDLERS.GET_MY,
      useClass: GetMyJourneyBookingsHandler,
    },

    // =========================================================================
    // Discovery Query Handlers
    // =========================================================================

    {
      provide: JOURNEY_BOOKING_TOKENS.QUERY_HANDLERS.FIND_BY_JOURNEY,
      useClass: FindJourneyBookingsByJourneyHandler,
    },

    {
      provide: JOURNEY_BOOKING_TOKENS.QUERY_HANDLERS.FIND_BY_PASSENGER,
      useClass: FindJourneyBookingsByPassengerHandler,
    },

    {
      provide: JOURNEY_BOOKING_TOKENS.QUERY_HANDLERS.FIND_BY_STATUS,
      useClass: FindJourneyBookingsByStatusHandler,
    },

    {
      provide:
        JOURNEY_BOOKING_TOKENS.QUERY_HANDLERS.FIND_BY_JOURNEY_AND_PASSENGER,
      useClass: FindJourneyBookingsByJourneyAndPassengerHandler,
    },

    {
      provide: JOURNEY_BOOKING_TOKENS.QUERY_HANDLERS.FIND_BY_TRANSACTION,
      useClass: FindJourneyBookingByTransactionHandler,
    },
  ],

  // ===========================================================================
  // Exports
  // ===========================================================================
  //
  // Keep the module boundary narrow.
  //
  // Command and query handlers are consumed internally by the controller and
  // therefore remain private to this module.
  //
  // The repository token is exported so other bounded contexts can integrate
  // with Journey Booking through its application contract rather than directly
  // depending on Prisma persistence.
  // ===========================================================================

  exports: [JOURNEY_BOOKING_TOKENS.REPOSITORY],
})
export class JourneyBookingModule {}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default JourneyBookingModule;
