// -----------------------------------------------------------------------------
// Identity — Create Verification Request Command Handler
// -----------------------------------------------------------------------------
//
// Application handler for creating and submitting a VerificationRequest
// within an existing Verification aggregate.
//
// Aggregate boundary:
//
// VerificationAggregate
// └── VerificationEntity
//     └── VerificationRequestEntity[]
//
// The handler:
//
// - validates the command;
// - resolves the Verification aggregate through its owning Identity;
// - invokes VerificationAggregate.createRequest();
// - persists the complete Verification aggregate.
//
// IMPORTANT:
//
// VerificationRequestEntity is NOT an aggregate root.
//
// It is owned by VerificationAggregate and therefore:
//
// - is never persisted independently;
// - is never constructed directly by the handler;
// - is never mutated directly by the handler.
//
// Creation of the request also represents submission.
//
// Consequently, this handler causes:
//
// - VerificationRequestCreatedEvent;
// - VerificationRequestSubmittedEvent.
//
// Those events are recorded by VerificationAggregate.createRequest().
//
// -----------------------------------------------------------------------------
//
// The handler does NOT:
//
// - create a Verification aggregate;
// - construct VerificationEntity;
// - construct VerificationRequestEntity;
// - call a separate submit operation;
// - approve the request;
// - reject the request;
// - cancel the request;
// - expire the request;
// - grant MEMBER verification;
// - grant DRIVER verification;
// - modify Identity;
// - access or mutate Asset storage;
// - perform verification-provider operations;
// - emit domain events directly;
// - send notifications;
// - perform external side effects.
//
// -----------------------------------------------------------------------------
//
// Application flow:
//
//     CreateVerificationRequestCommand
//              │
//              ▼
// verificationRepository.findByIdentityPublicId()
//              │
//              ▼
//      VerificationAggregate
//              │
//              ▼
//      aggregate.createRequest()
//              │
//              ├── VerificationRequestCreatedEvent
//              │
//              └── VerificationRequestSubmittedEvent
//              │
//              ▼
// verificationRepository.save()
//              │
//              ▼
//      VerificationAggregate
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
// Creation produces:
//
//     PENDING
//
// Request expiration is represented as:
//
//     PENDING -> CANCELLED
//
// -----------------------------------------------------------------------------
//
// Parent Verification lifecycle:
//
// A new VerificationRequest may only be created while the parent Verification
// aggregate is PENDING.
//
// VerificationAggregate.createRequest() owns that invariant.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Identity Tokens
// -----------------------------------------------------------------------------

import { IDENTITY_TOKENS } from '../identity.tokens';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { CreateVerificationRequestCommand } from '../commands/create-verification-request.command';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { VerificationRepository } from '../../domain/repositories/verification.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { VerificationInvariantException } from '../../domain/exceptions/verification-invariant.exception';

// =============================================================================
// Handler
// =============================================================================

/**
 * Creates and submits a VerificationRequest inside an existing Verification
 * aggregate.
 *
 * The handler performs application-level orchestration only:
 *
 *     command
 *       ↓
 *     aggregate lookup
 *       ↓
 *     aggregate.createRequest()
 *       ↓
 *     aggregate persistence
 *
 * All request ownership, uniqueness, lifecycle, and event rules remain inside
 * VerificationAggregate.
 */
@Injectable()
export class CreateVerificationRequestHandler implements CommandHandler<CreateVerificationRequestCommand> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(IDENTITY_TOKENS.REPOSITORIES.VERIFICATION)
    private readonly verificationRepository: VerificationRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  /**
   * Executes the CreateVerificationRequestCommand.
   *
   * A successful execution adds one new PENDING VerificationRequest to the
   * existing Verification aggregate.
   *
   * Request creation simultaneously represents submission.
   */
  public async execute(
    command: CreateVerificationRequestCommand,
  ): Promise<void> {
    // -------------------------------------------------------------------------
    // 1. Command guard
    // -------------------------------------------------------------------------

    if (command === undefined) {
      throw new VerificationInvariantException(
        'Create verification request command is required.',
      );
    }

    // -------------------------------------------------------------------------
    // 2. Identity guard
    // -------------------------------------------------------------------------

    if (command.identityPublicId === undefined) {
      throw new VerificationInvariantException(
        'Verification request identity public ID is required.',
      );
    }

    // -------------------------------------------------------------------------
    // 3. Request type guard
    // -------------------------------------------------------------------------

    if (command.type === undefined) {
      throw new VerificationInvariantException(
        'Verification request type is required.',
      );
    }

    // -------------------------------------------------------------------------
    // 4. Asset guard
    // -------------------------------------------------------------------------

    if (command.assetPublicId === undefined) {
      throw new VerificationInvariantException(
        'Verification request asset public ID is required.',
      );
    }

    // -------------------------------------------------------------------------
    // 5. Load Verification aggregate
    // -------------------------------------------------------------------------
    //
    // The command identifies the Verification through the Identity that owns
    // it.
    //
    // VerificationRepository rehydrates the complete aggregate, including
    // existing VerificationRequestEntity children.
    // -------------------------------------------------------------------------

    const aggregate = await this.verificationRepository.findByIdentityPublicId(
      command.identityPublicId,
    );

    if (aggregate === null) {
      throw new VerificationInvariantException(
        `Verification was not found for identity ${command.identityPublicId.value}.`,
      );
    }

    // -------------------------------------------------------------------------
    // 6. Create and submit VerificationRequest through the aggregate
    // -------------------------------------------------------------------------
    //
    // VerificationAggregate.createRequest() owns:
    //
    // - parent Verification lifecycle validation;
    // - request type validation;
    // - asset reference validation;
    // - pending-request uniqueness by type;
    // - VerificationRequestEntity construction;
    // - aggregate ownership;
    // - VerificationRequestCreatedEvent;
    // - VerificationRequestSubmittedEvent;
    // - aggregate audit timestamp;
    // - aggregate consistency validation.
    //
    // No direct entity construction or mutation occurs in the handler.
    // -------------------------------------------------------------------------

    aggregate.createRequest(
      {
        type: command.type,
        assetPublicId: command.assetPublicId,
      },
      command.correlationId,
      command.submittedAt,
    );

    // -------------------------------------------------------------------------
    // 7. Persist aggregate
    // -------------------------------------------------------------------------
    //
    // VerificationAggregate is the unit of persistence.
    //
    // The newly created VerificationRequestEntity is persisted as part of the
    // parent aggregate.
    // -------------------------------------------------------------------------

    await this.verificationRepository.save(aggregate);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CreateVerificationRequestHandler;
