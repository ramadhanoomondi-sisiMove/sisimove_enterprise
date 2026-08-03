//src/domains/assets/presentation/rest/mappers/asset-response.mapper.ts
import { Injectable } from '@nestjs/common';

import { AssetAggregate } from '../../../domain/aggregates/asset.aggregate';

import type {
  AssetEntity,
  AssetModerationEntity,
  AssetProcessingEntity,
  AssetReferenceEntity,
  AssetScanEntity,
  AssetVariantEntity,
} from '../../../domain/entities';

import {
  AssetDetailResponse,
  AssetModerationResponse,
  AssetProcessingResponse,
  AssetReferenceResponse,
  AssetResponse,
  AssetScanResponse,
  AssetVariantResponse,
} from '../responses';

@Injectable()
export class AssetResponseMapper {
  // ---------------------------------------------------------------------------
  // Asset
  // ---------------------------------------------------------------------------

  public toResponse(asset: AssetEntity): AssetResponse {
    const response = new AssetResponse();

    response.publicId = asset.publicId.value;

    response.ownerIdentityPublicId = this.toPublicId(asset.ownerIdentityId);

    response.type = asset.type;
    response.category = asset.category;
    response.status = asset.status;
    response.visibility = asset.visibility;

    response.storageProvider = asset.storageProvider;

    response.bucket = asset.bucket;
    response.objectKey = asset.objectKey;

    response.originalFilename = this.toNull(asset.originalFilename);

    response.storedFilename = this.toNull(asset.storedFilename);

    response.mimeType = asset.mimeType;

    response.extension = this.toNull(asset.extension);

    response.sizeBytes = this.toBigIntString(asset.sizeBytes);

    response.checksumAlgorithm = this.toNull(asset.checksumAlgorithm);

    response.checksum = this.toNull(asset.checksum);

    response.width = this.toNull(asset.width);

    response.height = this.toNull(asset.height);

    response.colorDepth = this.toNull(asset.colorDepth);

    response.durationSeconds = this.toNull(asset.durationSeconds);

    response.bitrate = this.toNull(asset.bitrate);

    response.frameRate = this.toNull(asset.frameRate);

    response.blurHash = this.toNull(asset.blurHash);

    response.metadata = this.toNullableRecord(asset.metadata);

    response.uploadedAt = this.toNull(asset.uploadedAt);

    response.archivedAt = this.toNull(asset.archivedAt);

    response.deletedAt = this.toNull(asset.deletedAt);

    response.createdAt = asset.createdAt;
    response.updatedAt = asset.updatedAt;

    return response;
  }
  // ---------------------------------------------------------------------------
  // Aggregate
  // ---------------------------------------------------------------------------

  public toDetailResponse(aggregate: AssetAggregate): AssetDetailResponse {
    const response = new AssetDetailResponse();

    response.asset = this.toResponse(aggregate.asset);

    response.variants = aggregate.variants.map((variant) =>
      this.toVariantResponse(variant),
    );

    response.references = aggregate.references.map((reference) =>
      this.toReferenceResponse(reference),
    );

    response.processings = aggregate.processings.map((processing) =>
      this.toProcessingResponse(processing),
    );

    response.scans = aggregate.scans.map((scan) => this.toScanResponse(scan));

    response.moderations = aggregate.moderations.map((moderation) =>
      this.toModerationResponse(moderation),
    );

    return response;
  }

  // ---------------------------------------------------------------------------
  // Variants
  // ---------------------------------------------------------------------------

  private toVariantResponse(variant: AssetVariantEntity): AssetVariantResponse {
    const response = new AssetVariantResponse();

    response.publicId = variant.publicId.value;

    response.variant = variant.variant;
    response.status = variant.status;

    response.isGenerated = variant.isGenerated;

    response.storageProvider = variant.storage.provider;
    response.bucket = variant.storage.bucket;
    response.objectKey = variant.storage.objectKey;

    response.mimeType = variant.file.mimeType;

    response.extension = this.toNull(variant.file.extension);

    response.sizeBytes = this.toBigIntString(variant.file.sizeBytes);

    response.width = this.toNull(variant.image?.width);

    response.height = this.toNull(variant.image?.height);

    response.durationSeconds = this.toNull(variant.media?.durationSeconds);

    response.createdAt = variant.createdAt;
    response.updatedAt = variant.updatedAt;

    return response;
  }
  // ---------------------------------------------------------------------------
  // References
  // ---------------------------------------------------------------------------

