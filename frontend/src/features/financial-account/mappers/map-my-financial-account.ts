// =============================================================================
// sisiMove — Map My Financial Account
// =============================================================================
//
// Maps the authenticated Financial Account API response into the frontend
// MyFinancialAccount model.
//
// This mapper is a frontend boundary adapter.
//
// Responsibilities:
// - translate API response data into the frontend model;
// - translate the nested backend balance into the flattened frontend account
//   balance fields;
// - preserve API-safe public identifiers;
// - keep backend response details out of UI components.
//
// Non-responsibilities:
// - financial calculations;
// - ownership validation;
// - lifecycle rules;
// - balance mutation;
// - API communication.
//
// IMPORTANT:
//
// The backend FinancialAccountResponse contains balance as an aggregate-owned
// nested object:
//
//     FinancialAccount
//          └── balance
//              ├── availableAmount
//              ├── pendingAmount
//              ├── heldAmount
//              └── version
//
// The frontend MyFinancialAccount model intentionally exposes the monetary
// values directly:
//
//     MyFinancialAccount
//     ├── availableAmount
//     ├── pendingAmount
//     ├── heldAmount
//     └── balanceVersion
//
// Therefore this mapper performs a structural transformation from the
// backend's nested representation into the frontend's flattened contract.
//
// No financial calculation is performed here.
// =============================================================================

import type { MyFinancialAccount } from '../models';

import {
  mapFinancialAccountBalance,
} from './map-financial-account-balance';

// =============================================================================
// API Response Type
// =============================================================================

/**
 * Backend response shape consumed by the mapper.
 *
 * This is intentionally structural rather than coupled to a backend DTO
 * class. The frontend only needs the serialized HTTP representation.
 */
export interface MyFinancialAccountApiResponse {
  readonly publicId: string;

  readonly type: MyFinancialAccount['type'];

  readonly status: MyFinancialAccount['status'];

  readonly currency: string;

  readonly ownerPublicId?: string | null;

  readonly balance: {
    readonly publicId: string;
    readonly accountPublicId: string;
    readonly availableAmount: number;
    readonly pendingAmount: number;
    readonly heldAmount: number;
    readonly totalAmount: number;
    readonly currency: string;
    readonly version: number;
    readonly createdAt: string;
    readonly updatedAt: string;
  };

  readonly createdAt: string;

  readonly updatedAt: string;
}

// =============================================================================
// Mapper
// =============================================================================

/**
 * Map a backend Financial Account response into the frontend
 * MyFinancialAccount model.
 */
export function mapMyFinancialAccount(
  response: MyFinancialAccountApiResponse,
): MyFinancialAccount {
  // ---------------------------------------------------------------------------
  // Balance
  // ---------------------------------------------------------------------------
  //
  // Keep balance transformation inside the dedicated balance mapper.
  //
  // The result is then projected into the flattened MyFinancialAccount
  // contract below.
  //
  const balance =
    mapFinancialAccountBalance(response.balance);

  // ---------------------------------------------------------------------------
  // Account
  // ---------------------------------------------------------------------------

  return {
    // -------------------------------------------------------------------------
    // Identity
    // -------------------------------------------------------------------------

    publicId: response.publicId,

    // -------------------------------------------------------------------------
    // Account
    // -------------------------------------------------------------------------

    type: response.type,

    status: response.status,

    currency: response.currency,

    ...(response.ownerPublicId != null
      ? {
          ownerPublicId: response.ownerPublicId,
        }
      : {}),

    // -------------------------------------------------------------------------
    // Flattened balance
    // -------------------------------------------------------------------------
    //
    // MyFinancialAccount does not expose a nested `balance` property.
    //
    // These values originate directly from the backend Financial Account
    // aggregate's balance entity.
    //
    availableAmount:
      balance.availableAmount,

    pendingAmount:
      balance.pendingAmount,

    heldAmount:
      balance.heldAmount,

    balanceVersion:
      balance.version,

    // -------------------------------------------------------------------------
    // Audit
    // -------------------------------------------------------------------------

    createdAt: response.createdAt,

    updatedAt: response.updatedAt,
  };
}
