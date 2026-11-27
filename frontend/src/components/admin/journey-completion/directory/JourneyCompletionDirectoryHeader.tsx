
import type { ReactNode } from 'react';
import { JourneyCompletionSectionHeader } from '../layout';

export interface JourneyCompletionDirectoryHeaderProps {
  totalCount: number;
  actions?: ReactNode;
  className?: string;
}

export function JourneyCompletionDirectoryHeader({
  totalCount,
  actions,
  className,
}: JourneyCompletionDirectoryHeaderProps) {
  return (
    <div className={className}>
      <JourneyCompletionSectionHeader
        title="Journey completions"
        description={`${totalCount.toLocaleString()} completion records`}
        actions={actions}
      />
    </div>
  );
}
