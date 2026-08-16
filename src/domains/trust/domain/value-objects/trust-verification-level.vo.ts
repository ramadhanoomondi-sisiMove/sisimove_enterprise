// src/domains/trust/domain/value-objects/trust-verification-level.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

export enum TrustVerificationLevel {
  NONE = 'NONE',
  BASIC = 'BASIC',
  VERIFIED = 'VERIFIED',
  HIGHLY_VERIFIED = 'HIGHLY_VERIFIED',
}

interface TrustVerificationLevelProps {
  value: TrustVerificationLevel;
}

export class TrustVerificationLevelValueObject extends ValueObject<TrustVerificationLevelProps> {
  constructor(level: TrustVerificationLevel) {
    if (!Object.values(TrustVerificationLevel).includes(level)) {
      throw new Error(`Invalid trust verification level "${level}".`);
    }

    super({
      value: level,
    });
  }

  get value(): TrustVerificationLevel {
    return this.props.value;
  }

  get isNone(): boolean {
    return this.props.value === TrustVerificationLevel.NONE;
  }

  get isBasic(): boolean {
    return this.props.value === TrustVerificationLevel.BASIC;
  }

  get isVerified(): boolean {
    return this.props.value === TrustVerificationLevel.VERIFIED;
  }

  get isHighlyVerified(): boolean {
    return this.props.value === TrustVerificationLevel.HIGHLY_VERIFIED;
  }
}
