// -----------------------------------------------------------------------------
// sisiMove — Mark Notification Read API
// -----------------------------------------------------------------------------
//
// Protected Notification lifecycle API adapter.
//
// Backend endpoint:
//
//     POST /notifications/:notificationPublicId/read
//
// Backend responsibility:
//
//     SENT → READ
//
// The frontend does not reproduce or validate the Notification lifecycle.
// It simply requests the backend transition.
//
// Responsibilities:
//
// - call the backend read command;
// - identify the Notification by publicId;
// - return the resulting Notification response.
//
// Non-responsibilities:
//
// - deciding whether the Notification can be read;
// - checking current Notification status;
// - setting readAt locally;
// - changing Notification state locally;
// - authorization;
// - authentication;
// - cache invalidation;
// - UI state management.
//
// React Query mutation hooks own cache invalidation/update behavior.
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
 * Marks a Notification as read.
 *
 * The backend aggregate owns the lifecycle transition and validates whether
 * the Notification is currently readable.
 *
 * The backend response is returned so the caller can reconcile its cached
 * Notification state with authoritative server state.
 */
export async function markNotificationRead(
  notificationPublicId: string,
): Promise<Notification> {
  if (!notificationPublicId) {
    throw new Error(
      'Notification public identifier is required.',
    );
  }

  return authenticatedApiClient.post<Notification>(
    `/notifications/${encodeURIComponent(notificationPublicId)}/read`,
  );
}