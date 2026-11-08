// -----------------------------------------------------------------------------
// sisiMove — My Financial Account API
// -----------------------------------------------------------------------------
//
// Authenticated HTTP operation for retrieving the Financial Account belonging
// to the currently authenticated Identity.
//
// Backend route:
//
//     GET /financial-accounts/me
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Authentication — Authenticated HTTP
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication';

// -----------------------------------------------------------------------------
// Financial Account — Models
// -----------------------------------------------------------------------------

import type { MyFinancialAccount } from '../models';

// -----------------------------------------------------------------------------
// Financial Account — API Response Mapper
// -----------------------------------------------------------------------------

import {
  mapMyFinancialAccount,
  type MyFinancialAccountApiResponse,
} from '../mappers';

// =============================================================================
// Constants
// =============================================================================

const FINANCIAL_ACCOUNTS_PATH = '/financial-accounts';

// =============================================================================
// Get My Financial Account
// =============================================================================

/**
 * Retrieve the Financial Account belonging to the currently authenticated
 * Identity.
 *
 * Backend:
 *
 *     GET /financial-accounts/me
 *
 * Authentication:
 *
 *     Bearer access token
 *
 * The backend resolves ownership from the authenticated IdentityPublicId.
 *
 * The frontend sends no account or owner identifier.
 *
 * The backend response is structurally mapped into MyFinancialAccount before
 * being returned to consumers.
 *
 * Monetary amounts remain integer minor units.
 */
export async function getMyFinancialAccount(): Promise<MyFinancialAccount> {
  const response =
    await authenticatedApiClient.get<MyFinancialAccountApiResponse>(
      `${FINANCIAL_ACCOUNTS_PATH}/me`,
    );

  return mapMyFinancialAccount(response);
}