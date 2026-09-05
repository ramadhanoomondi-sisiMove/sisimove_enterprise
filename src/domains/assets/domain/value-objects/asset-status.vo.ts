// -----------------------------------------------------------------------------
// Asset Status
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type AssetStatusValue =
  'UPLOADING' | 'UPLOADED' | 'READY' | 'ARCHIVED' | 'DELETED';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface AssetStatusProps {
  value: AssetStatusValue;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the lifecycle status of an Asset.
 *
 * Valid statuses:
 *
 * - UPLOADING — Asset metadata exists and the physical object is being stored.
 * - UPLOADED  — The physical object has been successfully stored.
 * - READY     — The Asset has completed processing and is available for use.
 * - ARCHIVED  — The Asset is no longer active but remains retained.
 * - DELETED   — The Asset has been deleted and is in a terminal state.
 *
 * Lifecycle transitions are controlled by the Asset aggregate. This value
 * object represents only the current lifecycle state.
 */
export class AssetStatus extends ValueObject<AssetStatusProps> {
  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  public static readonly UPLOADING = 'UPLOADING' as const;

  public static readonly UPLOADED = 'UPLOADED' as const;

  public static readonly READY = 'READY' as const;

  public static readonly ARCHIVED = 'ARCHIVED' as const;

  public static readonly DELETED = 'DELETED' as const;

  private static readonly VALID_VALUES: ReadonlySet<AssetStatusValue> = new Set(
    [
      AssetStatus.UPLOADING,
      AssetStatus.UPLOADED,
      AssetStatus.READY,
      AssetStatus.ARCHIVED,
      AssetStatus.DELETED,
    ],
  );

  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: AssetStatusValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates an Asset status value object.
   */
  public static create(value: AssetStatusValue): AssetStatus {
    AssetStatus.validate(value);

    return new AssetStatus(value);
  }

  public static uploading(): AssetStatus {
    return new AssetStatus(AssetStatus.UPLOADING);
  }

  public static uploaded(): AssetStatus {
    return new AssetStatus(AssetStatus.UPLOADED);
  }

  public static ready(): AssetStatus {
    return new AssetStatus(AssetStatus.READY);
  }

  public static archived(): AssetStatus {
    return new AssetStatus(AssetStatus.ARCHIVED);
  }

  public static deleted(): AssetStatus {
    return new AssetStatus(AssetStatus.DELETED);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): asserts value is AssetStatusValue {
    if (!AssetStatus.VALID_VALUES.has(value as AssetStatusValue)) {
      throw new Error(`Invalid Asset status: ${value}`);
    }
  }

  // ---------------------------------------------------------------------------
  // State Checks
  // ---------------------------------------------------------------------------

  public isUploading(): boolean {
    return this.props.value === AssetStatus.UPLOADING;
  }

  public isUploaded(): boolean {
    return this.props.value === AssetStatus.UPLOADED;
  }

  public isReady(): boolean {
    return this.props.value === AssetStatus.READY;
  }

  public isArchived(): boolean {
    return this.props.value === AssetStatus.ARCHIVED;
  }

  public isDeleted(): boolean {
    return this.props.value === AssetStatus.DELETED;
  }

  // ---------------------------------------------------------------------------
  // Lifecycle Checks
  // ---------------------------------------------------------------------------

  /**
   * Indicates whether the Asset is in a terminal lifecycle state.
   */
  public isTerminal(): boolean {
    return this.isDeleted();
  }

  /**
   * Indicates whether the Asset can be actively used by the application.
   */
  public isUsable(): boolean {
    return this.isReady();
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): AssetStatusValue {
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

export type { AssetStatusProps };
