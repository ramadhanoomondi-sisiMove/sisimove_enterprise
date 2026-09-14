// src/domains/social/domain/repositories/traveller-profile.repository.ts

import type { TravellerProfileAggregate } from '../aggregates/traveller-profile.aggregate';
import type { TravellerProfileEntity } from '../entities/traveller-profile.entity';
import type { TravellerProfilePreferencesEntity } from '../entities/traveller-profile-preferences.entity';
import type { TravellerProfileCorridorEntity } from '../entities/traveller-profile-corridor.entity';

import type { TravellerProfileId } from '../value-objects/traveller-profile-id.vo';
import type { TravellerProfilePublicId } from '../value-objects/traveller-profile-public-id.vo';
import type { MemberPublicId } from '../value-objects/member-public-id.vo';
import type { TravellerHandle } from '../value-objects/traveller-handle.vo';
import type { TravellerProfileCorridorId } from '../value-objects/traveller-profile-corridor-id.vo';
import type { CorridorKey } from '../value-objects/corridor-key.vo';

/**
 * Repository abstraction for the Traveller Profile aggregate.
 *
 * The domain layer depends only on this contract.
 * Infrastructure is responsible for implementing persistence.
 */
export interface TravellerProfileRepository {
  // ===========================================================================
  // Aggregate Persistence
  // ===========================================================================

  /**
   * Persist a Traveller Profile aggregate.
   *
   * The implementation is responsible for persisting:
   *
   * - TravellerProfileEntity;
   * - TravellerProfilePreferencesEntity;
   * - TravellerProfileCorridorEntity[].
   */
  save(aggregate: TravellerProfileAggregate): Promise<void>;

  /**
   * Find a Traveller Profile aggregate by its internal domain identifier.
   */
  findById(id: TravellerProfileId): Promise<TravellerProfileAggregate | null>;

  /**
   * Find a Traveller Profile aggregate by its public identifier.
   */
  findByPublicId(
    publicId: TravellerProfilePublicId,
  ): Promise<TravellerProfileAggregate | null>;

  /**
   * Find a Traveller Profile aggregate by the owning Member public identifier.
   */
  findByMemberPublicId(
    memberPublicId: MemberPublicId,
  ): Promise<TravellerProfileAggregate | null>;

  /**
   * Find a Traveller Profile aggregate by its public handle.
   *
   * This returns the complete aggregate because application-level queries may
   * need to evaluate aggregate-owned behavior or state before constructing
   * their response.
   *
   * In particular, the public Traveller Profile query uses this method to
   * evaluate TravellerProfileAggregate.isPublic() before exposing any public
   * representation.
   */
  findByHandle(
    handle: TravellerHandle,
  ): Promise<TravellerProfileAggregate | null>;

  /**
   * Delete a Traveller Profile aggregate.
   *
   * Deletion semantics are determined by the application/domain lifecycle.
   */
  delete(id: TravellerProfileId): Promise<void>;

  /**
   * Determine whether a Traveller Profile exists.
   */
  exists(id: TravellerProfileId): Promise<boolean>;

  /**
   * Determine whether a Traveller Profile exists for a Member.
   */
  existsByMemberPublicId(memberPublicId: MemberPublicId): Promise<boolean>;

  /**
   * Determine whether a handle is already in use.
   */
  existsByHandle(handle: TravellerHandle): Promise<boolean>;

  // ===========================================================================
  // Profile Queries
  // ===========================================================================

  /**
   * Find only the Traveller Profile entity by internal identifier.
   *
   * Useful for read/write operations where the complete aggregate
   * is not required.
   */
  findProfileById(
    id: TravellerProfileId,
  ): Promise<TravellerProfileEntity | null>;

  /**
   * Find only the Traveller Profile entity by public identifier.
   */
  findProfileByPublicId(
    publicId: TravellerProfilePublicId,
  ): Promise<TravellerProfileEntity | null>;

  /**
   * Find only the Traveller Profile entity by Member public identifier.
   */
  findProfileByMemberPublicId(
    memberPublicId: MemberPublicId,
  ): Promise<TravellerProfileEntity | null>;

  /**
   * Find only the Traveller Profile entity by handle.
   *
   * This remains separate from findByHandle().
   *
   * - findByHandle() returns the complete aggregate;
   * - findProfileByHandle() returns only the TravellerProfileEntity.
   *
   * Callers should use the aggregate-level method when aggregate-owned
   * behavior or state is required.
   */
  findProfileByHandle(
    handle: TravellerHandle,
  ): Promise<TravellerProfileEntity | null>;

  // ===========================================================================
  // Preferences
  // ===========================================================================

  /**
   * Find profile preferences for a Traveller Profile.
   */
  findPreferences(
    profileId: TravellerProfileId,
  ): Promise<TravellerProfilePreferencesEntity | null>;

  // ===========================================================================
  // Corridors
  // ===========================================================================

  /**
   * Find a corridor by its public/domain identifier.
   */
  findCorridorById(
    corridorId: TravellerProfileCorridorId,
  ): Promise<TravellerProfileCorridorEntity | null>;

  /**
   * Find all corridors belonging to a Traveller Profile.
   */
  findCorridors(
    profileId: TravellerProfileId,
  ): Promise<TravellerProfileCorridorEntity[]>;

  /**
   * Find the primary corridor for a Traveller Profile.
   */
  findPrimaryCorridor(
    profileId: TravellerProfileId,
  ): Promise<TravellerProfileCorridorEntity | null>;

  /**
   * Determine whether a profile has a corridor with the supplied key.
   */
  existsCorridorByKey(
    profileId: TravellerProfileId,
    corridorKey: CorridorKey,
  ): Promise<boolean>;
}
