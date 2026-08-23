// -----------------------------------------------------------------------------
// Financial Account Balance — Get Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for retrieving the balance of an existing
// Financial Account.
//
// The balance is aggregate-owned:
//
// FinancialAccountAggregate
// ├── FinancialAccountEntity
// └── FinancialAccountBalanceEntity
//
// The DTO identifies the owning Financial Account rather than treating the
// balance as an independent aggregate.
//
// Responsibilities:
// - validate primitive HTTP request values;
// - remain independent of domain value objects;
// - provide the input required to construct
//   GetFinancialAccountBalanceQuery.
//
// Domain conversion belongs to the presentation/application boundary.
//
// The DTO does NOT:
// - access the balance entity directly;
// - access the repository;
// - enforce balance invariants;
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
 * REST request DTO for retrieving the balance of a Financial Account.
 *
 * The account public identifier is supplied as a primitive transport value
 * and is converted into FinancialAccountPublicId before constructing the
 * query.
 */
export class GetFinancialAccountBalanceDto {
  // ===========================================================================
  // Financial Account
  // ===========================================================================

  /**
   * Public identity of the Financial Account whose balance is requested.
   */
  @IsString()
  @IsNotEmpty()
  public readonly accountPublicId!: string;
}
