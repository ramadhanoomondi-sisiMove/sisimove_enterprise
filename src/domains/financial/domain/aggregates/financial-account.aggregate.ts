// -----------------------------------------------------------------------------
// Financial Account Aggregate
// -----------------------------------------------------------------------------
//
// Aggregate boundary:
//
// FinancialAccountAggregate
// ├── FinancialAccountEntity
// └── FinancialAccountBalanceEntity
//
// The Financial Account aggregate is the authoritative domain boundary for:
//
// - account identity;
// - account ownership;
// - account type;
// - account currency;
// - account lifecycle;
// - account operational state;
// - available balance;
// - pending balance;
// - held balance;
// - balance version;
// - balance integrity;
// - account/balance ownership consistency.
//
// Creation, lifecycle transitions, and balance mutations are performed through
// this aggregate.
//
// Application command handlers must interact with this aggregate and must NOT
// construct or mutate its child entities directly.
//
// Separate aggregate roots:
//
// - FinancialTransactionAggregate;
// - FinancialPaymentAggregate;
// - FinancialAccountHoldAggregate;
// - FinancialSettlementAggregate;
// - FinancialAccountWithdrawalAggregate;
// - FinancialDisbursementAggregate.
//
// The Financial Account aggregate does NOT own:
//
// - transaction lifecycle;
// - payment lifecycle;
// - hold lifecycle;
// - settlement lifecycle;
// - withdrawal lifecycle;
// - disbursement lifecycle;
// - accounting entries.
//
// Those concerns remain separate aggregates or bounded contexts.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { AggregateRoot } from '../../../../foundation/kernel/domain/aggregate-root';

// -----------------------------------------------------------------------------
// Domain Entities
// -----------------------------------------------------------------------------

import { FinancialAccountEntity } from '../entities/financial-account.entity';

import { FinancialAccountBalanceEntity } from '../entities/financial-account-balance.entity';

// -----------------------------------------------------------------------------
// Domain Events
// -----------------------------------------------------------------------------

import { FinancialAccountCreatedEvent } from '../events/financial-account-created.event';
import { FinancialAccountActivatedEvent } from '../events/financial-account-activated.event';
import { FinancialAccountSuspendedEvent } from '../events/financial-account-suspended.event';
import { FinancialAccountClosedEvent } from '../events/financial-account-closed.event';

// -----------------------------------------------------------------------------
// Domain Exceptions
// -----------------------------------------------------------------------------

import { FinancialInvariantException } from '../exceptions/financial-invariant.exception';

import { FinancialAccountNotActiveException } from '../exceptions/financial-account-not-active.exception';

import { FinancialAccountClosedException } from '../exceptions/financial-account-closed.exception';

import { FinancialAccountSuspendedException } from '../exceptions/financial-account-suspended.exception';

import { FinancialAccountInsufficientFundsException } from '../exceptions/financial-account-insufficient-funds.exception';

import { FinancialAccountCurrencyMismatchException } from '../exceptions/financial-account-currency-mismatch.exception';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type {
  Currency,
  FinancialAccountOwnerPublicId,
  FinancialAccountType,
} from '../value-objects';

import {
  FinancialAccountStatus,
  FinancialAccountAvailableAmount,
  FinancialAccountPendingAmount,
  FinancialAccountHeldAmount,
  FinancialAccountBalanceVersion,
} from '../value-objects';

import { FinancialAccountPublicId } from '../value-objects/financial-account-public-id.vo';

import { FinancialAccountBalancePublicId } from '../value-objects/financial-account-balance-public-id.vo';

// -----------------------------------------------------------------------------
// Creation Props
// -----------------------------------------------------------------------------

/**
 * Domain inputs required to create a Financial Account aggregate.
 *
 * The caller supplies only business inputs.
 *
 * The aggregate owns the creation of:
 *
 * - internal entity identity;
// * public account identity;
// * public balance identity;
// * lifecycle status;
// * timestamps;
// * initial balance;
// * initial balance version.
 */
