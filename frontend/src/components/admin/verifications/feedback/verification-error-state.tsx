// -----------------------------------------------------------------------------
// sisiMove — Verification Error State
// -----------------------------------------------------------------------------
// Purpose: Display recoverable errors when verification data cannot be loaded.
// -----------------------------------------------------------------------------

import { ErrorState } from "@/components/ui";

export interface VerificationErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export function VerificationErrorState({
  title = "Unable to load verifications",
  description = "We could not retrieve the verification data. Please try again.",
  onRetry,
  retryLabel = "Try again",
  className,
}: VerificationErrorStateProps) {
  return (
    <ErrorState
      title={title}
      description={description}
      className={className}
      retryAction={
        onRetry
          ? {
              label: retryLabel,
              onClick: onRetry,
            }
          : undefined
      }
    />
  );
}

export default VerificationErrorState;