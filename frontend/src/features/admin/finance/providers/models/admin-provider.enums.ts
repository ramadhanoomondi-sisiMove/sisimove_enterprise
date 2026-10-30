
export const ADMIN_PROVIDER_TYPES = [
  'MOBILE_MONEY',
  'BANK',
  'CARD_PROCESSOR',
  'PAYMENT_GATEWAY',
  'DIGITAL_WALLET',
  'OTHER',
] as const;

export type AdminProviderType =
  (typeof ADMIN_PROVIDER_TYPES)[number];


export const ADMIN_PROVIDER_STATUSES = [
  'NOT_CONFIGURED',
  'CONFIGURING',
  'READY',
  'DEGRADED',
  'SUSPENDED',
] as const;

export type AdminProviderStatus =
  (typeof ADMIN_PROVIDER_STATUSES)[number];


export const ADMIN_PROVIDER_ENVIRONMENTS = [
  'SANDBOX',
  'PRODUCTION',
] as const;

export type AdminProviderEnvironment =
  (typeof ADMIN_PROVIDER_ENVIRONMENTS)[number];


export const ADMIN_PROVIDER_CAPABILITY_TYPES = [
  'INITIATE_PAYMENT',
  'VERIFY_PAYMENT',
  'QUERY_PAYMENT',
  'REFUND_PAYMENT',
  'INITIATE_DISBURSEMENT',
  'VERIFY_DISBURSEMENT',
  'QUERY_BALANCE',
  'WEBHOOKS',
] as const;

export type AdminProviderCapabilityType =
  (typeof ADMIN_PROVIDER_CAPABILITY_TYPES)[number];
