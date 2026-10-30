
import type { ReactNode } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Info,
  TriangleAlert,
  X,
} from 'lucide-react';

import { cn } from '@/foundation/utils/cn';

// -----------------------------------------------------------------------------
// sisiMove Admin — Provider Inline Alert
// -----------------------------------------------------------------------------

export type ProviderInlineAlertVariant =
  | 'success'
  | 'error'
  | 'warning'
  | 'info';

export interface ProviderInlineAlertProps {
  variant?: ProviderInlineAlertVariant;
  title?: string;
  description?: string;
  children?: ReactNode;
  action?: ReactNode;
  onDismiss?: () => void;
  className?: string;
}

// -----------------------------------------------------------------------------
// Alert Configuration
// -----------------------------------------------------------------------------

const ALERT_STYLES: Record<
  ProviderInlineAlertVariant,
  {
    container: string;
    icon: string;
    title: string;
    Icon: typeof Info;
    role: 'alert' | 'status';
  }
> = {
  success: {
    container:
      'border-emerald-200 bg-emerald-50 text-emerald-900',
    icon: 'text-emerald-600',
    title: 'text-emerald-900',
    Icon: CheckCircle2,
    role: 'status',
  },
  error: {
    container:
      'border-red-200 bg-red-50 text-red-900',
    icon: 'text-red-600',
    title: 'text-red-900',
    Icon: AlertCircle,
    role: 'alert',
  },
  warning: {
    container:
      'border-amber-200 bg-amber-50 text-amber-900',
    icon: 'text-amber-600',
    title: 'text-amber-900',
    Icon: TriangleAlert,
    role: 'alert',
  },
  info: {
    container:
      'border-blue-200 bg-blue-50 text-blue-900',
    icon: 'text-blue-600',
    title: 'text-blue-900',
    Icon: Info,
    role: 'status',
  },
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function ProviderInlineAlert({
  variant = 'info',
  title,
  description,
  children,
  action,
  onDismiss,
  className,
}: ProviderInlineAlertProps) {
  const config = ALERT_STYLES[variant];
  const Icon = config.Icon;

  return (
    <div
      role={config.role}
      className={cn(
        'flex items-start gap-3 rounded-lg border p-4',
        config.container,
        className,
      )}
    >
      <Icon
        aria-hidden="true"
        className={cn(
          'mt-0.5 h-5 w-5 shrink-0',
          config.icon,
        )}
      />

      <div className="min-w-0 flex-1 space-y-1">
        {title && (
          <p
            className={cn(
              'text-sm font-semibold',
              config.title,
            )}
          >
            {title}
          </p>
        )}

        {description && (
          <p className="text-sm leading-5 opacity-90">
            {description}
          </p>
        )}

        {children && (
          <div className="text-sm leading-5">
            {children}
          </div>
        )}

        {action && (
          <div className="pt-2">
            {action}
          </div>
        )}
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss alert"
          className={cn(
            'shrink-0 rounded-md p-1 transition-colors',
            'hover:bg-black/5 focus-visible:outline-none',
            'focus-visible:ring-2 focus-visible:ring-current',
          )}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
