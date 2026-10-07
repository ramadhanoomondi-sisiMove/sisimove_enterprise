'use client';

// -----------------------------------------------------------------------------
// Path:
// src/features/journey-demand/components/manage/journey-demand-management.tsx
// -----------------------------------------------------------------------------
//
// sisiMove — Journey Demand Management
//
// Authenticated Journey Demand management composition.
//
// Responsibilities:
//
// - compose the authenticated Journey Demand management UI;
// - receive the current MyJourneyDemand projection;
// - render the Journey Demand editor;
// - render Journey Demand lifecycle actions;
// - coordinate authoritative projection refreshes;
// - own management-level lifecycle success acknowledgement;
// - render caller-provided acknowledgement actions.
//
// Non-responsibilities:
//
// - no Journey Demand query;
// - no Journey Demand API mutation implementation;
// - no backend aggregate/entity reconstruction;
// - no lifecycle rules;
// - no authorization decisions;
// - no capability inference;
// - no route construction;
// - no navigation;
// - no individual section mutation ownership;
// - no editor section composition.
//
// -----------------------------------------------------------------------------
//
// DATA FLOW
// -----------------------------------------------------------------------------
//
//   JourneyDemandManagementPanel
//          │
//          │ MyJourneyDemand
//          ▼
//   JourneyDemandManagement
//      │
//      ├── JourneyDemandEditor
//      │       │
//      │       ├── JourneyDemandEditorSections
//      │       │       ├── Overview
//      │       │       ├── Corridor
//      │       │       ├── Schedule
//      │       │       ├── Capacity
//      │       │       └── Pricing
//      │       │
//      │       └── specialized section mutations
//      │
//      └── JourneyDemandActions
//              │
//              ├── Publish
//              ├── Match
//              ├── Convert
//              ├── Fulfill
//              └── Cancel
//
// -----------------------------------------------------------------------------
//
// SUCCESS ACKNOWLEDGEMENT
// -----------------------------------------------------------------------------
//
// Lifecycle success is owned here.
//
//     lifecycle action
//          ↓
//     successful mutation
//          ↓
//     on*Success()
//          ↓
//     setSuccessType(...)
//          ↓
//     SuccessModal renders
//
// The SuccessModal is presentation-only.
//
// It does not:
//
// - perform mutations;
// - navigate;
// - determine lifecycle validity;
// - refresh projections;
// - decide whether an operation succeeded.
//
// This component is therefore the correct owner of the lifecycle success
// acknowledgement because this component owns the management-level response
// to a successful lifecycle operation.
//
// -----------------------------------------------------------------------------
//
// EDITOR SUCCESS
// -----------------------------------------------------------------------------
//
// Editor section changes remain owned by JourneyDemandEditor.
//
//     section editor
//          ↓
//     specialized mutation
//          ↓
//     JourneyDemandEditor
//          ↓
//     onChanged()
//          ↓
//     refreshInBackground()
//
// Editor changes do NOT set `successType` here.
//
// JourneyDemandEditor owns its own editing acknowledgement.
//
// -----------------------------------------------------------------------------
//
// IMPORTANT LIFECYCLE RULE
// -----------------------------------------------------------------------------
//
// This component does not determine whether an operation is currently valid.
//
// It does not calculate:
//
//     canPublish
//     canCancel
//     canMatch
//     canConvert
//     canFulfill
//
// Backend/domain rules remain authoritative.
//
// JourneyDemandActions receives the supplied request metadata and delegates
// each operation to its dedicated lifecycle action component.
//
// -----------------------------------------------------------------------------
//
// DISABLED STATE
// -----------------------------------------------------------------------------
//
// `disabled` belongs to the management-level lifecycle action surface.
//
// It is passed only to JourneyDemandActions.
//
// It is intentionally NOT passed to JourneyDemandEditor.
//
// -----------------------------------------------------------------------------
//
// NAVIGATION
// -----------------------------------------------------------------------------
//
// This component does not navigate.
//
// Caller-provided `successActions` may contain navigation controls, but the
// navigation decision remains outside this component.
//
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';
import { useState } from 'react';

import { SuccessModal } from '@/components/ui/success-modal';
import { cn } from '@/foundation';

