// -----------------------------------------------------------------------------
// Financial Payment Method — Get Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for retrieving an existing Financial Payment Method
// aggregate by its public identity.
//
// Responsibilities:
// - validate primitive HTTP request values;
// - remain independent of domain value objects;
// - provide the input required to construct
//   GetFinancialPaymentMethodQuery.
//
// Domain conversion belongs to the presentation/application boundary.
//
// The DTO does NOT:
// - access the repository;
// - access the aggregate;
// - enforce payment-method lifecycle rules;
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
 * REST request DTO for retrieving a Financial Payment Method by its
 * public identity.
 *
 * The payment-method public identifier is supplied as a primitive transport
 * value and is converted into FinancialPaymentMethodPublicId before
 * constructing the GetFinancialPaymentMethodQuery.
 */
export class GetFinancialPaymentMethodDto {
  // ===========================================================================
  // Financial Payment Method
  // ===========================================================================

  /**
   * Public identity of the Financial Payment Method to retrieve.
   */
  @IsString()
  @IsNotEmpty()
  public readonly paymentMethodPublicId!: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetFinancialPaymentMethodDto;
