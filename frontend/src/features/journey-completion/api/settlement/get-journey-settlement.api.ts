 // -----------------------------------------------------------------------------
 // sisiMove — Get Journey Settlement API
 // -----------------------------------------------------------------------------
 //
 // Responsibilities:
 //
 // - retrieve one Journey Settlement by its public identifier;
 // - expose the backend HTTP response as a transport-level TypeScript contract;
 // - keep backend/domain value objects out of the frontend HTTP boundary;
 // - use the authenticated API client for the authenticated request.
 //
 // Backend endpoint:
 //
 //     GET /journey-settlements/:journeySettlementPublicId
 //
 // The backend query handler returns:
 //
 //     JourneySettlementAggregate | null
 //
 // The REST response mapper converts that aggregate into a
 // JourneySettlementResponse containing only transport primitives.
 //
 // Important:
 //
 // - `publicId` is the public identifier used by the frontend.
 // - `completionId` is returned by the backend mapper, but it is not a public
 //   route identifier and must not be used to construct frontend routes.
 // - Settlement lifecycle state remains backend-authoritative.
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
 * GET /journey-settlements/:journeySettlementPublicId
 *
 * This mirrors the backend JourneySettlementResponse.
 *
 * The HTTP adapter intentionally keeps the response at the transport
 * boundary. Frontend domain models can map these primitive values into
 * frontend-specific enums/models above this layer.
 */
export interface GetJourneySettlementResponse {
  // ===========================================================================
  // Identity
  // ===========================================================================

  /**
   * Public identifier of the Journey Settlement.
   */
  publicId: string;

  /**
   * Internal/domain completion identifier exposed by the backend response
   * mapper.
   *
   * This must not be treated as the public Journey Completion identifier by
   * the frontend.
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
   * Public identifier of the Financial Transaction associated with settlement.
   *
   * Undefined until a financial transaction has been associated with the
   * settlement.
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
   * Time at which the settlement was submitted.
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
   * Backend-provided reason when settlement failed.
   */
  failureReason: string | undefined;

  /**
   * Aggregate version.
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
// API Function
// -----------------------------------------------------------------------------

/**
 * Retrieves a single Journey Settlement by its public identifier.
 *
 * Returns `null` when the backend cannot find the requested settlement.
 *
 * This is a read-only discovery operation. It does not infer or trigger any
 * settlement lifecycle transition.
 */
export async function getJourneySettlement(
  journeySettlementPublicId: string,
): Promise<GetJourneySettlementResponse | null> {
  return authenticatedApiClient.get<GetJourneySettlementResponse | null>(
    `/journey-settlements/${encodeURIComponent(journeySettlementPublicId)}`,
  );
}