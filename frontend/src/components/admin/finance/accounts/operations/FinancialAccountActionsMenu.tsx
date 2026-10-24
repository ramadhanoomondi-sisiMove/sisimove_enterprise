'use client';

import { useState } from 'react';
import { Ban, CheckCircle2, MoreHorizontal, XCircle } from 'lucide-react';
import type { AdminFinancialAccount } from '@/features/admin/finance/accounts/models';

export type FinancialAccountOperation = 'activate' | 'suspend' | 'close';

export interface FinancialAccountActionsMenuProps {
  account: AdminFinancialAccount;
  onSelectOperation: (operation: FinancialAccountOperation) => void;
  isPending?: boolean;
}

export function FinancialAccountActionsMenu({
  account, onSelectOperation, isPending = false,
}: FinancialAccountActionsMenuProps) {
  const [open, setOpen] = useState(false);

  const actions = [
    ...(account.status !== 'ACTIVE' && account.status !== 'CLOSED'
      ? [{ operation: 'activate' as const, label: 'Activate account', icon: CheckCircle2 }]
      : []),
    ...(account.status === 'ACTIVE'
      ? [{ operation: 'suspend' as const, label: 'Suspend account', icon: Ban }]
      : []),
    ...(account.status !== 'CLOSED'
      ? [{ operation: 'close' as const, label: 'Close account', icon: XCircle }]
      : []),
  ];

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        disabled={isPending || actions.length === 0}
        onClick={() => setOpen((current) => !current)}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--background-muted)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <MoreHorizontal size={17} aria-hidden="true" />
        Actions
      </button>
      {open && actions.length > 0 && (
        <>
          <button type="button" aria-label="Close actions menu" className="fixed inset-0 z-10 cursor-default" onClick={() => setOpen(false)} />
          <div role="menu" className="absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1 shadow-lg">
            {actions.map(({ operation, label, icon: Icon }) => (
              <button
                key={operation}
                type="button"
                role="menuitem"
                onClick={() => { setOpen(false); onSelectOperation(operation); }}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition hover:bg-[var(--background-muted)] ${operation === 'close' ? 'text-[var(--danger)]' : 'text-[var(--foreground)]'}`}
              >
                <Icon size={16} aria-hidden="true" /> {label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default FinancialAccountActionsMenu;
