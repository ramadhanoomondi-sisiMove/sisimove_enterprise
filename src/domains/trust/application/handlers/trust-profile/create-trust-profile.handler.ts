// src/domains/trust/application/handlers/trust-profile/create-trust-profile.handler.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { CreateTrustProfileCommand } from '../../commands/trust-profile/create-trust-profile.command';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { TrustProfileAggregate } from '../../../domain/aggregates/trust-profile.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import { TrustProfileEntity } from '../../../domain/entities/trust-profile.entity';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { TrustProfileAlreadyExistsException } from '../../../domain/exceptions';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { TrustProfileRepository } from '../../../domain/repositories/trust-profile.repository';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import {
  MemberPublicId,
  TrustProfileId,
  TrustProfileStatusValueObject,
  TrustVerificationLevelValueObject,
  TrustRatingAverage,
  TrustRatingCount,
  CompletedJourneys,
  ProviderJourneys,
  PassengerJourneys,
  CompletedProviderJourneys,
  CompletedPassengerJourneys,
  CancelledJourneys,
  ProviderCancellations,
  PassengerCancellations,
  TrustCompletionRate,
  TrustCancellationRate,
} from '../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

export class CreateTrustProfileHandler implements CommandHandler<
  CreateTrustProfileCommand,
  TrustProfileAggregate
> {
  constructor(private readonly repository: TrustProfileRepository) {}

  async execute(
    command: CreateTrustProfileCommand,
  ): Promise<TrustProfileAggregate> {
    // -------------------------------------------------------------------------
    // Member Identity
    // -------------------------------------------------------------------------

    const memberPublicId = new MemberPublicId(command.memberPublicId);

    // -------------------------------------------------------------------------
    // Uniqueness
    // -------------------------------------------------------------------------

    if (await this.repository.existsByMemberPublicId(memberPublicId)) {
      throw new TrustProfileAlreadyExistsException();
    }

    // -------------------------------------------------------------------------
    // Value Objects
    //
    // All persisted domain properties are represented by their corresponding
    // value objects. The application layer must never pass raw primitives into
    // TrustProfileEntity.
    // -------------------------------------------------------------------------

    const profile = TrustProfileEntity.create({
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: new TrustProfileId(),

      memberPublicId,

      // -----------------------------------------------------------------------
      // Trust State
      // -----------------------------------------------------------------------

      status: new TrustProfileStatusValueObject(command.status),

      verificationLevel: new TrustVerificationLevelValueObject(
        command.verificationLevel,
      ),

      // -----------------------------------------------------------------------
      // Rating Statistics
      // -----------------------------------------------------------------------

      ratingAverage: new TrustRatingAverage(0),

      ratingCount: new TrustRatingCount(0),

      // -----------------------------------------------------------------------
      // Journey Statistics
      // -----------------------------------------------------------------------

      completedJourneys: new CompletedJourneys(0),

      providerJourneys: new ProviderJourneys(0),

      passengerJourneys: new PassengerJourneys(0),

      completedProviderJourneys: new CompletedProviderJourneys(0),

      completedPassengerJourneys: new CompletedPassengerJourneys(0),

      // -----------------------------------------------------------------------
      // Cancellation Statistics
      // -----------------------------------------------------------------------

      cancelledJourneys: new CancelledJourneys(0),

      providerCancellations: new ProviderCancellations(0),

      passengerCancellations: new PassengerCancellations(0),

      // -----------------------------------------------------------------------
      // Rates
      // -----------------------------------------------------------------------

      completionRate: new TrustCompletionRate(0),

      cancellationRate: new TrustCancellationRate(0),

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: new Date(),

      updatedAt: new Date(),
    });

    // -------------------------------------------------------------------------
    // Aggregate
    // -------------------------------------------------------------------------

    const aggregate = TrustProfileAggregate.create(profile);

    // -------------------------------------------------------------------------
    // Persistence
    // -------------------------------------------------------------------------

    await this.repository.save(aggregate);

    // -------------------------------------------------------------------------
    // Result
    // -------------------------------------------------------------------------

    return aggregate;
  }
}
