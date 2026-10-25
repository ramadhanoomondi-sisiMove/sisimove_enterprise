import type {
  AdminFinancialTransaction,
} from './admin-financial-transaction.model';

import type {
  AdminFinancialTransactionOperation,
} from './admin-financial-transaction.enums';

export interface AdminFinancialTransactionOperationBase {
  correlationId: string;
  causationId?: string;
}

export type CompleteAdminFinancialTransactionPayload = AdminFinancialTransactionOperationBase

export interface FailAdminFinancialTransactionPayload
  extends AdminFinancialTransactionOperationBase {
  reason: string;
}

export interface ReverseAdminFinancialTransactionPayload
  extends AdminFinancialTransactionOperationBase {
  reason: string;
}

export interface CancelAdminFinancialTransactionPayload
  extends AdminFinancialTransactionOperationBase {
  reason: string;
}

export type AdminFinancialTransactionOperationPayload =
  | {
      operation: AdminFinancialTransactionOperation.COMPLETE;
      payload: CompleteAdminFinancialTransactionPayload;
    }
  | {
      operation: AdminFinancialTransactionOperation.FAIL;
      payload: FailAdminFinancialTransactionPayload;
    }
  | {
      operation: AdminFinancialTransactionOperation.REVERSE;
      payload: ReverseAdminFinancialTransactionPayload;
    }
  | {
      operation: AdminFinancialTransactionOperation.CANCEL;
      payload: CancelAdminFinancialTransactionPayload;
    };

export type AdminFinancialTransactionOperationResult =
  | {
      status: 'success';
      operation: AdminFinancialTransactionOperation;
      transaction: AdminFinancialTransaction;
    }
  | {
      status: 'error';
      operation: AdminFinancialTransactionOperation;
      message: string;
    };

export interface AdminFinancialTransactionOperationDialogState {
  open: boolean;
  operation: AdminFinancialTransactionOperation | null;
  transactionPublicId: string | null;
  reason: string;
  isSubmitting: boolean;
  error: string | null;
}