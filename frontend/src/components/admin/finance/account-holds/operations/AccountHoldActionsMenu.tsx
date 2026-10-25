'use client';

import { useState } from 'react';
import {
  Ban,
  ChevronDown,
  CircleDollarSign,
  Unlock,
} from 'lucide-react';

import type { AdminAccountHold } from '@/features/admin/finance/account-holds/models';
import { AdminAccountHoldOperation } from '@/features/admin/finance/account-holds/models';
import { Button } from '@/components/ui/button';
import { cn } from '@/foundation/utils/cn';

export interface AccountHoldActionsMenuProps {
  hold: AdminAccountHold;
  onSelect: (operation: AdminAccountHoldOperation) => void;
  disabled?: boolean;
  className?: string;
}

export function AccountHoldActionsMenu({
  hold,
  onSelect,
  disabled = false,
  className,
}: AccountHoldActionsMenuProps) {
  const [open, setOpen] = useState(false);

  const actions = [
    {
      operation: AdminAccountHoldOperation.CAPTURE,
      label: 'Capture hold',
      description: 'Capture funds from this hold.',
      icon: CircleDollarSign,
    },
    {
      operation: AdminAccountHoldOperation.RELEASE,
      label: 'Release hold',
      description: 'Release the held funds.',
      icon: Unlock,
    },
    {
      operation: AdminAccountHoldOperation.CANCEL,
      label: 'Cancel hold',
      description: 'Cancel this active hold.',
      icon: Ban,
    },
  ];

  const isDisabled = disabled || !hold.isCurrentlyActive || hold.isTerminal;

  return (
    <div className={cn('relative inline-flex', className)}>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        disabled={isDisabled}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        trailingIcon={<ChevronDown className="size-4" />}
      >
        Actions
      </Button>

      {open && !isDisabled ? (
        <>
          <button
            type="button"
            aria-label="Close actions menu"
            className="fixed inset-0 z-10 cursor-default"
            onClick={() => setOpen(false)}
          />

          <div
            role="menu"
            aria-label="Account hold operations"
            className="absolute right-0 top-full z-20 mt-2 w-64 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1 shadow-lg"
          >
            {actions.map(({ operation, label, description, icon: Icon }) => (
              <button
                key={operation}
                type="button"
                role="menuitem"
                className="flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left transition hover:bg-[var(--background-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
                onClick={() => {
                  setOpen(false);
                  onSelect(operation);
                }}
              >
                <Icon className="mt-0.5 size-4 shrink-0 text-[var(--foreground-secondary)]" />

                <span className="min-w-0">
                  <span className="block text-sm font-medium text-[var(--foreground)]">
                    {label}
                  </span>
                  <span className="mt-0.5 block text-xs text-[var(--foreground-muted)]">
                    {description}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}