// -----------------------------------------------------------------------------
// sisiMove — Assets
// Bunny Storage Service
// -----------------------------------------------------------------------------
//
// Infrastructure adapter for Bunny Storage.
//
// Responsibilities:
//
// - upload Asset content to Bunny Storage;
// - retrieve Asset content from Bunny Storage;
// - check physical object existence;
// - inspect physical object metadata;
// - delete physical objects from Bunny Storage.
//
// Architecture:
//
// Application
//     ↓
// AssetStoragePort
//     ↓
// BunnyAssetStorageService
//     ↓
// Bunny Storage
//
// This adapter operates on physical storage only.
//
// It does NOT:
//
// - own Asset domain state;
// - create or modify Asset aggregates;
// - change Asset lifecycle state;
// - persist Asset records to Prisma;
// - generate public CDN URLs;
// - generate signed URLs;
// - authorize callers;
// - apply Asset business rules;
// - depend on Express.Multer.File;
// - expose Bunny credentials;
// - decide whether an Asset is publicly visible.
//
// Public delivery is intentionally a separate capability from physical
// storage. The Bunny Storage API endpoint used here is an authenticated
// infrastructure endpoint and must not be confused with a browser-facing
// CDN URL.
//
// -----------------------------------------------------------------------------
//
// Important upload semantics:
//
// Bunny Storage accepts PUT for object upload. A generic PUT can replace an
// existing object.
//
// This adapter therefore performs a HEAD preflight before uploading and
// rejects an object-key collision.
//
// This protects the normal upload path from accidental overwrites.
//
// The preflight cannot provide a mathematical create-only guarantee against a
// concurrent HEAD + PUT race unless Bunny exposes a provider-specific
// conditional-create primitive.
//
// SisiMove should therefore generate unique object keys, normally using
// UUID-based addressing.
//
// -----------------------------------------------------------------------------
//
// Provider contract:
//
// This adapter requires AssetStorageProvider to explicitly support:
//
//     LOCAL
//     BUNNY
//
// BUNNY must therefore exist in the AssetStorageProvider value-object contract.
// The adapter intentionally does not use casts or string comparisons against
// an unsupported provider value.
//
// -----------------------------------------------------------------------------

import { Injectable } from '@nestjs/common';

import * as http from 'node:http';
import * as https from 'node:https';

import { Readable } from 'node:stream';

import type {
  AssetStorageObject,
  AssetStorageObjectContent,
  AssetStoragePort,
  AssetStorageUpload,
} from '../../application/ports/asset-storage.port';

import { AssetMimeType } from '../../domain/value-objects/asset-mime-type.vo';
import { AssetSizeBytes } from '../../domain/value-objects/asset-size-bytes.vo';

import type { AssetBucket } from '../../domain/value-objects/asset-bucket.vo';
import type { AssetObjectKey } from '../../domain/value-objects/asset-object-key.vo';
import type { AssetStorageProvider } from '../../domain/value-objects/asset-storage-provider.vo';

// =============================================================================
// Types
// =============================================================================

interface BunnyStorageResponse {
  readonly statusCode: number;
  readonly statusMessage: string;
  readonly headers: http.IncomingHttpHeaders;
  readonly body: Readable;
}

// =============================================================================
// Service
// =============================================================================

@Injectable()
export class BunnyAssetStorageService implements AssetStoragePort {
  // ===========================================================================
  // Configuration
  // ===========================================================================

  /**
   * Authenticated Bunny Storage API endpoint.
   *
   * This is the physical-storage endpoint, not the public CDN endpoint.
   */
  private readonly storageEndpoint: string;

  /**
   * Bunny Storage access key.
   *
   * This credential remains entirely inside the infrastructure adapter.
   */
  private readonly accessKey: string;

  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor() {
    const endpoint =
      process.env.BUNNY_STORAGE_ENDPOINT ?? 'https://storage.bunnycdn.com';

    const accessKey = process.env.BUNNY_STORAGE_ACCESS_KEY;

    if (accessKey === undefined || accessKey.trim() === '') {
      throw new Error(
        'BUNNY_STORAGE_ACCESS_KEY environment variable is required.',
      );
    }

    this.storageEndpoint = endpoint.replace(/\/+$/, '');

    this.accessKey = accessKey;
  }

