// -----------------------------------------------------------------------------
// Financial Payment Method — Get Default Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for retrieving the default Financial Payment Method
// belonging to a Financial Account.
//
// The DTO identifies the owning Financial Account through its public identity.
//
// Responsibilities:
// - validate primitive HTTP request values;
// - remain independent of domain value objects;
// - provide the input required to construct
//   GetDefaultFinancialPaymentMethodQuery.
//
// Domain conversion belongs to the presentation/application boundary.
//
// The DTO does NOT:
// - access the Financial Payment Method repository;
// - access the Financial Payment Method aggregate;
// - enforce default-payment-method invariants;
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
 * REST request DTO for retrieving the default Financial Payment Method
 * belonging to a Financial Account.
 *
 * The account public identifier is supplied as a primitive transport value
 * and is converted into FinancialAccountPublicId before constructing the
 * GetDefaultFinancialPaymentMethodQuery.
 */
export class GetDefaultFinancialPaymentMethodDto {
  // ===========================================================================
  // Financial Account
  // ===========================================================================

  /**
   * Public identity of the Financial Account whose default payment method
   * is requested.
   */
  @IsString()
  @IsNotEmpty()
  public readonly accountPublicId!: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetDefaultFinancialPaymentMethodDto;