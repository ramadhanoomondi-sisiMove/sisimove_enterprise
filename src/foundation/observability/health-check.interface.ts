// src/foundation/observability/health-check.interface.ts

export interface HealthCheckResult {
  readonly service: string;
  readonly status: 'UP' | 'DOWN';
  readonly timestamp: Date;
  readonly details?: Readonly<Record<string, unknown>>;
}

export interface HealthCheck {
  check(): Promise<HealthCheckResult>;
}
