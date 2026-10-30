import { Entity } from '../../../../foundation/kernel/domain/entity';
import { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

import { FinancialPaymentProviderException } from '../exceptions/financial-payment-provider.exception';

import { FinancialPaymentProviderCapabilityPublicId } from '../value-objects/financial-payment-provider-capability-public-id.vo';

import type { FinancialPaymentProviderCapabilityType } from '../value-objects/financial-payment-provider-capability-type.vo';
import type { FinancialPaymentProviderConfigurationReference } from '../value-objects/financial-payment-provider-configuration-reference.vo';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface FinancialPaymentProviderCapabilityProps {
  providerId: UniqueEntityId;
  type: FinancialPaymentProviderCapabilityType;
  isSupported: boolean;
  isEnabled: boolean;
  configurationReference:
    FinancialPaymentProviderConfigurationReference | undefined;
  createdAt: Date;
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

/**
 * Represents one operation supported by a payment provider.
 *
 * This entity does not execute payment operations. It records capability
 * support, application enablement, and optional secure configuration reference.
 */
export class FinancialPaymentProviderCapabilityEntity extends Entity<
  FinancialPaymentProviderCapabilityProps,
  FinancialPaymentProviderCapabilityPublicId
> {
  public constructor(
    props: FinancialPaymentProviderCapabilityProps,
    id?: UniqueEntityId,
    publicId?: FinancialPaymentProviderCapabilityPublicId,
  ) {
    super(
      props,
      id,
      publicId ?? new FinancialPaymentProviderCapabilityPublicId(),
    );
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(
    providerId: UniqueEntityId,
    type: FinancialPaymentProviderCapabilityType,
    isSupported = false,
    configurationReference?: FinancialPaymentProviderConfigurationReference,
  ): FinancialPaymentProviderCapabilityEntity {
    const now = new Date();

    return new FinancialPaymentProviderCapabilityEntity(
      {
        providerId,
        type,
        isSupported,
        // An unsupported capability cannot be enabled.
        isEnabled: false,
        configurationReference,
        createdAt: now,
        updatedAt: now,
      },
      new UniqueEntityId(),
      new FinancialPaymentProviderCapabilityPublicId(),
    );
  }

  public static rehydrate(
    props: FinancialPaymentProviderCapabilityProps,
    id: UniqueEntityId,
    publicId: FinancialPaymentProviderCapabilityPublicId,
  ): FinancialPaymentProviderCapabilityEntity {
    return new FinancialPaymentProviderCapabilityEntity(props, id, publicId);
  }

  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  public override get publicId(): FinancialPaymentProviderCapabilityPublicId {
    return super.publicId;
  }

  // ---------------------------------------------------------------------------
  // Provider Reference
  // ---------------------------------------------------------------------------

  public get providerId(): UniqueEntityId {
    return this.props.providerId;
  }

  public belongsTo(providerId: UniqueEntityId): boolean {
    return this.props.providerId.equals(providerId);
  }

  // ---------------------------------------------------------------------------
  // Capability
  // ---------------------------------------------------------------------------

  public get type(): FinancialPaymentProviderCapabilityType {
    return this.props.type;
  }

  public get isSupported(): boolean {
    return this.props.isSupported;
  }

  public get isEnabled(): boolean {
    return this.props.isEnabled;
  }

  public get configurationReference():
    FinancialPaymentProviderConfigurationReference | undefined {
    return this.props.configurationReference;
  }

  public supports(type: FinancialPaymentProviderCapabilityType): boolean {
    return this.props.type.equals(type) && this.props.isSupported;
  }

  public canBeUsed(): boolean {
    return this.props.isSupported && this.props.isEnabled;
  }

  // ---------------------------------------------------------------------------
  // Configuration
  // ---------------------------------------------------------------------------

  public setConfigurationReference(
    reference?: FinancialPaymentProviderConfigurationReference,
  ): void {
    this.props.configurationReference = reference;
    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Capability Lifecycle
  // ---------------------------------------------------------------------------

  public enable(): void {
    if (!this.props.isSupported) {
      throw new FinancialPaymentProviderException(
        `Cannot enable unsupported capability: ${this.props.type.value}`,
      );
    }

    if (this.props.isEnabled) {
      return;
    }

    this.props.isEnabled = true;
    this.touch();
  }

  public disable(): void {
    if (!this.props.isEnabled) {
      return;
    }

    this.props.isEnabled = false;
    this.touch();
  }

  public setSupported(isSupported: boolean): void {
    if (this.props.isSupported === isSupported) {
      return;
    }

    this.props.isSupported = isSupported;

    // A capability that is no longer supported must not remain enabled.
    if (!isSupported) {
      this.props.isEnabled = false;
    }

    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  public get createdAt(): Date {
    return new Date(this.props.createdAt);
  }

  public get updatedAt(): Date {
    return new Date(this.props.updatedAt);
  }

  public setUpdatedAt(updatedAt: Date): void {
    this.props.updatedAt = new Date(updatedAt);
  }

  // ---------------------------------------------------------------------------
  // Equality
  // ---------------------------------------------------------------------------

  public override equals(
    other?: FinancialPaymentProviderCapabilityEntity,
  ): boolean {
    return other !== undefined && this.id.equals(other.id);
  }
}
