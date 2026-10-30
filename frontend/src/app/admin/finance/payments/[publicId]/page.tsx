
"use client";

// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Payment Detail Page
// -----------------------------------------------------------------------------
//
// Loads a financial payment by public ID.
// Displays identity, information, lifecycle, attempts and references.
// Supports PROCESS, SUCCEED, FAIL, CANCEL, EXPIRE and LINK TRANSACTION.
// -----------------------------------------------------------------------------

import { useCallback, useState } from "react";
import { ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ADMIN_ROUTES } from "@/foundation/routing/admin-routes";

import {
  useAdminFinancialPayment,
  useAdminFinancialPaymentOperations,
} from "@/features/admin/finance/payments/hooks";

import type {
  AdminFinancialPaymentLifecyclePayload,
  LinkAdminFinancialPaymentTransactionPayload,
} from "@/features/admin/finance/payments";

import {
  PaymentDetailHeader,
  PaymentDetailsLayout,
  PaymentIdentityPanel,
  PaymentInformationPanel,
  PaymentLifecyclePanel,
  PaymentAccountReferencePanel,
  PaymentMethodReferencePanel,
  PaymentTransactionReferencePanel,
  PaymentBusinessReferencePanel,
  PaymentAuditInformation,
  PaymentMetadataPanel,
  PaymentAttemptsPanel,
  PaymentActionsMenu,
  PaymentOperationDialog,
} from "@/components/admin/finance/payments";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type PaymentOperation =
  | "process"
  | "succeed"
  | "fail"
  | "cancel"
  | "expire"
  | "link-transaction";

type PaymentFeedback = {
  kind: "success" | "error";
  message: string;
};

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return "The request could not be completed. Please try again.";
}

