// src/domains/journey/domain/entities/journey-preferences.entity.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';
import type { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';
import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { JourneyPreferencesPublicId } from '../value-objects/journey-preferences-public-id.vo';
import type { JourneySmokingPolicyValueObject } from '../value-objects/journey-smoking-policy.vo';
import type { JourneyPetsPolicyValueObject } from '../value-objects/journey-pets-policy.vo';
import type { JourneyLuggagePolicyValueObject } from '../value-objects/journey-luggage-policy.vo';
import type { JourneyConversationPreferenceValueObject } from '../value-objects/journey-conversation-preference.vo';
import type { JourneyMusicPreferenceValueObject } from '../value-objects/journey-music-preference.vo';

// -----------------------------------------------------------------------------
// Properties
// -----------------------------------------------------------------------------

interface JourneyPreferencesProps {
  publicId: JourneyPreferencesPublicId;

  smoking: JourneySmokingPolicyValueObject;
  pets: JourneyPetsPolicyValueObject;
  luggage: JourneyLuggagePolicyValueObject;
  conversation: JourneyConversationPreferenceValueObject;
  music: JourneyMusicPreferenceValueObject;

  createdAt: Date;
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

export class JourneyPreferencesEntity extends Entity<JourneyPreferencesProps> {
  private constructor(props: JourneyPreferencesProps, id?: UniqueEntityId) {
    super(props, id);
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(
    props: JourneyPreferencesProps,
  ): JourneyPreferencesEntity {
    return new JourneyPreferencesEntity(props);
  }

  public static rehydrate(
    props: JourneyPreferencesProps,
    id: UniqueEntityId,
  ): JourneyPreferencesEntity {
    return new JourneyPreferencesEntity(props, id);
  }

  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  override get publicId(): PublicEntityId {
    return this.props.publicId;
  }

  // ---------------------------------------------------------------------------
  // Properties
  // ---------------------------------------------------------------------------

  get smoking(): JourneySmokingPolicyValueObject {
    return this.props.smoking;
  }

  get pets(): JourneyPetsPolicyValueObject {
    return this.props.pets;
  }

  get luggage(): JourneyLuggagePolicyValueObject {
    return this.props.luggage;
  }

  get conversation(): JourneyConversationPreferenceValueObject {
    return this.props.conversation;
  }

  get music(): JourneyMusicPreferenceValueObject {
    return this.props.music;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // ---------------------------------------------------------------------------
  // Mutators
  // ---------------------------------------------------------------------------

  setSmoking(smoking: JourneySmokingPolicyValueObject): void {
    this.props.smoking = smoking;
  }

  setPets(pets: JourneyPetsPolicyValueObject): void {
    this.props.pets = pets;
  }

  setLuggage(luggage: JourneyLuggagePolicyValueObject): void {
    this.props.luggage = luggage;
  }

  setConversation(
    conversation: JourneyConversationPreferenceValueObject,
  ): void {
    this.props.conversation = conversation;
  }

  setMusic(music: JourneyMusicPreferenceValueObject): void {
    this.props.music = music;
  }

  setUpdatedAt(updatedAt: Date): void {
    this.props.updatedAt = updatedAt;
  }

  // ---------------------------------------------------------------------------
  // Queries
  // ---------------------------------------------------------------------------

  smokingAllowed(): boolean {
    return this.props.smoking.isAllowed;
  }

  petsAllowed(): boolean {
    return this.props.pets.isAllowed;
  }

  // ---------------------------------------------------------------------------
  // Equality
  // ---------------------------------------------------------------------------

  override equals(other?: JourneyPreferencesEntity): boolean {
    if (other === undefined) {
      return false;
    }

    return this.id.equals(other.id);
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { JourneyPreferencesProps };
