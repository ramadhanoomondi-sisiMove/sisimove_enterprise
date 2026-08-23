// -----------------------------------------------------------------------------
// Financial Account Transactions — Get Query DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for retrieving Financial Transactions associated with an
// existing Financial Account.
//
// This DTO belongs to the presentation boundary and therefore contains only
// transport-level primitive values.
//
// Conversion from the primitive accountPublicId into the domain
// FinancialAccountPublicId value object belongs to the controller/application
// boundary.
//
// The DTO intentionally does NOT contain:
// - transaction data;
// - account balance;
// - lifecycle state;
// - filtering rules;
// - pagination;
// - ordering;
// - projection.
//
// Those concerns belong to the application query/use-case layer.
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
 * REST request DTO for retrieving transactions associated with a Financial
 * Account.
 *
 * Transport value:
 *
 * - accountPublicId
 *
 * The application boundary converts accountPublicId into:
 *
 * - FinancialAccountPublicId
 */
export class GetFinancialAccountTransactionsDto {
  // ===========================================================================
  // Financial Account Public ID
  // ===========================================================================

  /**
   * Public identity of the Financial Account whose transactions are
   * requested.
   *
   * This identifies the Financial Account aggregate and is converted into
   * FinancialAccountPublicId before constructing the application query.
   */
  @IsString()
  @IsNotEmpty()
  public readonly accountPublicId!: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetFinancialAccountTransactionsDto;
