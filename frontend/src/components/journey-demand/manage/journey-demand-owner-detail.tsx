// -----------------------------------------------------------------------------
// Path: src/features/journey-demand/components/manage/journey-demand-owner-detail.tsx
// -----------------------------------------------------------------------------
//
// sisiMove — Journey Demand Owner Detail
//
// Authenticated owner-facing Journey Demand detail boundary.
//
// Architecture:
// - Consumes MyJourneyDemand only.
// - Receives an already-loaded owner projection.
// - Delegates read-only presentation to MyJourneyDemandDetail.
// - Accepts externally supplied management UI.
// - Does not fetch.
// - Does not mutate.
// - Does not authorize.
// - Does not determine lifecycle capabilities.
// - Does not construct backend domain objects.
//
// Current ownership chain:
//
//     JourneyDemandManagementPanel
//          ↓
//     JourneyDemandManagement
//          ↓
//     JourneyDemandEditor
//
// This component is therefore a presentation boundary, not a management
// workflow.
//
// -----------------------------------------------------------------------------

'use client';

import type { ReactNode } from 'react';

import type { MyJourneyDemand } from '@/features/journey-demand/models';
import { cn } from '@/foundation';

import { MyJourneyDemandDetail } from './my-journey-demand-detail';

// =============================================================================
// Props
// =============================================================================

export interface JourneyDemandOwnerDetailProps {
  /**
   * Authenticated-owner Journey Demand read contract.
   *
   * Ownership and authorization are established outside this component.
   */
  readonly demand: MyJourneyDemand;

  /**
   * Optional management UI supplied by the parent/container.
   *
   * The component does not decide which management controls are available.
   */
  readonly actions?: ReactNode;

  readonly className?: string;
}

// =============================================================================
// Component
// =============================================================================

/**
 * Presents the authenticated owner's Journey Demand detail.
 *
 * The component intentionally delegates all actual presentation to
 * MyJourneyDemandDetail.
 *
 * It does not:
 *
 * - load data;
 * - check ownership;
 * - check permissions;
 * - call mutations;
 * - derive lifecycle capabilities;
 * - create editing sections;
 * - convert read models.
 */
export function JourneyDemandOwnerDetail({
  demand,
  actions,
  className,
}: JourneyDemandOwnerDetailProps) {
  return (
    <div className={cn('min-w-0', className)}>
      <MyJourneyDemandDetail
        demand={demand}
        management={actions}
      />
    </div>
  );
}