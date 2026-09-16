// -----------------------------------------------------------------------------
// sisiMove — Create Traveller Profile Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler responsible for creating a new TravellerProfile
// aggregate.
//
// Responsibilities:
//
// - Resolve the TravellerProfileRepository through the application DI token.
// - Enforce application-level uniqueness before creation.
// - Convert command primitives into Traveller Profile domain value objects.
// - Construct the TravellerProfileEntity through its domain factory.
// - Construct the TravellerProfileAggregate.
// - Persist the newly-created aggregate.
// - Return the created aggregate.
//
// This handler does NOT:
//
// - Mutate TravellerProfileEntity directly.
// - Generate handles outside the TravellerHandle value object.
// - Determine domain lifecycle rules.
// - Manage journey statistics after creation.
// - Create profile preferences.
// - Create trust.
// - Create verification.
// - Create authentication.
// - Create sessions.
// - Assign identity roles.
// - Publish journeys.
// - Create journey demands.
// - Communicate with external systems.
//
// TravellerProfile remains the owner of TravellerProfile creation.
//
// -----------------------------------------------------------------------------
//
// Application flow:
//
//     CreateTravellerProfileCommand
//                │
//                ▼
//     MemberPublicId
//                │
//                ▼
//     repository.existsByMemberPublicId()
//                │
//                ├── exists → throw
//                │
//                ▼
//     TravellerProfileEntity.create()
//                │
//                ▼
//     TravellerProfileAggregate.create()
//                │
//                ▼
//     repository.save()
//                │
//                ▼
//     TravellerProfileAggregate
//
// -----------------------------------------------------------------------------
//
// Dependency Injection:
//
//     CreateTravellerProfileHandler
//                │
//                ▼
//     TRAVELLER_PROFILE_TOKENS.REPOSITORY
//                │
//                ▼
//     TravellerProfileRepository
//
// The repository is an application/domain interface and therefore cannot be
// used directly as a NestJS runtime injection token. The explicit token keeps
// the application layer independent of the Prisma infrastructure adapter.
//
// -----------------------------------------------------------------------------
//
// Domain boundary:
//
// The command contains transport/application primitives.
//
// Therefore this handler is the application boundary responsible for
// translating those primitives into TravellerProfile domain value objects:
//
//     string
//       │
//       ├── MemberPublicId
//       ├── TravellerHandle
//       ├── TravellerBio
//       ├── AvatarAssetPublicId
//       ├── CountryCode
//       ├── TravellerProfileStatusValueObject
//       └── TravellerProfileVisibilityValueObject
//
// Domain validation remains inside those value objects and the aggregate.
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
// Application — Tokens
// -----------------------------------------------------------------------------

import { TRAVELLER_PROFILE_TOKENS } from '../traveller-profile.tokens';

// -----------------------------------------------------------------------------
// Application — Command
// -----------------------------------------------------------------------------

import type { CreateTravellerProfileCommand } from '../commands/create-traveller-profile.command';

// -----------------------------------------------------------------------------
// Domain — Aggregate
// -----------------------------------------------------------------------------

import { TravellerProfileAggregate } from '../../domain/aggregates/traveller-profile.aggregate';

// -----------------------------------------------------------------------------
// Domain — Entity
// -----------------------------------------------------------------------------

import { TravellerProfileEntity } from '../../domain/entities/traveller-profile.entity';

// -----------------------------------------------------------------------------
// Domain — Repository
// -----------------------------------------------------------------------------

import type { TravellerProfileRepository } from '../../domain/repositories/traveller-profile.repository';

// -----------------------------------------------------------------------------
// Domain — Exceptions
// -----------------------------------------------------------------------------

import { TravellerProfileAlreadyExistsException } from '../../domain/exceptions';

// -----------------------------------------------------------------------------
// Domain — Value Objects
// -----------------------------------------------------------------------------

import {
  AvatarAssetPublicId,
  CountryCode,
  MemberPublicId,
  TravellerBio,
  TravellerHandle,
  TravellerProfilePublicId,
  TravellerProfileStatusValueObject,
  TravellerProfileVisibilityValueObject,
} from '../../domain/value-objects';

// =============================================================================
// Handler
// =============================================================================

/**
 * Creates a new TravellerProfile aggregate.
 *
 * The handler performs application orchestration only:
 *
 *     Command
 *       │
 *       ▼
 *     Convert primitives to domain VOs
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
 * TravellerProfile domain rules remain inside the domain model.
 */
