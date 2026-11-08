
"use client";

import { useMemo } from "react";

import { FinancialAccountBalancePanel } from "@/components/admin/finance/accounts/balances/FinancialAccountBalancePanel";

import { useAdminFinancialAccountBalance } from "@/features/admin/finance/accounts/hooks";
import { useAdminFinancialAccountsList } from "@/features/admin/finance/accounts/hooks/useAdminFinancialAccounts";
import { useAdminFinancialTransactions } from "@/features/admin/finance/transactions/hooks";
import { useAdminFinancialPayments } from "@/features/admin/finance/payments/hooks";
import { useAdminPaymentMethods } from "@/features/admin/finance/payment-methods/hooks";

import { formatCurrencyMinorUnits } from "@/foundation/formatters/currency";

interface MemberFinancePanelProps {
  readonly identityPublicId: string;
}

function formatDate(value?: string | null): string {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function StatusLabel({ value }: { readonly value: string }) {
  return (
    <span className="inline-flex rounded-full border border-[var(--border)] px-2.5 py-1 text-xs font-medium text-[var(--foreground-secondary)]">
      {value.replaceAll("_", " ")}
    </span>
  );
}

function Section({
  title,
  description,
  children,
}: {
  readonly title: string;
  readonly description?: string;
  readonly children: React.ReactNode;
}) {
  return (
    <section className="space-y-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5">
      <div>
        <h2 className="text-base font-semibold text-[var(--foreground)]">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            {description}
          </p>
        )}
      </div>

      {children}
    </section>
  );
}

function EmptyState({ message }: { readonly message: string }) {
  return (
    <p className="rounded-md bg-[var(--background)] p-4 text-sm text-[var(--foreground-muted)]">
      {message}
    </p>
  );
}