export interface CreateFinancialAccountAggregateProps {
  /**
   * Public identity of the owner.
   *
   * This is an opaque cross-domain reference to Identity.
   */
  ownerPublicId: FinancialAccountOwnerPublicId;

  /**
   * Classification of the financial account.
   */
  type: FinancialAccountType;

  /**
   * Currency in which the account balance is maintained.
   */
  currency: Currency;
}

// -----------------------------------------------------------------------------
// Aggregate Props
// -----------------------------------------------------------------------------

interface FinancialAccountAggregateProps {
  account: FinancialAccountEntity;
  balance: FinancialAccountBalanceEntity;
}

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

export class FinancialAccountAggregate extends AggregateRoot<FinancialAccountAggregateProps> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  private constructor(props: FinancialAccountAggregateProps) {
    super(props, props.account.id, props.account.publicId);
  }

  // ===========================================================================
  // Factory — Create
  // ===========================================================================

  /**
   * Creates a brand-new Financial Account aggregate.
   *
   * This is the ONLY creation boundary for the Financial Account aggregate.
   *
   * Application handlers must provide business-level creation inputs and must
   * not construct FinancialAccountEntity or FinancialAccountBalanceEntity
   * themselves.
   *
   * The aggregate creates and owns:
   *
   * - FinancialAccountEntity;
   * - FinancialAccountBalanceEntity;
   * - initial lifecycle state;
   * - initial zero balance;
   * - initial balance version;
   * - domain creation event.
   *
   * Initial state:
   *
   * - status     = ACTIVE
   * - available  = 0
   * - pending    = 0
   * - held       = 0
   * - version    = 0
   *
   * Creation invariants are validated before the creation event is recorded.
   */
  public static create(
    props: CreateFinancialAccountAggregateProps,
    correlationId: string,
    createdAt: Date = new Date(),
  ): FinancialAccountAggregate {
    // -------------------------------------------------------------------------
    // Validate creation inputs
    // -------------------------------------------------------------------------

    if (props.ownerPublicId === undefined) {
      throw new FinancialInvariantException(
        'Financial account owner is required.',
      );
    }

    if (props.type === undefined) {
      throw new FinancialInvariantException(
        'Financial account type is required.',
      );
    }

    if (props.currency === undefined) {
      throw new FinancialInvariantException(
        'Financial account currency is required.',
      );
    }

    // -------------------------------------------------------------------------
    // Generate aggregate identities
    // -------------------------------------------------------------------------

    const financialAccountPublicId = new FinancialAccountPublicId();

    const financialAccountBalancePublicId =
      new FinancialAccountBalancePublicId();

    // -------------------------------------------------------------------------
    // Initial lifecycle state
    // -------------------------------------------------------------------------
    //
    // A newly created financial account is immediately operational.
    //
    // Lifecycle transitions remain controlled by the aggregate.
    // -------------------------------------------------------------------------

    const status = FinancialAccountStatus.create('ACTIVE');

    // -------------------------------------------------------------------------
    // Create Financial Account Entity
    // -------------------------------------------------------------------------
    //
    // Entity construction remains internal to the aggregate creation boundary.
    //
    // The application layer does not know or care about entity persistence
    // props such as createdAt and updatedAt.
    // -------------------------------------------------------------------------

    const account = FinancialAccountEntity.create({
      publicId: financialAccountPublicId,

      ownerPublicId: props.ownerPublicId,

      type: props.type,

      status,

      currency: props.currency,

      createdAt,

      updatedAt: createdAt,
    });

    // -------------------------------------------------------------------------
    // Create aggregate-owned Balance Entity
    // -------------------------------------------------------------------------
    //
    // The balance is created as part of the Financial Account aggregate.
    //
    // It starts at zero and version zero.
    //
    // The balance's accountId is derived from the newly-created account.
    // -------------------------------------------------------------------------

    const balance = FinancialAccountBalanceEntity.create({
      accountId: account.id,

      publicId: financialAccountBalancePublicId,

      availableAmount: FinancialAccountAvailableAmount.create(0),

      pendingAmount: FinancialAccountPendingAmount.create(0),

      heldAmount: FinancialAccountHeldAmount.create(0),

      currency: props.currency,

      version: FinancialAccountBalanceVersion.create(0),

      createdAt,

      updatedAt: createdAt,
    });

    // -------------------------------------------------------------------------
    // Construct Aggregate
    // -------------------------------------------------------------------------

    const aggregate = new FinancialAccountAggregate({
      account,

      balance,
    });

    // -------------------------------------------------------------------------
    // Validate aggregate invariants
    // -------------------------------------------------------------------------

    aggregate.ensureAggregateConsistency();

    // -------------------------------------------------------------------------
    // Record Domain Event
    // -------------------------------------------------------------------------

    aggregate.addDomainEvent(
      new FinancialAccountCreatedEvent(
        aggregate.id.value,
        aggregate.publicId,
        aggregate.type,
        aggregate.status,
        aggregate.ownerPublicId,
        aggregate.currency,
        correlationId,
      ),
    );

    return aggregate;
  }

  // ===========================================================================
  // Factory — Rehydrate
  // ===========================================================================

  /**
   * Rehydrates an existing Financial Account aggregate.
   *
   * Rehydration never creates domain events.
   *
   * Existing persistence state is supplied by the repository/infrastructure
   * layer and reconstructed into the aggregate.
   */
  public static rehydrate(
    account: FinancialAccountEntity,
    balance: FinancialAccountBalanceEntity,
  ): FinancialAccountAggregate {
    const aggregate = new FinancialAccountAggregate({
      account,
      balance,
    });

    aggregate.ensureAggregateConsistency();

    return aggregate;
  }

  // ===========================================================================
  // Aggregate State
  // ===========================================================================

  /**
   * Returns the Financial Account entity owned by this aggregate.
   *
   * Consumers should generally prefer aggregate-level behavior over directly
   * mutating this entity.
   */
  public get account(): FinancialAccountEntity {
    return this.props.account;
  }

  /**
   * Returns the aggregate-owned balance entity.
   *
   * Consumers should generally use aggregate balance operations rather than
   * directly mutating this entity.
   */
  public get balance(): FinancialAccountBalanceEntity {
    return this.props.balance;
  }

  // ===========================================================================
  // Identity
  // ===========================================================================

  override get id(): typeof this.account.id {
    return this.account.id;
  }

  override get publicId(): typeof this.account.publicId {
    return this.account.publicId;
  }

  // ===========================================================================
  // Account Properties
  // ===========================================================================

  public get type(): FinancialAccountType {
    return this.account.type;
  }

  public get status(): FinancialAccountStatus {
    return this.account.status;
  }

  public get ownerPublicId(): FinancialAccountOwnerPublicId | undefined {
    return this.account.ownerPublicId;
  }

  public get currency(): Currency {
    return this.account.currency;
  }

  // ===========================================================================
  // Audit Properties
  // ===========================================================================

  public get createdAt(): Date {
    return this.account.createdAt;
  }

  public get updatedAt(): Date {
    return this.account.updatedAt;
  }

  // ===========================================================================
  // Balance Properties
  // ===========================================================================

  /**
   * Funds currently available for normal financial operations.
   */
  public get availableAmount(): number {
    return this.balance.availableAmount.value;
  }

  /**
   * Funds received by the account but not yet available for normal use.
   */
  public get pendingAmount(): number {
    return this.balance.pendingAmount.value;
  }

  /**
   * Funds reserved against the account.
   */
  public get heldAmount(): number {
    return this.balance.heldAmount.value;
  }

  /**
   * Total monetary state represented by the account.
   *
   * total = available + pending + held
   */
  public get totalAmount(): number {
    return this.availableAmount + this.pendingAmount + this.heldAmount;
  }

  /**
   * Current optimistic-concurrency version of the aggregate-owned balance.
   */
  public get balanceVersion(): number {
    return this.balance.version.value;
  }

  // ===========================================================================
  // Lifecycle Queries
  // ===========================================================================

  public isActive(): boolean {
    return this.status.isActive();
  }

  public isSuspended(): boolean {
    return this.status.isSuspended();
  }

  public isClosed(): boolean {
    return this.status.isClosed();
  }

  public canOperate(): boolean {
    return this.status.canOperate();
  }

  public isTerminal(): boolean {
    return this.status.isTerminal();
  }

  // ===========================================================================
  // Account Lifecycle
  // ===========================================================================

  /**
   * Activates a suspended Financial Account.
   *
   * CLOSED is terminal and cannot be reactivated.
   *
   * Calling activate on an already-active account is idempotent.
   */
  public activate(activatedAt: Date = new Date(), correlationId: string): void {
    // -------------------------------------------------------------------------
    // Closed accounts are terminal
    // -------------------------------------------------------------------------

    if (this.isClosed()) {
      throw new FinancialAccountClosedException();
    }

    // -------------------------------------------------------------------------
    // Already active — idempotent
    // -------------------------------------------------------------------------

    if (this.isActive()) {
      return;
    }

    // -------------------------------------------------------------------------
    // Only suspended accounts can be reactivated
    // -------------------------------------------------------------------------

    if (!this.isSuspended()) {
      throw new FinancialAccountNotActiveException();
    }

    // -------------------------------------------------------------------------
    // Apply state transition
    // -------------------------------------------------------------------------

    this.account.setStatus(FinancialAccountStatus.create('ACTIVE'));

    this.account.setUpdatedAt(activatedAt);

    // -------------------------------------------------------------------------
    // Record domain event
    // -------------------------------------------------------------------------

    this.addDomainEvent(
      new FinancialAccountActivatedEvent(
        this.id.value,
        this.publicId,
        correlationId,
      ),
    );
  }

  /**
   * Suspends an active Financial Account.
   *
   * Calling suspend on an already-suspended account is idempotent.
   *
   * CLOSED is terminal.
   */
  public suspend(suspendedAt: Date = new Date(), correlationId: string): void {
    // -------------------------------------------------------------------------
    // Closed accounts are terminal
    // -------------------------------------------------------------------------

    if (this.isClosed()) {
      throw new FinancialAccountClosedException();
    }

    // -------------------------------------------------------------------------
    // Already suspended — idempotent
    // -------------------------------------------------------------------------

    if (this.isSuspended()) {
      return;
    }

    // -------------------------------------------------------------------------
    // Only active accounts can be suspended
    // -------------------------------------------------------------------------

    if (!this.isActive()) {
      throw new FinancialAccountNotActiveException();
    }

    // -------------------------------------------------------------------------
    // Apply state transition
    // -------------------------------------------------------------------------

    this.account.setStatus(FinancialAccountStatus.create('SUSPENDED'));

    this.account.setUpdatedAt(suspendedAt);

    // -------------------------------------------------------------------------
    // Record domain event
    // -------------------------------------------------------------------------

    this.addDomainEvent(
      new FinancialAccountSuspendedEvent(
        this.id.value,
        this.publicId,
        correlationId,
      ),
    );
  }

  /**
   * Permanently closes the Financial Account.
   *
   * CLOSED is terminal.
   *
   * Closing does not move remaining funds.
   *
   * Any required fund movement must be performed through the appropriate
   * financial workflow before closure.
   */
  public close(closedAt: Date = new Date(), correlationId: string): void {
    // -------------------------------------------------------------------------
    // Already closed — preserve idempotent terminal state
    // -------------------------------------------------------------------------

    if (this.isClosed()) {
      throw new FinancialAccountClosedException();
    }

    // -------------------------------------------------------------------------
    // Apply terminal state
    // -------------------------------------------------------------------------

    this.account.setStatus(FinancialAccountStatus.create('CLOSED'));

    this.account.setUpdatedAt(closedAt);

    // -------------------------------------------------------------------------
    // Record domain event
    // -------------------------------------------------------------------------

    this.addDomainEvent(
      new FinancialAccountClosedEvent(
        this.id.value,
        this.publicId,
        correlationId,
      ),
    );
  }

  // ===========================================================================
  // Operational Guards
  // ===========================================================================

  /**
   * Ensures the account is available for normal financial operations.
   */
  public ensureOperational(): void {
    if (this.isClosed()) {
      throw new FinancialAccountClosedException();
    }

    if (this.isSuspended()) {
      throw new FinancialAccountSuspendedException();
    }

    if (!this.isActive()) {
      throw new FinancialAccountNotActiveException();
    }
  }

  /**
   * Ensures the supplied currency matches the account currency.
   */
  public ensureCurrency(currency: Currency): void {
    if (!this.currency.equals(currency)) {
      throw new FinancialAccountCurrencyMismatchException();
    }
  }

  // ===========================================================================
  // Balance Queries
  // ===========================================================================

  public hasAvailableFunds(amount: number): boolean {
    this.ensurePositiveAmount(amount);

    return this.balance.hasAvailableFunds(amount);
  }

  public hasPendingFunds(amount: number): boolean {
    this.ensurePositiveAmount(amount);

    return this.balance.hasPendingFunds(amount);
  }

  public hasHeldFunds(amount: number): boolean {
    this.ensurePositiveAmount(amount);

    return this.balance.hasHeldFunds(amount);
  }

  public isZeroBalance(): boolean {
    return this.balance.isZero();
  }

  // ===========================================================================
  // Pending Balance
  // ===========================================================================

  /**
   * Adds funds to pending balance.
   *
   * Pending funds are not available for normal operations until released.
   */
  public increasePending(
    amount: number,
    currency: Currency,
    at: Date = new Date(),
  ): void {
    this.ensureOperational();

    this.ensureCurrency(currency);

    this.ensurePositiveAmount(amount);

    this.balance.increasePending(amount);

    this.balance.setUpdatedAt(at);

    this.ensureValidBalance();
  }

  /**
   * Moves pending funds into available funds.
   */
  public releasePendingToAvailable(
    amount: number,
    currency: Currency,
    at: Date = new Date(),
  ): void {
    this.ensureOperational();

    this.ensureCurrency(currency);

    this.ensurePositiveAmount(amount);

    if (!this.hasPendingFunds(amount)) {
      throw new FinancialAccountInsufficientFundsException();
    }

    this.balance.decreasePending(amount);

    this.balance.increaseAvailable(amount);

    this.balance.setUpdatedAt(at);

    this.ensureValidBalance();
  }

  // ===========================================================================
  // Held Balance
  // ===========================================================================

  /**
   * Moves available funds into held funds.
   */
  public holdFunds(
    amount: number,
    currency: Currency,
    at: Date = new Date(),
  ): void {
    this.ensureOperational();

    this.ensureCurrency(currency);

    this.ensurePositiveAmount(amount);

    if (!this.hasAvailableFunds(amount)) {
      throw new FinancialAccountInsufficientFundsException();
    }

    this.balance.decreaseAvailable(amount);

    this.balance.increaseHeld(amount);

    this.balance.setUpdatedAt(at);

    this.ensureValidBalance();
  }

  /**
   * Releases held funds back into available funds.
   */
  public releaseHeldFunds(
    amount: number,
    currency: Currency,
    at: Date = new Date(),
  ): void {
    this.ensureOperational();

    this.ensureCurrency(currency);

    this.ensurePositiveAmount(amount);

    if (!this.hasHeldFunds(amount)) {
      throw new FinancialAccountInsufficientFundsException();
    }

    this.balance.decreaseHeld(amount);

    this.balance.increaseAvailable(amount);

    this.balance.setUpdatedAt(at);

    this.ensureValidBalance();
  }

  /**
   * Captures held funds.
   *
   * Captured funds leave this account's balance.
   *
   * The corresponding transaction aggregate is responsible for representing
   * the financial movement and double-entry semantics.
   */
  public captureHeldFunds(
    amount: number,
    currency: Currency,
    at: Date = new Date(),
  ): void {
    this.ensureOperational();

    this.ensureCurrency(currency);

    this.ensurePositiveAmount(amount);

    if (!this.hasHeldFunds(amount)) {
      throw new FinancialAccountInsufficientFundsException();
    }

    this.balance.decreaseHeld(amount);

    this.balance.setUpdatedAt(at);

    this.ensureValidBalance();
  }

  // ===========================================================================
  // Available Balance
  // ===========================================================================

  /**
   * Debits available funds.
   *
   * This mutates aggregate-owned balance state only.
   *
   * Transaction lifecycle and double-entry semantics belong to the
   * FinancialTransaction aggregate.
   */
  public debitAvailable(
    amount: number,
    currency: Currency,
    at: Date = new Date(),
  ): void {
    this.ensureOperational();

    this.ensureCurrency(currency);

    this.ensurePositiveAmount(amount);

    if (!this.hasAvailableFunds(amount)) {
      throw new FinancialAccountInsufficientFundsException();
    }

    this.balance.decreaseAvailable(amount);

    this.balance.setUpdatedAt(at);

    this.ensureValidBalance();
  }

  /**
   * Credits available funds.
   *
   * This mutates aggregate-owned balance state only.
   *
   * The originating financial movement must be represented by the appropriate
   * financial aggregate.
   */
  public creditAvailable(
    amount: number,
    currency: Currency,
    at: Date = new Date(),
  ): void {
    this.ensureOperational();

    this.ensureCurrency(currency);

    this.ensurePositiveAmount(amount);

    this.balance.increaseAvailable(amount);

    this.balance.setUpdatedAt(at);

    this.ensureValidBalance();
  }

  // ===========================================================================
  // Balance Integrity
  // ===========================================================================

  /**
   * Determines whether the account balance is internally valid.
   *
   * Invariants:
   *
   * - available >= 0;
   * - pending >= 0;
   * - held >= 0;
   * - account currency == balance currency;
   * - balance belongs to this account.
   */
  public hasValidBalance(): boolean {
    return (
      this.balance.accountId.equals(this.account.id) &&
      this.availableAmount >= 0 &&
      this.pendingAmount >= 0 &&
      this.heldAmount >= 0 &&
      this.balance.currency.equals(this.currency)
    );
  }

  /**
   * Ensures all balance invariants hold.
   */
  public ensureValidBalance(): void {
    if (!this.hasValidBalance()) {
      throw new FinancialInvariantException(
        'Financial account balance is invalid.',
      );
    }
  }

  // ===========================================================================
  // Aggregate Consistency
  // ===========================================================================

  /**
   * Ensures that the aggregate-owned entities are internally consistent.
   *
   * Invariants:
   *
   * - balance.accountId == account.id;
   * - account.currency == balance.currency;
   * - available >= 0;
   * - pending >= 0;
   * - held >= 0.
   */
  private ensureAggregateConsistency(): void {
    // -------------------------------------------------------------------------
    // Balance ownership
    // -------------------------------------------------------------------------

    if (!this.balance.accountId.equals(this.account.id)) {
      throw new FinancialInvariantException(
        'Financial account balance does not belong to the financial account.',
      );
    }

    // -------------------------------------------------------------------------
    // Currency consistency
    // -------------------------------------------------------------------------

    if (!this.balance.currency.equals(this.account.currency)) {
      throw new FinancialAccountCurrencyMismatchException();
    }

    // -------------------------------------------------------------------------
    // Balance integrity
    // -------------------------------------------------------------------------

    this.ensureValidBalance();
  }

  // ===========================================================================
  // Guards
  // ===========================================================================

  /**
   * Ensures monetary amounts are represented as positive safe integers.
   *
   * Financial amounts are persisted as integer minor units.
   */
  private ensurePositiveAmount(amount: number): void {
    if (!Number.isSafeInteger(amount) || amount <= 0) {
      throw new FinancialInvariantException(
        'Financial account amount must be a positive integer.',
      );
    }
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { FinancialAccountAggregateProps };
