
// -----------------------------------------------------------------------------
// sisiMove Admin — Booking Commission Details Layout
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Fetch one booking commission using its public ID.
// - Handle missing identifiers, loading and error states.
// - Compose the booking commission detail panels.
// - Coordinate assessment and cancellation operations.
// - Display operation errors.
// - Receive lifecycle action availability from the parent.
//
// Architecture:
// - Query hooks own server data and caching.
// - Operations hooks own mutations.
// - Detail panels receive the fetched commission.
// - Lifecycle eligibility remains outside this component.
// - No commission calculations are performed here.
// -----------------------------------------------------------------------------

'use client';

import {
  Card,
  ErrorState,
  Skeleton,
} from '@/components/ui';

import { CommissionDetailHeader } from '../layout/CommissionDetailHeader';
import { CommissionStatusBadge } from '../shared/CommissionStatusBadge';

import { BookingCommissionIdentityPanel } from './BookingCommissionIdentityPanel';
import { BookingCommissionBookingPanel } from './BookingCommissionBookingPanel';
import { BookingCommissionJourneyPanel } from './BookingCommissionJourneyPanel';
import { BookingCommissionRulePanel } from './BookingCommissionRulePanel';
import { BookingCommissionAssessmentPanel } from './BookingCommissionAssessmentPanel';
import { BookingCommissionLifecyclePanel } from './BookingCommissionLifecyclePanel';
import { BookingCommissionAuditInformation } from './BookingCommissionAuditInformation';

import {
  BookingCommissionOperationsPanel,
} from '../operations/booking/BookingCommissionOperationsPanel';

import type {
  BookingCommissionAction,
} from '../operations/booking/BookingCommissionActionsMenu';

import type {
  AdminAssessBookingCommissionModel,
  AdminCancelBookingCommissionModel,
} from '@/features/admin/commissions/models';

import {
  useAdminBookingCommission,
  useAdminBookingCommissionOperations,
} from '@/features/admin/commissions/hooks';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface BookingCommissionDetailsLayoutProps {
  readonly commissionPublicId?: string;
  readonly className?: string;

  /**
   * Lifecycle actions supplied by the parent.
   * An empty array hides the operations menu.
   */
  readonly availableActions?: readonly BookingCommissionAction[];
}

// -----------------------------------------------------------------------------
// Loading State
// -----------------------------------------------------------------------------

function BookingCommissionDetailsLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-4 w-full max-w-2xl" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} padding="md">
            <div className="space-y-4">
              <Skeleton className="h-5 w-40" />
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
// Missing Identifier State
// -----------------------------------------------------------------------------

function BookingCommissionMissingIdentifier() {
  return (
    <ErrorState
      title="Booking commission not specified"
      description="A booking commission public ID is required to display its details."
      className="min-h-[300px]"
    />
  );
}

// -----------------------------------------------------------------------------
// Query Error State
// -----------------------------------------------------------------------------

interface BookingCommissionDetailsErrorProps {
  readonly error: Error | null;
  readonly onRetry: () => void;
}

function BookingCommissionDetailsError({
  error,
  onRetry,
}: BookingCommissionDetailsErrorProps) {
  return (
    <ErrorState
      title="Unable to load booking commission"
      description={
        error?.message ??
        'Something went wrong while loading this booking commission. Please try again.'
      }
      retryAction={{
        label: 'Try again',
        onClick: onRetry,
      }}
      className="min-h-[300px]"
    />
  );
}

// -----------------------------------------------------------------------------
// Operation Error
// -----------------------------------------------------------------------------

interface BookingCommissionOperationErrorProps {
  readonly error: Error | null;
}

