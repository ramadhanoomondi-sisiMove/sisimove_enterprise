
import {
  authenticatedApiClient,
} from '@/features/authentication/http/authenticated-api-client';

import type { RequestOptions } from '@/foundation/http';

import type {
  AdminJourneyCompletion,
  AdminJourneyCompletionConfirmation,
  AdminJourneyCompletionDispute,
} from '../models/admin-journey-completion.model';

import type {
  AdminJourneyCompletionStatus,
} from '../models/admin-journey-completion.enums';


import {
  ADMIN_JOURNEY_COMPLETION_ENDPOINTS,
  type AdminJourneyCompletionListParams,
  type AdminJourneyCompletionByProviderParams,
  type AdminJourneyCompletionByStatusParams,
  type AdminJourneyCompletionDetailParams,
  type AdminJourneyCompletionConfirmationParams,
  type AdminJourneyCompletionDisputeParams,
} from './admin-journey-completion.endpoints';

// -----------------------------------------------------------------------------
// Admin Journey Completion API
// -----------------------------------------------------------------------------

/**
 * HTTP adapter for Journey Completion administration.
 *
 * Responsibilities:
 * - Retrieve journey completion records.
 * - Retrieve confirmation and dispute records.
 * - Execute supported completion lifecycle commands.
 * - Use the shared authenticated API client.
 *
 * Non-responsibilities:
 * - Authentication session management.
 * - Direct HTTP implementation.
 * - Completion business rules.
 * - Settlement processing.
 * - Local persistence.
 *
 * Journey Settlement is accessed through AdminJourneySettlementApi.
 */
export class AdminJourneyCompletionApi {
  // ===========================================================================
  // Completion Queries
  // ===========================================================================

  /**
   * Retrieve journey completions using optional backend filters.
   */
  public async list(
    params?: AdminJourneyCompletionListParams,
    options: RequestOptions = {},
  ): Promise<AdminJourneyCompletion[]> {
    return authenticatedApiClient.get<AdminJourneyCompletion[]>(
      ADMIN_JOURNEY_COMPLETION_ENDPOINTS.list(params),
      options,
    );
  }

  /**
   * Retrieve the number of completions in a given status.
   */
  public async countByStatus(
    status: AdminJourneyCompletionStatus,
    options: RequestOptions = {},
  ): Promise<number> {
    return authenticatedApiClient.get<number>(
      ADMIN_JOURNEY_COMPLETION_ENDPOINTS.countByStatus(status),
      options,
    );
  }

  /**
   * Retrieve completions associated with a provider.
   */
  public async listByProvider(
    params: AdminJourneyCompletionByProviderParams,
    options: RequestOptions = {},
  ): Promise<AdminJourneyCompletion[]> {
    return authenticatedApiClient.get<AdminJourneyCompletion[]>(
      ADMIN_JOURNEY_COMPLETION_ENDPOINTS.byProvider(params),
      options,
    );
  }

  /**
   * Retrieve completions by status, optionally narrowed by provider or journey.
   */
  public async listByStatus(
    params: AdminJourneyCompletionByStatusParams,
    options: RequestOptions = {},
  ): Promise<AdminJourneyCompletion[]> {
    return authenticatedApiClient.get<AdminJourneyCompletion[]>(
      ADMIN_JOURNEY_COMPLETION_ENDPOINTS.byStatus(params),
      options,
    );
  }

  /**
   * Retrieve a completion associated with a journey.
   *
   * The backend may return null when no completion exists.
   */
  public async getByJourney(
    journeyPublicId: string,
    options: RequestOptions = {},
  ): Promise<AdminJourneyCompletion | null> {
    return authenticatedApiClient.get<AdminJourneyCompletion | null>(
      ADMIN_JOURNEY_COMPLETION_ENDPOINTS.byJourney(journeyPublicId),
      options,
    );
  }

  /**
   * Retrieve one completion with optional journey/provider query constraints.
   */
  public async get(
    completionPublicId: string,
    params?: AdminJourneyCompletionDetailParams,
    options: RequestOptions = {},
  ): Promise<AdminJourneyCompletion | null> {
    return authenticatedApiClient.get<AdminJourneyCompletion | null>(
      ADMIN_JOURNEY_COMPLETION_ENDPOINTS.detail(
        completionPublicId,
        params,
      ),
      options,
    );
  }

  // ===========================================================================
  // Confirmation Queries
  // ===========================================================================

  /**
   * Retrieve confirmations for a completion, optionally filtered.
   */
  public async getConfirmations(
    completionPublicId: string,
    params?: AdminJourneyCompletionConfirmationParams,
    options: RequestOptions = {},
  ): Promise<AdminJourneyCompletionConfirmation[]> {
    return authenticatedApiClient.get<AdminJourneyCompletionConfirmation[]>(
      ADMIN_JOURNEY_COMPLETION_ENDPOINTS.confirmations(
        completionPublicId,
        params,
      ),
      options,
    );
  }

  /**
   * Retrieve one confirmation.
   *
   * The backend may return null when it does not exist.
   */
  public async getConfirmation(
    completionPublicId: string,
    confirmationPublicId: string,
    options: RequestOptions = {},
  ): Promise<AdminJourneyCompletionConfirmation | null> {
    return authenticatedApiClient.get<
      AdminJourneyCompletionConfirmation | null
    >(
      ADMIN_JOURNEY_COMPLETION_ENDPOINTS.confirmation(
        completionPublicId,
        confirmationPublicId,
      ),
      options,
    );
  }

  // ===========================================================================
  // Dispute Queries
  // ===========================================================================

