
'use client';

// -----------------------------------------------------------------------------
// sisiMove — Get My Financial Transactions Hook
// -----------------------------------------------------------------------------
//
// React hook for retrieving the authenticated user's Financial Transactions.
//
// The API layer handles HTTP communication and response mapping.
// This hook owns client-side loading, data, and error state.
//
// Account ownership and authorization remain backend responsibilities.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------

import {
  useCallback,
  useState,
} from 'react';

// -----------------------------------------------------------------------------
// Financial Transaction — API
// -----------------------------------------------------------------------------

import {
  getMyFinancialTransactions,
} from '../api';

// -----------------------------------------------------------------------------
// Financial Transaction — Models
// -----------------------------------------------------------------------------

import type {
  FinancialTransaction,
} from '../models';

// =============================================================================
// Hook State
// =============================================================================

export interface UseMyFinancialTransactionsState {
  readonly isLoading: boolean;

  readonly data: FinancialTransaction[];

  readonly error: Error | null;
}

// =============================================================================
// Hook Result
// =============================================================================

export interface UseMyFinancialTransactionsResult
  extends UseMyFinancialTransactionsState {
  readonly getTransactions: () => Promise<FinancialTransaction[]>;

  readonly reset: () => void;
}

// =============================================================================
// Hook
// =============================================================================

export function useMyFinancialTransactions():
  UseMyFinancialTransactionsResult {
  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState<FinancialTransaction[]>([]);

  const [error, setError] = useState<Error | null>(null);

  // ---------------------------------------------------------------------------
  // Get My Transactions
  // ---------------------------------------------------------------------------

  const getTransactions = useCallback(
    async (): Promise<FinancialTransaction[]> => {
      setIsLoading(true);
      setData([]);
      setError(null);

      try {
        const response = await getMyFinancialTransactions();

        setData(response);

        return response;
      } catch (caughtError) {
        const requestError =
          caughtError instanceof Error
            ? caughtError
            : new Error(
                'Unable to retrieve your financial transactions.',
              );

        setError(requestError);

        throw requestError;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // ---------------------------------------------------------------------------
  // Reset
  // ---------------------------------------------------------------------------

  const reset = useCallback((): void => {
    setIsLoading(false);
    setData([]);
    setError(null);
  }, []);

  // ---------------------------------------------------------------------------
  // Result
  // ---------------------------------------------------------------------------

  return {
    isLoading,
    data,
    error,
    getTransactions,
    reset,
  };
}
