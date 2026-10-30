
import type { AdminPaymentMethod } from './admin-payment-method.model';

import type {
  AdminPaymentMethodOperation,
  AdminPaymentMethodOperationStatus,
} from './admin-payment-method.enums';

/**
 * Shared metadata for auditable operation requests.
 *
 * Correlation and causation identifiers should follow the application's
 * existing request-context conventions.
 */
export interface AdminPaymentMethodOperationMetadata {
  correlationId: string;
  causationId?: string;
}

/** Request to make a registered payment method the account default. */
export interface SetDefaultAdminPaymentMethodRequest
  extends AdminPaymentMethodOperationMetadata {
  defaultedAt?: string;
}

/** Request to deactivate a registered payment method. */
export interface DeactivateAdminPaymentMethodRequest
  extends AdminPaymentMethodOperationMetadata {
  deactivatedAt?: string;
}

/** Operation request payloads supported by the admin feature. */
export interface AdminPaymentMethodOperationRequests {
  'set-default': SetDefaultAdminPaymentMethodRequest;
  deactivate: DeactivateAdminPaymentMethodRequest;
}

/** State of an operation currently displayed by the admin UI. */
export interface AdminPaymentMethodOperationState {
  operation: AdminPaymentMethodOperation | null;
  status: AdminPaymentMethodOperationStatus;
  paymentMethodPublicId: string | null;
  message: string | null;
  error: string | null;
}

/** Result of a successful operation returning a payment-method response. */
export interface AdminPaymentMethodOperationResult {
  operation: AdminPaymentMethodOperation;
  paymentMethod: AdminPaymentMethod;
  completedAt: string;
}

/** Initial state for operation dialogs and feedback components. */
export const INITIAL_ADMIN_PAYMENT_METHOD_OPERATION_STATE: AdminPaymentMethodOperationState =
  {
    operation: null,
    status: 'idle',
    paymentMethodPublicId: null,
    message: null,
    error: null,
  };

/** Human-readable operation labels for admin controls. */
export const ADMIN_PAYMENT_METHOD_OPERATION_LABELS: Record<
  AdminPaymentMethodOperation,
  string
> = {
  'set-default': 'Set as default',
  deactivate: 'Deactivate payment method',
};
