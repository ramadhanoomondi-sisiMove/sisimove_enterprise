// -----------------------------------------------------------------------------
// Verification Level
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface VerificationLevelProps {
  value: VerificationLevelValue;
}

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

/**
 * Verification levels supported by the Identity domain.
 *
 * NONE
 *   No verification level has been achieved.
 *
 * MEMBER
 *   Identity has completed the verification requirements for a verified
 *   platform member.
 *
 * DRIVER
 *   Identity has completed the verification requirements required to operate
 *   as a verified driver.
 *
 * Verification levels are cumulative in meaning:
 *
 * NONE
 *   -> MEMBER
 *   -> DRIVER
 */
export type VerificationLevelValue = 'NONE' | 'MEMBER' | 'DRIVER';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

export const VERIFICATION_LEVELS: readonly VerificationLevelValue[] = [
  'NONE',
  'MEMBER',
  'DRIVER',
];

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Defines the highest verification level currently achieved by an Identity.
 *
 * The level represents the capability/trust tier established by successful
 * verification. It is distinct from VerificationStatus, which represents
 * the lifecycle state of the verification process itself.
 */
export class VerificationLevel extends ValueObject<VerificationLevelProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: VerificationLevelValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a Verification Level.
   *
   * The supplied value is normalized to uppercase and validated before
   * entering the domain.
   */
  public static create(value: string): VerificationLevel {
    const normalized = value.trim().toUpperCase();

    VerificationLevel.validate(normalized);

    return new VerificationLevel(normalized as VerificationLevelValue);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): void {
    if (!VerificationLevel.isValid(value)) {
      throw new Error(`Invalid Verification level: ${value}`);
    }
  }

  // ---------------------------------------------------------------------------
  // Static Predicates
  // ---------------------------------------------------------------------------

  public static isValid(value: string): value is VerificationLevelValue {
    return VERIFICATION_LEVELS.includes(value as VerificationLevelValue);
  }

  // ---------------------------------------------------------------------------
  // Instance Predicates
  // ---------------------------------------------------------------------------

  public isNone(): boolean {
    return this.props.value === 'NONE';
  }

  public isMember(): boolean {
    return this.props.value === 'MEMBER';
  }

  public isDriver(): boolean {
    return this.props.value === 'DRIVER';
  }

  // ---------------------------------------------------------------------------
  // Level Comparison
  // ---------------------------------------------------------------------------

  /**
   * Returns the numeric rank of the verification level.
   *
   * Higher values represent a higher verification tier.
   */
  public get rank(): number {
    switch (this.props.value) {
      case 'NONE':
        return 0;

      case 'MEMBER':
        return 1;

      case 'DRIVER':
        return 2;
    }
  }

  /**
   * Determines whether this level is at least the supplied level.
   */
  public isAtLeast(level: VerificationLevel): boolean {
    return this.rank >= level.rank;
  }

  /**
   * Determines whether this level is higher than the supplied level.
   */
  public isHigherThan(level: VerificationLevel): boolean {
    return this.rank > level.rank;
  }

  /**
   * Determines whether this level is lower than the supplied level.
   */
  public isLowerThan(level: VerificationLevel): boolean {
    return this.rank < level.rank;
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): VerificationLevelValue {
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

export type { VerificationLevelProps };
