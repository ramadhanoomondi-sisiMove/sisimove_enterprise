'use client';

// -----------------------------------------------------------------------------
// sisiMove Admin — Booking Commission Details Container
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Provide the page-level layout for booking commission details.
// - Pass the commission public ID to the details layout.
// - Delegate data fetching, lifecycle operations and detail composition.
//
// Architecture:
// - Page container owns page width and spacing.
// - Details layout owns query and operation orchestration.
// - No duplicate data fetching or business logic.
// -----------------------------------------------------------------------------

import { CommissionPageContainer } from '../layout/CommissionPageContainer';
import { BookingCommissionDetailsLayout } from './BookingCommissionDetailsLayout';

export interface BookingCommissionDetailsContainerProps {
  readonly commissionPublicId: string;
}

export function BookingCommissionDetailsContainer({
  commissionPublicId,
}: BookingCommissionDetailsContainerProps) {
  return (
    <CommissionPageContainer>
      <BookingCommissionDetailsLayout
        commissionPublicId={commissionPublicId}
      />
    </CommissionPageContainer>
  );
}

export default BookingCommissionDetailsContainer;