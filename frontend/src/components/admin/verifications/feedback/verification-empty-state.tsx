// -----------------------------------------------------------------------------
// sisiMove — Verification Empty State
// -----------------------------------------------------------------------------
// Purpose: Display a consistent empty state for the verification review queue.
// -----------------------------------------------------------------------------

import { EmptyState } from "@/components/ui";

export interface VerificationEmptyStateProps {
  title?: string;
  description?: string;
  onResetFilters?: () => void;
  resetLabel?: string;
  className?: string;
}

export function VerificationEmptyState({
  title = "No verification requests found",
  description = "There are no verification requests matching your current filters.",
  onResetFilters,
  resetLabel = "Clear filters",
  className,
}: VerificationEmptyStateProps) {
  return (
    <EmptyState
      title={title}
      description={description}
      className={className}
      primaryAction={
        onResetFilters
          ? {
              label: resetLabel,
              onClick: onResetFilters,
            }
          : undefined
      }
    />
  );
}

export default VerificationEmptyState;