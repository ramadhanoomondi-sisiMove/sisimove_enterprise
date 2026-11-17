
import { authenticatedApiClient } from '@/features/authentication';

import type { C2BPaymentInstructions } from '../models/c2b-payment-instructions';

const C2B_PAYMENT_INSTRUCTIONS_PATH =
  '/mpesa/c2b/payment-instructions';

/**
 * Retrieves C2B payment instructions for the authenticated member.
 *
 * The backend resolves the member's Financial Account and determines
 * the configured M-PESA C2B business details.
 */
export async function getC2BPaymentInstructions():
  Promise<C2BPaymentInstructions> {
  return authenticatedApiClient.get<C2BPaymentInstructions>(
    C2B_PAYMENT_INSTRUCTIONS_PATH,
  );
}
