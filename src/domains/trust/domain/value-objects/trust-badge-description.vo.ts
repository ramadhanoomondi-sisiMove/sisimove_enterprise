// src/domains/trust/domain/value-objects/trust-badge-description.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

interface TrustBadgeDescriptionProps {
  value: string;
}

export class TrustBadgeDescription extends ValueObject<TrustBadgeDescriptionProps> {
  public static readonly MAX_LENGTH = 500;

  constructor(description: string) {
    const normalizedDescription = description.trim();

    if (normalizedDescription.length > TrustBadgeDescription.MAX_LENGTH) {
      throw new Error(
        `Trust badge description cannot exceed ${TrustBadgeDescription.MAX_LENGTH} characters.`,
      );
    }

    super({
      value: normalizedDescription,
    });
  }

  get value(): string {
    return this.props.value;
  }

  get length(): number {
    return this.props.value.length;
  }

  get isEmpty(): boolean {
    return this.props.value.length === 0;
  }
}
