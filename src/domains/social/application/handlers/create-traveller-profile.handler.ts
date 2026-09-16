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
// - Enforce member ownership uniqueness.
// - Enforce public handle uniqueness.
// - Convert command primitives into Traveller Profile domain value objects.
// - Construct the TravellerProfileEntity through its domain factory.
// - Construct the TravellerProfileAggregate.
// - Persist the newly-created aggregate.
// - Return the created aggregate.
//
// This handler does NOT:
//
// - Mutate TravellerProfileEntity directly.
// - Generate handles.
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
//                ├── MemberPublicId
//                │
//                └── TravellerHandle
//                         │
//                         ▼
//              existsByMemberPublicId()
//                         │
//                  ┌──────┴──────┐
//                  │             │
//               exists         available
//                  │             │
//                  ▼             ▼
//             throw         existsByHandle()
//                                │
//                         ┌──────┴──────┐
//                         │             │
//                      exists        available
//                         │             │
//                         ▼             ▼
//                       throw      create entity
//                                      │
//                                      ▼
//                                create aggregate
//                                      │
//                                      ▼
//                                  repository.save()
//
// -----------------------------------------------------------------------------
//
// Handle ownership:
//
// The TravellerProfile aggregate owns the traveller handle.
//
// The handler does NOT derive a handle from travellerName and does NOT invent
// an alternative handle when the requested handle is unavailable.
//
// A caller must explicitly provide the desired handle.
//
// TravellerHandle is responsible for normalization and domain validation.
// The repository existence check uses the normalized TravellerHandle value.
//
// The database unique constraint remains the final concurrency safeguard.
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

import {
  TravellerProfileAlreadyExistsException,
  TravellerProfileHandleAlreadyExistsException,
} from '../../domain/exceptions';

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
 *       ├── Convert member identifier
 *       ├── Convert handle
 *       │
 *       ├── Check member uniqueness
 *       ├── Check handle uniqueness
 *       │
 *       ├── Create entity
 *       ├── Create aggregate
 *       ├── Persist aggregate
 *       │
 *       └── Return aggregate
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
    // memberPublicId.
    //
    // The MemberPublicId value object validates the supplied identifier at the
    // application/domain boundary.
    // -------------------------------------------------------------------------

    const memberPublicId = new MemberPublicId(command.memberPublicId);

    // -------------------------------------------------------------------------
    // 3. Convert traveller handle
    // -------------------------------------------------------------------------
    //
    // The handle is explicitly supplied by the caller.
    //
    // TravellerHandle is responsible for:
    //
    // - trimming surrounding whitespace;
    // - normalizing to lowercase;
    // - validating the 3–30 character domain format.
    //
    // The normalized VO is retained and reused throughout the operation so
    // that validation, uniqueness checking, and persistence all operate on
    // exactly the same domain value.
    // -------------------------------------------------------------------------

    const handle = new TravellerHandle(command.handle);

    // -------------------------------------------------------------------------
    // 4. Enforce member uniqueness
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
    // 5. Enforce handle uniqueness
    // -------------------------------------------------------------------------
    //
    // Handles are globally unique within TravellerProfile.
    //
    // This explicit application-level check allows the caller to receive a
    // meaningful domain/application error before attempting persistence.
    //
    // The database @unique(handle) constraint remains necessary because this
    // existence check cannot by itself eliminate a race between two concurrent
    // creation requests.
    //
    // No alternative handle is generated here.
    // -------------------------------------------------------------------------

    if (await this.repository.existsByHandle(handle)) {
      throw new TravellerProfileHandleAlreadyExistsException(handle.value);
    }

    // -------------------------------------------------------------------------
    // 6. Convert remaining command values into domain value objects
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
      //
      // Use the already-normalized and validated TravellerHandle instance.
      // -----------------------------------------------------------------------

      handle,

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
      // These values are initialized here because they are owned/materialized
      // by the TravellerProfile domain model and subsequently updated by the
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

      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // -------------------------------------------------------------------------
    // 7. Create aggregate
    // -------------------------------------------------------------------------
    //
    // TravellerProfileAggregate becomes the application-level unit that is
    // persisted by the repository.
    // -------------------------------------------------------------------------

    const aggregate = TravellerProfileAggregate.create(profile);

    // -------------------------------------------------------------------------
    // 8. Persist aggregate
    // -------------------------------------------------------------------------
    //
    // Persistence remains behind the TravellerProfileRepository abstraction.
    //
    // When this handler executes inside RegisterUserHandler's UnitOfWork,
    // repository.save() participates in the same Prisma transaction as the
    // Identity, Verification, Preferences, Trust, and Authentication writes.
    // -------------------------------------------------------------------------

    await this.repository.save(aggregate);

    // -------------------------------------------------------------------------
    // 9. Return aggregate
    // -------------------------------------------------------------------------

    return aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CreateTravellerProfileHandler;
