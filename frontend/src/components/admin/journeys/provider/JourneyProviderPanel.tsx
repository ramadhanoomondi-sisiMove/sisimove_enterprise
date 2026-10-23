
'use client';

/**
 * sisiMove — Journey Provider Panel
 *
 * Presents provider identity within the journey detail view.
 *
 * Responsibilities:
 * - Display the provider associated with a journey.
 * - Reuse JourneyProviderSummary and JourneyProviderIdentity.
 * - Support compact layouts.
 * - Allow the provider public ID to be shown or hidden.
 * - Avoid fetching provider data or inventing profile information.
 */

import { UserRound } from 'lucide-react';

import { cn } from '@/foundation/utils/cn';
import type { Journey } from '@/features/admin/journeys/models/journey.model';

import JourneyProviderSummary from './JourneyProviderSummary';

export interface JourneyProviderPanelProps {
  journey: Pick<Journey, 'providerPublicId'>;
  name?: string | null;
  avatarUrl?: string | null;
  verified?: boolean;
  subtitle?: string;
  className?: string;
  compact?: boolean;
  showProviderId?: boolean;
}

export default function JourneyProviderPanel({
  journey,
  name,
  avatarUrl,
  verified = false,
  subtitle,
  className,
  compact = false,
  showProviderId = true,
}: JourneyProviderPanelProps) {
  return (
    <section
      aria-labelledby="journey-provider-panel-heading"
      className={cn('min-w-0 space-y-4', className)}
    >
      <header className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-soft)] text-[var(--brand)]">
          <UserRound aria-hidden="true" className="size-5" />
        </span>

        <div className="min-w-0">
          <h2
            id="journey-provider-panel-heading"
            className="text-base font-semibold text-[var(--foreground)]"
          >
            Provider details
          </h2>

          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Identity associated with this journey
          </p>
        </div>
      </header>

      <JourneyProviderSummary
        providerPublicId={journey.providerPublicId}
        name={name}
        avatarUrl={avatarUrl}
        verified={verified}
        subtitle={subtitle}
        compact={compact}
        showProviderId={showProviderId}
      />
    </section>
  );
}
