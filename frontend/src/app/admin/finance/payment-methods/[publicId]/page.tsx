
"use client";

// -----------------------------------------------------------------------------
// sisiMove Admin — Payment Method Detail Page
// -----------------------------------------------------------------------------

import { useCallback, useMemo, useState } from "react";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ADMIN_ROUTES } from "@/foundation/routing/admin-routes";

import {
  useAdminPaymentMethod,
  useAdminPaymentMethodOperations,
} from "@/features/admin/finance/payment-methods/hooks";

import type {
  AdminPaymentMethod,
  AdminPaymentMethodSummary,
} from "@/features/admin/finance/payment-methods/models";

import type {
  AdminSetDefaultPaymentMethodPayload,
  AdminDeactivatePaymentMethodPayload,
} from "@/features/admin/finance/payment-methods/api";

import {
  PaymentMethodDetailsLayout,
} from "@/components/admin/finance/payment-methods/details";

import {
  PaymentMethodActionsMenu,
  PaymentMethodSetDefaultDialog,
  PaymentMethodDeactivateDialog,
  PaymentMethodOperationFeedback,
} from "@/components/admin/finance/payment-methods/operations";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type PaymentMethodOperation = "set-default" | "deactivate";

type PaymentMethodFeedback = {
  status: "success" | "error";
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

  return `admin-payment-method-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

function getOperationLabel(
  operation: PaymentMethodOperation,
): string {
  return operation === "set-default"
    ? "Set payment method as default"
    : "Deactivate payment method";
}

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default function PaymentMethodDetailPage() {
  const params = useParams<{ publicId: string }>();
  const router = useRouter();

  const publicId =
    typeof params.publicId === "string"
      ? params.publicId.trim()
      : "";

  const paymentMethodQuery = useAdminPaymentMethod(
    publicId || undefined,
  );

  const {
    refetch: refetchPaymentMethod,
  } = paymentMethodQuery;

  const operations = useAdminPaymentMethodOperations();
  const paymentMethod = paymentMethodQuery.paymentMethod;

  const [selectedOperation, setSelectedOperation] =
    useState<PaymentMethodOperation | null>(null);

  const [operationError, setOperationError] =
    useState<string | undefined>();

  const [feedback, setFeedback] =
    useState<PaymentMethodFeedback | null>(null);

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------

  const handleBack = useCallback(() => {
    router.push(ADMIN_ROUTES.FINANCE_PAYMENT_METHODS);
  }, [router]);

  const handleRetry = useCallback(() => {
    void refetchPaymentMethod();
  }, [refetchPaymentMethod]);

  const handleViewAccount = useCallback(
    (accountPublicId: string) => {
      router.push(
        ADMIN_ROUTES.FINANCE_ACCOUNT(accountPublicId),
      );
    },
    [router],
  );

  // ---------------------------------------------------------------------------
  // Action Menu Summary
  // -----------------------------------------------------------------------------

  const paymentMethodSummary = useMemo<
    AdminPaymentMethodSummary | null
  >(() => {
    if (!paymentMethod) {
      return null;
    }

    return {
      publicId: paymentMethod.publicId,
      accountPublicId: paymentMethod.accountPublicId,
      type: paymentMethod.type,
      provider: paymentMethod.provider,
      displayName: paymentMethod.displayName,
      lastFour: paymentMethod.lastFour,
      isDefault: paymentMethod.isDefault,
      isActive: paymentMethod.isActive,
      createdAt: paymentMethod.createdAt,
      updatedAt: paymentMethod.updatedAt,
    };
  }, [paymentMethod]);

  // ---------------------------------------------------------------------------
  // Operation Dialog
  // -----------------------------------------------------------------------------

  const handleSelectOperation = useCallback(
    (operation: PaymentMethodOperation) => {
      if (operations.isPending) {
        return;
      }

      if (
        operation === "set-default" &&
        (!paymentMethod?.isActive || paymentMethod.isDefault)
      ) {
        return;
      }

      if (
        operation === "deactivate" &&
        !paymentMethod?.isActive
      ) {
        return;
      }

      setFeedback(null);
      setOperationError(undefined);
      setSelectedOperation(operation);
    },
    [operations.isPending, paymentMethod],
  );

  const handleCloseOperation = useCallback(
    (open: boolean) => {
      if (operations.isPending) {
        return;
      }

      if (!open) {
        setSelectedOperation(null);
        setOperationError(undefined);
      }
    },
    [operations.isPending],
  );

  // ---------------------------------------------------------------------------
  // Confirm Operation
  // -----------------------------------------------------------------------------

  const handleConfirmOperation = useCallback(
    async (selectedMethod: AdminPaymentMethod) => {
      if (!selectedOperation || operations.isPending) {
        return;
      }

      // Prevent stale dialogs from operating on a different record.
      if (selectedMethod.publicId !== paymentMethod?.publicId) {
        setOperationError(
          "The selected payment method has changed. Close this dialog and try again.",
        );
        return;
      }

      if (
        selectedOperation === "set-default" &&
        (!selectedMethod.isActive || selectedMethod.isDefault)
      ) {
        setOperationError(
          "Only an active, non-default payment method can be set as default.",
        );
        return;
      }

      if (
        selectedOperation === "deactivate" &&
        !selectedMethod.isActive
      ) {
        setOperationError(
          "This payment method is already inactive.",
        );
        return;
      }

      const operation = selectedOperation;
      const correlationId = createCorrelationId();

      setOperationError(undefined);
      setFeedback(null);

      try {
        switch (operation) {
          case "set-default": {
            const request: AdminSetDefaultPaymentMethodPayload = {
              correlationId,
              defaultedAt: new Date().toISOString(),
            };

            await operations.setDefault.mutateAsync({
              paymentMethodPublicId: selectedMethod.publicId,
              request,
            });

            break;
          }

          case "deactivate": {
            const request: AdminDeactivatePaymentMethodPayload = {
              correlationId,
              deactivatedAt: new Date().toISOString(),
            };

            await operations.deactivate.mutateAsync({
              paymentMethodPublicId: selectedMethod.publicId,
              request,
            });

            break;
          }

          default: {
            const exhaustiveCheck: never = operation;

            throw new Error(
              `Unsupported payment-method operation: ${exhaustiveCheck}`,
            );
          }
        }

        setSelectedOperation(null);
        setOperationError(undefined);

        setFeedback({
          status: "success",
          message: `${getOperationLabel(operation)} completed successfully for ${selectedMethod.publicId}.`,
        });

        await refetchPaymentMethod();
      } catch (error: unknown) {
        const message = getErrorMessage(error);

        setOperationError(message);
        setFeedback({
          status: "error",
          message: `${getOperationLabel(operation)} failed: ${message}`,
        });
      }
    },
    [
      selectedOperation,
      operations,
      paymentMethod,
      refetchPaymentMethod,
    ],
  );

  // ---------------------------------------------------------------------------
  // Shared Back Button
  // -----------------------------------------------------------------------------

  const backButton = (
    <Button
      type="button"
      variant="outline"
      onClick={handleBack}
      leadingIcon={
        <ArrowLeft
          className="size-4"
          aria-hidden="true"
        />
      }
    >
      Back to payment methods
    </Button>
  );

  // ---------------------------------------------------------------------------
  // Missing Identifier
  // -----------------------------------------------------------------------------

  if (!publicId) {
    return (
      <main className="page-shell">
        <div className="page-container">
          <section className="surface space-y-4 p-6">
            <h1 className="text-lg font-semibold text-[var(--foreground)]">
              Payment method identifier missing
            </h1>

            <p className="text-sm text-[var(--foreground-secondary)]">
              A payment method public ID is required to open this page.
            </p>

            {backButton}
          </section>
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Loading
  // -----------------------------------------------------------------------------

  if (paymentMethodQuery.isLoading) {
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
              Loading payment method…
            </p>
          </section>
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Error
  // -----------------------------------------------------------------------------

  if (paymentMethodQuery.isError) {
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
                  Unable to load payment method
                </h1>

                <p className="mt-2 break-words text-sm text-[var(--foreground-secondary)]">
                  {getErrorMessage(paymentMethodQuery.error)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                onClick={handleRetry}
              >
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
  // -----------------------------------------------------------------------------

  if (!paymentMethod) {
    return (
      <main className="page-shell">
        <div className="page-container">
          <section className="surface space-y-4 p-6">
            <h1 className="text-lg font-semibold text-[var(--foreground)]">
              Payment method not found
            </h1>

            <p className="break-words text-sm text-[var(--foreground-secondary)]">
              No payment method was returned for public ID {publicId}.
              Verify the identifier and try again.
            </p>

            {backButton}
          </section>
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Payment Method Detail
  // -----------------------------------------------------------------------------

  return (
    <main className="page-shell">
      <div className="page-container space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={handleBack}
            leadingIcon={
              <ArrowLeft
                className="size-4"
                aria-hidden="true"
              />
            }
          >
            Payment methods
          </Button>

          {paymentMethodSummary ? (
            <PaymentMethodActionsMenu
              paymentMethod={paymentMethodSummary}
              canSetDefault={
                paymentMethod.isActive &&
                !paymentMethod.isDefault
              }
              canDeactivate={paymentMethod.isActive}
              disabled={operations.isPending}
              onSetDefault={() =>
                handleSelectOperation("set-default")
              }
              onDeactivate={() =>
                handleSelectOperation("deactivate")
              }
            />
          ) : null}
        </div>

        {feedback ? (
          <PaymentMethodOperationFeedback
            status={feedback.status}
            message={feedback.message}
          />
        ) : null}

        <PaymentMethodDetailsLayout
          paymentMethod={paymentMethod}
          onBack={handleBack}
          onViewAccount={handleViewAccount}
        />

        <PaymentMethodSetDefaultDialog
          open={selectedOperation === "set-default"}
          paymentMethod={
            selectedOperation === "set-default"
              ? paymentMethod
              : null
          }
          isPending={operations.isPending}
          error={
            selectedOperation === "set-default"
              ? operationError
              : null
          }
          onOpenChange={handleCloseOperation}
          onConfirm={handleConfirmOperation}
        />

        <PaymentMethodDeactivateDialog
          open={selectedOperation === "deactivate"}
          paymentMethod={
            selectedOperation === "deactivate"
              ? paymentMethod
              : null
          }
          isPending={operations.isPending}
          error={
            selectedOperation === "deactivate"
              ? operationError
              : null
          }
          onOpenChange={handleCloseOperation}
          onConfirm={handleConfirmOperation}
        />
      </div>
    </main>
  );
}
