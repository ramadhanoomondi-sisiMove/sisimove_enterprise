//src/foundation/routing/admin-routes
/* -----------------------------------------------------------------------------
 * sisiMove — Admin Routes
 * -----------------------------------------------------------------------------
 *
 * Canonical routes for administrative application surfaces.
 *
 * Scope:
 * - Platform overview
 * - Member and identity management
 * - Verification and trust management
 * - Journey operations
 * - Booking and boarding operations
 * - Financial oversight
 * - Asset management
 * - Authentication and session oversight
 * - Access control
 * - Audit and operational monitoring
 *
 * Journey Demand is intentionally excluded from this administration route
 * contract.
 *
 * This file defines URL construction only.
 *
 * It does NOT:
 * - authenticate users;
 * - restore sessions;
 * - enforce administrator authorization;
 * - enforce permissions;
 * - perform navigation;
 * - redirect users;
 * - fetch or mutate application data.
 *
 * Those responsibilities belong to their respective application boundaries.
 *
 * -------------------------------------------------------------------------- */

export const ADMIN_ROUTES = {
  // ---------------------------------------------------------------------------
  // Admin Overview
  // ---------------------------------------------------------------------------

  HOME: '/admin',

  // ---------------------------------------------------------------------------
  // Member and Identity Management
  // ---------------------------------------------------------------------------

  MEMBERS: '/admin/members',

  MEMBER: (identityPublicId: string) =>
    `/admin/members/${encodeURIComponent(identityPublicId)}`,

  // ---------------------------------------------------------------------------
  // Verification Management
  // ---------------------------------------------------------------------------

  VERIFICATIONS: '/admin/verifications',

  VERIFICATION: (verificationPublicId: string) =>
    `/admin/verifications/${encodeURIComponent(verificationPublicId)}`,

  VERIFICATION_REQUESTS: '/admin/verification-requests',

  VERIFICATION_REQUEST: (verificationRequestPublicId: string) =>
    `/admin/verification-requests/${encodeURIComponent(verificationRequestPublicId)}`,

  // ---------------------------------------------------------------------------
  // Trust and Reputation
  // ---------------------------------------------------------------------------

  TRUST: '/admin/trust',

  TRUST_PROFILES: '/admin/trust/profiles',

  TRUST_PROFILE: (memberPublicId: string) =>
    `/admin/trust/profiles/${encodeURIComponent(memberPublicId)}`,

  TRUST_RATINGS: '/admin/trust/ratings',

  TRUST_REVIEWS: '/admin/trust/reviews',

  TRUST_BADGES: '/admin/trust/badges',

  TRUST_EVENTS: '/admin/trust/events',

  // ---------------------------------------------------------------------------
  // Journey Operations
  // ---------------------------------------------------------------------------

  JOURNEYS: '/admin/journeys',

  JOURNEY: (journeyPublicId: string) =>
    `/admin/journeys/${encodeURIComponent(journeyPublicId)}`,

  // ---------------------------------------------------------------------------
  // Booking Operations
  // ---------------------------------------------------------------------------

  BOOKINGS: '/admin/bookings',

  BOOKING: (bookingPublicId: string) =>
    `/admin/bookings/${encodeURIComponent(bookingPublicId)}`,

  BOOKING_CANCELLATIONS: '/admin/bookings/cancellations',

  // ---------------------------------------------------------------------------
  // Journey Boarding
  // ---------------------------------------------------------------------------

  BOARDING: '/admin/boarding',

  BOARDING_JOURNEY: (journeyPublicId: string) =>
    `/admin/boarding/${encodeURIComponent(journeyPublicId)}`,

  // ---------------------------------------------------------------------------
  // Financial Oversight
  // ---------------------------------------------------------------------------

  PAYMENTS: '/admin/payments',

  PAYMENT: (bookingPublicId: string) =>
    `/admin/payments/${encodeURIComponent(bookingPublicId)}`,

  TRANSACTIONS: '/admin/transactions',

  TRANSACTION: (transactionPublicId: string) =>
    `/admin/transactions/${encodeURIComponent(transactionPublicId)}`,

  // ---------------------------------------------------------------------------
  // Asset Management
  // ---------------------------------------------------------------------------

  ASSETS: '/admin/assets',

  ASSET: (assetPublicId: string) =>
    `/admin/assets/${encodeURIComponent(assetPublicId)}`,

  // ---------------------------------------------------------------------------
  // Authentication and Security
  // ---------------------------------------------------------------------------

  AUTHENTICATIONS: '/admin/security/authentications',

  AUTHENTICATION: (authenticationPublicId: string) =>
    `/admin/security/authentications/${encodeURIComponent(authenticationPublicId)}`,

  SESSIONS: '/admin/security/sessions',

  SESSION: (sessionPublicId: string) =>
    `/admin/security/sessions/${encodeURIComponent(sessionPublicId)}`,

  DEVICES: '/admin/security/devices',

  DEVICE: (devicePublicId: string) =>
    `/admin/security/devices/${encodeURIComponent(devicePublicId)}`,

  RECOVERIES: '/admin/security/recoveries',

  // ---------------------------------------------------------------------------
  // Access Control
  // ---------------------------------------------------------------------------

  ROLES: '/admin/access-control/roles',

  ROLE: (rolePublicId: string) =>
    `/admin/access-control/roles/${encodeURIComponent(rolePublicId)}`,

  PERMISSIONS: '/admin/access-control/permissions',

  PERMISSION: (permissionPublicId: string) =>
    `/admin/access-control/permissions/${encodeURIComponent(permissionPublicId)}`,

  IDENTITY_ROLES: '/admin/access-control/assignments',

  IDENTITY_ROLE: (identityRolePublicId: string) =>
    `/admin/access-control/assignments/${encodeURIComponent(identityRolePublicId)}`,

  // ---------------------------------------------------------------------------
  // Audit and Operational Monitoring
  // ---------------------------------------------------------------------------

  AUDIT_LOG: '/admin/audit-log',

} as const;

// -----------------------------------------------------------------------------
// Route Type
// -----------------------------------------------------------------------------

type AdminRouteValue =
  (typeof ADMIN_ROUTES)[keyof typeof ADMIN_ROUTES];

export type AdminRoute = Extract<AdminRouteValue, string>;
