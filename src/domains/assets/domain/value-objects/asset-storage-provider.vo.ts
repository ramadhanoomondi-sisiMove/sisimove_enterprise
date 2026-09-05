// -----------------------------------------------------------------------------
// Asset Storage Provider
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type AssetStorageProviderValue =
  | 'LOCAL'
  | 'AWS_S3'
  | 'GOOGLE_CLOUD_STORAGE'
  | 'AZURE_BLOB'
  | 'CLOUDINARY'
  | 'OTHER';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface AssetStorageProviderProps {
  value: AssetStorageProviderValue;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the infrastructure provider responsible for storing an Asset's
 * physical object.
 *
 * Valid providers:
 *
 * - LOCAL                 — Local filesystem storage.
 * - AWS_S3                — Amazon Simple Storage Service.
 * - GOOGLE_CLOUD_STORAGE  — Google Cloud Storage.
 * - AZURE_BLOB            — Microsoft Azure Blob Storage.
 * - CLOUDINARY            — Cloudinary asset storage and delivery.
 * - OTHER                 — Another storage provider not explicitly modeled.
 *
 * The value object identifies the selected storage provider only. Connection
 * details, credentials, SDKs, filesystem paths, buckets, and provider-specific
 * APIs belong to the infrastructure layer.
 */
export class AssetStorageProvider extends ValueObject<AssetStorageProviderProps> {
  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  public static readonly LOCAL = 'LOCAL' as const;

  public static readonly AWS_S3 = 'AWS_S3' as const;

  public static readonly GOOGLE_CLOUD_STORAGE = 'GOOGLE_CLOUD_STORAGE' as const;

  public static readonly AZURE_BLOB = 'AZURE_BLOB' as const;

  public static readonly CLOUDINARY = 'CLOUDINARY' as const;

  public static readonly OTHER = 'OTHER' as const;

  private static readonly VALID_VALUES: ReadonlySet<AssetStorageProviderValue> =
    new Set([
      AssetStorageProvider.LOCAL,
      AssetStorageProvider.AWS_S3,
      AssetStorageProvider.GOOGLE_CLOUD_STORAGE,
      AssetStorageProvider.AZURE_BLOB,
      AssetStorageProvider.CLOUDINARY,
      AssetStorageProvider.OTHER,
    ]);

  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: AssetStorageProviderValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates an Asset storage provider value object.
   */
  public static create(value: AssetStorageProviderValue): AssetStorageProvider {
    AssetStorageProvider.validate(value);

    return new AssetStorageProvider(value);
  }

  public static local(): AssetStorageProvider {
    return new AssetStorageProvider(AssetStorageProvider.LOCAL);
  }

  public static awsS3(): AssetStorageProvider {
    return new AssetStorageProvider(AssetStorageProvider.AWS_S3);
  }

  public static googleCloudStorage(): AssetStorageProvider {
    return new AssetStorageProvider(AssetStorageProvider.GOOGLE_CLOUD_STORAGE);
  }

  public static azureBlob(): AssetStorageProvider {
    return new AssetStorageProvider(AssetStorageProvider.AZURE_BLOB);
  }

  public static cloudinary(): AssetStorageProvider {
    return new AssetStorageProvider(AssetStorageProvider.CLOUDINARY);
  }

  public static other(): AssetStorageProvider {
    return new AssetStorageProvider(AssetStorageProvider.OTHER);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(
    value: string,
  ): asserts value is AssetStorageProviderValue {
    if (
      !AssetStorageProvider.VALID_VALUES.has(value as AssetStorageProviderValue)
    ) {
      throw new Error(`Invalid Asset storage provider: ${value}`);
    }
  }

  // ---------------------------------------------------------------------------
  // State Checks
  // ---------------------------------------------------------------------------

  public isLocal(): boolean {
    return this.props.value === AssetStorageProvider.LOCAL;
  }

  public isAwsS3(): boolean {
    return this.props.value === AssetStorageProvider.AWS_S3;
  }

  public isGoogleCloudStorage(): boolean {
    return this.props.value === AssetStorageProvider.GOOGLE_CLOUD_STORAGE;
  }

  public isAzureBlob(): boolean {
    return this.props.value === AssetStorageProvider.AZURE_BLOB;
  }

  public isCloudinary(): boolean {
    return this.props.value === AssetStorageProvider.CLOUDINARY;
  }

  public isOther(): boolean {
    return this.props.value === AssetStorageProvider.OTHER;
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): AssetStorageProviderValue {
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

export type { AssetStorageProviderProps };
