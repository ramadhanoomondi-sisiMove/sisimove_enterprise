// -----------------------------------------------------------------------------
// Notification Member Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface NotificationMemberPublicIdProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identifier of an Identity member referenced by the
 * Notification domain.
 *
 * The Identity belongs to the Identity domain.
 *
 * Notification stores only the member's public identity and does not
 * own, generate, or persist the Identity aggregate.
 *
 * This is an opaque cross-domain reference.
 */
export class NotificationMemberPublicId extends ValueObject<NotificationMemberPublicIdProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: string) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a Notification member public ID reference.
   */
  public static create(value: string): NotificationMemberPublicId {
    return new NotificationMemberPublicId(
      NotificationMemberPublicId.validate(value),
    );
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): string {
    if (typeof value !== 'string') {
      throw new Error('Notification member public ID must be a string.');
    }

    const normalized = value.trim();

    if (!normalized) {
      throw new Error('Notification member public ID cannot be empty.');
    }

    return normalized;
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): string {
    return this.props.value;
  }

  // ---------------------------------------------------------------------------
  // Serialization
  // ---------------------------------------------------------------------------

  public override toString(): string {
    return this.props.value;
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { NotificationMemberPublicIdProps };
