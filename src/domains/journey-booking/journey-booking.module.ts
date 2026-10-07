// src/domains/journey-booking/journey-booking.module.ts

// -----------------------------------------------------------------------------

// Journey Booking — Module

// -----------------------------------------------------------------------------

import { Module } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Domain Dependencies
// -----------------------------------------------------------------------------

import { IdentityModule } from '../identity/identity.module';
import { JourneyModule } from '../journey/journey.module';
import { SocialModule } from '../social/social.module';
import { TrustModule } from '../trust/trust.module';

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
  CreateJourneyBookingPaymentHandler,
  CreateJourneyBookingSnapshotHandler,
  ExpireJourneyBookingHandler,
  FailJourneyBookingPaymentHandler,
  PartiallyRefundJourneyBookingPaymentHandler,
  RefundJourneyBookingPaymentHandler,
  SetJourneyBookingPricingHandler,
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
  GetJourneyBookingDetailQueryHandler,
  GetJourneyBookingHandler,
  GetMyJourneyBookingDetailsQueryHandler,
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
    // -------------------------------------------------------------------------

    IdentityModule,

    // -------------------------------------------------------------------------
    // Journey
    // -------------------------------------------------------------------------

    JourneyModule,

    // -------------------------------------------------------------------------
    // Social
    // -------------------------------------------------------------------------

    SocialModule,

    // -------------------------------------------------------------------------
    // Trust
    // -------------------------------------------------------------------------

    TrustModule,

    // -------------------------------------------------------------------------
    // Prisma
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
    // Booking Creation
    // =========================================================================

    {
      provide: JOURNEY_BOOKING_TOKENS.COMMAND_HANDLERS.CREATE,
      useClass: CreateJourneyBookingHandler,
    },

    // =========================================================================
    // Booking Components
    // =========================================================================

    {
      provide: JOURNEY_BOOKING_TOKENS.COMMAND_HANDLERS.CREATE_SNAPSHOT,
      useClass: CreateJourneyBookingSnapshotHandler,
    },

    {
      provide: JOURNEY_BOOKING_TOKENS.COMMAND_HANDLERS.SET_PRICING,
      useClass: SetJourneyBookingPricingHandler,
    },

    {
      provide: JOURNEY_BOOKING_TOKENS.COMMAND_HANDLERS.CREATE_PAYMENT,
      useClass: CreateJourneyBookingPaymentHandler,
    },

    // =========================================================================
    // Booking Lifecycle Command Handlers
    // =========================================================================

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
    // Journey Booking Detail Query Handlers
    // =========================================================================

    GetJourneyBookingDetailQueryHandler,

    {
      provide: JOURNEY_BOOKING_TOKENS.QUERY_HANDLERS.GET_DETAIL,
      useExisting: GetJourneyBookingDetailQueryHandler,
    },

    {
      provide: JOURNEY_BOOKING_TOKENS.QUERY_HANDLERS.GET_MY_DETAILS,
      useClass: GetMyJourneyBookingDetailsQueryHandler,
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

  exports: [JOURNEY_BOOKING_TOKENS.REPOSITORY],
})
export class JourneyBookingModule {}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default JourneyBookingModule;
