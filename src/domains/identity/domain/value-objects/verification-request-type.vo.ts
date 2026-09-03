// -----------------------------------------------------------------------------
// Verification Request Type
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface VerificationRequestTypeProps {
  value: VerificationRequestTypeValue;
}

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

/**
 * Types of verification requests supported by the Identity domain.
 *
 * PROFILE_PHOTO
 *   Verification of the identity's profile photo.
 *
 * GOVERNMENT_ID
 *   Verification using an approved government-issued identity document.
 *
 * DRIVER_LICENSE
 *   Verification using a valid driver's license.
 */
export type VerificationRequestTypeValue =
  'PROFILE_PHOTO' | 'GOVERNMENT_ID' | 'DRIVER_LICENSE';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

export const VERIFICATION_REQUEST_TYPES: readonly VerificationRequestTypeValue[] =
  ['PROFILE_PHOTO', 'GOVERNMENT_ID', 'DRIVER_LICENSE'];

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Defines the type of verification requested for an Identity.
 *
 * The request type identifies the specific evidence or attribute that must
 * be reviewed as part of the verification process.
 */
export class VerificationRequestType extends ValueObject<VerificationRequestTypeProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: VerificationRequestTypeValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a Verification Request Type.
   *
   * The supplied value is normalized to uppercase and validated before
   * entering the domain.
   */
  public static create(value: string): VerificationRequestType {
    const normalized = value.trim().toUpperCase();

    VerificationRequestType.validate(normalized);

    return new VerificationRequestType(
      normalized as VerificationRequestTypeValue,
    );
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): void {
    if (!VerificationRequestType.isValid(value)) {
      throw new Error(`Invalid Verification Request type: ${value}`);
    }
  }

  // ---------------------------------------------------------------------------
  // Static Predicates
  // ---------------------------------------------------------------------------

  public static isValid(value: string): value is VerificationRequestTypeValue {
    return VERIFICATION_REQUEST_TYPES.includes(
      value as VerificationRequestTypeValue,
    );
  }

  // ---------------------------------------------------------------------------
  // Instance Predicates
  // ---------------------------------------------------------------------------

  public isProfilePhoto(): boolean {
    return this.props.value === 'PROFILE_PHOTO';
  }

  public isGovernmentId(): boolean {
    return this.props.value === 'GOVERNMENT_ID';
  }

  public isDriverLicense(): boolean {
    return this.props.value === 'DRIVER_LICENSE';
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): VerificationRequestTypeValue {
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

export type { VerificationRequestTypeProps };
