// =============================================================================
// sisiMove — Financial Payment Methods API Barrel
// =============================================================================
//
// Public API exports for the financial-payment-methods feature.
//
// The exports correspond exactly to the backend controller contract:
//
//     GET  /financial-payment-methods/:paymentMethodPublicId
//     GET  /financial-payment-methods/accounts/:accountPublicId/default
//     POST /financial-payment-methods
//     POST /financial-payment-methods/:paymentMethodPublicId/default
//     POST /financial-payment-methods/:paymentMethodPublicId/deactivate
//
// No generic list, update, or delete operation is exposed because the backend
// controller does not provide those endpoints.
//
// =============================================================================

export {
  getPaymentMethod,
} from './get-payment-method.api';

export {
  getDefaultPaymentMethod,
} from './get-default-payment-method.api';

export {
  createPaymentMethod,
} from './create-payment-method.api';

export {
  setDefaultPaymentMethod,
  type SetDefaultPaymentMethodRequest,
} from './set-default-payment-method.api';

export {
  deactivatePaymentMethod,
  type DeactivatePaymentMethodRequest,
} from './deactivate-payment-method.api';

