
/**
 * sisiMove — Journey Settlements API
 *
 * Responsibilities:
 * - Read journey settlement records.
 * - Retrieve settlement counts and completion-linked settlements.
 * - Create settlements and execute settlement lifecycle commands.
 *
 * All endpoints are protected by the backend.
 * Requests use the shared authenticated API client.
 * Backend authorization and settlement lifecycle rules remain server-owned.
 */

import { authenticatedApiClient } from '@/features/authentication/http/authenticated-api-client';

import type { JourneySettlementBackendResponse } from '../mappers/journey-settlement.mapper';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const BASE_PATH = '/journey-settlements';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type JourneySettlementStatus =
  | 'PENDING'
  | 'SUBMITTED'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'HELD'
  | 'CANCELLED';

export interface ListJourneySettlementsQuery {
  journeyPublicId?: string;
  providerPublicId?: string;
  status?: JourneySettlementStatus;
}

export interface CreateJourneySettlementRequest {
  completionId: string;
  journeyPublicId: string;
  providerPublicId: string;
  correlationId: string;
  causationId: string;
}

export interface JourneySettlementCommandRequest {
  correlationId: string;
  causationId: string;
}

export interface SubmitJourneySettlementRequest
  extends JourneySettlementCommandRequest {
  submittedAt?: string;
}

export interface ProcessJourneySettlementRequest
  extends JourneySettlementCommandRequest {
  processingAt?: string;
}

export interface CompleteJourneySettlementRequest
  extends JourneySettlementCommandRequest {
  financialTransactionPublicId: string;
  completedAt?: string;
}

export interface FailJourneySettlementRequest
  extends JourneySettlementCommandRequest {
  failureReason: string;
  failedAt?: string;
}

export interface HoldJourneySettlementRequest
  extends JourneySettlementCommandRequest {
  heldAt?: string;
}

export interface CancelJourneySettlementRequest
  extends JourneySettlementCommandRequest {
  cancelledAt?: string;
}

export interface GetJourneySettlementByCompletionQuery {
  completionPublicId: string;
}

// -----------------------------------------------------------------------------
// Utilities
// -----------------------------------------------------------------------------

function encodePathSegment(value: string): string {
  return encodeURIComponent(value);
}

function buildQueryString(
  query: Record<string, string | undefined>,
): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value.trim() !== '') {
      params.set(key, value);
    }
  }

  const result = params.toString();

  return result ? `?${result}` : '';
}

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

export const journeySettlementsApi = {
  /**
   * List settlements.
   *
   * GET /journey-settlements
   */
  async list<TResponse = JourneySettlementBackendResponse>(
    query: ListJourneySettlementsQuery = {},
  ): Promise<TResponse[]> {
    const search = buildQueryString({
      journeyPublicId: query.journeyPublicId,
      providerPublicId: query.providerPublicId,
      status: query.status,
    });

    return authenticatedApiClient.get<TResponse[]>(
      `${BASE_PATH}${search}`,
    );
  },

  /**
   * Count settlements for a status.
   *
   * GET /journey-settlements/count-by-status?status=...
   */
  async countByStatus(
    status: JourneySettlementStatus,
  ): Promise<number> {
    const search = buildQueryString({ status });

    return authenticatedApiClient.get<number>(
      `${BASE_PATH}/count-by-status${search}`,
    );
  },

  /**
   * Get a settlement associated with a completion.
   *
   * GET /journey-settlements/by-completion?completionPublicId=...
   */
  async getByCompletion<TResponse = JourneySettlementBackendResponse>(
    completionPublicId: string,
  ): Promise<TResponse | null> {
    const search = buildQueryString({ completionPublicId });

    return authenticatedApiClient.get<TResponse | null>(
      `${BASE_PATH}/by-completion${search}`,
    );
  },

  /**
   * Get one settlement by its public ID.
   *
   * GET /journey-settlements/:journeySettlementPublicId
   */
  async getByPublicId<TResponse = JourneySettlementBackendResponse>(
    journeySettlementPublicId: string,
  ): Promise<TResponse | null> {
    const id = encodePathSegment(journeySettlementPublicId);

    return authenticatedApiClient.get<TResponse | null>(
      `${BASE_PATH}/${id}`,
    );
  },

  /**
   * Create a settlement.
   *
   * POST /journey-settlements
   */
  async create<TResponse = JourneySettlementBackendResponse>(
    request: CreateJourneySettlementRequest,
  ): Promise<TResponse> {
    return authenticatedApiClient.post<TResponse>(
      BASE_PATH,
      request,
    );
  },

  /**
   * Submit a settlement.
   *
   * POST /journey-settlements/:id/submit
   */
  async submit<TResponse = JourneySettlementBackendResponse>(
    journeySettlementPublicId: string,
    request: SubmitJourneySettlementRequest,
  ): Promise<TResponse> {
    const id = encodePathSegment(journeySettlementPublicId);

    return authenticatedApiClient.post<TResponse>(
      `${BASE_PATH}/${id}/submit`,
      request,
    );
  },

  /**
   * Process a settlement.
   *
   * POST /journey-settlements/:id/process
   */
  async process<TResponse = JourneySettlementBackendResponse>(
    journeySettlementPublicId: string,
    request: ProcessJourneySettlementRequest,
  ): Promise<TResponse> {
    const id = encodePathSegment(journeySettlementPublicId);

    return authenticatedApiClient.post<TResponse>(
      `${BASE_PATH}/${id}/process`,
      request,
    );
  },

  /**
   * Complete a settlement.
   *
   * POST /journey-settlements/:id/complete
   */
  async complete<TResponse = JourneySettlementBackendResponse>(
    journeySettlementPublicId: string,
    request: CompleteJourneySettlementRequest,
  ): Promise<TResponse> {
    const id = encodePathSegment(journeySettlementPublicId);

    return authenticatedApiClient.post<TResponse>(
      `${BASE_PATH}/${id}/complete`,
      request,
    );
  },

  /**
   * Mark a settlement as failed.
   *
   * POST /journey-settlements/:id/fail
   */
  async fail<TResponse = JourneySettlementBackendResponse>(
    journeySettlementPublicId: string,
    request: FailJourneySettlementRequest,
  ): Promise<TResponse> {
    const id = encodePathSegment(journeySettlementPublicId);

    return authenticatedApiClient.post<TResponse>(
      `${BASE_PATH}/${id}/fail`,
      request,
    );
  },

  /**
   * Place a settlement on hold.
   *
   * POST /journey-settlements/:id/hold
   */
  async hold<TResponse = JourneySettlementBackendResponse>(
    journeySettlementPublicId: string,
    request: HoldJourneySettlementRequest,
  ): Promise<TResponse> {
    const id = encodePathSegment(journeySettlementPublicId);

    return authenticatedApiClient.post<TResponse>(
      `${BASE_PATH}/${id}/hold`,
      request,
    );
  },

  /**
   * Cancel a settlement.
   *
   * POST /journey-settlements/:id/cancel
   */
  async cancel<TResponse = JourneySettlementBackendResponse>(
    journeySettlementPublicId: string,
    request: CancelJourneySettlementRequest,
  ): Promise<TResponse> {
    const id = encodePathSegment(journeySettlementPublicId);

    return authenticatedApiClient.post<TResponse>(
      `${BASE_PATH}/${id}/cancel`,
      request,
    );
  },
};

export default journeySettlementsApi;
