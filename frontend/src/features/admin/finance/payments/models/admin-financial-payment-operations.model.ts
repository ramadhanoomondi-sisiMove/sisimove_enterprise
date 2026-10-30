import type {
  AdminFinancialPaymentOperation,
} from './admin-financial-payment.enums';

/**
 * Frontend state for an operation being performed on a payment.
 */
export type AdminFinancialPaymentOperationState =
  | 'idle'
  | 'confirming'
  | 'submitting'
  | 'success'
  | 'error';

export interface AdminFinancialPaymentOperationRequest {
  paymentPublicId: string;

  operation: AdminFinancialPaymentOperation;
}

/**
 * Presentation metadata for operation confirmation dialogs.
 * This does not define the backend request body.
 */
export interface AdminFinancialPaymentOperationDefinition {
  operation: AdminFinancialPaymentOperation;

  title: string;

  description: string;

  confirmLabel: string;

  destructive: boolean;
}

export const ADMIN_FINANCIAL_PAYMENT_OPERATION_DEFINITIONS: Record<
  AdminFinancialPaymentOperation,
  AdminFinancialPaymentOperationDefinition
> = {
  process: {
    operation: 'process',
    title: 'Process payment',
    description: 'Request processing for this payment.',
    confirmLabel: 'Process payment',
    destructive: false,
  },

  succeed: {
    operation: 'succeed',
    title: 'Mark payment as succeeded',
    description:
      'Confirm that the payment has succeeded. Verify the payment outcome before proceeding.',
    confirmLabel: 'Mark as succeeded',
    destructive: false,
  },

  fail: {
    operation: 'fail',
    title: 'Mark payment as failed',
    description:
      'Record the payment as failed. Ensure this action reflects the actual payment outcome.',
    confirmLabel: 'Mark as failed',
    destructive: true,
  },

  cancel: {
    operation: 'cancel',
    title: 'Cancel payment',
    description: 'Confirm cancellation of this payment.',
    confirmLabel: 'Cancel payment',
    destructive: true,
  },

  expire: {
    operation: 'expire',
    title: 'Expire payment',
    description: 'Confirm that this payment should be marked as expired.',
    confirmLabel: 'Expire payment',
    destructive: true,
  },

  'create-transaction': {
    operation: 'create-transaction',
    title: 'Create transaction',
    description:
      'Create or associate a transaction for this payment according to the backend contract.',
    confirmLabel: 'Continue',
    destructive: false,
  },
};

export interface AdminFinancialPaymentOperationFeedback {
  state: AdminFinancialPaymentOperationState;

  message?: string;

  operation?: AdminFinancialPaymentOperation;

  paymentPublicId?: string;
}