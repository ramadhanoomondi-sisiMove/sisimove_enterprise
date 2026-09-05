// -----------------------------------------------------------------------------
// Asset Size in Bytes
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface AssetSizeBytesProps {
  value: number;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the size of an Asset in bytes.
 *
 * The value must be a finite, non-negative integer.
 *
 * Asset size is stored as metadata and is used for validation, storage
 * accounting, upload limits, and response information.
 *
 * The actual file and its storage are managed by the AssetStoragePort and
 * infrastructure implementations. This value object contains no storage
 * behavior.
 */
export class AssetSizeBytes extends ValueObject<AssetSizeBytesProps> {
  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  public static readonly ZERO = 0;

  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: number) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates an Asset size value object.
   */
  public static create(value: number): AssetSizeBytes {
    AssetSizeBytes.validate(value);

    return new AssetSizeBytes(value);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: number): void {
    if (!Number.isFinite(value)) {
      throw new Error('Asset size must be a finite number');
    }

    if (!Number.isInteger(value)) {
      throw new Error('Asset size must be an integer');
    }

    if (value < AssetSizeBytes.ZERO) {
      throw new Error('Asset size cannot be negative');
    }
  }

  // ---------------------------------------------------------------------------
  // State Checks
  // ---------------------------------------------------------------------------

  public isEmpty(): boolean {
    return this.props.value === AssetSizeBytes.ZERO;
  }

  public isGreaterThanZero(): boolean {
    return this.props.value > AssetSizeBytes.ZERO;
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): number {
    return this.props.value;
  }

  // ---------------------------------------------------------------------------
  // Serialization
  // ---------------------------------------------------------------------------

  public override toString(): string {
    return this.props.value.toString();
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { AssetSizeBytesProps };
