// -----------------------------------------------------------------------------
// Recovery Type
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type RecoveryTypeValue = 'PASSWORD_RESET' | 'ACCOUNT_RECOVERY';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface RecoveryTypeProps {
  value: RecoveryTypeValue;
}

// =============================================================================
// Value Object
// =============================================================================

/**
 * Represents the type of Recovery workflow.
 *
 * Valid values:
 *
 * - PASSWORD_RESET
 * - ACCOUNT_RECOVERY
 *
 * This value object owns the domain representation and validation of the
 * Recovery type.
 */
export class RecoveryType extends ValueObject<RecoveryTypeProps> {
  // ===========================================================================
  // Constants
  // ===========================================================================

  public static readonly PASSWORD_RESET = 'PASSWORD_RESET' as const;

  public static readonly ACCOUNT_RECOVERY = 'ACCOUNT_RECOVERY' as const;

  private static readonly VALID_VALUES: ReadonlySet<RecoveryTypeValue> =
    new Set<RecoveryTypeValue>([
      RecoveryType.PASSWORD_RESET,
      RecoveryType.ACCOUNT_RECOVERY,
    ]);

  // ===========================================================================
  // Constructor
  // ===========================================================================

  private constructor(value: RecoveryTypeValue) {
    super({ value });
  }

  // ===========================================================================
  // Factory
  // ===========================================================================

  /**
   * Creates a RecoveryType from a validated domain value.
   */
  public static create(value: RecoveryTypeValue): RecoveryType {
    RecoveryType.validate(value);

    return new RecoveryType(value);
  }

  // ===========================================================================
  // Type Guard
  // ===========================================================================

  /**
   * Determines whether an arbitrary value is a valid RecoveryTypeValue.
   *
   * This is useful when converting transport primitives into domain values.
   */
  public static isValid(value: string): value is RecoveryTypeValue {
    return RecoveryType.VALID_VALUES.has(value as RecoveryTypeValue);
  }

  // ===========================================================================
  // Factories
  // ===========================================================================

  /**
   * Creates a PASSWORD_RESET RecoveryType.
   */
  public static passwordReset(): RecoveryType {
    return new RecoveryType(RecoveryType.PASSWORD_RESET);
  }

  /**
   * Creates an ACCOUNT_RECOVERY RecoveryType.
   */
  public static accountRecovery(): RecoveryType {
    return new RecoveryType(RecoveryType.ACCOUNT_RECOVERY);
  }

  // ===========================================================================
  // Validation
  // ===========================================================================

  private static validate(value: RecoveryTypeValue): void {
    if (!RecoveryType.VALID_VALUES.has(value)) {
      throw new Error('Invalid Recovery type.');
    }
  }

  // ===========================================================================
  // State Checks
  // ===========================================================================

  public isPasswordReset(): boolean {
    return this.props.value === RecoveryType.PASSWORD_RESET;
  }

  public isAccountRecovery(): boolean {
    return this.props.value === RecoveryType.ACCOUNT_RECOVERY;
  }

  // ===========================================================================
  // Accessor
  // ===========================================================================

  public get value(): RecoveryTypeValue {
    return this.props.value;
  }

  // ===========================================================================
  // Serialization
  // ===========================================================================

  public override toString(): string {
    return this.props.value;
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { RecoveryTypeProps };
