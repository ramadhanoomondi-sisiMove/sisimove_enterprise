// -----------------------------------------------------------------------------
// Assets — Bunny Storage Service
// -----------------------------------------------------------------------------
//
// Infrastructure adapter for Bunny Storage.
//
// Responsibilities:
//
// - upload asset content to Bunny Storage;
// - retrieve asset content from Bunny Storage;
// - check object existence;
// - inspect object metadata;
// - delete objects from Bunny Storage.
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
// The service contains no domain business rules.
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

interface BunnyStorageResponse {
  readonly statusCode: number;
  readonly statusMessage: string;
  readonly headers: http.IncomingHttpHeaders;
  readonly body: Readable;
}

@Injectable()
export class BunnyAssetStorageService implements AssetStoragePort {
  private readonly storageEndpoint: string;
  private readonly accessKey: string;

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

  // ---------------------------------------------------------------------------
  // Upload
  // ---------------------------------------------------------------------------

  public async upload(input: AssetStorageUpload): Promise<AssetStorageObject> {
    const url = this.objectUrl(input.bucket, input.objectKey);

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

  // ---------------------------------------------------------------------------
  // Get
  // ---------------------------------------------------------------------------

  public async get(
    storageProvider: AssetStorageProvider,
    bucket: AssetBucket,
    objectKey: AssetObjectKey,
  ): Promise<AssetStorageObjectContent | null> {
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

  // ---------------------------------------------------------------------------
  // Exists
  // ---------------------------------------------------------------------------

  public async exists(
    _storageProvider: AssetStorageProvider,
    bucket: AssetBucket,
    objectKey: AssetObjectKey,
  ): Promise<boolean> {
    const response = await this.request(
      'HEAD',
      this.objectUrl(bucket, objectKey),
    );

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

  // ---------------------------------------------------------------------------
  // Head
  // ---------------------------------------------------------------------------

  public async head(
    storageProvider: AssetStorageProvider,
    bucket: AssetBucket,
    objectKey: AssetObjectKey,
  ): Promise<AssetStorageObject | null> {
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

  // ---------------------------------------------------------------------------
  // Delete
  // ---------------------------------------------------------------------------

  public async delete(
    _storageProvider: AssetStorageProvider,
    bucket: AssetBucket,
    objectKey: AssetObjectKey,
  ): Promise<void> {
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

  // ---------------------------------------------------------------------------
  // Streaming upload
  // ---------------------------------------------------------------------------

  private async uploadStream(
    url: string,
    content: Readable,
    mimeType: string,
    sizeBytes: number,
  ): Promise<void> {
    const parsedUrl = new URL(url);

    const transport = parsedUrl.protocol === 'https:' ? https : http;

    await new Promise<void>((resolve, reject) => {
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
            resolve();
            return;
          }

          reject(
            this.createHttpError(
              'upload',
              statusCode,
              response.statusMessage ?? '',
            ),
          );
        },
      );

      request.once('error', reject);

      content.once('error', reject);

      content.pipe(request);
    });
  }

  // ---------------------------------------------------------------------------
  // HTTP request
  // ---------------------------------------------------------------------------

  private async request(
    method: 'GET' | 'HEAD' | 'DELETE',
    url: string,
  ): Promise<BunnyStorageResponse> {
    const parsedUrl = new URL(url);

    const transport = parsedUrl.protocol === 'https:' ? https : http;

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

      request.once('error', reject);
    });
  }

  // ---------------------------------------------------------------------------
  // URL construction
  // ---------------------------------------------------------------------------

  private objectUrl(bucket: AssetBucket, objectKey: AssetObjectKey): string {
    const bucketValue = this.encodePathSegment(bucket.value);

    const objectKeyValue = objectKey.value
      .split('/')
      .map((segment) => this.encodePathSegment(segment))
      .join('/');

    return `${this.storageEndpoint}/${bucketValue}/${objectKeyValue}`;
  }

  private encodePathSegment(value: string): string {
    return encodeURIComponent(value);
  }

  // ---------------------------------------------------------------------------
  // Size
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // Headers
  // ---------------------------------------------------------------------------

  private headerValue(
    value: string | string[] | undefined,
  ): string | undefined {
    if (Array.isArray(value)) {
      return value[0];
    }

    return value;
  }

  // ---------------------------------------------------------------------------
  // Errors
  // ---------------------------------------------------------------------------

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

export default BunnyAssetStorageService;
