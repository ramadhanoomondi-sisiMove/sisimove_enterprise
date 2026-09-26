// -----------------------------------------------------------------------------
// sisiMove — Get Notification Preferences by Member API
// -----------------------------------------------------------------------------
//
// Protected Notification Preference API adapter.
//
// Backend endpoint:
//
//     GET /notification-preferences/by-member/:memberPublicId
//
// Responsibilities:
//
// - call the backend Notification Preference lookup;
// - pass the opaque member public identifier;
// - return the complete NotificationPreferences response.
//
// Non-responsibilities:
//
// - determining the current member identity;
// - authentication;
// - authorization;
// - preference derivation;
// - default creation;
// - local summary calculation;
// - React Query caching;
// - rendering.
//
// IMPORTANT:
//
// The backend response contains server-projected summary fields:
//
// - areAllEnabled
// - areAllDisabled
// - hasEnabledPreferences
// - enabledPreferenceCount
// - disabledPreferenceCount
//
// This adapter does not recompute them.
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
 * Fetches Notification Preferences for a member.
 *
 * `memberPublicId` is an opaque Identity-domain reference.
 *
 * The backend remains responsible for authorization and for determining
 * whether the requested member's preferences may be read.
 */
export async function getNotificationPreferences(
  memberPublicId: string,
): Promise<NotificationPreferences> {
  if (!memberPublicId) {
    throw new Error(
      'Member public identifier is required.',
    );
  }

  return authenticatedApiClient.get<NotificationPreferences>(
    `/notification-preferences/by-member/${encodeURIComponent(memberPublicId)}`,
  );
}