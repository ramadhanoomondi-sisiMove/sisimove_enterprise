import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

import { InvalidModerationReasonException } from '../exceptions';

interface ModerationReasonProps {
  value: string;
}

export class ModerationReason extends ValueObject<ModerationReasonProps> {
  public static readonly MAX_LENGTH = 500;

  constructor(value: string) {
    const normalized = value.trim();

    ModerationReason.validate(normalized);

    super({
      value: normalized,
    });

    Object.freeze(this);
  }

  get value(): string {
    return this.props.value;
  }

  override toString(): string {
    return this.value;
  }

  private static validate(value: string): void {
    if (value.length === 0) {
      throw new InvalidModerationReasonException(
        'The moderation reason cannot be empty.',
      );
    }

    if (value.length > ModerationReason.MAX_LENGTH) {
      throw new InvalidModerationReasonException(
        `The moderation reason cannot exceed ${ModerationReason.MAX_LENGTH} characters.`,
      );
    }
  }
}
