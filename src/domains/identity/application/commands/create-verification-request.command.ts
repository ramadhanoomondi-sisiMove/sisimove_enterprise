// -----------------------------------------------------------------------------
// Verification Request — Create Command
// -----------------------------------------------------------------------------
//
// Application command for creating and submitting a VerificationRequestEntity
// within an existing Verification aggregate.
//
// Aggregate boundary:
//
// VerificationAggregate
// └── VerificationEntity
//     └── VerificationRequestEntity
//
// This command represents the application-level intent to submit one piece of
// verification evidence.
//
// The command does NOT create or mutate domain objects directly.
//
// The application handler is responsible for:
// - resolving the VerificationAggregate;
// - invoking the aggregate operation;
// - persisting the resulting aggregate.
//
// The VerificationAggregate is responsible for all domain invariants related
// to VerificationRequest creation and submission.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Command Semantics
// -----------------------------------------------------------------------------
//
// This command does NOT:
//
// - create a Verification aggregate;
// - construct VerificationEntity;
// - construct VerificationRequestEntity directly;
// - mutate VerificationEntity directly;
// - call submitRequest() directly;
// - approve the VerificationRequest;
// - reject the VerificationRequest;
// - cancel the VerificationRequest;
// - expire the VerificationRequest;
// - approve the Verification aggregate;
// - verify the Identity;
// - modify Identity;
// - modify Identity roles;
// - perform verification-provider operations;
// - perform asset-storage operations;
// - emit domain events directly;
// - send notifications;
// - perform external side effects.
//
// The application handler loads the VerificationAggregate and invokes:
//
//     verificationAggregate.createRequest(...)
//
// The aggregate is responsible for:
//
// - validating the Verification lifecycle state;
// - validating the request type;
// - validating the asset public identity;
// - preventing duplicate pending requests of the same type;
// - creating VerificationRequestEntity;
// - establishing aggregate ownership;
// - initializing the request in PENDING state;
// - recording VerificationRequestCreatedEvent;
// - recording VerificationRequestSubmittedEvent.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Request Lifecycle
// -----------------------------------------------------------------------------
//
// Creation always produces a PENDING VerificationRequest.
//
// PENDING
//   ├──> APPROVED
//   ├──> REJECTED
//   └──> CANCELLED
//
// APPROVED, REJECTED, and CANCELLED are terminal request states.
//
// A VerificationRequest does NOT have an independent expiration transition.
//
// Expiration is not part of the VerificationRequest lifecycle.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Verification Lifecycle
// -----------------------------------------------------------------------------
//
// The parent Verification aggregate must currently be PENDING before a new
// VerificationRequest may be created.
//
// This command does not enforce that invariant.
//
// The VerificationAggregate is the authoritative owner of that rule.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Verification Request Type
// -----------------------------------------------------------------------------
//
// Examples:
//
// - PROFILE_PHOTO
// - GOVERNMENT_ID
// - DRIVER_LICENSE
//
// The command carries the domain VerificationRequestType value object.
//
// The command does not interpret request-type-specific business rules.
//
// Those rules belong to the appropriate domain boundary.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Asset
// -----------------------------------------------------------------------------
//
// `assetPublicId` identifies the evidence being submitted through the external
// asset/storage boundary.
//
// The command carries only the opaque public identifier.
//
// It does NOT:
//
// - load the asset;
// - inspect the asset;
// - mutate the asset;
// - determine asset ownership;
// - determine asset eligibility.
//
// Asset existence, ownership, eligibility, and storage concerns are handled by
// the appropriate application/domain boundary.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Identity Context
// -----------------------------------------------------------------------------
//
// `identityPublicId` identifies the Identity whose Verification aggregate is
// being resolved.
//
// It is an opaque cross-aggregate public identifier.
//
// It is NOT:
//
// - a database identifier;
// - a VerificationRequest ownership field;
// - a direct Identity relationship on VerificationRequestEntity.
//
// The application layer uses this identifier to resolve the existing
// Verification aggregate.
//
// Once the aggregate is loaded, the VerificationAggregate establishes and
// enforces VerificationRequest ownership.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Correlation / Causation
// -----------------------------------------------------------------------------
//
// - correlationId identifies the complete request-creation/submission
//   operation;
// - causationId optionally identifies the command, event, or operation that
//   caused this operation.
//
// These are application-level metadata values propagated to resulting domain
// events by the appropriate application/domain event mechanism.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Timestamp
// -----------------------------------------------------------------------------
//
// `submittedAt` is optional.
//
// When omitted, the aggregate/application boundary determines the effective
// current timestamp.
//
// The aggregate remains responsible for validating the effective timestamp.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type {
  IdentityPublicId,
  VerificationRequestAssetPublicId,
  VerificationRequestType,
} from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Application command for creating and submitting a verification request.
 *
 * The command carries domain-ready value objects rather than raw transport
 * primitives.
 *
 * DTO-to-domain conversion belongs to the presentation/application boundary.
 *
 * Required inputs:
 *
 * - identityPublicId;
 * - type;
 * - assetPublicId;
 * - correlationId.
 *
 * Optional inputs:
 *
 * - causationId;
 * - submittedAt.
 *
 * The application layer resolves the existing VerificationAggregate using
 * identityPublicId.
 *
 * The aggregate then creates the VerificationRequestEntity and establishes its
 * initial PENDING state.
 */
export class CreateVerificationRequestCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    /**
     * Public identity of the Identity whose Verification aggregate is being
     * resolved.
     *
     * This is an opaque cross-aggregate public identifier.
     *
     * It is used by the application layer to locate the Verification aggregate
     * and is not stored as VerificationRequest ownership.
     */
    public readonly identityPublicId: IdentityPublicId,

    /**
     * Type of verification evidence being submitted.
     *
     * Examples:
     *
     * - PROFILE_PHOTO;
     * - GOVERNMENT_ID;
     * - DRIVER_LICENSE.
     *
     * The command carries the domain value object without interpreting its
     * business semantics.
     */
    public readonly type: VerificationRequestType,

    /**
     * Public identity of the asset submitted as verification evidence.
     *
     * This is an opaque reference to the external asset/storage boundary.
     */
    public readonly assetPublicId: VerificationRequestAssetPublicId,

    /**
     * Correlation identifier for the complete verification-request creation
     * and submission operation.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command, event, or operation that caused this
     * verification-request creation.
     */
    public readonly causationId?: string,

    /**
     * Optional timestamp at which the verification request is considered
     * submitted.
     *
     * When omitted, the application/domain boundary determines the effective
     * current timestamp.
     */
    public readonly submittedAt?: Date,
  ) {}
}
