// src/foundation/observability/metrics.interface.ts

export interface Metrics {
  increment(name: string, value?: number, tags?: Record<string, string>): void;

  gauge(name: string, value: number, tags?: Record<string, string>): void;

  histogram(name: string, value: number, tags?: Record<string, string>): void;

  timing(name: string, durationMs: number, tags?: Record<string, string>): void;
}
