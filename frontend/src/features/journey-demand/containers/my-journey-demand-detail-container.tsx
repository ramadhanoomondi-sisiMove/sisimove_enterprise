// -----------------------------------------------------------------------------
// sisiMove — My Journey Demand Detail Container
// -----------------------------------------------------------------------------
//
// Authenticated owner-facing Journey Demand detail container.
//
// Responsibilities:
// - load the authenticated owner's MyJourneyDemand;
// - derive presentation-level action availability;
// - construct command request metadata;
// - compose owner management actions;
// - refetch the owner projection after successful mutations;
// - establish the page-level presentation width.
//
// Architecture:
// - Does not own mutation hooks.
// - Does not execute mutation APIs.
// - Does not own mutation loading/error state.
// - Does not perform authorization.
// - Does not reconstruct lifecycle rules.
// - Does not convert MyJourneyDemand into another read model.
//
// Individual lifecycle action components own their mutation hooks and local
// mutation state.
//
// The backend remains authoritative for:
// - ownership;
// - authorization;
// - lifecycle validation;
// - command validation;
// - domain rules;
// - aggregate state transitions.
//
// -----------------------------------------------------------------------------

'use client';

import { useCallback } from 'react';

import {
  JourneyDemandManagementPanel,
  JourneyDemandOwnerDetail,
  MyJourneyDemandError,
  MyJourneyDemandLoading,
} from '@/components/journey-demand/manage';

import type { CancelJourneyDemandRequest } from '../api/journey-demands/cancel-journey-demand.api';
import type { ConvertJourneyDemandRequest } from '../api/journey-demands/convert-journey-demand.api';
import type { FulfillJourneyDemandRequest } from '../api/journey-demands/fulfill-journey-demand.api';
import type { MatchJourneyDemandRequest } from '../api/journey-demands/match-journey-demand.api';
import type { PublishJourneyDemandRequest } from '../api/journey-demands/publish-journey-demand.api';
import { useMyJourneyDemand } from '../hooks/queries/use-my-journey-demand';

// =============================================================================
// Props
// =============================================================================

export interface MyJourneyDemandDetailContainerProps {
  readonly publicId: string;

  /**
   * Candidate Journey used when issuing the initial match command.
   *
   * This is supplied by the owning page/container because matching requires
   * an explicit Journey candidate.
   */
  readonly matchJourneyPublicId?: string;

  /**
   * Optional correlation identifier shared by the commands rendered by this
   * container.
   *
   * When omitted, a new identifier is generated for each command.
   */
  readonly correlationId?: string;

  readonly className?: string;
}

// =============================================================================
// Correlation
// =============================================================================

function createCorrelationId(): string {
  return crypto.randomUUID();
}

// =============================================================================
// Container
// =============================================================================

