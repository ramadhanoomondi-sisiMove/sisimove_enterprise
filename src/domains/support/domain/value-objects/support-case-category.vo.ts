// -----------------------------------------------------------------------------
// Support Case Category
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface SupportCaseCategoryProps {
  value:
    | 'JOURNEY'
    | 'BOOKING'
    | 'PAYMENT'
    | 'WALLET'
    | 'REFUND'
    | 'TRUST'
    | 'VERIFICATION'
    | 'MESSAGING'
    | 'ACCOUNT'
    | 'SAFETY'
    | 'OTHER';
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the functional category of a Support Case.
 *
 * Category identifies the primary area of the platform to which the
 * Support Case relates.
 */
export class SupportCaseCategory extends ValueObject<SupportCaseCategoryProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: SupportCaseCategoryProps['value']) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a Support Case category.
   */
  public static create(value: string): SupportCaseCategory {
    return new SupportCaseCategory(SupportCaseCategory.validate(value));
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): SupportCaseCategoryProps['value'] {
    if (typeof value !== 'string') {
      throw new Error('Support case category must be a string.');
    }

    const normalized = value.trim().toUpperCase();

    const allowed: SupportCaseCategoryProps['value'][] = [
      'JOURNEY',
      'BOOKING',
      'PAYMENT',
      'WALLET',
      'REFUND',
      'TRUST',
      'VERIFICATION',
      'MESSAGING',
      'ACCOUNT',
      'SAFETY',
      'OTHER',
    ];

    if (!allowed.includes(normalized as SupportCaseCategoryProps['value'])) {
      throw new Error(`Invalid support case category: ${value}.`);
    }

    return normalized as SupportCaseCategoryProps['value'];
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): SupportCaseCategoryProps['value'] {
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

export type { SupportCaseCategoryProps };
