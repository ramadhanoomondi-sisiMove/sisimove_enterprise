
/**
 * sisiMove — Journey Completions API
 *
 * HTTP adapter for the Journey Completion REST API.
 *
 * Responsibilities:
 * - Expose confirmed completion, confirmation, and dispute endpoints.
 * - Use the authenticated API client.
 * - Encode path parameters safely.
 * - Keep HTTP transport separate from response mapping.
 *
 * Backend source:
 * JourneyCompletionController
 *
 * Base route: /journey-completions
 */

import { authenticatedApiClient } from '@/features/authentication/http/authenticated-api-client';

import type { JourneyCompletionBackendResponse } from '../mappers/journey-completion.mapper';

// -----------------------------------------------------------------------------
// Query contracts
// -----------------------------------------------------------------------------

export interface ListJourneyCompletionsQuery {
  journeyPublicId?: string;
  providerPublicId?: string;
  status?: string;
}

export interface ListJourneyCompletionsByProviderQuery {
  providerPublicId: string;
  status?: string;
}

export interface ListJourneyCompletionsByStatusQuery {
  status: string;
  providerPublicId?: string;
  journeyPublicId?: string;
}

export interface GetJourneyCompletionQuery {
  journeyPublicId?: string;
  providerPublicId?: string;
}

export interface GetJourneyCompletionConfirmationsQuery {
  memberPublicId?: string;
  bookingPublicId?: string;
  role?: string;
  status?: string;
}

export interface GetJourneyCompletionDisputesQuery {
  raisedByPublicId?: string;
  status?: string;
  reason?: string;
}

// -----------------------------------------------------------------------------
// Request contracts
// -----------------------------------------------------------------------------

export interface CreateJourneyCompletionRequest {
  journeyPublicId: string;
  providerPublicId: string;
  requiredConfirmations: number;
  correlationId?: string;
  causationId?: string;
}

export interface RequestJourneyCompletionRequest {
  correlationId?: string;
  causationId?: string;
  requestedAt?: string;
}

export interface ConfirmJourneyCompletionRequest {
  correlationId?: string;
  causationId?: string;
  confirmedAt?: string;
}

export interface WithdrawJourneyCompletionConfirmationRequest {
  memberPublicId?: string;
  correlationId?: string;
  causationId?: string;
}

export interface OpenJourneyCompletionDisputeRequest {
  raisedByPublicId?: string;
  reason: string;
  description?: string;
  correlationId?: string;
  causationId?: string;
}

export interface ReviewJourneyCompletionDisputeRequest {
  correlationId?: string;
  causationId?: string;
  underReviewAt?: string;
}

export interface ResolveJourneyCompletionDisputeRequest {
  resolvedByPublicId?: string;
  resolutionSummary: string;
  correlationId?: string;
  causationId?: string;
  resolvedAt?: string;
}

export interface RejectJourneyCompletionDisputeRequest {
  resolvedByPublicId?: string;
  resolutionSummary: string;
  correlationId?: string;
  causationId?: string;
  rejectedAt?: string;
}

export interface WithdrawJourneyCompletionDisputeRequest {
  withdrawnByPublicId?: string;
  correlationId?: string;
  causationId?: string;
  withdrawnAt?: string;
}

export interface CancelJourneyCompletionRequest {
  correlationId?: string;
  causationId?: string;
  cancelledAt?: string;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

const BASE_PATH = '/journey-completions';

function encodePathSegment(value: string, fieldName: string): string {
  const normalized = value.trim();

  if (!normalized) {
    throw new Error(`${fieldName} is required.`);
  }

  return encodeURIComponent(normalized);
}

function buildQueryString(
  values: Record<string, string | number | boolean | undefined>,
): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(values)) {
    if (value === undefined || value === null) {
      continue;
    }

    const normalized = String(value).trim();

    if (normalized.length === 0) {
      continue;
    }

    params.set(key, normalized);
  }

  const query = params.toString();

  return query ? `?${query}` : '';
}

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

