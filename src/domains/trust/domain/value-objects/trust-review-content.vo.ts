// src/domains/trust/domain/value-objects/trust-review-content.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

interface TrustReviewContentProps {
  value: string;
}

export class TrustReviewContent extends ValueObject<TrustReviewContentProps> {
  public static readonly MIN_LENGTH = 1;
  public static readonly MAX_LENGTH = 2000;

  constructor(content: string) {
    const normalizedContent = content.trim();

    if (normalizedContent.length < TrustReviewContent.MIN_LENGTH) {
      throw new Error('Trust review content cannot be empty.');
    }

    if (normalizedContent.length > TrustReviewContent.MAX_LENGTH) {
      throw new Error(
        `Trust review content cannot exceed ${TrustReviewContent.MAX_LENGTH} characters.`,
      );
    }

    super({
      value: normalizedContent,
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
