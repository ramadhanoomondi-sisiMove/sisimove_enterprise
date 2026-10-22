
// -----------------------------------------------------------------------------
// sisiMove — Assets
// Asset Response Mapper
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - normalize backend Asset responses for frontend consumption;
// - convert ISO date strings into Date objects;
// - preserve optional values correctly;
// - provide a consistent mapping boundary for API responses.
//
// Non-responsibilities:
// - HTTP requests;
// - authorization;
// - storage URL generation;
// - business rules or lifecycle transitions.
//
// The backend AssetResponseMapper remains the source of truth for the
// fields returned by the API.
// -----------------------------------------------------------------------------

import type { AssetModel } from '../models';

// =============================================================================
// Backend Response Shape
// =============================================================================

/**
 * JSON representation of the backend AssetResponse.
 *
 * Date fields are strings because JSON serialization converts Date objects
 * into ISO strings. Optional properties may be omitted by the backend.
 */
export interface AssetResponseDto {
  readonly publicId: string;
  readonly ownerIdentityPublicId?: string;

  readonly type: string;
  readonly category: string;
  readonly status: string;
  readonly visibility: string;

  readonly storageProvider: string;
  readonly bucket: string;
  readonly objectKey: string;

  readonly originalFilename?: string;
  readonly mimeType: string;
  readonly sizeBytes: number;

  readonly uploadedAt?: string | null;
  readonly archivedAt?: string | null;
  readonly deletedAt?: string | null;

  readonly createdAt: string;
  readonly updatedAt: string;
}

// =============================================================================
// Mapper
// =============================================================================

export class AssetMapper {
  /**
   * Maps a backend JSON response into the frontend AssetModel.
   *
   * Invalid required dates throw an error rather than silently creating
   * invalid Date objects.
   */
  public static toModel(response: AssetResponseDto): AssetModel {
    return {
      publicId: response.publicId,

      ...(response.ownerIdentityPublicId !== undefined
        ? { ownerIdentityPublicId: response.ownerIdentityPublicId }
        : {}),

      type: response.type as AssetModel['type'],
      category: response.category as AssetModel['category'],
      status: response.status as AssetModel['status'],
      visibility: response.visibility as AssetModel['visibility'],

      storageProvider:
        response.storageProvider as AssetModel['storageProvider'],
      bucket: response.bucket,
      objectKey: response.objectKey,

      ...(response.originalFilename !== undefined
        ? { originalFilename: response.originalFilename }
        : {}),

      mimeType: response.mimeType,
      sizeBytes: response.sizeBytes,

      ...(response.uploadedAt
        ? { uploadedAt: this.toDate(response.uploadedAt, 'uploadedAt') }
        : {}),

      ...(response.archivedAt
        ? { archivedAt: this.toDate(response.archivedAt, 'archivedAt') }
        : {}),

      ...(response.deletedAt
        ? { deletedAt: this.toDate(response.deletedAt, 'deletedAt') }
        : {}),

      createdAt: this.toDate(response.createdAt, 'createdAt'),
      updatedAt: this.toDate(response.updatedAt, 'updatedAt'),
    };
  }

  /**
   * Maps an array of backend responses.
   */
  public static toModels(
    responses: readonly AssetResponseDto[],
  ): AssetModel[] {
    return responses.map((response) => this.toModel(response));
  }

  // ---------------------------------------------------------------------------
  // Date normalization
  // ---------------------------------------------------------------------------

  private static toDate(value: string, field: string): Date {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      throw new Error(`Invalid Asset response date: ${field}.`);
    }

    return date;
  }
}

// =============================================================================
// Convenience Exports
// =============================================================================

export const mapAssetResponse = AssetMapper.toModel;
export const mapAssetResponses = AssetMapper.toModels;
