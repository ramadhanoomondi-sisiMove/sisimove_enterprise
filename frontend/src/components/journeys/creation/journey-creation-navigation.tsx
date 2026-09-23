// -----------------------------------------------------------------------------
// sisiMove — Journey Creation Navigation
// -----------------------------------------------------------------------------
//
// Navigation controls shared by all journey creation steps.
//
// Responsibilities:
// - Render previous/next actions.
// - Render an optional secondary action such as "Save & exit".
// - Handle disabled/loading states.
// - Remain independent of Next.js routing and API concerns.
//
// Non-responsibilities:
// - No router usage.
// - No API calls.
// - No form submission logic.
// - No journey lifecycle logic.
//
// The parent step/page owns the actual handlers.
// -----------------------------------------------------------------------------

'use client';

import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';

// ----------------------------------------------------------------------------
// Props
// ----------------------------------------------------------------------------

export interface JourneyCreationNavigationProps {
  /**
   * Called when the user wants to return to the previous step.
   */
  onBack?: () => void;

  /**
   * Called when the user wants to continue to the next step.
   *
   * The parent may use this for validation, persistence, or navigation.
   */
  onNext?: () => void;

  /**
   * Optional secondary action, normally used for saving progress
   * without continuing to the next step.
   */
  onSaveAndExit?: () => void;

  /**
   * Label for the primary forward action.
   *
   * Defaults to "Continue".
   */
  nextLabel?: string;

  /**
   * Label for the back action.
   *
   * Defaults to "Back".
   */
  backLabel?: string;

  /**
   * Label for the secondary save action.
   *
   * Defaults to "Save & exit".
   */
  saveAndExitLabel?: string;

  /**
   * Indicates that the current step is being persisted or submitted.
   */
  isLoading?: boolean;

  /**
   * Disables the back action.
   */
  backDisabled?: boolean;

  /**
   * Disables the primary forward action.
   */
  nextDisabled?: boolean;

  /**
   * Indicates that this is the final step.
   *
   * The default final action label becomes "Publish journey".
   */
  isLastStep?: boolean;

  /**
   * Optional additional content rendered on the left side.
   */
  leading?: ReactNode;

  /**
   * Optional additional class names.
   */
  className?: string;
}

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------

export function JourneyCreationNavigation({
  onBack,
  onNext,
  onSaveAndExit,
  nextLabel,
  backLabel = 'Back',
  saveAndExitLabel = 'Save & exit',
  isLoading = false,
  backDisabled = false,
  nextDisabled = false,
  isLastStep = false,
  leading,
  className,
}: JourneyCreationNavigationProps) {
  const resolvedNextLabel =
    nextLabel ?? (isLastStep ? 'Publish journey' : 'Continue');

  return (
    <nav
      aria-label="Journey creation navigation"
      className={[
        'flex flex-col gap-3',
        'sm:flex-row sm:items-center sm:justify-between',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex min-w-0 items-center gap-3">
        {onBack ? (
          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            disabled={backDisabled || isLoading}
          >
            {backLabel}
          </Button>
        ) : null}

        {leading ? (
          <div className="min-w-0">
            {leading}
          </div>
        ) : null}
      </div>

      <div className="flex items-center justify-end gap-2">
        {onSaveAndExit ? (
          <Button
            type="button"
            variant="outline"
            onClick={onSaveAndExit}
            disabled={isLoading}
          >
            {saveAndExitLabel}
          </Button>
        ) : null}

        {onNext ? (
          <Button
            type="button"
            onClick={onNext}
            disabled={nextDisabled || isLoading}
          >
            {isLoading ? 'Saving…' : resolvedNextLabel}
          </Button>
        ) : null}
      </div>
    </nav>
  );
}