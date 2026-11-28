'use client';

// -----------------------------------------------------------------------------
// sisiMove Admin — Commission Rule Details Container
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Provide the page-level layout.
// - Pass the rule public ID to the existing details layout.
// - Pass permitted actions supplied by the authorization-aware parent.
//
// Architecture:
// - Details layout owns queries and mutations.
// - Backend permission guards remain authoritative.
// - No frontend lifecycle eligibility calculations.
// -----------------------------------------------------------------------------

import { CommissionPageContainer } from '../layout/CommissionPageContainer';
import { CommissionRuleDetailsLayout } from './CommissionRuleDetailsLayout';

import type { CommissionRuleAction } from '../operations/rules';

export interface CommissionRuleDetailsContainerProps {
  readonly rulePublicId: string;
  readonly availableActions?: readonly CommissionRuleAction[];
}

export function CommissionRuleDetailsContainer({
  rulePublicId,
  availableActions = [],
}: CommissionRuleDetailsContainerProps) {
  return (
    <CommissionPageContainer>
      <CommissionRuleDetailsLayout
        rulePublicId={rulePublicId}
        availableActions={availableActions}
      />
    </CommissionPageContainer>
  );
}

export default CommissionRuleDetailsContainer;