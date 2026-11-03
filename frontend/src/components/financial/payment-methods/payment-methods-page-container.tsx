
 // =============================================================================
// sisiMove — Payment Methods Page Container
// =============================================================================
//
// Application orchestration boundary for the authenticated M-PESA
// payment-method management surface.
//
// Responsibilities:
// - load the member's financial account for the current create API;
// - load the member's authoritative payment-method collection;
// - verify M-PESA provider availability;
// - own payment-method creation form state;
// - validate form values with the feature schema;
// - generate technical correlation IDs;
// - invoke create, set-default, and deactivate mutations;
// - translate backend state into presentation props;
// - handle loading, error, empty, and mutation states.
//
// This component does NOT:
// - call HTTP APIs directly;
// - contain backend business rules;
// - invent a payment-method collection;
// - maintain a fake local collection;
// - navigate;
// - determine backend payment-method lifecycle state.
//
// =============================================================================

'use client';

import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui';

import { AUTHENTICATED_ROUTES } from '@/foundation/routing/authenticated-routes';

import { useMyFinancialAccount } from '@/features/financial-account';

import {
  createPaymentMethodSchema,
  useAvailablePaymentProviders,
  useCreatePaymentMethod,
  useDeactivatePaymentMethod,
  useSetDefaultPaymentMethod,
  type CreatePaymentMethodFormValues,
} from '@/features/financial-payment-methods';
import { useMyPaymentMethods } from '@/features/financial-payment-methods/hooks';


import {
  PaymentMethodActions,
  PaymentMethodForm,
  PaymentMethodList,
} from '@/components/financial/payment-methods';

// =============================================================================
// Local Types
// =============================================================================

interface PaymentMethodFormState {
  readonly phoneNumber: string;
  readonly displayName: string;
  readonly isDefault: boolean;
}

interface PaymentMethodFormErrors {
  readonly phoneNumber?: string;
  readonly displayName?: string;
  readonly isDefault?: string;
  readonly form?: string;
}

// =============================================================================
// Helpers
// =============================================================================

function createInitialFormState(): PaymentMethodFormState {
  return {
    phoneNumber: '',
    displayName: '',
    isDefault: true,
  };
}

/**
 * Generates technical application tracing metadata.
 *
 * This value is generated only when an operation is submitted.
 */
function createCorrelationId(): string {
  return crypto.randomUUID();
}

// =============================================================================
// Component
// =============================================================================

