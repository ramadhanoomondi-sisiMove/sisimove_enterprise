
'use client';

import { useState } from 'react';

import { Button, Dialog } from '@/components/ui';

import type {
  AdminActivateCommissionRuleModel,
  AdminCommissionRuleModel,
} from '@/features/admin/finance/commissions/models';

export interface CommissionRuleActivateDialogProps {
  readonly open: boolean;
  readonly rule: AdminCommissionRuleModel | null;
  readonly loading?: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (
    payload: AdminActivateCommissionRuleModel,
  ) => void | Promise<void>;
}

export function CommissionRuleActivateDialog({
  open,
  rule,
  loading = false,
  onClose,
  onSubmit,
}: CommissionRuleActivateDialogProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleConfirm() {
    if (!rule || loading) {
      return;
    }

    setSubmitError(null);

    const payload: AdminActivateCommissionRuleModel = {
      activatedAt: new Date().toISOString(),
    };

    try {
      await onSubmit(payload);
    } catch {
      setSubmitError(
        'The commission rule could not be activated. Please try again.',
      );
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && !loading) {
          setSubmitError(null);
          onClose();
        }
      }}
      title="Activate commission rule"
      description="Confirm that you want to activate this commission rule."
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
              Activating this rule changes its lifecycle status.
              Confirm that the rule should become active.
            </p>
          </>
        ) : (
          <p className="text-sm text-[var(--foreground-secondary)]">
            No commission rule has been selected.
          </p>
        )}

        {submitError && (
          <p
            role="alert"
            className="rounded-md border border-[var(--danger)] bg-[var(--danger-soft)] px-3 py-2 text-sm text-[var(--danger)]"
          >
            {submitError}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setSubmitError(null);
              onClose();
            }}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="primary"
            onClick={handleConfirm}
            loading={loading}
            disabled={!rule || loading}
          >
            Activate rule
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
