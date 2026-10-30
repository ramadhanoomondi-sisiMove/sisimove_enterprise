"use client";
import { useState } from 'react';

import { cn } from '@/foundation/utils/cn';

import type {
  AdminProvider,
  AdminUpdateProviderInput,
} from '@/features/admin/finance/providers';

import { ProviderOperationConfirmation } from './ProviderOperationConfirmation';

// -----------------------------------------------------------------------------
// sisiMove Admin — Provider Update Dialog
// -----------------------------------------------------------------------------

export interface ProviderUpdateDialogProps {
  provider: AdminProvider;
  isOpen: boolean;
  isLoading?: boolean;
  onConfirm: (input: AdminUpdateProviderInput) => void;
  onCancel: () => void;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function ProviderUpdateDialog({
  provider,
  isOpen,
  isLoading = false,
  onConfirm,
  onCancel,
}: ProviderUpdateDialogProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <ProviderUpdateDialogContent
      key={provider.publicId}
      provider={provider}
      isLoading={isLoading}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}

// -----------------------------------------------------------------------------
// Dialog Content
// -----------------------------------------------------------------------------

interface ProviderUpdateDialogContentProps {
  provider: AdminProvider;
  isLoading: boolean;
  onConfirm: (input: AdminUpdateProviderInput) => void;
  onCancel: () => void;
}

function ProviderUpdateDialogContent({
  provider,
  isLoading,
  onConfirm,
  onCancel,
}: ProviderUpdateDialogContentProps) {
  const [name, setName] = useState(provider.name);

  // ---------------------------------------------------------------------------
  // Form Validation
  // ---------------------------------------------------------------------------

  const trimmedName = name.trim();

  const isValid = trimmedName.length > 0;
  const hasChanges = trimmedName !== provider.name;

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------

  const handleConfirm = () => {
    if (!isValid || !hasChanges || isLoading) {
      return;
    }

    onConfirm({
      name: trimmedName,
    });
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <ProviderOperationConfirmation
      isOpen
      title="Update payment provider"
      description={`Update the information for ${provider.name}.`}
      confirmLabel="Save Changes"
      cancelLabel="Cancel"
      isLoading={isLoading}
      onConfirm={handleConfirm}
      onCancel={onCancel}
    >
      <div className="space-y-4">
        {/* Provider Name */}

        <div className="space-y-2">
          <label
            htmlFor="provider-update-name"
            className="text-sm font-medium text-foreground"
          >
            Provider name
          </label>

          <input
            id="provider-update-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={isLoading}
            maxLength={120}
            required
            placeholder="Enter provider name"
            className={cn(
              'h-10 w-full rounded-md border border-input',
              'bg-background px-3 text-sm text-foreground',
              'placeholder:text-muted-foreground',
              'focus-visible:outline-none focus-visible:ring-2',
              'focus-visible:ring-ring disabled:opacity-50',
            )}
          />

          {!isValid && (
            <p className="text-xs text-red-600">
              Provider name is required.
            </p>
          )}
        </div>

        {/* Provider Code */}

        <div className="rounded-md border bg-muted/50 p-3">
          <p className="text-xs font-medium text-muted-foreground">
            Provider code
          </p>

          <p className="mt-1 text-sm font-medium text-foreground">
            {provider.code}
          </p>

          <p className="mt-2 text-xs text-muted-foreground">
            Provider codes cannot be changed through this operation.
          </p>
        </div>

        {!hasChanges && (
          <p className="text-xs text-muted-foreground">
            Enter a different provider name to save changes.
          </p>
        )}
      </div>
    </ProviderOperationConfirmation>
  );
}
