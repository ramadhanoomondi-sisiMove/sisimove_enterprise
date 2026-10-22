
/**
 * -----------------------------------------------------------------------------
 * sisiMove — Asset Health Panel
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Display health indicators supplied by the parent.
 * - Highlight asset records requiring operational attention.
 * - Reuse shared Card, Badge, and Skeleton components.
 * - Support loading and empty states.
 *
 * Important:
 * - This component does not perform health checks.
 * - The parent must derive these indicators from verified backend data.
 * -----------------------------------------------------------------------------
 */

import { Activity, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

import { cn } from '@/foundation/utils/cn';

// =============================================================================
// Types
// =============================================================================

export type AssetHealthSeverity = 'critical' | 'warning' | 'info';

export interface AssetHealthIssue {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly count?: number;
  readonly severity: AssetHealthSeverity;
}

export interface AssetHealthPanelProps {
  readonly issues: readonly AssetHealthIssue[];
  readonly loading?: boolean;
  readonly className?: string;
}

// =============================================================================
// Configuration
// =============================================================================

const SEVERITY_CONFIG = {
  critical: {
    label: 'Critical',
    badgeVariant: 'danger',
    icon: AlertTriangle,
    iconClass:
      'bg-[var(--danger-soft)] text-[var(--danger)]',
  },
  warning: {
    label: 'Warning',
    badgeVariant: 'warning',
    icon: AlertTriangle,
    iconClass:
      'bg-[var(--warning-soft)] text-[var(--warning)]',
  },
  info: {
    label: 'Info',
    badgeVariant: 'default',
    icon: Info,
    iconClass:
      'bg-[var(--background-muted)] text-[var(--foreground-secondary)]',
  },
} as const;

// =============================================================================
// Component
// =============================================================================

export function AssetHealthPanel({
  issues,
  loading = false,
  className,
}: AssetHealthPanelProps) {
  const criticalCount = issues.filter(
    (issue) => issue.severity === 'critical',
  ).length;

  const warningCount = issues.filter(
    (issue) => issue.severity === 'warning',
  ).length;

  const infoCount = issues.filter(
    (issue) => issue.severity === 'info',
  ).length;

  const hasIssues = issues.length > 0;

  return (
    <Card
      className={cn(
        'min-w-0 border border-[var(--border)]',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-[var(--foreground)]">
            Asset health
          </h2>

          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Operational indicators reported by the system
          </p>
        </div>

        <div className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--background-muted)] text-[var(--foreground-secondary)]">
          <Activity size={20} aria-hidden="true" />
        </div>
      </div>

      {loading ? (
        <div
          role="status"
          aria-label="Loading asset health"
          aria-busy="true"
          className="mt-5 space-y-4"
        >
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="flex items-start gap-3">
              <Skeleton className="size-9 shrink-0" radius="lg" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="mt-5 grid grid-cols-3 gap-2">
            <div className="rounded-[var(--radius-lg)] bg-[var(--danger-soft)] p-3">
              <p className="text-xs text-[var(--danger)]">Critical</p>
              <p className="mt-1 text-xl font-semibold tabular-nums text-[var(--danger)]">
                {criticalCount}
              </p>
            </div>

            <div className="rounded-[var(--radius-lg)] bg-[var(--warning-soft)] p-3">
              <p className="text-xs text-[var(--warning)]">Warnings</p>
              <p className="mt-1 text-xl font-semibold tabular-nums text-[var(--warning)]">
                {warningCount}
              </p>
            </div>

            <div className="rounded-[var(--radius-lg)] bg-[var(--background-muted)] p-3">
              <p className="text-xs text-[var(--foreground-secondary)]">Info</p>
              <p className="mt-1 text-xl font-semibold tabular-nums text-[var(--foreground-secondary)]">
                {infoCount}
              </p>
            </div>
          </div>

          {hasIssues ? (
            <div className="mt-5 space-y-3">
              {issues.map((issue) => {
                const config = SEVERITY_CONFIG[issue.severity];
                const Icon = config.icon;

                return (
                  <div
                    key={issue.id}
                    className="flex items-start gap-3 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] p-3"
                  >
                    <div
                      className={cn(
                        'flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-md)]',
                        config.iconClass,
                      )}
                    >
                      <Icon size={17} aria-hidden="true" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-medium text-[var(--foreground)]">
                          {issue.title}
                        </h3>

                        <Badge
                          variant={config.badgeVariant}
                          size="sm"
                        >
                          {config.label}
                        </Badge>
                      </div>

                      <p className="mt-1 text-sm leading-5 text-[var(--foreground-muted)]">
                        {issue.description}
                      </p>
                    </div>

                    {issue.count !== undefined && (
                      <span className="shrink-0 text-sm font-semibold tabular-nums text-[var(--foreground)]">
                        {issue.count.toLocaleString()}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-5 flex items-start gap-3 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--background-subtle)] p-4">
              <CheckCircle2
                size={20}
                className="mt-0.5 shrink-0 text-[var(--success)]"
                aria-hidden="true"
              />

              <div>
                <p className="text-sm font-medium text-[var(--foreground)]">
                  No reported issues
                </p>
                <p className="mt-1 text-sm text-[var(--foreground-muted)]">
                  No health issues were supplied for this view.
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  );
}

export default AssetHealthPanel;