export function PaymentMethodsPageContainer() {
  // ===========================================================================
  // Financial Account
  // ===========================================================================
  //
  // The current create-payment-method mutation still requires accountPublicId.
  // This query remains until the backend create endpoint resolves account
  // ownership from the authenticated identity.
  //

  const {
    data: financialAccount,
    isLoading: isAccountLoading,
    isError: isAccountError,
    error: accountError,
    refetch: refetchAccount,
  } = useMyFinancialAccount();

  // ===========================================================================
  // Member Payment Methods
  // ===========================================================================

  const {
    data: paymentMethods,
    isLoading: isPaymentMethodsLoading,
    isError: isPaymentMethodsError,
    error: paymentMethodsError,
    refetch: refetchPaymentMethods,
  } = useMyPaymentMethods();

  // ===========================================================================
  // Available Payment Providers
  // ===========================================================================

  const {
    data: availablePaymentProviders,
    isLoading: isProvidersLoading,
    isError: isProvidersError,
    error: providersError,
    refetch: refetchProviders,
  } = useAvailablePaymentProviders();

  /**
   * M-PESA is the only provider supported by this member-facing form.
   */
  const isMpesaAvailable =
    availablePaymentProviders?.some(
      (provider) => provider.code === 'MPESA',
    ) ?? false;

  // ===========================================================================
  // Mutations
  // ===========================================================================

  const createPaymentMethodMutation =
    useCreatePaymentMethod();

  const setDefaultPaymentMethodMutation =
    useSetDefaultPaymentMethod();

  const deactivatePaymentMethodMutation =
    useDeactivatePaymentMethod();

  // ===========================================================================
  // Form State
  // ===========================================================================

  const [form, setForm] =
    useState<PaymentMethodFormState>(
      createInitialFormState,
    );

  const [errors, setErrors] =
    useState<PaymentMethodFormErrors>({});

  const [showForm, setShowForm] =
    useState(false);

  // ===========================================================================
  // Derived State
  // ===========================================================================

  const isCreating =
    createPaymentMethodMutation.isPending;

  const isSettingDefault =
    setDefaultPaymentMethodMutation.isPending;

  const isDeactivating =
    deactivatePaymentMethodMutation.isPending;

  const isMutating =
    isCreating || isSettingDefault || isDeactivating;

  // ===========================================================================
  // Form Helpers
  // ===========================================================================

  const clearFieldError = (
    field: keyof PaymentMethodFormErrors,
  ) => {
    setErrors((current) => ({
      ...current,
      [field]: undefined,
      form: undefined,
    }));
  };

  const openCreateForm = () => {
    setForm(createInitialFormState());
    setErrors({});
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setForm(createInitialFormState());
    setErrors({});
    setShowForm(false);
  };

  // ===========================================================================
  // Create Payment Method
  // ===========================================================================

  const handleCreatePaymentMethod = () => {
    setErrors({});

    if (!financialAccount?.publicId) {
      setErrors({
        form:
          'Your wallet account could not be loaded. Please try again.',
      });

      return;
    }

    if (isProvidersLoading) {
      setErrors({
        form:
          'Payment providers are still loading. Please try again shortly.',
      });

      return;
    }

    if (isProvidersError) {
      setErrors({
        form:
          providersError?.message ??
          'Unable to load payment providers. Please try again.',
      });

      return;
    }

    if (!isMpesaAvailable) {
      setErrors({
        form:
          'M-PESA is currently unavailable. Please try again later.',
      });

      return;
    }

    const request: CreatePaymentMethodFormValues = {
      type: 'MOBILE_MONEY',
      provider: 'MPESA',
      phoneNumber: form.phoneNumber.trim(),
      correlationId: createCorrelationId(),
      displayName: form.displayName.trim() || undefined,
      isDefault: form.isDefault,
    };

    const parsed =
      createPaymentMethodSchema.safeParse(request);

    if (!parsed.success) {
      const fieldErrors =
        parsed.error.flatten().fieldErrors;

      setErrors({
        phoneNumber: fieldErrors.phoneNumber?.[0],
        displayName: fieldErrors.displayName?.[0],
        isDefault: fieldErrors.isDefault?.[0],
      });

      return;
    }

    createPaymentMethodMutation.mutate(
      {
        accountPublicId: financialAccount.publicId,
        request: parsed.data,
      },
      {
        onSuccess: async () => {
          await refetchPaymentMethods();

          setForm(createInitialFormState());
          setErrors({});
          setShowForm(false);
        },

        onError: (error) => {
          setErrors({
            form:
              error.message ||
              'Unable to add the M-PESA number. Please try again.',
          });
        },
      },
    );
  };

  // ===========================================================================
  // Set Default Payment Method
  // ===========================================================================

  const handleSetDefaultPaymentMethod = (
    paymentMethodPublicId: string,
  ) => {
    if (!paymentMethodPublicId) {
      return;
    }

    setDefaultPaymentMethodMutation.mutate(
      {
        paymentMethodPublicId,
        request: {
          correlationId: createCorrelationId(),
        },
      },
      {
        onSuccess: () => {
          void refetchPaymentMethods();
        },
      },
    );
  };

  // ===========================================================================
  // Deactivate Payment Method
  // ===========================================================================

  const handleDeactivatePaymentMethod = (
    paymentMethodPublicId: string,
  ) => {
    if (!paymentMethodPublicId) {
      return;
    }

    deactivatePaymentMethodMutation.mutate(
      {
        paymentMethodPublicId,
        request: {
          correlationId: createCorrelationId(),
        },
      },
      {
        onSuccess: () => {
          void refetchPaymentMethods();
        },
      },
    );
  };

  // ===========================================================================
  // Payment Method List
  // ===========================================================================

  const paymentMethodListItems =
    (paymentMethods ?? []).map((paymentMethod) => ({
      id: paymentMethod.publicId,
      phoneNumber: paymentMethod.phoneNumber,
      displayName: paymentMethod.displayName,
      isDefault: paymentMethod.isDefault,
      isActive: paymentMethod.isActive,

      actions: (
        <PaymentMethodActions
          isDefault={paymentMethod.isDefault}
          isActive={paymentMethod.isActive}
          isLoading={isMutating}
          onSetDefault={
            paymentMethod.isActive && !paymentMethod.isDefault
              ? () =>
                  handleSetDefaultPaymentMethod(
                    paymentMethod.publicId,
                  )
              : undefined
          }
          onDeactivate={
            paymentMethod.isActive
              ? () =>
                  handleDeactivatePaymentMethod(
                    paymentMethod.publicId,
                  )
              : undefined
          }
        />
      ),
    }));

  // ===========================================================================
  // Loading
  // ===========================================================================

  if (
    isAccountLoading ||
    isPaymentMethodsLoading
  ) {
    return (
      <main className="min-h-screen bg-[var(--background-brand)]">
        <div className="page-container">
          <section className="section">
            <div className="mx-auto max-w-2xl">
              <div className="surface p-6">
                <div
                  className="space-y-4"
                  aria-busy="true"
                  aria-label="Loading payment methods"
                >
                  <div className="h-6 w-40 animate-pulse rounded bg-[var(--background-muted)]" />

                  <div className="h-4 w-64 animate-pulse rounded bg-[var(--background-muted)]" />

                  <div className="h-24 w-full animate-pulse rounded bg-[var(--background-muted)]" />

                  <div className="h-24 w-full animate-pulse rounded bg-[var(--background-muted)]" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  // ===========================================================================
  // Initial Loading Error
  // ===========================================================================

  if (
    isAccountError ||
    isPaymentMethodsError
  ) {
    const message =
      accountError?.message ??
      paymentMethodsError?.message ??
      'Unable to load your payment methods.';

    return (
      <main className="min-h-screen bg-[var(--background-brand)]">
        <div className="page-container">
          <section className="section">
            <div className="mx-auto max-w-2xl">
              <div className="surface p-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-[var(--danger)]">
                      Unable to load payment methods
                    </p>

                    <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                      {message}
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      void refetchAccount();
                      void refetchPaymentMethods();
                      void refetchProviders();
                    }}
                  >
                    Try again
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  // ===========================================================================
  // Render
  // ===========================================================================

  return (
    <main className="min-h-screen bg-[var(--background-brand)]">
      <div className="page-container">
        <section className="section">
          <div className="mx-auto max-w-2xl space-y-5">

            {/* -----------------------------------------------------------------
                Header
            ------------------------------------------------------------------ */}

            <header>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--brand)]">
                WALLET
              </p>

              <div className="mt-1 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                    Payment methods
                  </h1>

                  <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                    Manage your saved M-PESA numbers for wallet top-ups.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={AUTHENTICATED_ROUTES.WALLET_TOP_UP}
                    className="inline-flex min-h-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--brand)] px-4 text-sm font-semibold text-[var(--brand-foreground)] transition hover:bg-[var(--brand-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2"
                  >
                    Top Up Wallet
                  </Link>

                  {!showForm ? (
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={openCreateForm}
                    >
                      Add M-PESA number
                    </Button>
                  ) : null}
                </div>
              </div>
            </header>

            {/* -----------------------------------------------------------------
                Payment Method Collection
            ------------------------------------------------------------------ */}

            <section
              aria-labelledby="saved-payment-methods-title"
              className="space-y-3"
            >
              <div>
                <h2
                  id="saved-payment-methods-title"
                  className="text-sm font-semibold text-[var(--foreground)]"
                >
                  Saved M-PESA numbers
                </h2>

                <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                  Choose your default number or deactivate a number you no
                  longer use.
                </p>
              </div>

              <PaymentMethodList
                paymentMethods={paymentMethodListItems}
                emptyState={
                  !showForm ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={openCreateForm}
                    >
                      Add M-PESA number
                    </Button>
                  ) : undefined
                }
              />
            </section>

            {/* -----------------------------------------------------------------
                Mutation Errors
            ------------------------------------------------------------------ */}

            {setDefaultPaymentMethodMutation.isError ? (
              <div
                role="alert"
                className="rounded-[var(--radius-md)] border border-[var(--danger)] bg-[var(--danger-soft)] px-4 py-3 text-sm text-[var(--danger)]"
              >
                {setDefaultPaymentMethodMutation.error.message ||
                  'Unable to set the default M-PESA number. Please try again.'}
              </div>
            ) : null}

            {deactivatePaymentMethodMutation.isError ? (
              <div
                role="alert"
                className="rounded-[var(--radius-md)] border border-[var(--danger)] bg-[var(--danger-soft)] px-4 py-3 text-sm text-[var(--danger)]"
              >
                {deactivatePaymentMethodMutation.error.message ||
                  'Unable to deactivate the M-PESA number. Please try again.'}
              </div>
            ) : null}

            {/* -----------------------------------------------------------------
                Create Payment Method
            ------------------------------------------------------------------ */}

            {showForm ? (
              <section
                aria-labelledby="add-payment-method-title"
                className="space-y-3"
              >
                <div>
                  <h2
                    id="add-payment-method-title"
                    className="text-sm font-semibold text-[var(--foreground)]"
                  >
                    Add M-PESA number
                  </h2>

                  <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                    Enter the Kenyan mobile number you want to use for wallet
                    top-ups.
                  </p>
                </div>

                <PaymentMethodForm
                  phoneNumber={form.phoneNumber}
                  displayName={form.displayName}
                  isDefault={form.isDefault}
                  errors={{
                    phoneNumber: errors.phoneNumber,
                    displayName: errors.displayName,
                    isDefault: errors.isDefault,
                  }}
                  isSubmitting={isCreating}
                  formError={
                    errors.form ??
                    (isProvidersError
                      ? providersError?.message ??
                        'Unable to load payment providers.'
                      : undefined) ??
                    (isProvidersLoading
                      ? 'Payment providers are loading.'
                      : undefined) ??
                    (!isProvidersLoading &&
                    !isProvidersError &&
                    !isMpesaAvailable
                      ? 'M-PESA is currently unavailable.'
                      : undefined)
                  }
                  onPhoneNumberChange={(phoneNumber) => {
                    setForm((current) => ({
                      ...current,
                      phoneNumber,
                    }));

                    clearFieldError('phoneNumber');
                  }}
                  onDisplayNameChange={(displayName) => {
                    setForm((current) => ({
                      ...current,
                      displayName,
                    }));

                    clearFieldError('displayName');
                  }}
                  onIsDefaultChange={(isDefault) => {
                    setForm((current) => ({
                      ...current,
                      isDefault,
                    }));

                    clearFieldError('isDefault');
                  }}
                  onSubmit={handleCreatePaymentMethod}
                  onCancel={handleCancelForm}
                />
              </section>
            ) : null}

          </div>
        </section>
      </div>
    </main>
  );
}

export default PaymentMethodsPageContainer;