function createCorrelationId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `admin-payment-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

function getOperationLabel(operation: PaymentOperation): string {
  switch (operation) {
    case "process":
      return "Process payment";
    case "succeed":
      return "Mark payment as succeeded";
    case "fail":
      return "Mark payment as failed";
    case "cancel":
      return "Cancel payment";
    case "expire":
      return "Expire payment";
    case "link-transaction":
      return "Link transaction";
  }
}

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default function FinancialPaymentDetailPage() {
  const params = useParams<{ publicId: string }>();
  const router = useRouter();

  const publicId =
    typeof params.publicId === "string" ? params.publicId.trim() : "";

  const paymentQuery = useAdminFinancialPayment(publicId || undefined);
  const { refetch: refetchPayment } = paymentQuery;

  const operations = useAdminFinancialPaymentOperations();
  const payment = paymentQuery.payment;

  const [selectedOperation, setSelectedOperation] =
    useState<PaymentOperation | null>(null);

  const [transactionPublicId, setTransactionPublicId] = useState("");
  const [operationError, setOperationError] = useState<string | undefined>();
  const [feedback, setFeedback] = useState<PaymentFeedback | null>(null);

  // ---------------------------------------------------------------------------
  // Navigation And Recovery
  // ---------------------------------------------------------------------------

  const handleBack = useCallback(() => {
    router.push(ADMIN_ROUTES.FINANCE_PAYMENTS);
  }, [router]);

  const handleRetry = useCallback(() => {
    void refetchPayment();
  }, [refetchPayment]);

  // ---------------------------------------------------------------------------
  // Operation Dialog
  // ---------------------------------------------------------------------------

  const handleSelectOperation = useCallback(
    (operation: PaymentOperation) => {
      setFeedback(null);
      setOperationError(undefined);
      setTransactionPublicId("");
      setSelectedOperation(operation);
    },
    [],
  );

  const handleTransactionPublicIdChange = useCallback(
    (nextPublicId: string) => {
      setTransactionPublicId(nextPublicId);
      setOperationError(undefined);
    },
    [],
  );

  const handleCloseOperation = useCallback(() => {
    if (operations.isPending) return;

    setSelectedOperation(null);
    setTransactionPublicId("");
    setOperationError(undefined);
  }, [operations.isPending]);

  // ---------------------------------------------------------------------------
  // Confirm Operation
  // ---------------------------------------------------------------------------

  const handleConfirmOperation = useCallback(async () => {
    if (!payment || !selectedOperation || operations.isPending) {
      return;
    }

    const operation = selectedOperation;
    const correlationId = createCorrelationId();

    const lifecycleRequest: AdminFinancialPaymentLifecyclePayload = {
      correlationId,
    };

    const normalizedTransactionPublicId = transactionPublicId.trim();

    if (
      operation === "link-transaction" &&
      !normalizedTransactionPublicId
    ) {
      setOperationError("A transaction public ID is required.");
      return;
    }

    setOperationError(undefined);
    setFeedback(null);

    try {
      switch (operation) {
        case "process": {
          await operations.processPayment.mutateAsync({
            paymentPublicId: payment.publicId,
            request: lifecycleRequest,
          });
          break;
        }

        case "succeed": {
          await operations.succeedPayment.mutateAsync({
            paymentPublicId: payment.publicId,
            request: lifecycleRequest,
          });
          break;
        }

        case "fail": {
          await operations.failPayment.mutateAsync({
            paymentPublicId: payment.publicId,
            request: lifecycleRequest,
          });
          break;
        }

        case "cancel": {
          await operations.cancelPayment.mutateAsync({
            paymentPublicId: payment.publicId,
            request: lifecycleRequest,
          });
          break;
        }

        case "expire": {
          await operations.expirePayment.mutateAsync({
            paymentPublicId: payment.publicId,
            request: lifecycleRequest,
          });
          break;
        }

        case "link-transaction": {
          const request: LinkAdminFinancialPaymentTransactionPayload = {
            ...lifecycleRequest,
            transactionPublicId: normalizedTransactionPublicId,
          };

          await operations.linkTransaction.mutateAsync({
            paymentPublicId: payment.publicId,
            request,
          });
          break;
        }

        default: {
          const exhaustiveCheck: never = operation;

          throw new Error(
            `Unsupported payment operation: ${exhaustiveCheck}`,
          );
        }
      }

      setSelectedOperation(null);
      setTransactionPublicId("");
      setOperationError(undefined);

      setFeedback({
        kind: "success",
        message: `${getOperationLabel(operation)} completed successfully for payment ${payment.publicId}.`,
      });

      await refetchPayment();
    } catch (error: unknown) {
      setSelectedOperation(null);
      setTransactionPublicId("");
      setOperationError(undefined);

      setFeedback({
        kind: "error",
        message: `${getOperationLabel(operation)} failed: ${getErrorMessage(error)}`,
      });
    }
  }, [
    payment,
    selectedOperation,
    operations,
    transactionPublicId,
    refetchPayment,
  ]);

  // ---------------------------------------------------------------------------
  // Shared Back Button
  // ---------------------------------------------------------------------------

  const backButton = (
    <Button
      type="button"
      variant="outline"
      onClick={handleBack}
      leadingIcon={<ArrowLeft className="size-4" />}
    >
      Back to financial payments
    </Button>
  );

  // ---------------------------------------------------------------------------
  // Missing Identifier
  // ---------------------------------------------------------------------------

  if (!publicId) {
    return (
      <main className="page-shell">
        <div className="page-container">
          <section className="surface space-y-4 p-6">
            <h1 className="text-lg font-semibold text-[var(--foreground)]">
              Payment identifier missing
            </h1>

            <p className="text-sm text-[var(--foreground-secondary)]">
              A financial payment public ID is required to open this page.
            </p>

            {backButton}
          </section>
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------

  if (paymentQuery.isLoading) {
    return (
      <main className="page-shell">
        <div className="page-container">
          <section
            role="status"
            aria-live="polite"
            className="surface flex items-center gap-3 p-6"
          >
            <span className="size-5 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--brand)]" />

            <p className="text-sm text-[var(--foreground-secondary)]">
              Loading financial payment…
            </p>
          </section>
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Error
  // ---------------------------------------------------------------------------

  if (paymentQuery.isError) {
    return (
      <main className="page-shell">
        <div className="page-container space-y-4">
          <section
            role="alert"
            className="surface space-y-4 border border-[var(--danger)]/30 p-6"
          >
            <div className="flex items-start gap-3">
              <AlertCircle
                aria-hidden="true"
                className="mt-0.5 size-5 shrink-0 text-[var(--danger)]"
              />

              <div className="min-w-0">
                <h1 className="text-lg font-semibold text-[var(--foreground)]">
                  Unable to load financial payment
                </h1>

                <p className="mt-2 break-words text-sm text-[var(--foreground-secondary)]">
                  {getErrorMessage(paymentQuery.error)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button type="button" onClick={handleRetry}>
                Try again
              </Button>

              {backButton}
            </div>
          </section>
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Not Found
  // ---------------------------------------------------------------------------

  if (!payment) {
    return (
      <main className="page-shell">
        <div className="page-container">
          <section className="surface space-y-4 p-6">
            <h1 className="text-lg font-semibold text-[var(--foreground)]">
              Financial payment not found
            </h1>

            <p className="break-words text-sm text-[var(--foreground-secondary)]">
              No financial payment was returned for public ID {publicId}.
              Verify the identifier and try again.
            </p>

            {backButton}
          </section>
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Payment Detail
  // ---------------------------------------------------------------------------

  return (
    <main className="page-shell">
      <div className="page-container space-y-6">
        {/* Navigation and payment actions */}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={handleBack}
            leadingIcon={<ArrowLeft className="size-4" />}
          >
            Financial payments
          </Button>

          <PaymentActionsMenu
            label="Payment actions"
            disabled={operations.isPending}
            actions={[
              {
                id: "process",
                label: "Process payment",
                description: "Start processing this payment.",
                onSelect: () => handleSelectOperation("process"),
              },
              {
                id: "succeed",
                label: "Mark as succeeded",
                description: "Record successful completion.",
                onSelect: () => handleSelectOperation("succeed"),
              },
              {
                id: "fail",
                label: "Mark as failed",
                description: "Record a failed payment.",
                destructive: true,
                onSelect: () => handleSelectOperation("fail"),
              },
              {
                id: "cancel",
                label: "Cancel payment",
                description: "Cancel this payment.",
                destructive: true,
                onSelect: () => handleSelectOperation("cancel"),
              },
              {
                id: "expire",
                label: "Expire payment",
                description: "Mark this payment as expired.",
                onSelect: () => handleSelectOperation("expire"),
              },
              {
                id: "link-transaction",
                label: "Link transaction",
                description:
                  "Associate an existing transaction with this payment.",
                onSelect: () => handleSelectOperation("link-transaction"),
              },
            ]}
          />
        </div>

        {/* Operation feedback */}

        {feedback ? (
          <section
            role={feedback.kind === "error" ? "alert" : "status"}
            aria-live="polite"
            className={
              feedback.kind === "success"
                ? "flex items-start gap-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4"
                : "flex items-start gap-3 rounded-[var(--radius-lg)] border border-[var(--danger)]/30 bg-[var(--surface)] p-4"
            }
          >
            {feedback.kind === "success" ? (
              <CheckCircle2
                aria-hidden="true"
                className="mt-0.5 size-5 shrink-0 text-[var(--brand)]"
              />
            ) : (
              <AlertCircle
                aria-hidden="true"
                className="mt-0.5 size-5 shrink-0 text-[var(--danger)]"
              />
            )}

            <p className="min-w-0 flex-1 break-words text-sm text-[var(--foreground)]">
              {feedback.message}
            </p>

            <button
              type="button"
              onClick={() => setFeedback(null)}
              className="shrink-0 text-sm text-[var(--foreground-secondary)] hover:text-[var(--foreground)]"
              aria-label="Dismiss notification"
            >
              Dismiss
            </button>
          </section>
        ) : null}

        {/* Payment header */}

        <PaymentDetailHeader
          payment={payment}
          backHref={ADMIN_ROUTES.FINANCE_PAYMENTS}
        />

        {/* Payment details */}

        <PaymentDetailsLayout
          aside={
            <>
              <PaymentAccountReferencePanel payment={payment} />
              <PaymentMethodReferencePanel payment={payment} />
              <PaymentTransactionReferencePanel payment={payment} />
              <PaymentBusinessReferencePanel payment={payment} />
              <PaymentMetadataPanel payment={payment} />
              <PaymentAuditInformation payment={payment} />
            </>
          }
        >
          <PaymentIdentityPanel payment={payment} />
          <PaymentInformationPanel payment={payment} />
          <PaymentLifecyclePanel payment={payment} />
          <PaymentAttemptsPanel attempts={payment.attempts ?? []} />
        </PaymentDetailsLayout>

        {/* Operation confirmation dialog */}

        <PaymentOperationDialog
          open={selectedOperation !== null}
          title={
            selectedOperation
              ? getOperationLabel(selectedOperation)
              : "Payment operation"
          }
          description={
            selectedOperation === "link-transaction"
              ? `Enter the transaction public ID to link to payment ${payment.publicId}.`
              : `Confirm ${
                  selectedOperation
                    ? getOperationLabel(selectedOperation).toLowerCase()
                    : "this operation"
                } for payment ${payment.publicId}.`
          }
          onClose={handleCloseOperation}
          onConfirm={handleConfirmOperation}
          loading={operations.isPending}
          error={operationError}
        >
          {selectedOperation === "link-transaction" ? (
            <div className="space-y-2">
              <label
                htmlFor="transaction-public-id"
                className="text-sm font-medium text-[var(--foreground)]"
              >
                Transaction public ID
              </label>

              <input
                id="transaction-public-id"
                name="transactionPublicId"
                autoComplete="off"
                value={transactionPublicId}
                onChange={(event) =>
                  handleTransactionPublicIdChange(event.target.value)
                }
                placeholder="Enter transaction public ID"
                disabled={operations.isPending}
                required
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--brand)]"
              />
            </div>
          ) : null}
        </PaymentOperationDialog>
      </div>
    </main>
  );
}
