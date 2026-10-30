
// -----------------------------------------------------------------------------
// Admin — Financial Payment Method Mapper
// -----------------------------------------------------------------------------
//
// Maps Financial Payment Method REST responses into admin feature models.
//
// Boundary:
//
// Financial Payment Method REST Response
//              ↓
//       AdminPaymentMethod
//
// Responsibilities:
//
// - preserve the API's public field names;
// - preserve opaque public identifiers;
// - normalize optional response values;
// - keep timestamps in serialized string form;
// - support individual and collection mapping.
//
// Security:
//
// - never expose domain entities or aggregates;
// - never introduce raw payment credentials;
// - never embed the Financial Account aggregate.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Models
// -----------------------------------------------------------------------------

import type { AdminPaymentMethod } from '../models/admin-payment-method.model';

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

/**
 * Maps Financial Payment Method REST responses into admin models.
 */
export class AdminPaymentMethodMapper {
  // ===========================================================================
  // Single Response
  // ===========================================================================

  /**
   * Maps one REST response to the admin feature model.
   *
   * The backend response already contains primitive values, so no domain
   * value-object conversion is performed in the frontend.
   */
  public static toModel(
    response: AdminPaymentMethod,
  ): AdminPaymentMethod {
    return {
      publicId: response.publicId,
      accountPublicId: response.accountPublicId,
      type: response.type,
      provider: response.provider,
      providerReference: response.providerReference ?? undefined,
      displayName: response.displayName ?? undefined,
      lastFour: response.lastFour ?? undefined,
      isDefault: response.isDefault,
      isActive: response.isActive,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    };
  }

  // ===========================================================================
  // Collection
  // ===========================================================================

  /**
   * Maps a collection of REST responses to admin feature models.
   */
  public static toModels(
    responses: readonly AdminPaymentMethod[],
  ): AdminPaymentMethod[] {
    return responses.map((response) => this.toModel(response));
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default AdminPaymentMethodMapper;
