
import type {
  AdminProvider,
  AdminProviderCapability,
} from '@/features/admin/finance/providers';

import { ProviderOperationConfirmation } from './ProviderOperationConfirmation';

// -----------------------------------------------------------------------------
// sisiMove Admin — Provider Capability Disable Dialog
// -----------------------------------------------------------------------------

export interface ProviderCapabilityDisableDialogProps {
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

export function ProviderCapabilityDisableDialog({
  provider,
  capability,
  isOpen,
  isLoading = false,
  onConfirm,
  onCancel,
}: ProviderCapabilityDisableDialogProps) {
  const capabilityName =
    CAPABILITY_LABELS[capability.type] ?? capability.type;

  return (
    <ProviderOperationConfirmation
      isOpen={isOpen}
      title="Disable provider capability?"
      description={`You are about to disable ${capabilityName} for ${provider.name}.`}
      confirmLabel="Disable Capability"
      cancelLabel="Keep Enabled"
      variant="danger"
      isLoading={isLoading}
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      <div className="space-y-3 rounded-md border border-red-200 bg-red-50 p-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-red-700">
            Provider
          </p>
          <p className="mt-1 text-sm font-semibold text-red-900">
            {provider.name}
          </p>
          <p className="text-xs text-red-700">
            {provider.code}
          </p>
        </div>

        <div className="border-t border-red-200 pt-3">
          <p className="text-xs font-medium uppercase tracking-wide text-red-700">
            Capability being disabled
          </p>
          <p className="mt-1 text-sm font-semibold text-red-900">
            {capabilityName}
          </p>
        </div>

        <p className="text-sm text-red-800">
          This capability will no longer be available for new
          operations through this provider while disabled.
        </p>
      </div>
    </ProviderOperationConfirmation>
  );
}