function BookingCommissionOperationError({
  error,
}: BookingCommissionOperationErrorProps) {
  if (!error) {
    return null;
  }

  return (
    <div
      role="alert"
      className="rounded-md border border-[var(--danger)] bg-[var(--danger-soft)] px-4 py-3 text-sm text-[var(--danger)]"
    >
      <p className="font-medium">
        Commission operation failed
      </p>

      <p className="mt-1">
        {error.message ||
          'The requested operation could not be completed. Please try again.'}
      </p>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function BookingCommissionDetailsLayout({
  commissionPublicId,
  className,
  availableActions = [],
}: BookingCommissionDetailsLayoutProps) {
  const normalizedPublicId = commissionPublicId?.trim() ?? '';

  // ---------------------------------------------------------------------------
  // Detail Query
  // ---------------------------------------------------------------------------

  const {
    commission,
    isLoading,
    isError,
    error,
    refetch,
  } = useAdminBookingCommission(normalizedPublicId);

  // ---------------------------------------------------------------------------
  // Operations
  // ---------------------------------------------------------------------------

  const {
    assessBookingCommissionAsync,
    isAssessingBookingCommission,
    assessBookingCommissionError,

    cancelBookingCommissionAsync,
    isCancellingBookingCommission,
    cancelBookingCommissionError,
  } = useAdminBookingCommissionOperations();

  // ---------------------------------------------------------------------------
  // Assessment
  // ---------------------------------------------------------------------------

  async function handleAssess(
    payload: AdminAssessBookingCommissionModel,
  ): Promise<void> {
    await assessBookingCommissionAsync({
      publicId: normalizedPublicId,
      payload,
    });
  }

  // ---------------------------------------------------------------------------
  // Cancellation
  // ---------------------------------------------------------------------------

  async function handleCancel(
    payload: AdminCancelBookingCommissionModel,
  ): Promise<void> {
    await cancelBookingCommissionAsync({
      publicId: normalizedPublicId,
      payload,
    });
  }

  // ---------------------------------------------------------------------------
  // Operation Error
  // ---------------------------------------------------------------------------

  const operationError =
    assessBookingCommissionError instanceof Error
      ? assessBookingCommissionError
      : cancelBookingCommissionError instanceof Error
        ? cancelBookingCommissionError
        : null;

  const isOperating =
    isAssessingBookingCommission ||
    isCancellingBookingCommission;

  // ---------------------------------------------------------------------------
  // Missing Public ID
  // ---------------------------------------------------------------------------

  if (!normalizedPublicId) {
    return <BookingCommissionMissingIdentifier />;
  }

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return <BookingCommissionDetailsLoading />;
  }

  // ---------------------------------------------------------------------------
  // Query Error
  // ---------------------------------------------------------------------------

  if (isError || !commission) {
    return (
      <BookingCommissionDetailsError
        error={error instanceof Error ? error : null}
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  // ---------------------------------------------------------------------------
  // Details
  // ---------------------------------------------------------------------------

  return (
    <div className={['space-y-6', className].filter(Boolean).join(' ')}>
      <CommissionDetailHeader
        eyebrow="COMMISSION DETAILS"
        title="Booking Commission"
        description="Review the booking commission identity, associated booking and journey, applicable rule, assessment and lifecycle information."
        metadata={
          <div className="flex flex-wrap items-center gap-3">
            <CommissionStatusBadge status={commission.status} />

            <span className="text-sm text-muted-foreground">
              {commission.publicId}
            </span>
          </div>
        }
        actions={
          availableActions.length > 0 ? (
            <BookingCommissionOperationsPanel
              commissionPublicId={commission.publicId}
              availableActions={availableActions}
              isAssessing={isAssessingBookingCommission}
              isCancelling={isCancellingBookingCommission}
              onAssess={handleAssess}
              onCancel={handleCancel}
            />
          ) : undefined
        }
      />

      {/* Operation Feedback */}

      {availableActions.length > 0 && (
        <BookingCommissionOperationError error={operationError} />
      )}

      {/* Commission Details */}

      <div className="grid gap-6 xl:grid-cols-2">
        <BookingCommissionIdentityPanel
          commission={commission}
        />

        <BookingCommissionAssessmentPanel
          commission={commission}
        />

        <BookingCommissionBookingPanel
          commission={commission}
        />

        <BookingCommissionJourneyPanel
          commission={commission}
        />

        <BookingCommissionRulePanel
          commission={commission}
        />

        <BookingCommissionLifecyclePanel
          commission={commission}
        />
      </div>

      {/* Audit Information */}

      <BookingCommissionAuditInformation
        commission={commission}
      />
    </div>
  );
}

export default BookingCommissionDetailsLayout;
