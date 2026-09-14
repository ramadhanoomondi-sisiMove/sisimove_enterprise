// -----------------------------------------------------------------------------
// sisiMove — Assets
// Local Asset Storage Service
// -----------------------------------------------------------------------------
//
// Infrastructure implementation of AssetStoragePort using the local
// filesystem.
//
// Responsibilities:
//
// - Store Asset content on the local filesystem.
// - Retrieve stored Asset content.
// - Check whether an Asset object exists.
// - Read stored Asset metadata.
// - Delete an Asset object.
//
// This is an infrastructure adapter.
//
// It does NOT:
//
// - Own Asset domain state.
// - Create or modify Asset aggregates.
// - Change Asset lifecycle state.
// - Persist Asset records to Prisma.
// - Generate public URLs.
// - Generate signed URLs.
// - Perform authorization.
// - Apply Asset business rules.
// - Depend on Express.Multer.File.
// - Depend on Prisma.
//
// -----------------------------------------------------------------------------
//
// Storage layout:
//
//   <rootDirectory>/
//       <bucket>/
//           <objectKey>
//
// Example:
//
//   storage/assets/
//       public/
//           journeys/
//               vehicle/
//                   7b2d...jpg
//
// The bucket and object key are supplied by the application layer through
// AssetStorageUpload. This adapter does not invent object identity.
//
// -----------------------------------------------------------------------------
//
// Upload strategy:
//
//   Readable
//      │
//      ▼
//   temporary file
//      │
//      ├── verify physical size
//      │
//      ▼
//   hard-link to final object
//      │
//      ▼
//   remove temporary directory entry
//
// A hard link is deliberately used instead of rename() because rename() can
// replace an existing target on the same filesystem. The hard-link operation
// fails when the target already exists, preventing silent physical overwrite.
//
// -----------------------------------------------------------------------------
//
// Important:
//
// This adapter is suitable for the current sisiMove deployment model where
// Asset storage is local filesystem storage.
//
// When sisiMove moves to Bunny in production, BunnyAssetStorageService can
// implement the same AssetStoragePort without changing the Asset domain or
// application contracts.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Node.js
// -----------------------------------------------------------------------------

import { createReadStream, createWriteStream } from 'node:fs';

import { link, mkdir, stat, unlink } from 'node:fs/promises';

import { randomUUID } from 'node:crypto';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import { pipeline } from 'node:stream/promises';

import type { Readable } from 'node:stream';

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Application Ports
// -----------------------------------------------------------------------------

import type {
  AssetStorageObject,
  AssetStorageObjectContent,
  AssetStoragePort,
  AssetStorageUpload,
} from '../../application/ports/asset-storage.port';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import { AssetMimeType } from '../../domain/value-objects/asset-mime-type.vo';
import { AssetSizeBytes } from '../../domain/value-objects/asset-size-bytes.vo';

import type { AssetStorageProvider } from '../../domain/value-objects/asset-storage-provider.vo';
import type { AssetBucket } from '../../domain/value-objects/asset-bucket.vo';
import type { AssetObjectKey } from '../../domain/value-objects/asset-object-key.vo';

// =============================================================================
// Service
// =============================================================================

@Injectable()
export class LocalAssetStorageService implements AssetStoragePort {
  // ===========================================================================
  // Configuration
  // ===========================================================================

  /**
   * Absolute filesystem root under which all Asset objects are stored.
   *
   * The root is resolved once when the adapter is constructed so all
   * subsequent object operations use the same storage boundary.
   */
  private readonly rootDirectory: string;

  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor() {
    this.rootDirectory = resolve(
      process.env.ASSET_STORAGE_LOCAL_ROOT ?? './storage/assets',
    );
  }

  // ===========================================================================
  // Upload
  // ===========================================================================

