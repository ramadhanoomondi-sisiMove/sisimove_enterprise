
import type {
  AdminProvider,
  AdminProviderCapability,
} from '@/features/admin/finance/providers';

import { ProviderOperationConfirmation } from './ProviderOperationConfirmation';

// -----------------------------------------------------------------------------
// sisiMove Admin — Provider Capability Enable Dialog
// -----------------------------------------------------------------------------

export interface ProviderCapabilityEnableDialogProps {
  provider: AdminProvider;
  capability: AdminProviderCapability;
  isOpen: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

// -----------------------------------------------------------------------------
// Capability Labels
// -----------------------------------------------------------------------------

const CAPABILITY_LABELS: Record<string, string> = {
  INITIATE_PAYMENT: 'Initiate Payment',
  VERIFY_PAYMENT: 'Verify Payment',
  QUERY_PAYMENT: 'Query Payment',
  REFUND_PAYMENT: 'Refund Payment',
  INITIATE_DISBURSEMENT: 'Initiate Disbursement',
  VERIFY_DISBURSEMENT: 'Verify Disbursement',
  QUERY_BALANCE: 'Query Balance',
  WEBHOOKS: 'Webhooks',
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function ProviderCapabilityEnableDialog({
  provider,
  capability,
  isOpen,
  isLoading = false,
  onConfirm,
  onCancel,
}: ProviderCapabilityEnableDialogProps) {
  const capabilityName =
    CAPABILITY_LABELS[capability.type] ?? capability.type;

  return (
    <ProviderOperationConfirmation
      isOpen={isOpen}
      title="Enable provider capability?"
      description={`You are about to enable ${capabilityName} for ${provider.name}.`}
      confirmLabel="Enable Capability"
      cancelLabel="Cancel"
      variant="default"
      isLoading={isLoading}
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      <div className="space-y-3 rounded-md border bg-muted/50 p-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Provider
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">
            {provider.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {provider.code}
          </p>
        </div>

        <div className="border-t pt-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Capability
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">
            {capabilityName}
          </p>
        </div>

        {!capability.isSupported && (
          <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            This capability is currently not marked as supported.
            The backend will determine whether enabling it is permitted.
          </p>
        )}
      </div>
    </ProviderOperationConfirmation>
  );
}
