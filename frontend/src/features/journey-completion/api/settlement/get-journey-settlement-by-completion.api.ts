// -----------------------------------------------------------------------------
// sisiMove — Get Journey Settlement By Completion API
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - retrieve the Journey Settlement associated with a Journey Completion;
// - expose the backend HTTP response as a transport-level TypeScript contract;
// - keep domain value objects and backend internal types out of the frontend;
// - use the authenticated API client for all authenticated requests.
//
// Important:
//
// The backend endpoint is:
//
//     GET /journey-settlements/by-completion?completionPublicId=...
//
// The backend query uses `completionPublicId` as the public identifier for the
// Journey Completion.
//
// The backend response mapper returns a JourneySettlementResponse:
//
// - publicId
// - completionId
// - journeyPublicId
// - providerPublicId
// - financialTransactionPublicId
// - status
// - lifecycle timestamps
// - failureReason
// - version
// - audit timestamps
//
// `completionId` is intentionally represented as a string at the transport
// boundary. The frontend must not interpret or construct this value as a
// domain identifier. Public navigation should use `publicId` and
// `completionPublicId` where applicable.
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
 * GET /journey-settlements/by-completion
 *
 * This mirrors JourneySettlementResponse at the backend REST boundary.
 *
 * Transport contracts intentionally use primitives rather than frontend
 * domain value objects. Mapping into frontend models belongs above the HTTP
 * adapter boundary.
 */
export interface GetJourneySettlementByCompletionResponse {
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
   * This value must not be used as a public route identifier by the frontend.
   */
  completionId: string;

  /**
   * Public identifier of the Journey associated with this settlement.
   */
  journeyPublicId: string;

  /**
   * Public identifier of the journey provider.
   */
  providerPublicId: string;

  // ===========================================================================
  // Financial Reference
  // ===========================================================================

  /**
   * Public identifier of the Financial Transaction created or associated
   * during settlement.
   *
   * Undefined while settlement has not reached a state where a financial
   * transaction is available.
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
   * Aggregate version supplied by the backend.
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
 * Query parameters required by the backend:
 *
 * GET /journey-settlements/by-completion?completionPublicId=...
 */
export interface GetJourneySettlementByCompletionQuery {
  /**
   * Public identifier of the Journey Completion.
   */
  completionPublicId: string;
}

// -----------------------------------------------------------------------------
// API Function
// -----------------------------------------------------------------------------

/**
 * Retrieves the Journey Settlement associated with a Journey Completion.
 *
 * Returns `null` when the backend has no settlement for the supplied
 * completion.
 *
 * The frontend does not create, submit, process, complete, fail, hold, or
 * cancel a settlement from this discovery function. Settlement lifecycle
 * remains backend-owned.
 */
export async function getJourneySettlementByCompletion(
  query: GetJourneySettlementByCompletionQuery,
): Promise<GetJourneySettlementByCompletionResponse | null> {
  return authenticatedApiClient.get<
    GetJourneySettlementByCompletionResponse | null
  >('/journey-settlements/by-completion', {
    // -------------------------------------------------------------------------
    // RequestOptions.query accepts an explicit primitive-keyed record.
    //
    // Keep this as an object literal rather than passing `query` directly.
    // -------------------------------------------------------------------------

    query: {
      completionPublicId: query.completionPublicId,
    },
  });
}