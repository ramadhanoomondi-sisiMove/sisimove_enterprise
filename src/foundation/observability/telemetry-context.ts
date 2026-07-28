// src/foundation/observability/telemetry-context.ts

export interface TelemetryContext {
  readonly correlationId: string;
  readonly traceId?: string;
  readonly spanId?: string;
  readonly userId?: string;
  readonly publicId?: string;
  readonly aggregateId?: string;
  readonly aggregateType?: string;
  readonly operation?: string;
}
