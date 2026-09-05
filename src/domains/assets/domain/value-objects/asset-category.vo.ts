// -----------------------------------------------------------------------------
// Asset Category
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type AssetCategoryValue =
  | 'PROFILE_PHOTO'
  | 'COVER_PHOTO'
  | 'AVATAR'
  | 'GOVERNMENT_ID'
  | 'DRIVER_LICENSE'
  | 'PASSPORT'
  | 'SELFIE'
  | 'VEHICLE_PHOTO'
  | 'CHAT_ATTACHMENT'
  | 'OTHER';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface AssetCategoryProps {
  value: AssetCategoryValue;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the functional category of an Asset.
 *
 * Asset category describes the intended business use or classification of an
 * Asset. It is independent from AssetType, which describes the physical or
 * media type of the stored content.
 *
 * Valid categories:
 *
 * - PROFILE_PHOTO   — Primary profile photograph associated with an Identity.
 * - COVER_PHOTO     — Cover or banner image associated with a profile.
 * - AVATAR          — Avatar or visual representation used by an Identity.
 *
 * - GOVERNMENT_ID   — Government-issued identity document.
 * - DRIVER_LICENSE  — Driver's license used for verification.
 * - PASSPORT        — Passport document used for verification.
 * - SELFIE          — Selfie image used for identity verification.
 *
 * - VEHICLE_PHOTO   — Photograph associated with a vehicle.
 * - CHAT_ATTACHMENT — File attached to a chat or message.
 * - OTHER           — Asset that does not belong to a supported category.
 *
 * The Asset domain owns the classification of the Asset, while the domain that
 * references the Asset remains responsible for determining which category is
 * appropriate for its business operation.
 */
export class AssetCategory extends ValueObject<AssetCategoryProps> {
  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  public static readonly PROFILE_PHOTO = 'PROFILE_PHOTO' as const;

  public static readonly COVER_PHOTO = 'COVER_PHOTO' as const;

  public static readonly AVATAR = 'AVATAR' as const;

  public static readonly GOVERNMENT_ID = 'GOVERNMENT_ID' as const;

  public static readonly DRIVER_LICENSE = 'DRIVER_LICENSE' as const;

  public static readonly PASSPORT = 'PASSPORT' as const;

  public static readonly SELFIE = 'SELFIE' as const;

  public static readonly VEHICLE_PHOTO = 'VEHICLE_PHOTO' as const;

  public static readonly CHAT_ATTACHMENT = 'CHAT_ATTACHMENT' as const;

  public static readonly OTHER = 'OTHER' as const;

  private static readonly VALID_VALUES: ReadonlySet<AssetCategoryValue> =
    new Set([
      AssetCategory.PROFILE_PHOTO,
      AssetCategory.COVER_PHOTO,
      AssetCategory.AVATAR,
      AssetCategory.GOVERNMENT_ID,
      AssetCategory.DRIVER_LICENSE,
      AssetCategory.PASSPORT,
      AssetCategory.SELFIE,
      AssetCategory.VEHICLE_PHOTO,
      AssetCategory.CHAT_ATTACHMENT,
      AssetCategory.OTHER,
    ]);

  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: AssetCategoryValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates an Asset category value object.
   */
  public static create(value: AssetCategoryValue): AssetCategory {
    AssetCategory.validate(value);

    return new AssetCategory(value);
  }

  public static profilePhoto(): AssetCategory {
    return new AssetCategory(AssetCategory.PROFILE_PHOTO);
  }

  public static coverPhoto(): AssetCategory {
    return new AssetCategory(AssetCategory.COVER_PHOTO);
  }

  public static avatar(): AssetCategory {
    return new AssetCategory(AssetCategory.AVATAR);
  }

  public static governmentId(): AssetCategory {
    return new AssetCategory(AssetCategory.GOVERNMENT_ID);
  }

  public static driverLicense(): AssetCategory {
    return new AssetCategory(AssetCategory.DRIVER_LICENSE);
  }

  public static passport(): AssetCategory {
    return new AssetCategory(AssetCategory.PASSPORT);
  }

  public static selfie(): AssetCategory {
    return new AssetCategory(AssetCategory.SELFIE);
  }

  public static vehiclePhoto(): AssetCategory {
    return new AssetCategory(AssetCategory.VEHICLE_PHOTO);
  }

  public static chatAttachment(): AssetCategory {
    return new AssetCategory(AssetCategory.CHAT_ATTACHMENT);
  }

  public static other(): AssetCategory {
    return new AssetCategory(AssetCategory.OTHER);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): asserts value is AssetCategoryValue {
    if (!AssetCategory.VALID_VALUES.has(value as AssetCategoryValue)) {
      throw new Error(`Invalid Asset category: ${value}`);
    }
  }

  // ---------------------------------------------------------------------------
  // State Checks
  // ---------------------------------------------------------------------------

  public isProfilePhoto(): boolean {
    return this.props.value === AssetCategory.PROFILE_PHOTO;
  }

  public isCoverPhoto(): boolean {
    return this.props.value === AssetCategory.COVER_PHOTO;
  }

  public isAvatar(): boolean {
    return this.props.value === AssetCategory.AVATAR;
  }

  public isGovernmentId(): boolean {
    return this.props.value === AssetCategory.GOVERNMENT_ID;
  }

  public isDriverLicense(): boolean {
    return this.props.value === AssetCategory.DRIVER_LICENSE;
  }

  public isPassport(): boolean {
    return this.props.value === AssetCategory.PASSPORT;
  }

  public isSelfie(): boolean {
    return this.props.value === AssetCategory.SELFIE;
  }

  public isVehiclePhoto(): boolean {
    return this.props.value === AssetCategory.VEHICLE_PHOTO;
  }

  public isChatAttachment(): boolean {
    return this.props.value === AssetCategory.CHAT_ATTACHMENT;
  }

  public isOther(): boolean {
    return this.props.value === AssetCategory.OTHER;
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): AssetCategoryValue {
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

export type { AssetCategoryProps };
