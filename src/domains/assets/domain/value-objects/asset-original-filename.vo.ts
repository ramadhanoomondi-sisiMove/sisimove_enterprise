// -----------------------------------------------------------------------------
// Asset Original Filename
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface AssetOriginalFilenameProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the original filename supplied for an Asset.
 *
 * The original filename is retained as metadata for display, auditing, and
 * application-level reference. It does not identify the physical object in
 * storage and must not be used as the storage object key.
 *
 * The filename may contain a file extension and Unicode characters.
 *
 * Storage-safe object naming, collision prevention, sanitization for physical
 * storage, and path handling belong to the application or infrastructure
 * layer. This value object preserves the normalized original filename only.
 */
export class AssetOriginalFilename extends ValueObject<AssetOriginalFilenameProps> {
  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  private static readonly MAX_LENGTH = 255;

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
   * Creates an Asset original filename value object.
   */
  public static create(value: string): AssetOriginalFilename {
    const normalizedValue = value.trim();

    AssetOriginalFilename.validate(normalizedValue);

    return new AssetOriginalFilename(normalizedValue);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): void {
    if (!value) {
      throw new Error('Asset original filename cannot be empty');
    }

    if (value.length > AssetOriginalFilename.MAX_LENGTH) {
      throw new Error(
        `Asset original filename cannot exceed ${AssetOriginalFilename.MAX_LENGTH} characters`,
      );
    }

    if (value.includes('/') || value.includes('\\')) {
      throw new Error('Asset original filename cannot contain path separators');
    }

    if (value === '.' || value === '..') {
      throw new Error('Asset original filename is invalid');
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

export type { AssetOriginalFilenameProps };
