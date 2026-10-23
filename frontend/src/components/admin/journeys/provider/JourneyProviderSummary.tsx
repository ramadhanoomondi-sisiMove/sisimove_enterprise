
'use client';

/**
 * sisiMove — Journey Provider Summary
 *
 * Displays provider identity in the context of a journey.
 *
 * Responsibilities:
 * - Reuse the shared JourneyProviderIdentity component.
 * - Present optional provider subtitle and verification state.
 * - Allow the provider public ID to be shown or hidden.
 * - Keep provider identity presentation consistent across admin pages.
 *
 * This component does not fetch provider data or infer verification status.
 */

import { UserRound } from 'lucide-react';

import { JourneyProviderIdentity } from '@/components/admin/journeys/shared/JourneyProviderIdentity';
import { cn } from '@/foundation/utils/cn';

export interface JourneyProviderSummaryProps {
  providerPublicId: string;
  name?: string | null;
  avatarUrl?: string | null;
  verified?: boolean;
  subtitle?: string;
  className?: string;
  compact?: boolean;
  showProviderId?: boolean;
}

export default function JourneyProviderSummary({
  providerPublicId,
  name,
  avatarUrl,
  verified = false,
  subtitle,
  className,
  compact = false,
  showProviderId = true,
}: JourneyProviderSummaryProps) {
  const displayName = name?.trim() || 'Unknown provider';

  return (
    <section
      aria-label="Journey provider summary"
      className={cn(
        'min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--surface)]',
        compact ? 'p-3' : 'p-5',
        className,
      )}
    >
      <div className="mb-4 flex items-center gap-2">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-soft)] text-[var(--brand)]">
          <UserRound aria-hidden="true" className="size-4" />
        </span>

        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-[var(--foreground)]">
            Journey provider
          </h3>

          <p className="text-xs text-[var(--foreground-muted)]">
            Provider identity associated with this journey
          </p>
        </div>
      </div>

      <JourneyProviderIdentity
        name={displayName}
        providerPublicId={providerPublicId}
        avatarUrl={avatarUrl}
        verified={verified}
        subtitle={subtitle}
        compact={compact}
        showProviderId={showProviderId}
      />
    </section>
  );
}
