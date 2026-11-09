'use client';

import { useState } from 'react';
import { Button } from '@/components/ui';
import {
  getAdminWithdrawalActions,
  type AdminWithdrawalAction,
} from '@/features/admin/finance/withdrawals/models/admin-withdrawal.enums';
import type { AdminWithdrawal } from '@/features/admin/finance/withdrawals/models/admin-withdrawal.model';
import { cn } from '@/foundation/utils/cn';

export interface WithdrawalActionsMenuProps {
  withdrawal: AdminWithdrawal;
  onAction: (action: AdminWithdrawalAction, withdrawal: AdminWithdrawal) => void;
  disabled?: boolean;
  className?: string;
}

const ACTION_LABELS: Record<AdminWithdrawalAction, string> = {
  PROCESS: 'Process',
  COMPLETE: 'Complete',
  FAIL: 'Mark as failed',
  CANCEL: 'Cancel',
};

export function WithdrawalActionsMenu({
  withdrawal,
  onAction,
  disabled = false,
  className,
}: WithdrawalActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const actions = getAdminWithdrawalActions(withdrawal.status);

  if (actions.length === 0) {
    return null;
  }

  return (
    <div className={cn('relative inline-block text-left', className)}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((current) => !current)}
      >
        Actions
        <span aria-hidden="true">⌄</span>
      </Button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close actions menu"
            className="fixed inset-0 z-10 cursor-default"
            onClick={() => setOpen(false)}
          />

          <div className="absolute right-0 z-20 mt-2 w-48 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-1 shadow-[var(--shadow-lg)]">
            {actions.map((action) => (
              <button
                key={action}
                type="button"
                className={cn(
                  'block w-full rounded-[var(--radius-sm)] px-3 py-2 text-left text-sm',
                  'text-[var(--foreground)] transition-colors hover:bg-[var(--background-muted)]',
                  (action === 'FAIL' || action === 'CANCEL') && 'text-[var(--danger)]',
                )}
                onClick={() => {
                  setOpen(false);
                  onAction(action, withdrawal);
                }}
              >
                {ACTION_LABELS[action]}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default WithdrawalActionsMenu;