// src/domains/asset/application/requests/create-asset-processing.request.ts

import type {
  AssetProcessingOperation,
  AssetProcessor,
} from '../../../domain/value-objects';

export class CreateAssetProcessingRequest {
  /**
   * Asset public identifier.
   */
  assetPublicId!: string;

  /**
   * Processing operation to perform.
   */
  operation!: AssetProcessingOperation;

  /**
   * Processing engine.
   */
  processor!: AssetProcessor | null;

  /**
   * Execute processing asynchronously.
   */
  asynchronous!: boolean;

  /**
   * Processing priority.
   */
  priority!: number | null;

  /**
   * Maximum retry attempts.
   */
  maxRetries!: number | null;

  /**
   * Processing timeout (seconds).
   */
  timeoutSeconds!: number | null;

  /**
   * Optional output width.
   */
  width!: number | null;

  /**
   * Optional output height.
   */
  height!: number | null;

  /**
   * Optional output quality (1–100).
   */
  quality!: number | null;

  /**
   * Optional compression level.
   */
  compressionLevel!: number | null;

  /**
   * Optional rotation angle.
   */
  rotationDegrees!: number | null;

  /**
   * Optional output MIME type.
   */
  outputMimeType!: string | null;

  /**
   * Optional destination variant.
   */
  targetVariant!: string | null;

  /**
   * Preserve metadata after processing.
   */
  preserveMetadata!: boolean;

  /**
   * Overwrite existing output.
   */
  overwriteExisting!: boolean;

  /**
   * Force execution even if output already exists.
   */
  force!: boolean;

  /**
   * Additional processor-specific options.
   */
  metadata!: Record<string, unknown> | null;

  /**
   * Optional processing reason.
   */
  reason!: string | null;
}
