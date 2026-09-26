// -----------------------------------------------------------------------------
// sisiMove — Get Notification API
// -----------------------------------------------------------------------------
//
// Protected Notification API adapter for retrieving one Notification.
//
// Backend endpoint:
//
//     GET /notifications/:notificationPublicId
//
// Responsibilities:
//
// - call the authenticated Notification detail endpoint;
// - pass the public Notification identifier;
// - return the backend NotificationResponse projection.
//
// Non-responsibilities:
//
// - authentication;
// - authorization;
// - React Query caching;
// - Notification state transitions;
// - marking a Notification as read;
// - resolving reference metadata;
// - navigation;
// - rendering.
//
// The public Notification identifier is the only Notification identity
// exposed to this frontend boundary.
//
// Internal persistence identifiers must never reach this adapter.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Authentication HTTP
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

// -----------------------------------------------------------------------------
// Notification Models
// -----------------------------------------------------------------------------

import type { Notification } from '../../models';

// =============================================================================
// API
// =============================================================================

/**
 * Fetches a single Notification by its public identifier.
 *
 * The backend remains responsible for determining whether the authenticated
 * member is authorized to access the requested Notification.
 */
export async function getNotification(
  notificationPublicId: string,
): Promise<Notification> {
  if (!notificationPublicId) {
    throw new Error(
      'Notification public identifier is required.',
    );
  }

  return authenticatedApiClient.get<Notification>(
    `/notifications/${encodeURIComponent(notificationPublicId)}`,
  );
}