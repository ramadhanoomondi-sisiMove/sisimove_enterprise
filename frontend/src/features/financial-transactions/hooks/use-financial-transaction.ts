
'use client';

// -----------------------------------------------------------------------------
// sisiMove — Financial Transaction Hook
// -----------------------------------------------------------------------------
//
// React hook for retrieving a single Financial Transaction.
//
// The API layer handles HTTP communication and response mapping.
// This hook owns client-side loading, data, and error state.
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
  getFinancialTransaction,
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

export interface UseFinancialTransactionState {
  readonly isLoading: boolean;

  readonly data: FinancialTransaction | null;

  readonly error: Error | null;
}

// =============================================================================
// Hook Result
// =============================================================================

export interface UseFinancialTransactionResult
  extends UseFinancialTransactionState {
  readonly getTransaction: (
    transactionPublicId: string,
  ) => Promise<FinancialTransaction | null>;

  readonly reset: () => void;
}

// =============================================================================
// Hook
// =============================================================================

export function useFinancialTransaction():
  UseFinancialTransactionResult {
  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] =
    useState<FinancialTransaction | null>(null);

  const [error, setError] = useState<Error | null>(null);

  // ---------------------------------------------------------------------------
  // Get Financial Transaction
  // ---------------------------------------------------------------------------

  const getTransaction = useCallback(
    async (
      transactionPublicId: string,
    ): Promise<FinancialTransaction | null> => {
      setIsLoading(true);
      setData(null);
      setError(null);

      try {
        const response =
          await getFinancialTransaction(transactionPublicId);

        setData(response);

        return response;
      } catch (caughtError) {
        const requestError =
          caughtError instanceof Error
            ? caughtError
            : new Error(
                'Unable to retrieve the financial transaction.',
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
    setData(null);
    setError(null);
  }, []);

  // ---------------------------------------------------------------------------
  // Result
  // ---------------------------------------------------------------------------

  return {
    isLoading,
    data,
    error,
    getTransaction,
    reset,
  };
}
