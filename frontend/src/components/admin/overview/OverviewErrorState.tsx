
/**
 * -----------------------------------------------------------------------------
 * sisiMove — Admin Overview Error State
 * -----------------------------------------------------------------------------
 *
 * Domain-specific error presentation for the Admin Overview feature.
 *
 * Responsibilities:
 *
 * - communicate when overview metrics cannot be loaded;
 * - provide a retry action;
 * - prevent repeated retry clicks while refreshing;
 * - reuse the shared sisiMove ErrorState design-system primitive.
 *
 * Architectural boundaries:
 *
 * - This component does not perform API requests.
 * - This component does not manage server state.
 * - The parent component supplies the retry callback.
 * - The shared design system owns the visual error-state primitive.
 *
 * -----------------------------------------------------------------------------
 */

import { ErrorState } from '@/components/ui';


// =============================================================================
// Types
// =============================================================================

export interface OverviewErrorStateProps {
  /**
   * Optional error heading.
   */
  title?: string;

  /**
   * Supporting explanation shown to the administrator.
   */
  description?: string;

  /**
   * Callback used to retry loading the overview metrics.
   */
  onRetry: () => void;

  /**
   * Whether a retry is currently in progress.
   */
  isRetrying?: boolean;

  /**
   * Optional additional CSS classes.
   */
  className?: string;
}


// =============================================================================
// Component
// =============================================================================

export default function OverviewErrorState({
  title = 'Unable to load platform overview',
  description =
    'We could not retrieve the latest platform metrics. Check your connection and try again.',
  onRetry,
  isRetrying = false,
  className,
}: OverviewErrorStateProps) {
  return (
    <ErrorState
      title={title}
      description={description}
      className={className}
      retryAction={{
        label: isRetrying ? 'Retrying...' : 'Try again',
        onClick: onRetry,
        disabled: isRetrying,
        variant: 'primary',
      }}
    />
  );
}
