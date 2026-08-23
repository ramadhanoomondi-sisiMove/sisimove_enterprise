// -----------------------------------------------------------------------------
// Financial Account — Activate Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for activating an existing Financial Account.
//
// Responsibilities:
// - validate primitive HTTP request values;
// - remain independent of domain value objects;
// - provide the input required to construct
//   ActivateFinancialAccountCommand.
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
 * REST request DTO for activating a Financial Account.
 *
 * The account is identified using its public identifier.
 *
 * The activation timestamp may be supplied by the request boundary.
 * If the application layer chooses to use the current time instead,
 * that conversion should happen before constructing the command.
 *
 * The DTO intentionally contains primitive transport values only.
 */
export class ActivateFinancialAccountDto {
  // ===========================================================================
  // Financial Account
  // ===========================================================================

  /**
   * Public identity of the Financial Account to activate.
   */
  @IsString()
  @IsNotEmpty()
  public readonly accountPublicId!: string;

  // ===========================================================================
  // Activation Timestamp
  // ===========================================================================

  /**
   * Timestamp at which the account activation is performed.
   *
   * Transport representation is an ISO-8601 date-time string.
   *
   * The application boundary converts this value into a Date before creating
   * ActivateFinancialAccountCommand.
   */
  @IsString()
  @IsNotEmpty()
  public readonly activatedAt!: string;

  // ===========================================================================
  // Correlation
  // ===========================================================================

  /**
   * Correlation identifier for distributed tracing and domain-event
   * correlation.
   *
   * This value is supplied by the application/request boundary and is not
   * itself a domain lifecycle property.
   */
  @IsString()
  @IsNotEmpty()
  public readonly correlationId!: string;

  // ===========================================================================
  // Causation
  // ===========================================================================

  /**
   * Optional identifier of the command or event that caused this activation
   * request.
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public readonly causationId?: string;
}
