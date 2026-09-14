// -----------------------------------------------------------------------------
// Asset Storage Provider
// -----------------------------------------------------------------------------
//
// Domain value object identifying the infrastructure provider responsible for
// storing an Asset's physical object.
//
// The domain knows the provider identity only.
//
// It does NOT know:
// - credentials;
// - connection configuration;
// - SDKs;
// - filesystem paths;
// - HTTP endpoints;
// - buckets or containers;
// - CDN URLs;
// - signed URLs;
// - provider-specific APIs.
//
// Those concerns belong to the infrastructure layer.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

/**
 * Supported Asset storage providers.
 *
 * LOCAL
 *   Local filesystem storage, primarily useful for development or
 *   self-hosted deployments.
 *
 * BUNNY
 *   Bunny Storage.
 *
 * AWS_S3
 *   Amazon S3.
 *
 * GOOGLE_CLOUD_STORAGE
 *   Google Cloud Storage.
 *
 * AZURE_BLOB
 *   Microsoft Azure Blob Storage.
 *
 * CLOUDINARY
 *   Cloudinary storage.
 *
 * OTHER
 *   A provider that is intentionally not modeled by the domain.
 *
 * The provider identifier is deliberately infrastructure-neutral. Provider
 * connection details and implementation-specific configuration remain outside
 * the domain.
 */
export type AssetStorageProviderValue =
  | 'LOCAL'
  | 'BUNNY'
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
 * Represents the storage provider responsible for an Asset's physical object.
 *
 * This value object identifies WHAT provider is responsible for storage.
 *
 * It does not describe HOW that provider is accessed.
 */
export class AssetStorageProvider extends ValueObject<AssetStorageProviderProps> {
  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  public static readonly LOCAL = 'LOCAL' as const;

  public static readonly BUNNY = 'BUNNY' as const;

  public static readonly AWS_S3 = 'AWS_S3' as const;

  public static readonly GOOGLE_CLOUD_STORAGE = 'GOOGLE_CLOUD_STORAGE' as const;

  public static readonly AZURE_BLOB = 'AZURE_BLOB' as const;

  public static readonly CLOUDINARY = 'CLOUDINARY' as const;

  public static readonly OTHER = 'OTHER' as const;

  private static readonly VALID_VALUES: ReadonlySet<AssetStorageProviderValue> =
    new Set([
      AssetStorageProvider.LOCAL,
      AssetStorageProvider.BUNNY,
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

  public static bunny(): AssetStorageProvider {
    return new AssetStorageProvider(AssetStorageProvider.BUNNY);
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

  public isBunny(): boolean {
    return this.props.value === AssetStorageProvider.BUNNY;
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
