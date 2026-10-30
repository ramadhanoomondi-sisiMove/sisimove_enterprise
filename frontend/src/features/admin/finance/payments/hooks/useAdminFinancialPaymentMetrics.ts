// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Payment Metrics Hook
// -----------------------------------------------------------------------------

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { adminFinancialPaymentsApi } from '../api';

import type {
  AdminFinancialPayment,
  AdminFinancialPaymentAttemptStatus,
  AdminFinancialPaymentStatus,
  AdminFinancialPaymentMetrics,
} from '../models';

import {
  EMPTY_ADMIN_FINANCIAL_PAYMENT_METRICS,
} from '../models';

import { adminFinancialPaymentKeys } from './useAdminFinancialPayments';

// -----------------------------------------------------------------------------
// Metrics Calculation
// -----------------------------------------------------------------------------

function calculatePaymentMetrics(
  payments: AdminFinancialPayment[],
): AdminFinancialPaymentMetrics {
  const paymentCountsByStatus: Partial<
    Record<AdminFinancialPaymentStatus, number>
  > = {};

  const attemptCountsByStatus: Partial<
    Record<AdminFinancialPaymentAttemptStatus, number>
  > = {};

  const currencyMetrics = new Map<
    string,
    {
      currency: string;
      totalAmount: number;
      succeededAmount: number;
      failedAmount: number;
      paymentCount: number;
    }
  >();

  const dailyMetrics = new Map<
    string,
    {
      date: string;
      paymentCount: number;
      succeededCount: number;
      failedCount: number;
    }
  >();

  let pendingPayments = 0;
  let processingPayments = 0;
  let succeededPayments = 0;
  let failedPayments = 0;
  let cancelledPayments = 0;
  let expiredPayments = 0;
  let totalAttempts = 0;

  for (const payment of payments) {
    paymentCountsByStatus[payment.status] =
      (paymentCountsByStatus[payment.status] ?? 0) + 1;

    switch (payment.status) {
      case 'pending':
        pendingPayments++;
        break;
      case 'processing':
        processingPayments++;
        break;
      case 'succeeded':
        succeededPayments++;
        break;
      case 'failed':
        failedPayments++;
        break;
      case 'cancelled':
        cancelledPayments++;
        break;
      case 'expired':
        expiredPayments++;
        break;
    }

    const currency = payment.currency.toUpperCase();

    const currencyMetric = currencyMetrics.get(currency) ?? {
      currency,
      totalAmount: 0,
      succeededAmount: 0,
      failedAmount: 0,
      paymentCount: 0,
    };

    currencyMetric.totalAmount += payment.amount;
    currencyMetric.paymentCount++;

    if (payment.status === 'succeeded') {
      currencyMetric.succeededAmount += payment.amount;
    }

    if (payment.status === 'failed') {
      currencyMetric.failedAmount += payment.amount;
    }

    currencyMetrics.set(currency, currencyMetric);

    const date = payment.createdAt.slice(0, 10);

    const dailyMetric = dailyMetrics.get(date) ?? {
      date,
      paymentCount: 0,
      succeededCount: 0,
      failedCount: 0,
    };

    dailyMetric.paymentCount++;

    if (payment.status === 'succeeded') {
      dailyMetric.succeededCount++;
    }

    if (payment.status === 'failed') {
      dailyMetric.failedCount++;
    }

    dailyMetrics.set(date, dailyMetric);

    for (const attempt of payment.attempts) {
      totalAttempts++;

      attemptCountsByStatus[attempt.status] =
        (attemptCountsByStatus[attempt.status] ?? 0) + 1;
    }
  }

  return {
    totalPayments: payments.length,
    pendingPayments,
    processingPayments,
    succeededPayments,
    failedPayments,
    cancelledPayments,
    expiredPayments,
    totalAttempts,
    paymentCountsByStatus,
    attemptCountsByStatus,
    amountsByCurrency: [...currencyMetrics.values()].sort(
      (a, b) => a.currency.localeCompare(b.currency),
    ),
    trend: [...dailyMetrics.values()].sort(
      (a, b) => a.date.localeCompare(b.date),
    ),
    generatedAt: new Date().toISOString(),
  };
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useAdminFinancialPaymentMetrics() {
  const query = useQuery({
    queryKey: adminFinancialPaymentKeys.list(),
    queryFn: () => adminFinancialPaymentsApi.getAll(),
  });

  const metrics = useMemo(
    () =>
      query.data
        ? calculatePaymentMetrics(query.data)
        : EMPTY_ADMIN_FINANCIAL_PAYMENT_METRICS,
    [query.data],
  );

  return {
    metrics,
    query,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}