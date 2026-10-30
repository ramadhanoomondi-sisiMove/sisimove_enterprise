
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
 * - Financial oversight and accounting
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
 * It does NOT authenticate users, authorize administrators, enforce permissions,
 * perform navigation, redirect users, or fetch/mutate application data.
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

  TRUST_MODERATION: '/admin/trust/moderation',

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
  // Finance Control Center
  // ---------------------------------------------------------------------------

  FINANCE_HOME: '/admin/finance',

  FINANCE_ACCOUNTS: '/admin/finance/accounts',

  FINANCE_ACCOUNT: (accountPublicId: string) =>
    `/admin/finance/accounts/${encodeURIComponent(accountPublicId)}`,

  // ---------------------------------------------------------------------------
  // Payments
  // ---------------------------------------------------------------------------

  FINANCE_PAYMENTS: '/admin/finance/payments',

  FINANCE_PAYMENT: (paymentPublicId: string) =>
    `/admin/finance/payments/${encodeURIComponent(paymentPublicId)}`,

  FINANCE_PAYMENT_ATTEMPTS: (paymentPublicId: string) =>
    `/admin/finance/payments/${encodeURIComponent(paymentPublicId)}/attempts`,

  // ---------------------------------------------------------------------------
  // Payment Methods
  // ---------------------------------------------------------------------------

  FINANCE_PAYMENT_METHODS: '/admin/finance/payment-methods',

  FINANCE_PAYMENT_METHOD: (paymentMethodPublicId: string) =>
    `/admin/finance/payment-methods/${encodeURIComponent(paymentMethodPublicId)}`,

  // ---------------------------------------------------------------------------
  // Payment Providers
  // ---------------------------------------------------------------------------

  FINANCE_PROVIDERS: '/admin/finance/providers',

  FINANCE_PROVIDER: (providerPublicId: string) =>
    `/admin/finance/providers/${encodeURIComponent(providerPublicId)}`,

  // ---------------------------------------------------------------------------
  // Transactions
  // ---------------------------------------------------------------------------

  FINANCE_TRANSACTIONS: '/admin/finance/transactions',

  FINANCE_TRANSACTION: (transactionPublicId: string) =>
    `/admin/finance/transactions/${encodeURIComponent(transactionPublicId)}`,

  // ---------------------------------------------------------------------------
  // Booking Payments
  // ---------------------------------------------------------------------------

  FINANCE_BOOKING_PAYMENTS: '/admin/finance/booking-payments',

  FINANCE_BOOKING_PAYMENT: (bookingPaymentPublicId: string) =>
    `/admin/finance/booking-payments/${encodeURIComponent(bookingPaymentPublicId)}`,

  // ---------------------------------------------------------------------------
  // Commissions
  // ---------------------------------------------------------------------------

  FINANCE_COMMISSIONS: '/admin/finance/commissions',

  FINANCE_COMMISSION_RULES: '/admin/finance/commissions/rules',

  FINANCE_BOOKING_COMMISSIONS: '/admin/finance/commissions/bookings',

  FINANCE_EARNING_COMMISSIONS: '/admin/finance/commissions/earnings',

  // ---------------------------------------------------------------------------
  // Settlements
  // ---------------------------------------------------------------------------

  FINANCE_SETTLEMENTS: '/admin/finance/settlements',

  FINANCE_SETTLEMENT: (settlementPublicId: string) =>
    `/admin/finance/settlements/${encodeURIComponent(settlementPublicId)}`,

  FINANCE_PROVIDER_SETTLEMENTS: '/admin/finance/provider-settlements',

  FINANCE_PROVIDER_SETTLEMENT: (settlementPublicId: string) =>
    `/admin/finance/provider-settlements/${encodeURIComponent(settlementPublicId)}`,

  // ---------------------------------------------------------------------------
  // Disbursements
  // ---------------------------------------------------------------------------

  FINANCE_DISBURSEMENTS: '/admin/finance/disbursements',

  FINANCE_DISBURSEMENT: (disbursementPublicId: string) =>
    `/admin/finance/disbursements/${encodeURIComponent(disbursementPublicId)}`,

  // ---------------------------------------------------------------------------
  // Withdrawals
  // ---------------------------------------------------------------------------

  FINANCE_WITHDRAWALS: '/admin/finance/withdrawals',

  FINANCE_WITHDRAWAL: (withdrawalPublicId: string) =>
    `/admin/finance/withdrawals/${encodeURIComponent(withdrawalPublicId)}`,

  // ---------------------------------------------------------------------------
  // Holds
  // ---------------------------------------------------------------------------

  FINANCE_HOLDS: '/admin/finance/holds',

  FINANCE_HOLD: (holdPublicId: string) =>
    `/admin/finance/holds/${encodeURIComponent(holdPublicId)}`,

  // ---------------------------------------------------------------------------
  // Accounting
  // ---------------------------------------------------------------------------

  FINANCE_ACCOUNTING: '/admin/finance/accounting',

  FINANCE_ACCOUNTING_ACCOUNTS: '/admin/finance/accounting/accounts',

  FINANCE_ACCOUNTING_PERIODS: '/admin/finance/accounting/periods',

  FINANCE_ACCOUNTING_JOURNALS: '/admin/finance/accounting/journals',

  FINANCE_ACCOUNTING_JOURNAL: (journalPublicId: string) =>
    `/admin/finance/accounting/journals/${encodeURIComponent(journalPublicId)}`,

  // ---------------------------------------------------------------------------
  // Backwards-Compatible Financial Routes
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
