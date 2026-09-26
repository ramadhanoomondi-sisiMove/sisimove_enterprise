// -----------------------------------------------------------------------------
// sisiMove — List Journey Settlements API
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - retrieve Journey Settlements using the backend-supported filters;
// - expose the backend HTTP response as a transport-level TypeScript contract;
// - keep domain value objects and backend-specific types out of the frontend
//   HTTP boundary;
// - use the authenticated API client for the authenticated request.
//
// Backend endpoint:
//
//     GET /journey-settlements
//
// Supported backend filters:
//
//     journeyPublicId
//     providerPublicId
//     status
//
// Important:
//
// The backend list query returns JourneySettlementEntity[] rather than
// JourneySettlementAggregate[]. Therefore the response contains only the
// Journey Settlement root fields represented by JourneySettlementResponse.
// It does not contain aggregate-specific additional data.
//
// The frontend must not assume that this list endpoint returns a settlement
// aggregate or any nested completion/financial objects.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Authenticated API Client
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http/authenticated-api-client';

// -----------------------------------------------------------------------------
// Response Contract
// -----------------------------------------------------------------------------

/**
 * Raw HTTP representation returned by:
 *
 * GET /journey-settlements
 *
 * This mirrors the fields produced by JourneySettlementResponseMapper when
 * mapping a JourneySettlementEntity.
 */
export interface ListJourneySettlementsResponse {
  // ===========================================================================
  // Identity
  // ===========================================================================

  /**
   * Public identifier of the Journey Settlement.
   */
  publicId: string;

  /**
   * Internal/domain completion identifier exposed by the backend mapper.
   *
   * This must not be used as a public route identifier by the frontend.
   */
  completionId: string;

  /**
   * Public identifier of the associated Journey.
   */
  journeyPublicId: string;

  /**
   * Public identifier of the Journey provider.
   */
  providerPublicId: string;

  // ===========================================================================
  // Financial Reference
  // ===========================================================================

  /**
   * Public identifier of the associated Financial Transaction.
   *
   * Undefined until one has been associated with the settlement.
   */
  financialTransactionPublicId: string | undefined;

  // ===========================================================================
  // Lifecycle
  // ===========================================================================

  /**
   * Backend-controlled settlement lifecycle status.
   */
  status: string;

  /**
   * Time at which settlement was submitted.
   */
  submittedAt: string | undefined;

  /**
   * Time at which settlement processing began.
   */
  processingAt: string | undefined;

  /**
   * Time at which settlement completed successfully.
   */
  completedAt: string | undefined;

  /**
   * Time at which settlement failed.
   */
  failedAt: string | undefined;

  /**
   * Time at which settlement was placed on hold.
   */
  heldAt: string | undefined;

  /**
   * Time at which settlement was cancelled.
   */
  cancelledAt: string | undefined;

  /**
   * Backend-provided failure reason when settlement has failed.
   */
  failureReason: string | undefined;

  /**
   * Aggregate/entity version supplied by the backend.
   */
  version: number;

  // ===========================================================================
  // Audit
  // ===========================================================================

  /**
   * Settlement creation timestamp.
   *
   * JSON transport represents the backend Date as an ISO-8601 string.
   */
  createdAt: string;

  /**
   * Settlement last-update timestamp.
   *
   * JSON transport represents the backend Date as an ISO-8601 string.
   */
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// Query Contract
// -----------------------------------------------------------------------------

/**
 * Optional filters supported by the backend ListJourneySettlementsQuery.
 */
export interface ListJourneySettlementsQuery {
  /**
   * Restrict results to a specific Journey.
   */
  journeyPublicId?: string;

  /**
   * Restrict results to a specific Journey provider.
   */
  providerPublicId?: string;

  /**
   * Restrict results to a specific backend settlement status.
   *
   * Kept as `string` at the HTTP transport boundary rather than coupling this
   * adapter directly to a frontend enum.
   */
  status?: string;
}

// -----------------------------------------------------------------------------
// API Function
// -----------------------------------------------------------------------------

/**
 * Lists Journey Settlement root entities using the backend-supported filters.
 *
 * An empty query retrieves the backend's unfiltered settlement collection
 * subject to its authorization and repository/query-handler rules.
 */
export async function listJourneySettlements(
  query: ListJourneySettlementsQuery = {},
): Promise<ListJourneySettlementsResponse[]> {
  return authenticatedApiClient.get<ListJourneySettlementsResponse[]>(
    '/journey-settlements',
    {
      // -----------------------------------------------------------------------
      // RequestOptions.query expects an explicit primitive-keyed record.
      //
      // Do not pass `query` directly because ListJourneySettlementsQuery does
      // not have the index signature required by the shared API client.
      // -----------------------------------------------------------------------

      query: {
        journeyPublicId: query.journeyPublicId,
        providerPublicId: query.providerPublicId,
        status: query.status,
      },
    },
  );
}