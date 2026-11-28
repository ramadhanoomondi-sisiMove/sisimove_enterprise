// /src/features/admin/commissions/api/admin-commissions.endpoints.ts
// -----------------------------------------------------------------------------
// sisiMove Admin — Commission API Endpoints
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Define backend route paths for commission resources.
// - Centralize resource and action endpoint construction.
//
// Non-responsibilities:
// - HTTP execution.
// - Authentication.
// - Request payload construction.
// - Response mapping.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Booking Commissions
// -----------------------------------------------------------------------------

const BOOKING_COMMISSIONS = '/commercial-booking-commissions';

const bookingCommissionById = (publicId: string): string =>
  `${BOOKING_COMMISSIONS}/${encodeURIComponent(publicId)}`;

const bookingCommissionByBooking = `${BOOKING_COMMISSIONS}/by-booking`;

const bookingCommissionsByJourney = `${BOOKING_COMMISSIONS}/by-journey`;

// -----------------------------------------------------------------------------
// Earning Commissions
// -----------------------------------------------------------------------------

const EARNING_COMMISSIONS = '/commercial-earning-commissions';

const earningCommissionById = (publicId: string): string =>
  `${EARNING_COMMISSIONS}/${encodeURIComponent(publicId)}`;

const earningCommissionBySettlement = `${EARNING_COMMISSIONS}/by-settlement`;

const earningCommissionsByJourney = `${EARNING_COMMISSIONS}/by-journey`;

const earningCommissionsByProvider = `${EARNING_COMMISSIONS}/by-provider`;

// -----------------------------------------------------------------------------
// Commission Rules
// -----------------------------------------------------------------------------

const COMMISSION_RULES = '/commercial-commission-rules';

const commissionRuleById = (publicId: string): string =>
  `${COMMISSION_RULES}/${encodeURIComponent(publicId)}`;

const activeCommissionRule = `${COMMISSION_RULES}/active`;

const commissionRuleByType = `${COMMISSION_RULES}/by-type`;

const updateCommissionRule = (publicId: string): string =>
  `${commissionRuleById(publicId)}/update`;

const activateCommissionRule = (publicId: string): string =>
  `${commissionRuleById(publicId)}/activate`;

const deactivateCommissionRule = (publicId: string): string =>
  `${commissionRuleById(publicId)}/deactivate`;

// -----------------------------------------------------------------------------
// Public Endpoints
// -----------------------------------------------------------------------------

export const ADMIN_COMMISSIONS_ENDPOINTS = {
  bookingCommissions: {
    base: BOOKING_COMMISSIONS,
    byId: bookingCommissionById,
    byBooking: bookingCommissionByBooking,
    byJourney: bookingCommissionsByJourney,
    assess: (publicId: string) =>
      `${bookingCommissionById(publicId)}/assess`,
    cancel: (publicId: string) =>
      `${bookingCommissionById(publicId)}/cancel`,
  },

  earningCommissions: {
    base: EARNING_COMMISSIONS,
    byId: earningCommissionById,
    bySettlement: earningCommissionBySettlement,
    byJourney: earningCommissionsByJourney,
    byProvider: earningCommissionsByProvider,
    assess: (publicId: string) =>
      `${earningCommissionById(publicId)}/assess`,
    cancel: (publicId: string) =>
      `${earningCommissionById(publicId)}/cancel`,
  },

  commissionRules: {
    base: COMMISSION_RULES,
    byId: commissionRuleById,
    active: activeCommissionRule,
    byType: commissionRuleByType,
    update: updateCommissionRule,
    activate: activateCommissionRule,
    deactivate: deactivateCommissionRule,
  },
} as const;