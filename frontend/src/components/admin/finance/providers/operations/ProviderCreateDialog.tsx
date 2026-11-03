"use client";

import { useState } from 'react';

import { cn } from '@/foundation/utils/cn';

import type {
  AdminCreateProviderInput,
  AdminCreateProviderCapabilityInput,
  AdminProviderCapabilityType,
} from '@/features/admin/finance/providers';

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
  capabilities: [],
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

const CAPABILITY_OPTIONS: {
  value: AdminProviderCapabilityType;
  label: string;
  description: string;
}[] = [
  {
    value: 'INITIATE_PAYMENT',
    label: 'Initiate Payment',
    description: 'Start a customer payment, such as an M-PESA STK Push.',
  },
  {
    value: 'VERIFY_PAYMENT',
    label: 'Verify Payment',
    description: 'Verify whether a payment was successfully completed.',
  },
  {
    value: 'QUERY_PAYMENT',
    label: 'Query Payment',
    description: 'Retrieve the status of an existing payment.',
  },
  {
    value: 'REFUND_PAYMENT',
    label: 'Refund Payment',
    description: 'Process a refund where supported.',
  },
  {
    value: 'INITIATE_DISBURSEMENT',
    label: 'Initiate Disbursement',
    description: 'Send money to a recipient.',
  },
  {
    value: 'VERIFY_DISBURSEMENT',
    label: 'Verify Disbursement',
    description: 'Verify the result of a disbursement.',
  },
  {
    value: 'QUERY_BALANCE',
    label: 'Query Balance',
    description: 'Retrieve the provider account balance.',
  },
  {
    value: 'WEBHOOKS',
    label: 'Webhooks',
    description: 'Receive provider payment notifications.',
  },
];

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
  // Capability Selection
  // ---------------------------------------------------------------------------

  const toggleCapability = (
    capabilityType: AdminProviderCapabilityType,
    checked: boolean,
  ) => {
    setForm((current) => {
      const currentCapabilities = current.capabilities ?? [];

      const updatedCapabilities = checked
        ? [
            ...currentCapabilities.filter(
              (capability) => capability.type !== capabilityType,
            ),
            {
              type: capabilityType,
              isSupported: true,
            },
          ]
        : currentCapabilities.filter(
            (capability) => capability.type !== capabilityType,
          );

      return {
        ...current,
        capabilities: updatedCapabilities,
      };
    });
  };

  const isCapabilitySelected = (
    capabilityType: AdminProviderCapabilityType,
  ) =>
    (form.capabilities ?? []).some(
      (capability) => capability.type === capabilityType,
    );

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

    const capabilities: AdminCreateProviderCapabilityInput[] =
      (form.capabilities ?? []).map((capability) => ({
        type: capability.type,
        isSupported: capability.isSupported,
      }));

    onConfirm({
      code: form.code.trim(),
      name: form.name.trim(),
      type: form.type,
      environment: form.environment,
      description: form.description?.trim() || undefined,
      configurationReference:
        form.configurationReference?.trim() || undefined,
      capabilities,
    });
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <ProviderOperationConfirmation
      isOpen
      title="Create payment provider"
      description="Register a new payment provider and select the capabilities its integration supports."
      confirmLabel="Create Provider"
      cancelLabel="Cancel"
      isLoading={isLoading}
      onConfirm={handleConfirm}
      onCancel={onCancel}
    >
      <div className="max-h-[65vh] space-y-5 overflow-y-auto pr-1">

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

        {/* Capabilities */}

        <div className="space-y-3 rounded-lg border border-border p-3">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-foreground">
              Provider capabilities
            </h3>

            <p className="text-xs text-muted-foreground">
              Select only the capabilities that this provider&apos;s
              integration actually implements. Selected capabilities
              will be registered as supported.
            </p>
          </div>

          <div className="space-y-3">
            {CAPABILITY_OPTIONS.map((capability) => (
              <label
                key={capability.value}
                className="flex cursor-pointer items-start gap-3 rounded-md border border-border p-3"
              >
                <input
                  type="checkbox"
                  checked={isCapabilitySelected(capability.value)}
                  onChange={(event) =>
                    toggleCapability(
                      capability.value,
                      event.target.checked,
                    )
                  }
                  disabled={isLoading}
                  className="mt-1 h-4 w-4 shrink-0 accent-primary"
                />

                <span className="space-y-1">
                  <span className="block text-sm font-medium text-foreground">
                    {capability.label}
                  </span>

                  <span className="block text-xs text-muted-foreground">
                    {capability.description}
                  </span>
                </span>
              </label>
            ))}
          </div>

          <p className="text-xs text-muted-foreground">
            Selected: {(form.capabilities ?? []).length}
          </p>
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