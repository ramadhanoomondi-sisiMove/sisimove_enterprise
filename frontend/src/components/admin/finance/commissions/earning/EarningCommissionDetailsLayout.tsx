
// -----------------------------------------------------------------------------
// sisiMove Admin — Earning Commission Details Layout
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Fetch an earning commission by public ID.
// - Handle missing IDs, loading states, and query errors.
// - Compose the earning commission detail panels.
// - Coordinate assessment and cancellation operations.
// - Display operation feedback and confirmation dialogs.
//
// Architecture:
// - The detail hook owns server data and query state.
// - The operations hook owns mutations and cache invalidation.
// - Individual panels receive the commission model.
// - Backend lifecycle rules remain authoritative.
// -----------------------------------------------------------------------------

'use client';

import { useState } from 'react';

import {
  Card,
  ErrorState,
  Skeleton,
} from '@/components/ui';

import {
  useAdminEarningCommission,
  useAdminEarningCommissionOperations,
} from '@/features/admin/finance/commissions/hooks';

import { CommissionDetailHeader } from '../layout/CommissionDetailHeader';
import { CommissionStatusBadge } from '../shared/CommissionStatusBadge';

import { EarningCommissionIdentityPanel } from './EarningCommissionIdentityPanel';
import { EarningCommissionProviderPanel } from './EarningCommissionProviderPanel';
import { EarningCommissionJourneyPanel } from './EarningCommissionJourneyPanel';
import { EarningCommissionSettlementPanel } from './EarningCommissionSettlementPanel';
import { EarningCommissionRulePanel } from './EarningCommissionRulePanel';
import { EarningCommissionAssessmentPanel } from './EarningCommissionAssessmentPanel';
import { EarningCommissionNetAmountPanel } from './EarningCommissionNetAmountPanel';
import { EarningCommissionLifecyclePanel } from './EarningCommissionLifecyclePanel';
import { EarningCommissionAuditInformation } from './EarningCommissionAuditInformation';

