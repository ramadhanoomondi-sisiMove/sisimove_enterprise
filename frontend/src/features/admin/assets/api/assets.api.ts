
/**
 * -----------------------------------------------------------------------------
 * sisiMove — Assets
 * Asset API Adapter
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Call protected Assets HTTP endpoints.
 * - Use the shared authenticated API client.
 * - Map backend DTOs into normalized AssetModel objects.
 * - Convert ISO date strings into validated Date objects.
 * - Retrieve private asset content through an authenticated endpoint.
 * - Keep HTTP and response-mapping concerns outside React components.
 *
 * Security:
 * - Protected endpoints require JWT authentication and appropriate permissions.
 * - Private content is retrieved only through the protected content endpoint.
 * - Public asset endpoints must not be used to retrieve private content.
 * - The adapter never reads authSessionStorage directly.
 * - The backend remains responsible for authorization and lifecycle rules.
 *
 * Backend contract:
 * - GET    /assets
 * - GET    /assets/:assetPublicId
 * - GET    /assets/category?category=...
 * - GET    /assets/status?status=...
 * - GET    /assets/:assetPublicId/content
 * - PATCH  /assets/:assetPublicId/archive
 * - DELETE /assets/:assetPublicId
 * - PATCH  /assets/:assetPublicId/visibility
 *
 * -----------------------------------------------------------------------------
 */

import { authenticatedApiClient } from '@/features/authentication/http/authenticated-api-client';

import type { AssetModel } from '../models';

import {
  AssetCategory,
  AssetStatus,
  AssetVisibility,
} from '../models';

import { AssetMapper } from '../mappers';

import type { AssetResponseDto } from '../mappers';

// =============================================================================
// Request Models
// =============================================================================

export interface ChangeAssetVisibilityRequest {
  readonly visibility: AssetVisibility;
}

// =============================================================================
// API Adapter
// =============================================================================

class AssetsApi {
  private readonly basePath = '/assets';

  // ---------------------------------------------------------------------------
  // List assets
  // ---------------------------------------------------------------------------

  /**
   * GET /assets
   *
   * Returns assets available to the authenticated caller.
   * Backend DTOs are mapped into normalized domain models.
   */
  public async getAll(): Promise<AssetModel[]> {
    const responses =
      await authenticatedApiClient.get<AssetResponseDto[]>(
        this.basePath,
      );

    return AssetMapper.toModels(responses);
  }

  // ---------------------------------------------------------------------------
  // Get asset by public ID
  // ---------------------------------------------------------------------------

  /**
   * GET /assets/:assetPublicId
   */
  public async getByPublicId(
    assetPublicId: string,
  ): Promise<AssetModel | null> {
    this.assertPublicId(assetPublicId);

    const response =
      await authenticatedApiClient.get<AssetResponseDto | null>(
        `${this.basePath}/${encodeURIComponent(assetPublicId)}`,
      );

    return response === null
      ? null
      : AssetMapper.toModel(response);
  }

  // ---------------------------------------------------------------------------
  // Get assets by category
  // ---------------------------------------------------------------------------

  /**
   * GET /assets/category?category=...
   */
  public async getByCategory(
    category: AssetCategory,
  ): Promise<AssetModel[]> {
    const query = new URLSearchParams({ category });

    const responses =
      await authenticatedApiClient.get<AssetResponseDto[]>(
        `${this.basePath}/category?${query.toString()}`,
      );

    return AssetMapper.toModels(responses);
  }

  // ---------------------------------------------------------------------------
  // Get assets by status
  // ---------------------------------------------------------------------------

  /**
   * GET /assets/status?status=...
   */
  public async getByStatus(
    status: AssetStatus,
  ): Promise<AssetModel[]> {
    const query = new URLSearchParams({ status });

    const responses =
      await authenticatedApiClient.get<AssetResponseDto[]>(
        `${this.basePath}/status?${query.toString()}`,
      );

    return AssetMapper.toModels(responses);
  }

  // ---------------------------------------------------------------------------
  // Get private asset content
  // ---------------------------------------------------------------------------

  /**
   * GET /assets/:assetPublicId/content
   *
   * Retrieves the binary content of an asset through the authenticated API.
   *
   * The backend must protect this route with the appropriate permission and
   * validate that the caller is authorized to access the requested asset.
   *
   * Returns a Blob for use by image previews, document viewers, or downloads.
   */
  public async getPrivateContent(
    assetPublicId: string,
  ): Promise<Blob> {
    this.assertPublicId(assetPublicId);

    return authenticatedApiClient.get<Blob>(
      `${this.basePath}/${encodeURIComponent(assetPublicId)}/content`,
      {
        responseType: 'blob',
      },
    );
  }

  // ---------------------------------------------------------------------------
  // Archive asset
  // ---------------------------------------------------------------------------

  /**
   * PATCH /assets/:assetPublicId/archive
   *
   * The backend applies authorization and lifecycle rules.
   */
  public async archive(
    assetPublicId: string,
  ): Promise<AssetModel> {
    this.assertPublicId(assetPublicId);

    const response =
      await authenticatedApiClient.patch<AssetResponseDto>(
        `${this.basePath}/${encodeURIComponent(assetPublicId)}/archive`,
      );

    return AssetMapper.toModel(response);
  }

  // ---------------------------------------------------------------------------
  // Delete asset
  // ---------------------------------------------------------------------------

  /**
   * DELETE /assets/:assetPublicId
   *
   * Assumes the backend returns an AssetResponseDto.
   * Confirm the actual DELETE response contract before relying on it.
   */
  public async delete(
    assetPublicId: string,
  ): Promise<AssetModel> {
    this.assertPublicId(assetPublicId);

    const response =
      await authenticatedApiClient.delete<AssetResponseDto>(
        `${this.basePath}/${encodeURIComponent(assetPublicId)}`,
      );

    return AssetMapper.toModel(response);
  }

  // ---------------------------------------------------------------------------
  // Change visibility
  // ---------------------------------------------------------------------------

  /**
   * PATCH /assets/:assetPublicId/visibility
   *
   * The backend remains responsible for authorization.
   */
  public async changeVisibility(
    assetPublicId: string,
    request: ChangeAssetVisibilityRequest,
  ): Promise<AssetModel> {
    this.assertPublicId(assetPublicId);

    const response =
      await authenticatedApiClient.patch<AssetResponseDto>(
        `${this.basePath}/${encodeURIComponent(assetPublicId)}/visibility`,
        request,
      );

    return AssetMapper.toModel(response);
  }

  // ---------------------------------------------------------------------------
  // Input Guards
  // ---------------------------------------------------------------------------

  private assertPublicId(assetPublicId: string): void {
    if (assetPublicId.trim().length === 0) {
      throw new Error('Asset public ID is required.');
    }
  }
}

// =============================================================================
// Shared Instance
// =============================================================================

export const assetsApi = new AssetsApi();

export default assetsApi;
