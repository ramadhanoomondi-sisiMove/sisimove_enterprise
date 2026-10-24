'use client';

import { useState } from 'react';
import {
  MoreHorizontal,
  Play,
  Radio,
  UserCheck,
  XCircle,
} from 'lucide-react';

import type { LucideIcon } from 'lucide-react';

import type { AdminBoarding } from '@/features/admin/boardings/models';
import {
  AdminBoardingParticipantRole,
  AdminBoardingParticipantStatus,
  AdminBoardingStatus,
} from '@/features/admin/boardings/models';
import { cn } from '@/foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type BoardingOperation =
  | 'open'
  | 'board-provider'
  | 'start-journey'
  | 'cancel';

interface BoardingActionsMenuProps {
  boarding: AdminBoarding;
  onSelect: (operation: BoardingOperation) => void;
  disabled?: boolean;
}

interface BoardingAction {
  label: string;
  operation: BoardingOperation;
  Icon: LucideIcon;
  destructive?: boolean;
  visible: boolean;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function BoardingActionsMenu({
  boarding,
  onSelect,
  disabled = false,
}: BoardingActionsMenuProps) {
  const [open, setOpen] = useState(false);

  const provider = boarding.participants.find(
    (participant) =>
      participant.role === AdminBoardingParticipantRole.PROVIDER,
  );

  const providerBoarded =
    provider?.status === AdminBoardingParticipantStatus.BOARDED;

  const allActions: BoardingAction[] = [
    {
      label: 'Open boarding',
      operation: 'open',
      Icon: Radio,
      visible: boarding.status === AdminBoardingStatus.NOT_STARTED,
    },
    {
      label: 'Mark provider boarded',
      operation: 'board-provider',
      Icon: UserCheck,
      visible:
        boarding.status === AdminBoardingStatus.BOARDING &&
        !providerBoarded,
    },
    {
      label: 'Start journey',
      operation: 'start-journey',
      Icon: Play,
      visible:
        boarding.status === AdminBoardingStatus.BOARDING &&
        providerBoarded,
    },
    {
      label: 'Cancel boarding',
      operation: 'cancel',
      Icon: XCircle,
      destructive: true,
      visible:
        boarding.status !== AdminBoardingStatus.STARTED &&
        boarding.status !== AdminBoardingStatus.CANCELLED,
    },
  ];

  const actions = allActions.filter(
    (action) => action.visible,
  );

  if (actions.length === 0) {
    return null;
  }

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        aria-label="Boarding actions"
        aria-haspopup="menu"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted-foreground)] transition hover:bg-[var(--muted)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <MoreHorizontal className="h-5 w-5" />
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close actions menu"
            tabIndex={-1}
            className="fixed inset-0 z-10 cursor-default"
            onClick={() => setOpen(false)}
          />

          <div
            role="menu"
            aria-label="Boarding operations"
            className="absolute right-0 z-20 mt-2 w-56 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1.5 shadow-xl"
          >
            {actions.map(
              ({ label, operation, Icon, destructive }) => (
                <button
                  key={operation}
                  type="button"
                  role="menuitem"
                  disabled={disabled}
                  onClick={() => {
                    setOpen(false);
                    onSelect(operation);
                  }}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition hover:bg-[var(--muted)] disabled:cursor-not-allowed disabled:opacity-50',
                    destructive
                      ? 'text-[var(--danger)]'
                      : 'text-[var(--foreground)]',
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </button>
              ),
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default BoardingActionsMenu;
