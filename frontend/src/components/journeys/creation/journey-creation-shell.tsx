// -----------------------------------------------------------------------------
// sisiMove — Journey Creation Shell
// -----------------------------------------------------------------------------
//
// Shared visual shell for the multi-step Journey creation workflow.
//
// Responsibilities:
// - Provide the visual frame for Journey creation.
// - Keep the workflow compact and mobile-first.
// - Provide consistent spacing and surfaces across creation steps.
// - Render the supplied progress, content, and navigation areas.
//
// Non-responsibilities:
// - Journey API calls.
// - Form state.
// - Validation.
// - Step navigation logic.
// - Journey lifecycle decisions.
//
// Those concerns belong to the container, individual forms, hooks, and
// application/API layers respectively.
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyCreationShellProps {
  /**
   * Optional workflow header.
   *
   * Usually contains the Journey title and current step information.
   */
  header?: ReactNode;

  /**
   * Progress indicator for the Journey creation workflow.
   */
  progress?: ReactNode;

  /**
   * Active step content.
   */
  children: ReactNode;

  /**
   * Navigation controls for moving between creation steps.
   */
  navigation?: ReactNode;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyCreationShell({
  header,
  progress,
  children,
  navigation,
}: JourneyCreationShellProps) {
  return (
    <main className="page-shell">
      <div className="page-container py-6 sm:py-8">
        <div className="mx-auto w-full max-w-3xl">
          {/* -----------------------------------------------------------------
              Header
              ----------------------------------------------------------------- */}

          {header ? (
            <div className="mb-5">
              {header}
            </div>
          ) : null}

          {/* -----------------------------------------------------------------
              Progress
              ----------------------------------------------------------------- */}

          {progress ? (
            <div className="mb-5">
              {progress}
            </div>
          ) : null}

          {/* -----------------------------------------------------------------
              Step Content
              ----------------------------------------------------------------- */}

          <section
            aria-label="Journey creation"
            className="surface overflow-hidden"
          >
            <div className="p-5 sm:p-7">
              {children}
            </div>

            {/* ---------------------------------------------------------------
                Navigation
                --------------------------------------------------------------- */}

            {navigation ? (
              <div className="border-t border-[var(--border-subtle)] bg-[var(--background-subtle)] px-5 py-4 sm:px-7">
                {navigation}
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </main>
  );
}