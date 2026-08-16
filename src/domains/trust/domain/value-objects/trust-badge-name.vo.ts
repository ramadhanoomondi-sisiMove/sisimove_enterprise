// src/domains/trust/domain/value-objects/trust-badge-name.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

interface TrustBadgeNameProps {
  value: string;
}

export class TrustBadgeName extends ValueObject<TrustBadgeNameProps> {
  public static readonly MIN_LENGTH = 2;
  public static readonly MAX_LENGTH = 100;

  constructor(name: string) {
    const normalizedName = name.trim();

    if (normalizedName.length < TrustBadgeName.MIN_LENGTH) {
      throw new Error('Trust badge name is too short.');
    }

    if (normalizedName.length > TrustBadgeName.MAX_LENGTH) {
      throw new Error(
        `Trust badge name cannot exceed ${TrustBadgeName.MAX_LENGTH} characters.`,
      );
    }

    super({
      value: normalizedName,
    });
  }

  get value(): string {
    return this.props.value;
  }

  get length(): number {
    return this.props.value.length;
  }
}
