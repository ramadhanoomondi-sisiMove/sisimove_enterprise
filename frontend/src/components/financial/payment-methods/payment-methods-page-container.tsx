// =============================================================================
// sisiMove — Payment Methods Page Container
// =============================================================================
//
// Application orchestration boundary for the authenticated payment-method
// management surface.
//
// Current frontend payment-method feature exposes:
//
// - get a payment method;
// - get the default payment method;
// - create a payment method;
// - set a payment method as default;
// - deactivate a payment method.
//
// There is currently NO member payment-method collection query.
//
// Therefore this container intentionally does NOT pretend that the frontend
// can manage an arbitrary collection of saved payment methods.
//
// Current authoritative surface:
//
//     Financial Account
//             │
//             ▼
//     Default Payment Method
//             │
//       ┌─────┴─────┐
//       │           │
//     Create     Deactivate
//
// A future collection query can expand this surface to:
//
//     PaymentMethodList
//          ├── PaymentMethodCard
//          └── PaymentMethodActions
//
// without changing the presentation contracts.
//
// Responsibilities:
// - load the member's financial account;
// - load the authoritative default payment method;
// - own payment-method creation form state;
// - validate form values with the feature schema;
// - generate technical correlation IDs;
// - invoke feature mutations;
// - translate feature state into presentation props;
// - handle loading, error, empty, and mutation states.
//
// This component does NOT:
// - call HTTP APIs directly;
// - contain backend business rules;
// - construct financial-account ownership relationships;
// - invent a payment-method collection;
// - maintain a fake local collection;
// - navigate;
// - determine backend payment-method lifecycle state.
//
// Technical identifiers such as correlationId are generated at the
// application boundary and are never exposed as member-facing fields.
//
// Lifecycle timestamps remain backend-authoritative.
//
// =============================================================================

'use client';

import { useState } from 'react';

import { Button } from '@/components/ui';

import { useMyFinancialAccount } from '@/features/financial-account';

import {
  createPaymentMethodSchema,
  useCreatePaymentMethod,
  useDeactivatePaymentMethod,
  useDefaultPaymentMethod,
  type CreatePaymentMethodFormValues,
  type PaymentMethodType,
} from '@/features/financial-payment-methods';

import {
  PaymentMethodActions,
  PaymentMethodCard,
  PaymentMethodForm,
} from '@/components/financial/payment-methods';

// =============================================================================
// Constants
// =============================================================================

const PAYMENT_METHOD_TYPES: readonly PaymentMethodType[] = [
  'MOBILE_MONEY',
  'BANK',
  'CARD',
  'WALLET',
  'OTHER',
];

const PAYMENT_METHOD_TYPE_OPTIONS =
  PAYMENT_METHOD_TYPES.map((type) => ({
    value: type,
    label: type
      .replaceAll('_', ' ')
      .toLowerCase()
      .replace(/\b\w/g, (character) => character.toUpperCase()),
  }));

// =============================================================================
// Local Types
// =============================================================================

interface PaymentMethodFormState {
  readonly type: PaymentMethodType;
  readonly provider: string;
  readonly providerReference: string;
  readonly displayName: string;
  readonly lastFour: string;
  readonly isDefault: boolean;
}

interface PaymentMethodFormErrors {
  readonly type?: string;
  readonly provider?: string;
  readonly providerReference?: string;
  readonly displayName?: string;
  readonly lastFour?: string;
  readonly isDefault?: string;
  readonly form?: string;
}

// =============================================================================
// Helpers
// =============================================================================

function createInitialFormState(): PaymentMethodFormState {
  return {
    type: 'MOBILE_MONEY',
    provider: '',
    providerReference: '',
    displayName: '',
    lastFour: '',
    isDefault: true,
  };
}

/**
 * Generates technical application tracing metadata.
 *
 * This value is intentionally generated only when an operation is submitted.
 */
function createCorrelationId(): string {
  return crypto.randomUUID();
}

function getPaymentMethodLabel(
  displayName: string | undefined,
  provider: string,
): string {
  const normalizedDisplayName = displayName?.trim() ?? '';

  return normalizedDisplayName.length > 0
    ? normalizedDisplayName
    : provider;
}

function getPaymentMethodDescription(
  provider: string,
  lastFour: string | undefined,
): string {
  const normalizedLastFour = lastFour?.trim() ?? '';

  if (normalizedLastFour.length > 0) {
    return `${provider} •••• ${normalizedLastFour}`;
  }

  return provider;
}

// =============================================================================
// Component
// =============================================================================

