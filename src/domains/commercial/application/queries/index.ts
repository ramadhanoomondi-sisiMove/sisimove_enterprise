// =============================================================================
// COMMERCIAL DOMAIN
// =============================================================================
// Application / Queries
//
// Query Barrel
//
// Central export surface for all Commercial application queries.
//
// =============================================================================

// -----------------------------------------------------------------------------
// Commercial Commission Rule
// -----------------------------------------------------------------------------

export { default as GetCommercialCommissionRuleQuery } from './get-commercial-commission-rule.query';

export { default as GetCommercialCommissionRuleByTypeQuery } from './get-commercial-commission-rule-by-type.query';

export { default as GetActiveCommercialCommissionRuleQuery } from './get-active-commercial-commission-rule.query';

export { default as ListCommercialCommissionRulesQuery } from './list-commercial-commission-rules.query';

// -----------------------------------------------------------------------------
// Commercial Booking Commission
// -----------------------------------------------------------------------------

export { default as GetCommercialBookingCommissionQuery } from './get-commercial-booking-commission.query';

export { default as GetCommercialBookingCommissionByBookingQuery } from './get-commercial-booking-commission-by-booking.query';

export { default as GetCommercialBookingCommissionByJourneyQuery } from './get-commercial-booking-commissions-by-journey.query';

export { default as ListCommercialBookingCommissionsQuery } from './list-commercial-booking-commissions.query';

// -----------------------------------------------------------------------------
// Commercial Earning Commission
// -----------------------------------------------------------------------------

export { default as GetCommercialEarningCommissionQuery } from './get-commercial-earning-commission.query';

export { default as GetCommercialEarningCommissionBySettlementQuery } from './get-commercial-earning-commission-by-settlement.query';

export { default as GetCommercialEarningCommissionsByJourneyQuery } from './get-commercial-earning-commissions-by-journey.query';

export { default as GetCommercialEarningCommissionsByProviderQuery } from './get-commercial-earning-commissions-by-provider.query';

export { default as ListCommercialEarningCommissionsQuery } from './list-commercial-earning-commissions.query';
