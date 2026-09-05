// -----------------------------------------------------------------------------
// Asset Object Key
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface AssetObjectKeyProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the unique object key used to locate an Asset within its storage
 * bucket.
 *
 * The object key identifies the physical object managed by the configured
 * storage provider. It is intentionally independent of the provider's SDK,
 * URL format, or access mechanism.
 *
 * Examples:
 *
 * - assets/AS-ABC12345/profile/photo.jpg
 * - assets/AS-ABC12345/document.pdf
 * - identities/ID-ABC12345/assets/AS-ABC12345/file.png
 *
 * The object key is not the Asset's public identifier. The AssetPublicId
 * identifies the Asset aggregate, while the object key identifies its physical
 * representation in storage.
 *
 * Storage-provider-specific rules and object existence checks belong to the
 * infrastructure layer.
 */
export class AssetObjectKey extends ValueObject<AssetObjectKeyProps> {
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
   * Creates an Asset object key value object.
   */
  public static create(value: string): AssetObjectKey {
    const normalizedValue = value.trim();

    AssetObjectKey.validate(normalizedValue);

    return new AssetObjectKey(normalizedValue);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): void {
    if (!value) {
      throw new Error('Asset object key cannot be empty');
    }

    if (value.startsWith('/')) {
      throw new Error('Asset object key cannot start with "/"');
    }

    if (value.endsWith('/')) {
      throw new Error('Asset object key cannot end with "/"');
    }

    if (value.includes('\\')) {
      throw new Error('Asset object key cannot contain backslashes');
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

export type { AssetObjectKeyProps };
