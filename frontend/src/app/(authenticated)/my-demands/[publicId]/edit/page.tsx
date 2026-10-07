// -----------------------------------------------------------------------------
// Path:
// src/app/(authenticated)/my-demands/[publicId]/edit/page.tsx
// -----------------------------------------------------------------------------
//
// sisiMove — Edit My Journey Demand Page
//
// Authenticated Journey Demand editing and publication surface.
//
// This route intentionally goes DIRECTLY into JourneyDemandEditor after the
// Journey Demand has been created as a DRAFT.
//
// The workflow is:
//
//     /my-demands/new
//          ↓
//     JourneyDemandCreateForm
//          ↓
//     Journey Demand DRAFT
//          ↓
//     /my-demands/[publicId]/edit
//          ↓
//     JourneyDemandEditor
//          ↓
//     edit / save sections
//          ↓
//     Publish demand
//          ↓
//     Journey Demand becomes publicly available
//
// Lifecycle management remains separated from the editor itself.
//
// JourneyDemandEditor owns:
//
// - section editing;
// - section-local draft state;
// - specialized mutations;
// - editor validation;
// - authoritative refresh after edits;
// - edit success acknowledgement.
//
// JourneyDemandPublishAction owns:
//
// - publish mutation;
// - publish loading state;
// - publish mutation error state;
// - publish command execution;
// - publish success callback.
//
// This page owns only the composition and navigation between those workflow
// stages.
//
// -----------------------------------------------------------------------------
//
// Route:
//
//     /my-demands/[publicId]/edit
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - read the Journey Demand publicId from the route;
// - load the authenticated owner's MyJourneyDemand projection;
// - render loading state;
// - render query error state;
// - render not-found state;
// - compose JourneyDemandEditor;
// - compose JourneyDemandPublishAction;
// - provide the authoritative projection refresh callback;
// - navigate to the public Demand after successful publication.
//
// -----------------------------------------------------------------------------
//
// Non-responsibilities:
//
// - no Journey Demand editing mutation implementation;
// - no publish mutation implementation;
// - no cancel/match/convert/fulfil mutation implementation;
// - no lifecycle capability inference;
// - no ownership decision;
// - no authorization decision;
// - no backend aggregate reconstruction;
// - no public Journey Demand querying;
// - no section composition;
// - no section mutation hooks;
// - no publish validation;
// - no automatic lifecycle-state interpretation.
//
// -----------------------------------------------------------------------------
//
// EDITOR OWNERSHIP
// -----------------------------------------------------------------------------
//
// JourneyDemandEditor owns the complete editing workflow.
//
// It owns:
//
// - editable section composition;
// - section ordering;
// - section-local state;
// - supported corridor selection;
// - specialized update mutations;
// - mutation loading/error state;
// - editor validation;
// - editor success handling;
// - calling `onChanged` after successful changes.
//
// -----------------------------------------------------------------------------
//
// PUBLISH OWNERSHIP
// -----------------------------------------------------------------------------
//
// JourneyDemandPublishAction owns publication.
//
// It deliberately does not:
//
// - inspect the Demand lifecycle;
// - determine whether publishing is allowed;
// - perform authorization checks;
// - derive `canPublish`;
// - hide itself based on status.
//
// The backend remains authoritative.
//
// The page simply supplies:
//
//     journeyDemandPublicId
//     request metadata
//     onSuccess
//
// -----------------------------------------------------------------------------
//
// DATA FLOW
// -----------------------------------------------------------------------------
//
//     route publicId
//          ↓
//     useMyJourneyDemand(publicId)
//          ↓
//     MyJourneyDemand
//          ↓
//     ┌─────────────────────────────────┐
//     │                                 │
//     ▼                                 ▼
// JourneyDemandEditor       PublishJourneyDemandAction
//     │                                 │
//     │ edit sections                   │ publish
//     │                                 │
//     ▼                                 ▼
// specialized mutations          publish mutation
//     │                                 │
//     └──────────────┬──────────────────┘
//                    ↓
//             authoritative backend
//                    ↓
//                 refetch
//                    ↓
//          updated MyJourneyDemand
//
// After successful publication:
//
//     publish success
//          ↓
//     public Demand route
//
// -----------------------------------------------------------------------------
//
// IMPORTANT
// -----------------------------------------------------------------------------
//
// Do not pass:
//
//     sections
//     disabled
//
// to JourneyDemandEditor unless those properties are explicitly part of its
// public contract.
//
// The editor owns its own section composition and mutation disabled state.
//
// Do not put the publish mutation directly into this page.
//
// Do not put the publish mutation into JourneyDemandEditor.
//
// JourneyDemandPublishAction already owns that responsibility.
//
// -----------------------------------------------------------------------------

