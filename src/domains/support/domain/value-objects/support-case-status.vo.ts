// -----------------------------------------------------------------------------
// Support Case Status
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface SupportCaseStatusProps {
  value:
    | 'OPEN'
    | 'IN_PROGRESS'
    | 'WAITING_FOR_MEMBER'
    | 'WAITING_FOR_INTERNAL_ACTION'
    | 'RESOLVED'
    | 'CLOSED'
    | 'CANCELLED';
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the lifecycle status of a Support Case.
 *
 * The status controls the lifecycle of the Support Case aggregate.
 */
export class SupportCaseStatus extends ValueObject<SupportCaseStatusProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: SupportCaseStatusProps['value']) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a Support Case status.
   */
  public static create(value: string): SupportCaseStatus {
    return new SupportCaseStatus(SupportCaseStatus.validate(value));
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): SupportCaseStatusProps['value'] {
    if (typeof value !== 'string') {
      throw new Error('Support case status must be a string.');
    }

    const normalized = value.trim().toUpperCase();

    const allowed: SupportCaseStatusProps['value'][] = [
      'OPEN',
      'IN_PROGRESS',
      'WAITING_FOR_MEMBER',
      'WAITING_FOR_INTERNAL_ACTION',
      'RESOLVED',
      'CLOSED',
      'CANCELLED',
    ];

    if (!allowed.includes(normalized as SupportCaseStatusProps['value'])) {
      throw new Error(`Invalid support case status: ${value}.`);
    }

    return normalized as SupportCaseStatusProps['value'];
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): SupportCaseStatusProps['value'] {
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

export type { SupportCaseStatusProps };
