// -----------------------------------------------------------------------------
// Financial Account — Close Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for permanently closing an existing Financial Account.
//
// Responsibilities:
// - validate primitive HTTP request values;
// - remain independent of domain value objects;
// - provide the input required to construct
//   CloseFinancialAccountCommand.
//
// Domain conversion belongs to the presentation/application boundary.
//
// The DTO does NOT:
// - change account lifecycle state;
// - enforce aggregate invariants;
// - create domain events;
// - load the FinancialAccountAggregate;
// - move or settle remaining funds.
//
// Those responsibilities belong to the application/domain workflows.
//
// Remaining funds are intentionally NOT part of this request.
// Any required movement of funds belongs to the appropriate financial
// workflow/aggregate.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST request DTO for permanently closing a Financial Account.
 *
 * The account is identified using its public identifier.
 *
 * The closure timestamp is transported as an ISO-8601 date-time string
 * and is converted to a Date before constructing
 * CloseFinancialAccountCommand.
 *
 * The DTO intentionally contains primitive transport values only.
 */
export class CloseFinancialAccountDto {
  // ===========================================================================
  // Financial Account
  // ===========================================================================

  /**
   * Public identity of the Financial Account to close.
   */
  @IsString()
  @IsNotEmpty()
  public readonly accountPublicId!: string;

  // ===========================================================================
  // Closure Timestamp
  // ===========================================================================

  /**
   * Timestamp at which the account closure is performed.
   *
   * Transport representation is an ISO-8601 date-time string.
   */
  @IsString()
  @IsNotEmpty()
  public readonly closedAt!: string;

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
   * Optional identifier of the command or event that caused this closure
   * request.
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public readonly causationId?: string;
}
