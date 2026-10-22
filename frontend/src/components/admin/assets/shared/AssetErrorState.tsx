
/**
 * -----------------------------------------------------------------------------
 * sisiMove — Asset Error State
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Present asset-loading and asset-operation errors consistently.
 * - Provide contextual default messaging.
 * - Support retry and secondary actions.
 * - Reuse the shared design-system ErrorState primitive.
 *
 * Security:
 * - Never expose raw backend errors or sensitive storage details by default.
 *
 * -----------------------------------------------------------------------------
 */

import {
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

import {
  ErrorState,
} from '@/components/ui/error-state';

import type {
  ErrorStateAction,
} from '@/components/ui/error-state';

// =============================================================================
// Types
// =============================================================================

export type AssetErrorStateVariant =
  | 'load'
  | 'load-one'
  | 'operation'
  | 'permission';

export interface AssetErrorStateProps {
  readonly variant?: AssetErrorStateVariant;
  readonly title?: string;
  readonly description?: string;
  readonly onRetry?: () => void;
  readonly onGoBack?: () => void;
  readonly retrying?: boolean;
  readonly retryLabel?: string;
  readonly secondaryAction?: ErrorStateAction;
  readonly className?: string;
}

// =============================================================================
// Default Content
// =============================================================================

interface AssetErrorContent {
  readonly title: string;
  readonly description: string;
}

const ASSET_ERROR_CONTENT: Record<
  AssetErrorStateVariant,
  AssetErrorContent
> = {
  load: {
    title: 'Unable to load assets',
    description:
      'The asset collection could not be loaded. Check your connection and try again.',
  },

  'load-one': {
    title: 'Unable to load asset',
    description:
      'The asset details could not be retrieved. It may be unavailable or you may not have permission to view it.',
  },

  operation: {
    title: 'Asset operation failed',
    description:
      'The requested operation could not be completed. Please try again.',
  },

  permission: {
    title: 'Access denied',
    description:
      'You do not have permission to access this asset or perform this operation.',
  },
};

// =============================================================================
// Component
// =============================================================================

export function AssetErrorState({
  variant = 'load',
  title,
  description,
  onRetry,
  onGoBack,
  retrying = false,
  retryLabel = 'Try again',
  secondaryAction,
  className,
}: AssetErrorStateProps) {
  const content = ASSET_ERROR_CONTENT[variant];

  const retryAction: ErrorStateAction | undefined = onRetry
    ? {
        label: retrying ? 'Retrying…' : retryLabel,
        leadingContent: <RefreshCw size={16} />,
        variant: 'primary',
        onClick: onRetry,
        disabled: retrying,
      }
    : undefined;

  const backAction: ErrorStateAction | undefined = onGoBack
    ? {
        label: 'Go back',
        variant: 'outline',
        onClick: onGoBack,
      }
    : undefined;

  return (
    <ErrorState
      icon={<AlertTriangle size={22} strokeWidth={1.8} />}
      title={title ?? content.title}
      description={description ?? content.description}
      retryAction={retryAction}
      secondaryAction={secondaryAction ?? backAction}
      className={className}
    />
  );
}

export default AssetErrorState;
