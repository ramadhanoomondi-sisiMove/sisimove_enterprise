// src/domains/trust/domain/value-objects/trust-event-type.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

export enum TrustEventType {
  JOURNEY_COMPLETED = 'JOURNEY_COMPLETED',
  JOURNEY_CANCELLED = 'JOURNEY_CANCELLED',

  RATING_RECEIVED = 'RATING_RECEIVED',
  RATING_REMOVED = 'RATING_REMOVED',

  VERIFICATION_GRANTED = 'VERIFICATION_GRANTED',
  VERIFICATION_REVOKED = 'VERIFICATION_REVOKED',

  BADGE_AWARDED = 'BADGE_AWARDED',
  BADGE_REVOKED = 'BADGE_REVOKED',

  DISPUTE_OPENED = 'DISPUTE_OPENED',
  DISPUTE_RESOLVED = 'DISPUTE_RESOLVED',

  TRUST_RESTRICTED = 'TRUST_RESTRICTED',
  TRUST_RESTORED = 'TRUST_RESTORED',

  MANUAL_ADJUSTMENT = 'MANUAL_ADJUSTMENT',
}

interface TrustEventTypeProps {
  value: TrustEventType;
}

export class TrustEventTypeValueObject extends ValueObject<TrustEventTypeProps> {
  constructor(type: TrustEventType) {
    if (!Object.values(TrustEventType).includes(type)) {
      throw new Error(`Invalid trust event type "${type}".`);
    }

    super({
      value: type,
    });
  }

  get value(): TrustEventType {
    return this.props.value;
  }

  get isJourneyCompleted(): boolean {
    return this.props.value === TrustEventType.JOURNEY_COMPLETED;
  }

  get isJourneyCancelled(): boolean {
    return this.props.value === TrustEventType.JOURNEY_CANCELLED;
  }

  get isRatingReceived(): boolean {
    return this.props.value === TrustEventType.RATING_RECEIVED;
  }

  get isRatingRemoved(): boolean {
    return this.props.value === TrustEventType.RATING_REMOVED;
  }

  get isVerificationGranted(): boolean {
    return this.props.value === TrustEventType.VERIFICATION_GRANTED;
  }

  get isVerificationRevoked(): boolean {
    return this.props.value === TrustEventType.VERIFICATION_REVOKED;
  }

  get isBadgeAwarded(): boolean {
    return this.props.value === TrustEventType.BADGE_AWARDED;
  }

  get isBadgeRevoked(): boolean {
    return this.props.value === TrustEventType.BADGE_REVOKED;
  }

  get isDisputeOpened(): boolean {
    return this.props.value === TrustEventType.DISPUTE_OPENED;
  }

  get isDisputeResolved(): boolean {
    return this.props.value === TrustEventType.DISPUTE_RESOLVED;
  }

  get isTrustRestricted(): boolean {
    return this.props.value === TrustEventType.TRUST_RESTRICTED;
  }

  get isTrustRestored(): boolean {
    return this.props.value === TrustEventType.TRUST_RESTORED;
  }

  get isManualAdjustment(): boolean {
    return this.props.value === TrustEventType.MANUAL_ADJUSTMENT;
  }
}
