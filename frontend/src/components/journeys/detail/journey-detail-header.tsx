// -----------------------------------------------------------------------------
// sisiMove — Journey Detail Header
// -----------------------------------------------------------------------------
//
// Presentation header for an authenticated Journey detail surface.
//
// Responsibilities:
// - Display the Journey's primary route.
// - Display status and high-level schedule information.
// - Provide a compact visual entry point into Journey details.
//
// Architectural boundary:
// - Does NOT fetch Journey data.
// - Does NOT resolve provider/traveller profiles.
// - Does NOT expose providerPublicId.
// - Does NOT mutate Journey state.
// - Does NOT own lifecycle actions.
//
// The parent detail container supplies the already-composed Journey model.
// -----------------------------------------------------------------------------

import type { Journey } from '@/features/journey/models/journey';
import type { JourneyStatus } from '@/features/journey/models/journey-status';

import { Badge } from '@/components/ui';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyDetailHeaderProps {
  journey: Journey;
  className?: string;
}

// -----------------------------------------------------------------------------
// Status presentation
// -----------------------------------------------------------------------------

const STATUS_PRESENTATION: Record<
  JourneyStatus,
  {
    label: string;
    variant: 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'outline';
  }
> = {
  DRAFT: {
    label: 'Draft',
    variant: 'default',
  },

  PUBLISHED: {
    label: 'Published',
    variant: 'brand',
  },

  FULL: {
    label: 'Full',
    variant: 'warning',
  },

  BOARDING: {
    label: 'Boarding',
    variant: 'warning',
  },

  IN_PROGRESS: {
    label: 'In progress',
    variant: 'brand',
  },

  COMPLETION_PENDING: {
    label: 'Completion pending',
    variant: 'warning',
  },

  COMPLETED: {
    label: 'Completed',
    variant: 'success',
  },

  CANCELLED: {
    label: 'Cancelled',
    variant: 'danger',
  },

  EXPIRED: {
    label: 'Expired',
    variant: 'outline',
  },
};

// -----------------------------------------------------------------------------
// Formatting
// -----------------------------------------------------------------------------

function formatDateTime(
  value?: string | null,
): string | null {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat('en-KE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyDetailHeader({
  journey,
  className,
}: JourneyDetailHeaderProps) {
  const status =
    STATUS_PRESENTATION[journey.status];

  const departure =
    journey.schedule?.departureAt ??
    journey.publishedAt ??
    null;

  const formattedDeparture =
    formatDateTime(departure);

  const origin =
    journey.corridor?.originName ??
    'Origin';

  const destination =
    journey.corridor?.destinationName ??
    'Destination';

  return (
    <header
      className={[
        'space-y-4',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge
          variant={status.variant}
          size="sm"
        >
          {status.label}
        </Badge>

        {formattedDeparture ? (
          <span className="text-sm text-[var(--foreground-muted)]">
            {formattedDeparture}
          </span>
        ) : null}
      </div>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
          {origin}
          <span
            aria-hidden="true"
            className="mx-2 text-[var(--foreground-subtle)]"
          >
            →
          </span>
          {destination}
        </h1>

        <p className="mt-2 text-sm text-[var(--foreground-secondary)]">
          Journey details
        </p>
      </div>
    </header>
  );
}