export function MyJourneyDemandDetailContainer({
  publicId,
  matchJourneyPublicId,
  correlationId,
  className,
}: MyJourneyDemandDetailContainerProps) {
  // ===========================================================================
  // Query
  // ===========================================================================

  const {
    demand,
    isLoading,
    error,
    refetch,
  } = useMyJourneyDemand(publicId);

  // ===========================================================================
  // Command correlation
  // ===========================================================================
  //
  // Request objects are prepared here and passed to the individual lifecycle
  // actions.
  //
  // The action owns mutation execution; the container owns the command context
  // supplied to it.
  //
  // ===========================================================================

  const getCorrelationId = useCallback((): string => {
    return correlationId ?? createCorrelationId();
  }, [correlationId]);

  // ===========================================================================
  // Matched Journey
  // ===========================================================================

  const matchedJourneyPublicId = demand?.matchedJourneyPublicId;

  // ===========================================================================
  // Command requests
  // ===========================================================================
  //
  // Requests are only created when the command has the input it requires.
  //
  // In particular, no empty-string Journey public IDs are fabricated for
  // match or convert commands.
  //
  // ===========================================================================

  const publishRequest: PublishJourneyDemandRequest = {
    correlationId: getCorrelationId(),
  };

  const cancelRequest: CancelJourneyDemandRequest = {
    correlationId: getCorrelationId(),
  };

  const matchRequest: MatchJourneyDemandRequest | undefined =
    matchJourneyPublicId
      ? {
          journeyPublicId: matchJourneyPublicId,
          correlationId: getCorrelationId(),
        }
      : undefined;

  const convertRequest: ConvertJourneyDemandRequest | undefined =
    matchedJourneyPublicId
      ? {
          journeyPublicId: matchedJourneyPublicId,
          correlationId: getCorrelationId(),
        }
      : undefined;

  const fulfillRequest: FulfillJourneyDemandRequest = {
    correlationId: getCorrelationId(),
  };

  // ===========================================================================
  // Successful mutation refresh
  // ===========================================================================
  //
  // The individual action performs the mutation.
  //
  // After the action succeeds, the container refreshes the authoritative
  // MyJourneyDemand projection.
  //
  // ===========================================================================

  const handleMutationSuccess = useCallback(async (): Promise<void> => {
    await refetch();
  }, [refetch]);

  // ===========================================================================
  // Lifecycle presentation capabilities
  // ===========================================================================
  //
  // These booleans control presentation availability only.
  //
  // They are not authorization checks and do not replace backend lifecycle
  // validation.
  //
  // ===========================================================================

  const canPublish = Boolean(
    demand &&
      demand.isDraft &&
      demand.hasCorridor &&
      demand.hasSchedule &&
      demand.hasCapacity &&
      demand.hasPricing,
  );

  const canMatch = Boolean(
    demand &&
      demand.isOpen &&
      !demand.hasMatchedJourney &&
      matchJourneyPublicId,
  );

  const canConvert = Boolean(
    demand &&
      demand.isMatched &&
      demand.hasMatchedJourney &&
      matchedJourneyPublicId,
  );

  const canFulfill = Boolean(
    demand &&
      demand.isConverted &&
      !demand.isFulfilled &&
      !demand.isCancelled &&
      !demand.isExpired,
  );

  const canCancel = Boolean(
    demand &&
      demand.isActive &&
      !demand.isCancelled &&
      !demand.isExpired &&
      !demand.isFulfilled,
  );

  // ===========================================================================
  // Loading
  // ===========================================================================

  if (isLoading && !demand) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <MyJourneyDemandLoading className={className} />
      </div>
    );
  }

  // ===========================================================================
  // Error
  // ===========================================================================

  if (error && !demand) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <MyJourneyDemandError
          error={error}
          onRetry={refetch}
          className={className}
        />
      </div>
    );
  }

  // ===========================================================================
  // Defensive empty state
  // ===========================================================================

  if (!demand) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <MyJourneyDemandError
          error={new Error('Journey Demand could not be loaded.')}
          onRetry={refetch}
          className={className}
        />
      </div>
    );
  }

  // ===========================================================================
  // Management UI
  // ===========================================================================
  //
  // The container supplies:
  //
  // - capability booleans;
  // - command request objects;
  // - successful-mutation refresh callbacks.
  //
  // Individual action components own:
  //
  // - mutation hooks;
  // - loading state;
  // - mutation errors;
  // - command execution.
  //
  // ===========================================================================
const management = (
  <JourneyDemandManagementPanel
    journeyDemandPublicId={demand.publicId}
    canPublish={canPublish}
    canCancel={canCancel}
    canMatch={canMatch}
    canConvert={canConvert}
    canFulfill={canFulfill}
    publishRequest={publishRequest}
    cancelRequest={cancelRequest}
    matchRequest={matchRequest}
    convertRequest={convertRequest}
    fulfillRequest={fulfillRequest}
    onPublishSuccess={handleMutationSuccess}
    onCancelSuccess={handleMutationSuccess}
    onMatchSuccess={handleMutationSuccess}
    onConvertSuccess={handleMutationSuccess}
    onFulfillSuccess={handleMutationSuccess}
  />
);

  // ===========================================================================
  // Authenticated owner detail
  // ===========================================================================
  //
  // JourneyDemandOwnerDetail is the explicit owner-facing composition
  // boundary.
  //
  // It receives:
  //
  //     MyJourneyDemand
  //          +
  //     owner management UI
  //
  // and delegates detail presentation to MyJourneyDemandDetail.
  //
  // ===========================================================================

  return (
    <div className="mx-auto w-full max-w-4xl">
      <JourneyDemandOwnerDetail
        demand={demand}
        actions={management}
        className={className}
      />
    </div>
  );
}
