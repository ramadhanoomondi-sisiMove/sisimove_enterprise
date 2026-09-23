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
//
// Ownership resolution:
//
//     Browser
//         ↓
//     authenticatedApiClient
//         ↓
//     Bearer access token
//         ↓
//     JwtAuthGuard
//         ↓
//     CurrentIdentity
//         ↓
//     IdentityPublicId
//         ↓
//     FinancialAccountOwnerPublicId
//         ↓
//     GetMyFinancialAccountQuery
//         ↓
//     findByOwnerPublicId()
//         ↓
//     FinancialAccountAggregate
//
// The frontend deliberately does NOT provide:
//
//     - ownerPublicId
//     - accountPublicId
//
// Ownership is established by the authenticated session.
//
// -----------------------------------------------------------------------------
//
// Architectural boundary:
//
// - HTTP transport belongs here.
// - Authentication is handled by authenticatedApiClient.
// - Ownership resolution belongs to the backend.
// - Business rules belong to the FinancialAccount aggregate.
// - Query orchestration belongs to the application layer.
// - Persistence remains behind FinancialAccountRepository.
//
// This API function must remain a thin HTTP boundary.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Authentication — Authenticated HTTP
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication';

// -----------------------------------------------------------------------------
// Financial Account — Models
// -----------------------------------------------------------------------------

import type { MyFinancialAccount } from '../models';

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
 * The backend resolves the Financial Account from the authenticated
 * IdentityPublicId.
 *
 * The frontend therefore sends no account or owner identifier.
 *
 * Expected successful response:
 *
 *     MyFinancialAccount
 *
 * A missing account should be treated according to the backend's HTTP
 * contract. This function deliberately does not invent fallback behavior.
 */
export async function getMyFinancialAccount(): Promise<MyFinancialAccount> {
  return authenticatedApiClient.get<MyFinancialAccount>(
    `${FINANCIAL_ACCOUNTS_PATH}/me`,
  );
}

