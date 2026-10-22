
/**
 * sisiMove — Trust Badges API
 *
 * HTTP transport for Trust badge definitions.
 */

import {
  apiClient,
  type RequestOptions,
} from '@/foundation/http';
import { authenticatedApiClient } from '@/features/authentication/http/authenticated-api-client';

import type { TrustBadgeApiResponse } from '../types/trust.types';

// -----------------------------------------------------------------------------
// Request Contracts
// -----------------------------------------------------------------------------

export interface CreateTrustBadgeRequest {
  type: string;
  name: string;
  description: string;
  assetPublicId: string | null;
}

export interface UpdateTrustBadgeRequest {
  type: string;
  name: string;
  description: string;
  assetPublicId: string | null;
}

export interface ChangeTrustBadgeTypeRequest {
  type: string;
}

export interface ChangeTrustBadgeNameRequest {
  name: string;
}

export interface ChangeTrustBadgeDescriptionRequest {
  description: string;
}

export interface SetTrustBadgeAssetRequest {
  assetPublicId: string | null;
}

export interface TrustBadgeMutationResponse {
  message: string;
}

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

export const trustBadgesApi = {
  /**
   * GET /trust-badges/active
   */
  getActive(
    options?: RequestOptions,
  ): Promise<TrustBadgeApiResponse[]> {
    return apiClient.get<TrustBadgeApiResponse[]>(
      '/trust-badges/active',
      options,
    );
  },

  /**
   * GET /trust-badges/name/:name
   */
  getByName(
    name: string,
    options?: RequestOptions,
  ): Promise<TrustBadgeApiResponse | null> {
    return apiClient.get<TrustBadgeApiResponse | null>(
      `/trust-badges/name/${encodeURIComponent(name)}`,
      options,
    );
  },

  /**
   * GET /trust-badges/type/:type
   */
  getByType(
    type: string,
    options?: RequestOptions,
  ): Promise<TrustBadgeApiResponse | null> {
    return apiClient.get<TrustBadgeApiResponse | null>(
      `/trust-badges/type/${encodeURIComponent(type)}`,
      options,
    );
  },

  /**
   * GET /trust-badges/asset/:assetPublicId
   */
  getByAssetPublicId(
    assetPublicId: string,
    options?: RequestOptions,
  ): Promise<TrustBadgeApiResponse[]> {
    return apiClient.get<TrustBadgeApiResponse[]>(
      `/trust-badges/asset/${encodeURIComponent(assetPublicId)}`,
      options,
    );
  },

  /**
   * GET /trust-badges/:trustBadgeId
   */
  getByPublicId(
    trustBadgeId: string,
    options?: RequestOptions,
  ): Promise<TrustBadgeApiResponse | null> {
    return apiClient.get<TrustBadgeApiResponse | null>(
      `/trust-badges/${encodeURIComponent(trustBadgeId)}`,
      options,
    );
  },

  /**
   * POST /trust-badges
   */
  create(
    body: CreateTrustBadgeRequest,
    options?: RequestOptions,
  ): Promise<TrustBadgeApiResponse> {
    return authenticatedApiClient.post<TrustBadgeApiResponse>(
      '/trust-badges',
      body,
      options,
    );
  },

  /**
   * PATCH /trust-badges/:trustBadgeId
   * Backend returns { message: string }.
   */
  update(
    trustBadgeId: string,
    body: UpdateTrustBadgeRequest,
    options?: RequestOptions,
  ): Promise<TrustBadgeMutationResponse> {
    return authenticatedApiClient.patch<TrustBadgeMutationResponse>(
      `/trust-badges/${encodeURIComponent(trustBadgeId)}`,
      body,
      options,
    );
  },

  /**
   * PATCH /trust-badges/:trustBadgeId/type
   */
  changeType(
    trustBadgeId: string,
    body: ChangeTrustBadgeTypeRequest,
    options?: RequestOptions,
  ): Promise<TrustBadgeMutationResponse> {
    return authenticatedApiClient.patch<TrustBadgeMutationResponse>(
      `/trust-badges/${encodeURIComponent(trustBadgeId)}/type`,
      body,
      options,
    );
  },

  /**
   * PATCH /trust-badges/:trustBadgeId/name
   */
  changeName(
    trustBadgeId: string,
    body: ChangeTrustBadgeNameRequest,
    options?: RequestOptions,
  ): Promise<TrustBadgeMutationResponse> {
    return authenticatedApiClient.patch<TrustBadgeMutationResponse>(
      `/trust-badges/${encodeURIComponent(trustBadgeId)}/name`,
      body,
      options,
    );
  },

  /**
   * PATCH /trust-badges/:trustBadgeId/description
   */
  changeDescription(
    trustBadgeId: string,
    body: ChangeTrustBadgeDescriptionRequest,
    options?: RequestOptions,
  ): Promise<TrustBadgeMutationResponse> {
    return authenticatedApiClient.patch<TrustBadgeMutationResponse>(
      `/trust-badges/${encodeURIComponent(trustBadgeId)}/description`,
      body,
      options,
    );
  },

  /**
   * PATCH /trust-badges/:trustBadgeId/asset
   */
  setAsset(
    trustBadgeId: string,
    body: SetTrustBadgeAssetRequest,
    options?: RequestOptions,
  ): Promise<TrustBadgeMutationResponse> {
    return authenticatedApiClient.patch<TrustBadgeMutationResponse>(
      `/trust-badges/${encodeURIComponent(trustBadgeId)}/asset`,
      body,
      options,
    );
  },

  /**
   * POST /trust-badges/:trustBadgeId/activate
   */
  activate(
    trustBadgeId: string,
    options?: RequestOptions,
  ): Promise<TrustBadgeMutationResponse> {
    return authenticatedApiClient.post<TrustBadgeMutationResponse>(
      `/trust-badges/${encodeURIComponent(trustBadgeId)}/activate`,
      undefined,
      options,
    );
  },

  /**
   * POST /trust-badges/:trustBadgeId/deactivate
   */
  deactivate(
    trustBadgeId: string,
    options?: RequestOptions,
  ): Promise<TrustBadgeMutationResponse> {
    return authenticatedApiClient.post<TrustBadgeMutationResponse>(
      `/trust-badges/${encodeURIComponent(trustBadgeId)}/deactivate`,
      undefined,
      options,
    );
  },
};
