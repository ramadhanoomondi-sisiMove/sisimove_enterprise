// -----------------------------------------------------------------------------
// Feature Flags
// -----------------------------------------------------------------------------

export const featureFlags = {
  journeyDemand: true,
  wallet: true,
  messaging: true,
  notifications: true,
  support: true,

  analytics: true,

  experimental: {
    newDiscoveryFeed: false,
  },
} as const;