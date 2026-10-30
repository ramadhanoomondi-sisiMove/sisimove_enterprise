import type { FinancialPaymentProviderAggregate } from '../../../domain/aggregates/financial-payment-provider.aggregate';
import type { FinancialPaymentProviderCapabilityEntity } from '../../../domain/entities/financial-payment-provider-capability.entity';

// -----------------------------------------------------------------------------
// Capability Response
// -----------------------------------------------------------------------------

export interface FinancialPaymentProviderCapabilityResponse {
  publicId: string;
  type: string;
  isSupported: boolean;
  isEnabled: boolean;
  canBeUsed: boolean;
  configurationReference?: string;
  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// Provider Response
// -----------------------------------------------------------------------------

export interface FinancialPaymentProviderResponse {
  publicId: string;
  code: string;
  name: string;
  type: string;
  status: string;
  environment: string;
  isEnabled: boolean;
  isOperational: boolean;
  createdAt: string;
  updatedAt: string;
  description?: string;
  configurationReference?: string;
  capabilities: FinancialPaymentProviderCapabilityResponse[];
}

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

/**
 * Maps the Financial Payment Provider aggregate and its owned capabilities
 * into API-safe response objects.
 *
 * This mapper does not execute provider operations, resolve external
 * configuration references, mutate the aggregate, or persist data.
 *
 * Internal entity IDs and provider ownership IDs are not exposed.
 * Optional properties are omitted when undefined.
 */
export class FinancialPaymentProviderResponseMapper {
  // ===========================================================================
  // Aggregate -> Response
  // ===========================================================================

  public static toResponse(
    aggregate: FinancialPaymentProviderAggregate,
  ): FinancialPaymentProviderResponse {
    const response: FinancialPaymentProviderResponse = {
      publicId: aggregate.publicId.value,
      code: aggregate.code.value,
      name: aggregate.name.value,
      type: aggregate.type.value,
      status: aggregate.status.value,
      environment: aggregate.environment.value,
      isEnabled: aggregate.isEnabled,
      isOperational: aggregate.isOperational,
      createdAt: aggregate.createdAt.toISOString(),
      updatedAt: aggregate.updatedAt.toISOString(),
      capabilities: aggregate.capabilities.map((capability) =>
        this.toCapabilityResponse(capability),
      ),
    };

    if (aggregate.provider.description !== undefined) {
      response.description = aggregate.provider.description;
    }

    if (aggregate.provider.configurationReference !== undefined) {
      response.configurationReference =
        aggregate.provider.configurationReference.value;
    }

    return response;
  }

  // ===========================================================================
  // Capability -> Response
  // ===========================================================================

  private static toCapabilityResponse(
    capability: FinancialPaymentProviderCapabilityEntity,
  ): FinancialPaymentProviderCapabilityResponse {
    const response: FinancialPaymentProviderCapabilityResponse = {
      publicId: capability.publicId.value,
      type: capability.type.value,
      isSupported: capability.isSupported,
      isEnabled: capability.isEnabled,
      canBeUsed: capability.canBeUsed(),
      createdAt: capability.createdAt.toISOString(),
      updatedAt: capability.updatedAt.toISOString(),
    };

    if (capability.configurationReference !== undefined) {
      response.configurationReference = capability.configurationReference.value;
    }

    return response;
  }
}
