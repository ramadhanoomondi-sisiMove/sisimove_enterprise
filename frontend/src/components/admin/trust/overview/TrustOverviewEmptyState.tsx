import type { ReactNode } from "react";

import {
  EmptyState,
  type EmptyStateAction,
} from "@/components/ui/empty-state";

// -----------------------------------------------------------------------------
// sisiMove — Trust Overview Empty State
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Display an empty state for the Trust Overview.
// - Support optional icon, title, and description.
// - Support primary and secondary actions.
// - Reuse the shared design-system EmptyState component.
//
// -----------------------------------------------------------------------------

export interface TrustOverviewEmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  className?: string;
}

export function TrustOverviewEmptyState({
  title = "Your trust overview is ready to build",
  description =
    "Trust activity and profile metrics will appear here when the relevant data becomes available.",
  icon,
  action,
  secondaryAction,
  className,
}: TrustOverviewEmptyStateProps) {
  return (
    <section
      aria-label="Trust overview empty state"
      className={className}
    >
      <EmptyState
        title={title}
        description={description}
        icon={icon}
        primaryAction={action}
        secondaryAction={secondaryAction}
      />
    </section>
  );
}

export default TrustOverviewEmptyState;
