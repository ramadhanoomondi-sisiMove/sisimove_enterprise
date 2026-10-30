
"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import { cn } from "@/foundation/utils/cn";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export interface PaymentActionItem {
  id: string;
  label: string;
  onSelect: () => void;
  description?: string;
  disabled?: boolean;
  destructive?: boolean;
}

export interface PaymentActionsMenuProps {
  actions: PaymentActionItem[];
  label?: string;
  disabled?: boolean;
  className?: string;
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export function PaymentActionsMenu({
  actions,
  label = "Payment actions",
  disabled = false,
  className,
}: PaymentActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !containerRef.current?.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  if (actions.length === 0) return null;

  function handleToggle() {
    if (disabled) return;
    setOpen((current) => !current);
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative inline-block text-left", className)}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={handleToggle}
        disabled={disabled}
        className="inline-flex min-h-10 items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-medium text-[var(--foreground-secondary)] transition hover:bg-[var(--background-subtle)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <MoreHorizontal aria-hidden="true" className="size-4" />
        <span>{label}</span>
        <ChevronDown
          aria-hidden="true"
          className={cn("size-4 transition-transform", open && "rotate-180")}
        />
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label={label}
          className="absolute right-0 z-20 mt-2 w-64 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-1 shadow-lg"
        >
          {actions.map((action) => (
            <button
              key={action.id}
              type="button"
              role="menuitem"
              disabled={disabled || action.disabled}
              onClick={() => {
                setOpen(false);
                action.onSelect();
              }}
              className={cn(
                "flex w-full flex-col items-start rounded-[var(--radius-md)] px-3 py-2.5 text-left transition hover:bg-[var(--background-subtle)] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--brand)] disabled:cursor-not-allowed disabled:opacity-50",
                action.destructive
                  ? "text-[var(--danger)]"
                  : "text-[var(--foreground)]",
              )}
            >
              <span className="text-sm font-medium">{action.label}</span>

              {action.description ? (
                <span className="mt-1 text-xs leading-5 text-[var(--foreground-muted)]">
                  {action.description}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
