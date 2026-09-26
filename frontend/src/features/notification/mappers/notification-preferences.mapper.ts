// -----------------------------------------------------------------------------
// sisiMove — Notification Preferences Response Mapper
// -----------------------------------------------------------------------------
//
// Maps the backend NotificationPreferenceResponse HTTP representation into
// the frontend NotificationPreferences model.
//
// Backend response:
//
// NotificationPreferenceResponse
// ├── publicId
// ├── memberPublicId
// ├── nine preference values
// ├── areAllEnabled
// ├── areAllDisabled
// ├── hasEnabledPreferences
// ├── enabledPreferenceCount
// ├── disabledPreferenceCount
// ├── createdAt
// └── updatedAt
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - map backend preference response into the frontend model;
// - preserve all nine preference values;
// - preserve backend-projected summary state;
// - preserve backend timestamps;
// - normalize optional/null transport values only where necessary.
//
// Non-responsibilities:
//
// - calculating summary values;
// - enabling/disabling preferences;
// - deciding defaults;
// - issuing PATCH requests;
// - authentication;
// - authorization;
// - React Query caching;
// - UI state;
// - aggregate orchestration.
//
// IMPORTANT:
//
// The five summary fields are backend-projected values.
//
// The frontend must NOT replace them with:
//
//     Object.values(...).every(...)
//     Object.values(...).filter(...)
//     or equivalent calculations.
//
// The NotificationPreference aggregate/entity is authoritative for these
// values.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Frontend Models
// -----------------------------------------------------------------------------

import type {
  NotificationPreferences,
} from '../models';

// =============================================================================
// Backend Response Contract
// =============================================================================
//
// This represents the application-facing backend response, not a backend
// domain/entity import.
// =============================================================================

interface NotificationPreferenceResponse {
  publicId: string;
  memberPublicId: string;

  journeyEnabled: boolean;
  bookingEnabled: boolean;
  paymentEnabled: boolean;
  walletEnabled: boolean;
  trustEnabled: boolean;
  verificationEnabled: boolean;
  messageEnabled: boolean;
  supportEnabled: boolean;
  systemEnabled: boolean;

  areAllEnabled: boolean;
  areAllDisabled: boolean;
  hasEnabledPreferences: boolean;
  enabledPreferenceCount: number;
  disabledPreferenceCount: number;

  createdAt: string;
  updatedAt: string;
}

// =============================================================================
// Mapper
// =============================================================================

/**
 * Maps one backend NotificationPreferenceResponse into the frontend
 * NotificationPreferences model.
 *
 * The mapper intentionally preserves the server-projected summary fields.
 */
export function mapNotificationPreferences(
  response: NotificationPreferenceResponse,
): NotificationPreferences {
  return {
    // -------------------------------------------------------------------------
    // Identity
    // -------------------------------------------------------------------------

    publicId: response.publicId,

    memberPublicId:
      response.memberPublicId,

    // -------------------------------------------------------------------------
    // Preference State
    // -------------------------------------------------------------------------

    journeyEnabled:
      response.journeyEnabled,

    bookingEnabled:
      response.bookingEnabled,

    paymentEnabled:
      response.paymentEnabled,

    walletEnabled:
      response.walletEnabled,

    trustEnabled:
      response.trustEnabled,

    verificationEnabled:
      response.verificationEnabled,

    messageEnabled:
      response.messageEnabled,

    supportEnabled:
      response.supportEnabled,

    systemEnabled:
      response.systemEnabled,

    // -------------------------------------------------------------------------
    // Backend-Projected Summary
    // -------------------------------------------------------------------------

    /**
     * These values are intentionally copied from the backend.
     *
     * The frontend does not reproduce NotificationPreferenceEntity's
     * summary methods.
     */
    areAllEnabled:
      response.areAllEnabled,

    areAllDisabled:
      response.areAllDisabled,

    hasEnabledPreferences:
      response.hasEnabledPreferences,

    enabledPreferenceCount:
      response.enabledPreferenceCount,

    disabledPreferenceCount:
      response.disabledPreferenceCount,

    // -------------------------------------------------------------------------
    // Audit
    // -------------------------------------------------------------------------

    createdAt:
      response.createdAt,

    updatedAt:
      response.updatedAt,
  };
}