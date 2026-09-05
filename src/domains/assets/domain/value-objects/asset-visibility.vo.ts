// -----------------------------------------------------------------------------
// Asset Visibility
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type AssetVisibilityValue = 'PUBLIC' | 'PRIVATE';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface AssetVisibilityProps {
  value: AssetVisibilityValue;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the visibility of an Asset.
 *
 * Valid visibility values:
 *
 * - PUBLIC  — The Asset may be exposed to consumers according to the
 *             authorization rules of the application.
 * - PRIVATE — The Asset is restricted and must not be publicly exposed.
 *
 * Visibility is an Asset domain property. Authorization, access control, and
 * the mechanism used to expose or retrieve the physical object belong to the
 * application and infrastructure layers.
 */
export class AssetVisibility extends ValueObject<AssetVisibilityProps> {
  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  public static readonly PUBLIC = 'PUBLIC' as const;

  public static readonly PRIVATE = 'PRIVATE' as const;

  private static readonly VALID_VALUES: ReadonlySet<AssetVisibilityValue> =
    new Set([AssetVisibility.PUBLIC, AssetVisibility.PRIVATE]);

  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: AssetVisibilityValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates an Asset visibility value object.
   */
  public static create(value: AssetVisibilityValue): AssetVisibility {
    AssetVisibility.validate(value);

    return new AssetVisibility(value);
  }

  public static public(): AssetVisibility {
    return new AssetVisibility(AssetVisibility.PUBLIC);
  }

  public static private(): AssetVisibility {
    return new AssetVisibility(AssetVisibility.PRIVATE);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(
    value: string,
  ): asserts value is AssetVisibilityValue {
    if (!AssetVisibility.VALID_VALUES.has(value as AssetVisibilityValue)) {
      throw new Error(`Invalid Asset visibility: ${value}`);
    }
  }

  // ---------------------------------------------------------------------------
  // State Checks
  // ---------------------------------------------------------------------------

  public isPublic(): boolean {
    return this.props.value === AssetVisibility.PUBLIC;
  }

  public isPrivate(): boolean {
    return this.props.value === AssetVisibility.PRIVATE;
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): AssetVisibilityValue {
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

export type { AssetVisibilityProps };
