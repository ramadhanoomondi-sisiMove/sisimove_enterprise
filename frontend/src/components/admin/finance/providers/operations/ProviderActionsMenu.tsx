"use client";
import { useState } from 'react';
import {
  ChevronDown,
  Edit,
  Power,
  PowerOff,
  Settings2,
} from 'lucide-react';

import { cn } from '@/foundation/utils/cn';

import type { AdminProvider } from '@/features/admin/finance/providers';

// -----------------------------------------------------------------------------
// sisiMove Admin — Provider Actions Menu
// -----------------------------------------------------------------------------

export interface ProviderActionsMenuProps {
  provider: AdminProvider;
  onEdit?: (provider: AdminProvider) => void;
  onEnable?: (provider: AdminProvider) => void;
  onDisable?: (provider: AdminProvider) => void;
  onChangeStatus?: (provider: AdminProvider) => void;
  isLoading?: boolean;
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function ProviderActionsMenu({
  provider,
  onEdit,
  onEnable,
  onDisable,
  onChangeStatus,
  isLoading = false,
  className,
}: ProviderActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  const handleAction = (
    callback?: (provider: AdminProvider) => void,
  ) => {
    closeMenu();
    callback?.(provider);
  };

  return (
    <div className={cn('relative inline-block', className)}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        disabled={isLoading}
        onClick={() => setIsOpen((current) => !current)}
        className={cn(
          'inline-flex h-9 items-center justify-center gap-2',
          'rounded-md border border-input bg-background px-3',
          'text-sm font-medium text-foreground transition-colors',
          'hover:bg-muted focus-visible:outline-none',
          'focus-visible:ring-2 focus-visible:ring-ring',
          'disabled:pointer-events-none disabled:opacity-50',
        )}
      >
        Actions
        <ChevronDown
          className={cn(
            'h-4 w-4 transition-transform',
            isOpen && 'rotate-180',
          )}
        />
      </button>

      {isOpen && (
        <>
          <button
            type="button"
            aria-label="Close provider actions menu"
            tabIndex={-1}
            onClick={closeMenu}
            className="fixed inset-0 z-40 cursor-default"
          />

          <div
            role="menu"
            aria-label={`${provider.name} actions`}
            className={cn(
              'absolute right-0 z-50 mt-2 w-56',
              'rounded-lg border bg-popover p-1 shadow-lg',
            )}
          >
            {onEdit && (
              <button
                type="button"
                role="menuitem"
                onClick={() => handleAction(onEdit)}
                className={menuItemClass}
              >
                <Edit className="h-4 w-4" />
                Edit provider
              </button>
            )}

            {provider.isEnabled ? (
              onDisable && (
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => handleAction(onDisable)}
                  className={cn(
                    menuItemClass,
                    'text-red-600 hover:bg-red-50',
                  )}
                >
                  <PowerOff className="h-4 w-4" />
                  Disable provider
                </button>
              )
            ) : (
              onEnable && (
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => handleAction(onEnable)}
                  className={cn(
                    menuItemClass,
                    'text-emerald-700 hover:bg-emerald-50',
                  )}
                >
                  <Power className="h-4 w-4" />
                  Enable provider
                </button>
              )
            )}

            {onChangeStatus && (
              <>
                <div className="my-1 border-t" />

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => handleAction(onChangeStatus)}
                  className={menuItemClass}
                >
                  <Settings2 className="h-4 w-4" />
                  Change integration status
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Menu Item Styles
// -----------------------------------------------------------------------------

const menuItemClass = cn(
  'flex w-full items-center gap-3 rounded-md px-3 py-2',
  'text-left text-sm font-medium text-foreground',
  'transition-colors hover:bg-muted',
  'focus-visible:outline-none focus-visible:ring-2',
  'focus-visible:ring-ring',
);
