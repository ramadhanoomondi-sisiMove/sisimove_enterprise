// -----------------------------------------------------------------------------
// sisiMove — Get Financial Transaction Hook
// -----------------------------------------------------------------------------
//
// React hook for executing the Financial Transaction detail API operation.
//
// Flow:
//
//     FinancialTransactionView
//          │
//          ▼
//     useFinancialTransaction()
//          │
//          ▼
//     getFinancialTransaction()
//          │
//          ▼
//     authenticatedApiClient
//          │
//          ▼
//     GET /financial-transactions/:transactionPublicId
//
// This hook owns the client-side execution state of the transaction retrieval
// request.
//
// It does NOT own:
//
// - authorization decisions;
// - transaction visibility rules;
// - transaction business logic;
// - financial calculations;
// - transaction mutation;
// - account balance management;
// - navigation;
// - UI presentation.
//
// Authorization remains a backend concern through:
//
//     financial-transaction:read
//
// The backend currently exposes only single-transaction retrieval for this
// controller. No collection or "my transactions" endpoint is assumed.
//
// -----------------------------------------------------------------------------

'use client';

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
  /**
   * Indicates whether a transaction retrieval request is currently running.
   */
  readonly isLoading: boolean;

  /**
   * Successfully retrieved Financial Transaction.
   *
   * Reset when a subsequent retrieval begins.
   */
  readonly data: FinancialTransaction | null;

  /**
   * Error produced by the transaction retrieval request.
   *
   * Reset when a subsequent retrieval begins.
   */
  readonly error: Error | null;
}

// =============================================================================
// Hook Result
// =============================================================================

export interface UseFinancialTransactionResult
  extends UseFinancialTransactionState {
  /**
   * Retrieves a Financial Transaction by its public identifier.
   *
   * The public identifier must already be available to the consuming
   * application surface.
   */
  readonly getTransaction: (
    transactionPublicId: string,
  ) => Promise<FinancialTransaction | null>;

  /**
   * Clears the current transaction result, loading state, and error.
   *
   * This does not perform another API request.
   */
  readonly reset: () => void;
}

// =============================================================================
// Hook
// =============================================================================

export function useFinancialTransaction(): UseFinancialTransactionResult {
  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] =
    useState<FinancialTransaction | null>(null);

  const [error, setError] = useState<Error | null>(null);

  // ---------------------------------------------------------------------------
  // Get Transaction
  // ---------------------------------------------------------------------------
  //
  // A new request clears the previous result/error before execution.
  //
  // The error is retained in hook state and also re-thrown so the consuming
  // surface can perform request-specific behavior when required.
  //
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
        const error =
          caughtError instanceof Error
            ? caughtError
            : new Error(
                'Unable to retrieve the financial transaction.',
              );

        setError(error);

        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // ---------------------------------------------------------------------------
  // Reset
  // ---------------------------------------------------------------------------

  const reset = useCallback(() => {
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