import type { CancelJourneyDemandRequest } from '@/features/journey-demand/api/journey-demands/cancel-journey-demand.api';
import type { ConvertJourneyDemandRequest } from '@/features/journey-demand/api/journey-demands/convert-journey-demand.api';
import type { FulfillJourneyDemandRequest } from '@/features/journey-demand/api/journey-demands/fulfill-journey-demand.api';
import type { MatchJourneyDemandRequest } from '@/features/journey-demand/api/journey-demands/match-journey-demand.api';
import type { PublishJourneyDemandRequest } from '@/features/journey-demand/api/journey-demands/publish-journey-demand.api';
import type { MyJourneyDemand } from '@/features/journey-demand/models';

import { JourneyDemandActions } from './journey-demand-actions';
import { JourneyDemandEditor } from './journey-demand-editor';

// =============================================================================
// Props
// =============================================================================

export interface JourneyDemandManagementProps {
  /**
   * Current authenticated Journey Demand projection.
   *
   * This is the authoritative read model supplied by the management panel.
   *
   * The management component must never reconstruct this object locally.
   */
  readonly demand: MyJourneyDemand;

  /**
   * Refreshes the authoritative authenticated Journey Demand projection.
   *
   * Used after successful lifecycle operations and successful editor changes.
   */
  readonly onRefresh?: () => void | Promise<void>;

  // ---------------------------------------------------------------------------
  // Lifecycle request metadata
  // ---------------------------------------------------------------------------

  readonly publishRequest?: PublishJourneyDemandRequest;

  readonly cancelRequest?: CancelJourneyDemandRequest;

  readonly matchRequest?: MatchJourneyDemandRequest;

  readonly convertRequest?: ConvertJourneyDemandRequest;

  readonly fulfillRequest?: FulfillJourneyDemandRequest;

  // ---------------------------------------------------------------------------
  // Editor presentation
  // ---------------------------------------------------------------------------

  readonly title?: string;

  readonly description?: string;

  // ---------------------------------------------------------------------------
  // Success acknowledgement
  // ---------------------------------------------------------------------------

  /**
   * Optional content rendered inside the lifecycle success acknowledgement.
   *
   * The caller owns the behavior of these actions.
   *
   * JourneyDemandManagement does not navigate itself.
   */
  readonly successActions?: ReactNode;

  // ---------------------------------------------------------------------------
  // Presentation
  // ---------------------------------------------------------------------------

  readonly className?: string;

  /**
   * Disables management-level lifecycle interaction.
   *
   * This is forwarded only to JourneyDemandActions.
   */
  readonly disabled?: boolean;
}

// =============================================================================
// Success State
// =============================================================================

type JourneyDemandSuccessType =
  | 'published'
  | 'cancelled'
  | 'matched'
  | 'converted'
  | 'fulfilled'
  | null;

// =============================================================================
// Component
// =============================================================================

