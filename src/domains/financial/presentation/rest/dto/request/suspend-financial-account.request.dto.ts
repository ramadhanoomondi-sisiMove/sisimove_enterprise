// -----------------------------------------------------------------------------
// Financial Account — Suspend Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for suspending an existing Financial Account.
//
// Responsibilities:
// - validate primitive HTTP request values;
// - remain independent of domain value objects;
// - provide the input required to construct
//   SuspendFinancialAccountCommand.
//
// Domain conversion belongs to the presentation/application boundary.
//
// The DTO does NOT:
// - change account lifecycle state;
// - enforce aggregate invariants;
// - create domain events;
// - load the FinancialAccountAggregate.
//
// Those responsibilities belong to the application handler and aggregate.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST request DTO for suspending a Financial Account.
 *
 * The account is identified using its public identifier.
 *
 * The suspension timestamp is transported as an ISO-8601 date-time string
 * and is converted to a Date before constructing
 * SuspendFinancialAccountCommand.
 *
 * The DTO intentionally contains primitive transport values only.
 */
export class SuspendFinancialAccountDto {
  // ===========================================================================
  // Financial Account
  // ===========================================================================

  /**
   * Public identity of the Financial Account to suspend.
   */
  @IsString()
  @IsNotEmpty()
  public readonly accountPublicId!: string;

  // ===========================================================================
  // Suspension Timestamp
  // ===========================================================================

  /**
   * Timestamp at which the account suspension is performed.
   *
   * Transport representation is an ISO-8601 date-time string.
   */
  @IsString()
  @IsNotEmpty()
  public readonly suspendedAt!: string;

  // ===========================================================================
  // Correlation
  // ===========================================================================

  /**
   * Correlation identifier for distributed tracing and domain-event
   * correlation.
   *
   * This value is supplied by the application/request boundary.
   */
  @IsString()
  @IsNotEmpty()
  public readonly correlationId!: string;

  // ===========================================================================
  // Causation
  // ===========================================================================

  /**
   * Optional identifier of the command or event that caused this suspension
   * request.
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public readonly causationId?: string;
}
