// -----------------------------------------------------------------------------
// Verification Request — Create Command
// -----------------------------------------------------------------------------
//
// Application command for creating a VerificationRequestEntity within a
// Verification aggregate.
//
// Aggregate boundary:
//
// VerificationAggregate
// └── VerificationEntity
//     └── VerificationRequestEntity
//
// The command represents the intent to create and submit one verification
// request.
//
// IMPORTANT:
//
// VerificationRequestEntity creation represents submission.
//
// Therefore this command does NOT:
//
// - create a Verification aggregate;
// - construct VerificationEntity;
// - construct VerificationRequestEntity directly;
// - mutate VerificationEntity directly;
// - call submitRequest();
// - approve the VerificationRequest;
// - reject the VerificationRequest;
// - cancel the VerificationRequest;
// - expire the VerificationRequest;
// - approve the Verification aggregate;
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
// - recording VerificationRequestCreatedEvent;
// - recording VerificationRequestSubmittedEvent.
//
// -----------------------------------------------------------------------------
//
// Request lifecycle:
//
// PENDING
//   ├──> APPROVED
//   ├──> REJECTED
//   └──> CANCELLED
//
// Creation always produces a PENDING VerificationRequest.
//
// APPROVED, REJECTED, and CANCELLED are terminal request states.
//
// A VerificationRequest does NOT expire. Expiration is not part of the
// VerificationRequest lifecycle.
//
// -----------------------------------------------------------------------------
//
// Verification lifecycle:
//
// The parent Verification aggregate must currently be PENDING before a new
// VerificationRequest may be created.
//
// The command does not decide or enforce this rule; the VerificationAggregate
// enforces it.
//
// -----------------------------------------------------------------------------
//
// Verification Request Type:
//
// Examples:
//
// - PROFILE_PHOTO
// - GOVERNMENT_ID
// - DRIVER_LICENSE
//
// The command carries the domain VerificationRequestType value object.
//
// The command does not interpret or enforce request-type-specific business
// rules.
//
// -----------------------------------------------------------------------------
//
// Asset:
//
// `assetPublicId` identifies the submitted verification evidence through the
// external asset/storage boundary.
//
// The command carries only the opaque public identifier.
//
// It does not access, validate, or mutate the asset itself.
//
// Asset existence, ownership, eligibility, and other asset-related invariants
// are enforced by the appropriate domain/application boundary.
//
// -----------------------------------------------------------------------------
//
// Correlation / causation:
//
// - correlationId identifies the complete request-creation/submission
//   operation;
// - causationId optionally identifies the command, event, or operation that
//   caused this request.
//
// Both are application-level metadata propagated to resulting domain events.
//
// -----------------------------------------------------------------------------
//
// Timestamp:
//
// `submittedAt` is optional.
//
// When omitted, the application handler/aggregate uses the current time.
//
// The aggregate validates the resulting submission timestamp.
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
 * Command for creating and submitting a VerificationRequestEntity.
 *
 * Creating the request establishes its initial PENDING lifecycle state.
 *
 * The command carries domain-ready value objects rather than raw transport
 * primitives.
 *
 * DTO-to-domain conversion belongs to the presentation/application boundary.
 *
 * Required domain inputs:
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
 * The application layer is responsible for resolving the VerificationAggregate
 * from the Verification repository using the Identity public identity.
 */
export class CreateVerificationRequestCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    /**
     * Public identity of the Identity that owns the Verification aggregate.
     *
     * This is an opaque cross-aggregate public identifier and not a
     * persistence/database identifier.
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
     */
    public readonly type: VerificationRequestType,

    /**
     * Public identity of the asset submitted as verification evidence.
     *
     * This is an opaque reference to the external asset/storage boundary.
     */
    public readonly assetPublicId: VerificationRequestAssetPublicId,

    /**
     * Correlation identifier for the verification-request creation and
     * submission operation.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command, event, or operation that caused this
     * verification-request creation.
     */
    public readonly causationId?: string,

    /**
     * Optional timestamp at which the VerificationRequest is considered
     * submitted.
     *
     * When omitted, the application handler/aggregate uses the current time.
     */
    public readonly submittedAt?: Date,
  ) {}
}
