// src/features/admin/boardings/shared/BoardingEmptyState.tsx

import { ClipboardList } from 'lucide-react';

import { EmptyState } from '@/components/ui/empty-state';

import type { EmptyStateProps } from '@/components/ui/empty-state';

export type BoardingEmptyStateProps = Pick<
  EmptyStateProps,
  | 'title'
  | 'description'
  | 'icon'
  | 'primaryAction'
  | 'secondaryAction'
  | 'className'
>;

export function BoardingEmptyState({
  title = 'No boarding records found',
  description = 'Boarding records will appear here when they are available.',
  icon,
  primaryAction,
  secondaryAction,
  className,
}: BoardingEmptyStateProps) {
  return (
    <EmptyState
      icon={icon ?? <ClipboardList className="h-6 w-6" />}
      title={title}
      description={description}
      primaryAction={primaryAction}
      secondaryAction={secondaryAction}
      className={className}
    />
  );
}
