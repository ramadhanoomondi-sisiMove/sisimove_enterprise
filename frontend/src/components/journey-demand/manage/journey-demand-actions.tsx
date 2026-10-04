// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Actions
// -----------------------------------------------------------------------------
//
// Action composition for an authenticated Journey Demand.
//
// Architecture:
// - owns no API requests;
// - does not call mutation hooks;
// - does not own mutation state;
// - does not perform authorization checks;
// - does not derive lifecycle transitions;
// - does not decide whether a backend transition is allowed;
// - composes the individual mutation action components.
//
// Individual action components own:
// - their mutation hook;
// - their loading/error state;
// - their API invocation;
// - their mutation presentation.
//
// The parent/container remains responsible for:
// - authoritative capability decisions;
// - supplying the Journey Demand public ID;
// - supplying command request metadata;
// - refreshing the authoritative Journey Demand projection after success.
//
// A request is required only when its corresponding action is enabled.
// Disabled actions do not require fabricated command metadata.
//
// -----------------------------------------------------------------------------

'use client';

import { JourneyDemandCancelAction } from './journey-demand-cancel-action';
import { JourneyDemandConvertAction } from './journey-demand-convert-action';
import { JourneyDemandFulfillAction } from './journey-demand-fulfill-action';
import { JourneyDemandMatchAction } from './journey-demand-match-action';
import { JourneyDemandPublishAction } from './journey-demand-publish-action';

import type { CancelJourneyDemandRequest } from '@/features/journey-demand/api/journey-demands/cancel-journey-demand.api';
import type { ConvertJourneyDemandRequest } from '@/features/journey-demand/api/journey-demands/convert-journey-demand.api';
import type { FulfillJourneyDemandRequest } from '@/features/journey-demand/api/journey-demands/fulfill-journey-demand.api';
import type { MatchJourneyDemandRequest } from '@/features/journey-demand/api/journey-demands/match-journey-demand.api';
import type { PublishJourneyDemandRequest } from '@/features/journey-demand/api/journey-demands/publish-journey-demand.api';

// =============================================================================
// Props
// =============================================================================

export interface JourneyDemandActionsProps {
  /**
   * Public identifier of the Journey Demand being managed.
   */
  readonly journeyDemandPublicId: string;

  /**
   * Whether publishing is currently available to the parent/container.
   *
   * This component does not derive the capability.
   */
  readonly canPublish?: boolean;

  /**
   * Whether cancellation is currently available to the parent/container.
   */
  readonly canCancel?: boolean;

  /**
   * Whether matching is currently available to the parent/container.
   */
  readonly canMatch?: boolean;

  /**
   * Whether conversion is currently available to the parent/container.
   */
  readonly canConvert?: boolean;

  /**
   * Whether fulfilment is currently available to the parent/container.
   */
  readonly canFulfill?: boolean;

  /**
   * Backend command metadata for publishing.
   *
   * Required only when publishing is enabled.
   */
  readonly publishRequest?: PublishJourneyDemandRequest;

  /**
   * Backend command metadata for cancellation.
   *
   * Required only when cancellation is enabled.
   */
  readonly cancelRequest?: CancelJourneyDemandRequest;

  /**
   * Backend command metadata for matching.
   *
   * Required only when matching is enabled.
   */
  readonly matchRequest?: MatchJourneyDemandRequest;

  /**
   * Backend command metadata for conversion.
   *
   * Required only when conversion is enabled.
   */
  readonly convertRequest?: ConvertJourneyDemandRequest;

  /**
   * Backend command metadata for fulfilment.
   *
   * Required only when fulfilment is enabled.
   */
  readonly fulfillRequest?: FulfillJourneyDemandRequest;

  /**
   * Called after a successful publish mutation.
   */
  readonly onPublishSuccess?: () => void | Promise<void>;

  /**
   * Called after a successful cancel mutation.
   */
  readonly onCancelSuccess?: () => void | Promise<void>;

  /**
   * Called after a successful match mutation.
   */
  readonly onMatchSuccess?: () => void | Promise<void>;

  /**
   * Called after a successful convert mutation.
   */
  readonly onConvertSuccess?: () => void | Promise<void>;

  /**
   * Called after a successful fulfil mutation.
   */
  readonly onFulfillSuccess?: () => void | Promise<void>;

  /**
   * Disables all composed actions.
   *
   * This is a presentation-level constraint supplied by the parent.
   */
  readonly disabled?: boolean;
}

// =============================================================================
// Component
// =============================================================================

export function JourneyDemandActions({
  journeyDemandPublicId,
  canPublish = false,
  canCancel = false,
  canMatch = false,
  canConvert = false,
  canFulfill = false,
  publishRequest,
  cancelRequest,
  matchRequest,
  convertRequest,
  fulfillRequest,
  onPublishSuccess,
  onCancelSuccess,
  onMatchSuccess,
  onConvertSuccess,
  onFulfillSuccess,
  disabled = false,
}: JourneyDemandActionsProps) {
  const hasActions =
    canPublish ||
    canCancel ||
    canMatch ||
    canConvert ||
    canFulfill;

  if (!hasActions) {
    return null;
  }

  return (
    <div className="flex min-w-0 flex-wrap items-center gap-2">
      {canPublish && publishRequest ? (
        <JourneyDemandPublishAction
          journeyDemandPublicId={journeyDemandPublicId}
          request={publishRequest}
          onSuccess={onPublishSuccess}
          disabled={disabled}
        />
      ) : null}

      {canMatch && matchRequest ? (
        <JourneyDemandMatchAction
          journeyDemandPublicId={journeyDemandPublicId}
          request={matchRequest}
          onSuccess={onMatchSuccess}
          disabled={disabled}
        />
      ) : null}

      {canConvert && convertRequest ? (
        <JourneyDemandConvertAction
          journeyDemandPublicId={journeyDemandPublicId}
          request={convertRequest}
          onSuccess={onConvertSuccess}
          disabled={disabled}
        />
      ) : null}

      {canFulfill && fulfillRequest ? (
        <JourneyDemandFulfillAction
          journeyDemandPublicId={journeyDemandPublicId}
          request={fulfillRequest}
          onSuccess={onFulfillSuccess}
          disabled={disabled}
        />
      ) : null}

      {canCancel && cancelRequest ? (
        <JourneyDemandCancelAction
          journeyDemandPublicId={journeyDemandPublicId}
          request={cancelRequest}
          onSuccess={onCancelSuccess}
          disabled={disabled}
        />
      ) : null}
    </div>
  );
}