export function PaymentMethodsPageContainer() {
  // ===========================================================================
  // Financial Account
  // ===========================================================================

  const {
    data: financialAccount,
    isLoading: isAccountLoading,
    isError: isAccountError,
    error: accountError,
    refetch: refetchAccount,
  } = useMyFinancialAccount();

  // ===========================================================================
  // Default Payment Method
  // ===========================================================================
  //
  // This is currently the only authoritative member-scoped payment-method
  // retrieval surface available to this frontend feature.
  //
  // Do not reinterpret this as a collection query.
  // ===========================================================================

  const {
    data: defaultPaymentMethod,
    isLoading: isDefaultPaymentMethodLoading,
    isError: isDefaultPaymentMethodError,
    error: defaultPaymentMethodError,
    refetch: refetchDefaultPaymentMethod,
  } = useDefaultPaymentMethod(financialAccount?.publicId);

  // ===========================================================================
  // Mutations
  // ===========================================================================

  const createPaymentMethodMutation =
    useCreatePaymentMethod();

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

  const isDeactivating =
    deactivatePaymentMethodMutation.isPending;

  const isMutating =
    isCreating || isDeactivating;

  const hasDefaultPaymentMethod =
    defaultPaymentMethod !== null &&
    defaultPaymentMethod !== undefined;

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

    const request: CreatePaymentMethodFormValues = {
      type: form.type,

      provider: form.provider,

      correlationId: createCorrelationId(),

      providerReference:
        form.providerReference.trim() || undefined,

      displayName:
        form.displayName.trim() || undefined,

      lastFour:
        form.lastFour.trim() || undefined,

      isDefault: form.isDefault,
    };

    const parsed =
      createPaymentMethodSchema.safeParse(request);

    if (!parsed.success) {
      const fieldErrors =
        parsed.error.flatten().fieldErrors;

      setErrors({
        type: fieldErrors.type?.[0],
        provider: fieldErrors.provider?.[0],
        providerReference:
          fieldErrors.providerReference?.[0],
        displayName:
          fieldErrors.displayName?.[0],
        lastFour:
          fieldErrors.lastFour?.[0],
        isDefault:
          fieldErrors.isDefault?.[0],
      });

      return;
    }

    createPaymentMethodMutation.mutate(
      {
        accountPublicId:
          financialAccount.publicId,

        request: parsed.data,
      },
      {
        onSuccess: async () => {
          //
          // Refresh the authoritative backend representation.
          //
          // We deliberately do not append the newly created payment method
          // to a local collection because no authoritative collection query
          // exists yet.
          //
          await refetchDefaultPaymentMethod();

          setForm(createInitialFormState());
          setErrors({});
          setShowForm(false);
        },

        onError: (error) => {
          setErrors({
            form:
              error.message ||
              'Unable to add the payment method. Please try again.',
          });
        },
      },
    );
  };

  // ===========================================================================
  // Deactivate Default Payment Method
  // ===========================================================================
  //
  // With the current API surface, this is the only payment method whose
  // identity the container can authoritatively obtain.
  //
  // There is intentionally no "set default" handler here because the queried
  // payment method is already the default payment method.
  //
  // Once a payment-method collection query exists, the generic
  // PaymentMethodActions component can expose set-default/deactivate actions
  // for each individual collection item.
  // ===========================================================================

  const handleDeactivateDefaultPaymentMethod = () => {
    if (!defaultPaymentMethod?.publicId) {
      return;
    }

    deactivatePaymentMethodMutation.mutate(
      {
        paymentMethodPublicId:
          defaultPaymentMethod.publicId,

        request: {
          correlationId: createCorrelationId(),
        },
      },
      {
        onSuccess: () => {
          void refetchDefaultPaymentMethod();
        },
      },
    );
  };

  // ===========================================================================
  // Loading
  // ===========================================================================

  if (
    isAccountLoading ||
    isDefaultPaymentMethodLoading
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

                  <div className="h-10 w-36 animate-pulse rounded bg-[var(--background-muted)]" />
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
    isDefaultPaymentMethodError
  ) {
    const message =
      accountError?.message ??
      defaultPaymentMethodError?.message ??
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
                      void refetchDefaultPaymentMethod();
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
                    Manage your default payment method for wallet top-ups.
                  </p>
                </div>

                {!showForm ? (
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={openCreateForm}
                  >
                    Add payment method
                  </Button>
                ) : null}
              </div>
            </header>

            {/* -----------------------------------------------------------------
                Default Payment Method
            ------------------------------------------------------------------ */}

            {hasDefaultPaymentMethod ? (
              <section
                aria-labelledby="default-payment-method-title"
                className="space-y-3"
              >
                <div>
                  <h2
                    id="default-payment-method-title"
                    className="text-sm font-semibold text-[var(--foreground)]"
                  >
                    Default payment method
                  </h2>

                  <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                    This payment method can be used when a wallet top-up
                    requires a selected payment method.
                  </p>
                </div>

                <PaymentMethodCard
                  type={defaultPaymentMethod.type}
                  label={getPaymentMethodLabel(
                    defaultPaymentMethod.displayName,
                    defaultPaymentMethod.provider,
                  )}
                  description={getPaymentMethodDescription(
                    defaultPaymentMethod.provider,
                    defaultPaymentMethod.lastFour,
                  )}
                  isDefault={
                    defaultPaymentMethod.isDefault
                  }
                  isActive={
                    defaultPaymentMethod.isActive
                  }
                  actions={
                    <PaymentMethodActions
                      isDefault={
                        defaultPaymentMethod.isDefault
                      }
                      isActive={
                        defaultPaymentMethod.isActive
                      }
                      isLoading={isMutating}
                      onDeactivate={
                        defaultPaymentMethod.isActive
                          ? handleDeactivateDefaultPaymentMethod
                          : undefined
                      }
                    />
                  }
                />

                {deactivatePaymentMethodMutation.isError ? (
                  <div
                    role="alert"
                    className="rounded-[var(--radius-md)] border border-[var(--danger)] bg-[var(--danger-soft)] px-4 py-3 text-sm text-[var(--danger)]"
                  >
                    {deactivatePaymentMethodMutation.error.message ||
                      'Unable to deactivate the payment method. Please try again.'}
                  </div>
                ) : null}
              </section>
            ) : null}

            {/* -----------------------------------------------------------------
                No Default Payment Method
            ------------------------------------------------------------------ */}

            {!hasDefaultPaymentMethod ? (
              <section className="surface p-6">
                <div className="space-y-3">
                  <div>
                    <h2 className="text-sm font-semibold text-[var(--foreground)]">
                      No default payment method
                    </h2>

                    <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                      Add a payment method to make wallet top-ups easier.
                    </p>
                  </div>

                  {!showForm ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={openCreateForm}
                    >
                      Add payment method
                    </Button>
                  ) : null}
                </div>
              </section>
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
                    Add payment method
                  </h2>

                  <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                    Add the payment details required by the selected provider.
                  </p>
                </div>

                <PaymentMethodForm
                  type={form.type}
                  typeOptions={PAYMENT_METHOD_TYPE_OPTIONS}
                  provider={form.provider}
                  providerReference={form.providerReference}
                  displayName={form.displayName}
                  lastFour={form.lastFour}
                  isDefault={form.isDefault}
                  errors={{
                    type: errors.type,
                    provider: errors.provider,
                    providerReference:
                      errors.providerReference,
                    displayName:
                      errors.displayName,
                    lastFour:
                      errors.lastFour,
                    isDefault:
                      errors.isDefault,
                  }}
                  isSubmitting={isCreating}
                  formError={errors.form}
                  onTypeChange={(type) => {
                    setForm((current) => ({
                      ...current,
                      type,
                    }));

                    clearFieldError('type');
                  }}
                  onProviderChange={(provider) => {
                    setForm((current) => ({
                      ...current,
                      provider,
                    }));

                    clearFieldError('provider');
                  }}
                  onProviderReferenceChange={(
                    providerReference,
                  ) => {
                    setForm((current) => ({
                      ...current,
                      providerReference,
                    }));

                    clearFieldError(
                      'providerReference',
                    );
                  }}
                  onDisplayNameChange={(displayName) => {
                    setForm((current) => ({
                      ...current,
                      displayName,
                    }));

                    clearFieldError('displayName');
                  }}
                  onLastFourChange={(lastFour) => {
                    setForm((current) => ({
                      ...current,
                      lastFour,
                    }));

                    clearFieldError('lastFour');
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

            {/* -----------------------------------------------------------------
                Create Mutation Error
            ------------------------------------------------------------------ */}

            {createPaymentMethodMutation.isError &&
            !errors.form ? (
              <div
                role="alert"
                className="rounded-[var(--radius-md)] border border-[var(--danger)] bg-[var(--danger-soft)] px-4 py-3 text-sm text-[var(--danger)]"
              >
                {createPaymentMethodMutation.error.message ||
                  'Unable to add the payment method. Please try again.'}
              </div>
            ) : null}

          </div>
        </section>
      </div>
    </main>
  );
}

export default PaymentMethodsPageContainer;

