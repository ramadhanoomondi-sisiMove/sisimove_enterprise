
/**
 * sisiMove — Journeys API
 *
 * Frontend HTTP adapter for the Journey REST API.
 *
 * Responsibilities:
 * - Call the routes declared by the backend JourneyController.
 * - Use AuthenticatedApiClient for protected endpoints.
 * - Use the foundation ApiClient for public endpoints.
 * - Encode public identifiers and URL query parameters safely.
 * - Keep HTTP concerns separate from response mapping and UI logic.
 *
 * Non-responsibilities:
 * - Mapping backend responses into frontend models.
 * - Implementing journey business rules.
 * - Reading authentication storage directly.
 * - Inventing endpoints that the backend does not expose.
 *
 * Backend route prefix: /journeys
 */

import { apiClient } from '@/foundation/http';

import {
  authenticatedApiClient,
} from '@/features/authentication/http/authenticated-api-client';

import type {
  JourneyBackendResponse,
} from '../mappers/journey.mapper';

import type {
  JourneyStatus,
} from '../models/journey.enums';

// -----------------------------------------------------------------------------
// Query models
// -----------------------------------------------------------------------------

/**
 * Filters supported by GET /journeys/public.
 */
export interface PublicJourneysQuery {
  from?: string;
  to?: string;
  date?: string;
  minPrice?: number;
  maxPrice?: number;
}

/**
 * Required filters supported by GET /journeys/search.
 */
export interface PublishedJourneySearchQuery {
  from: string;
  to: string;
  date: string;
}

// -----------------------------------------------------------------------------
// Journey lifecycle request models
// -----------------------------------------------------------------------------

/**
 * POST /journeys/:journeyPublicId/start
 *
 * Matches StartJourneyDto.
 */
export interface StartJourneyRequest {
  startedAt?: string;
}

/**
 * POST /journeys/:journeyPublicId/complete
 *
 * Matches CompleteJourneyDto.
 */
export interface CompleteJourneyRequest {
  completedAt?: string;
}

/**
 * POST /journeys/:journeyPublicId/cancel
 *
 * Matches CancelJourneyDto.
 */
export interface CancelJourneyRequest {
  reason: string;
  cancelledAt?: string;
}

/**
 * POST /journeys/:journeyPublicId/expire
 *
 * Matches ExpireJourneyDto.
 */
export interface ExpireJourneyRequest {
  expiredAt?: string;
}

// -----------------------------------------------------------------------------
// Query string helper
// -----------------------------------------------------------------------------

function buildQueryString(
  values: Record<string, string | number | undefined>,
): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(values)) {
    if (value === undefined) {
      continue;
    }

    const normalized = String(value).trim();

    if (normalized.length === 0) {
      continue;
    }

    params.set(key, normalized);
  }

  const query = params.toString();

  return query.length > 0 ? `?${query}` : '';
}

// -----------------------------------------------------------------------------
// Journey public ID helper
// -----------------------------------------------------------------------------

function encodeJourneyPublicId(journeyPublicId: string): string {
  const normalized = journeyPublicId.trim();

  if (normalized.length === 0) {
    throw new Error('Journey public ID is required.');
  }

  return encodeURIComponent(normalized);
}

// -----------------------------------------------------------------------------
// Journeys API
// -----------------------------------------------------------------------------

