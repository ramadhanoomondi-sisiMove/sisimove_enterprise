
import {
  EmptyState,
  type EmptyStateProps,
} from '@/components/ui';

export interface JourneyCompletionEmptyStateProps
  extends Omit<EmptyStateProps, 'title'> {
  title?: string;
}

export function JourneyCompletionEmptyState({
  title = 'No journey completions found',
  description = 'There are no journey completion records to display.',
  ...props
}: JourneyCompletionEmptyStateProps) {
  return (
    <EmptyState
      {...props}
      title={title}
      description={description}
    />
  );
}