  /**
   * Stores a physical Asset object on the local filesystem.
   *
   * The supplied Readable is streamed directly into a temporary file.
   *
   * The temporary file is promoted to the final object only after:
   *
   * - the complete input stream has been consumed;
   * - the physical byte count has been verified;
   * - the final object location has been confirmed as unused.
   *
   * The finalization uses an atomic hard-link operation instead of rename().
   *
   * rename() may replace an existing target on the same filesystem.
   *
   * link() fails when the target already exists, preventing an existing
   * physical Asset object from being silently overwritten.
   */
  public async upload(input: AssetStorageUpload): Promise<AssetStorageObject> {
    this.ensureLocalProvider(input.storageProvider);

    const filePath = this.resolveObjectPath(input.bucket, input.objectKey);

    const directory = dirname(filePath);

    await mkdir(directory, {
      recursive: true,
    });

    const temporaryPath = this.createTemporaryPath(filePath);

    try {
      await this.writeStream(temporaryPath, input.content);

      await this.verifyUploadedSize(
        temporaryPath,
        input.sizeBytes.value,
        input.objectKey.value,
      );

      await this.finalizeUpload(temporaryPath, filePath, input.objectKey.value);

      return {
        storageProvider: input.storageProvider,
        bucket: input.bucket,
        objectKey: input.objectKey,
        mimeType: input.mimeType,
        sizeBytes: input.sizeBytes,
      };
    } catch (error: unknown) {
      /**
       * Cleanup is attempted after every failed upload.
       *
       * removeIfExists() deliberately treats ENOENT as success because the
       * temporary object may already have been removed by writeStream() or
       * finalizeUpload().
       */
      await this.removeIfExists(temporaryPath);

      throw error;
    }
  }

  // ===========================================================================
  // Get
  // ===========================================================================

  /**
   * Retrieves a stored Asset object.
   *
   * The local filesystem does not independently persist the original MIME
   * metadata, therefore MIME type is derived from the physical object key as
   * infrastructure fallback metadata.
   *
   * The authoritative Asset MIME metadata remains the value persisted by the
   * Asset aggregate.
   *
   * A new filesystem read stream is created for every successful call.
   */
  public async get(
    storageProvider: AssetStorageProvider,
    bucket: AssetBucket,
    objectKey: AssetObjectKey,
  ): Promise<AssetStorageObjectContent | null> {
    this.ensureLocalProvider(storageProvider);

    const filePath = this.resolveObjectPath(bucket, objectKey);

    const metadata = await this.readMetadata(filePath);

    if (metadata === null) {
      return null;
    }

    return {
      storageProvider,
      bucket,
      objectKey,
      mimeType: metadata.mimeType,
      sizeBytes: metadata.sizeBytes,
      content: createReadStream(filePath),
    };
  }

  // ===========================================================================
  // Exists
  // ===========================================================================

  /**
   * Determines whether a physical Asset object exists.
   *
   * This is a filesystem-level existence check only.
   *
   * It does not determine whether the Asset domain object exists, is READY,
   * or is publicly visible.
   */
  public async exists(
    storageProvider: AssetStorageProvider,
    bucket: AssetBucket,
    objectKey: AssetObjectKey,
  ): Promise<boolean> {
    this.ensureLocalProvider(storageProvider);

    const filePath = this.resolveObjectPath(bucket, objectKey);

    try {
      const fileStats = await stat(filePath);

      return fileStats.isFile();
    } catch (error: unknown) {
      if (this.isFileNotFoundError(error)) {
        return false;
      }

      throw error;
    }
  }

  // ===========================================================================
  // Head
  // ===========================================================================

  /**
   * Retrieves physical Asset metadata without opening a content stream.
   *
   * This operation is equivalent to a filesystem-level HEAD operation.
   */
  public async head(
    storageProvider: AssetStorageProvider,
    bucket: AssetBucket,
    objectKey: AssetObjectKey,
  ): Promise<AssetStorageObject | null> {
    this.ensureLocalProvider(storageProvider);

    const filePath = this.resolveObjectPath(bucket, objectKey);

    const metadata = await this.readMetadata(filePath);

    if (metadata === null) {
      return null;
    }

    return {
      storageProvider,
      bucket,
      objectKey,
      mimeType: metadata.mimeType,
      sizeBytes: metadata.sizeBytes,
    };
  }

  // ===========================================================================
  // Delete
  // ===========================================================================

  /**
   * Deletes a physical Asset object.
   *
   * Missing objects are treated as already deleted.
   *
   * This operation changes physical storage only. It does not transition the
   * Asset aggregate to DELETED.
   */
  public async delete(
    storageProvider: AssetStorageProvider,
    bucket: AssetBucket,
    objectKey: AssetObjectKey,
  ): Promise<void> {
    this.ensureLocalProvider(storageProvider);

    const filePath = this.resolveObjectPath(bucket, objectKey);

    try {
      await unlink(filePath);
    } catch (error: unknown) {
      if (this.isFileNotFoundError(error)) {
        return;
      }

      throw error;
    }
  }

