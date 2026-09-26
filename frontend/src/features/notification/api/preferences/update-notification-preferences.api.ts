// -----------------------------------------------------------------------------
// sisiMove — Update Notification Preferences API
// -----------------------------------------------------------------------------
//
// Protected Notification Preference mutation adapter.
//
// Backend endpoint:
//
//     PATCH /notification-preferences/:preferencePublicId
//
// The backend preference update represents the complete desired preference
// state.
//
// Therefore this adapter sends all nine preference booleans together.
//
// Responsibilities:
//
// - call the backend preference update endpoint;
// - identify the preference resource by publicId;
// - send the complete preference state;
// - return the authoritative updated preference response.
//
// Non-responsibilities:
//
// - deciding which preferences should be enabled;
// - calculating summary fields;
// - determining authorization;
// - authentication;
// - optimistic UI state management;
// - cache invalidation;
// - rendering.
//
// IMPORTANT:
//
// The request deliberately contains only mutable preference state.
//
// It does NOT send:
//
// - publicId;
// - memberPublicId;
// - summary fields;
// - createdAt;
// - updatedAt.
//
// Those values are backend-owned.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Authentication HTTP
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

// -----------------------------------------------------------------------------
// Notification Models
// -----------------------------------------------------------------------------

import type {
  NotificationPreferences,
  UpdateNotificationPreferencesRequest,
} from '../../models';

// =============================================================================
// API
// =============================================================================

/**
 * Updates the complete Notification Preference state.
 *
 * The backend aggregate remains authoritative for validation, mutation,
 * timestamps, and projected summary state.
 */
export async function updateNotificationPreferences(
  preferencePublicId: string,
  request: UpdateNotificationPreferencesRequest,
): Promise<NotificationPreferences> {
  if (!preferencePublicId) {
    throw new Error(
      'Notification preference public identifier is required.',
    );
  }

  return authenticatedApiClient.patch<NotificationPreferences>(
    `/notification-preferences/${encodeURIComponent(preferencePublicId)}`,
    request,
  );
}