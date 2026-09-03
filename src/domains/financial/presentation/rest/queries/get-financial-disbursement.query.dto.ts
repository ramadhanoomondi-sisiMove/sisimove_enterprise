// -----------------------------------------------------------------------------
// Financial Disbursement — Get Query DTO
// -----------------------------------------------------------------------------
//
// Presentation-layer request DTO for retrieving an existing Financial
// Disbursement aggregate.
//
// The DTO carries the raw transport-level public identity.
//
// DTO responsibilities:
//
// - Validate incoming transport data.
// - Represent the API request/query shape.
// - Keep transport concerns outside the domain.
//
// The application layer converts this DTO into:
//
// GetFinancialDisbursementQuery
//
// Domain value objects are intentionally NOT created inside this DTO.
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

export class GetFinancialDisbursementQueryDto {
  // ===========================================================================
  // Financial Disbursement Public Identity
  // ===========================================================================

  @ApiProperty({
    description: 'Public identity of the Financial Disbursement to retrieve.',
    example: '01J8Q8A1B2C3D4E5F6G7H8I9J0',
  })
  @IsString()
  @IsNotEmpty()
  readonly disbursementPublicId!: string;
}
