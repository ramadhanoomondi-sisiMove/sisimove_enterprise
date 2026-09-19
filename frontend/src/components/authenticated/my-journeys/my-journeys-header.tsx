// -----------------------------------------------------------------------------
// sisiMove — My Journeys Header
// -----------------------------------------------------------------------------
//
// Header presentation for the authenticated My Journeys view.
//
// Responsibility:
// - Introduce the user's journey collection.
// - Provide concise contextual information.
// - Provide an optional action supplied by the parent.
//
// This component intentionally does NOT:
// - fetch journeys;
// - inspect authentication;
// - inspect verification;
// - determine journey permissions;
// - perform navigation itself;
// - contain Journey domain logic.
//
// Navigation and actions remain the responsibility of the parent page.
//
// Design intent:
// - Keep the header compact and mobile-first.
// - Keep the primary action visually close to the page title.
// - Avoid excessive horizontal separation on large screens.
// - Preserve the authenticated application's restrained visual language.
//
// -----------------------------------------------------------------------------

import { Button } from '@/components/ui/button';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface MyJourneysHeaderProps {
  /**
   * Optional action for publishing a new journey.
   *
   * The parent owns the navigation behavior.
   */
  readonly onPublishJourney?: () => void;
}

// -----------------------------------------------------------------------------
// My Journeys Header
// -----------------------------------------------------------------------------

export function MyJourneysHeader({
  onPublishJourney,
}: MyJourneysHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="min-w-0">
        <h1 className="text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl">
          My Journeys
        </h1>

        <p className="mt-1 max-w-xl text-sm leading-6 text-[var(--foreground-muted)]">
          Manage the journeys you have created and published.
        </p>
      </div>

      {onPublishJourney && (
        <div className="shrink-0">
          <Button
            type="button"
            size="md"
            onClick={onPublishJourney}
          >
            Publish a journey
          </Button>
        </div>
      )}
    </header>
  );
}

export default MyJourneysHeader;