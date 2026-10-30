// -----------------------------------------------------------------------------
// Financial Payment Provider Aggregate
// -----------------------------------------------------------------------------

import { AggregateRoot } from '../../../../foundation/kernel/domain/aggregate-root';
import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

import { FinancialPaymentProviderEntity } from '../entities/financial-payment-provider.entity';
import { FinancialPaymentProviderCapabilityEntity } from '../entities/financial-payment-provider-capability.entity';

import { FinancialPaymentProviderCreatedEvent } from '../events/financial-payment-provider-created.event';
import { FinancialPaymentProviderUpdatedEvent } from '../events/financial-payment-provider-updated.event';
import { FinancialPaymentProviderEnabledEvent } from '../events/financial-payment-provider-enabled.event';
import { FinancialPaymentProviderDisabledEvent } from '../events/financial-payment-provider-disabled.event';
import { FinancialPaymentProviderStatusChangedEvent } from '../events/financial-payment-provider-status-changed.event';
import { FinancialPaymentProviderCapabilityEnabledEvent } from '../events/financial-payment-provider-capability-enabled.event';
import { FinancialPaymentProviderCapabilityDisabledEvent } from '../events/financial-payment-provider-capability-disabled.event';

import { FinancialPaymentProviderException } from '../exceptions/financial-payment-provider.exception';
import { FinancialPaymentProviderInvalidStatusException } from '../exceptions/financial-payment-provider-invalid-status.exception';
import { FinancialPaymentProviderNotReadyException } from '../exceptions/financial-payment-provider-not-ready.exception';
import { FinancialPaymentProviderCapabilityNotSupportedException } from '../exceptions/financial-payment-provider-capability-not-supported.exception';
import { FinancialPaymentProviderCapabilityDisabledException } from '../exceptions/financial-payment-provider-capability-disabled.exception';

import type { FinancialPaymentProviderCode } from '../value-objects/financial-payment-provider-code.vo';
import type { FinancialPaymentProviderName } from '../value-objects/financial-payment-provider-name.vo';
import type { FinancialPaymentProviderType } from '../value-objects/financial-payment-provider-type.vo';
import type { FinancialPaymentProviderEnvironment } from '../value-objects/financial-payment-provider-environment.vo';
import type { FinancialPaymentProviderStatus } from '../value-objects/financial-payment-provider-status.vo';
import type { FinancialPaymentProviderConfigurationReference } from '../value-objects/financial-payment-provider-configuration-reference.vo';
import type { FinancialPaymentProviderCapabilityType } from '../value-objects/financial-payment-provider-capability-type.vo';

import type { FinancialPaymentProviderPublicId } from '../value-objects/financial-payment-provider-public-id.vo';

// -----------------------------------------------------------------------------
// Creation Props
// -----------------------------------------------------------------------------

export interface CreateFinancialPaymentProviderAggregateProps {
  code: FinancialPaymentProviderCode;
  name: FinancialPaymentProviderName;
  type: FinancialPaymentProviderType;
  environment: FinancialPaymentProviderEnvironment;
  description?: string;
  configurationReference?: FinancialPaymentProviderConfigurationReference;
}

// -----------------------------------------------------------------------------
// Aggregate Props
// -----------------------------------------------------------------------------

interface FinancialPaymentProviderAggregateProps {
  provider: FinancialPaymentProviderEntity;
}

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

export class FinancialPaymentProviderAggregate extends AggregateRoot<
  FinancialPaymentProviderAggregateProps,
  FinancialPaymentProviderPublicId
