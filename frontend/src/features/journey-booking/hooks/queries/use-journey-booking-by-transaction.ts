
'use client';

// -----------------------------------------------------------------------------
// SisiMove — Journey Booking by Transaction Query Hook
// -----------------------------------------------------------------------------
//
// React Query hook for retrieving the Journey Booking associated with a
// financial transaction.
//
// Responsibilities:
// - invoke the transaction-based discovery API;
// - map the transport response into the frontend JourneyBooking model;
// - provide a stable query key containing the transaction public identifier;
// - support conditional execution.
//
// This hook does not resolve transactions or perform payment operations.
// The backend remains authoritative for booking data.
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';

import {
  findJourneyBookingByTransaction,
} from '../../api';
import {
  mapJourneyBooking,
  type JourneyBookingApiResponse,
} from '../../mappers';
import type { JourneyBooking } from '../../models';

const JOURNEY_BOOKING_BY_TRANSACTION_QUERY_KEY =
  'journey-booking-by-transaction';

export interface UseJourneyBookingByTransactionOptions {
  /**
   * Whether the query should execute.
   *
   * Defaults to true when a valid transaction identifier is supplied.
   */
  enabled?: boolean;
}

/**
 * Loads the Journey Booking associated with a transaction.
 */
export function useJourneyBookingByTransaction(
  transactionPublicId: string | undefined,
  options: UseJourneyBookingByTransactionOptions = {},
) {
  const normalizedTransactionPublicId =
    transactionPublicId?.trim() ?? '';

  return useQuery<JourneyBooking, Error>({
    queryKey: [
      JOURNEY_BOOKING_BY_TRANSACTION_QUERY_KEY,
      normalizedTransactionPublicId || null,
    ],

    queryFn: async () => {
      if (!normalizedTransactionPublicId) {
        throw new TypeError(
          'A transaction public identifier is required.',
        );
      }

      const response =
        await findJourneyBookingByTransaction(
          normalizedTransactionPublicId,
        );

      return mapJourneyBooking(
        response as JourneyBookingApiResponse,
      );
    },

    enabled:
      options.enabled !== false &&
      normalizedTransactionPublicId.length > 0,
  });
}