  // ===========================================================================
  // Upload
  // ===========================================================================

  /**
   * Uploads a physical Asset object to Bunny Storage.
   *
   * The content is streamed directly to Bunny.
   *
   * Before uploading, the adapter performs a HEAD preflight so an existing
   * object key is rejected instead of intentionally overwritten.
   */
  public async upload(input: AssetStorageUpload): Promise<AssetStorageObject> {
    this.ensureBunnyProvider(input.storageProvider);

    const url = this.objectUrl(input.bucket, input.objectKey);

    const alreadyExists = await this.objectExists(url);

    if (alreadyExists) {
      throw new Error(
        `Bunny Storage object "${input.objectKey.value}" already exists and will not be overwritten.`,
      );
    }

    await this.uploadStream(
      url,
      input.content,
      input.mimeType.value,
      input.sizeBytes.value,
    );

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
   * Retrieves a physical Asset object from Bunny Storage.
   *
   * The response body remains a stream.
   *
   * The complete object is therefore never buffered in application memory.
   */
  public async get(
    storageProvider: AssetStorageProvider,
    bucket: AssetBucket,
    objectKey: AssetObjectKey,
  ): Promise<AssetStorageObjectContent | null> {
    this.ensureBunnyProvider(storageProvider);

    const response = await this.request(
      'GET',
      this.objectUrl(bucket, objectKey),
    );

    if (response.statusCode === 404) {
      response.body.destroy();

      return null;
    }

    if (response.statusCode < 200 || response.statusCode >= 300) {
      response.body.destroy();

      throw this.createHttpError(
        'get',
        response.statusCode,
        response.statusMessage,
      );
    }

    const mimeType = AssetMimeType.create(
      this.headerValue(response.headers['content-type']) ??
        'application/octet-stream',
    );

    const sizeBytes = this.parseSizeBytes(
      this.headerValue(response.headers['content-length']),
      objectKey.value,
    );

    return {
      storageProvider,
      bucket,
      objectKey,
      mimeType,
      sizeBytes,
      content: response.body,
    };
  }

  // ===========================================================================
  // Exists
  // ===========================================================================

  /**
   * Determines whether a physical Asset object exists.
   *
   * This is a storage-level query only.
   */
  public async exists(
    storageProvider: AssetStorageProvider,
    bucket: AssetBucket,
    objectKey: AssetObjectKey,
  ): Promise<boolean> {
    this.ensureBunnyProvider(storageProvider);

    return this.objectExists(this.objectUrl(bucket, objectKey));
  }

  // ===========================================================================
  // Head
  // ===========================================================================

  /**
   * Retrieves physical metadata without downloading object content.
   */
  public async head(
    storageProvider: AssetStorageProvider,
    bucket: AssetBucket,
    objectKey: AssetObjectKey,
  ): Promise<AssetStorageObject | null> {
    this.ensureBunnyProvider(storageProvider);

    const response = await this.request(
      'HEAD',
      this.objectUrl(bucket, objectKey),
    );

    response.body.destroy();

    if (response.statusCode === 404) {
      return null;
    }

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw this.createHttpError(
        'inspect object',
        response.statusCode,
        response.statusMessage,
      );
    }

    const mimeType = AssetMimeType.create(
      this.headerValue(response.headers['content-type']) ??
        'application/octet-stream',
    );

    const sizeBytes = this.parseSizeBytes(
      this.headerValue(response.headers['content-length']),
      objectKey.value,
    );

    return {
      storageProvider,
      bucket,
      objectKey,
      mimeType,
      sizeBytes,
    };
  }

  // ===========================================================================
  // Delete
  // ===========================================================================