  // ===========================================================================
  // Private — Provider
  // ===========================================================================

  /**
   * Ensures that this adapter only handles LOCAL storage.
   *
   * Provider selection belongs to infrastructure composition. This adapter
   * nevertheless validates the provider at runtime so an incorrectly wired
   * dependency cannot silently write another provider's Asset into the local
   * filesystem.
   */
  private ensureLocalProvider(storageProvider: AssetStorageProvider): void {
    if (storageProvider.value !== 'LOCAL') {
      throw new Error(
        `LocalAssetStorageService cannot handle storage provider "${storageProvider.value}".`,
      );
    }
  }

  // ===========================================================================
  // Private — Path Resolution
  // ===========================================================================

  /**
   * Resolves a bucket/object key into a filesystem path.
   *
   * Absolute bucket and object-key values are rejected.
   *
   * The final resolved path must remain strictly inside the configured
   * storage root.
   *
   * This prevents values such as:
   *
   *   ../../outside-file
   *
   * from escaping the Asset storage boundary.
   */
  private resolveObjectPath(
    bucket: AssetBucket,
    objectKey: AssetObjectKey,
  ): string {
    const bucketValue = bucket.value;
    const objectKeyValue = objectKey.value;

    if (isAbsolute(bucketValue) || isAbsolute(objectKeyValue)) {
      throw new Error(
        'Asset storage bucket and object key must be relative paths.',
      );
    }

    const storageRoot = resolve(this.rootDirectory);

    const filePath = resolve(storageRoot, bucketValue, objectKeyValue);

    const relativePath = relative(storageRoot, filePath);

    /**
     * An empty relative path means the caller resolved directly to the
     * storage root rather than to an object.
     */
    if (
      relativePath === '' ||
      relativePath === '..' ||
      relativePath.startsWith(`..${sep}`) ||
      isAbsolute(relativePath)
    ) {
      throw new Error(
        'Asset storage object path escapes the configured storage root.',
      );
    }

    return filePath;
  }

  // ===========================================================================
  // Private — Temporary File
  // ===========================================================================

  /**
   * Creates a unique temporary path beside the final object.
   *
   * Keeping the temporary file in the same directory ensures that the final
   * hard-link operation remains on the same filesystem.
   */
  private createTemporaryPath(filePath: string): string {
    return `${filePath}.uploading-${process.pid}-${randomUUID()}`;
  }

  // ===========================================================================
  // Private — Stream
  // ===========================================================================

  /**
   * Streams Asset content directly to a temporary file.
   *
   * The complete Asset is never accumulated in memory.
   *
   * The temporary file uses wx semantics so a temporary-path collision cannot
   * silently replace another file.
   */
  private async writeStream(
    temporaryPath: string,
    content: Readable,
  ): Promise<void> {
    const writable = createWriteStream(temporaryPath, {
      flags: 'wx',
    });

    try {
      await pipeline(content, writable);
    } catch (error: unknown) {
      /**
       * pipeline() already handles stream lifecycle. Destroying the writable
       * here ensures that any remaining filesystem handle is released before
       * cleanup is attempted.
       */
      writable.destroy();

      await this.removeIfExists(temporaryPath);

      throw error;
    }
  }

  // ===========================================================================
  // Private — Size Verification
  // ===========================================================================

  /**
   * Verifies that the physical file size matches the expected Asset size.
   *
   * The expected size originates from the Asset command/application boundary.
   * The physical size is independently measured after the stream has finished.
   *
   * This prevents a partially written or unexpectedly sized object from being
   * finalized as a valid physical Asset.
   */
  private async verifyUploadedSize(
    filePath: string,
    expectedSizeBytes: number,
    objectKey: string,
  ): Promise<void> {
    let fileStats;

    try {
      fileStats = await stat(filePath);
    } catch (error: unknown) {
      if (this.isFileNotFoundError(error)) {
        throw new Error(
          `Uploaded Asset temporary object "${objectKey}" could not be found after writing.`,
        );
      }

      throw error;
    }

    if (!fileStats.isFile()) {
      throw new Error(
        `Uploaded Asset temporary object "${objectKey}" is not a regular file.`,
      );
    }

    if (fileStats.size !== expectedSizeBytes) {
      throw new Error(
        `Uploaded Asset "${objectKey}" has size ${fileStats.size} bytes, expected ${expectedSizeBytes} bytes.`,
      );
    }
  }

