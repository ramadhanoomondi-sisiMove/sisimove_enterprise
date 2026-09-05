// -----------------------------------------------------------------------------
// Asset Type
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type AssetTypeValue = 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT' | 'OTHER';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface AssetTypeProps {
  value: AssetTypeValue;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the primary media or content type of an Asset.
 *
 * Valid types:
 *
 * - IMAGE    — Image-based asset such as a JPEG, PNG, or WebP file.
 * - VIDEO    — Video-based asset.
 * - AUDIO    — Audio-based asset.
 * - DOCUMENT — Document-based asset such as a PDF or similar file.
 * - OTHER    — Asset that does not belong to one of the supported primary types.
 *
 * Asset type represents the high-level classification of the stored content.
 * More specific file information, including MIME type, original filename, and
 * file size, is represented independently by the Asset aggregate.
 *
 * File inspection, MIME type detection, and type classification belong to the
 * application or infrastructure layer. This value object represents only the
 * resulting domain classification.
 */
export class AssetType extends ValueObject<AssetTypeProps> {
  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  public static readonly IMAGE = 'IMAGE' as const;

  public static readonly VIDEO = 'VIDEO' as const;

  public static readonly AUDIO = 'AUDIO' as const;

  public static readonly DOCUMENT = 'DOCUMENT' as const;

  public static readonly OTHER = 'OTHER' as const;

  private static readonly VALID_VALUES: ReadonlySet<AssetTypeValue> = new Set([
    AssetType.IMAGE,
    AssetType.VIDEO,
    AssetType.AUDIO,
    AssetType.DOCUMENT,
    AssetType.OTHER,
  ]);

  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: AssetTypeValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates an Asset type value object.
   */
  public static create(value: AssetTypeValue): AssetType {
    AssetType.validate(value);

    return new AssetType(value);
  }

  public static image(): AssetType {
    return new AssetType(AssetType.IMAGE);
  }

  public static video(): AssetType {
    return new AssetType(AssetType.VIDEO);
  }

  public static audio(): AssetType {
    return new AssetType(AssetType.AUDIO);
  }

  public static document(): AssetType {
    return new AssetType(AssetType.DOCUMENT);
  }

  public static other(): AssetType {
    return new AssetType(AssetType.OTHER);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): asserts value is AssetTypeValue {
    if (!AssetType.VALID_VALUES.has(value as AssetTypeValue)) {
      throw new Error(`Invalid Asset type: ${value}`);
    }
  }

  // ---------------------------------------------------------------------------
  // State Checks
  // ---------------------------------------------------------------------------

  public isImage(): boolean {
    return this.props.value === AssetType.IMAGE;
  }

  public isVideo(): boolean {
    return this.props.value === AssetType.VIDEO;
  }

  public isAudio(): boolean {
    return this.props.value === AssetType.AUDIO;
  }

  public isDocument(): boolean {
    return this.props.value === AssetType.DOCUMENT;
  }

  public isOther(): boolean {
    return this.props.value === AssetType.OTHER;
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): AssetTypeValue {
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

export type { AssetTypeProps };
