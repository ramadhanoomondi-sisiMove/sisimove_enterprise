
import {
  Activity,
  CheckCircle2,
  Layers3,
  Network,
} from 'lucide-react';

import type { AdminProviderMetrics } from '@/features/admin/finance/providers';

import { ProviderMetricCard } from './ProviderMetricCard';

import { cn } from '@/foundation/utils/cn';

export interface ProviderMetricGridProps {
  metrics: AdminProviderMetrics;
  className?: string;
}

export function ProviderMetricGrid({
  metrics,
  className,
}: ProviderMetricGridProps) {
  const items = [
    {
      title: 'Total Providers',
      value: metrics.totalProviders,
      description: 'Registered payment providers',
      icon: <Layers3 className="h-5 w-5" />,
    },
    {
      title: 'Enabled Providers',
      value: metrics.enabledProviders,
      description: 'Providers currently enabled',
      icon: <CheckCircle2 className="h-5 w-5" />,
    },
    {
      title: 'Operational Providers',
      value: metrics.operationalProviders,
      description: 'Providers ready for operations',
      icon: <Activity className="h-5 w-5" />,
    },
    {
      title: 'Total Capabilities',
      value: metrics.totalCapabilities,
      description: 'Registered provider capabilities',
      icon: <Network className="h-5 w-5" />,
    },
  ];

  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4',
        className,
      )}
    >
      {items.map((item) => (
        <ProviderMetricCard
          key={item.title}
          title={item.title}
          value={item.value}
          description={item.description}
          icon={item.icon}
        />
      ))}
    </div>
  );
}
