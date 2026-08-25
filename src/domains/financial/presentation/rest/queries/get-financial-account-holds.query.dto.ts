// -----------------------------------------------------------------------------
// Financial Account Hold — Get Query Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for retrieving the ACTIVE Financial Account Holds belonging
// to a Financial Account.
//
// Query behavior:
//
//     FinancialAccountPublicId
//             │
//             ▼
//     FinancialAccountHoldRepository
//             │
//             ▼
//     ACTIVE FinancialAccountHoldAggregate[]
//
// A Financial Account may have multiple ACTIVE holds simultaneously.
//
// This DTO contains transport-level primitives only.
//
// DTO-to-domain conversion belongs to the presentation/application boundary.
//
// This DTO does NOT:
//
// - modify Financial Account Holds;
// - perform hold lifecycle transitions;
// - create or execute Financial Transactions;
// - modify Financial Account balances;
// - create domain events;
// - manage payments;
// - manage withdrawals;
// - manage settlements;
// - manage disbursements;
// - perform accounting.
//
// RELEASED, CAPTURED and CANCELLED holds are excluded by the repository
// query.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS Swagger
// -----------------------------------------------------------------------------

import { ApiProperty } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Class Transformer
// -----------------------------------------------------------------------------

import { Transform, type TransformFnParams } from 'class-transformer';

// -----------------------------------------------------------------------------
// Class Validator
// -----------------------------------------------------------------------------

import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST request DTO for retrieving ACTIVE Financial Account Holds belonging
 * to a Financial Account.
 *
 * The supplied account public identifier is converted into the
 * FinancialAccountPublicId value object before constructing the application
 * query.
 */
export class GetFinancialAccountHoldsQueryDto {
  // ===========================================================================
  // Financial Account
  // ===========================================================================

  @ApiProperty({
    example: 'FIA-WQC6Y7G',
    description:
      'Public identifier of the Financial Account whose ACTIVE holds should be retrieved.',
  })
  @Transform(trimString)
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  @Matches(/^FIA-[A-Z0-9]+$/, {
    message:
      'accountPublicId must be a valid Financial Account public identifier.',
  })
  accountPublicId!: string;
}
