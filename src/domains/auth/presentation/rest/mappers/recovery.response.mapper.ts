// -----------------------------------------------------------------------------
// Recovery — Response Mapper
// -----------------------------------------------------------------------------
//
// Maps a RecoveryAggregate into a transport-safe response representation.
//
// Aggregate:
//
// RecoveryAggregate
// └── RecoveryEntity
//
// Responsibilities:
//
// - Convert Recovery domain state into a response DTO.
// - Expose public identities only.
// - Expose lifecycle state and audit timestamps.
// - Expose dynamic usability/expiry state.
// - Preserve security boundaries.
//
// IMPORTANT:
//
// - Never expose recoveryTokenHash.
// - Never expose raw recovery tokens.
// - Never expose internal persistence identity.
// - Never perform cross-aggregate lookups.
// - Never mutate the aggregate.
// - Dynamic expiry is evaluated at mapping time.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { RecoveryAggregate } from '../../../domain/aggregates/recovery.aggregate';

// -----------------------------------------------------------------------------
// Response DTO
// -----------------------------------------------------------------------------

export interface RecoveryResponse {
  /**
   * Public identity of the Recovery.
   */
  publicId: string;

  /**
   * Public identity reference of the associated Identity.
   */
  identityPublicId: string;

  /**
   * Recovery workflow type.
   */
  type: string;

  /**
   * Persisted Recovery lifecycle status.
   */
  status: string;

  /**
   * Whether a recovery-token hash is currently persisted.
   *
   * This is intentionally a boolean rather than the hash itself.
   */
  hasRecoveryToken: boolean;

  /**
   * Timestamp at which the Recovery was requested.
   */
  requestedAt: string;

  /**
   * Timestamp at which the Recovery expires.
   */
  expiresAt: string;

  /**
   * Whether the Recovery has dynamically expired.
   *
   * This may be true while persisted status is still PENDING.
   */
  isExpired: boolean;

  /**
   * Whether the Recovery is currently usable.
   *
   * This evaluates persisted lifecycle status together with dynamic expiry.
   */
  isUsable: boolean;

  /**
   * Whether the Recovery is currently not usable.
   */
  isNotUsable: boolean;

  /**
   * Timestamp at which the Recovery was completed.
   */
  completedAt: string | undefined;

  /**
   * Timestamp at which the Recovery was cancelled.
   */
  cancelledAt: string | undefined;

  /**
   * Recovery creation timestamp.
   */
  createdAt: string;

  /**
   * Recovery last-update timestamp.
   */
  updatedAt: string;
}

// =============================================================================
// Mapper
// =============================================================================

/**
 * Maps RecoveryAggregate domain state into a transport-safe response.
 *
 * The mapper is intentionally security-conscious:
 *
 * RecoveryAggregate
 *      │
 *      ├── publicId
 *      ├── identityPublicId
 *      ├── type
 *      ├── status
 *      ├── lifecycle timestamps
 *      └── derived lifecycle state
 *
 *      ✗ recoveryTokenHash
 *      ✗ raw recovery token
 *      ✗ internal persistence identity
 */
export class RecoveryResponseMapper {
  // ===========================================================================
  // Aggregate → Response
  // ===========================================================================

  /**
   * Maps a Recovery aggregate to a response representation.
   *
   * Expiry and usability are evaluated against the current time at mapping
   * time because they are dynamic domain properties.
   */
  public static toResponse(
    aggregate: RecoveryAggregate,
    referenceDate: Date = new Date(),
  ): RecoveryResponse {
    RecoveryResponseMapper.ensureAggregate(aggregate);

    RecoveryResponseMapper.ensureValidDate(
      referenceDate,
      'Recovery response reference date must be valid.',
    );

    return {
      publicId: aggregate.publicId.value,

      identityPublicId: aggregate.identityPublicId.value,

      type: aggregate.type.value,

      status: aggregate.status.value,

      hasRecoveryToken: aggregate.hasRecoveryToken(),

      requestedAt: aggregate.requestedAt.value.toISOString(),

      expiresAt: aggregate.expiresAt.value.toISOString(),

      isExpired: aggregate.isExpired(referenceDate),

      isUsable: aggregate.isUsable(referenceDate),

      isNotUsable: aggregate.isNotUsable(referenceDate),

      completedAt: aggregate.completedAt?.value.toISOString(),

      cancelledAt: aggregate.cancelledAt?.value.toISOString(),

      createdAt: aggregate.createdAt.toISOString(),

      updatedAt: aggregate.updatedAt.toISOString(),
    };
  }

  // ===========================================================================
  // Collection → Response
  // ===========================================================================

  /**
   * Maps multiple Recovery aggregates to response representations.
   */
  public static toResponseList(
    aggregates: readonly RecoveryAggregate[],
    referenceDate: Date = new Date(),
  ): RecoveryResponse[] {
    RecoveryResponseMapper.ensureValidDate(
      referenceDate,
      'Recovery response reference date must be valid.',
    );

    return aggregates.map((aggregate) =>
      RecoveryResponseMapper.toResponse(aggregate, referenceDate),
    );
  }

  // ===========================================================================
  // Guards
  // ===========================================================================

  /**
   * Ensures that a Recovery aggregate was supplied.
   */
  private static ensureAggregate(aggregate: RecoveryAggregate): void {
    if (aggregate === undefined || aggregate === null) {
      throw new TypeError('Recovery aggregate is required.');
    }
  }

  /**
   * Ensures that a Date is valid.
   */
  private static ensureValidDate(value: Date, message: string): void {
    if (!(value instanceof Date) || !Number.isFinite(value.getTime())) {
      throw new TypeError(message);
    }
  }
}
