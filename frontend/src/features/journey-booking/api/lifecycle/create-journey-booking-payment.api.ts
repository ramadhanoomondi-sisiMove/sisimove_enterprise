// frontend/src/features/journey-booking/api/journey-bookings/create-journey-booking-payment.api.ts

import { authenticatedApiClient } from '@/features/authentication/http';
import type { JourneyBooking } from '../../models/journey-booking';

export type CreateJourneyBookingPaymentStatus =
  | 'PENDING'
  | 'AUTHORIZED'
  | 'CAPTURED'
  | 'FAILED'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED';

export interface CreateJourneyBookingPaymentRequest {
  status: CreateJourneyBookingPaymentStatus;
  amount: number;
  currency: string;
  transactionPublicId?: string;
  correlationId?: string;
  causationId?: string;
}

export type CreateJourneyBookingPaymentResponse = JourneyBooking;

export async function createJourneyBookingPayment(
  journeyBookingPublicId: string,
  request: CreateJourneyBookingPaymentRequest,
): Promise<CreateJourneyBookingPaymentResponse> {
  const bookingPublicId = journeyBookingPublicId.trim();

  if (!bookingPublicId) {
    throw new TypeError(
      'A Journey Booking public identifier is required.',
    );
  }

  if (!Number.isFinite(request.amount) || request.amount < 0) {
    throw new TypeError(
      'Journey Booking payment amount must be a non-negative number.',
    );
  }

  const currency = request.currency.trim();

  if (!currency) {
    throw new TypeError(
      'Journey Booking payment currency is required.',
    );
  }

  const transactionPublicId = request.transactionPublicId?.trim();

  return authenticatedApiClient.post<CreateJourneyBookingPaymentResponse>(
    `/journey-bookings/${encodeURIComponent(bookingPublicId)}/payment`,
    {
      status: request.status,
      amount: request.amount,
      currency,
      transactionPublicId: transactionPublicId || undefined,
      correlationId: request.correlationId,
      causationId: request.causationId,
    },
  );
}