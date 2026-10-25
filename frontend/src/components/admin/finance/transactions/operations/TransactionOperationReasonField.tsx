'use client';

export interface TransactionOperationReasonFieldProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  maxLength?: number;
  error?: string;
  disabled?: boolean;
}

export function TransactionOperationReasonField({
  value,
  onChange,
  required = true,
  maxLength = 500,
  error,
  disabled = false,
}: TransactionOperationReasonFieldProps) {
  const id = 'transaction-operation-reason';
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-[var(--foreground)]">
        Reason {required ? <span aria-hidden="true">*</span> : null}
      </label>
      <p className="mt-1 text-sm text-[var(--foreground-muted)]">
        Provide an audit reason for this operation.
      </p>
      <textarea
        id={id}
        name="reason"
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
        required={required}
        maxLength={maxLength}
        rows={4}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        placeholder="Enter the reason for this operation…"
        className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--foreground-muted)] focus-visible:ring-2 focus-visible:ring-[var(--brand)] disabled:cursor-not-allowed disabled:opacity-50"
      />
      <div className="mt-1 flex items-start justify-between gap-3">
        {error ? (
          <p id={errorId} className="text-sm text-[var(--danger)]">{error}</p>
        ) : (
          <span className="text-xs text-[var(--foreground-muted)]">
            {required ? 'Required before confirming.' : 'Optional.'}
          </span>
        )}
        <span className="shrink-0 text-xs text-[var(--foreground-muted)]">
          {value.length}/{maxLength}
        </span>
      </div>
    </div>
  );
}

export default TransactionOperationReasonField;
