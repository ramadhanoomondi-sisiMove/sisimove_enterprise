
/**
 * -----------------------------------------------------------------------------
 * sisiMove — Asset Empty State
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Display clear empty states for asset collections and search results.
 * - Distinguish between no assets and no matching filtered assets.
 * - Reuse the shared design-system EmptyState primitive.
 * - Support optional actions without coupling to routing or API logic.
 *
 * -----------------------------------------------------------------------------
 */

import {
  FileSearch,
  FolderOpen,
  RotateCcw,
} from 'lucide-react';

import {
  EmptyState,
} from '@/components/ui/empty-state';

import type {
  EmptyStateAction,
} from '@/components/ui/empty-state';

// =============================================================================
// Types
// =============================================================================

export type AssetEmptyStateVariant =
  | 'empty'
  | 'no-results'
  | 'error';

export interface AssetEmptyStateProps {
  readonly variant?: AssetEmptyStateVariant;
  readonly title?: string;
  readonly description?: string;
  readonly onClearFilters?: () => void;
  readonly onRetry?: () => void;
  readonly primaryAction?: EmptyStateAction;
  readonly secondaryAction?: EmptyStateAction;
  readonly className?: string;
}

// =============================================================================
// Default Content
// =============================================================================

const EMPTY_STATE_CONTENT = {
  empty: {
    title: 'No assets available',
    description:
      'There are no assets to display yet. Assets will appear here when they are uploaded.',
    icon: FolderOpen,
  },

  'no-results': {
    title: 'No matching assets',
    description:
      'No assets match your current search or filters. Try changing your search criteria.',
    icon: FileSearch,
  },

  error: {
    title: 'Unable to load assets',
    description:
      'The asset collection could not be loaded. Please try again.',
    icon: FolderOpen,
  },
} as const;

// =============================================================================
// Component
// =============================================================================

export function AssetEmptyState({
  variant = 'empty',
  title,
  description,
  onClearFilters,
  onRetry,
  primaryAction,
  secondaryAction,
  className,
}: AssetEmptyStateProps) {
  const content = EMPTY_STATE_CONTENT[variant];
  const Icon = content.icon;

  const resolvedPrimaryAction =
    primaryAction ??
    (variant === 'no-results' && onClearFilters
      ? {
          label: 'Clear filters',
          variant: 'secondary' as const,
          leadingContent: <RotateCcw size={16} />,
          onClick: onClearFilters,
        }
      : variant === 'error' && onRetry
        ? {
            label: 'Try again',
            variant: 'primary' as const,
            leadingContent: <RotateCcw size={16} />,
            onClick: onRetry,
          }
        : undefined);

  return (
    <EmptyState
      icon={<Icon size={22} strokeWidth={1.8} />}
      title={title ?? content.title}
      description={description ?? content.description}
      primaryAction={resolvedPrimaryAction}
      secondaryAction={secondaryAction}
      className={className}
    />
  );
}

export default AssetEmptyState;
