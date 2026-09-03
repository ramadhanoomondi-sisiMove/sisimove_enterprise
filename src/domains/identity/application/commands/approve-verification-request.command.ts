// -----------------------------------------------------------------------------
// Verification Request — Approve Command
// -----------------------------------------------------------------------------
//
// Application command for approving a VerificationRequestEntity owned by a
// Verification aggregate.
//
// Aggregate boundary:
//
// VerificationAggregate
// └── VerificationEntity
//     └── VerificationRequestEntity
//
// Responsibilities:
//
// The command represents the intent to approve one submitted verification
// request.
//
// The command does NOT:
//
// - load the Verification aggregate;
// - construct VerificationEntity;
// - construct VerificationRequestEntity;
// - mutate either entity directly;
// - approve the VerificationRequestEntity directly;
// - approve the Verification aggregate directly;
// - perform persistence;
// - emit domain events directly;
// - modify Identity;
// - modify Identity roles;
// - perform asset-storage operations;
// - perform external verification-provider operations;
// - send notifications;
// - perform external side effects.
//
// The application handler loads the VerificationAggregate and invokes:
//
//     verificationAggregate.approveRequest(...)
//
// The aggregate is responsible for:
//
// - resolving the VerificationRequestEntity;
// - validating request ownership;
// - validating the reviewing Identity;
// - validating the request lifecycle;
// - validating the review timestamp;
// - approving the VerificationRequestEntity;
// - translating approved evidence into Verification evidence;
// - evaluating Verification eligibility;
// - advancing the Verification lifecycle when eligible;
// - recording VerificationRequestApprovedEvent;
// - recording VerificationApprovedEvent when the aggregate advances.
//
// -----------------------------------------------------------------------------
//
// Request lifecycle:
//
// PENDING ───────► APPROVED
//    │
//    ├───────────► REJECTED
//    │
//    └───────────► CANCELLED
//
// APPROVED, REJECTED, and CANCELLED are terminal states.
//
// Only a PENDING VerificationRequest may be approved.
//
// VerificationRequest does NOT expire. Expiration is not part of the
// VerificationRequest lifecycle.
//
// The VerificationRequest remains a historical record of the submitted
// verification evidence and its review outcome.
//
// -----------------------------------------------------------------------------
//
// Verification lifecycle:
//
// Approval of a VerificationRequest may cause the parent Verification
// aggregate to advance:
//
// PENDING ───────► VERIFIED
//
// The VerificationAggregate determines whether the approved evidence
// satisfies the configured verification requirements.
//
// Any expiration policy belongs to the Verification lifecycle and is not a
// property of the VerificationRequest.
//
// -----------------------------------------------------------------------------
//
// Evidence:
//
// The approved request type determines which Verification evidence is
// established:
//
// PROFILE_PHOTO
//     -> profilePhotoVerified
//
// GOVERNMENT_ID
//     -> governmentIdVerified
//
// DRIVER_LICENSE
//     -> driverLicenseVerified
//
// The VerificationAggregate performs this mapping.
//
// The command does not contain, interpret, or enforce evidence rules.
//
// -----------------------------------------------------------------------------
//
// Reviewer:
//
// `reviewedByPublicId` identifies the Identity that performed the review.
//
// This is an opaque public identifier. The command does not resolve or mutate
// the reviewer Identity.
//
// -----------------------------------------------------------------------------
//
// Correlation / causation:
//
// - correlationId identifies the complete request-approval operation;
// - causationId optionally identifies the command, event, or operation that
//   caused this approval request.
//
// Both values are application-level metadata propagated to resulting domain
// events.
//
// -----------------------------------------------------------------------------
//
// Timestamp:
//
// `reviewedAt` is optional.
//
// When omitted, the application handler/aggregate uses the current time.
//
// The aggregate validates the resulting review timestamp.
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
  VerificationRequestPublicId,
} from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Command for approving a VerificationRequestEntity.
 *
 * The command carries the public identifiers and review information required
 * by VerificationAggregate.approveRequest().
 *
 * Required inputs:
 *
 * - identityPublicId;
 * - requestPublicId;
 * - reviewedByPublicId;
 * - correlationId.
 *
 * Optional inputs:
 *
 * - causationId;
 * - reviewedAt.
 *
 * The application layer is responsible for resolving the VerificationAggregate
 * using `identityPublicId`.
 *
 * The command contains no request expiration information because expiration
 * does not belong to the VerificationRequest lifecycle.
 */
export class ApproveVerificationRequestCommand implements Command {
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
     * Public identity of the VerificationRequest to approve.
     *
     * The VerificationAggregate resolves this request and verifies that it
     * belongs to the target Verification aggregate.
     */
    public readonly requestPublicId: VerificationRequestPublicId,

    /**
     * Public identity of the Identity that performed the verification review.
     *
     * This identifies the reviewer and remains an opaque public reference.
     */
    public readonly reviewedByPublicId: IdentityPublicId,

    /**
     * Correlation identifier for the request-approval operation and resulting
     * domain events.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command, event, or operation that caused this
     * approval request.
     */
    public readonly causationId?: string,

    /**
     * Optional timestamp at which the VerificationRequest approval is
     * considered to have occurred.
     *
     * When omitted, the application handler/aggregate uses the current time.
     */
    public readonly reviewedAt?: Date,
  ) {}
}