  /**
   * Retrieve disputes for a completion, optionally filtered.
   */
  public async getDisputes(
    completionPublicId: string,
    params?: AdminJourneyCompletionDisputeParams,
    options: RequestOptions = {},
  ): Promise<AdminJourneyCompletionDispute[]> {
    return authenticatedApiClient.get<AdminJourneyCompletionDispute[]>(
      ADMIN_JOURNEY_COMPLETION_ENDPOINTS.disputes(
        completionPublicId,
        params,
      ),
      options,
    );
  }

  /**
   * Retrieve one dispute.
   *
   * The backend may return null when it does not exist.
   */
  public async getDispute(
    completionPublicId: string,
    disputePublicId: string,
    options: RequestOptions = {},
  ): Promise<AdminJourneyCompletionDispute | null> {
    return authenticatedApiClient.get<
      AdminJourneyCompletionDispute | null
    >(
      ADMIN_JOURNEY_COMPLETION_ENDPOINTS.dispute(
        completionPublicId,
        disputePublicId,
      ),
      options,
    );
  }

  // ===========================================================================
  // Completion Commands
  // ===========================================================================

  /**
   * Create a journey completion record.
   */
  public async create<TResponse = AdminJourneyCompletion>(
    input: unknown,
    options: RequestOptions = {},
  ): Promise<TResponse> {
    return authenticatedApiClient.post<TResponse>(
      ADMIN_JOURNEY_COMPLETION_ENDPOINTS.create(),
      input,
      options,
    );
  }

  /**
   * Request completion of a journey.
   */
  public async requestCompletion<TResponse = unknown>(
    completionPublicId: string,
    input?: unknown,
    options: RequestOptions = {},
  ): Promise<TResponse> {
    return authenticatedApiClient.post<TResponse>(
      ADMIN_JOURNEY_COMPLETION_ENDPOINTS.request(completionPublicId),
      input,
      options,
    );
  }

  /**
   * Confirm completion of a journey.
   */
  public async confirm<TResponse = unknown>(
    completionPublicId: string,
    input?: unknown,
    options: RequestOptions = {},
  ): Promise<TResponse> {
    return authenticatedApiClient.post<TResponse>(
      ADMIN_JOURNEY_COMPLETION_ENDPOINTS.confirm(completionPublicId),
      input,
      options,
    );
  }

  /**
   * Withdraw a completion confirmation.
   */
  public async withdrawConfirmation<TResponse = unknown>(
    completionPublicId: string,
    confirmationPublicId: string,
    input?: unknown,
    options: RequestOptions = {},
  ): Promise<TResponse> {
    return authenticatedApiClient.post<TResponse>(
      ADMIN_JOURNEY_COMPLETION_ENDPOINTS.withdrawConfirmation(
        completionPublicId,
        confirmationPublicId,
      ),
      input,
      options,
    );
  }

  /**
   * Open a dispute against a journey completion.
   */
  public async openDispute<TResponse = unknown>(
    completionPublicId: string,
    input: unknown,
    options: RequestOptions = {},
  ): Promise<TResponse> {
    return authenticatedApiClient.post<TResponse>(
      ADMIN_JOURNEY_COMPLETION_ENDPOINTS.openDispute(completionPublicId),
      input,
      options,
    );
  }

  /**
   * Move a dispute into review.
   */
  public async reviewDispute<TResponse = unknown>(
    completionPublicId: string,
    disputePublicId: string,
    input?: unknown,
    options: RequestOptions = {},
  ): Promise<TResponse> {
    return authenticatedApiClient.post<TResponse>(
      ADMIN_JOURNEY_COMPLETION_ENDPOINTS.reviewDispute(
        completionPublicId,
        disputePublicId,
      ),
      input,
      options,
    );
  }

  /**
   * Resolve a dispute.
   */
  public async resolveDispute<TResponse = unknown>(
    completionPublicId: string,
    disputePublicId: string,
    input: unknown,
    options: RequestOptions = {},
  ): Promise<TResponse> {
    return authenticatedApiClient.post<TResponse>(
      ADMIN_JOURNEY_COMPLETION_ENDPOINTS.resolveDispute(
        completionPublicId,
        disputePublicId,
      ),
      input,
      options,
    );
  }

  /**
   * Reject a dispute.
   */
  public async rejectDispute<TResponse = unknown>(
    completionPublicId: string,
    disputePublicId: string,
    input: unknown,
    options: RequestOptions = {},
  ): Promise<TResponse> {
    return authenticatedApiClient.post<TResponse>(
      ADMIN_JOURNEY_COMPLETION_ENDPOINTS.rejectDispute(
        completionPublicId,
        disputePublicId,
      ),
      input,
      options,
    );
  }

  /**
   * Withdraw a dispute.
   */
  public async withdrawDispute<TResponse = unknown>(
    completionPublicId: string,
    disputePublicId: string,
    input?: unknown,
    options: RequestOptions = {},
  ): Promise<TResponse> {
    return authenticatedApiClient.post<TResponse>(
      ADMIN_JOURNEY_COMPLETION_ENDPOINTS.withdrawDispute(
        completionPublicId,
        disputePublicId,
      ),
      input,
      options,
    );
  }

  /**
   * Cancel a journey completion.
   */
  public async cancel<TResponse = unknown>(
    completionPublicId: string,
    input?: unknown,
    options: RequestOptions = {},
  ): Promise<TResponse> {
    return authenticatedApiClient.post<TResponse>(
      ADMIN_JOURNEY_COMPLETION_ENDPOINTS.cancel(completionPublicId),
      input,
      options,
    );
  }
}

// -----------------------------------------------------------------------------
// Shared Instance
// -----------------------------------------------------------------------------

export const adminJourneyCompletionApi = new AdminJourneyCompletionApi();

export default adminJourneyCompletionApi;
