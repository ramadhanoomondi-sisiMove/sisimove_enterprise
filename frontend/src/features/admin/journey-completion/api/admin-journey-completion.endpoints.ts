
import type {
  AdminJourneyCompletionStatus,
  AdminJourneyCompletionConfirmationRole,
  AdminJourneyCompletionConfirmationStatus,
  AdminJourneyCompletionDisputeStatus,
  AdminJourneyCompletionDisputeReason,
} from '../models/admin-journey-completion.enums';

// -----------------------------------------------------------------------------
// Query Parameters
// -----------------------------------------------------------------------------

export interface AdminJourneyCompletionListParams {
  journeyPublicId?: string;
  providerPublicId?: string;
  status?: AdminJourneyCompletionStatus;
}

export interface AdminJourneyCompletionByProviderParams {
  providerPublicId: string;
  status?: AdminJourneyCompletionStatus;
}

export interface AdminJourneyCompletionByStatusParams {
  status: AdminJourneyCompletionStatus;
  providerPublicId?: string;
  journeyPublicId?: string;
}

export interface AdminJourneyCompletionDetailParams {
  journeyPublicId?: string;
  providerPublicId?: string;
}

export interface AdminJourneyCompletionConfirmationParams {
  memberPublicId?: string;
  bookingPublicId?: string;
  role?: AdminJourneyCompletionConfirmationRole;
  status?: AdminJourneyCompletionConfirmationStatus;
}

export interface AdminJourneyCompletionDisputeParams {
  raisedByPublicId?: string;
  status?: AdminJourneyCompletionDisputeStatus;
  reason?: AdminJourneyCompletionDisputeReason;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

type QueryValue = string | undefined;

const buildQuery = (
  values: Array<[string, QueryValue]>,
): string => {
  const query = new URLSearchParams();

  for (const [key, value] of values) {
    if (value !== undefined) {
      query.set(key, value);
    }
  }

  const queryString = query.toString();

  return queryString.length > 0 ? `?${queryString}` : '';
};

// -----------------------------------------------------------------------------
// Journey Completion Endpoints
// -----------------------------------------------------------------------------

const BASE_PATH = '/journey-completions';

export const ADMIN_JOURNEY_COMPLETION_ENDPOINTS = {
  // ===========================================================================
  // Queries
  // ===========================================================================

  list: (params?: AdminJourneyCompletionListParams): string =>
    `${BASE_PATH}${buildQuery([
      ['journeyPublicId', params?.journeyPublicId],
      ['providerPublicId', params?.providerPublicId],
      ['status', params?.status],
    ])}`,

  countByStatus: (status: AdminJourneyCompletionStatus): string =>
    `${BASE_PATH}/count-by-status${buildQuery([
      ['status', status],
    ])}`,

  byProvider: (params: AdminJourneyCompletionByProviderParams): string =>
    `${BASE_PATH}/by-provider${buildQuery([
      ['providerPublicId', params.providerPublicId],
      ['status', params.status],
    ])}`,

  byStatus: (params: AdminJourneyCompletionByStatusParams): string =>
    `${BASE_PATH}/by-status${buildQuery([
      ['status', params.status],
      ['providerPublicId', params.providerPublicId],
      ['journeyPublicId', params.journeyPublicId],
    ])}`,

  byJourney: (journeyPublicId: string): string =>
    `${BASE_PATH}/by-journey/${encodeURIComponent(journeyPublicId)}`,

  detail: (
    completionPublicId: string,
    params?: AdminJourneyCompletionDetailParams,
  ): string =>
    `${BASE_PATH}/${encodeURIComponent(completionPublicId)}${buildQuery([
      ['journeyPublicId', params?.journeyPublicId],
      ['providerPublicId', params?.providerPublicId],
    ])}`,

  // ===========================================================================
  // Confirmation Queries
  // ===========================================================================

  confirmations: (
    completionPublicId: string,
    params?: AdminJourneyCompletionConfirmationParams,
  ): string =>
    `${BASE_PATH}/${encodeURIComponent(completionPublicId)}/confirmations${buildQuery([
      ['memberPublicId', params?.memberPublicId],
      ['bookingPublicId', params?.bookingPublicId],
      ['role', params?.role],
      ['status', params?.status],
    ])}`,

  confirmation: (
    completionPublicId: string,
    confirmationPublicId: string,
  ): string =>
    `${BASE_PATH}/${encodeURIComponent(completionPublicId)}/confirmations/${encodeURIComponent(confirmationPublicId)}`,

  // ===========================================================================
  // Dispute Queries
  // ===========================================================================

  disputes: (
    completionPublicId: string,
    params?: AdminJourneyCompletionDisputeParams,
  ): string =>
    `${BASE_PATH}/${encodeURIComponent(completionPublicId)}/disputes${buildQuery([
      ['raisedByPublicId', params?.raisedByPublicId],
      ['status', params?.status],
      ['reason', params?.reason],
    ])}`,

  dispute: (
    completionPublicId: string,
    disputePublicId: string,
  ): string =>
    `${BASE_PATH}/${encodeURIComponent(completionPublicId)}/disputes/${encodeURIComponent(disputePublicId)}`,

  // ===========================================================================
  // Commands
  // ===========================================================================

  create: (): string => BASE_PATH,

  request: (completionPublicId: string): string =>
    `${BASE_PATH}/${encodeURIComponent(completionPublicId)}/request`,

  confirm: (completionPublicId: string): string =>
    `${BASE_PATH}/${encodeURIComponent(completionPublicId)}/confirm`,

  withdrawConfirmation: (
    completionPublicId: string,
    confirmationPublicId: string,
  ): string =>
    `${BASE_PATH}/${encodeURIComponent(completionPublicId)}/confirmations/${encodeURIComponent(confirmationPublicId)}/withdraw`,

  openDispute: (completionPublicId: string): string =>
    `${BASE_PATH}/${encodeURIComponent(completionPublicId)}/disputes`,

  reviewDispute: (
    completionPublicId: string,
    disputePublicId: string,
  ): string =>
    `${BASE_PATH}/${encodeURIComponent(completionPublicId)}/disputes/${encodeURIComponent(disputePublicId)}/review`,

  resolveDispute: (
    completionPublicId: string,
    disputePublicId: string,
  ): string =>
    `${BASE_PATH}/${encodeURIComponent(completionPublicId)}/disputes/${encodeURIComponent(disputePublicId)}/resolve`,

  rejectDispute: (
    completionPublicId: string,
    disputePublicId: string,
  ): string =>
    `${BASE_PATH}/${encodeURIComponent(completionPublicId)}/disputes/${encodeURIComponent(disputePublicId)}/reject`,

  withdrawDispute: (
    completionPublicId: string,
    disputePublicId: string,
  ): string =>
    `${BASE_PATH}/${encodeURIComponent(completionPublicId)}/disputes/${encodeURIComponent(disputePublicId)}/withdraw`,

  cancel: (completionPublicId: string): string =>
    `${BASE_PATH}/${encodeURIComponent(completionPublicId)}/cancel`,
} as const;
