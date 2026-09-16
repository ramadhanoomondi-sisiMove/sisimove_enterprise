// -----------------------------------------------------------------------------
// sisiMove — Create Trust Profile Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler responsible for creating a new TrustProfile
// aggregate for a member.
//
// Responsibilities:
//
// - Resolve TrustProfileRepository through the application DI token.
// - Convert the member public identifier into its domain value object.
// - Enforce the one-to-one Member → TrustProfile invariant at the application
//   boundary through the repository existence check.
// - Construct TrustProfileEntity through its domain factory.
// - Initialize TrustProfile's domain statistics with their value objects.
// - Construct TrustProfileAggregate.
// - Persist the aggregate.
// - Return the created aggregate.
//
// This handler does NOT:
//
// - Create or mutate Identity.
// - Create Verification.
// - Create Authentication.
// - Create TravellerProfile.
// - Create Journey data.
// - Create Booking data.
// - Assign Identity roles.
// - Manage Trust ratings.
// - Manage Trust reviews.
// - Manage Trust badges.
// - Resolve Asset storage.
// - Communicate with external systems.
//
// TrustProfileAggregate remains responsible for Trust domain behaviour.
//
// -----------------------------------------------------------------------------
//
// Application flow:
//
//     CreateTrustProfileCommand
//                │
//                ▼
//          MemberPublicId
//                │
//                ▼
//     repository.existsByMemberPublicId()
//                │
//                ├── exists → throw
//                │
//                ▼
//     TrustProfileEntity.create()
//                │
//                ▼
//     TrustProfileAggregate.create()
//                │
//                ▼
//     repository.save()
//                │
//                ▼
//     TrustProfileAggregate
//
// -----------------------------------------------------------------------------
//
// Dependency Injection:
//
//     CreateTrustProfileHandler
//                │
//                ▼
//     TRUST_PROFILE_TOKENS.REPOSITORY
//                │
//                ▼
//     TrustProfileRepository
//                │
//                ▼
//     Concrete infrastructure repository
//
// The application layer depends only on the repository abstraction. Concrete
// persistence implementations are bound by the NestJS composition layer.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { TRUST_PROFILE_TOKENS } from '../../trust-profile.tokens';

// -----------------------------------------------------------------------------
// Application — Command
// -----------------------------------------------------------------------------

import type { CreateTrustProfileCommand } from '../../commands/trust-profile/create-trust-profile.command';

// -----------------------------------------------------------------------------
// Domain — Aggregate
// -----------------------------------------------------------------------------
//
// This is intentionally a normal import because the handler invokes the
// runtime factory:
//
//     TrustProfileAggregate.create(profile)
//
// -----------------------------------------------------------------------------

import { TrustProfileAggregate } from '../../../domain/aggregates/trust-profile.aggregate';

// -----------------------------------------------------------------------------
// Domain — Entity
// -----------------------------------------------------------------------------

import { TrustProfileEntity } from '../../../domain/entities/trust-profile.entity';

// -----------------------------------------------------------------------------
// Domain — Exceptions
// -----------------------------------------------------------------------------

import { TrustProfileAlreadyExistsException } from '../../../domain/exceptions';

// -----------------------------------------------------------------------------
// Domain — Repository
// -----------------------------------------------------------------------------

import type { TrustProfileRepository } from '../../../domain/repositories/trust-profile.repository';

// -----------------------------------------------------------------------------
// Domain — Value Objects
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

// =============================================================================
// Handler
// =============================================================================

/**
 * Creates a new TrustProfile aggregate for a member.
 *
 * The handler performs application orchestration only:
 *
 *     Command
 *       │
 *       ▼
 *     Convert member ID
 *       │
 *       ▼
 *     Check uniqueness
 *       │
 *       ▼
 *     Create entity
 *       │
 *       ▼
 *     Create aggregate
 *       │
 *       ▼
 *     Persist aggregate
 *       │
 *       ▼
 *     Return aggregate
 *
 * Domain validation and Trust behaviour remain inside the domain model.
 */
