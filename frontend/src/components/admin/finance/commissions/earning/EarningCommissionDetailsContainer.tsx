'use client';

// -----------------------------------------------------------------------------
// sisiMove Admin — Earning Commission Details Container
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Provide the page-level layout.
// - Pass the earning commission public ID to the details layout.
//
// Architecture:
// - Details layout owns data fetching and operations.
// - Backend owns lifecycle eligibility and transitions.
// - No duplicate queries or business rules.
// -----------------------------------------------------------------------------

import { CommissionPageContainer } from '../layout/CommissionPageContainer';
import { EarningCommissionDetailsLayout } from './EarningCommissionDetailsLayout';

export interface EarningCommissionDetailsContainerProps {
  readonly commissionPublicId: string;
}

export function EarningCommissionDetailsContainer({
  commissionPublicId,
}: EarningCommissionDetailsContainerProps) {
  return (
    <CommissionPageContainer>
      <EarningCommissionDetailsLayout
        commissionPublicId={commissionPublicId}
      />
    </CommissionPageContainer>
  );
}

export default EarningCommissionDetailsContainer;