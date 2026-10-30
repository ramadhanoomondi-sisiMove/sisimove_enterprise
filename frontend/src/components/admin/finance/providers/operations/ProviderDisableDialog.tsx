
import type { AdminProvider } from '@/features/admin/finance/providers';

import { ProviderOperationConfirmation } from './ProviderOperationConfirmation';

// -----------------------------------------------------------------------------
// sisiMove Admin — Provider Disable Dialog
// -----------------------------------------------------------------------------

export interface ProviderDisableDialogProps {
  provider: AdminProvider;
  isOpen: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function ProviderDisableDialog({
  provider,
  isOpen,
  isLoading = false,
  onConfirm,
  onCancel,
}: ProviderDisableDialogProps) {
  return (
    <ProviderOperationConfirmation
      isOpen={isOpen}
      title="Disable payment provider?"
      description={`You are about to disable ${provider.name} (${provider.code}). The provider will no longer be available for new payment operations while disabled.`}
      confirmLabel="Disable Provider"
      cancelLabel="Keep Enabled"
      variant="danger"
      isLoading={isLoading}
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      <div className="rounded-md border border-red-200 bg-red-50 p-3">
        <p className="text-xs font-medium uppercase tracking-wide text-red-700">
          Provider being disabled
        </p>

        <p className="mt-1 font-medium text-red-900">
          {provider.name}
        </p>

        <p className="mt-1 text-xs text-red-700">
          {provider.code}
        </p>
      </div>
    </ProviderOperationConfirmation>
  );
}
