"use client";
import { useState } from 'react';

import { cn } from '@/foundation/utils/cn';

import type { AdminCreateProviderInput } from '@/features/admin/finance/providers';
import {
  ADMIN_PROVIDER_TYPES,
  ADMIN_PROVIDER_ENVIRONMENTS,
  type AdminProviderType,
  type AdminProviderEnvironment,
} from '@/features/admin/finance/providers';

import { ProviderOperationConfirmation } from './ProviderOperationConfirmation';

// -----------------------------------------------------------------------------
// sisiMove Admin — Provider Create Dialog
// -----------------------------------------------------------------------------

export interface ProviderCreateDialogProps {
  isOpen: boolean;
  isLoading?: boolean;
  onConfirm: (input: AdminCreateProviderInput) => void;
  onCancel: () => void;
}

// -----------------------------------------------------------------------------
// Form State
// -----------------------------------------------------------------------------

const INITIAL_FORM: AdminCreateProviderInput = {
  code: '',
  name: '',
  type: 'OTHER',
  environment: 'SANDBOX',
  description: '',
  configurationReference: '',
};

// -----------------------------------------------------------------------------
// Labels
// -----------------------------------------------------------------------------

const TYPE_LABELS: Record<AdminProviderType, string> = {
  MOBILE_MONEY: 'Mobile Money',
  BANK: 'Bank',
  CARD_PROCESSOR: 'Card Processor',
  PAYMENT_GATEWAY: 'Payment Gateway',
  DIGITAL_WALLET: 'Digital Wallet',
  OTHER: 'Other',
};

const ENVIRONMENT_LABELS: Record<
  AdminProviderEnvironment,
  string
> = {
  SANDBOX: 'Sandbox',
  PRODUCTION: 'Production',
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function ProviderCreateDialog({
  isOpen,
  isLoading = false,
  onConfirm,
  onCancel,
}: ProviderCreateDialogProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <ProviderCreateDialogContent
      onConfirm={onConfirm}
      onCancel={onCancel}
      isLoading={isLoading}
    />
  );
}

// -----------------------------------------------------------------------------
// Dialog Content
// -----------------------------------------------------------------------------

interface ProviderCreateDialogContentProps {
  isLoading: boolean;
  onConfirm: (input: AdminCreateProviderInput) => void;
  onCancel: () => void;
}

function ProviderCreateDialogContent({
  isLoading,
  onConfirm,
  onCancel,
}: ProviderCreateDialogContentProps) {
  const [form, setForm] =
    useState<AdminCreateProviderInput>(INITIAL_FORM);

  // ---------------------------------------------------------------------------
  // Update Form Fields
  // ---------------------------------------------------------------------------

  const updateField = <
    K extends keyof AdminCreateProviderInput,
  >(
    field: K,
    value: AdminCreateProviderInput[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  const isValid =
    form.code.trim().length > 0 &&
    form.name.trim().length > 0;

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------

  const handleConfirm = () => {
    if (!isValid || isLoading) {
      return;
    }

    onConfirm({
      code: form.code.trim(),
      name: form.name.trim(),
      type: form.type,
      environment: form.environment,
      description: form.description?.trim() || undefined,
      configurationReference:
        form.configurationReference?.trim() || undefined,
    });
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <ProviderOperationConfirmation
      isOpen
      title="Create payment provider"
      description="Register a new payment provider in the financial administration module."
      confirmLabel="Create Provider"
      cancelLabel="Cancel"
      isLoading={isLoading}
      onConfirm={handleConfirm}
      onCancel={onCancel}
    >
      <div className="max-h-[65vh] space-y-4 overflow-y-auto pr-1">

        {/* Provider Code */}

        <div className="space-y-2">
          <label
            htmlFor="provider-create-code"
            className="text-sm font-medium text-foreground"
          >
            Provider code *
          </label>

          <input
            id="provider-create-code"
            type="text"
            value={form.code}
            onChange={(event) =>
              updateField(
                'code',
                event.target.value.toUpperCase(),
              )
            }
            disabled={isLoading}
            required
            maxLength={60}
            placeholder="e.g. MPESA"
            className={inputClass}
          />

          <p className="text-xs text-muted-foreground">
            Use a unique identifier for this provider.
          </p>
        </div>

        {/* Provider Name */}

        <div className="space-y-2">
          <label
            htmlFor="provider-create-name"
            className="text-sm font-medium text-foreground"
          >
            Provider name *
          </label>

          <input
            id="provider-create-name"
            type="text"
            value={form.name}
            onChange={(event) =>
              updateField('name', event.target.value)
            }
            disabled={isLoading}
            required
            maxLength={120}
            placeholder="Enter provider name"
            className={inputClass}
          />
        </div>

        {/* Provider Type */}

        <div className="space-y-2">
          <label
            htmlFor="provider-create-type"
            className="text-sm font-medium text-foreground"
          >
            Provider type *
          </label>

          <select
            id="provider-create-type"
            value={form.type}
            onChange={(event) =>
              updateField(
                'type',
                event.target.value as AdminProviderType,
              )
            }
            disabled={isLoading}
            className={inputClass}
          >
            {ADMIN_PROVIDER_TYPES.map((type) => (
              <option key={type} value={type}>
                {TYPE_LABELS[type]}
              </option>
            ))}
          </select>
        </div>

        {/* Environment */}

        <div className="space-y-2">
          <label
            htmlFor="provider-create-environment"
            className="text-sm font-medium text-foreground"
          >
            Environment *
          </label>

          <select
            id="provider-create-environment"
            value={form.environment}
            onChange={(event) =>
              updateField(
                'environment',
                event.target.value as AdminProviderEnvironment,
              )
            }
            disabled={isLoading}
            className={inputClass}
          >
            {ADMIN_PROVIDER_ENVIRONMENTS.map((environment) => (
              <option key={environment} value={environment}>
                {ENVIRONMENT_LABELS[environment]}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}

        <div className="space-y-2">
          <label
            htmlFor="provider-create-description"
            className="text-sm font-medium text-foreground"
          >
            Description
          </label>

          <textarea
            id="provider-create-description"
            value={form.description ?? ''}
            onChange={(event) =>
              updateField('description', event.target.value)
            }
            disabled={isLoading}
            rows={3}
            maxLength={500}
            placeholder="Describe this payment provider..."
            className={cn(inputClass, 'h-auto py-2')}
          />
        </div>

        {/* Configuration Reference */}

        <div className="space-y-2">
          <label
            htmlFor="provider-create-configuration"
            className="text-sm font-medium text-foreground"
          >
            Configuration reference
          </label>

          <input
            id="provider-create-configuration"
            type="text"
            value={form.configurationReference ?? ''}
            onChange={(event) =>
              updateField(
                'configurationReference',
                event.target.value,
              )
            }
            disabled={isLoading}
            placeholder="Optional configuration reference"
            className={inputClass}
          />

          <p className="text-xs text-muted-foreground">
            Enter a reference to the provider configuration.
            Do not enter secret credentials here.
          </p>
        </div>

      </div>
    </ProviderOperationConfirmation>
  );
}

// -----------------------------------------------------------------------------
// Shared Input Styles
// -----------------------------------------------------------------------------

const inputClass = cn(
  'w-full rounded-md border border-input bg-background',
  'px-3 py-2 text-sm text-foreground',
  'placeholder:text-muted-foreground',
  'focus-visible:outline-none focus-visible:ring-2',
  'focus-visible:ring-ring disabled:cursor-not-allowed',
  'disabled:opacity-50',
  'min-h-10',
);
