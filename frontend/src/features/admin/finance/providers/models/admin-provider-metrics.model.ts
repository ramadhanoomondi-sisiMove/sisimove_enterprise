
// -----------------------------------------------------------------------------
// Admin — Payment Provider Metrics Model
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Provider Metrics
// -----------------------------------------------------------------------------

export interface AdminProviderMetrics {
  // ---------------------------------------------------------------------------
  // Provider Totals
  // ---------------------------------------------------------------------------

  totalProviders: number;
  enabledProviders: number;
  disabledProviders: number;

  // ---------------------------------------------------------------------------
  // Operational Readiness
  // ---------------------------------------------------------------------------

  operationalProviders: number;
  nonOperationalProviders: number;

  // ---------------------------------------------------------------------------
  // Provider Distribution
  // ---------------------------------------------------------------------------

  providersByType: Record<string, number>;
  providersByStatus: Record<string, number>;
  providersByEnvironment: Record<string, number>;

  // ---------------------------------------------------------------------------
  // Capability Totals
  // ---------------------------------------------------------------------------

  totalCapabilities: number;
  supportedCapabilities: number;
  enabledCapabilities: number;
  usableCapabilities: number;
}
