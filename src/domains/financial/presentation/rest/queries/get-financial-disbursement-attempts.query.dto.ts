// -----------------------------------------------------------------------------
// Financial Disbursement — Get Attempts Query DTO
// -----------------------------------------------------------------------------
//
// Presentation-layer request DTO for retrieving the execution attempts
// belonging to an existing Financial Disbursement.
//
// The DTO carries the raw transport-level public identity of the owning
// Financial Disbursement.
//
// DTO responsibilities:
//
// - Validate incoming transport data.
// - Represent the API request/query shape.
// - Keep transport concerns outside the domain.
//
// The application layer converts this DTO into:
//
// GetFinancialDisbursementAttemptsQuery
//
// FinancialDisbursementAttemptEntity instances remain aggregate-owned entities
// and are therefore not addressed as independent aggregate roots.
//
// This DTO does NOT:
//
// - access persistence directly;
// - expose persistence models;
// - contain internal entity identifiers;
// - mutate the Financial Disbursement aggregate;
// - execute provider operations;
// - modify Financial Account balances;
// - create or post Financial Transactions.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Swagger
// -----------------------------------------------------------------------------

import { ApiProperty } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

import { IsNotEmpty, IsString } from 'class-validator';

// =============================================================================
// DTO
// =============================================================================

export class GetFinancialDisbursementAttemptsQueryDto {
  // ===========================================================================
  // Financial Disbursement Public Identity
  // ===========================================================================

  @ApiProperty({
    description:
      'Public identity of the Financial Disbursement whose execution attempts should be retrieved.',
    example: '01J8Q8A1B2C3D4E5F6G7H8I9J0',
  })
  @IsString()
  @IsNotEmpty()
  readonly disbursementPublicId!: string;
}