@Injectable()
export class CreateTrustProfileHandler implements CommandHandler<
  CreateTrustProfileCommand,
  TrustProfileAggregate
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  /**
   * Injects the TrustProfile repository through the application token.
   *
   * TrustProfileRepository is an abstraction/type and therefore cannot be used
   * directly as a NestJS runtime injection token.
   */
  public constructor(
    @Inject(TRUST_PROFILE_TOKENS.REPOSITORY)
    private readonly repository: TrustProfileRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  /**
   * Executes the Create Trust Profile command.
   *
   * The command contains application-level primitive values. This handler
   * converts those values into the corresponding domain value objects before
   * constructing the TrustProfile entity.
   */
  public async execute(
    command: CreateTrustProfileCommand,
  ): Promise<TrustProfileAggregate> {
    // -------------------------------------------------------------------------
    // 1. Command guard
    // -------------------------------------------------------------------------

    if (command === undefined) {
      throw new Error('Create Trust Profile command is required.');
    }

    // -------------------------------------------------------------------------
    // 2. Convert member public identifier
    // -------------------------------------------------------------------------
    //
    // TrustProfile references the owning member through an opaque public
    // identifier. The domain value object validates that identifier.
    // -------------------------------------------------------------------------

    const memberPublicId = new MemberPublicId(command.memberPublicId);

    // -------------------------------------------------------------------------
    // 3. Enforce member uniqueness
    // -------------------------------------------------------------------------
    //
    // A member owns at most one TrustProfile.
    //
    // The repository existence check provides the application-level guard.
    // The database unique constraint remains the final persistence-level
    // protection against concurrent duplicate creation.
    // -------------------------------------------------------------------------

    if (await this.repository.existsByMemberPublicId(memberPublicId)) {
      throw new TrustProfileAlreadyExistsException();
    }

    // -------------------------------------------------------------------------
    // 4. Construct TrustProfile entity
    // -------------------------------------------------------------------------
    //
    // Every persisted domain property is represented by its corresponding
    // value object.
    //
    // Raw primitives are not passed into TrustProfileEntity.
    // -------------------------------------------------------------------------

    const profile = TrustProfileEntity.create({
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: new TrustProfileId(),

      memberPublicId,

      // -----------------------------------------------------------------------
      // Trust lifecycle state
      // -----------------------------------------------------------------------

      status: new TrustProfileStatusValueObject(command.status),

      verificationLevel: new TrustVerificationLevelValueObject(
        command.verificationLevel,
      ),

      // -----------------------------------------------------------------------
      // Rating statistics
      // -----------------------------------------------------------------------
      //
      // A newly-created TrustProfile has no ratings.
      // -----------------------------------------------------------------------

      ratingAverage: new TrustRatingAverage(0),

      ratingCount: new TrustRatingCount(0),

      // -----------------------------------------------------------------------
      // Journey statistics
      // -----------------------------------------------------------------------
      //
      // A newly-created TrustProfile has no journey history.
      // -----------------------------------------------------------------------

      completedJourneys: new CompletedJourneys(0),

      providerJourneys: new ProviderJourneys(0),

      passengerJourneys: new PassengerJourneys(0),

      completedProviderJourneys: new CompletedProviderJourneys(0),

      completedPassengerJourneys: new CompletedPassengerJourneys(0),

      // -----------------------------------------------------------------------
      // Cancellation statistics
      // -----------------------------------------------------------------------

      cancelledJourneys: new CancelledJourneys(0),

      providerCancellations: new ProviderCancellations(0),

      passengerCancellations: new PassengerCancellations(0),

      // -----------------------------------------------------------------------
      // Derived rates
      // -----------------------------------------------------------------------
      //
      // With no journey history, the newly-created profile starts with zero
      // materialized completion and cancellation rates.
      // -----------------------------------------------------------------------

      completionRate: new TrustCompletionRate(0),

      cancellationRate: new TrustCancellationRate(0),

      // -----------------------------------------------------------------------
      // Audit timestamps
      // -----------------------------------------------------------------------

      createdAt: new Date(),

      updatedAt: new Date(),
    });

    // -------------------------------------------------------------------------
    // 5. Create aggregate
    // -------------------------------------------------------------------------
    //
    // TrustProfileAggregate becomes the aggregate boundary for the created
    // TrustProfile entity.
    // -------------------------------------------------------------------------

    const aggregate = TrustProfileAggregate.create(profile);

    // -------------------------------------------------------------------------
    // 6. Persist aggregate
    // -------------------------------------------------------------------------
    //
    // Persistence remains behind the TrustProfileRepository abstraction.
    //
    // The handler does not know whether the concrete implementation uses
    // Prisma or another persistence mechanism.
    // -------------------------------------------------------------------------

    await this.repository.save(aggregate);

    // -------------------------------------------------------------------------
    // 7. Return aggregate
    // -------------------------------------------------------------------------

    return aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CreateTrustProfileHandler;
