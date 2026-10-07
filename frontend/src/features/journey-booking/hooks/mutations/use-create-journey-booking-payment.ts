// frontend/src/features/journey-booking/hooks/use-create-journey-booking-payment.ts

import { useMutation } from '@tanstack/react-query';

import {
  createJourneyBookingPayment,
  type CreateJourneyBookingPaymentRequest,
  type CreateJourneyBookingPaymentResponse,
} from '../../api';

export interface CreateJourneyBookingPaymentVariables {
  journeyBookingPublicId: string;
  request: CreateJourneyBookingPaymentRequest;
}

export function useCreateJourneyBookingPayment() {
  return useMutation<
    CreateJourneyBookingPaymentResponse,
    Error,
    CreateJourneyBookingPaymentVariables
  >({
    mutationFn: ({
      journeyBookingPublicId,
      request,
    }) =>
      createJourneyBookingPayment(
        journeyBookingPublicId,
        request,
      ),
  });
}