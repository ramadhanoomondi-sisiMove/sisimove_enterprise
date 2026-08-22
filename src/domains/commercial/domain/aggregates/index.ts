// -----------------------------------------------------------------------------
// Commercial Aggregates
// -----------------------------------------------------------------------------
//
// Barrel exports for the Commercial bounded context aggregate roots.
//
// Commercial intentionally contains multiple independent aggregate roots.
// There is NO parent CommercialAggregate.
//
// Aggregate roots:
//
// - CommercialCommissionRuleAggregate
// - CommercialBookingCommissionAggregate
// - CommercialEarningCommissionAggregate
//
// -----------------------------------------------------------------------------

export { CommercialCommissionRuleAggregate } from './commercial-commission-rule.aggregate';

export { CommercialBookingCommissionAggregate } from './commercial-booking-commission.aggregate';

export { CommercialEarningCommissionAggregate } from './commercial-earning-commission.aggregate';
