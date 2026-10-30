"use client";
import { useState } from 'react';

import { cn } from '@/foundation/utils/cn';

import type { AdminProvider } from '@/features/admin/finance/providers';
import {
  ADMIN_PROVIDER_STATUSES,
  type AdminProviderStatus,
} from '@/features/admin/finance/providers';

import { ProviderOperationConfirmation } from './ProviderOperationConfirmation';

// -----------------------------------------------------------------------------
// sisiMove Admin — Provider Change Status Dialog
// -----------------------------------------------------------------------------

export interface ProviderChangeStatusDialogProps {
  provider: AdminProvider;
  isOpen: boolean;
  isLoading?: boolean;
  onConfirm: (status: AdminProviderStatus) => void;
  onCancel: () => void;
}

// -----------------------------------------------------------------------------
// Status Labels
// -----------------------------------------------------------------------------

const STATUS_LABELS: Record<AdminProviderStatus, string> = {
  NOT_CONFIGURED: 'Not configured',
  CONFIGURING: 'Configuring',
  READY: 'Ready',
  DEGRADED: 'Degraded',
  SUSPENDED: 'Suspended',
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function ProviderChangeStatusDialog({
  provider,
  isOpen,
  isLoading = false,
  onConfirm,
  onCancel,
}: ProviderChangeStatusDialogProps) {
  const [selectedStatus, setSelectedStatus] =
    useState<AdminProviderStatus>(
      provider.status as AdminProviderStatus,
    );

  const handleConfirm = () => {
    onConfirm(selectedStatus);
  };

  return (
    <ProviderOperationConfirmation
      isOpen={isOpen}
      title="Change integration status"
      description={`Select the new integration status for ${provider.name}.`}
      confirmLabel="Update Status"
      cancelLabel="Cancel"
      isLoading={isLoading}
      onConfirm={handleConfirm}
      onCancel={onCancel}
    >
      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium text-foreground">
            Current status
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {STATUS_LABELS[
              provider.status as AdminProviderStatus
            ] ?? provider.status}
          </p>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="provider-integration-status"
            className="text-sm font-medium text-foreground"
          >
            New integration status
          </label>

          <select
            id="provider-integration-status"
            value={selectedStatus}
            onChange={(event) =>
              setSelectedStatus(
                event.target.value as AdminProviderStatus,
              )
            }
            disabled={isLoading}
            className={cn(
              'h-10 w-full rounded-md border border-input',
              'bg-background px-3 text-sm text-foreground',
              'focus-visible:outline-none focus-visible:ring-2',
              'focus-visible:ring-ring disabled:opacity-50',
            )}
          >
            {ADMIN_PROVIDER_STATUSES.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </div>

        {selectedStatus === 'SUSPENDED' && (
          <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            A suspended integration should not be treated as ready
            for payment operations.
          </p>
        )}

        {selectedStatus === 'READY' && (
          <p className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
            Select Ready only when the provider integration has
            completed its required configuration and verification.
          </p>
        )}
      </div>
    </ProviderOperationConfirmation>
  );
}
