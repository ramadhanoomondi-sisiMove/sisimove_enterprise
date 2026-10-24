import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

export type FinancialAccountOperationFeedbackKind = 'success' | 'error' | 'info';

export interface FinancialAccountOperationFeedbackProps {
  kind: FinancialAccountOperationFeedbackKind;
  title: string;
  message: string;
  onDismiss?: () => void;
}

const styles = {
  success: {
    icon: CheckCircle2,
    border: 'border-[var(--success)]/30',
    iconTone: 'text-[var(--success)]',
  },
  error: {
    icon: AlertCircle,
    border: 'border-[var(--danger)]/30',
    iconTone: 'text-[var(--danger)]',
  },
  info: {
    icon: Info,
    border: 'border-[var(--border)]',
    iconTone: 'text-[var(--brand)]',
  },
} as const;

export function FinancialAccountOperationFeedback({
  kind, title, message, onDismiss,
}: FinancialAccountOperationFeedbackProps) {
  const config = styles[kind];
  const Icon = config.icon;

  return (
    <div role={kind === 'error' ? 'alert' : 'status'} aria-live={kind === 'error' ? 'assertive' : 'polite'} className={`flex items-start gap-3 rounded-xl border ${config.border} bg-[var(--surface)] p-4`}>
      <Icon size={19} className={`mt-0.5 shrink-0 ${config.iconTone}`} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-[var(--foreground)]">{title}</p>
        <p className="mt-1 whitespace-pre-wrap text-sm leading-5 text-[var(--foreground-secondary)]">{message}</p>
      </div>
      {onDismiss && <button type="button" onClick={onDismiss} className="shrink-0 rounded-lg px-2 py-1 text-xs font-medium text-[var(--foreground-muted)] hover:bg-[var(--background-muted)]">Dismiss</button>}
    </div>
  );
}

export default FinancialAccountOperationFeedback;
