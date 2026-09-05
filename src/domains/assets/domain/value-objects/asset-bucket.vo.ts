// -----------------------------------------------------------------------------
// Asset Bucket
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface AssetBucketProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the logical storage bucket containing an Asset's physical object.
 *
 * A bucket identifies the logical storage container used by the configured
 * storage provider. It is intentionally represented as an opaque domain value
 * and does not contain provider-specific storage behavior.
 *
 * Examples:
 *
 * - Local storage directory identifier.
 * - AWS S3 bucket name.
 * - Google Cloud Storage bucket name.
 * - Azure Blob container name.
 *
 * Provider-specific validation, configuration, credentials, and connectivity
 * belong to the infrastructure layer.
 */
export class AssetBucket extends ValueObject<AssetBucketProps> {
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
   * Creates an Asset bucket value object.
   */
  public static create(value: string): AssetBucket {
    const normalizedValue = value.trim();

    AssetBucket.validate(normalizedValue);

    return new AssetBucket(normalizedValue);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): void {
    if (!value) {
      throw new Error('Asset bucket cannot be empty');
    }
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

export type { AssetBucketProps };
