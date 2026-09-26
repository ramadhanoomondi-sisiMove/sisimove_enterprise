'use client';

// -----------------------------------------------------------------------------
// sisiMove — Notification Type Icon
// -----------------------------------------------------------------------------
//
// Domain-aware presentation primitive for notification types.
//
// Responsibilities:
// - visually identify the notification category;
// - provide an accessible tooltip-like label through aria-label;
// - remain independent from notification fetching and mutations.
//
// Non-responsibilities:
// - notification fetching;
// - notification lifecycle decisions;
// - notification navigation;
// - notification mutation.
//
// -----------------------------------------------------------------------------

import type { Notification } from '@/features/notification/models';

import { cn } from '@/foundation/utils';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface NotificationTypeIconProps {
  /**
   * Notification category.
   */
  type: Notification['type'];

  /**
   * Optional notification priority.
   *
   * Priority is presentation context only and does not change notification
   * lifecycle semantics.
   */
  priority?: Notification['priority'];

  /**
   * Optional additional classes.
   */
  className?: string;
}

// -----------------------------------------------------------------------------
// Labels
// -----------------------------------------------------------------------------

function getTypeLabel(
  type: Notification['type'],
): string {
  switch (type) {
    case 'JOURNEY':
      return 'Journey';

    case 'BOOKING':
      return 'Booking';

    case 'PAYMENT':
      return 'Payment';

    case 'WALLET':
      return 'Wallet';

    case 'TRUST':
      return 'Trust';

    case 'VERIFICATION':
      return 'Verification';

    case 'MESSAGE':
      return 'Message';

    case 'SUPPORT':
      return 'Support';

    case 'SYSTEM':
      return 'System';

    default:
      return type;
  }
}

// -----------------------------------------------------------------------------
// Icon Paths
// -----------------------------------------------------------------------------

function TypeIcon({
  type,
}: {
  type: Notification['type'];
}) {
  switch (type) {
    case 'JOURNEY':
      return (
        <>
          <path
            d="M5 19V5"
            strokeLinecap="round"
          />
          <path
            d="M5 5h10l-2 3 2 3H5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      );

    case 'BOOKING':
      return (
        <>
          <rect
            x="4"
            y="5"
            width="16"
            height="14"
            rx="2"
          />
          <path
            d="M8 3v4M16 3v4M4 10h16"
            strokeLinecap="round"
          />
        </>
      );

    case 'PAYMENT':
      return (
        <>
          <rect
            x="3"
            y="5"
            width="18"
            height="14"
            rx="2"
          />
          <path
            d="M3 10h18"
            strokeLinecap="round"
          />
          <path
            d="M7 15h3"
            strokeLinecap="round"
          />
        </>
      );

    case 'WALLET':
      return (
        <>
          <path
            d="M4 7.5A2.5 2.5 0 0 1 6.5 5H19v14H6.5A2.5 2.5 0 0 1 4 16.5v-9Z"
            strokeLinejoin="round"
          />
          <path
            d="M4 8h15"
            strokeLinecap="round"
          />
          <path
            d="M16 12h3"
            strokeLinecap="round"
          />
        </>
      );

    case 'TRUST':
      return (
        <>
          <path
            d="M12 3 19 6v5c0 4.5-3 7.5-7 10-4-2.5-7-5.5-7-10V6l7-3Z"
            strokeLinejoin="round"
          />
          <path
            d="m9 12 2 2 4-4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      );

    case 'VERIFICATION':
      return (
        <>
          <rect
            x="4"
            y="3"
            width="16"
            height="18"
            rx="2"
          />
          <path
            d="M8 7h8M8 11h8M8 15h4"
            strokeLinecap="round"
          />
        </>
      );

    case 'MESSAGE':
      return (
        <>
          <path
            d="M4 5h16v11H8l-4 4V5Z"
            strokeLinejoin="round"
          />
          <path
            d="M8 9h8M8 12h5"
            strokeLinecap="round"
          />
        </>
      );

    case 'SUPPORT':
      return (
        <>
          <path
            d="M4 12a8 8 0 0 1 16 0"
            strokeLinecap="round"
          />
          <path
            d="M4 12v4a2 2 0 0 0 2 2h1v-6H4ZM20 12v4a2 2 0 0 1-2 2h-1v-6h3Z"
            strokeLinejoin="round"
          />
          <path
            d="M15 18c-.5 1-1.5 1.5-3 1.5"
            strokeLinecap="round"
          />
        </>
      );

    case 'SYSTEM':
      return (
        <>
          <path
            d="M12 3v3M12 18v3M3 12h3M18 12h3"
            strokeLinecap="round"
          />
          <path
            d="m5.64 5.64 2.12 2.12M16.24 16.24l2.12 2.12M18.36 5.64l-2.12 2.12M7.76 16.24l-2.12 2.12"
            strokeLinecap="round"
          />
          <circle
            cx="12"
            cy="12"
            r="4"
          />
        </>
      );
  }
}

// -----------------------------------------------------------------------------
// Notification Type Icon
// -----------------------------------------------------------------------------

export function NotificationTypeIcon({
  type,
  priority,
  className,
}: NotificationTypeIconProps) {
  const isCritical = priority === 'CRITICAL';

  return (
    <span
      aria-label={getTypeLabel(type)}
      title={getTypeLabel(type)}
      className={cn(
        'flex',
        'h-9',
        'w-9',
        'shrink-0',
        'items-center',
        'justify-center',
        'rounded-[var(--radius-full)]',
        isCritical
          ? [
              'bg-[var(--danger-soft)]',
              'text-[var(--danger)]',
            ].join(' ')
          : [
              'bg-[var(--brand-soft)]',
              'text-[var(--brand)]',
            ].join(' '),
        className,
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        className="h-4.5 w-4.5"
        aria-hidden="true"
      >
        <TypeIcon type={type} />
      </svg>
    </span>
  );
}