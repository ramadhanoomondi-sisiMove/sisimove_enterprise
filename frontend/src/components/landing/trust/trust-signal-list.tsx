// src/components/landing/trust/trust-signal-list.tsx

// -----------------------------------------------------------------------------
// sisiMove — Landing Trust Signal List
// -----------------------------------------------------------------------------
//
// Public landing-page Trust signal list.
//
// This component presents the Trust signals that help travellers understand
// what makes sharing a journey safer and more transparent.
//
// Important distinction:
// - TrustSignal belongs to the landing-page presentation.
// - TrustBadge belongs to the Trust feature/domain and represents an actual
//   badge associated with a traveller.
//
// This component does not:
// - fetch Trust data;
// - calculate Trust;
// - determine verification status;
// - award Trust badges;
// - access Identity data;
// - access Booking data;
// - access Financial data;
// - expose private Trust information.
//
// This is presentation-only.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------

import type {
  HTMLAttributes,
  ReactNode,
} from 'react';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { cn } from '../../../foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface TrustSignal {
  /**
   * Stable presentation identifier for the Trust signal.
   */
  id: string;

  /**
   * Public Trust signal label.
   */
  label: ReactNode;

  /**
   * Optional supporting description.
   */
  description?: ReactNode;

  /**
   * Optional replacement leading visual.
   */
  leadingContent?: ReactNode;

  /**
   * Whether the signal should currently be presented.
   *
   * Defaults to true.
   */
  active?: boolean;
}

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface TrustSignalListProps
  extends Omit<
    HTMLAttributes<HTMLUListElement>,
    'children' | 'title'
  > {
  /**
   * Public Trust signals to display.
   */
  signals?: readonly TrustSignal[];

  /**
   * Whether inactive signals should be displayed.
   *
   * Defaults to false so unavailable presentation signals are not exposed
   * by default.
   */
  showInactive?: boolean;

  /**
   * Optional empty-state content.
   */
  emptyContent?: ReactNode;

  /**
   * Layout direction.
   */
  direction?: 'vertical' | 'horizontal';
}

// -----------------------------------------------------------------------------
// Default Signal Icon
// -----------------------------------------------------------------------------

function DefaultSignalIcon() {
  return (
    <span
      aria-hidden="true"
      className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600"
    >
      <svg
        viewBox="0 0 20 20"
        fill="none"
        className="size-5"
      >
        <path
          d="m10 2.75 1.75 1.05 2.03.15.72 1.9 1.55 1.32-.55 1.96.55 1.96-1.55 1.32-.72 1.9-2.03.15L10 17.25l-1.75-1.05-2.03-.15-.72-1.9-1.55-1.32.55-1.96-.55-1.96 1.55-1.32.72-1.9 2.03-.15L10 2.75Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />

        <path
          d="m7.2 10 1.8 1.8 3.8-3.8"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TrustSignalList({
  signals = [],
  showInactive = false,
  emptyContent,
  direction = 'vertical',
  className,
  ...props
}: TrustSignalListProps) {
  const visibleSignals = signals.filter(
    (signal) =>
      showInactive || signal.active !== false,
  );

  if (visibleSignals.length === 0) {
    if (!emptyContent) {
      return null;
    }

    return (
      <div className={cn(className)}>
        {emptyContent}
      </div>
    );
  }

  const directionClasses =
    direction === 'horizontal'
      ? 'flex flex-wrap gap-3'
      : 'grid grid-cols-1 gap-4 sm:grid-cols-2';

  return (
    <ul
      className={cn(
        directionClasses,
        className,
      )}
      {...props}
    >
      {visibleSignals.map((signal) => (
        <li
          key={signal.id}
          className="flex min-w-0 items-start gap-3"
        >
          {signal.leadingContent ?? (
            <DefaultSignalIcon />
          )}

          <div className="min-w-0">
            <p className="text-sm font-semibold text-neutral-950">
              {signal.label}
            </p>

            {signal.description ? (
              <p className="mt-1 text-sm leading-5 text-neutral-600">
                {signal.description}
              </p>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}