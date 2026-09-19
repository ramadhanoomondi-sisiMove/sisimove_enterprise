// -----------------------------------------------------------------------------
// sisiMove — My Demands Header
// -----------------------------------------------------------------------------
//
// Header presentation for the authenticated My Demands view.
//
// Responsibility:
// - Introduce the user's Journey Demand collection.
// - Provide concise contextual information.
// - Provide an optional action for creating a new Journey Demand.
//
// This component intentionally does NOT:
// - fetch Journey Demands;
// - inspect authentication;
// - inspect verification;
// - determine Demand permissions;
// - perform navigation itself;
// - contain Journey Demand domain logic.
//
// Navigation and authorization remain the responsibility of the parent page.
// -----------------------------------------------------------------------------

import { Button } from '@/components/ui/button';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface MyDemandsHeaderProps {
  /**
   * Optional action for creating a new Journey Demand.
   *
   * The parent owns the navigation behavior.
   */
  readonly onCreateDemand?: () => void;
}

// -----------------------------------------------------------------------------
// My Demands Header
// -----------------------------------------------------------------------------

export function MyDemandsHeader({
  onCreateDemand,
}: MyDemandsHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
          My Demands
        </h1>

        <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--foreground-muted)]">
          Manage the Journey Demands you have created and the travel you are
          looking for.
        </p>
      </div>

      {onCreateDemand && (
        <Button
          type="button"
          size="md"
          onClick={onCreateDemand}
        >
          Create a travel demand
        </Button>
      )}
    </header>
  );
}