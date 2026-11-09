
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
// It:
// - receives the requirement projection from the parent;
// - filters required requirements;
// - orders requirements consistently;
// - renders one VerificationRequirementCard per requirement;
// - forwards selection to the parent workflow;
// - renders the submission surface beneath the selected requirement.
//
// It does NOT:
// - fetch verification data;
// - create verification;
// - calculate requirement lifecycle state;
// - determine eligibility;
// - submit verification requests;
// - cancel requests;
// - upload assets;
// - perform navigation.
//
// Requirement state
// -----------------
// VerificationRequirement is the authoritative frontend projection.
//
// Submission placement
// --------------------
// The parent supplies the currently selected requirement and a submission
// renderer. Only the matching card receives the submission surface.
//
// Design system
// -------------
// Visual styling uses the frozen sisiMove design tokens.
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import type {
  VerificationRequirement,
} from '@/features/verification/models/verification-requirement';

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
   * Currently selected requirement.
   */
  readonly selectedRequirement?: VerificationRequirement | null;

  /**
   * Called when the user selects a requirement.
   */
  readonly onSelect?: (
    requirement: VerificationRequirement,
  ) => void;

  /**
   * Renders the submission surface for the selected requirement.
   *
   * The parent owns the submission workflow.
   */
  readonly renderSubmission?: (
    requirement: VerificationRequirement,
  ) => ReactNode;
}

// =============================================================================
// Requirement ordering
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
  selectedRequirement = null,
  onSelect,
  renderSubmission,
}: VerificationRequirementsProps) {
  // ---------------------------------------------------------------------------
  // Presentation filtering
  // ---------------------------------------------------------------------------

  const requiredRequirements = sortRequirements(
    requirements.filter(
      (requirement) => requirement.required,
    ),
  );

  // ---------------------------------------------------------------------------
  // Empty state
  // ---------------------------------------------------------------------------

  if (requiredRequirements.length === 0) {
    return null;
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="space-y-3">
      {requiredRequirements.map((requirement) => {
        const isSelected =
          selectedRequirement?.type === requirement.type;

        const submission =
          isSelected && renderSubmission
            ? renderSubmission(requirement)
            : null;

        return (
          <VerificationRequirementCard
            key={requirement.type}
            requirement={requirement}
            onSelect={onSelect}
            submission={submission}
          />
        );
      })}
    </div>
  );
}
