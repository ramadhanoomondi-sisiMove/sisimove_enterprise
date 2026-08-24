// -----------------------------------------------------------------------------
// Financial Account — Get Financial Payments Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for retrieving Financial Payments associated with a
// Financial Account.
//
// FinancialAccountAggregate and FinancialPaymentAggregate remain separate
// aggregate roots.
//
// The DTO identifies the owning Financial Account through its public identity.
//
// Responsibilities:
// - validate primitive HTTP request values;
// - remain independent of domain value objects;
// - provide the input required to construct
//   GetFinancialAccountPaymentsQuery.
//
// Domain conversion belongs to the presentation/application boundary.
//
// The DTO does NOT:
// - access the Financial Payment repository;
// - access the Financial Payment aggregate;
// - enforce payment lifecycle rules;
// - expose persistence models.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

import { IsNotEmpty, IsString } from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST request DTO for retrieving Financial Payments associated with a
 * Financial Account.
 *
 * The account public identifier is supplied as a primitive transport value
 * and is converted into FinancialAccountPublicId before constructing the
 * GetFinancialAccountPaymentsQuery.
 */
export class GetFinancialAccountPaymentsDto {
  // ===========================================================================
  // Financial Account
  // ===========================================================================

  /**
   * Public identity of the Financial Account whose payments are retrieved.
   */
  @IsString()
  @IsNotEmpty()
  public readonly accountPublicId!: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetFinancialAccountPaymentsDto;
