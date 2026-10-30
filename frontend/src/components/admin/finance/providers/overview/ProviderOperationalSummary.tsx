
import { Activity, CheckCircle2, CircleAlert, Power } from 'lucide-react';
import { Card } from '@/components/ui';
import { cn } from '@/foundation/utils/cn';
import { ProviderSectionHeader } from '../layout';
import type { AdminProviderMetrics } from '@/features/admin/finance/providers';

export interface ProviderOperationalSummaryProps {
  metrics: AdminProviderMetrics;
  className?: string;
}

interface OperationalMetric {
  label: string;
  value: number;
  description: string;
  icon: React.ReactNode;
}

export function ProviderOperationalSummary({
  metrics,
  className,
}: ProviderOperationalSummaryProps) {
  const operationalMetrics: OperationalMetric[] = [
    {
      label: 'Operational',
      value: metrics.operationalProviders,
      description: 'Providers currently operational',
      icon: <CheckCircle2 className="h-5 w-5" />,
    },
    {
      label: 'Non-operational',
      value: metrics.nonOperationalProviders,
      description: 'Providers requiring attention',
      icon: <CircleAlert className="h-5 w-5" />,
    },
    {
      label: 'Enabled',
      value: metrics.enabledProviders,
      description: 'Providers enabled in the system',
      icon: <Power className="h-5 w-5" />,
    },
    {
      label: 'Disabled',
      value: metrics.disabledProviders,
      description: 'Providers currently disabled',
      icon: <Activity className="h-5 w-5" />,
    },
  ];

  return (
    <Card
      padding="lg"
      className={cn('flex h-full flex-col gap-6', className)}
    >
      <ProviderSectionHeader
        title="Operational Overview"
        description="Monitor provider availability and enablement."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {operationalMetrics.map((metric) => (
          <div
            key={metric.label}
            className="flex items-start gap-4 rounded-xl border border-[var(--border)] p-4"
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--background-muted)] text-[var(--foreground-secondary)]"
              aria-hidden="true"
            >
              {metric.icon}
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium text-muted-foreground">
                {metric.label}
              </p>

              <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
                {metric.value}
              </p>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {metric.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
