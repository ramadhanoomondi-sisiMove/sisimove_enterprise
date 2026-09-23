// -----------------------------------------------------------------------------
// sisiMove — My Financial Account Balance API
// -----------------------------------------------------------------------------
//
// Authenticated HTTP operation for retrieving the balance belonging to the
// currently authenticated member's Financial Account.
//
// Backend routes:
//
//     GET /financial-accounts/me
//     GET /financial-accounts/:accountPublicId/balance
//
// -----------------------------------------------------------------------------
//
// The Financial Account controller currently exposes balance retrieval through
// the account public ID:
//
//     GET /financial-accounts/:accountPublicId/balance
//
// There is intentionally no invented:
//
//     GET /financial-accounts/me/balance
//
// endpoint.
//
// The frontend therefore resolves the authenticated member's account first:
//
//     getMyFinancialAccount()
//             ↓
//     MyFinancialAccount.publicId
//             ↓
//     GET /financial-accounts/:accountPublicId/balance
//
// -----------------------------------------------------------------------------
//
// Architectural boundary:
//
// - Authentication is handled by authenticatedApiClient.
// - Account ownership is resolved through the authenticated self-read.
// - The account public ID is obtained from the backend response.
// - No ownerPublicId is accepted from the caller.
// - No database ID is exposed.
// - No financial business rules are implemented here.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Authentication — Authenticated HTTP
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication';

// -----------------------------------------------------------------------------
// Financial Account — Models
// -----------------------------------------------------------------------------

import type {
  FinancialAccountBalance,
  MyFinancialAccount,
} from '../models';

// =============================================================================
// Constants
// =============================================================================

/**
 * Base route for the Financial Account HTTP controller.
 *
 * NestJS:
 *
 *     @Controller('financial-accounts')
 */
const FINANCIAL_ACCOUNTS_PATH = '/financial-accounts';

// =============================================================================
// Get My Financial Account
// =============================================================================

/**
 * Resolve the authenticated member's Financial Account.
 *
 * The backend derives ownership from the authenticated access token.
 *
 * This function is kept private because consumers should use
 * getMyFinancialBalance() rather than manually managing the account
 * resolution sequence.
 */
async function getMyFinancialAccount(): Promise<MyFinancialAccount> {
  return authenticatedApiClient.get<MyFinancialAccount>(
    `${FINANCIAL_ACCOUNTS_PATH}/me`,
  );
}

// =============================================================================
// Get My Financial Balance
// =============================================================================

/**
 * Retrieve the balance belonging to the currently authenticated member.
 *
 * Resolution flow:
 *
 *     authenticated session
 *             ↓
 *     GET /financial-accounts/me
 *             ↓
 *     MyFinancialAccount.publicId
 *             ↓
 *     GET /financial-accounts/:accountPublicId/balance
 *
 * The caller supplies no account identifier.
 *
 * The account public ID is obtained from the authenticated self-read.
 *
 * Backend:
 *
 *     GET /financial-accounts/:accountPublicId/balance
 *
 * Authentication:
 *
 *     Bearer access token
 *
 * Backend authorization:
 *
 *     financial-account:read
 *
 * Expected successful response:
 *
 *     FinancialAccountBalance
 */
export async function getMyFinancialBalance(): Promise<FinancialAccountBalance> {
  const account = await getMyFinancialAccount();

  return authenticatedApiClient.get<FinancialAccountBalance>(
    `${FINANCIAL_ACCOUNTS_PATH}/${encodeURIComponent(
      account.publicId,
    )}/balance`,
  );
}

