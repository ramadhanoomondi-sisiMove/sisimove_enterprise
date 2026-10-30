
import { Card } from '@/components/ui';
import { cn } from '@/foundation/utils/cn';
import { ProviderSectionHeader } from '../layout';
import type { AdminProviderMetrics } from '@/features/admin/finance/providers';

export interface ProviderCapabilitySummaryProps {
  metrics: AdminProviderMetrics;
  className?: string;
}

interface CapabilityMetric {
  label: string;
  value: number;
  description: string;
}

export function ProviderCapabilitySummary({
  metrics,
  className,
}: ProviderCapabilitySummaryProps) {
  const capabilityMetrics: CapabilityMetric[] = [
    {
      label: 'Total capabilities',
      value: metrics.totalCapabilities,
      description: 'Registered across all providers',
    },
    {
      label: 'Supported',
      value: metrics.supportedCapabilities,
      description: 'Capabilities supported by providers',
    },
    {
      label: 'Enabled',
      value: metrics.enabledCapabilities,
      description: 'Capabilities currently enabled',
    },
    {
      label: 'Usable',
      value: metrics.usableCapabilities,
      description: 'Capabilities available for use',
    },
  ];

  return (
    <Card
      padding="lg"
      className={cn('flex h-full flex-col gap-6', className)}
    >
      <ProviderSectionHeader
        title="Capability Summary"
        description="Overview of payment capabilities across all providers."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {capabilityMetrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-xl border border-[var(--border)] bg-[var(--background-muted)] p-4"
          >
            <p className="text-sm font-medium text-muted-foreground">
              {metric.label}
            </p>

            <p className="mt-2 text-2xl font-semibold tabular-nums text-foreground">
              {metric.value}
            </p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {metric.description}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
