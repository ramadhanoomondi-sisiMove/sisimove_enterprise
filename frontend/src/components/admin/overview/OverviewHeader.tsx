
/**
 * -----------------------------------------------------------------------------
 * sisiMove — Overview Header
 * -----------------------------------------------------------------------------
 *
 * Primary page header for the Admin Overview dashboard.
 *
 * Responsibilities:
 *
 * - communicate the purpose of the administration dashboard;
 * - display optional contextual welcome text;
 * - communicate automatic refresh status;
 * - display the time of the most recent successful data refresh;
 * - allow the administrator to request a manual refresh.
 *
 * Architectural boundaries:
 *
 * - This component does not fetch API data.
 * - It does not configure polling.
 * - The parent supplies refresh state and the refresh callback.
 * - It reuses the shared sisiMove design-system primitives.
 *
 * -----------------------------------------------------------------------------
 */

import { Button, Spinner } from '@/components/ui';


// =============================================================================
// Types
// =============================================================================

export interface OverviewHeaderProps {
  /**
   * Main page heading.
   */
  title?: string;

  /**
   * Supporting introduction.
   */
  description?: string;

  /**
   * Optional administrator display name.
   */
  administratorName?: string;

  /**
   * Whether automatic background refresh is enabled.
   */
  liveUpdatesEnabled?: boolean;

  /**
   * Whether a data request or manual refresh is in progress.
   */
  isRefreshing?: boolean;

  /**
   * Time of the most recent successful refresh.
   */
  lastUpdatedAt?: Date | null;

  /**
   * Callback to refresh the overview data.
   */
  onRefresh?: () => void;

  /**
   * Optional additional CSS classes.
   */
  className?: string;
}


// =============================================================================
// Date Formatting
// =============================================================================

function formatLastUpdated(date: Date): string {
  if (Number.isNaN(date.getTime())) {
    return 'Update time unavailable';
  }

  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}


// =============================================================================
// Component
// =============================================================================

export default function OverviewHeader({
  title = 'Platform overview',
  description = 'Monitor platform activity, review pending operations, and manage sisiMove.',
  administratorName,
  liveUpdatesEnabled = true,
  isRefreshing = false,
  lastUpdatedAt,
  onRefresh,
  className,
}: OverviewHeaderProps) {
  const greeting = administratorName?.trim()
    ? `Welcome back, ${administratorName.trim()}`
    : 'Administration workspace';

  return (
    <header
      className={[
        'flex',
        'flex-col',
        'gap-5',
        'border-b',
        'border-[var(--border)]',
        'pb-6',
        'sm:flex-row',
        'sm:items-start',
        'sm:justify-between',
        className ?? '',
      ].join(' ')}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Page Identity                                                       */}
      {/* ------------------------------------------------------------------- */}

      <div className="min-w-0 flex-1">
        <p className="mb-2 text-sm font-medium text-[var(--brand)]">
          {greeting}
        </p>

        <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
          {title}
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--foreground-muted)] sm:text-base">
          {description}
        </p>

        {/* --------------------------------------------------------------- */}
        {/* Data Refresh Status                                             */}
        {/* --------------------------------------------------------------- */}

        <div
          className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[var(--foreground-muted)] sm:text-sm"
          aria-live="polite"
        >
          <span className="inline-flex items-center gap-2">
            <span
              aria-hidden="true"
              className={[
                'h-2',
                'w-2',
                'rounded-full',
                liveUpdatesEnabled
                  ? 'bg-[var(--success)]'
                  : 'bg-[var(--foreground-subtle)]',
              ].join(' ')}
            />

            {liveUpdatesEnabled
              ? 'Automatic updates enabled'
              : 'Automatic updates paused'}
          </span>

          {lastUpdatedAt && (
            <span>
              Last updated: {formatLastUpdated(lastUpdatedAt)}
            </span>
          )}

          {isRefreshing && (
            <span className="inline-flex items-center gap-2">
              <Spinner size="xs" label="Refreshing overview" />
              Refreshing metrics
            </span>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Refresh Action                                                     */}
      {/* ------------------------------------------------------------------- */}

      {onRefresh && (
        <div className="flex shrink-0 items-center">
          <Button
            type="button"
            variant="outline"
            size="md"
            disabled={isRefreshing}
            onClick={onRefresh}
          >
            {isRefreshing ? (
              <>
                <Spinner
                  size="xs"
                  label="Refreshing"
                  className="border-current border-t-transparent"
                />
                <span>Refreshing...</span>
              </>
            ) : (
              'Refresh overview'
            )}
          </Button>
        </div>
      )}
    </header>
  );
}
