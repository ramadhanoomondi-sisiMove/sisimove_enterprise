// -----------------------------------------------------------------------------
// Financial Account — Get Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for retrieving an existing Financial Account.
//
// Responsibilities:
// - validate primitive HTTP request values;
// - remain independent of domain value objects;
// - provide the input required to construct GetFinancialAccountQuery.
//
// Domain conversion belongs to the presentation/application boundary.
//
// The DTO does NOT:
// - load the FinancialAccountAggregate;
// - access the repository;
// - enforce domain invariants;
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
 * REST request DTO for retrieving a Financial Account by public identity.
 *
 * The public identifier is supplied as a primitive transport value and is
 * converted into FinancialAccountPublicId before constructing the query.
 */
export class GetFinancialAccountDto {
  // ===========================================================================
  // Financial Account
  // ===========================================================================

  /**
   * Public identity of the Financial Account to retrieve.
   */
  @IsString()
  @IsNotEmpty()
  public readonly accountPublicId!: string;
}
