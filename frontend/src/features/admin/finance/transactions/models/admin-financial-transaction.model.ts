export interface AdminFinancialTransactionEntry {
  publicId: string;
  accountPublicId: string;
  type: string;
  balanceType: string;
  amount: number;
  currency: string;
  createdAt: string;
}

export interface AdminFinancialTransaction {
  publicId: string;

  type: string;
  status: string;

  /**
   * Integer amount in the currency's minor units.
   * Format using the currency's minor-unit rules.
   */
  amount: number;
  currency: string;

  sourceAccountPublicId?: string;
  destinationAccountPublicId?: string;

  /**
   * Serialized business reference, e.g. TYPE:PUBLIC_ID.
   */
  reference?: string;

  accountingJournalPublicId?: string;

  entries: AdminFinancialTransactionEntry[];

  completedAt?: string;
  failedAt?: string;
  reversedAt?: string;
  cancelledAt?: string;

  createdAt: string;
  updatedAt: string;
}

export type AdminFinancialTransactionPublicId = string;