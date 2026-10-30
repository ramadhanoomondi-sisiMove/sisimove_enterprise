
 // -----------------------------------------------------------------------------
 // sisiMove Admin — Payment Methods API Public Exports
 // -----------------------------------------------------------------------------

export {
  AdminPaymentMethodsApi,
  adminPaymentMethodsApi,
  default,
} from './admin-payment-methods.api';

export type {
  AddAdminPaymentMethodPayload,
  AdminSetDefaultPaymentMethodPayload,
  AdminDeactivatePaymentMethodPayload,
} from './admin-payment-methods.api';

export {
  ADMIN_PAYMENT_METHODS_ENDPOINTS,
} from './admin-payment-methods.endpoints';

export {
  default as defaultAdminPaymentMethodsEndpoints,
} from './admin-payment-methods.endpoints';
