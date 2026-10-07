// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Actions
// -----------------------------------------------------------------------------
//
// Action composition for an authenticated Journey Demand.
//
// UX PRINCIPLE:
// - Never hide a Journey Demand lifecycle action because of frontend-derived
//   lifecycle capability checks.
// - The complete lifecycle action set remains visible to the user.
// - The current Journey Demand status communicates where the demand currently
//   is in its lifecycle.
// - The backend remains authoritative over whether a command is valid.
//
// Architecture:
// - owns no API requests;
// - does not call mutation hooks;
// - does not own mutation state;
// - does not perform authorization checks;
// - does not derive lifecycle transitions;
// - does not determine whether a backend transition is allowed;
// - composes the individual mutation action components.
//
// Individual action components own:
// - their mutation hook;
// - their loading/error state;
// - their API invocation;
// - their mutation presentation.
//
// The parent/container remains responsible for:
// - supplying the Journey Demand public ID;
// - supplying command request metadata;
// - refreshing the authoritative Journey Demand projection after success.
//
// Request availability:
// - publishRequest is required to execute Publish;
// - cancelRequest is required to execute Cancel;
// - matchRequest is required to execute Match;
// - convertRequest is required to execute Convert;
// - fulfillRequest is required to execute Fulfill.
//
// A request is optional only when the command cannot currently be constructed
// because required command input is unavailable.
//
// Importantly, request availability is NOT a lifecycle capability check.
//
// Lifecycle visibility is not controlled by status, can* flags, or frontend
// authorization logic.
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
   * Backend command metadata for publishing.
   *
   * Publishing is always represented by the management UI.
   *
   * When this request is unavailable, the Publish action cannot execute and
   * therefore is not rendered.
   */
  readonly publishRequest?: PublishJourneyDemandRequest;

  /**
   * Backend command metadata for cancellation.
   *
   * Cancellation is always represented by the management UI.
   *
   * When this request is unavailable, the Cancel action cannot execute and
   * therefore is not rendered.
   */
  readonly cancelRequest?: CancelJourneyDemandRequest;

  /**
   * Backend command metadata for matching.
   *
   * Matching requires an explicit Journey candidate.
   *
   * When no candidate has been supplied, there is no valid Match command to
   * execute. This is a missing command input, not a lifecycle capability
   * decision.
   */
  readonly matchRequest?: MatchJourneyDemandRequest;

  /**
   * Backend command metadata for conversion.
   *
   * Conversion requires the Journey already associated with the demand.
   *
   * When no matched Journey exists, there is no valid Convert command to
   * construct. This is a missing command input, not a lifecycle capability
   * decision.
   */
  readonly convertRequest?: ConvertJourneyDemandRequest;

  /**
   * Backend command metadata for fulfilment.
   *
   * Fulfilment is always represented by the management UI.
   *
   * When this request is unavailable, the Fulfill action cannot execute and
   * therefore is not rendered.
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
   *
   * It does not determine lifecycle availability.
   */
  readonly disabled?: boolean;
}

// =============================================================================
// Component
// =============================================================================

export function JourneyDemandActions({
  journeyDemandPublicId,
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
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-2">
      {/* --------------------------------------------------------------------- */}
      {/* Publish                                                               */}
      {/* --------------------------------------------------------------------- */}
      {publishRequest ? (
        <JourneyDemandPublishAction
          journeyDemandPublicId={journeyDemandPublicId}
          request={publishRequest}
          onSuccess={onPublishSuccess}
          disabled={disabled}
        />
      ) : null}

      {/* --------------------------------------------------------------------- */}
      {/* Match                                                                */}
      {/* --------------------------------------------------------------------- */}
      {matchRequest ? (
        <JourneyDemandMatchAction
          journeyDemandPublicId={journeyDemandPublicId}
          request={matchRequest}
          onSuccess={onMatchSuccess}
          disabled={disabled}
        />
      ) : null}

      {/* --------------------------------------------------------------------- */}
      {/* Convert                                                              */}
      {/* --------------------------------------------------------------------- */}
      {convertRequest ? (
        <JourneyDemandConvertAction
          journeyDemandPublicId={journeyDemandPublicId}
          request={convertRequest}
          onSuccess={onConvertSuccess}
          disabled={disabled}
        />
      ) : null}

      {/* --------------------------------------------------------------------- */}
      {/* Fulfill                                                              */}
      {/* --------------------------------------------------------------------- */}
      {fulfillRequest ? (
        <JourneyDemandFulfillAction
          journeyDemandPublicId={journeyDemandPublicId}
          request={fulfillRequest}
          onSuccess={onFulfillSuccess}
          disabled={disabled}
        />
      ) : null}

      {/* --------------------------------------------------------------------- */}
      {/* Cancel                                                               */}
      {/* --------------------------------------------------------------------- */}
      {cancelRequest ? (
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

