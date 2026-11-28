
'use client';

import { Button, Dialog } from '@/components/ui';

import type { AdminCommissionRuleModel } from '@/features/admin/commissions/models';

export type CommissionRuleOperation = 'activate' | 'deactivate';

export interface CommissionRuleOperationConfirmationProps {
  readonly open: boolean;
  readonly action: CommissionRuleOperation;
  readonly rule: AdminCommissionRuleModel | null;
  readonly loading?: boolean;
  readonly error?: string | null;
  readonly onClose: () => void;
  readonly onConfirm: () => void | Promise<void>;
}

const operationConfig: Record<
  CommissionRuleOperation,
  {
    title: string;
    description: string;
    confirmationMessage: string;
    confirmLabel: string;
    buttonVariant: 'primary' | 'danger';
  }
> = {
  activate: {
    title: 'Activate commission rule',
    description: 'Confirm that you want to activate this commission rule.',
    confirmationMessage:
      'Activating this rule changes its lifecycle status. Confirm that the rule should become active.',
    confirmLabel: 'Activate rule',
    buttonVariant: 'primary',
  },
  deactivate: {
    title: 'Deactivate commission rule',
    description: 'Confirm that you want to deactivate this commission rule.',
    confirmationMessage:
      'Deactivating this rule changes its lifecycle status. Confirm that it should no longer remain active.',
    confirmLabel: 'Deactivate rule',
    buttonVariant: 'danger',
  },
};

export function CommissionRuleOperationConfirmation({
  open,
  action,
  rule,
  loading = false,
  error,
  onClose,
  onConfirm,
}: CommissionRuleOperationConfirmationProps) {
  const config = operationConfig[action];

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && !loading) {
          onClose();
        }
      }}
      title={config.title}
      description={config.description}
      size="sm"
      closeOnBackdropClick={!loading}
      closeOnEscape={!loading}
    >
      <div className="space-y-4">
        {rule ? (
          <>
            <div className="rounded-md border border-[var(--border)] bg-[var(--background-muted)] p-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-[var(--foreground-secondary)]">
                  Commission type
                </span>
                <span className="text-sm font-medium">
                  {rule.type}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between gap-3">
                <span className="text-sm text-[var(--foreground-secondary)]">
                  Percentage
                </span>
                <span className="text-sm font-medium">
                  {rule.percentage}%
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between gap-3">
                <span className="text-sm text-[var(--foreground-secondary)]">
                  Current status
                </span>
                <span className="text-sm font-medium">
                  {rule.status}
                </span>
              </div>
            </div>

            <p className="text-sm text-[var(--foreground-secondary)]">
              {config.confirmationMessage}
            </p>
          </>
        ) : (
          <p className="text-sm text-[var(--foreground-secondary)]">
            No commission rule has been selected.
          </p>
        )}

        {error && (
          <p
            role="alert"
            className="rounded-md border border-[var(--danger)] bg-[var(--danger-soft)] px-3 py-2 text-sm text-[var(--danger)]"
          >
            {error}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant={config.buttonVariant}
            onClick={onConfirm}
            loading={loading}
            disabled={!rule || loading}
          >
            {config.confirmLabel}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
