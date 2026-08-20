// -----------------------------------------------------------------------------
// Journey Completion — Get Confirmations Query Handler
// -----------------------------------------------------------------------------

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
// Handler
// -----------------------------------------------------------------------------

/**
 * Handles retrieval of Journey Completion confirmations.
 *
 * The repository is supplied explicitly and is not injected through NestJS.
 *
 * Filtering is delegated to the repository methods already exposed by the
 * Journey Completion repository contract.
 */
export class GetJourneyCompletionConfirmationsHandler implements QueryHandler<
  GetJourneyCompletionConfirmationsQuery,
  JourneyCompletionConfirmationEntity[]
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
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
    //
    // The repository exposes member lookup across all completions, rather than
    // a completion-public-id + member combination. Therefore filter the
    // completion after retrieving member confirmations.
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

        return await this.repository.findConfirmationsByRole(
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

      return await this.repository.findConfirmationsByStatus(
        completion.aggregateId,
        status,
      );
    }

    // -------------------------------------------------------------------------
    // All confirmations for completion
    // -------------------------------------------------------------------------

    return await this.repository.findConfirmationsByCompletionPublicId(
      completionPublicId,
    );
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetJourneyCompletionConfirmationsHandler;
