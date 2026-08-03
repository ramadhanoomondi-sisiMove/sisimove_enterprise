import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

import { InvalidModerationConfidenceException } from '../exceptions';

interface ModerationConfidenceProps {
  value: number;
}

export class ModerationConfidence extends ValueObject<ModerationConfidenceProps> {
  public static readonly MIN = 0;

  public static readonly MAX = 1;

  constructor(value: number) {
    ModerationConfidence.validate(value);

    super({
      value,
    });

    Object.freeze(this);
  }

  get value(): number {
    return this.props.value;
  }

  percentage(): number {
    return this.value * 100;
  }

  isHigh(): boolean {
    return this.value >= 0.9;
  }

  isMedium(): boolean {
    return this.value >= 0.7 && this.value < 0.9;
  }

  isLow(): boolean {
    return this.value < 0.7;
  }

  override toString(): string {
    return `${this.percentage().toFixed(2)}%`;
  }

  private static validate(value: number): void {
    if (!Number.isFinite(value)) {
      throw new InvalidModerationConfidenceException(
        'Moderation confidence must be a finite number.',
      );
    }

    if (value < ModerationConfidence.MIN || value > ModerationConfidence.MAX) {
      throw new InvalidModerationConfidenceException(
        `Moderation confidence must be between ${ModerationConfidence.MIN} and ${ModerationConfidence.MAX}.`,
      );
    }
  }
}
