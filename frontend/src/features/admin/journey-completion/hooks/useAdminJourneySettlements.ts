
import {
  useQuery,
} from '@tanstack/react-query';

import {
  adminJourneySettlementApi,
} from '../api';

import type {
  AdminJourneySettlementListParams,
} from '../api/admin-journey-settlement.endpoints';

import type {
  AdminJourneySettlement,
} from '../models/admin-journey-settlement.model';

import {
  AdminJourneySettlementStatus,
} from '../models/admin-journey-settlement.enums';

// -----------------------------------------------------------------------------
// Query Keys
// -----------------------------------------------------------------------------

export const adminJourneySettlementKeys = {
  all: ['admin', 'journey-settlements'] as const,

  lists: () =>
    [...adminJourneySettlementKeys.all, 'list'] as const,

  list: (params: AdminJourneySettlementListParams = {}) =>
    [
      ...adminJourneySettlementKeys.lists(),
      params.journeyPublicId ?? null,
      params.providerPublicId ?? null,
      params.status ?? null,
    ] as const,

  counts: () =>
    [...adminJourneySettlementKeys.all, 'count'] as const,

  countByStatus: (status: AdminJourneySettlementStatus) =>
    [
      ...adminJourneySettlementKeys.counts(),
      status,
    ] as const,

  byCompletions: () =>
    [...adminJourneySettlementKeys.all, 'by-completion'] as const,

  byCompletion: (completionPublicId: string) =>
    [
      ...adminJourneySettlementKeys.byCompletions(),
      completionPublicId.trim(),
    ] as const,

  details: () =>
    [...adminJourneySettlementKeys.all, 'detail'] as const,

  detail: (settlementPublicId: string) =>
    [
      ...adminJourneySettlementKeys.details(),
      settlementPublicId.trim(),
    ] as const,
};

// -----------------------------------------------------------------------------
// Query Hooks
// -----------------------------------------------------------------------------

/**
 * Retrieve Journey Settlements using optional backend filters.
 */
export const useAdminJourneySettlements = (
  params: AdminJourneySettlementListParams = {},
) =>
  useQuery<AdminJourneySettlement[], Error>({
    queryKey: adminJourneySettlementKeys.list(params),
    queryFn: () => adminJourneySettlementApi.list(params),
  });

/**
 * Retrieve the number of settlements in a given status.
 */
export const useAdminJourneySettlementCountByStatus = (
  status: AdminJourneySettlementStatus,
) =>
  useQuery<number, Error>({
    queryKey: adminJourneySettlementKeys.countByStatus(status),
    queryFn: () => adminJourneySettlementApi.countByStatus(status),
  });

/**
 * Retrieve the settlement associated with a completion.
 *
 * The backend may return null when no settlement exists.
 */
export const useAdminJourneySettlementByCompletion = (
  completionPublicId: string,
) =>
  useQuery<AdminJourneySettlement | null, Error>({
    queryKey:
      adminJourneySettlementKeys.byCompletion(completionPublicId),
    queryFn: () =>
      adminJourneySettlementApi.getByCompletion(completionPublicId),
    enabled: completionPublicId.trim().length > 0,
  });

/**
 * Retrieve one settlement by its public ID.
 *
 * The backend may return null when it does not exist.
 */
export const useAdminJourneySettlement = (
  settlementPublicId: string,
) =>
  useQuery<AdminJourneySettlement | null, Error>({
    queryKey:
      adminJourneySettlementKeys.detail(settlementPublicId),
    queryFn: () =>
      adminJourneySettlementApi.get(settlementPublicId),
    enabled: settlementPublicId.trim().length > 0,
  });