import {
  EarningCommissionActionsMenu,
  EarningCommissionOperationConfirmation,
  type EarningCommissionAction,
} from '../operations/earning';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface EarningCommissionDetailsLayoutProps {
  readonly commissionPublicId?: string;
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type ActiveDialog = EarningCommissionAction | null;

const AVAILABLE_ACTIONS: readonly EarningCommissionAction[] = [
  'assess',
  'cancel',
];

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

// -----------------------------------------------------------------------------
// Loading State
// -----------------------------------------------------------------------------

function EarningCommissionDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} padding="md">
            <div className="space-y-4">
              <Skeleton className="h-5 w-44" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function EarningCommissionDetailsLayout({
  commissionPublicId,
  className,
}: EarningCommissionDetailsLayoutProps) {
  const publicId = commissionPublicId?.trim() ?? '';

  const [activeDialog, setActiveDialog] = useState<ActiveDialog>(null);
  const [operationError, setOperationError] = useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // Query
  // ---------------------------------------------------------------------------

  const {
    commission,
    isLoading,
    isError,
    error,
    refetch,
  } = useAdminEarningCommission(publicId || undefined);

  // ---------------------------------------------------------------------------
  // Operations
  // ---------------------------------------------------------------------------

  const {
    assessEarningCommissionAsync,
    cancelEarningCommissionAsync,
    isAssessingEarningCommission,
    isCancellingEarningCommission,
    assessEarningCommissionError,
    cancelEarningCommissionError,
  } = useAdminEarningCommissionOperations();

  const isOperating =
    isAssessingEarningCommission || isCancellingEarningCommission;

  const mutationError =
    operationError ??
    (assessEarningCommissionError
      ? getErrorMessage(
          assessEarningCommissionError,
          'Unable to assess the earning commission.',
        )
      : cancelEarningCommissionError
        ? getErrorMessage(
            cancelEarningCommissionError,
            'Unable to cancel the earning commission.',
          )
        : null);

  // ---------------------------------------------------------------------------
  // Dialog Handlers
  // ---------------------------------------------------------------------------

  function handleCloseDialog() {
    if (isOperating) {
      return;
    }

    setActiveDialog(null);
    setOperationError(null);
  }

  function handleAction(action: EarningCommissionAction) {
    setOperationError(null);
    setActiveDialog(action);
  }

  // ---------------------------------------------------------------------------
  // Operation Confirmation
  // ---------------------------------------------------------------------------

  async function handleConfirmOperation() {
    if (!publicId || !activeDialog || isOperating) {
      return;
    }

    setOperationError(null);

    try {
      if (activeDialog === 'assess') {
        await assessEarningCommissionAsync({
          publicId,
          payload: {
            assessedAt: new Date().toISOString(),
          },
        });
      } else {
        await cancelEarningCommissionAsync({
          publicId,
          payload: {
            cancelledAt: new Date().toISOString(),
          },
        });
      }

      setActiveDialog(null);
    } catch (caughtError) {
      const fallback =
        activeDialog === 'assess'
          ? 'Unable to assess the earning commission. Please try again.'
          : 'Unable to cancel the earning commission. Please try again.';

      setOperationError(
        getErrorMessage(caughtError, fallback),
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Missing Public ID
  // ---------------------------------------------------------------------------

  if (!publicId) {
    return (
      <div className={className}>
        <ErrorState
          title="Earning commission not specified"
          description="A commission public ID is required to view this record."
        />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Loading State
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return (
      <div className={className}>
        <EarningCommissionDetailsSkeleton />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Error State
  // ---------------------------------------------------------------------------

  if (isError || !commission) {
    return (
      <div className={className}>
        <ErrorState
          title="Unable to load earning commission"
          description={
            error instanceof Error
              ? error.message
              : 'The earning commission could not be loaded. Please try again.'
          }
          retryAction={{
            label: 'Retry',
            onClick: () => {
              void refetch();
            },
          }}
        />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className={['space-y-6', className].filter(Boolean).join(' ')}>
      <CommissionDetailHeader
        eyebrow="COMMISSION DETAILS"
        title="Earning commission"
        description="Review the provider earning commission, its financial assessment, related records, and lifecycle information."
        metadata={
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {commission.publicId}
            </span>

            <CommissionStatusBadge status={commission.status} />
          </div>
        }
        actions={
          <EarningCommissionActionsMenu
            availableActions={AVAILABLE_ACTIONS}
            onAction={handleAction}
            disabled={isOperating}
          />
        }
      />

      {/* Operation Feedback */}

      {mutationError && (
        <div
          role="alert"
          className="rounded-md border border-[var(--danger)] bg-[var(--danger-soft)] px-4 py-3 text-sm text-[var(--danger)]"
        >
          {mutationError}
        </div>
      )}

      {/* Commission Details */}

      <div className="grid gap-6 xl:grid-cols-2">
        <EarningCommissionIdentityPanel commission={commission} />

        <EarningCommissionAssessmentPanel commission={commission} />

        <EarningCommissionProviderPanel commission={commission} />

        <EarningCommissionJourneyPanel commission={commission} />

        <EarningCommissionSettlementPanel commission={commission} />

        <EarningCommissionRulePanel commission={commission} />

        <EarningCommissionNetAmountPanel commission={commission} />

        <EarningCommissionLifecyclePanel commission={commission} />
      </div>

      <EarningCommissionAuditInformation commission={commission} />

      {/* Unified Assessment and Cancellation Confirmation */}

      <EarningCommissionOperationConfirmation
        open={activeDialog !== null}
        action={activeDialog ?? 'assess'}
        loading={isOperating}
        commissionPublicId={commission.publicId}
        onClose={handleCloseDialog}
        onConfirm={() => {
          void handleConfirmOperation();
        }}
      />
    </div>
  );
}

export default EarningCommissionDetailsLayout;