export const journeyCompletionsApi = {
  // ---------------------------------------------------------------------------
  // Queries
  // ---------------------------------------------------------------------------

  /**
   * GET /journey-completions
   */
  async list<TResponse = JourneyCompletionBackendResponse>(
    query: ListJourneyCompletionsQuery = {},
  ): Promise<readonly TResponse[]> {
    const queryString = buildQueryString({
      journeyPublicId: query.journeyPublicId,
      providerPublicId: query.providerPublicId,
      status: query.status,
    });

    return authenticatedApiClient.get<TResponse[]>(
      `${BASE_PATH}${queryString}`,
    );
  },

  /**
   * GET /journey-completions/count-by-status?status=...
   */
  async countByStatus(status: string): Promise<number> {
    const queryString = buildQueryString({ status });

    return authenticatedApiClient.get<number>(
      `${BASE_PATH}/count-by-status${queryString}`,
    );
  },

  /**
   * GET /journey-completions/by-provider?providerPublicId=...&status=...
   */
  async listByProvider<TResponse = JourneyCompletionBackendResponse>(
    query: ListJourneyCompletionsByProviderQuery,
  ): Promise<readonly TResponse[]> {
    const queryString = buildQueryString({
      providerPublicId: query.providerPublicId,
      status: query.status,
    });

    return authenticatedApiClient.get<TResponse[]>(
      `${BASE_PATH}/by-provider${queryString}`,
    );
  },

  /**
   * GET /journey-completions/by-status?status=...&providerPublicId=...&journeyPublicId=...
   */
  async listByStatus<TResponse = JourneyCompletionBackendResponse>(
    query: ListJourneyCompletionsByStatusQuery,
  ): Promise<readonly TResponse[]> {
    const queryString = buildQueryString({
      status: query.status,
      providerPublicId: query.providerPublicId,
      journeyPublicId: query.journeyPublicId,
    });

    return authenticatedApiClient.get<TResponse[]>(
      `${BASE_PATH}/by-status${queryString}`,
    );
  },

  /**
   * GET /journey-completions/by-journey/:journeyPublicId
   */
  async getByJourney<TResponse = JourneyCompletionBackendResponse>(
    journeyPublicId: string,
  ): Promise<TResponse | null> {
    const id = encodePathSegment(journeyPublicId, 'journeyPublicId');

    return authenticatedApiClient.get<TResponse | null>(
      `${BASE_PATH}/by-journey/${id}`,
    );
  },

  /**
   * GET /journey-completions/:journeyCompletionPublicId
   */
  async getByPublicId<TResponse = JourneyCompletionBackendResponse>(
    journeyCompletionPublicId: string,
    query: GetJourneyCompletionQuery = {},
  ): Promise<TResponse | null> {
    const id = encodePathSegment(
      journeyCompletionPublicId,
      'journeyCompletionPublicId',
    );

    const queryString = buildQueryString({
      journeyPublicId: query.journeyPublicId,
      providerPublicId: query.providerPublicId,
    });

    return authenticatedApiClient.get<TResponse | null>(
      `${BASE_PATH}/${id}${queryString}`,
    );
  },

  /**
   * GET /journey-completions/:journeyCompletionPublicId/confirmations
   */
  async getConfirmations<TResponse = unknown>(
    journeyCompletionPublicId: string,
    query: GetJourneyCompletionConfirmationsQuery = {},
  ): Promise<readonly TResponse[]> {
    const id = encodePathSegment(
      journeyCompletionPublicId,
      'journeyCompletionPublicId',
    );

    const queryString = buildQueryString({
      memberPublicId: query.memberPublicId,
      bookingPublicId: query.bookingPublicId,
      role: query.role,
      status: query.status,
    });

    return authenticatedApiClient.get<TResponse[]>(
      `${BASE_PATH}/${id}/confirmations${queryString}`,
    );
  },

  /**
   * GET /journey-completions/:journeyCompletionPublicId/confirmations/:confirmationPublicId
   */
  async getConfirmation<TResponse = unknown>(
    journeyCompletionPublicId: string,
    confirmationPublicId: string,
  ): Promise<TResponse | null> {
    const completionId = encodePathSegment(
      journeyCompletionPublicId,
      'journeyCompletionPublicId',
    );
    const confirmationId = encodePathSegment(
      confirmationPublicId,
      'confirmationPublicId',
    );

    return authenticatedApiClient.get<TResponse | null>(
      `${BASE_PATH}/${completionId}/confirmations/${confirmationId}`,
    );
  },

  /**
   * GET /journey-completions/:journeyCompletionPublicId/disputes
   */
  async getDisputes<TResponse = unknown>(
    journeyCompletionPublicId: string,
    query: GetJourneyCompletionDisputesQuery = {},
  ): Promise<readonly TResponse[]> {
    const id = encodePathSegment(
      journeyCompletionPublicId,
      'journeyCompletionPublicId',
    );

    const queryString = buildQueryString({
      raisedByPublicId: query.raisedByPublicId,
      status: query.status,
      reason: query.reason,
    });

    return authenticatedApiClient.get<TResponse[]>(
      `${BASE_PATH}/${id}/disputes${queryString}`,
    );
  },

  /**
   * GET /journey-completions/:journeyCompletionPublicId/disputes/:disputePublicId
   */
  async getDispute<TResponse = unknown>(
    journeyCompletionPublicId: string,
    disputePublicId: string,
  ): Promise<TResponse | null> {
    const completionId = encodePathSegment(
      journeyCompletionPublicId,
      'journeyCompletionPublicId',
    );
    const disputeId = encodePathSegment(disputePublicId, 'disputePublicId');

    return authenticatedApiClient.get<TResponse | null>(
      `${BASE_PATH}/${completionId}/disputes/${disputeId}`,
    );
  },

  // ---------------------------------------------------------------------------
  // Completion lifecycle
  // ---------------------------------------------------------------------------

  /**
   * POST /journey-completions
   */
  async create<TResponse = JourneyCompletionBackendResponse>(
    request: CreateJourneyCompletionRequest,
  ): Promise<TResponse> {
    return authenticatedApiClient.post<TResponse>(BASE_PATH, request);
  },

  /**
   * POST /journey-completions/:journeyCompletionPublicId/request
   */
  async requestCompletion<TResponse = JourneyCompletionBackendResponse>(
    journeyCompletionPublicId: string,
    request: RequestJourneyCompletionRequest = {},
  ): Promise<TResponse> {
    const id = encodePathSegment(
      journeyCompletionPublicId,
      'journeyCompletionPublicId',
    );

    return authenticatedApiClient.post<TResponse>(
      `${BASE_PATH}/${id}/request`,
      request,
    );
  },

  /**
   * POST /journey-completions/:journeyCompletionPublicId/confirm
   */
  async confirm<TResponse = JourneyCompletionBackendResponse>(
    journeyCompletionPublicId: string,
    request: ConfirmJourneyCompletionRequest = {},
  ): Promise<TResponse> {
    const id = encodePathSegment(
      journeyCompletionPublicId,
      'journeyCompletionPublicId',
    );

    return authenticatedApiClient.post<TResponse>(
      `${BASE_PATH}/${id}/confirm`,
      request,
    );
  },

  /**
   * POST /journey-completions/:journeyCompletionPublicId/confirmations/:confirmationPublicId/withdraw
   */
  async withdrawConfirmation<TResponse = JourneyCompletionBackendResponse>(
    journeyCompletionPublicId: string,
    confirmationPublicId: string,
    request: WithdrawJourneyCompletionConfirmationRequest = {},
  ): Promise<TResponse> {
    const completionId = encodePathSegment(
      journeyCompletionPublicId,
      'journeyCompletionPublicId',
    );
    const confirmationId = encodePathSegment(
      confirmationPublicId,
      'confirmationPublicId',
    );

    return authenticatedApiClient.post<TResponse>(
      `${BASE_PATH}/${completionId}/confirmations/${confirmationId}/withdraw`,
      request,
    );
  },

  /**
   * POST /journey-completions/:journeyCompletionPublicId/cancel
   */
  async cancel<TResponse = JourneyCompletionBackendResponse>(
    journeyCompletionPublicId: string,
    request: CancelJourneyCompletionRequest = {},
  ): Promise<TResponse> {
    const id = encodePathSegment(
      journeyCompletionPublicId,
      'journeyCompletionPublicId',
    );

    return authenticatedApiClient.post<TResponse>(
      `${BASE_PATH}/${id}/cancel`,
      request,
    );
  },

  // ---------------------------------------------------------------------------
  // Disputes
  // ---------------------------------------------------------------------------

  /**
   * POST /journey-completions/:journeyCompletionPublicId/disputes
   */
  async openDispute<TResponse = JourneyCompletionBackendResponse>(
    journeyCompletionPublicId: string,
    request: OpenJourneyCompletionDisputeRequest,
  ): Promise<TResponse> {
    const id = encodePathSegment(
      journeyCompletionPublicId,
      'journeyCompletionPublicId',
    );

    return authenticatedApiClient.post<TResponse>(
      `${BASE_PATH}/${id}/disputes`,
      request,
    );
  },

  /**
   * POST /journey-completions/:journeyCompletionPublicId/disputes/:disputePublicId/review
   */
  async reviewDispute<TResponse = JourneyCompletionBackendResponse>(
    journeyCompletionPublicId: string,
    disputePublicId: string,
    request: ReviewJourneyCompletionDisputeRequest = {},
  ): Promise<TResponse> {
    const completionId = encodePathSegment(
      journeyCompletionPublicId,
      'journeyCompletionPublicId',
    );
    const disputeId = encodePathSegment(disputePublicId, 'disputePublicId');

    return authenticatedApiClient.post<TResponse>(
      `${BASE_PATH}/${completionId}/disputes/${disputeId}/review`,
      request,
    );
  },

  /**
   * POST /journey-completions/:journeyCompletionPublicId/disputes/:disputePublicId/resolve
   */
  async resolveDispute<TResponse = JourneyCompletionBackendResponse>(
    journeyCompletionPublicId: string,
    disputePublicId: string,
    request: ResolveJourneyCompletionDisputeRequest,
  ): Promise<TResponse> {
    const completionId = encodePathSegment(
      journeyCompletionPublicId,
      'journeyCompletionPublicId',
    );
    const disputeId = encodePathSegment(disputePublicId, 'disputePublicId');

    return authenticatedApiClient.post<TResponse>(
      `${BASE_PATH}/${completionId}/disputes/${disputeId}/resolve`,
      request,
    );
  },

  /**
   * POST /journey-completions/:journeyCompletionPublicId/disputes/:disputePublicId/reject
   */
  async rejectDispute<TResponse = JourneyCompletionBackendResponse>(
    journeyCompletionPublicId: string,
    disputePublicId: string,
    request: RejectJourneyCompletionDisputeRequest,
  ): Promise<TResponse> {
    const completionId = encodePathSegment(
      journeyCompletionPublicId,
      'journeyCompletionPublicId',
    );
    const disputeId = encodePathSegment(disputePublicId, 'disputePublicId');

    return authenticatedApiClient.post<TResponse>(
      `${BASE_PATH}/${completionId}/disputes/${disputeId}/reject`,
      request,
    );
  },

  /**
   * POST /journey-completions/:journeyCompletionPublicId/disputes/:disputePublicId/withdraw
   */
  async withdrawDispute<TResponse = JourneyCompletionBackendResponse>(
    journeyCompletionPublicId: string,
    disputePublicId: string,
    request: WithdrawJourneyCompletionDisputeRequest = {},
  ): Promise<TResponse> {
    const completionId = encodePathSegment(
      journeyCompletionPublicId,
      'journeyCompletionPublicId',
    );
    const disputeId = encodePathSegment(disputePublicId, 'disputePublicId');

    return authenticatedApiClient.post<TResponse>(
      `${BASE_PATH}/${completionId}/disputes/${disputeId}/withdraw`,
      request,
    );
  },
};

export default journeyCompletionsApi;
