//src/domains/commercial/domain/exception/index.ts
// -----------------------------------------------------------------------------
// Commercial Domain Exceptions
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Root Exceptions
// -----------------------------------------------------------------------------

export { CommercialException } from './commercial.exception';

export { CommercialInvariantException } from './commercial-invariant.exception';

export { CommercialInvalidStatusTransitionException } from './commercial-invalid-status-transition.exception';

// -----------------------------------------------------------------------------
// Commercial Commission Rule Exceptions
// -----------------------------------------------------------------------------

export { CommercialCommissionRuleNotFoundException } from './commercial-commission-rule-not-found.exception';

export { CommercialCommissionRuleInvalidPercentageException } from './commercial-commission-rule-invalid-percentage.exception';

export { CommercialCommissionRuleInvalidPeriodException } from './commercial-commission-rule-invalid-period.exception';

export { CommercialCommissionRuleInvalidVersionException } from './commercial-commission-rule-invalid-version.exception';

export { CommercialCommissionRuleOverlapException } from './commercial-commission-rule-overlap.exception';

export { CommercialCommissionRuleAlreadyActiveException } from './commercial-commission-rule-already-active.exception';

export { CommercialCommissionRuleAlreadyInactiveException } from './commercial-commission-rule-already-inactive.exception';

export { CommercialCommissionRuleCannotModifyActiveException } from './commercial-commission-rule-cannot-modify-active.exception';

// -----------------------------------------------------------------------------
// Commercial Booking Commission Exceptions
// -----------------------------------------------------------------------------

export { CommercialBookingCommissionNotFoundException } from './commercial-booking-commission-not-found.exception';

export { CommercialBookingCommissionAlreadyExistsException } from './commercial-booking-commission-already-exists.exception';

export { CommercialBookingCommissionAlreadyAssessedException } from './commercial-booking-commission-already-assessed.exception';

export { CommercialBookingCommissionAlreadyCancelledException } from './commercial-booking-commission-already-cancelled.exception';

export { CommercialBookingCommissionInvalidBaseAmountException } from './commercial-booking-commission-invalid-base-amount.exception';

export { CommercialBookingCommissionInvalidAmountException } from './commercial-booking-commission-invalid-amount.exception';

export { CommercialBookingCommissionCannotAssessException } from './commercial-booking-commission-cannot-assess.exception';

export { CommercialBookingCommissionCannotCancelException } from './commercial-booking-commission-cannot-cancel.exception';

// -----------------------------------------------------------------------------
// Commercial Earning Commission Exceptions
// -----------------------------------------------------------------------------

export { CommercialEarningCommissionNotFoundException } from './commercial-earning-commission-not-found.exception';

export { CommercialEarningCommissionAlreadyExistsException } from './commercial-earning-commission-already-exists.exception';

export { CommercialEarningCommissionAlreadyAssessedException } from './commercial-earning-commission-already-assessed.exception';

export { CommercialEarningCommissionAlreadyCancelledException } from './commercial-earning-commission-already-cancelled.exception';

export { CommercialEarningCommissionInvalidBaseAmountException } from './commercial-earning-commission-invalid-base-amount.exception';

export { CommercialEarningCommissionInvalidAmountException } from './commercial-earning-commission-invalid-amount.exception';

export { CommercialEarningCommissionInvalidNetAmountException } from './commercial-earning-commission-invalid-net-amount.exception';

export { CommercialEarningCommissionCannotAssessException } from './commercial-earning-commission-cannot-assess.exception';

export { CommercialEarningCommissionCannotCancelException } from './commercial-earning-commission-cannot-cancel.exception';
export { CommercialCommissionRuleAlreadyExistsException } from './commercial-commission-rule-already-exists.exception';
