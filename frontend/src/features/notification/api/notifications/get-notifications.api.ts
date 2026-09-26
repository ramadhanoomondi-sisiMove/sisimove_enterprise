// -----------------------------------------------------------------------------
// sisiMove — Get Notifications API
// -----------------------------------------------------------------------------
//
// Protected Notification API adapter.
//
// Backend endpoint:
//
//     GET /notifications
//
// Responsibilities:
//
// - call the authenticated Notification collection endpoint;
// - preserve the backend NotificationResponse contract;
// - return frontend Notification models.
//
// Non-responsibilities:
//
// - authentication;
// - authorization;
// - React Query caching;
// - filtering in the UI;
// - unread-state derivation;
// - Notification lifecycle decisions;
// - response transformation;
// - navigation;
// - rendering.
//
// HTTP boundary:
//
//     useNotifications()
//          │
//          ▼
//     getNotifications()
//          │
//          ▼
//     authenticatedApiClient.get()
//          │
//          ▼
//     GET /notifications
//
// The authenticated API client owns access-token resolution.
// This adapter must never access authSessionStorage directly.
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
 * Fetches Notifications available to the currently authenticated member.
 *
 * The backend determines the authenticated recipient from the protected
 * request context.
 *
 * The frontend therefore does not supply recipientPublicId here.
 *
 * This is important because a member-facing Notification collection should
 * not trust a caller-provided recipient identity to determine ownership.
 */
export async function getNotifications(): Promise<Notification[]> {
  return authenticatedApiClient.get<Notification[]>(
    '/notifications',
  );
}