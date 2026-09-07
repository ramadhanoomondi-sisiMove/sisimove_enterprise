// -----------------------------------------------------------------------------
// Support Case Priority
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface SupportCasePriorityProps {
  value: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the priority assigned to a Support Case.
 *
 * Priority expresses the urgency with which a Support Case should be
 * handled. It does not control the lifecycle status of the case.
 */
export class SupportCasePriority extends ValueObject<SupportCasePriorityProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: SupportCasePriorityProps['value']) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a Support Case priority.
   */
  public static create(value: string): SupportCasePriority {
    return new SupportCasePriority(SupportCasePriority.validate(value));
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): SupportCasePriorityProps['value'] {
    if (typeof value !== 'string') {
      throw new Error('Support case priority must be a string.');
    }

    const normalized = value.trim().toUpperCase();

    const allowed: SupportCasePriorityProps['value'][] = [
      'LOW',
      'NORMAL',
      'HIGH',
      'URGENT',
    ];

    if (!allowed.includes(normalized as SupportCasePriorityProps['value'])) {
      throw new Error(`Invalid support case priority: ${value}.`);
    }

    return normalized as SupportCasePriorityProps['value'];
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): SupportCasePriorityProps['value'] {
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

export type { SupportCasePriorityProps };
