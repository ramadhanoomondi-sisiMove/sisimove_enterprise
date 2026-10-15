// -----------------------------------------------------------------------------
// sisiMove — Admin Overview API
// -----------------------------------------------------------------------------
//
// HTTP adapter for the Admin Overview feature.
//
// Responsibilities:
//
// - call Admin Overview metric endpoints;
// - use the authenticated HTTP boundary for protected operations;
// - return typed metric values to the Admin Overview feature.
//
// Non-responsibilities:
//
// - authentication;
// - session management;
// - token storage;
// - authorization;
// - dashboard presentation;
// - backend business rules;
// - direct database access.
//
// Authentication owns the authenticated transport:
//
//     authenticatedApiClient
//
// The backend owns the metric calculations.
//
// -----------------------------------------------------------------------------


import { authenticatedApiClient } from '@/features/authentication';


// =============================================================================
// API Paths
// =============================================================================

const IDENTITIES_API_PATH = '/identities';

const VERIFICATIONS_API_PATH = '/verifications';

const JOURNEYS_API_PATH = '/journeys';

const JOURNEY_BOOKINGS_API_PATH = '/journey-bookings';

const JOURNEY_BOARDINGS_API_PATH = '/journey-boardings';

const JOURNEY_COMPLETIONS_API_PATH = '/journey-completions';

const JOURNEY_SETTLEMENTS_API_PATH = '/journey-settlements';

const FINANCIAL_PAYMENTS_API_PATH = '/financial-payments';


// =============================================================================
// Get Total Members
// =============================================================================
//
// GET /identities/count
//
// Permission: identity:lookup
//
// Response: number
//
// -----------------------------------------------------------------------------

export async function getTotalMembers(): Promise<number> {
  return authenticatedApiClient.get<number>(
    `${IDENTITIES_API_PATH}/count`,
  );
}


// =============================================================================
// Get Pending Verifications
// =============================================================================
//
// GET /verifications/pending-count
//
// Permission: verification:read
//
// Response: number
//
// -----------------------------------------------------------------------------

export async function getPendingVerifications(): Promise<number> {
  return authenticatedApiClient.get<number>(
    `${VERIFICATIONS_API_PATH}/pending-count`,
  );
}


// =============================================================================
// Get Active Journeys
// =============================================================================
//
// GET /journeys/active-count
//
// Permission: journey:read
//
// Response: number
//
// Includes journeys with PUBLISHED, FULL, BOARDING, IN_PROGRESS, or
// COMPLETION_PENDING status, regardless of departure time.
//
// -----------------------------------------------------------------------------

export async function getActiveJourneys(): Promise<number> {
  return authenticatedApiClient.get<number>(
    `${JOURNEYS_API_PATH}/active-count`,
  );
}


// =============================================================================
// Get Total Bookings
// =============================================================================
//
// GET /journey-bookings/count
//
// Permission: booking:read
//
// Response: number
//
// Returns all Journey Booking root records, regardless of booking status.
//
// -----------------------------------------------------------------------------

export async function getTotalBookings(): Promise<number> {
  return authenticatedApiClient.get<number>(
    `${JOURNEY_BOOKINGS_API_PATH}/count`,
  );
}


// =============================================================================
// Get Total Journey Boarding Participants
// =============================================================================
//
// GET /journey-boardings/participants/count
//
// Permission: boarding:read
//
// Response: number
//
// Returns the total number of participants across all Journey Boardings.
//
// -----------------------------------------------------------------------------

export async function getTotalBoardingParticipants(): Promise<number> {
  return authenticatedApiClient.get<number>(
    `${JOURNEY_BOARDINGS_API_PATH}/participants/count`,
  );
}


// =============================================================================
// Get Pending Journey Completions
// =============================================================================
//
// GET /journey-completions/count-by-status?status=PENDING
//
// Permission: journey-completion:read
//
// Response: number
//
// Returns the number of Journey Completion aggregates with PENDING status.
//
// -----------------------------------------------------------------------------

export async function getPendingJourneyCompletions(): Promise<number> {
  return authenticatedApiClient.get<number>(
    `${JOURNEY_COMPLETIONS_API_PATH}/count-by-status?status=PENDING`,
  );
}


// =============================================================================
// Get Pending Journey Settlements
// =============================================================================
//
// GET /journey-settlements/count-by-status?status=PENDING
//
// Permission: journey-settlement:read
//
// Response: number
//
// Returns the number of Journey Settlement aggregates with PENDING status.
//
// -----------------------------------------------------------------------------

export async function getPendingJourneySettlements(): Promise<number> {
  return authenticatedApiClient.get<number>(
    `${JOURNEY_SETTLEMENTS_API_PATH}/count-by-status?status=PENDING`,
  );
}


// =============================================================================
// Get Total Financial Payments
// =============================================================================
//
// GET /financial-payments/count
//
// Permission: financial-payment:read
//
// Response: number
//
// Returns the total number of Financial Payment records, regardless of
// payment status.
//
// -----------------------------------------------------------------------------

export async function getTotalFinancialPayments(): Promise<number> {
  return authenticatedApiClient.get<number>(
    `${FINANCIAL_PAYMENTS_API_PATH}/count`,
  );
}
