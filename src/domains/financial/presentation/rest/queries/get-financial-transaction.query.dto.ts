// -----------------------------------------------------------------------------
// Financial Transaction — Get Query DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for retrieving an existing Financial Transaction.
//
// This DTO belongs to the presentation boundary and therefore contains only
// transport-level primitive values.
//
// Conversion from the primitive transactionPublicId into the domain
// FinancialTransactionPublicId value object belongs to the controller/
// application boundary.
//
// The DTO does NOT contain:
// - transaction status;
// - transaction amount;
// - transaction entries;
// - source/destination accounts;
// - lifecycle timestamps;
// - accounting information.
//
// Those values belong to the Financial Transaction domain and are resolved
// by the application query handler.
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
 * REST request DTO for retrieving a Financial Transaction.
 *
 * Transport value:
 *
 * - transactionPublicId
 *
 * The application boundary converts transactionPublicId into:
 *
 * - FinancialTransactionPublicId
 */
export class GetFinancialTransactionDto {
  // ===========================================================================
  // Financial Transaction Public ID
  // ===========================================================================

  /**
   * Public identity of the Financial Transaction to retrieve.
   *
   * This identifies the Financial Transaction aggregate.
   */
  @IsString()
  @IsNotEmpty()
  public readonly transactionPublicId!: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetFinancialTransactionDto;
