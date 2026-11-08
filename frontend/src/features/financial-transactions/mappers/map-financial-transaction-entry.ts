
import type {
  FinancialTransactionEntry,
} from '../models';

// =============================================================================
// Backend Response Shape
// =============================================================================

export interface FinancialTransactionEntryResponse {
  readonly publicId: string;
  readonly accountPublicId: string;
  readonly type: FinancialTransactionEntry['type'];
  readonly balanceType: FinancialTransactionEntry['balanceType'];
  readonly amount: number;
  readonly currency: string;
  readonly createdAt: string;
}

// =============================================================================
// Mapper
// =============================================================================

export function mapFinancialTransactionEntry(
  response: FinancialTransactionEntryResponse,
): FinancialTransactionEntry {
  return {
    publicId: response.publicId,
    accountPublicId: response.accountPublicId,
    type: response.type,
    balanceType: response.balanceType,
    amount: response.amount,
    currency: response.currency,
    createdAt: response.createdAt,
  };
}
