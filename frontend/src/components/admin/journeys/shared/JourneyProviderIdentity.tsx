
'use client';

import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/foundation/utils/cn';

export interface JourneyProviderIdentityProps {
  name: string;
  providerPublicId: string;
  avatarUrl?: string | null;
  verified?: boolean;
  subtitle?: string;
  compact?: boolean;
  showProviderId?: boolean;
  className?: string;
}

export function JourneyProviderIdentity({
  name,
  providerPublicId,
  avatarUrl,
  verified = false,
  subtitle,
  compact = false,
  showProviderId = true,
  className,
}: JourneyProviderIdentityProps) {
  const displayName = name.trim() || 'Unknown provider';
  const normalizedProviderPublicId = providerPublicId.trim();

  return (
    <div
      className={cn(
        'flex min-w-0 items-center',
        compact ? 'gap-2.5' : 'gap-3',
        className,
      )}
    >
      <Avatar
        src={avatarUrl}
        alt={`${displayName} profile`}
        fallback={displayName}
        size={compact ? 'sm' : 'lg'}
        className="border border-[var(--border)]"
      />

      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
          <span
            className="truncate text-sm font-semibold text-[var(--foreground)]"
            title={displayName}
          >
            {displayName}
          </span>

          {verified && (
            <span
              aria-label="Verified provider"
              title="Verified provider"
              className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--success-soft)] text-[var(--success)]"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                fill="none"
                className="h-3 w-3"
              >
                <path
                  d="m4 8 2.5 2.5L12 5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          )}
        </div>

        {subtitle && (
          <p className="mt-0.5 truncate text-xs text-[var(--foreground-muted)]">
            {subtitle}
          </p>
        )}

        {showProviderId && (
          <p
            className="mt-0.5 truncate font-mono text-[11px] text-[var(--foreground-muted)]"
            title={normalizedProviderPublicId || undefined}
          >
            {normalizedProviderPublicId || 'Provider ID unavailable'}
          </p>
        )}
      </div>
    </div>
  );
}

export default JourneyProviderIdentity;
