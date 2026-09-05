// -----------------------------------------------------------------------------
// Asset MIME Type
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface AssetMimeTypeProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the MIME type associated with an Asset.
 *
 * The MIME type identifies the media format of the stored content, for example:
 *
 * - image/jpeg
 * - image/png
 * - video/mp4
 * - audio/mpeg
 * - application/pdf
 *
 * MIME type is retained as Asset metadata and is distinct from AssetType.
 * AssetType represents the high-level domain classification, while MIME type
 * represents the specific content format.
 *
 * MIME type detection and verification belong to the application or
 * infrastructure layer. This value object represents only the validated
 * resulting value.
 */
export class AssetMimeType extends ValueObject<AssetMimeTypeProps> {
  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  private static readonly MAX_LENGTH = 255;

  private static readonly MIME_TYPE_PATTERN =
    /^[a-zA-Z0-9!#$&^_.+-]+\/[a-zA-Z0-9!#$&^_.+-]+$/;

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
   * Creates an Asset MIME type value object.
   */
  public static create(value: string): AssetMimeType {
    const normalizedValue = value.trim().toLowerCase();

    AssetMimeType.validate(normalizedValue);

    return new AssetMimeType(normalizedValue);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): void {
    if (!value) {
      throw new Error('Asset MIME type cannot be empty');
    }

    if (value.length > AssetMimeType.MAX_LENGTH) {
      throw new Error(
        `Asset MIME type cannot exceed ${AssetMimeType.MAX_LENGTH} characters`,
      );
    }

    if (!AssetMimeType.MIME_TYPE_PATTERN.test(value)) {
      throw new Error(`Invalid Asset MIME type: ${value}`);
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

export type { AssetMimeTypeProps };
