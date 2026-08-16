// src/domains/trust/domain/value-objects/trust-event-reason.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

interface TrustEventReasonProps {
  value: string;
}

export class TrustEventReason extends ValueObject<TrustEventReasonProps> {
  public static readonly MAX_LENGTH = 1000;

  constructor(reason: string) {
    const normalizedReason = reason.trim();

    if (normalizedReason.length > TrustEventReason.MAX_LENGTH) {
      throw new Error(
        `Trust event reason cannot exceed ${TrustEventReason.MAX_LENGTH} characters.`,
      );
    }

    super({
      value: normalizedReason,
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
