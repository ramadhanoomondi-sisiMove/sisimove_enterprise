// -----------------------------------------------------------------------------
// sisiMove — Verification Section
// -----------------------------------------------------------------------------
//
// Authenticated profile section for managing traveller verification.
//
// Responsibilities:
// - Present the traveller's verification summary.
// - Provide the primary Manage action.
// - Delegate detailed presentation to VerificationSummary.
//
// Non-responsibilities:
// - Fetching verification data.
// - Submitting verification requests.
// - Cancelling verification requests.
// - Reviewing verification requests.
// - Granting or rejecting verification.
//
// Those concerns belong to the verification feature's API/application layer.
//
// Architecture:
// - Presentation-only profile section.
// - Receives Verification and VerificationRequirement data from its parent.
// - Uses the shared Button primitive for section-level interaction.
// - Delegates verification-state presentation to VerificationSummary.
// - Does not access verification hooks or APIs.
// - Does not determine verification eligibility.
//
// -----------------------------------------------------------------------------

'use client';

import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import type {
  Verification,
  VerificationRequirement,
} from '@/features/verification/models';

import { VerificationSummary } from './verification-summary';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface VerificationSectionProps {
  /**
   * Current aggregate verification state.
   */
  readonly verification: Verification;

  /**
   * Current state of the verification requirements.
   */
  readonly requirements: readonly VerificationRequirement[];

  /**
   * Primary section-level action for opening verification management.
   */
  readonly onManage?: () => void;

  /**
   * Action for opening member verification management.
   */
  readonly onManageMember?: () => void;

  /**
   * Action for opening driver verification management.
   */
  readonly onManageDriver?: () => void;
}

// -----------------------------------------------------------------------------
// Verification Section
// -----------------------------------------------------------------------------

export function VerificationSection({
  verification,
  requirements,
  onManage,
  onManageMember,
  onManageDriver,
}: VerificationSectionProps): ReactNode {
  return (
    <section className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">
            Verification
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Verify your identity and driving credentials for protected
            sisiMove actions.
          </p>
        </div>

        {onManage !== undefined ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onManage}
            className="shrink-0"
          >
            Manage
          </Button>
        ) : null}
      </div>

      <VerificationSummary
        verification={verification}
        requirements={requirements}
        onManageMember={onManageMember}
        onManageDriver={onManageDriver}
      />
    </section>
  );
}