  // ===========================================================================
  // Private — Upload Finalization
  // ===========================================================================

  /**
   * Promotes a completed temporary file to its final object key.
   *
   * link() is deliberately used instead of rename().
   *
   * rename() may replace an existing target.
   *
   * link() fails with EEXIST when the final object already exists.
   *
   * Once link() succeeds, the physical Asset has been finalized. Removal of
   * the temporary directory entry is therefore cleanup rather than part of
   * the upload's success condition.
   */
  private async finalizeUpload(
    temporaryPath: string,
    targetPath: string,
    objectKey: string,
  ): Promise<void> {
    try {
      await link(temporaryPath, targetPath);
    } catch (error: unknown) {
      if (this.isAlreadyExistsError(error)) {
        throw new Error(
          `Asset storage object "${objectKey}" already exists and will not be overwritten.`,
        );
      }

      throw error;
    }

    /**
     * The target now exists and is the finalized physical object.
     *
     * Temporary-entry cleanup is intentionally best effort. A failure here
     * must not report the already-finalized upload as unsuccessful.
     */
    await this.removeIfExists(temporaryPath);
  }

  // ===========================================================================
  // Private — Metadata
  // ===========================================================================

  /**
   * Reads physical file metadata.
   *
   * Directories are never considered Asset objects.
   */
  private async readMetadata(filePath: string): Promise<{
    readonly mimeType: AssetMimeType;
    readonly sizeBytes: AssetSizeBytes;
  } | null> {
    let fileStats;

    try {
      fileStats = await stat(filePath);
    } catch (error: unknown) {
      if (this.isFileNotFoundError(error)) {
        return null;
      }

      throw error;
    }

    if (!fileStats.isFile()) {
      return null;
    }

    return {
      mimeType: this.mimeTypeFromPath(filePath),
      sizeBytes: AssetSizeBytes.create(fileStats.size),
    };
  }

  // ===========================================================================
  // Private — MIME Type
  // ===========================================================================

  /**
   * Derives a MIME type from the physical object extension.
   *
   * This is infrastructure fallback metadata only.
   *
   * The authoritative Asset MIME metadata remains the Asset aggregate's
   * persisted mimeType.
   */
  private mimeTypeFromPath(filePath: string): AssetMimeType {
    const extension = filePath.split('.').pop()?.toLowerCase() ?? '';

    const mimeTypes: Record<string, string> = {
      // Images
      avif: 'image/avif',
      gif: 'image/gif',
      jpeg: 'image/jpeg',
      jpg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',

      // Audio
      mp3: 'audio/mpeg',
      wav: 'audio/wav',
      ogg: 'audio/ogg',

      // Video
      mp4: 'video/mp4',
      webm: 'video/webm',
      mov: 'video/quicktime',

      // Documents
      pdf: 'application/pdf',
      json: 'application/json',
      csv: 'text/csv',
      txt: 'text/plain',

      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',

      xls: 'application/vnd.ms-excel',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };

    return AssetMimeType.create(
      mimeTypes[extension] ?? 'application/octet-stream',
    );
  }

  // ===========================================================================
  // Private — Cleanup
  // ===========================================================================

  /**
   * Removes a filesystem object if it exists.
   *
   * Missing objects are intentionally ignored because cleanup is idempotent.
   */
  private async removeIfExists(filePath: string): Promise<void> {
    try {
      await unlink(filePath);
    } catch (error: unknown) {
      if (!this.isFileNotFoundError(error)) {
        throw error;
      }
    }
  }

  // ===========================================================================
  // Private — Errors
  // ===========================================================================

  /**
   * Determines whether an error represents a missing filesystem object.
   */
  private isFileNotFoundError(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code?: unknown }).code === 'ENOENT'
    );
  }

  /**
   * Determines whether an error represents an existing filesystem object.
   */
  private isAlreadyExistsError(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code?: unknown }).code === 'EEXIST'
    );
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default LocalAssetStorageService;
