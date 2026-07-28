// src/foundation/observability/tracing.interface.ts

export interface TraceContext {
  readonly traceId: string;
  readonly spanId: string;
  readonly parentSpanId?: string;
  readonly correlationId?: string;
}

export interface Tracing {
  startSpan(name: string, context?: Partial<TraceContext>): TraceContext;

  endSpan(spanId: string): void;

  addEvent(
    spanId: string,
    name: string,
    attributes?: Record<string, unknown>,
  ): void;

  setAttribute(spanId: string, key: string, value: unknown): void;
}
