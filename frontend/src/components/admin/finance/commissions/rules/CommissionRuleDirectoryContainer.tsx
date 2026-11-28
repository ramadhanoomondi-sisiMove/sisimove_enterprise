'use client';

// -----------------------------------------------------------------------------
// sisiMove Admin — Commission Rule Directory Container
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Provide the page-level layout.
// - Delegate directory state, queries and operations to CommissionRuleDirectory.
//
// Architecture:
// - CommissionRuleDirectory owns directory orchestration.
// - Backend remains authoritative for rule persistence and operations.
// -----------------------------------------------------------------------------

import { CommissionPageContainer } from '../layout/CommissionPageContainer';
import { CommissionRuleDirectory } from './CommissionRuleDirectory';

export function CommissionRuleDirectoryContainer() {
  return (
    <CommissionPageContainer>
      <CommissionRuleDirectory />
    </CommissionPageContainer>
  );
}

export default CommissionRuleDirectoryContainer;