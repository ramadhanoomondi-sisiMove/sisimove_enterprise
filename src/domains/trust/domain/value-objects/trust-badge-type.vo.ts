// src/domains/trust/domain/value-objects/trust-badge-type.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

export enum TrustBadgeType {
  IDENTITY_VERIFIED = 'IDENTITY_VERIFIED',
  PHONE_VERIFIED = 'PHONE_VERIFIED',
  EXPERIENCED_PROVIDER = 'EXPERIENCED_PROVIDER',
  EXPERIENCED_TRAVELLER = 'EXPERIENCED_TRAVELLER',
  RELIABLE_PROVIDER = 'RELIABLE_PROVIDER',
  RELIABLE_TRAVELLER = 'RELIABLE_TRAVELLER',
  HIGHLY_RATED = 'HIGHLY_RATED',
}

interface TrustBadgeTypeProps {
  value: TrustBadgeType;
}

export class TrustBadgeTypeValueObject extends ValueObject<TrustBadgeTypeProps> {
  constructor(type: TrustBadgeType) {
    if (!Object.values(TrustBadgeType).includes(type)) {
      throw new Error(`Invalid trust badge type "${type}".`);
    }

    super({
      value: type,
    });
  }

  get value(): TrustBadgeType {
    return this.props.value;
  }

  get isIdentityVerified(): boolean {
    return this.props.value === TrustBadgeType.IDENTITY_VERIFIED;
  }

  get isPhoneVerified(): boolean {
    return this.props.value === TrustBadgeType.PHONE_VERIFIED;
  }

  get isExperiencedProvider(): boolean {
    return this.props.value === TrustBadgeType.EXPERIENCED_PROVIDER;
  }

  get isExperiencedTraveller(): boolean {
    return this.props.value === TrustBadgeType.EXPERIENCED_TRAVELLER;
  }

  get isReliableProvider(): boolean {
    return this.props.value === TrustBadgeType.RELIABLE_PROVIDER;
  }

  get isReliableTraveller(): boolean {
    return this.props.value === TrustBadgeType.RELIABLE_TRAVELLER;
  }

  get isHighlyRated(): boolean {
    return this.props.value === TrustBadgeType.HIGHLY_RATED;
  }
}
