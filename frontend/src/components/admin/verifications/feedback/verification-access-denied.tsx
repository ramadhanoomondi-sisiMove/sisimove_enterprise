// -----------------------------------------------------------------------------
// sisiMove — Verification Access Denied
// -----------------------------------------------------------------------------
// Purpose: Explain when a user cannot access verification administration.
// -----------------------------------------------------------------------------

import { EmptyState } from "@/components/ui";

export interface VerificationAccessDeniedProps {
  title?: string;
  description?: string;
  onGoBack?: () => void;
  className?: string;
}

export function VerificationAccessDenied({
  title = "Access denied",
  description = "You do not have permission to access verification records. Contact an administrator if you believe you should have access.",
  onGoBack,
  className,
}: VerificationAccessDeniedProps) {
  return (
    <EmptyState
      title={title}
      description={description}
      className={className}
      primaryAction={
        onGoBack
          ? {
              label: "Go back",
              onClick: onGoBack,
              variant: "secondary",
            }
          : undefined
      }
    />
  );
}

export default VerificationAccessDenied;