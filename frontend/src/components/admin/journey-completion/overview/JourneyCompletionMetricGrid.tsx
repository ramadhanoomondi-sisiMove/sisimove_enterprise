
import { cn } from '@/foundation/utils/cn';
import {
  JourneyCompletionMetricCard,
  type JourneyCompletionMetricCardProps,
} from './JourneyCompletionMetricCard';

export interface JourneyCompletionMetricGridProps {
  metrics: JourneyCompletionMetricCardProps[];
  className?: string;
}

export function JourneyCompletionMetricGrid({
  metrics,
  className,
}: JourneyCompletionMetricGridProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4',
        className,
      )}
    >
      {metrics.map((metric) => (
        <JourneyCompletionMetricCard
          key={metric.label}
          {...metric}
        />
      ))}
    </div>
  );
}
