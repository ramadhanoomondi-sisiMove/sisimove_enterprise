// -----------------------------------------------------------------------------
// Support Case Evidence Asset ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface SupportCaseEvidenceAssetIdProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identifier of the Asset attached to Support Case Evidence.
 *
 * The Asset belongs to the Asset capability/domain outside Support.
 *
 * Support stores only the Asset public identity and does not own,
 * generate, or persist the Asset aggregate.
 *
 * This is an opaque cross-domain reference.
 */
export class SupportCaseEvidenceAssetId extends ValueObject<SupportCaseEvidenceAssetIdProps> {
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
   * Creates a Support Case Evidence Asset ID reference.
   */
  public static create(value: string): SupportCaseEvidenceAssetId {
    return new SupportCaseEvidenceAssetId(
      SupportCaseEvidenceAssetId.validate(value),
    );
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): string {
    if (typeof value !== 'string') {
      throw new Error('Support case evidence asset ID must be a string.');
    }

    const normalized = value.trim();

    if (!normalized) {
      throw new Error('Support case evidence asset ID cannot be empty.');
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

export type { SupportCaseEvidenceAssetIdProps };
