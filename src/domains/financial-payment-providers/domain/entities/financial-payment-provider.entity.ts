import { Entity } from '../../../../foundation/kernel/domain/entity';
import { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

import { FinancialPaymentProviderException } from '../exceptions/financial-payment-provider.exception';
import { FinancialPaymentProviderInvalidStatusException } from '../exceptions/financial-payment-provider-invalid-status.exception';
import { FinancialPaymentProviderNotReadyException } from '../exceptions/financial-payment-provider-not-ready.exception';
import { FinancialPaymentProviderCapabilityNotSupportedException } from '../exceptions/financial-payment-provider-capability-not-supported.exception';
import { FinancialPaymentProviderCapabilityDisabledException } from '../exceptions/financial-payment-provider-capability-disabled.exception';

import { FinancialPaymentProviderPublicId } from '../value-objects/financial-payment-provider-public-id.vo';
import type { FinancialPaymentProviderCode } from '../value-objects/financial-payment-provider-code.vo';
import type { FinancialPaymentProviderName } from '../value-objects/financial-payment-provider-name.vo';
import type { FinancialPaymentProviderType } from '../value-objects/financial-payment-provider-type.vo';
import { FinancialPaymentProviderStatus } from '../value-objects/financial-payment-provider-status.vo';
import type { FinancialPaymentProviderEnvironment } from '../value-objects/financial-payment-provider-environment.vo';
import type { FinancialPaymentProviderConfigurationReference } from '../value-objects/financial-payment-provider-configuration-reference.vo';
import type { FinancialPaymentProviderCapabilityType } from '../value-objects/financial-payment-provider-capability-type.vo';

import type { FinancialPaymentProviderCapabilityEntity } from './financial-payment-provider-capability.entity';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface FinancialPaymentProviderProps {
  code: FinancialPaymentProviderCode;
  name: FinancialPaymentProviderName;
  description: string | undefined;
  type: FinancialPaymentProviderType;
  integrationStatus: FinancialPaymentProviderStatus;
  environment: FinancialPaymentProviderEnvironment;
  isEnabled: boolean;
  configurationReference:
    FinancialPaymentProviderConfigurationReference | undefined;
  capabilities: FinancialPaymentProviderCapabilityEntity[];
  createdAt: Date;
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

/**
 * Financial Payment Provider Entity.
 *
 * Responsibilities:
 * - Provider identity and descriptive configuration.
 * - Integration status and operational enablement.
 * - Provider environment.
 * - Capability lifecycle and eligibility checks.
 *
 * This entity does not perform network requests or execute payments.
 */
export class FinancialPaymentProviderEntity extends Entity<
  FinancialPaymentProviderProps,
  FinancialPaymentProviderPublicId
> {
  public constructor(
    props: FinancialPaymentProviderProps,
    id?: UniqueEntityId,
    publicId?: FinancialPaymentProviderPublicId,
  ) {
    super(props, id, publicId ?? new FinancialPaymentProviderPublicId());
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(
    code: FinancialPaymentProviderCode,
    name: FinancialPaymentProviderName,
    type: FinancialPaymentProviderType,
    environment: FinancialPaymentProviderEnvironment,
    options?: {
      description?: string;
      configurationReference?: FinancialPaymentProviderConfigurationReference;
      capabilities?: FinancialPaymentProviderCapabilityEntity[];
    },
  ): FinancialPaymentProviderEntity {
    const now = new Date();

    const entity = new FinancialPaymentProviderEntity(
      {
        code,
        name,
        type,
        description: FinancialPaymentProviderEntity.normalizeDescription(
          options?.description,
        ),
        integrationStatus: FinancialPaymentProviderStatus.notConfigured(),
        environment,
        isEnabled: false,
        configurationReference: options?.configurationReference,
        capabilities: [],
        createdAt: now,
        updatedAt: now,
      },
      new UniqueEntityId(),
      new FinancialPaymentProviderPublicId(),
    );

    for (const capability of options?.capabilities ?? []) {
      entity.addCapability(capability);
    }

    return entity;
  }

  public static rehydrate(
    props: FinancialPaymentProviderProps,
    id: UniqueEntityId,
    publicId: FinancialPaymentProviderPublicId,
  ): FinancialPaymentProviderEntity {
    return new FinancialPaymentProviderEntity(props, id, publicId);
  }

  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  public override get publicId(): FinancialPaymentProviderPublicId {
    return super.publicId;
  }

  // ---------------------------------------------------------------------------
  // Provider Configuration
  // ---------------------------------------------------------------------------

  public get code(): FinancialPaymentProviderCode {
    return this.props.code;
  }

  public get name(): FinancialPaymentProviderName {
    return this.props.name;
  }

  public get description(): string | undefined {
    return this.props.description;
  }

  public get type(): FinancialPaymentProviderType {
    return this.props.type;
  }

  public get environment(): FinancialPaymentProviderEnvironment {
    return this.props.environment;
  }

  public get configurationReference():
    FinancialPaymentProviderConfigurationReference | undefined {
    return this.props.configurationReference;
  }

  public get integrationStatus(): FinancialPaymentProviderStatus {
    return this.props.integrationStatus;
  }

  public get isEnabled(): boolean {
    return this.props.isEnabled;
  }

  public get createdAt(): Date {
    return new Date(this.props.createdAt);
  }

  public get updatedAt(): Date {
    return new Date(this.props.updatedAt);
  }

  // ---------------------------------------------------------------------------
  // Capability Collection
  // ---------------------------------------------------------------------------

  /**
   * Returns a defensive array copy so callers cannot add or remove capabilities
   * without using aggregate operations.
   */
  public get capabilities(): FinancialPaymentProviderCapabilityEntity[] {
    return [...this.props.capabilities];
  }

  public addCapability(
    capability: FinancialPaymentProviderCapabilityEntity,
  ): void {
    if (!capability.belongsTo(this.id)) {
      throw new FinancialPaymentProviderException(
        'Capability belongs to a different Financial Payment Provider.',
      );
    }

    const alreadyExists = this.props.capabilities.some((existing) =>
      existing.type.equals(capability.type),
    );

    if (alreadyExists) {
      throw new FinancialPaymentProviderException(
        `Capability already exists: ${capability.type.value}`,
      );
    }

    this.props.capabilities.push(capability);
    this.touch();
  }

  public removeCapability(type: FinancialPaymentProviderCapabilityType): void {
    const index = this.props.capabilities.findIndex((capability) =>
      capability.type.equals(type),
    );

    if (index === -1) {
      return;
    }

    this.props.capabilities.splice(index, 1);
    this.touch();
  }

  public getCapability(
    type: FinancialPaymentProviderCapabilityType,
  ): FinancialPaymentProviderCapabilityEntity | undefined {
    return this.props.capabilities.find((capability) =>
      capability.type.equals(type),
    );
  }

  // ---------------------------------------------------------------------------
  // Provider Metadata
  // ---------------------------------------------------------------------------

  public updateName(name: FinancialPaymentProviderName): void {
    this.props.name = name;
    this.touch();
  }

  public updateDescription(description?: string): void {
    this.props.description =
      FinancialPaymentProviderEntity.normalizeDescription(description);
    this.touch();
  }

  public updateConfigurationReference(
    reference?: FinancialPaymentProviderConfigurationReference,
  ): void {
    this.props.configurationReference = reference;
    this.touch();
  }

  public updateEnvironment(
    environment: FinancialPaymentProviderEnvironment,
  ): void {
    this.props.environment = environment;
    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Integration Status
  // ---------------------------------------------------------------------------

  public setIntegrationStatus(
    nextStatus: FinancialPaymentProviderStatus,
  ): void {
    const currentStatus = this.props.integrationStatus;

    if (currentStatus.equals(nextStatus)) {
      return;
    }

    if (
      !FinancialPaymentProviderEntity.canTransitionStatus(
        currentStatus,
        nextStatus,
      )
    ) {
      throw new FinancialPaymentProviderInvalidStatusException(
        currentStatus.value,
        nextStatus.value,
      );
    }

    this.props.integrationStatus = nextStatus;

    // A provider cannot remain operationally enabled when its integration
    // leaves READY.
    if (!nextStatus.isReady()) {
      this.props.isEnabled = false;
    }

    this.touch();
  }

  private static canTransitionStatus(
    current: FinancialPaymentProviderStatus,
    next: FinancialPaymentProviderStatus,
  ): boolean {
    if (current.isNotConfigured()) {
      return next.isConfiguring() || next.isSuspended();
    }

    if (current.isConfiguring()) {
      return next.isReady() || next.isDegraded() || next.isSuspended();
    }

    if (current.isReady()) {
      return next.isDegraded() || next.isSuspended();
    }

    if (current.isDegraded()) {
      return next.isConfiguring() || next.isReady() || next.isSuspended();
    }

    if (current.isSuspended()) {
      return next.isConfiguring();
    }

    return false;
  }

  // ---------------------------------------------------------------------------
  // Operational Enablement
  // ---------------------------------------------------------------------------

  public enable(): void {
    if (this.props.isEnabled) {
      return;
    }

    if (!this.props.integrationStatus.isReady()) {
      throw new FinancialPaymentProviderNotReadyException(
        this.props.code.value,
        this.props.integrationStatus.value,
      );
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

  public isOperational(): boolean {
    return this.props.isEnabled && this.props.integrationStatus.isReady();
  }

  // ---------------------------------------------------------------------------
  // Capability Eligibility
  // ---------------------------------------------------------------------------

  public canPerform(type: FinancialPaymentProviderCapabilityType): boolean {
    if (!this.isOperational()) {
      return false;
    }

    const capability = this.getCapability(type);

    return capability?.canBeUsed() ?? false;
  }

  public ensureCanPerform(type: FinancialPaymentProviderCapabilityType): void {
    if (!this.props.integrationStatus.isReady()) {
      throw new FinancialPaymentProviderNotReadyException(
        this.props.code.value,
        this.props.integrationStatus.value,
      );
    }

    const capability = this.getCapability(type);

    if (!capability || !capability.isSupported) {
      throw new FinancialPaymentProviderCapabilityNotSupportedException(
        this.props.code.value,
        type.value,
      );
    }

    if (!capability.isEnabled) {
      throw new FinancialPaymentProviderCapabilityDisabledException(
        this.props.code.value,
        type.value,
      );
    }

    if (!this.props.isEnabled) {
      throw new FinancialPaymentProviderException(
        `Financial Payment Provider "${this.props.code.value}" is disabled.`,
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  public setUpdatedAt(updatedAt: Date): void {
    this.props.updatedAt = new Date(updatedAt);
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  private static normalizeDescription(
    description?: string,
  ): string | undefined {
    const normalized = description?.trim();

    return normalized ? normalized : undefined;
  }

  // ---------------------------------------------------------------------------
  // Equality
  // ---------------------------------------------------------------------------

  public override equals(other?: FinancialPaymentProviderEntity): boolean {
    return other !== undefined && this.id.equals(other.id);
  }
}