export function JourneyDemandManagement({
  demand,
  onRefresh,
  publishRequest,
  cancelRequest,
  matchRequest,
  convertRequest,
  fulfillRequest,
  title,
  description,
  successActions,
  className,
  disabled = false,
}: JourneyDemandManagementProps) {
  // ===========================================================================
  // Lifecycle success acknowledgement
  // ===========================================================================
  //
  // This state is intentionally management-level state.
  //
  // It represents successful completion of a lifecycle command, not an editor
  // field change.
  //
  // ===========================================================================
  const [successType, setSuccessType] =
    useState<JourneyDemandSuccessType>(null);

  // ===========================================================================
  // Projection refresh
  // ===========================================================================
  //
  // The mutation action has already succeeded when this function is called.
  //
  // A refresh failure therefore MUST NOT turn a successful domain operation
  // into a failed operation from the user's perspective.
  //
  // The authoritative projection remains owned by the query boundary.
  //
  // ===========================================================================
  function refreshInBackground(): void {
    const refreshResult = onRefresh?.();

    if (refreshResult !== undefined) {
      void Promise.resolve(refreshResult).catch(() => undefined);
    }
  }

  // ===========================================================================
  // Editor change coordination
  // ===========================================================================

  function handleEditorChanged(): void {
    refreshInBackground();
  }

  // ===========================================================================
  // Lifecycle success handlers
  // ===========================================================================
  //
  // These callbacks are invoked only after the corresponding lifecycle action
  // has successfully completed its mutation.
  //
  // They do two things:
  //
  // 1. acknowledge the successful physical-world operation to the user;
  // 2. request an authoritative projection refresh.
  //
  // They do NOT perform the mutation themselves.
  //
  // ===========================================================================
  function handlePublishSuccess(): void {
    setSuccessType('published');
    refreshInBackground();
  }

  function handleCancelSuccess(): void {
    setSuccessType('cancelled');
    refreshInBackground();
  }

  function handleMatchSuccess(): void {
    setSuccessType('matched');
    refreshInBackground();
  }

  function handleConvertSuccess(): void {
    setSuccessType('converted');
    refreshInBackground();
  }

  function handleFulfillSuccess(): void {
    setSuccessType('fulfilled');
    refreshInBackground();
  }

  // ===========================================================================
  // Success content
  // ===========================================================================
  //
  // The success type is the source of truth for whether the acknowledgement
  // should be open.
  //
  // Because JourneyDemandSuccessType is a closed union, every non-null value
  // has corresponding success content.
  //
  // ===========================================================================
  const successContent = getSuccessContent(successType);

  // ===========================================================================
  // Render
  // ===========================================================================

  return (
    <>
      <div
        className={cn(
          'w-full',
          'space-y-5',
          className,
        )}
      >
        {/* ----------------------------------------------------------------- */}
        {/* Journey Demand Editor                                             */}
        {/* ----------------------------------------------------------------- */}
        <JourneyDemandEditor
          demand={demand}
          title={title}
          description={description}
          onChanged={handleEditorChanged}
        />

        {/* ----------------------------------------------------------------- */}
        {/* Lifecycle Actions                                                 */}
        {/* ----------------------------------------------------------------- */}
        <JourneyDemandActions
          journeyDemandPublicId={demand.publicId}
          publishRequest={publishRequest}
          cancelRequest={cancelRequest}
          matchRequest={matchRequest}
          convertRequest={convertRequest}
          fulfillRequest={fulfillRequest}
          onPublishSuccess={handlePublishSuccess}
          onCancelSuccess={handleCancelSuccess}
          onMatchSuccess={handleMatchSuccess}
          onConvertSuccess={handleConvertSuccess}
          onFulfillSuccess={handleFulfillSuccess}
          disabled={disabled}
        />
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Lifecycle Success Modal                                             */}
      {/* ------------------------------------------------------------------- */}
      {successType !== null && successContent ? (
        <SuccessModal
          open
          title={successContent.title}
          description={successContent.description}
          onClose={() => setSuccessType(null)}
          actions={successActions}
        >
          <p className="text-sm leading-6 text-[var(--foreground-muted)]">
            {successContent.message}
          </p>
        </SuccessModal>
      ) : null}
    </>
  );
}

// =============================================================================
// Success Content
// =============================================================================

interface JourneyDemandSuccessContent {
  readonly title: string;
  readonly description: string;
  readonly message: string;
}

function getSuccessContent(
  successType: JourneyDemandSuccessType,
): JourneyDemandSuccessContent | null {
  switch (successType) {
    case 'published':
      return {
        title: 'Your Demand is now live',
        description:
          'Your Journey Demand has been published successfully and is now available for matching.',
        message:
          'Your travel need is now visible in the Journey Demand marketplace.',
      };

    case 'cancelled':
      return {
        title: 'Demand cancelled',
        description:
          'Your Journey Demand has been cancelled successfully.',
        message:
          'The latest Demand status will be reflected in your management view.',
      };

    case 'matched':
      return {
        title: 'Journey matched',
        description:
          'A Journey has been matched to your travel Demand successfully.',
        message:
          'The matched Journey is now associated with this Demand.',
      };

    case 'converted':
      return {
        title: 'Demand converted',
        description:
          'Your Journey Demand has been converted successfully.',
        message:
          'The latest Demand state is now reflected in your management view.',
      };

    case 'fulfilled':
      return {
        title: 'Demand fulfilled',
        description:
          'Your Journey Demand has been fulfilled successfully.',
        message:
          'This Demand has completed its lifecycle.',
      };

    case null:
      return null;
  }
}