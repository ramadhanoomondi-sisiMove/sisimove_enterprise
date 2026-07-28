// src/foundation/logging/log-context.ts

export interface LogContext {
  readonly correlationId?: string;
  readonly causationId?: string;
  readonly userId?: string;
  readonly publicId?: string;
  readonly aggregateId?: string;
  readonly aggregateType?: string;
  readonly operation?: string;
  readonly metadata?: Readonly<Record<string, unknown>>;
}
