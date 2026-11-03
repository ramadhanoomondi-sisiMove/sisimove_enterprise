// =============================================================================
// sisiMove — Get Available Financial Payment Providers API
// =============================================================================
//
// Retrieves enabled and operational payment providers available to members.
//
// Backend endpoint:
// GET /financial-payment-providers/available
//
// =============================================================================

import { authenticatedApiClient } from '@/features/authentication';

import type { FinancialPaymentProvider } from '../models';

import {
  mapFinancialPaymentProvider,
  type FinancialPaymentProviderApiResponse,
} from '../mappers';

const FINANCIAL_PAYMENT_PROVIDERS_PATH =
  '/financial-payment-providers';

export async function getAvailablePaymentProviders(): Promise<
  FinancialPaymentProvider[]
> {
  const response =
    await authenticatedApiClient.get<
      FinancialPaymentProviderApiResponse[]
    >(`${FINANCIAL_PAYMENT_PROVIDERS_PATH}/available`);

  return response.map(mapFinancialPaymentProvider);
}