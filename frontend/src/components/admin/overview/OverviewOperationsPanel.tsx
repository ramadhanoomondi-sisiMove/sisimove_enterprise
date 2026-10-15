
/**
 * -----------------------------------------------------------------------------
 * sisiMove — Overview Operations Panel
 * -----------------------------------------------------------------------------
 *
 * Operational attention panel for the Admin Overview dashboard.
 *
 * Responsibilities:
 *
 * - highlight pending verifications;
 * - highlight pending journey completions;
 * - highlight pending journey settlements;
 * - help administrators navigate to the relevant workflow;
 * - communicate when no pending work is reported by these metrics.
 *
 * Architectural boundaries:
 *
 * - This component does not fetch data.
 * - It does not define application routes.
 * - It consumes the AdminOverviewModel supplied by its parent.
 * - The parent supplies navigation callbacks.
 *
 * -----------------------------------------------------------------------------
 */

import { Badge, Button, Card, EmptyState } from '@/components/ui';

import type { AdminOverviewModel } from '@/features/admin/overview/models/admin-overview.model';

import OverviewSectionHeader from './OverviewSectionHeader';


// =============================================================================
// Types
// =============================================================================

export type OverviewOperationId =
  | 'pendingVerifications'
  | 'pendingJourneyCompletions'
  | 'pendingJourneySettlements';

export interface OverviewOperationsPanelProps {
  /**
   * Loaded metrics from the Admin Overview API.
   */
  metrics: AdminOverviewModel;

  /**
   * Optional callback for opening an operational workflow.
   * The parent owns route resolution.
   */
  onOpenOperation?: (operationId: OverviewOperationId) => void;

  /**
   * Optional additional CSS classes.
   */
  className?: string;
}


// =============================================================================
// Operation Definitions
// =============================================================================

interface OperationDefinition {
  id: OverviewOperationId;
  title: string;
  description: string;
  count: number;
  actionLabel: string;
}

function createOperationDefinitions(
  metrics: AdminOverviewModel,
): OperationDefinition[] {
  return [
    {
      id: 'pendingVerifications',
      title: 'Pending verifications',
      description: 'Verification records awaiting review.',
      count: metrics.pendingVerifications,
      actionLabel: 'Review verifications',
    },
    {
      id: 'pendingJourneyCompletions',
      title: 'Pending journey completions',
      description: 'Journey completion records awaiting processing.',
      count: metrics.pendingJourneyCompletions,
      actionLabel: 'Review completions',
    },
    {
      id: 'pendingJourneySettlements',
      title: 'Pending journey settlements',
      description: 'Journey settlement records awaiting processing.',
      count: metrics.pendingJourneySettlements,
      actionLabel: 'Review settlements',
    },
  ];
}


// =============================================================================
// Operation Item
// =============================================================================

function OperationItem({
  operation,
  onOpen,
}: {
  operation: OperationDefinition;
  onOpen?: () => void;
}) {
  const hasPendingWork = operation.count > 0;

  return (
    <div className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <span
          aria-hidden="true"
          className={[
            'mt-0.5',
            'flex',
            'h-9',
            'w-9',
            'shrink-0',
            'items-center',
            'justify-center',
            'rounded-[var(--radius-lg)]',
            hasPendingWork
              ? 'bg-[var(--warning-soft)] text-[var(--warning)]'
              : 'bg-[var(--success-soft)] text-[var(--success)]',
          ].join(' ')}
        >
          <span className="text-sm font-semibold">
            {hasPendingWork ? '!' : '✓'}
          </span>
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-[var(--foreground)]">
            {operation.title}
          </h3>

          <p className="mt-1 text-xs leading-5 text-[var(--foreground-muted)]">
            {operation.description}
          </p>
        </div>

        <Badge
          variant={hasPendingWork ? 'warning' : 'success'}
          size="md"
        >
          {operation.count.toLocaleString()}
        </Badge>
      </div>

      {onOpen && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onOpen}
          className="self-start sm:self-center"
        >
          {operation.actionLabel}
        </Button>
      )}
    </div>
  );
}


// =============================================================================
// Overview Operations Panel
// =============================================================================

export default function OverviewOperationsPanel({
  metrics,
  onOpenOperation,
  className,
}: OverviewOperationsPanelProps) {
  const operations = createOperationDefinitions(metrics);

  const totalPending = operations.reduce(
    (total, operation) => total + operation.count,
    0,
  );

  return (
    <Card
      variant="default"
      padding="lg"
      className={className}
    >
      <OverviewSectionHeader
        title="Operational attention"
        description="Outstanding items that may need administrator action."
        headingLevel={3}
        badge={
          <Badge
            variant={totalPending > 0 ? 'warning' : 'success'}
          >
            {totalPending.toLocaleString()} pending
          </Badge>
        }
      />

      <div className="mt-5">
        {totalPending === 0 ? (
          <EmptyState
            title="You're all caught up"
            description="These operational metrics report no pending verifications, journey completions, or journey settlements."
          />
        ) : (
          <div className="divide-y divide-[var(--border-subtle)]">
            {operations.map((operation) => (
              <OperationItem
                key={operation.id}
                operation={operation}
                onOpen={
                  onOpenOperation
                    ? () => onOpenOperation(operation.id)
                    : undefined
                }
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
