// -----------------------------------------------------------------------------
// Application Configuration
// -----------------------------------------------------------------------------

export const appConfig = {
  name: 'sisiMove',

  description: "A long-distance travel social network.",

  currency: {
    code: 'KES',
    locale: 'en-KE',
    symbol: 'KSh',
  },

  timezone: 'Africa/Nairobi',

  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100,
  },
} as const;