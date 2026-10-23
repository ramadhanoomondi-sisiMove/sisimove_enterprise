
'use client';

/**
 * sisiMove — Admin Booking Mutation Hooks
 *
 * Handles administrative operations on existing journey bookings:
 * - Confirm
 * - Cancel
 * - Complete
 * - Expire
 * - Manage booking snapshots and pricing
 * - Manage payment components
 * - Authorize, capture, fail, and refund payments
 *
 * Booking creation is intentionally excluded.
 *
 * The backend remains responsible for authorization, valid lifecycle
 * transitions, payment processing, and financial consistency.
 *
 * Successful mutations invalidate canonical admin booking query keys.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { adminBookingsApi } from '../api/admin-bookings.api';

import type {
  AuthorizeAdminBookingPaymentRequest,
  CancelAdminBookingRequest,
  CreateAdminBookingSnapshotRequest,
  CreateAdminBookingPaymentRequest,
  FailAdminBookingPaymentRequest,
  PartialAdminBookingRefundRequest,
  SetAdminBookingPricingRequest,
} from '../api/admin-bookings.api';

// -----------------------------------------------------------------------------
// Canonical query keys
// -----------------------------------------------------------------------------
//
// Reuse these keys in useAdminBookings.ts, useAdminBooking.ts, and
// useAdminBookingFilters.ts so all admin booking queries share one cache.

export const adminBookingQueryKeys = {
  all: ['admin-bookings'] as const,

  lists: () => [...adminBookingQueryKeys.all, 'list'] as const,

  list: () => [...adminBookingQueryKeys.lists(), 'all'] as const,

  detail: (journeyBookingPublicId: string) =>
    [
      ...adminBookingQueryKeys.all,
      'detail',
      journeyBookingPublicId.trim(),
    ] as const,

  count: () => [...adminBookingQueryKeys.all, 'count'] as const,

  filters: () => [...adminBookingQueryKeys.all, 'filters'] as const,

  byJourney: (journeyPublicId: string) =>
    [
      ...adminBookingQueryKeys.filters(),
      'journey',
      journeyPublicId.trim(),
    ] as const,

  byPassenger: (passengerPublicId: string) =>
    [
      ...adminBookingQueryKeys.filters(),
      'passenger',
      passengerPublicId.trim(),
    ] as const,

  byStatus: (status: string) =>
    [
      ...adminBookingQueryKeys.filters(),
      'status',
      status.trim().toUpperCase(),
    ] as const,

  byJourneyAndPassenger: (
    journeyPublicId: string,
    passengerPublicId: string,
  ) =>
    [
      ...adminBookingQueryKeys.filters(),
      'journey-passenger',
      journeyPublicId.trim(),
      passengerPublicId.trim(),
    ] as const,

  byTransaction: (transactionPublicId: string) =>
    [
      ...adminBookingQueryKeys.filters(),
      'transaction',
      transactionPublicId.trim(),
    ] as const,
};

// -----------------------------------------------------------------------------
// Shared input validation
// -----------------------------------------------------------------------------

function assertBookingPublicId(
  journeyBookingPublicId: string,
): string {
  const id = journeyBookingPublicId.trim();

  if (!id) {
    throw new Error('Journey booking public ID is required.');
  }

  return id;
}

// -----------------------------------------------------------------------------
// Shared cache invalidation
// -----------------------------------------------------------------------------

async function invalidateAdminBookingQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  journeyBookingPublicId?: string,
): Promise<void> {
  const invalidations = [
    // Refresh admin booking lists, counts, details, and filtered queries.
    queryClient.invalidateQueries({
      queryKey: adminBookingQueryKeys.all,
    }),
  ];

  if (journeyBookingPublicId) {
    invalidations.push(
      queryClient.invalidateQueries({
        queryKey: adminBookingQueryKeys.detail(
          journeyBookingPublicId,
        ),
      }),
    );
  }

  await Promise.all(invalidations);
}

// -----------------------------------------------------------------------------
// Confirm booking
// -----------------------------------------------------------------------------

export function useConfirmAdminBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      journeyBookingPublicId,
      request,
    }: {
      journeyBookingPublicId: string;
      request: AuthorizeAdminBookingPaymentRequest;
    }) => {
      const id = assertBookingPublicId(journeyBookingPublicId);

      if (!request.transactionPublicId.trim()) {
        throw new Error('Transaction public ID is required.');
      }

      return adminBookingsApi.confirm(id, request);
    },

    onSuccess: async (_data, variables) => {
      await invalidateAdminBookingQueries(
        queryClient,
        variables.journeyBookingPublicId,
      );
    },
  });
}

// -----------------------------------------------------------------------------
// Cancel booking
// -----------------------------------------------------------------------------

export function useCancelAdminBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      journeyBookingPublicId,
      request,
    }: {
      journeyBookingPublicId: string;
      request: CancelAdminBookingRequest;
    }) => {
      const id = assertBookingPublicId(journeyBookingPublicId);
      const reason = request.reason.trim();

      if (!reason) {
        throw new Error('A cancellation reason is required.');
      }

      return adminBookingsApi.cancel(id, {
        ...request,
        reason,
      });
    },

    onSuccess: async (_data, variables) => {
      await invalidateAdminBookingQueries(
        queryClient,
        variables.journeyBookingPublicId,
      );
    },
  });
}

// -----------------------------------------------------------------------------
// Complete booking
// -----------------------------------------------------------------------------

export function useCompleteAdminBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      journeyBookingPublicId,
    }: {
      journeyBookingPublicId: string;
    }) => {
      const id = assertBookingPublicId(journeyBookingPublicId);

      return adminBookingsApi.complete(id);
    },

    onSuccess: async (_data, variables) => {
      await invalidateAdminBookingQueries(
        queryClient,
        variables.journeyBookingPublicId,
      );
    },
  });
}

// -----------------------------------------------------------------------------
// Expire booking
// -----------------------------------------------------------------------------

export function useExpireAdminBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      journeyBookingPublicId,
    }: {
      journeyBookingPublicId: string;
    }) => {
      const id = assertBookingPublicId(journeyBookingPublicId);

      return adminBookingsApi.expire(id);
    },

    onSuccess: async (_data, variables) => {
      await invalidateAdminBookingQueries(
        queryClient,
        variables.journeyBookingPublicId,
      );
    },
  });
}

// -----------------------------------------------------------------------------
// Create booking snapshot component
// -----------------------------------------------------------------------------

export function useCreateAdminBookingSnapshot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      journeyBookingPublicId,
      request,
    }: {
      journeyBookingPublicId: string;
      request: CreateAdminBookingSnapshotRequest;
    }) => {
      const id = assertBookingPublicId(journeyBookingPublicId);

      return adminBookingsApi.createSnapshot(id, request);
    },

    onSuccess: async (_data, variables) => {
      await invalidateAdminBookingQueries(
        queryClient,
        variables.journeyBookingPublicId,
      );
    },
  });
}

// -----------------------------------------------------------------------------
// Set or update booking pricing
// -----------------------------------------------------------------------------

export function useSetAdminBookingPricing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      journeyBookingPublicId,
      request,
    }: {
      journeyBookingPublicId: string;
      request: SetAdminBookingPricingRequest;
    }) => {
      const id = assertBookingPublicId(journeyBookingPublicId);

      if (!Number.isInteger(request.seats) || request.seats <= 0) {
        throw new Error('Seats must be a positive integer.');
      }

      return adminBookingsApi.setPricing(id, request);
    },

    onSuccess: async (_data, variables) => {
      await invalidateAdminBookingQueries(
        queryClient,
        variables.journeyBookingPublicId,
      );
    },
  });
}

// -----------------------------------------------------------------------------
// Create payment component for an existing booking
// -----------------------------------------------------------------------------

export function useCreateAdminBookingPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      journeyBookingPublicId,
      request,
    }: {
      journeyBookingPublicId: string;
      request: CreateAdminBookingPaymentRequest;
    }) => {
      const id = assertBookingPublicId(journeyBookingPublicId);

      if (!Number.isFinite(request.amount) || request.amount < 0) {
        throw new Error('Payment amount must be a valid non-negative number.');
      }

      if (!request.currency.trim()) {
        throw new Error('Payment currency is required.');
      }

      return adminBookingsApi.createPayment(id, request);
    },

    onSuccess: async (_data, variables) => {
      await invalidateAdminBookingQueries(
        queryClient,
        variables.journeyBookingPublicId,
      );
    },
  });
}

// -----------------------------------------------------------------------------
// Authorize payment
// -----------------------------------------------------------------------------

export function useAuthorizeAdminBookingPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      journeyBookingPublicId,
      request,
    }: {
      journeyBookingPublicId: string;
      request: AuthorizeAdminBookingPaymentRequest;
    }) => {
      const id = assertBookingPublicId(journeyBookingPublicId);

      if (!request.transactionPublicId.trim()) {
        throw new Error('Transaction public ID is required.');
      }

      return adminBookingsApi.authorizePayment(id, request);
    },

    onSuccess: async (_data, variables) => {
      await invalidateAdminBookingQueries(
        queryClient,
        variables.journeyBookingPublicId,
      );
    },
  });
}

// -----------------------------------------------------------------------------
// Capture payment
// -----------------------------------------------------------------------------

export function useCaptureAdminBookingPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      journeyBookingPublicId,
    }: {
      journeyBookingPublicId: string;
    }) => {
      const id = assertBookingPublicId(journeyBookingPublicId);

      return adminBookingsApi.capturePayment(id);
    },

    onSuccess: async (_data, variables) => {
      await invalidateAdminBookingQueries(
        queryClient,
        variables.journeyBookingPublicId,
      );
    },
  });
}

// -----------------------------------------------------------------------------
// Record payment failure
// -----------------------------------------------------------------------------

export function useFailAdminBookingPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      journeyBookingPublicId,
      request,
    }: {
      journeyBookingPublicId: string;
      request: FailAdminBookingPaymentRequest;
    }) => {
      const id = assertBookingPublicId(journeyBookingPublicId);

      if (!request.failureReason.trim()) {
        throw new Error('Payment failure reason is required.');
      }

      return adminBookingsApi.failPayment(id, request);
    },

    onSuccess: async (_data, variables) => {
      await invalidateAdminBookingQueries(
        queryClient,
        variables.journeyBookingPublicId,
      );
    },
  });
}

// -----------------------------------------------------------------------------
// Full payment refund
// -----------------------------------------------------------------------------

export function useRefundAdminBookingPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      journeyBookingPublicId,
    }: {
      journeyBookingPublicId: string;
    }) => {
      const id = assertBookingPublicId(journeyBookingPublicId);

      return adminBookingsApi.refundPayment(id);
    },

    onSuccess: async (_data, variables) => {
      await invalidateAdminBookingQueries(
        queryClient,
        variables.journeyBookingPublicId,
      );
    },
  });
}

// -----------------------------------------------------------------------------
// Partial payment refund
// -----------------------------------------------------------------------------

export function usePartiallyRefundAdminBookingPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      journeyBookingPublicId,
      request,
    }: {
      journeyBookingPublicId: string;
      request: PartialAdminBookingRefundRequest;
    }) => {
      const id = assertBookingPublicId(journeyBookingPublicId);

      if (
        !Number.isFinite(request.refundedAmount) ||
        request.refundedAmount <= 0
      ) {
        throw new Error('Refunded amount must be greater than zero.');
      }

      if (
        !Number.isFinite(request.remainingAmount) ||
        request.remainingAmount < 0
      ) {
        throw new Error('Remaining amount must be a valid non-negative number.');
      }

      return adminBookingsApi.partiallyRefundPayment(id, request);
    },

    onSuccess: async (_data, variables) => {
      await invalidateAdminBookingQueries(
        queryClient,
        variables.journeyBookingPublicId,
      );
    },
  });
}
