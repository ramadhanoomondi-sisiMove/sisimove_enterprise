
import type { AdminProvider } from '@/features/admin/finance/providers';

import { ProviderOperationConfirmation } from './ProviderOperationConfirmation';

// -----------------------------------------------------------------------------
// sisiMove Admin — Provider Enable Dialog
// -----------------------------------------------------------------------------

export interface ProviderEnableDialogProps {
  provider: AdminProvider;
  isOpen: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function ProviderEnableDialog({
  provider,
  isOpen,
  isLoading = false,
  onConfirm,
  onCancel,
}: ProviderEnableDialogProps) {
  return (
    <ProviderOperationConfirmation
      isOpen={isOpen}
      title="Enable payment provider?"
      description={`You are about to enable ${provider.name} (${provider.code}). This will allow the provider to be considered for payment operations, subject to its integration status and capabilities.`}
      confirmLabel="Enable Provider"
      cancelLabel="Cancel"
      variant="default"
      isLoading={isLoading}
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      <div className="rounded-md border bg-muted/50 p-3">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Provider
        </p>

        <p className="mt-1 font-medium text-foreground">
          {provider.name}
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          {provider.code}
        </p>
      </div>
    </ProviderOperationConfirmation>
  );
}
