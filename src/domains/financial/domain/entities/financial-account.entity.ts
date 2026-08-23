// -----------------------------------------------------------------------------
// Financial Account
// -----------------------------------------------------------------------------
//
// Financial Account Entity.
//
// Aggregate boundary:
//
// FinancialAccountAggregate
// ├── FinancialAccountEntity
// └── FinancialAccountBalanceEntity
//
// The entity owns account identity and lifecycle.
// Balance state belongs to FinancialAccountBalanceEntity.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type {
  FinancialAccountPublicId,
  FinancialAccountOwnerPublicId,
  FinancialAccountType,
  Currency,
} from '../value-objects';
import { FinancialAccountStatus } from '../value-objects';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface FinancialAccountProps {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  publicId: FinancialAccountPublicId;

  // ---------------------------------------------------------------------------
  // Account
  // ---------------------------------------------------------------------------

  type: FinancialAccountType;

  status: FinancialAccountStatus;

  // ---------------------------------------------------------------------------
  // Ownership
  // ---------------------------------------------------------------------------

  /**
   * Public identifier of the owning identity or entity.
   *
   * This is an opaque cross-domain reference.
   */
  ownerPublicId: FinancialAccountOwnerPublicId | undefined;

  // ---------------------------------------------------------------------------
  // Currency
  // ---------------------------------------------------------------------------

  currency: Currency;

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  createdAt: Date;

  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

export class FinancialAccountEntity extends Entity<FinancialAccountProps> {
  private constructor(props: FinancialAccountProps, id?: UniqueEntityId) {
    super(props, id);
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(props: FinancialAccountProps): FinancialAccountEntity {
    return new FinancialAccountEntity(props);
  }

  public static rehydrate(
    props: FinancialAccountProps,
    id: UniqueEntityId,
  ): FinancialAccountEntity {
    return new FinancialAccountEntity(props, id);
  }

  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  override get publicId(): FinancialAccountPublicId {
    return this.props.publicId;
  }

  // ---------------------------------------------------------------------------
  // Account Properties
  // ---------------------------------------------------------------------------

  public get type(): FinancialAccountType {
    return this.props.type;
  }

  public get status(): FinancialAccountStatus {
    return this.props.status;
  }

  // ---------------------------------------------------------------------------
  // Ownership
  // ---------------------------------------------------------------------------

  public get ownerPublicId(): FinancialAccountOwnerPublicId | undefined {
    return this.props.ownerPublicId;
  }

  public hasOwner(): boolean {
    return this.props.ownerPublicId !== undefined;
  }

  public isOwnedBy(ownerPublicId: FinancialAccountOwnerPublicId): boolean {
    return (
      this.props.ownerPublicId !== undefined &&
      this.props.ownerPublicId.equals(ownerPublicId)
    );
  }

  // ---------------------------------------------------------------------------
  // Currency
  // ---------------------------------------------------------------------------

  public get currency(): Currency {
    return this.props.currency;
  }

  public usesCurrency(currency: Currency): boolean {
    return this.props.currency.equals(currency);
  }

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // ---------------------------------------------------------------------------
  // Mutators
  // ---------------------------------------------------------------------------

  public setStatus(status: FinancialAccountStatus): void {
    this.props.status = status;
  }

  public setOwnerPublicId(
    ownerPublicId: FinancialAccountOwnerPublicId | undefined,
  ): void {
    this.props.ownerPublicId = ownerPublicId;
  }

  public setUpdatedAt(updatedAt: Date): void {
    this.props.updatedAt = updatedAt;
  }

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  public activate(): void {
    this.props.status = FinancialAccountStatus.create('ACTIVE');
  }

  public suspend(): void {
    this.props.status = FinancialAccountStatus.create('SUSPENDED');
  }

  public close(): void {
    this.props.status = FinancialAccountStatus.create('CLOSED');
  }

  // ---------------------------------------------------------------------------
  // Lifecycle Queries
  // ---------------------------------------------------------------------------

  public isActive(): boolean {
    return this.props.status.isActive();
  }

  public isSuspended(): boolean {
    return this.props.status.isSuspended();
  }

  public isClosed(): boolean {
    return this.props.status.isClosed();
  }

  public canOperate(): boolean {
    return this.props.status.canOperate();
  }

  public isTerminal(): boolean {
    return this.props.status.isTerminal();
  }

  // ---------------------------------------------------------------------------
  // Equality
  // ---------------------------------------------------------------------------

  override equals(other?: FinancialAccountEntity): boolean {
    if (other === undefined) {
      return false;
    }

    return this.id.equals(other.id);
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { FinancialAccountProps };
