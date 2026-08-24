// -----------------------------------------------------------------------------
// Financial Payment — Get Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for retrieving an existing Financial Payment aggregate
// by its public identity.
//
// Responsibilities:
// - validate primitive HTTP request values;
// - remain independent of domain value objects;
// - provide the input required to construct
//   GetFinancialPaymentQuery.
//
// Domain conversion belongs to the presentation/application boundary.
//
// The DTO does NOT:
// - access the repository;
// - access the aggregate;
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
 * REST request DTO for retrieving a Financial Payment by its public identity.
 *
 * The payment public identifier is supplied as a primitive transport value
 * and is converted into FinancialPaymentPublicId before constructing the
 * GetFinancialPaymentQuery.
 */
export class GetFinancialPaymentDto {
  // ===========================================================================
  // Financial Payment
  // ===========================================================================

  /**
   * Public identity of the Financial Payment to retrieve.
   */
  @IsString()
  @IsNotEmpty()
  public readonly paymentPublicId!: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetFinancialPaymentDto;