> {
  private constructor(props: FinancialPaymentProviderAggregateProps) {
    super(props, props.provider.id, props.provider.publicId);
  }

  // ---------------------------------------------------------------------------
  // Factory — Create
  // ---------------------------------------------------------------------------

  public static create(
    props: CreateFinancialPaymentProviderAggregateProps,
    correlationId: string,
    createdAt: Date = new Date(),
  ): FinancialPaymentProviderAggregate {
    if (!props.code || !props.name || !props.type || !props.environment) {
      throw new FinancialPaymentProviderException(
        'Required payment provider creation properties are missing.',
      );
    }

    const provider = FinancialPaymentProviderEntity.create(
      props.code,
      props.name,
      props.type,
      props.environment,
      {
        ...(props.description !== undefined && {
          description: props.description,
        }),
        ...(props.configurationReference !== undefined && {
          configurationReference: props.configurationReference,
        }),
      },
    );

    provider.setUpdatedAt(createdAt);

    const aggregate = new FinancialPaymentProviderAggregate({ provider });

    aggregate.ensureAggregateConsistency();

    aggregate.addDomainEvent(
      new FinancialPaymentProviderCreatedEvent(
        aggregate.id.value,
        aggregate.publicId,
        aggregate.code,
        aggregate.name,
        aggregate.type,
        aggregate.environment,
        createdAt,
        correlationId,
      ),
    );

    return aggregate;
  }

  // ---------------------------------------------------------------------------
  // Factory — Rehydrate
  // ---------------------------------------------------------------------------

  public static rehydrate(
    provider: FinancialPaymentProviderEntity,
  ): FinancialPaymentProviderAggregate {
    const aggregate = new FinancialPaymentProviderAggregate({ provider });

    aggregate.ensureAggregateConsistency();

    return aggregate;
  }

  // ---------------------------------------------------------------------------
  // Aggregate State
  // ---------------------------------------------------------------------------

  public get provider(): FinancialPaymentProviderEntity {
    return this.props.provider;
  }

  public get capabilities(): readonly FinancialPaymentProviderCapabilityEntity[] {
    return this.provider.capabilities;
  }

  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  public override get id(): UniqueEntityId {
    return this.provider.id;
  }

  public override get publicId(): FinancialPaymentProviderPublicId {
    return this.provider.publicId;
  }

  // ---------------------------------------------------------------------------
  // Provider Properties
  // ---------------------------------------------------------------------------

  public get code(): FinancialPaymentProviderCode {
    return this.provider.code;
  }

  public get name(): FinancialPaymentProviderName {
    return this.provider.name;
  }

  public get type(): FinancialPaymentProviderType {
    return this.provider.type;
  }

  public get environment(): FinancialPaymentProviderEnvironment {
    return this.provider.environment;
  }

  public get status(): FinancialPaymentProviderStatus {
    return this.provider.integrationStatus;
  }

  public get isEnabled(): boolean {
    return this.provider.isEnabled;
  }

  public get isOperational(): boolean {
    return this.provider.isOperational();
  }

  public get createdAt(): Date {
    return this.provider.createdAt;
  }

  public get updatedAt(): Date {
    return this.provider.updatedAt;
  }

  // ---------------------------------------------------------------------------
  // Lifecycle Queries
  // ---------------------------------------------------------------------------

  public isReady(): boolean {
    return this.status.isReady();
  }

  public canProcess(): boolean {
    return this.provider.isOperational();
  }

  public canPerform(
    capabilityType: FinancialPaymentProviderCapabilityType,
  ): boolean {
    return this.provider.canPerform(capabilityType);
  }

  // ---------------------------------------------------------------------------
  // Provider Lifecycle
  // ---------------------------------------------------------------------------

  public enable(enabledAt: Date = new Date(), correlationId: string): void {
    if (this.provider.isEnabled) {
      return;
    }

    this.provider.enable();
    this.provider.setUpdatedAt(enabledAt);

    this.addDomainEvent(
      new FinancialPaymentProviderEnabledEvent(
        this.id.value,
        this.publicId,
        enabledAt,
        correlationId,
      ),
    );
  }

  public disable(
    disabledAt: Date = new Date(),
    correlationId: string,
    reason?: string,
  ): void {
    if (!this.provider.isEnabled) {
      return;
    }

    this.provider.disable();
    this.provider.setUpdatedAt(disabledAt);

    this.addDomainEvent(
      new FinancialPaymentProviderDisabledEvent(
        this.id.value,
        this.publicId,
        disabledAt,
        reason,
        correlationId,
      ),
    );
  }

  public changeStatus(
    newStatus: FinancialPaymentProviderStatus,
    changedAt: Date = new Date(),
    correlationId: string,
  ): void {
    const previousStatus = this.provider.integrationStatus;

    if (previousStatus.equals(newStatus)) {
      return;
    }

    this.provider.setIntegrationStatus(newStatus);
    this.provider.setUpdatedAt(changedAt);

    this.addDomainEvent(
      new FinancialPaymentProviderStatusChangedEvent(
        this.id.value,
        this.publicId,
        previousStatus,
        newStatus,
        changedAt,
        correlationId,
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Provider Updates
  // ---------------------------------------------------------------------------

  public updateDetails(
    name: FinancialPaymentProviderName,
    changedAt: Date = new Date(),
    correlationId: string,
  ): void {
    if (this.provider.name.equals(name)) {
      return;
    }

    this.provider.updateName(name);
    this.provider.setUpdatedAt(changedAt);

    this.recordUpdatedEvent(changedAt, correlationId);
  }

  public updateEnvironment(
    environment: FinancialPaymentProviderEnvironment,
    changedAt: Date = new Date(),
    correlationId: string,
  ): void {
    if (this.provider.environment.equals(environment)) {
      return;
    }

    this.provider.updateEnvironment(environment);
    this.provider.setUpdatedAt(changedAt);

    this.recordUpdatedEvent(changedAt, correlationId);
  }

  public updateConfigurationReference(
    reference: FinancialPaymentProviderConfigurationReference | undefined,
    changedAt: Date = new Date(),
    correlationId: string,
  ): void {
    this.provider.updateConfigurationReference(reference);
    this.provider.setUpdatedAt(changedAt);

    this.recordUpdatedEvent(changedAt, correlationId);
  }

  // ---------------------------------------------------------------------------
  // Capabilities
  // ---------------------------------------------------------------------------

  public addCapability(
    capabilityType: FinancialPaymentProviderCapabilityType,
    isSupported: boolean,
    changedAt: Date = new Date(),
  ): void {
    const existing = this.provider.getCapability(capabilityType);

    if (existing) {
      throw new FinancialPaymentProviderException(
        `Capability ${capabilityType.toString()} already exists for provider ${this.code.toString()}.`,
      );
    }

    const capability = FinancialPaymentProviderCapabilityEntity.create(
      this.id,
      capabilityType,
      isSupported,
    );

    this.provider.addCapability(capability);
    this.provider.setUpdatedAt(changedAt);
  }

  public enableCapability(
    capabilityType: FinancialPaymentProviderCapabilityType,
    enabledAt: Date = new Date(),
    correlationId: string,
  ): void {
    const capability = this.getRequiredCapability(capabilityType);

    if (capability.isEnabled) {
      return;
    }

    capability.enable();
    this.provider.setUpdatedAt(enabledAt);

    this.addDomainEvent(
      new FinancialPaymentProviderCapabilityEnabledEvent(
        this.id.value,
        this.publicId,
        capability.publicId,
        capability.type,
        enabledAt,
        correlationId,
      ),
    );
  }

  public disableCapability(
    capabilityType: FinancialPaymentProviderCapabilityType,
    disabledAt: Date = new Date(),
    correlationId: string,
    reason?: string,
  ): void {
    const capability = this.getRequiredCapability(capabilityType);

    if (!capability.isEnabled) {
      return;
    }

    capability.disable();
    this.provider.setUpdatedAt(disabledAt);

    this.addDomainEvent(
      new FinancialPaymentProviderCapabilityDisabledEvent(
        this.id.value,
        this.publicId,
        capability.publicId,
        capability.type,
        disabledAt,
        reason,
        correlationId,
      ),
    );
  }

  public ensureCanPerform(
    capabilityType: FinancialPaymentProviderCapabilityType,
  ): void {
    if (!this.provider.isOperational()) {
      throw new FinancialPaymentProviderNotReadyException(
        this.code.toString(),
        this.status.toString(),
      );
    }

    const capability = this.provider.getCapability(capabilityType);

    if (!capability || !capability.isSupported) {
      throw new FinancialPaymentProviderCapabilityNotSupportedException(
        this.code.toString(),
        capabilityType.toString(),
      );
    }

    if (!capability.isEnabled) {
      throw new FinancialPaymentProviderCapabilityDisabledException(
        this.code.toString(),
        capabilityType.toString(),
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Aggregate Consistency
  // ---------------------------------------------------------------------------

  private ensureAggregateConsistency(): void {
    const capabilityTypes = new Set<string>();

    for (const capability of this.provider.capabilities) {
      if (!capability.belongsTo(this.id)) {
        throw new FinancialPaymentProviderException(
          'Payment provider capability does not belong to its provider aggregate.',
        );
      }

      const key = capability.type.toString();

      if (capabilityTypes.has(key)) {
        throw new FinancialPaymentProviderException(
          `Duplicate payment provider capability: ${key}.`,
        );
      }

      capabilityTypes.add(key);

      if (capability.isEnabled && !capability.isSupported) {
        throw new FinancialPaymentProviderException(
          'An unsupported payment provider capability cannot be enabled.',
        );
      }
    }

    if (this.provider.isEnabled && !this.provider.integrationStatus.isReady()) {
      throw new FinancialPaymentProviderInvalidStatusException(
        this.provider.integrationStatus.toString(),
        'READY',
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Event Helpers
  // ---------------------------------------------------------------------------

  private recordUpdatedEvent(updatedAt: Date, correlationId: string): void {
    this.addDomainEvent(
      new FinancialPaymentProviderUpdatedEvent(
        this.id.value,
        this.publicId,
        this.code,
        this.name,
        this.type,
        this.environment,
        this.status,
        this.isEnabled,
        updatedAt,
        correlationId,
      ),
    );
  }

  private getRequiredCapability(
    capabilityType: FinancialPaymentProviderCapabilityType,
  ): FinancialPaymentProviderCapabilityEntity {
    const capability = this.provider.getCapability(capabilityType);

    if (!capability || !capability.isSupported) {
      throw new FinancialPaymentProviderCapabilityNotSupportedException(
        this.code.toString(),
        capabilityType.toString(),
      );
    }

    return capability;
  }
}