  /**
   * Deletes a physical Asset object from Bunny Storage.
   *
   * A missing object is treated as already deleted, making physical deletion
   * idempotent.
   *
   * This operation does not change Asset aggregate state.
   */
  public async delete(
    storageProvider: AssetStorageProvider,
    bucket: AssetBucket,
    objectKey: AssetObjectKey,
  ): Promise<void> {
    this.ensureBunnyProvider(storageProvider);

    const response = await this.request(
      'DELETE',
      this.objectUrl(bucket, objectKey),
    );

    response.body.destroy();

    if (response.statusCode === 404) {
      return;
    }

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw this.createHttpError(
        'delete',
        response.statusCode,
        response.statusMessage,
      );
    }
  }

  // ===========================================================================
  // Private — Provider
  // ===========================================================================

  /**
   * Ensures this adapter only handles Bunny-backed Assets.
   *
   * AssetStorageProvider must explicitly contain BUNNY in its value contract.
   */
  private ensureBunnyProvider(storageProvider: AssetStorageProvider): void {
    if (storageProvider.value !== 'BUNNY') {
      throw new Error(
        `BunnyAssetStorageService cannot handle storage provider "${storageProvider.value}".`,
      );
    }
  }

  // ===========================================================================
  // Private — Object Existence
  // ===========================================================================

  /**
   * Performs a physical object existence check against Bunny Storage.
   *
   * HEAD is used because it avoids downloading object content.
   */
  private async objectExists(url: string): Promise<boolean> {
    const response = await this.request('HEAD', url);

    response.body.destroy();

    if (response.statusCode === 404) {
      return false;
    }

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw this.createHttpError(
        'check object existence',
        response.statusCode,
        response.statusMessage,
      );
    }

    return true;
  }

  // ===========================================================================
  // Private — Streaming Upload
  // ===========================================================================

  /**
   * Streams Asset content directly to Bunny Storage.
   *
   * The Asset is never accumulated in application memory.
   *
   * Content-Length is supplied explicitly because the Asset already contains
   * the expected physical size.
   */
  private async uploadStream(
    url: string,
    content: Readable,
    mimeType: string,
    sizeBytes: number,
  ): Promise<void> {
    const parsedUrl = new URL(url);

    const transport = this.transportFor(parsedUrl);

    await new Promise<void>((resolve, reject) => {
      let settled = false;

      const fail = (reason: unknown): void => {
        if (settled) {
          return;
        }

        settled = true;

        content.destroy();

        reject(this.toError(reason));
      };

      const succeed = (): void => {
        if (settled) {
          return;
        }

        settled = true;

        resolve();
      };

      const request = transport.request(
        {
          protocol: parsedUrl.protocol,

          hostname: parsedUrl.hostname,

          port: parsedUrl.port.length > 0 ? Number(parsedUrl.port) : undefined,

          path: `${parsedUrl.pathname}${parsedUrl.search}`,

          method: 'PUT',

          headers: {
            AccessKey: this.accessKey,

            'Content-Type': mimeType,

            'Content-Length': String(sizeBytes),
          },
        },
        (response) => {
          response.resume();

          const statusCode = response.statusCode ?? 0;

          if (statusCode >= 200 && statusCode < 300) {
            succeed();
            return;
          }

          fail(
            this.createHttpError(
              'upload',
              statusCode,
              response.statusMessage ?? '',
            ),
          );
        },
      );

      request.once('error', fail);

      content.once('error', fail);

      content.pipe(request);
    });
  }

  // ===========================================================================
  // Private — HTTP Request
  // ===========================================================================

  /**
   * Performs an authenticated Bunny Storage API request.
   *
   * GET returns the response body as a stream.
   *
   * HEAD and DELETE callers explicitly destroy their unused response streams.
   */
  private async request(
    method: 'GET' | 'HEAD' | 'DELETE',
    url: string,
  ): Promise<BunnyStorageResponse> {
    const parsedUrl = new URL(url);

    const transport = this.transportFor(parsedUrl);

    return new Promise<BunnyStorageResponse>((resolve, reject) => {
      const request = transport.request(
        {
          protocol: parsedUrl.protocol,

          hostname: parsedUrl.hostname,

          port: parsedUrl.port.length > 0 ? Number(parsedUrl.port) : undefined,

          path: `${parsedUrl.pathname}${parsedUrl.search}`,

          method,

          headers: {
            AccessKey: this.accessKey,
          },
        },
        (response) => {
          resolve({
            statusCode: response.statusCode ?? 0,

            statusMessage: response.statusMessage ?? '',

            headers: response.headers,

            body: response,
          });
        },
      );

      request.once('error', (error: Error) => {
        reject(error);
      });
    });
  }

  // ===========================================================================
  // Private — HTTP Transport
  // ===========================================================================

  /**
   * Selects the Node HTTP transport from the configured endpoint.
   *
   * Production Bunny Storage configuration should use HTTPS.
   */
  private transportFor(parsedUrl: URL): typeof http | typeof https {
    if (parsedUrl.protocol === 'https:') {
      return https;
    }

    if (parsedUrl.protocol === 'http:') {
      return http;
    }

    throw new Error(
      `Unsupported Bunny Storage endpoint protocol "${parsedUrl.protocol}".`,
    );
  }

  // ===========================================================================
  // Private — URL Construction
  // ===========================================================================

  /**
   * Builds the authenticated Bunny Storage API object URL.
   *
   * Bucket and object-key segments are encoded independently.
   *
   * This is an infrastructure URL only.
   *
   * It must never be exposed as a public Asset URL.
   */
  private objectUrl(bucket: AssetBucket, objectKey: AssetObjectKey): string {
    const bucketValue = this.encodePathSegment(bucket.value);

    const objectKeyValue = objectKey.value
      .split('/')
      .map((segment) => this.encodePathSegment(segment))
      .join('/');

    return `${this.storageEndpoint}/${bucketValue}/${objectKeyValue}`;
  }

  /**
   * Encodes one path segment without encoding '/' separators.
   */
  private encodePathSegment(value: string): string {
    return encodeURIComponent(value);
  }

  // ===========================================================================
  // Private — Size
  // ===========================================================================

  /**
   * Converts Bunny Content-Length into the AssetSizeBytes value object.
   */
  private parseSizeBytes(
    value: string | undefined,
    objectKey: string,
  ): AssetSizeBytes {
    if (value === undefined) {
      throw new Error(
        `Bunny Storage did not return Content-Length for object "${objectKey}".`,
      );
    }

    const size = Number(value);

    if (!Number.isSafeInteger(size) || size < 0) {
      throw new Error(
        `Bunny Storage returned an invalid Content-Length for object "${objectKey}".`,
      );
    }

    return AssetSizeBytes.create(size);
  }

  // ===========================================================================
  // Private — Headers
  // ===========================================================================

  /**
   * Normalizes a Node HTTP header into one string value.
   */
  private headerValue(
    value: string | string[] | undefined,
  ): string | undefined {
    if (Array.isArray(value)) {
      return value[0];
    }

    return value;
  }

  // ===========================================================================
  // Private — Error Normalization
  // ===========================================================================

  /**
   * Converts arbitrary stream/request failure reasons into Error instances.
   *
   * Node streams can technically emit arbitrary values as error reasons.
   *
   * The application boundary should nevertheless reject Promises with actual
   * Error instances so stack traces, logging, and ESLint semantics remain
   * consistent.
   */
  private toError(reason: unknown): Error {
    if (reason instanceof Error) {
      return reason;
    }

    if (typeof reason === 'string') {
      return new Error(reason);
    }

    try {
      return new Error(JSON.stringify(reason));
    } catch {
      return new Error('Unknown Bunny Storage infrastructure error.');
    }
  }

  // ===========================================================================
  // Private — Errors
  // ===========================================================================

  /**
   * Creates a bounded infrastructure error from a Bunny HTTP response.
   *
   * Response bodies are intentionally excluded because they may contain
   * provider-specific information that does not belong in domain or
   * application errors.
   */
  private createHttpError(
    operation: string,
    statusCode: number,
    statusMessage: string,
  ): Error {
    const message = statusMessage.length > 0 ? ` ${statusMessage}` : '';

    return new Error(
      `Bunny Storage ${operation} failed with HTTP ${statusCode}${message}.`,
    );
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default BunnyAssetStorageService;
