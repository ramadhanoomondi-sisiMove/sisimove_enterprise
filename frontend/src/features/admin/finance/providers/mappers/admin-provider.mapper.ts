
import type { AdminProvider } from '../models/admin-provider.model';
import type { AdminProviderCapability } from '../models/admin-provider-capability.model';

// -----------------------------------------------------------------------------
// Admin Provider Mapper
// -----------------------------------------------------------------------------

/**
 * Maps Financial Payment Provider API responses into admin frontend models.
 *
 * The backend response already excludes internal entity IDs and exposes
 * public IDs. This mapper preserves that API contract.
 *
 * It does not calculate operational status, change capability states,
 * resolve configuration references, or mutate API data.
 */
export class AdminProviderMapper {
  // ===========================================================================
  // API Response -> Admin Provider
  // ===========================================================================

  public static toModel(response: AdminProvider): AdminProvider {
    return {
      publicId: response.publicId,
      code: response.code,
      name: response.name,
      type: response.type,
      status: response.status,
      environment: response.environment,
      isEnabled: response.isEnabled,
      isOperational: response.isOperational,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
      capabilities: response.capabilities.map((capability) =>
        this.toCapabilityModel(capability),
      ),
      ...(response.description !== undefined && {
        description: response.description,
      }),
      ...(response.configurationReference !== undefined && {
        configurationReference: response.configurationReference,
      }),
    };
  }

  // ===========================================================================
  // API Capability Response -> Admin Capability Model
  // ===========================================================================

  public static toCapabilityModel(
    response: AdminProviderCapability,
  ): AdminProviderCapability {
    return {
      publicId: response.publicId,
      type: response.type,
      isSupported: response.isSupported,
      isEnabled: response.isEnabled,
      canBeUsed: response.canBeUsed,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
      ...(response.configurationReference !== undefined && {
        configurationReference: response.configurationReference,
      }),
    };
  }

  // ===========================================================================
  // API Response List -> Admin Provider List
  // ===========================================================================

  public static toModelList(
    responses: AdminProvider[],
  ): AdminProvider[] {
    return responses.map((response) => this.toModel(response));
  }
}
