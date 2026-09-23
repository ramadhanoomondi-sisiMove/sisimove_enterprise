// -----------------------------------------------------------------------------
// sisiMove — Journey Creation Container
// -----------------------------------------------------------------------------
//
// Shared content container for the journey creation flow.
//
// Responsibilities:
// - Provide consistent compact width for creation content.
// - Keep the experience mobile-first and centered on larger screens.
// - Provide predictable vertical spacing between sections.
// - Remain presentation-only.
//
// Non-responsibilities:
// - No API calls.
// - No form state.
// - No navigation logic.
// - No journey lifecycle logic.
// - No step-specific business rules.
//
// The outer JourneyCreationShell owns the page/surface structure.
// This component owns the readable content width and internal rhythm.
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

// ----------------------------------------------------------------------------
// Props
// ----------------------------------------------------------------------------

export interface JourneyCreationContainerProps {
  /**
   * Journey creation content.
   *
   * The container intentionally accepts ReactNode so individual creation
   * steps remain responsible for their own composition.
   */
  children: ReactNode;

  /**
   * Optional additional class names for controlled composition.
   */
  className?: string;
}

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------

export function JourneyCreationContainer({
  children,
  className,
}: JourneyCreationContainerProps) {
  return (
    <div
      className={[
        'mx-auto w-full max-w-2xl',
        'space-y-5',
        'sm:space-y-6',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}