@Injectable()
export class CreateTravellerProfileHandler implements CommandHandler<
  CreateTravellerProfileCommand,
  TravellerProfileAggregate
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  /**
   * Injects the TravellerProfile repository through the application token.
   *
   * The handler intentionally depends on the repository abstraction rather
   * than PrismaTravellerProfileRepository.
   */
  public constructor(
    @Inject(TRAVELLER_PROFILE_TOKENS.REPOSITORY)
    private readonly repository: TravellerProfileRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  /**
   * Executes the Create Traveller Profile command.
   *
   * The command contains primitive application values. This handler converts
   * them into domain value objects before passing them into the domain entity
   * factory.
   */
  public async execute(
    command: CreateTravellerProfileCommand,
  ): Promise<TravellerProfileAggregate> {
    // -------------------------------------------------------------------------
    // 1. Command guard
    // -------------------------------------------------------------------------
    //
    // A command is required for every application operation.
    // -------------------------------------------------------------------------

    if (command === undefined) {
      throw new Error('Create Traveller Profile command is required.');
    }

    // -------------------------------------------------------------------------
    // 2. Convert member public identifier
    // -------------------------------------------------------------------------
    //
    // TravellerProfile stores the Identity reference as an opaque
    // memberPublicId. The value object validates and normalizes the domain
    // representation.
    // -------------------------------------------------------------------------

    const memberPublicId = new MemberPublicId(command.memberPublicId);

    // -------------------------------------------------------------------------
    // 3. Enforce member uniqueness
    // -------------------------------------------------------------------------
    //
    // A member can own only one TravellerProfile.
    //
    // This is an application-level existence check. The database unique
    // constraint remains the final persistence-level protection against
    // concurrent duplicate creation.
    // -------------------------------------------------------------------------

    if (await this.repository.existsByMemberPublicId(memberPublicId)) {
      throw new TravellerProfileAlreadyExistsException();
    }

    // -------------------------------------------------------------------------
    // 4. Convert command values into domain value objects
    // -------------------------------------------------------------------------
    //
    // The handler is the application boundary between primitive command
    // values and the domain model.
    //
    // Domain validation remains inside the individual value objects.
    // -------------------------------------------------------------------------

    const profile = TravellerProfileEntity.create({
      // -----------------------------------------------------------------------
      // Public identity
      // -----------------------------------------------------------------------

      publicId: new TravellerProfilePublicId(),

      memberPublicId,

      // -----------------------------------------------------------------------
      // Traveller identity
      // -----------------------------------------------------------------------

      handle: new TravellerHandle(command.handle),

      bio: new TravellerBio(command.bio),

      // -----------------------------------------------------------------------
      // Optional avatar
      // -----------------------------------------------------------------------

      avatarAssetPublicId:
        command.avatarAssetPublicId !== null
          ? new AvatarAssetPublicId(command.avatarAssetPublicId)
          : undefined,

      // -----------------------------------------------------------------------
      // Profile configuration
      // -----------------------------------------------------------------------

      countryCode: new CountryCode(command.countryCode),

      status: new TravellerProfileStatusValueObject(command.status),

      visibility: new TravellerProfileVisibilityValueObject(command.visibility),

      // -----------------------------------------------------------------------
      // Materialized journey statistics
      // -----------------------------------------------------------------------
      //
      // A newly-created traveller has no journey history.
      //
      // These are initialized here because they are owned/materialized by the
      // TravellerProfile domain model and subsequently updated by the
      // appropriate journey lifecycle operations.
      // -----------------------------------------------------------------------

      totalJourneys: 0,
      completedJourneys: 0,

      providerJourneys: 0,
      passengerJourneys: 0,

      completedProviderJourneys: 0,
      completedPassengerJourneys: 0,

      // -----------------------------------------------------------------------
      // Audit timestamps
      // -----------------------------------------------------------------------
      //
      // Initial creation timestamps belong to the creation operation.
      // -----------------------------------------------------------------------

      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // -------------------------------------------------------------------------
    // 5. Create aggregate
    // -------------------------------------------------------------------------
    //
    // TravellerProfileAggregate becomes the application-level unit that is
    // persisted by the repository.
    // -------------------------------------------------------------------------

    const aggregate = TravellerProfileAggregate.create(profile);

    // -------------------------------------------------------------------------
    // 6. Persist aggregate
    // -------------------------------------------------------------------------
    //
    // Persistence remains behind the TravellerProfileRepository abstraction.
    //
    // The handler does not know whether the implementation is Prisma,
    // another database adapter, or an in-memory implementation.
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

export default CreateTravellerProfileHandler;