export const journeysApi = {
  // ---------------------------------------------------------------------------
  // Public journey discovery
  // ---------------------------------------------------------------------------

  /**
   * GET /journeys/public
   *
   * Retrieves publicly discoverable journeys with optional filters.
   */
  async getPublicJourneys<TResponse = unknown>(
    query: PublicJourneysQuery = {},
  ): Promise<readonly TResponse[]> {
    const queryString = buildQueryString({
      from: query.from,
      to: query.to,
      date: query.date,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
    });

    return apiClient.get<readonly TResponse[]>(
      `/journeys/public${queryString}`,
    );
  },

  /**
   * GET /journeys/search
   *
   * Searches published journeys by origin, destination, and departure date.
   */
  async searchPublished<TResponse = unknown>(
    query: PublishedJourneySearchQuery,
  ): Promise<readonly TResponse[]> {
    const queryString = buildQueryString({
      from: query.from,
      to: query.to,
      date: query.date,
    });

    return apiClient.get<readonly TResponse[]>(
      `/journeys/search${queryString}`,
    );
  },

  /**
   * GET /journeys/:journeyPublicId
   *
   * Retrieves a publicly discoverable journey by public ID.
   */
  async getPublicById<TResponse = unknown>(
    journeyPublicId: string,
  ): Promise<TResponse | null> {
    const publicId = encodeJourneyPublicId(journeyPublicId);

    return apiClient.get<TResponse | null>(
      `/journeys/${publicId}`,
    );
  },

  // ---------------------------------------------------------------------------
  // Authenticated provider journeys
  // ---------------------------------------------------------------------------

  /**
   * GET /journeys/me
   *
   * Retrieves journeys belonging to the currently authenticated provider.
   */
  async getMine<TResponse = unknown>(): Promise<readonly TResponse[]> {
    return authenticatedApiClient.get<readonly TResponse[]>(
      '/journeys/me',
    );
  },

  /**
   * GET /journeys/provider/:providerPublicId
   *
   * Retrieves journeys for a specified provider.
   */
  async getByProvider<TResponse = unknown>(
    providerPublicId: string,
  ): Promise<readonly TResponse[]> {
    const publicId = encodeJourneyPublicId(providerPublicId);

    return authenticatedApiClient.get<readonly TResponse[]>(
      `/journeys/provider/${publicId}`,
    );
  },

  /**
   * GET /journeys/provider/:providerPublicId/detailed
   *
   * Retrieves detailed journey response objects for one provider.
   */
  async getDetailedByProvider(
    providerPublicId: string,
  ): Promise<readonly JourneyBackendResponse[]> {
    const publicId = encodeJourneyPublicId(providerPublicId);

    return authenticatedApiClient.get<readonly JourneyBackendResponse[]>(
      `/journeys/provider/${publicId}/detailed`,
    );
  },

  // ---------------------------------------------------------------------------
  // Administrative journey reads
  // ---------------------------------------------------------------------------

  /**
   * GET /journeys/admin/detailed
   *
   * Retrieves detailed journeys across all providers.
   */
  async getAllDetailed(): Promise<readonly JourneyBackendResponse[]> {
    return authenticatedApiClient.get<readonly JourneyBackendResponse[]>(
      '/journeys/admin/detailed',
    );
  },

  /**
   * GET /journeys/admin/detailed/:journeyPublicId
   *
   * Retrieves one complete journey for the admin detail page.
   */
  async getDetailedByPublicId(
    journeyPublicId: string,
  ): Promise<JourneyBackendResponse> {
    const publicId = encodeJourneyPublicId(journeyPublicId);

    return authenticatedApiClient.get<JourneyBackendResponse>(
      `/journeys/admin/detailed/${publicId}`,
    );
  },

  // ---------------------------------------------------------------------------
  // Provider journey filters
  // ---------------------------------------------------------------------------

  /**
   * GET /journeys/provider/:providerPublicId/status/:status
   *
   * Retrieves journeys for a provider filtered by status.
   */
  async getByProviderAndStatus<TResponse = unknown>(
    providerPublicId: string,
    status: JourneyStatus,
  ): Promise<readonly TResponse[]> {
    const publicId = encodeJourneyPublicId(providerPublicId);
    const normalizedStatus = encodeURIComponent(status);

    return authenticatedApiClient.get<readonly TResponse[]>(
      `/journeys/provider/${publicId}/status/${normalizedStatus}`,
    );
  },

  // ---------------------------------------------------------------------------
  // Administrative journey lifecycle operations
  // ---------------------------------------------------------------------------

  /**
   * POST /journeys/:journeyPublicId/start
   *
   * Permission: journey:manage
   *
   * Starts a journey.
   */
  async start(
    journeyPublicId: string,
    request: StartJourneyRequest = {},
  ): Promise<void> {
    const publicId = encodeJourneyPublicId(journeyPublicId);

    await authenticatedApiClient.post<void>(
      `/journeys/${publicId}/start`,
      request,
    );
  },

  /**
   * POST /journeys/:journeyPublicId/complete
   *
   * Permission: journey:manage
   *
   * Completes a journey.
   */
  async complete(
    journeyPublicId: string,
    request: CompleteJourneyRequest = {},
  ): Promise<void> {
    const publicId = encodeJourneyPublicId(journeyPublicId);

    await authenticatedApiClient.post<void>(
      `/journeys/${publicId}/complete`,
      request,
    );
  },

  /**
   * POST /journeys/:journeyPublicId/cancel
   *
   * Permission: journey:cancel
   *
   * Cancels a journey. A reason is required by the backend DTO.
   */
  async cancel(
    journeyPublicId: string,
    request: CancelJourneyRequest,
  ): Promise<void> {
    const publicId = encodeJourneyPublicId(journeyPublicId);

    await authenticatedApiClient.post<void>(
      `/journeys/${publicId}/cancel`,
      request,
    );
  },

  /**
   * POST /journeys/:journeyPublicId/expire
   *
   * Permission: journey:manage
   *
   * Expires a journey.
   */
  async expire(
    journeyPublicId: string,
    request: ExpireJourneyRequest = {},
  ): Promise<void> {
    const publicId = encodeJourneyPublicId(journeyPublicId);

    await authenticatedApiClient.post<void>(
      `/journeys/${publicId}/expire`,
      request,
    );
  },

  // ---------------------------------------------------------------------------
  // Journey operations
  // ---------------------------------------------------------------------------

  /**
   * GET /journeys/active-count
   *
   * Retrieves the backend's active journey count.
   */
  async getActiveCount(): Promise<number> {
    return authenticatedApiClient.get<number>(
      '/journeys/active-count',
    );
  },
};

// -----------------------------------------------------------------------------
// Default export
// -----------------------------------------------------------------------------

export default journeysApi;