  private toReferenceResponse(
    reference: AssetReferenceEntity,
  ): AssetReferenceResponse {
    const response = new AssetReferenceResponse();

    response.publicId = reference.publicId.value;

    response.resourceType = reference.resourceType;
    response.resourcePublicId = reference.resourcePublicId;
    response.referenceField = reference.referenceField;

    response.createdAt = reference.createdAt;

    return response;
  }

  // ---------------------------------------------------------------------------
  // Processings
  // ---------------------------------------------------------------------------

  private toProcessingResponse(
    processing: AssetProcessingEntity,
  ): AssetProcessingResponse {
    const response = new AssetProcessingResponse();

    response.publicId = processing.publicId.value;

    response.operation = processing.operation;
    response.status = processing.status;

    response.processor = this.toNull(processing.processor);

    response.startedAt = this.toNull(processing.startedAt);

    response.completedAt = this.toNull(processing.completedAt);

    response.failedAt = this.toNull(processing.failedAt);

    response.failureReason = this.toPrimitive(processing.failureReason);
    response.metadata = this.toNullableRecord(processing.metadata);

    response.createdAt = processing.createdAt;
    response.updatedAt = processing.updatedAt;

    return response;
  }

  // ---------------------------------------------------------------------------
  // Scans
  // ---------------------------------------------------------------------------

  private toScanResponse(scan: AssetScanEntity): AssetScanResponse {
    const response = new AssetScanResponse();

    response.publicId = scan.publicId.value;

    response.engine = scan.engine;
    response.status = scan.status;

    response.scannedAt = this.toNull(scan.scannedAt);

    response.threatName = this.toPrimitive(scan.threatName);

    response.metadata = this.toNullableRecord(scan.metadata);

    response.createdAt = scan.createdAt;
    response.updatedAt = scan.updatedAt;

    return response;
  }
  // ---------------------------------------------------------------------------
  // Moderations
  // ---------------------------------------------------------------------------

  private toModerationResponse(
    moderation: AssetModerationEntity,
  ): AssetModerationResponse {
    const response = new AssetModerationResponse();

    response.publicId = moderation.publicId.value;

    response.type = moderation.type;
    response.status = moderation.status;

    response.moderatorIdentityPublicId = this.toPublicId(
      moderation.moderatorId,
    );

    response.confidence = this.toPrimitive(moderation.confidence);

    response.reason = this.toPrimitive(moderation.reason);

    response.metadata = this.toNullableRecord(moderation.metadata);

    response.moderatedAt = this.toNull(moderation.moderatedAt);

    response.createdAt = moderation.createdAt;
    response.updatedAt = moderation.updatedAt;

    return response;
  }
  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  /**
   * Converts an optional value into a nullable value.
   *
   * Required because response DTOs use `null` instead of `undefined`
   * when `exactOptionalPropertyTypes` is enabled.
   */
  private toNull<T>(value: T | undefined): T | null {
    return value ?? null;
  }

  /**
   * Extracts the primitive value from a Value Object.
   */
  private toPrimitive<T>(value: { value: T } | undefined): T | null {
    return value?.value ?? null;
  }

  /**
   * Extracts a public identifier from an ID Value Object.
   */
  private toPublicId(value: { value: string } | undefined): string | null {
    return value?.value ?? null;
  }

  /**
   * Converts bigint values into string values suitable for JSON.
   */
  private toBigIntString(value: bigint): string {
    return value.toString();
  }

  /**
   * Converts JsonValue into a nullable Record for API responses.
   */
  private toNullableRecord(value: unknown): Record<string, unknown> | null {
    if (
      value === null ||
      value === undefined ||
      typeof value !== 'object' ||
      Array.isArray(value)
    ) {
      return null;
    }

    return value as Record<string, unknown>;
  }
}
