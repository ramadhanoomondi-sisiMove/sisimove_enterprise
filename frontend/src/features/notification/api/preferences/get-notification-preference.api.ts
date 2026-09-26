// -----------------------------------------------------------------------------
// sisiMove — Get Notification Preference API
// -----------------------------------------------------------------------------
//
// Protected Notification Preference API adapter for direct preference lookup.
//
// Backend endpoint:
//
//     GET /notification-preferences/:preferencePublicId
//
// Responsibilities:
//
// - call the backend preference detail endpoint;
// - pass the public preference identifier;
// - return the complete NotificationPreferences response.
//
// Non-responsibilities:
//
// - authentication;
// - authorization;
// - React Query caching;
// - preference mutation;
// - summary calculation;
// - rendering.
//
// The public preference identifier is the only preference identity exposed
// to this frontend boundary.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Authentication HTTP
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

// -----------------------------------------------------------------------------
// Notification Models
// -----------------------------------------------------------------------------

import type { NotificationPreferences } from '../../models';

// =============================================================================
// API
// =============================================================================

/**
 * Fetches Notification Preferences by their public identifier.
 *
 * The backend determines whether the authenticated member is authorized to
 * access the requested preference resource.
 */
export async function getNotificationPreference(
  preferencePublicId: string,
): Promise<NotificationPreferences> {
  if (!preferencePublicId) {
    throw new Error(
      'Notification preference public identifier is required.',
    );
  }

  return authenticatedApiClient.get<NotificationPreferences>(
    `/notification-preferences/${encodeURIComponent(preferencePublicId)}`,
  );
}