export function MemberFinancePanel({
  identityPublicId,
}: MemberFinancePanelProps) {
  // ---------------------------------------------------------------------------
  // Financial account lookup
  // ---------------------------------------------------------------------------

  const accountsQuery = useAdminFinancialAccountsList();

  const memberAccount = useMemo(
    () =>
      accountsQuery.accounts.find(
        (account) => account.ownerPublicId === identityPublicId,
      ) ?? null,
    [accountsQuery.accounts, identityPublicId],
  );

  const accountPublicId = memberAccount?.publicId;

  // ---------------------------------------------------------------------------
  // Finance queries
  // ---------------------------------------------------------------------------

  const balanceQuery =
    useAdminFinancialAccountBalance(accountPublicId);

  const transactionsQuery = useAdminFinancialTransactions();

  const paymentsQuery = useAdminFinancialPayments();

  const paymentMethodsQuery = useAdminPaymentMethods();

  // ---------------------------------------------------------------------------
  // Member-specific records
  // ---------------------------------------------------------------------------

  const transactions = useMemo(() => {
    if (!accountPublicId) return [];

    return transactionsQuery.allTransactions
      .filter(
        (transaction) =>
          transaction.sourceAccountPublicId === accountPublicId ||
          transaction.destinationAccountPublicId === accountPublicId,
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime(),
      );
  }, [transactionsQuery.allTransactions, accountPublicId]);

  const payments = useMemo(() => {
    if (!accountPublicId) return [];

    return paymentsQuery.allPayments
      .filter((payment) => payment.accountId === accountPublicId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime(),
      );
  }, [paymentsQuery.allPayments, accountPublicId]);

  const paymentMethods = useMemo(() => {
    if (!accountPublicId) return [];

    return paymentMethodsQuery.allPaymentMethods
      .filter(
        (method) => method.accountPublicId === accountPublicId,
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime(),
      );
  }, [paymentMethodsQuery.allPaymentMethods, accountPublicId]);

  // ---------------------------------------------------------------------------
  // Account lookup states
  // ---------------------------------------------------------------------------

  if (accountsQuery.isLoading) {
    return (
      <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="text-sm text-[var(--foreground-muted)]">
          Loading member financial account…
        </p>
      </div>
    );
  }

  if (accountsQuery.isError) {
    return (
      <div
        role="alert"
        className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6"
      >
        <h2 className="font-semibold text-[var(--foreground)]">
          Unable to load financial account
        </h2>

        <p className="mt-2 text-sm text-[var(--foreground-muted)]">
          {accountsQuery.error instanceof Error
            ? accountsQuery.error.message
            : "The financial account directory could not be retrieved."}
        </p>

        <button
          type="button"
          onClick={() => void accountsQuery.refetch()}
          className="mt-4 text-sm font-medium text-[var(--primary)]"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!memberAccount) {
    return (
      <Section title="Member Finance">
        <EmptyState message="No financial account is currently linked to this member." />
      </Section>
    );
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-[var(--foreground)]">
              Financial account
            </h2>

            <p className="mt-1 text-sm text-[var(--foreground-muted)]">
              Account: {memberAccount.publicId}
            </p>
          </div>

          <StatusLabel value={memberAccount.status} />
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs text-[var(--foreground-muted)]">
              Account type
            </p>
            <p className="mt-1 text-sm font-medium text-[var(--foreground)]">
              {memberAccount.type}
            </p>
          </div>

          <div>
            <p className="text-xs text-[var(--foreground-muted)]">
              Currency
            </p>
            <p className="mt-1 text-sm font-medium text-[var(--foreground)]">
              {memberAccount.currency}
            </p>
          </div>
        </div>
      </div>

      {/* Wallet balance */}

      <Section
        title="Wallet overview"
        description="Current balance breakdown for this member's account."
      >
        {balanceQuery.isLoading && (
          <EmptyState message="Loading wallet balance…" />
        )}

        {balanceQuery.isError && (
          <div role="alert" className="space-y-2">
            <p className="text-sm text-[var(--danger)]">
              Unable to load the wallet balance.
            </p>

            <button
              type="button"
              onClick={() => void balanceQuery.refetch()}
              className="text-sm font-medium text-[var(--primary)]"
            >
              Retry balance
            </button>
          </div>
        )}

        {balanceQuery.data && (
          <FinancialAccountBalancePanel
            balance={balanceQuery.data}
            formatAmount={formatCurrencyMinorUnits}
          />
        )}
      </Section>

      {/* Transactions */}

      <Section
        title="Transactions"
        description="Transactions where this member's account is the source or destination."
      >
        {transactionsQuery.isLoading && (
          <EmptyState message="Loading transactions…" />
        )}

        {transactionsQuery.isError && (
          <div role="alert" className="space-y-2">
            <p className="text-sm text-[var(--danger)]">
              Unable to load transactions.
            </p>

            <button
              type="button"
              onClick={() => void transactionsQuery.refetch()}
              className="text-sm font-medium text-[var(--primary)]"
            >
              Retry transactions
            </button>
          </div>
        )}

        {!transactionsQuery.isLoading &&
          !transactionsQuery.isError &&
          transactions.length === 0 && (
            <EmptyState message="No transactions found for this account." />
          )}

        {transactions.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-xs text-[var(--foreground-muted)]">
                  <th className="py-3 pr-4">Date</th>
                  <th className="py-3 pr-4">Transaction</th>
                  <th className="py-3 pr-4">Reference</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3 text-right">Amount</th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((transaction) => (
                  <tr
                    key={transaction.publicId}
                    className="border-b border-[var(--border)] last:border-0"
                  >
                    <td className="py-3 pr-4 text-[var(--foreground-secondary)]">
                      {formatDate(transaction.createdAt)}
                    </td>

                    <td className="py-3 pr-4">
                      {transaction.type}
                    </td>

                    <td className="py-3 pr-4 text-[var(--foreground-secondary)]">
                      {transaction.reference ?? "—"}
                    </td>

                    <td className="py-3 pr-4">
                      <StatusLabel value={transaction.status} />
                    </td>

                    <td className="py-3 text-right font-medium">
                      {formatCurrencyMinorUnits(
                        transaction.amount,
                        transaction.currency,
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      {/* Payments */}

      <Section
        title="Payments"
        description="Payment records associated with this financial account."
      >
        {paymentsQuery.isLoading && (
          <EmptyState message="Loading payments…" />
        )}

        {paymentsQuery.isError && (
          <div role="alert" className="space-y-2">
            <p className="text-sm text-[var(--danger)]">
              Unable to load payments.
            </p>

            <button
              type="button"
              onClick={() => void paymentsQuery.refetch()}
              className="text-sm font-medium text-[var(--primary)]"
            >
              Retry payments
            </button>
          </div>
        )}

        {!paymentsQuery.isLoading &&
          !paymentsQuery.isError &&
          payments.length === 0 && (
            <EmptyState message="No payments found for this account." />
          )}

        {payments.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-xs text-[var(--foreground-muted)]">
                  <th className="py-3 pr-4">Initiated</th>
                  <th className="py-3 pr-4">Payment ID</th>
                  <th className="py-3 pr-4">Reference type</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3 text-right">Amount</th>
                </tr>
              </thead>

              <tbody>
                {payments.map((payment) => (
                  <tr
                    key={payment.publicId}
                    className="border-b border-[var(--border)] last:border-0"
                  >
                    <td className="py-3 pr-4 text-[var(--foreground-secondary)]">
                      {formatDate(payment.initiatedAt)}
                    </td>

                    <td className="py-3 pr-4">
                      {payment.publicId}
                    </td>

                    <td className="py-3 pr-4 text-[var(--foreground-secondary)]">
                      {payment.referenceType ?? "—"}
                    </td>

                    <td className="py-3 pr-4">
                      <StatusLabel value={payment.status} />
                    </td>

                    <td className="py-3 text-right font-medium">
                      {formatCurrencyMinorUnits(
                        payment.amount,
                        payment.currency,
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      {/* Payment methods */}

      <Section
        title="Payment methods"
        description="Registered payment instruments linked to this account."
      >
        {paymentMethodsQuery.isLoading && (
          <EmptyState message="Loading payment methods…" />
        )}

        {paymentMethodsQuery.isError && (
          <div role="alert" className="space-y-2">
            <p className="text-sm text-[var(--danger)]">
              Unable to load payment methods.
            </p>

            <button
              type="button"
              onClick={() => void paymentMethodsQuery.refetch()}
              className="text-sm font-medium text-[var(--primary)]"
            >
              Retry payment methods
            </button>
          </div>
        )}

        {!paymentMethodsQuery.isLoading &&
          !paymentMethodsQuery.isError &&
          paymentMethods.length === 0 && (
            <EmptyState message="No payment methods registered for this account." />
          )}

        {paymentMethods.length > 0 && (
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div
                key={method.publicId}
                className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-[var(--border)] p-4"
              >
                <div className="min-w-0">
                  <p className="font-medium text-[var(--foreground)]">
                    {method.displayName ??
                      `${method.provider} ${method.type}`}
                  </p>

                  <p className="mt-1 text-sm text-[var(--foreground-muted)]">
                    {method.provider} · {method.type}
                    {method.lastFour
                      ? ` · ending ${method.lastFour}`
                      : ""}
                  </p>

                  <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                    Added {formatDate(method.createdAt)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {method.isDefault && (
                    <StatusLabel value="DEFAULT" />
                  )}

                  <StatusLabel
                    value={method.isActive ? "ACTIVE" : "INACTIVE"}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}
