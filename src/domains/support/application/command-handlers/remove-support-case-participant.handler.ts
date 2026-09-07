// -----------------------------------------------------------------------------
// Support — Remove Support Case Participant Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler responsible for removing a participant from a
// Support Case.
//
// Responsibilities:
//
// - load the SupportCaseAggregate by its public identity;
// - delegate participant removal to the aggregate;
// - preserve correlation/causation metadata;
// - persist the modified aggregate;
// - return the updated aggregate.
//
// Architectural rules:
//
// - no Prisma access;
// - no direct entity mutation;
// - no repository implementation details;
// - participant lifecycle is owned by SupportCaseAggregate;
// - application layer uses public identities;
// - domain invariants remain inside the aggregate.
//
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import type { RemoveSupportCaseParticipantCommand } from '../commands/remove-support-case-participant.command';

import { SUPPORT_TOKENS } from '../support.tokens';

import { SupportCaseAggregate } from '../../domain/aggregates/support-case.aggregate';

import { SupportCaseException } from '../../domain/exceptions/support-case.exception';

import type { SupportCaseRepository } from '../../domain/repositories/support-case.repository';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class RemoveSupportCaseParticipantHandler implements CommandHandler<
  RemoveSupportCaseParticipantCommand,
  SupportCaseAggregate
> {
  public constructor(
    @Inject(SUPPORT_TOKENS.REPOSITORIES.SUPPORT_CASE)
    private readonly supportCaseRepository: SupportCaseRepository,
  ) {}

  // ---------------------------------------------------------------------------
  // Execute
  // ---------------------------------------------------------------------------

  public async execute(
    command: RemoveSupportCaseParticipantCommand,
  ): Promise<SupportCaseAggregate> {
    // -------------------------------------------------------------------------
    // Load Aggregate
    // -------------------------------------------------------------------------

    const aggregate = await this.supportCaseRepository.findByPublicId(
      command.supportCasePublicId,
    );

    if (aggregate === null) {
      throw new SupportCaseException(
        `Support case not found: ${command.supportCasePublicId.value}.`,
      );
    }

    // -------------------------------------------------------------------------
    // Remove Participant
    // -------------------------------------------------------------------------
    //
    // Participant removal is delegated entirely to the aggregate.
    //
    // The aggregate is responsible for:
    //
    // - locating the participant by public identity;
    // - validating participant existence;
    // - validating the Support Case lifecycle;
    // - applying the participant state transition;
    // - recording the corresponding domain event;
    // - enforcing all aggregate invariants.
    //
    // The application layer must not manipulate the participant entity
    // directly.
    //

    aggregate.removeParticipant(
      command.participantPublicId,
      command.correlationId,
      command.causationId,
      command.leftAt ?? new Date(),
    );

    // -------------------------------------------------------------------------
    // Persist Aggregate
    // -------------------------------------------------------------------------

    await this.supportCaseRepository.save(aggregate);

    // -------------------------------------------------------------------------
    // Return
    // -------------------------------------------------------------------------

    return aggregate;
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default RemoveSupportCaseParticipantHandler;