'use client';

import { useParams, useRouter } from 'next/navigation';

import { JourneyDemandPublishAction } from '@/components/journey-demand/manage';
import { JourneyDemandEditor } from '@/components/journey-demand/manage';

import { useMyJourneyDemand } from '@/features/journey-demand/hooks/queries/use-my-journey-demand';

// =============================================================================
// Page
// =============================================================================

export default function EditMyJourneyDemandPage() {
  const params = useParams<{ publicId: string }>();
  const router = useRouter();

  const publicId = params.publicId?.trim() ?? '';

  // ---------------------------------------------------------------------------
  // Journey Demand Query
  // ---------------------------------------------------------------------------
  //
  // The edit route is the query boundary for this direct editing surface.
  //
  // The query returns the authenticated owner's MyJourneyDemand projection.
  //
  // JourneyDemandEditor and JourneyDemandPublishAction both operate against
  // this already-loaded authoritative projection.
  //
  // The hook is intentionally called before the conditional rendering guards.
  // This preserves React's hook ordering regardless of query state.
  //
  // ---------------------------------------------------------------------------

  const {
    demand,
    isLoading,
    error,
    refetch,
  } = useMyJourneyDemand(publicId);

  // ---------------------------------------------------------------------------
  // Invalid Route Parameter
  // ---------------------------------------------------------------------------

  if (publicId.length === 0) {
    return (
      <main className="page-container py-5 sm:py-6">
        <div className="mx-auto w-full max-w-5xl">
          <p className="text-sm text-[var(--foreground-muted)]">
            Journey Demand not found.
          </p>
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return (
      <main className="page-container py-5 sm:py-6">
        <div className="mx-auto w-full max-w-5xl">
          <p className="text-sm text-[var(--foreground-muted)]">
            Loading Journey Demand...
          </p>
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Error
  // ---------------------------------------------------------------------------
  //
  // The query owns the actual error.
  //
  // This route only presents it. It does not reinterpret API/domain errors or
  // attempt to decide whether the user is authorized to edit the Demand.
  //
  // ---------------------------------------------------------------------------

  if (error) {
    return (
      <main className="page-container py-5 sm:py-6">
        <div className="mx-auto w-full max-w-5xl">
          <p className="text-sm text-[var(--destructive)]">
            {error.message}
          </p>
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Not Found
  // ---------------------------------------------------------------------------
  //
  // No local fallback object is constructed.
  //
  // The editor and publish action must receive the actual authenticated
  // projection returned by the owner query.
  //
  // ---------------------------------------------------------------------------

  if (!demand) {
    return (
      <main className="page-container py-5 sm:py-6">
        <div className="mx-auto w-full max-w-5xl">
          <p className="text-sm text-[var(--foreground-muted)]">
            Journey Demand not found.
          </p>
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Publish Success
  // ---------------------------------------------------------------------------
  //
  // Publication is owned by JourneyDemandPublishAction.
  //
  // This callback belongs to the route because navigation is a route concern.
  //
  // The public Demand detail route receives the same public identifier returned
  // by the authenticated owner projection.
  //
  // ---------------------------------------------------------------------------

  const handlePublishSuccess = async (): Promise<void> => {
    await refetch();

    router.push(
      `/demands/${encodeURIComponent(demand.publicId)}`,
    );
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  //
  // The route composes two independent workflow concerns:
  //
  //     JourneyDemandEditor
  //             ↓
  //       configure Demand
  //
  //     JourneyDemandPublishAction
  //             ↓
  //       publish Demand
  //
  // Neither concern is implemented by this page.
  //
  // ---------------------------------------------------------------------------

  return (
    <main className="page-container py-5 sm:py-6">
      <div className="mx-auto w-full max-w-5xl space-y-5 sm:space-y-6">
        <JourneyDemandEditor
          demand={demand}
          onChanged={refetch}
        />

        <div className="flex justify-end border-t border-[var(--border)] pt-5">
          <JourneyDemandPublishAction
            journeyDemandPublicId={demand.publicId}
            request={{
              correlationId: crypto.randomUUID(),
            }}
            onSuccess={handlePublishSuccess}
          />
        </div>
      </div>
    </main>
  );
}