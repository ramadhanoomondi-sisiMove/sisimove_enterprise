// -----------------------------------------------------------------------------
// sisiMove — Dialog
// -----------------------------------------------------------------------------
//
// Reusable modal/dialog primitive for the sisiMove design system.
//
// Responsibilities:
// - Provide an accessible modal surface
// - Manage open/closed presentation
// - Support Escape-to-close
// - Support backdrop interaction
// - Restore focus when closed
// - Provide consistent dialog styling
// - Remain completely domain-agnostic
//
// The component intentionally contains no business/domain logic.
// -----------------------------------------------------------------------------

'use client';

import {
  useEffect,
  useId,
  useRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react';

import { cn } from '../../foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface DialogProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * Controls whether the dialog is visible.
   */
  open: boolean;

  /**
   * Called when the dialog requests to close.
   */
  onOpenChange: (open: boolean) => void;

  /**
   * Dialog heading.
   */
  title: string;

  /**
   * Optional supporting description.
   */
  description?: string;

  /**
   * Dialog content.
   */
  children: ReactNode;

  /**
   * Optional content rendered in the dialog footer.
   */
  footer?: ReactNode;

  /**
   * Controls the maximum width of the dialog.
   */
  size?: DialogSize;

  /**
   * Whether clicking the backdrop closes the dialog.
   *
   * Defaults to true.
   */
  closeOnBackdropClick?: boolean;

  /**
   * Whether pressing Escape closes the dialog.
   *
   * Defaults to true.
   */
  closeOnEscape?: boolean;

  /**
   * Whether the close button is displayed.
   *
   * Defaults to true.
   */
  showCloseButton?: boolean;
}

export type DialogSize =
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl';

// -----------------------------------------------------------------------------
// Size Classes
// -----------------------------------------------------------------------------

const sizeClasses: Record<DialogSize, string> = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

// -----------------------------------------------------------------------------
// Dialog
// -----------------------------------------------------------------------------

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = 'md',
  closeOnBackdropClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  className,
  ...props
}: DialogProps) {
  const titleId = useId();
  const descriptionId = useId();

  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElementRef =
    useRef<HTMLElement | null>(null);

  // ---------------------------------------------------------------------------
  // Open / Close lifecycle
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!open) {
      return;
    }

    previouslyFocusedElementRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => {
      dialogRef.current?.focus();
    });

    return () => {
      document.body.style.overflow = previousOverflow;

      previouslyFocusedElementRef.current?.focus();
      previouslyFocusedElementRef.current = null;
    };
  }, [open]);

  // ---------------------------------------------------------------------------
  // Escape
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!open || !closeOnEscape) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') {
        return;
      }

      event.preventDefault();
      onOpenChange(false);
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    open,
    closeOnEscape,
    onOpenChange,
  ]);

  // ---------------------------------------------------------------------------
  // Closed
  // ---------------------------------------------------------------------------

  if (!open) {
    return null;
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div
      className={[
        'fixed',
        'inset-0',
        'z-50',
        'flex',
        'items-center',
        'justify-center',
        'p-4',
        'sm:p-6',
      ].join(' ')}
      role="presentation"
    >
      {/* ------------------------------------------------------------------- */}
      {/* Backdrop                                                            */}
      {/* ------------------------------------------------------------------- */}

      <div
        aria-hidden="true"
        className={[
          'absolute',
          'inset-0',
          'bg-[rgb(15_23_42_/_0.45)]',
          'backdrop-blur-[2px]',
        ].join(' ')}
        onMouseDown={(event) => {
          if (
            closeOnBackdropClick &&
            event.target === event.currentTarget
          ) {
            onOpenChange(false);
          }
        }}
      />

      {/* ------------------------------------------------------------------- */}
      {/* Dialog Surface                                                      */}
      {/* ------------------------------------------------------------------- */}

      <div
        {...props}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={
          description ? descriptionId : undefined
        }
        tabIndex={-1}
        className={cn(
          'relative',
          'z-10',
          'flex',
          'max-h-[calc(100vh-2rem)]',
          'w-full',
          'flex-col',
          'overflow-hidden',
          'rounded-[var(--radius-xl)]',
          'border',
          'border-[var(--border)]',
          'bg-[var(--surface)]',
          'shadow-[var(--shadow-lg)]',
          'outline-none',
          'sm:max-h-[calc(100vh-3rem)]',
          sizeClasses[size],
          className,
        )}
      >
        {/* ----------------------------------------------------------------- */}
        {/* Header                                                            */}
        {/* ----------------------------------------------------------------- */}

        <div
          className={[
            'flex',
            'shrink-0',
            'items-start',
            'justify-between',
            'gap-4',
            'border-b',
            'border-[var(--border-subtle)]',
            'px-4',
            'py-4',
            'sm:px-6',
            'sm:py-5',
          ].join(' ')}
        >
          <div className="min-w-0">
            <h2
              id={titleId}
              className={[
                'text-base',
                'font-semibold',
                'leading-6',
                'text-[var(--foreground)]',
                'sm:text-lg',
              ].join(' ')}
            >
              {title}
            </h2>

            {description && (
              <p
                id={descriptionId}
                className={[
                  'mt-1',
                  'text-sm',
                  'leading-5',
                  'text-[var(--foreground-muted)]',
                ].join(' ')}
              >
                {description}
              </p>
            )}
          </div>

          {showCloseButton && (
            <button
              type="button"
              aria-label="Close dialog"
              onClick={() => onOpenChange(false)}
              className={[
                'inline-flex',
                'h-9',
                'w-9',
                'shrink-0',
                'items-center',
                'justify-center',
                'rounded-[var(--radius-md)]',
                'border',
                'border-transparent',
                'text-[var(--foreground-muted)]',
                'transition-colors',
                'duration-150',
                'ease-out',
                'hover:bg-[var(--background-subtle)]',
                'hover:text-[var(--foreground)]',
                'focus-visible:outline-2',
                'focus-visible:outline-[var(--brand)]',
                'focus-visible:outline-offset-2',
              ].join(' ')}
            >
              <svg
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path
                  d="M5 5l10 10M15 5 5 15"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Content                                                           */}
        {/* ----------------------------------------------------------------- */}

        <div
          className={[
            'min-h-0',
            'flex-1',
            'overflow-y-auto',
            'px-4',
            'py-5',
            'sm:px-6',
            'sm:py-6',
          ].join(' ')}
        >
          {children}
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Footer                                                            */}
        {/* ----------------------------------------------------------------- */}

        {footer && (
          <div
            className={[
              'flex',
              'shrink-0',
              'flex-col-reverse',
              'gap-2',
              'border-t',
              'border-[var(--border-subtle)]',
              'px-4',
              'py-4',
              'sm:flex-row',
              'sm:items-center',
              'sm:justify-end',
              'sm:px-6',
              'sm:py-5',
            ].join(' ')}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}