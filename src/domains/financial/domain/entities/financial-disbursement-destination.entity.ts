// -----------------------------------------------------------------------------
// Financial Disbursement Destination Entity
// -----------------------------------------------------------------------------
//
// Represents a configured external financial destination associated with a
// Financial Account.
//
// Aggregate context:
//
// Financial Account Aggregate
// └── FinancialDisbursementDestinationEntity
//
// This entity is NOT an aggregate root.
//
// The Financial Account boundary is responsible for account-level rules
// governing destinations, including:
//
// - destination ownership;
// - destination creation;
// - destination activation/deactivation;
// - default-destination rules;
// - account eligibility;
// - supported destination/provider combinations.
//
// A FinancialDisbursement may reference this destination by its public
// identity.
//
// A FinancialAccountWithdrawal does NOT retain a live reference to this
// entity. Instead, the withdrawal captures an immutable
// FinancialAccountWithdrawalDestination snapshot at request time.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Maintain destination identity.
// - Maintain owning Financial Account identity.
// - Maintain destination type.
// - Maintain provider identity.
// - Maintain provider-issued destination reference.
// - Maintain presentation-safe display metadata.
// - Maintain default-destination designation.
// - Maintain active/inactive state.
// - Enforce destination-level invariants.
//
// -----------------------------------------------------------------------------
//
// This entity does NOT:
//
// - Execute disbursements.
// - Execute provider APIs.
// - Communicate with M-Pesa, banks, or other providers.
// - Move money.
// - Modify Financial Account balances.
// - Create Financial Transactions.
// - Create Financial Disbursements.
// - Create Financial Account Withdrawals.
// - Decide whether an account may withdraw.
// - Decide whether a disbursement should be created.
// - Persist itself.
// - Emit domain events.
//
// -----------------------------------------------------------------------------
//
// External provider execution belongs to the application/integration
// boundary.
//
// Financial Account balance mutation belongs to the Financial Account
// aggregate.
//
// Financial Transaction creation/posting belongs to the Financial
// Transaction aggregate.
//
// Persistence belongs to the repository/infrastructure boundary.
//
// -----------------------------------------------------------------------------
//
// Destination lifecycle:
//
//                 ACTIVE
//                   │
//             ┌─────┴─────┐
//             │           │
//          DEFAULT      NON-DEFAULT
//             │
//             │ deactivate
//             ▼
//          INACTIVE
//
// An inactive destination:
// - cannot receive a new disbursement;
// - cannot be selected for a new withdrawal;
// - cannot remain the account default.
//
// Historical withdrawals/disbursements remain unaffected.
//
// -----------------------------------------------------------------------------
//
// IMPORTANT:
//
// The configured destination is mutable.
//
// The withdrawal destination snapshot is immutable.
//
// Changes made here after a withdrawal is created MUST NOT alter the
// destination snapshot already captured by that withdrawal.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';

import { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { FinancialDisbursementDestinationException } from '../exceptions/financial-disbursement-destination.exception';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import { FinancialDisbursementDestinationPublicId } from '../value-objects/financial-disbursement-destination-public-id.vo';

import type { FinancialDisbursementDestinationType } from '../value-objects/financial-disbursement-destination-type.vo';

import type { FinancialProvider } from '../value-objects/financial-provider.vo';

import type { FinancialProviderReference } from '../value-objects/financial-provider-reference.vo';

// =============================================================================
// Props
// =============================================================================

export interface FinancialDisbursementDestinationProps {
  /**
   * Internal identity of the owning Financial Account.
   *
   * The Financial Account aggregate is not embedded in this entity.
   */
  accountId: UniqueEntityId;

  /**
   * Type of external financial destination.
   */
  type: FinancialDisbursementDestinationType;

  /**
   * Financial provider responsible for the external destination.
   */
  provider: FinancialProvider;

  /**
   * Provider-issued reference identifying the external destination.
   *
   * This contains the destination identifier required by the provider.
   *
   * It MUST NOT contain authentication or authorization secrets such as:
   *
   * - PINs;
   * - passwords;
   * - access tokens;
   * - secret keys;
   * - provider credentials;
   * - encryption secrets.
   */
  providerReference: FinancialProviderReference;

  /**
   * Optional presentation-safe name assigned to the destination.
   *
   * This is descriptive metadata and is not authoritative identity.
   */
  displayName: string | undefined;

  /**
   * Optional presentation-safe masked representation of the destination.
   *
   * Example:
   *
   *     *******1234
   */
  maskedReference: string | undefined;

  /**
   * Indicates whether this destination is designated as the account's
   * default destination.
   *
   * The Financial Account boundary is responsible for enforcing the
   * cross-destination invariant that only the appropriate destination(s)
   * may be default.
   */
  isDefault: boolean;

  /**
   * Indicates whether this destination may currently be selected for a new
   * financial operation.
   */
  isActive: boolean;

  /**
   * Entity creation timestamp.
   */
  createdAt: Date;

  /**
   * Entity last-update timestamp.
   */
  updatedAt: Date;
}

// =============================================================================
// Entity
// =============================================================================

export class FinancialDisbursementDestinationEntity extends Entity<
  FinancialDisbursementDestinationProps,
  FinancialDisbursementDestinationPublicId
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    props: FinancialDisbursementDestinationProps,
    id?: UniqueEntityId,
    publicId?: FinancialDisbursementDestinationPublicId,
  ) {
    super(props, id, publicId);
  }

  // ===========================================================================
  // Factory
  // ===========================================================================

  /**
   * Creates a new configured Financial Disbursement Destination.
   *
   * New destinations are active.
   *
   * Whether a new destination may become the account default is an
   * account-level decision and must be coordinated by the owning
   * Financial Account boundary.
   */
  public static create(
    accountId: UniqueEntityId,
    type: FinancialDisbursementDestinationType,
    provider: FinancialProvider,
    providerReference: FinancialProviderReference,
    displayName?: string,
    maskedReference?: string,
    isDefault = false,
    createdAt: Date = new Date(),
  ): FinancialDisbursementDestinationEntity {
    FinancialDisbursementDestinationEntity.ensureValidDate(
      createdAt,
      'creation date',
    );

    const timestamp =
      FinancialDisbursementDestinationEntity.cloneDate(createdAt);

    return new FinancialDisbursementDestinationEntity(
      {
        accountId,
        type,
        provider,
        providerReference,

        displayName:
          FinancialDisbursementDestinationEntity.normalizeOptionalText(
            displayName,
          ),

        maskedReference:
          FinancialDisbursementDestinationEntity.normalizeOptionalText(
            maskedReference,
          ),

        isDefault,
        isActive: true,

        createdAt: timestamp,
        updatedAt: FinancialDisbursementDestinationEntity.cloneDate(timestamp),
      },

      new UniqueEntityId(),

      new FinancialDisbursementDestinationPublicId(),
    );
  }

  // ===========================================================================
  // Rehydration
  // ===========================================================================

  /**
   * Rehydrates a persisted destination.
   *
   * Rehydration does not perform account-level validation such as:
   *
   * - whether the account still exists;
   * - whether another destination is currently default;
   * - whether the account is currently eligible to use the destination.
   *
   * Those rules belong to the appropriate aggregate/application workflow.
   */
  public static rehydrate(
    props: FinancialDisbursementDestinationProps,
    id: UniqueEntityId,
    publicId: FinancialDisbursementDestinationPublicId,
  ): FinancialDisbursementDestinationEntity {
    FinancialDisbursementDestinationEntity.ensureValidDate(
      props.createdAt,
      'creation date',
    );

    FinancialDisbursementDestinationEntity.ensureValidDate(
      props.updatedAt,
      'updated date',
    );

    if (props.updatedAt.getTime() < props.createdAt.getTime()) {
      throw new FinancialDisbursementDestinationException(
        'Financial Disbursement Destination updated date cannot be before creation date',
      );
    }

    // An inactive destination cannot be the default destination.
    if (!props.isActive && props.isDefault) {
      throw new FinancialDisbursementDestinationException(
        'An inactive Financial Disbursement Destination cannot be the default destination',
      );
    }

    return new FinancialDisbursementDestinationEntity(
      {
        accountId: props.accountId,
        type: props.type,
        provider: props.provider,
        providerReference: props.providerReference,

        displayName:
          FinancialDisbursementDestinationEntity.normalizeOptionalText(
            props.displayName,
          ),

        maskedReference:
          FinancialDisbursementDestinationEntity.normalizeOptionalText(
            props.maskedReference,
          ),

        isDefault: props.isDefault,
        isActive: props.isActive,

        createdAt: FinancialDisbursementDestinationEntity.cloneDate(
          props.createdAt,
        ),

        updatedAt: FinancialDisbursementDestinationEntity.cloneDate(
          props.updatedAt,
        ),
      },
      id,
      publicId,
    );
  }

  // ===========================================================================
  // Identity
  // ===========================================================================

  /**
   * Public identity of this configured destination.
   */
  public override get publicId(): FinancialDisbursementDestinationPublicId {
    return super.publicId;
  }

  // ===========================================================================
  // Ownership
  // ===========================================================================

  /**
   * Internal identity of the owning Financial Account.
   *
   * This is an opaque ownership reference.
   */
  public get accountId(): UniqueEntityId {
    return this.props.accountId;
  }

  /**
   * Determines whether this destination belongs to the supplied account.
   */
  public belongsToAccount(accountId: UniqueEntityId): boolean {
    return this.props.accountId.equals(accountId);
  }

  // ===========================================================================
  // Destination
  // ===========================================================================

  /**
   * Configured destination type.
   */
  public get type(): FinancialDisbursementDestinationType {
    return this.props.type;
  }

  /**
   * Financial provider responsible for this destination.
   */
  public get provider(): FinancialProvider {
    return this.props.provider;
  }

  /**
   * Provider-issued destination reference.
   */
  public get providerReference(): FinancialProviderReference {
    return this.props.providerReference;
  }

  // ===========================================================================
  // Presentation Metadata
  // ===========================================================================

  /**
   * Optional presentation-safe display name.
   */
  public get displayName(): string | undefined {
    return this.props.displayName;
  }

  /**
   * Optional presentation-safe masked destination reference.
   */
  public get maskedReference(): string | undefined {
    return this.props.maskedReference;
  }

  /**
   * Updates the presentation-safe display name.
   *
   * This does not alter the destination's authoritative provider identity.
   */
  public setDisplayName(displayName?: string): void {
    const normalized =
      FinancialDisbursementDestinationEntity.normalizeOptionalText(displayName);

    if (this.props.displayName === normalized) {
      return;
    }

    this.props.displayName = normalized;

    this.touch();
  }

  /**
   * Updates the presentation-safe masked destination reference.
   *
   * This does not alter the authoritative provider reference.
   */
  public setMaskedReference(maskedReference?: string): void {
    const normalized =
      FinancialDisbursementDestinationEntity.normalizeOptionalText(
        maskedReference,
      );

    if (this.props.maskedReference === normalized) {
      return;
    }

    this.props.maskedReference = normalized;

    this.touch();
  }

  // ===========================================================================
  // Default Destination
  // ===========================================================================

  /**
   * Whether this destination is the account's default destination.
   */
  public get isDefault(): boolean {
    return this.props.isDefault;
  }

  /**
   * Marks this destination as the account's default destination.
   *
   * This operation only changes this entity's own designation.
   *
   * The owning Financial Account boundary must coordinate removal of the
   * default designation from any other destination.
   */
  public markAsDefault(): void {
    if (!this.props.isActive) {
      throw new FinancialDisbursementDestinationException(
        'An inactive Financial Disbursement Destination cannot be marked as default',
      );
    }

    if (this.props.isDefault) {
      return;
    }

    this.props.isDefault = true;

    this.touch();
  }

  /**
   * Removes the default designation.
   */
  public removeAsDefault(): void {
    if (!this.props.isDefault) {
      return;
    }

    this.props.isDefault = false;

    this.touch();
  }

  /**
   * Determines whether this destination is the default destination.
   */
  public isDefaultDestination(): boolean {
    return this.props.isDefault;
  }

  // ===========================================================================
  // Activation
  // ===========================================================================

  /**
   * Whether this destination is currently active.
   */
  public get isActive(): boolean {
    return this.props.isActive;
  }

  /**
   * Activates the destination.
   *
   * Activation does not make the destination default.
   */
  public activate(): void {
    if (this.props.isActive) {
      return;
    }

    this.props.isActive = true;

    this.touch();
  }

  /**
   * Deactivates the destination.
   *
   * An inactive destination cannot remain the account default.
   *
   * Historical operations referencing this destination are unaffected.
   */
  public deactivate(): void {
    if (!this.props.isActive) {
      return;
    }

    this.props.isActive = false;
    this.props.isDefault = false;

    this.touch();
  }

  /**
   * Determines whether the destination is active.
   */
  public isActiveDestination(): boolean {
    return this.props.isActive;
  }

  /**
   * Determines whether the destination is inactive.
   */
  public isInactive(): boolean {
    return !this.props.isActive;
  }

  // ===========================================================================
  // Eligibility
  // ===========================================================================

  /**
   * Determines whether this destination may currently be selected for a
   * new disbursement.
   *
   * Account-level eligibility is intentionally not evaluated here.
   */
  public canReceiveDisbursement(): boolean {
    return this.props.isActive;
  }

  /**
   * Determines whether this destination may currently be selected for a new
   * withdrawal request.
   */
  public canBeSelectedForWithdrawal(): boolean {
    return this.props.isActive;
  }

  // ===========================================================================
  // Provider
  // ===========================================================================

  /**
   * Determines whether this destination belongs to the supplied provider.
   */
  public isProvidedBy(provider: FinancialProvider): boolean {
    return this.props.provider.equals(provider);
  }

  /**
   * Determines whether this destination has the supplied provider reference.
   */
  public hasProviderReference(
    providerReference: FinancialProviderReference,
  ): boolean {
    return this.props.providerReference.equals(providerReference);
  }

  // ===========================================================================
  // Destination Type
  // ===========================================================================

  /**
   * Determines whether this is a mobile-money destination.
   */
  public isMobileMoney(): boolean {
    return this.props.type.isMobileMoney();
  }

  /**
   * Determines whether this is a bank-account destination.
   */
  public isBankAccount(): boolean {
    return this.props.type.isBankAccount();
  }

  /**
   * Determines whether this is another supported destination type.
   */
  public isOther(): boolean {
    return this.props.type.isOther();
  }

  // ===========================================================================
  // Audit
  // ===========================================================================

  /**
   * Entity creation timestamp.
   *
   * A defensive copy prevents external mutation.
   */
  public get createdAt(): Date {
    return FinancialDisbursementDestinationEntity.cloneDate(
      this.props.createdAt,
    );
  }

  /**
   * Entity last-update timestamp.
   *
   * A defensive copy prevents external mutation.
   */
  public get updatedAt(): Date {
    return FinancialDisbursementDestinationEntity.cloneDate(
      this.props.updatedAt,
    );
  }

  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Updates the persistence timestamp during mapping/rehydration workflows.
   *
   * This method does not represent a business state transition.
   */
  public setUpdatedAt(updatedAt: Date): void {
    FinancialDisbursementDestinationEntity.ensureValidDate(
      updatedAt,
      'updated date',
    );

    const timestamp =
      FinancialDisbursementDestinationEntity.cloneDate(updatedAt);

    if (timestamp.getTime() < this.props.createdAt.getTime()) {
      throw new FinancialDisbursementDestinationException(
        'Financial Disbursement Destination updated date cannot be before creation date',
      );
    }

    this.props.updatedAt = timestamp;
  }

  // ===========================================================================
  // Validation
  // ===========================================================================

  /**
   * Normalizes optional presentation text.
   *
   * Empty strings are represented as undefined.
   */
  private static normalizeOptionalText(
    value: string | undefined,
  ): string | undefined {
    if (value === undefined) {
      return undefined;
    }

    const normalized = value.trim();

    return normalized.length > 0 ? normalized : undefined;
  }

  /**
   * Validates a date value.
   */
  private static ensureValidDate(value: Date, fieldName: string): void {
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
      throw new FinancialDisbursementDestinationException(
        `Financial Disbursement Destination ${fieldName} must be a valid date`,
      );
    }
  }

  /**
   * Creates a defensive copy of a date.
   */
  private static cloneDate(value: Date): Date {
    FinancialDisbursementDestinationEntity.ensureValidDate(value, 'date');

    return new Date(value.getTime());
  }
}
