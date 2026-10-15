// -----------------------------------------------------------------------------
// Journey Completion — Get Confirmations Query Handler
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// 1. Retrieve confirmations belonging to a Journey Completion.
// 2. Support filtering by member, booking, confirmation role, and status.
// 3. Delegate confirmation retrieval to the Journey Completion repository.
//
// Architectural rules:
//
// - NestJS manages this handler through @Injectable().
// - The repository is injected using JOURNEY_COMPLETION_TOKENS.REPOSITORY.
// - Filtering behavior remains consistent with the existing repository
//   contract.
// - This handler does not introduce new repository methods.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetJourneyCompletionConfirmationsQuery } from '../queries/get-journey-completion-confirmations.query';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import type { JourneyCompletionConfirmationEntity } from '../../domain/entities/journey-completion-confirmation.entity';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { JourneyCompletionRepository } from '../../domain/repositories/journey-completion.repository';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import { JourneyCompletionPublicId } from '../../domain/value-objects/journey-completion-public-id.vo';

import { JourneyCompletionMemberPublicId } from '../../domain/value-objects/journey-completion-member-public-id.vo';

import { JourneyCompletionBookingPublicId } from '../../domain/value-objects/journey-completion-booking-public-id.vo';

import { JourneyCompletionConfirmationRole } from '../../domain/value-objects/journey-completion-confirmation-role.vo';

import { JourneyCompletionConfirmationStatus } from '../../domain/value-objects/journey-completion-confirmation-status.vo';

// -----------------------------------------------------------------------------
// Dependency Injection Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_COMPLETION_TOKENS } from '../journey-completion.tokens';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/**
 * Handles retrieval of Journey Completion confirmations.
 *
 * Filtering is delegated to the repository methods already exposed by the
 * Journey Completion repository contract.
 *
 * NestJS injects the repository through the registered repository token.
 */
@Injectable()
export class GetJourneyCompletionConfirmationsHandler implements QueryHandler<
  GetJourneyCompletionConfirmationsQuery,
  JourneyCompletionConfirmationEntity[]
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(JOURNEY_COMPLETION_TOKENS.REPOSITORY)
    private readonly repository: JourneyCompletionRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    query: GetJourneyCompletionConfirmationsQuery,
  ): Promise<JourneyCompletionConfirmationEntity[]> {
    const completionPublicId = new JourneyCompletionPublicId(
      query.completionPublicId,
    );

    // -------------------------------------------------------------------------
    // Member filter
    // -------------------------------------------------------------------------

    if (query.memberPublicId !== undefined) {
      const memberPublicId = new JourneyCompletionMemberPublicId(
        query.memberPublicId,
      );

      const confirmations =
        await this.repository.findConfirmationsByMemberPublicId(memberPublicId);

      return confirmations.filter((confirmation) =>
        confirmation.completionId.equals(completionPublicId),
      );
    }

    // -------------------------------------------------------------------------
    // Booking filter
    // -------------------------------------------------------------------------

    if (query.bookingPublicId !== undefined) {
      const bookingPublicId = new JourneyCompletionBookingPublicId(
        query.bookingPublicId,
      );

      const confirmations =
        await this.repository.findConfirmationsByBookingPublicId(
          bookingPublicId,
        );

      return confirmations.filter((confirmation) =>
        confirmation.completionId.equals(completionPublicId),
      );
    }

    // -------------------------------------------------------------------------
    // Resolve aggregate identity for role/status filters
    // -------------------------------------------------------------------------

    if (query.role !== undefined || query.status !== undefined) {
      const completion =
        await this.repository.findByPublicId(completionPublicId);

      if (completion === null) {
        return [];
      }

      // -----------------------------------------------------------------------
      // Role + Status
      // -----------------------------------------------------------------------

      if (query.role !== undefined && query.status !== undefined) {
        const role = JourneyCompletionConfirmationRole.create(query.role);

        const status = JourneyCompletionConfirmationStatus.create(query.status);

        const roleConfirmations = await this.repository.findConfirmationsByRole(
          completion.aggregateId,
          role,
        );

        return roleConfirmations.filter((confirmation) =>
          confirmation.status.equals(status),
        );
      }

      // -----------------------------------------------------------------------
      // Role
      // -----------------------------------------------------------------------

      if (query.role !== undefined) {
        const role = JourneyCompletionConfirmationRole.create(query.role);

        return this.repository.findConfirmationsByRole(
          completion.aggregateId,
          role,
        );
      }

      // -----------------------------------------------------------------------
      // Status
      // -----------------------------------------------------------------------

      const status = JourneyCompletionConfirmationStatus.create(
        query.status as string,
      );

      return this.repository.findConfirmationsByStatus(
        completion.aggregateId,
        status,
      );
    }

    // -------------------------------------------------------------------------
    // All confirmations for completion
    // -------------------------------------------------------------------------

    return this.repository.findConfirmationsByCompletionPublicId(
      completionPublicId,
    );
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetJourneyCompletionConfirmationsHandler;
