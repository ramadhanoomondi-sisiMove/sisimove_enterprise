
import type { AdminJourneySettlementStatus } from '../models/admin-journey-settlement.enums';

// -----------------------------------------------------------------------------
// Query Parameters
// -----------------------------------------------------------------------------

export interface AdminJourneySettlementListParams {
  journeyPublicId?: string;
  providerPublicId?: string;
  status?: AdminJourneySettlementStatus;
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
// Journey Settlement Endpoints
// -----------------------------------------------------------------------------

const BASE_PATH = '/journey-settlements';

export const ADMIN_JOURNEY_SETTLEMENT_ENDPOINTS = {
  // ===========================================================================
  // Queries
  // ===========================================================================

  list: (params?: AdminJourneySettlementListParams): string =>
    `${BASE_PATH}${buildQuery([
      ['journeyPublicId', params?.journeyPublicId],
      ['providerPublicId', params?.providerPublicId],
      ['status', params?.status],
    ])}`,

  countByStatus: (status: AdminJourneySettlementStatus): string =>
    `${BASE_PATH}/count-by-status${buildQuery([
      ['status', status],
    ])}`,

  byCompletion: (completionPublicId: string): string =>
    `${BASE_PATH}/by-completion${buildQuery([
      ['completionPublicId', completionPublicId],
    ])}`,

  detail: (settlementPublicId: string): string =>
    `${BASE_PATH}/${encodeURIComponent(settlementPublicId)}`,

  // ===========================================================================
  // Commands
  // ===========================================================================

  create: (): string => BASE_PATH,

  submit: (settlementPublicId: string): string =>
    `${BASE_PATH}/${encodeURIComponent(settlementPublicId)}/submit`,

  process: (settlementPublicId: string): string =>
    `${BASE_PATH}/${encodeURIComponent(settlementPublicId)}/process`,

  complete: (settlementPublicId: string): string =>
    `${BASE_PATH}/${encodeURIComponent(settlementPublicId)}/complete`,

  fail: (settlementPublicId: string): string =>
    `${BASE_PATH}/${encodeURIComponent(settlementPublicId)}/fail`,

  hold: (settlementPublicId: string): string =>
    `${BASE_PATH}/${encodeURIComponent(settlementPublicId)}/hold`,

  cancel: (settlementPublicId: string): string =>
    `${BASE_PATH}/${encodeURIComponent(settlementPublicId)}/cancel`,
} as const;
