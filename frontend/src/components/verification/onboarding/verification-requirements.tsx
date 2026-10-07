'use client';

// -----------------------------------------------------------------------------
// Path: src/components/verification/onboarding/verification-requirements.tsx
// -----------------------------------------------------------------------------
//
// sisiMove — Verification Requirements
//
// Dependency level: 2
//
// Responsibility
// --------------
// Presents the verification requirements supplied by the feature-level
// verification workflow.
//
// Data flow:
//
//     VerificationOnboarding
//             │
//             │ VerificationRequirement[]
//             ▼
//     VerificationRequirements
//             │
//             ├── filter required requirements
//             ├── order requirements
//             └── render VerificationRequirementCard[]
//
// This component:
// - receives the requirement projection from its parent;
// - filters presentation to required requirements;
// - orders requirements consistently;
// - renders one VerificationRequirementCard per requirement;
// - forwards selection to the parent workflow.
//
// This component does NOT:
// - fetch Verification;
// - fetch Verification Requests;
// - create Verification;
// - calculate requirement lifecycle state;
// - determine eligibility;
// - determine which requirements are required;
// - submit verification requests;
// - cancel requests;
// - upload assets;
// - perform navigation.
//
// Requirement state
// -----------------
// VerificationRequirement is already the frontend projection produced by
// mapVerificationRequirements().
//
// This component must therefore treat each requirement as authoritative and
// must not inspect Verification or VerificationRequest state.
//
// Design system
// -------------
// This component intentionally contains minimal styling.
// Visual styling uses the frozen sisiMove design tokens only.
// -----------------------------------------------------------------------------

import type { VerificationRequirement } from '@/features/verification/models/verification-requirement';

import { VerificationRequirementCard } from './verification-requirement-card';

// =============================================================================
// Props
// =============================================================================

export interface VerificationRequirementsProps {
  /**
   * Requirement projection supplied by the feature-level workflow.
   */
  readonly requirements: readonly VerificationRequirement[];

  /**
   * Called when the user selects a requirement.
   *
   * Selection belongs to the parent workflow because the parent decides which
   * submission surface should be opened.
   */
  readonly onSelect?: (
    requirement: VerificationRequirement,
  ) => void;
}

// =============================================================================
// Requirement ordering
// =============================================================================
//
// Ordering is presentation-only.
//
// The order does not determine eligibility or requirement importance. Those
// decisions belong to the backend/application layer and are already reflected
// in the requirement projection.
//
// The fixed visual order is:
//
//     1. Profile photo
//     2. Government ID
//     3. Driver license
//
// =============================================================================

const REQUIREMENT_ORDER: Readonly<
  Record<VerificationRequirement['type'], number>
> = {
  PROFILE_PHOTO: 0,
  GOVERNMENT_ID: 1,
  DRIVER_LICENSE: 2,
};

function sortRequirements(
  requirements: readonly VerificationRequirement[],
): VerificationRequirement[] {
  return [...requirements].sort(
    (left, right) =>
      REQUIREMENT_ORDER[left.type] -
      REQUIREMENT_ORDER[right.type],
  );
}

// =============================================================================
// Component
// =============================================================================

export function VerificationRequirements({
  requirements,
  onSelect,
}: VerificationRequirementsProps) {
  // ---------------------------------------------------------------------------
  // Presentation filtering
  // ---------------------------------------------------------------------------
  //
  // The `required` flag is already part of the requirement projection.
  //
  // We do not calculate this flag here. We only use it to determine which
  // projected requirements belong in this required-requirements surface.
  // ---------------------------------------------------------------------------

  const requiredRequirements = sortRequirements(
    requirements.filter(
      (requirement) => requirement.required,
    ),
  );

  // ---------------------------------------------------------------------------
  // Empty state
  // ---------------------------------------------------------------------------
  //
  // There is nothing to render when the requirement projection contains no
  // required requirements.
  //
  // This component intentionally does not invent an empty-state message or
  // assume why the collection is empty.
  // ---------------------------------------------------------------------------

  if (requiredRequirements.length === 0) {
    return null;
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="space-y-3">
      {requiredRequirements.map((requirement) => (
        <VerificationRequirementCard
          key={requirement.type}
          requirement={requirement}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
