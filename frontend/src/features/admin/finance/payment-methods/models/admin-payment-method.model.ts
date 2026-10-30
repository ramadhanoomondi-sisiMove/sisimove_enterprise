
/**
 * Admin Payment Method — Model
 *
 * Public REST representation of a registered payment instrument.
 *
 * This model intentionally excludes domain entities, internal database IDs,
 * raw payment credentials, and provider authentication material.
 */

export interface AdminPaymentMethod {
  /** Public identity of the payment method. */
  publicId: string;

  /** Public identity of the owning Financial Account. */
  accountPublicId: string;

  /** Domain-defined payment method type. */
  type: string;

  /** Domain-defined external provider. */
  provider: string;

  /** Opaque provider-issued reference, when available. */
  providerReference?: string;

  /** Safe human-readable display label, when available. */
  displayName?: string;

  /** Last four characters of the masked instrument identifier. */
  lastFour?: string;

  /** Whether this is the default method for its account. */
  isDefault: boolean;

  /** Whether this method is active and usable. */
  isActive: boolean;

  /** ISO-8601 timestamp serialized by the REST API. */
  createdAt: string;

  /** ISO-8601 timestamp serialized by the REST API. */
  updatedAt: string;
}

/** Safe fields permitted in directory summaries. */
export type AdminPaymentMethodSummary = Pick<
  AdminPaymentMethod,
  | 'publicId'
  | 'accountPublicId'
  | 'type'
  | 'provider'
  | 'displayName'
  | 'lastFour'
  | 'isDefault'
  | 'isActive'
  | 'createdAt'
  | 'updatedAt'
>;

/** Identifies a payment method using its public API identity. */
export interface AdminPaymentMethodReference {
  publicId: AdminPaymentMethod['publicId'];
}
