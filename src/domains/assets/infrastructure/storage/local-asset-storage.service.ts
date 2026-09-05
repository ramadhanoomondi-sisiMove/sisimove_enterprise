// -----------------------------------------------------------------------------
// Assets — Local Asset Storage Service
// -----------------------------------------------------------------------------
//
// Local filesystem implementation of AssetStoragePort.
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

// -----------------------------------------------------------------------------
// Node — Filesystem
// -----------------------------------------------------------------------------

import { access, mkdir, stat, unlink, writeFile } from 'node:fs/promises';

import { constants } from 'node:fs';

import { createReadStream } from 'node:fs';

import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';

import type { Readable } from 'node:stream';

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Application Port
// -----------------------------------------------------------------------------

import type {
  AssetStorageObject,
  AssetStorageObjectContent,
  AssetStoragePort,
  AssetStorageUpload,
} from '../../application/ports/asset-storage.port';

// -----------------------------------------------------------------------------
// Value Objects
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
   * Stores an Asset object on the local filesystem.
   *
   * The content stream is consumed once.
   *
   * A temporary file is written first so that a failed upload does not leave
   * an incomplete object at the requested object key.
   */
  public async upload(input: AssetStorageUpload): Promise<AssetStorageObject> {
    this.ensureLocalProvider(input.storageProvider);

    const filePath = this.resolveObjectPath(input.bucket, input.objectKey);

    await mkdir(dirname(filePath), {
      recursive: true,
    });

    await this.writeStream(filePath, input.content);

    return {
      storageProvider: input.storageProvider,
      bucket: input.bucket,
      objectKey: input.objectKey,
      mimeType: input.mimeType,
      sizeBytes: input.sizeBytes,
    };
  }

  // ===========================================================================
  // Get
  // ===========================================================================

  /**
   * Retrieves a stored Asset object.
   *
   * The local filesystem does not independently persist the original MIME
   * type, therefore MIME type is derived from the object key.
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
   */
  public async exists(
    storageProvider: AssetStorageProvider,
    bucket: AssetBucket,
    objectKey: AssetObjectKey,
  ): Promise<boolean> {
    this.ensureLocalProvider(storageProvider);

    const filePath = this.resolveObjectPath(bucket, objectKey);

    try {
      await access(filePath, constants.F_OK);

      return true;
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
   * Resolves an Asset bucket/object key into a filesystem path.
   *
   * Absolute paths and path traversal outside the configured storage root
   * are rejected.
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
  // Private — Stream
  // ===========================================================================

  /**
   * Consumes a Node Readable and writes the complete content to disk.
   */
  private async writeStream(
    filePath: string,
    content: Readable,
  ): Promise<void> {
    const temporaryPath = `${filePath}.uploading-${process.pid}-${Date.now()}`;

    try {
      const chunks: Uint8Array[] = [];

      for await (const chunk of content) {
        if (typeof chunk === 'string') {
          chunks.push(new TextEncoder().encode(chunk));
          continue;
        }

        if (chunk instanceof Uint8Array) {
          chunks.push(chunk);
          continue;
        }

        throw new Error(
          'Asset storage stream produced an unsupported chunk type.',
        );
      }

      const totalLength = chunks.reduce(
        (total, chunk) => total + chunk.byteLength,
        0,
      );

      const buffer = new Uint8Array(totalLength);

      let offset = 0;

      for (const chunk of chunks) {
        buffer.set(chunk, offset);
        offset += chunk.byteLength;
      }

      await writeFile(temporaryPath, buffer);

      await this.replaceFile(temporaryPath, filePath);
    } catch (error: unknown) {
      await this.removeIfExists(temporaryPath);

      throw error;
    }
  }

  // ===========================================================================
  // Private — File Replacement
  // ===========================================================================

  /**
   * Atomically replaces the target with the completed temporary file.
   */
  private async replaceFile(
    temporaryPath: string,
    targetPath: string,
  ): Promise<void> {
    const { rename } = await import('node:fs/promises');

    await rename(temporaryPath, targetPath);
  }

  // ===========================================================================
  // Private — Metadata
  // ===========================================================================

  /**
   * Reads physical file metadata.
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
   * Derives a MIME type from the object extension.
   *
   * This is only an infrastructure fallback. The authoritative Asset MIME
   * metadata remains the Asset aggregate's persisted mimeType.
   */
  private mimeTypeFromPath(filePath: string): AssetMimeType {
    const extension = filePath.split('.').pop()?.toLowerCase() ?? '';

    const mimeTypes: Record<string, string> = {
      avif: 'image/avif',
      gif: 'image/gif',
      jpeg: 'image/jpeg',
      jpg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',

      mp3: 'audio/mpeg',
      wav: 'audio/wav',
      ogg: 'audio/ogg',

      mp4: 'video/mp4',
      webm: 'video/webm',
      mov: 'video/quicktime',

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
   * Removes a temporary file if it exists.
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
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default LocalAssetStorageService;
