
// -----------------------------------------------------------------------------
// sisiMove Admin — Commission Rule Details Layout
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Fetch a commission rule by public ID.
// - Handle missing IDs, loading states, and query errors.
// - Compose the commission rule detail panels.
// - Coordinate commission rule operations.
// - Display operation dialogs and mutation feedback.
//
// Architecture:
// - The detail hook owns server data and query state.
// - The operations hook owns mutations and cache invalidation.
// - Individual panels receive the commission rule model.
// - The parent controls which actions are available.
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
  useAdminCommissionRule,
  useAdminCommissionRuleOperations,
} from '@/features/admin/finance/commissions/hooks';

import { CommissionDetailHeader } from '../layout/CommissionDetailHeader';
import { CommissionTypeBadge } from '../shared/CommissionTypeBadge';

import { CommissionRuleInformationPanel } from './CommissionRuleInformationPanel';
import { CommissionRuleEffectivePeriodPanel } from './CommissionRuleEffectivePeriodPanel';
import { CommissionRuleVersionPanel } from './CommissionRuleVersionPanel';
import { CommissionRuleLifecyclePanel } from './CommissionRuleLifecyclePanel';
import { CommissionRuleAuditInformation } from './CommissionRuleAuditInformation';

import {
  CommissionRuleActionsMenu,
  CommissionRuleOperationConfirmation,
  CommissionRuleUpdateDialog,
} from '../operations/rules';

import type {
  CommissionRuleAction,
} from '../operations/rules';

import type {
  AdminUpdateCommissionRuleModel,
} from '@/features/admin/finance/commissions/models';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface CommissionRuleDetailsLayoutProps {
  readonly rulePublicId?: string;
  readonly availableActions?: readonly CommissionRuleAction[];
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Loading State
// -----------------------------------------------------------------------------

function CommissionRuleDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {Array.from({ length: 5 }).map((_, index) => (
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

export function CommissionRuleDetailsLayout({
  rulePublicId,
  availableActions = [],
  className,
}: CommissionRuleDetailsLayoutProps) {
  const publicId = rulePublicId?.trim() ?? '';

  // ---------------------------------------------------------------------------
  // Query
  // ---------------------------------------------------------------------------

  const {
    rule,
    isLoading,
    isError,
    error,
    refetch,
  } = useAdminCommissionRule(publicId || undefined);

  // ---------------------------------------------------------------------------
  // Operations
  // ---------------------------------------------------------------------------

  const {
    updateCommissionRuleAsync,
    activateCommissionRuleAsync,
    deactivateCommissionRuleAsync,
    isUpdatingCommissionRule,
    isActivatingCommissionRule,
    isDeactivatingCommissionRule,
  } = useAdminCommissionRuleOperations();

  const [selectedAction, setSelectedAction] =
    useState<CommissionRuleAction | null>(null);

  const [operationError, setOperationError] =
    useState<string | null>(null);

  const isOperating =
    isUpdatingCommissionRule ||
    isActivatingCommissionRule ||
    isDeactivatingCommissionRule;

  // ---------------------------------------------------------------------------
  // Operation Dialog Management
  // ---------------------------------------------------------------------------

  function openAction(action: CommissionRuleAction) {
    setOperationError(null);
    setSelectedAction(action);
  }

  function closeAction() {
    if (isOperating) return;

    setOperationError(null);
    setSelectedAction(null);
  }

  // ---------------------------------------------------------------------------
  // Update Rule
  // ---------------------------------------------------------------------------

  async function handleUpdateRule(
    payload: AdminUpdateCommissionRuleModel,
  ) {
    if (!rule) return;

    setOperationError(null);

    try {
      await updateCommissionRuleAsync({
        publicId: rule.publicId,
        payload,
      });

      setSelectedAction(null);
    } catch {
      setOperationError(
        'The commission rule could not be updated. Please try again.',
      );

      throw new Error('Commission rule update failed.');
    }
  }

  // ---------------------------------------------------------------------------
  // Activate Rule
  // ---------------------------------------------------------------------------

  async function handleActivateRule() {
    if (!rule) return;

    setOperationError(null);

    try {
      await activateCommissionRuleAsync({
        publicId: rule.publicId,
        payload: {
          activatedAt: new Date().toISOString(),
        },
      });

      setSelectedAction(null);
    } catch {
      setOperationError(
        'The commission rule could not be activated. Please try again.',
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Deactivate Rule
  // ---------------------------------------------------------------------------

  async function handleDeactivateRule() {
    if (!rule) return;

    setOperationError(null);

    try {
      await deactivateCommissionRuleAsync({
        publicId: rule.publicId,
        payload: {
          deactivatedAt: new Date().toISOString(),
        },
      });

      setSelectedAction(null);
    } catch {
      setOperationError(
        'The commission rule could not be deactivated. Please try again.',
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
          title="Commission rule not specified"
          description="A rule public ID is required to view this record."
        />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return (
      <div className={className}>
        <CommissionRuleDetailsSkeleton />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Query Error
  // ---------------------------------------------------------------------------

  if (isError || !rule) {
    return (
      <div className={className}>
        <ErrorState
          title="Unable to load commission rule"
          description={
            error instanceof Error
              ? error.message
              : 'The commission rule could not be loaded. Please try again.'
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
  // Details
  // ---------------------------------------------------------------------------

  return (
    <div className={['space-y-6', className].filter(Boolean).join(' ')}>
      <CommissionDetailHeader
        eyebrow="COMMISSION RULES"
        title="Commission rule details"
        description="Review the commission definition, effective period, version history, lifecycle status, and audit information."
        metadata={
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {rule.publicId}
            </span>

            <CommissionTypeBadge type={rule.type} />

            <span className="inline-flex rounded-full border border-[var(--border)] px-2.5 py-1 text-xs font-medium text-[var(--foreground)]">
              {rule.status}
            </span>
          </div>
        }
        actions={
          availableActions.length > 0 ? (
            <CommissionRuleActionsMenu
              availableActions={availableActions}
              onAction={openAction}
              disabled={isOperating}
            />
          ) : undefined
        }
      />

      {/* Operation Feedback */}

      {operationError && (
        <div
          role="alert"
          className="rounded-md border border-[var(--danger)] bg-[var(--danger-soft)] px-4 py-3 text-sm text-[var(--danger)]"
        >
          {operationError}
        </div>
      )}

      {/* Rule Information */}

      <div className="grid gap-6 xl:grid-cols-2">
        <CommissionRuleInformationPanel rule={rule} />

        <CommissionRuleEffectivePeriodPanel rule={rule} />

        <CommissionRuleVersionPanel rule={rule} />

        <CommissionRuleLifecyclePanel rule={rule} />
      </div>

      <CommissionRuleAuditInformation rule={rule} />

      {/* Update Rule Dialog */}

      <CommissionRuleUpdateDialog
        open={selectedAction === 'update'}
        rule={rule}
        loading={isUpdatingCommissionRule}
        onClose={closeAction}
        onSubmit={handleUpdateRule}
      />

      {/* Activate / Deactivate Confirmation */}

      <CommissionRuleOperationConfirmation
        open={
          selectedAction === 'activate' ||
          selectedAction === 'deactivate'
        }
        action={
          selectedAction === 'deactivate'
            ? 'deactivate'
            : 'activate'
        }
        rule={rule}
        loading={
          isActivatingCommissionRule ||
          isDeactivatingCommissionRule
        }
        error={operationError}
        onClose={closeAction}
        onConfirm={
          selectedAction === 'deactivate'
            ? handleDeactivateRule
            : handleActivateRule
        }
      />
    </div>
  );
}
