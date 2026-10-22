
/**
 * sisiMove — Admin Trust Badge Model
 *
 * Represents a Trust badge definition in the frontend.
 *
 * Responsibilities:
 * - Define the frontend model for Trust badges.
 * - Map API responses into frontend model instances.
 * - Keep API transport concerns separate from frontend model usage.
 *
 * Non-responsibilities:
 * - Performing HTTP requests.
 * - Managing badge mutations or permissions.
 * - Defining badge lifecycle rules.
 * - Duplicating backend domain validation.
 */

import type { TrustBadgeApiResponse } from '../types/trust.types';

// -----------------------------------------------------------------------------
// Model
// -----------------------------------------------------------------------------

/**
 * Frontend representation of a Trust badge definition.
 *
 * Timestamps remain ISO strings to keep the model predictable across
 * API responses, React components, and serialized application state.
 */
export interface TrustBadgeModel {
  id: string;
  publicId: string;

  type: string;

  name: string;
  description: string | null;

  assetPublicId: string | null;

  active: boolean;

  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

/**
 * Converts Trust badge API responses into frontend models.
 *
 * This mapper deliberately preserves the backend response values without
 * introducing presentation defaults or additional business rules.
 */
export class TrustBadgeModelMapper {
  // ===========================================================================
  // Individual Response
  // ===========================================================================

  static fromApi(response: TrustBadgeApiResponse): TrustBadgeModel {
    return {
      id: response.id,
      publicId: response.publicId,

      type: response.type,

      name: response.name,
      description: response.description,

      assetPublicId: response.assetPublicId,

      active: response.active,

      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    };
  }

  // ===========================================================================
  // Collection Response
  // ===========================================================================

  static fromApiList(
    responses: TrustBadgeApiResponse[],
  ): TrustBadgeModel[] {
    return responses.map((response) => this.fromApi(response));
  }
}
