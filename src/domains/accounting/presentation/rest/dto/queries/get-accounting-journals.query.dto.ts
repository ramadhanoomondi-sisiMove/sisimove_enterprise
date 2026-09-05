// -----------------------------------------------------------------------------
// Accounting — Get Accounting Journals Query DTO
// -----------------------------------------------------------------------------
//
// REST query DTO for retrieving Accounting Journal aggregates.
//
// User-facing intent:
//
//     Get Accounting Journals
//
// Optional filters:
//
// - Accounting Journal status;
// - accounting currency;
// - Accounting Period public identifier.
//
// When no filters are supplied, all Accounting Journals are requested.
//
// Public identity is used for the Accounting Period reference. Internal
// persistence identifiers are never accepted by the transport boundary.
//
// This DTO does NOT:
//
// - load Accounting Journals;
// - load Accounting Periods;
// - validate Accounting Period existence;
// - validate Accounting Period state;
// - access Prisma;
// - calculate or mutate journal balances;
// - modify journals;
// - authorize the caller;
// - publish domain events.
//
// The application layer maps primitive transport values into the corresponding
// Accounting domain value objects before constructing
// GetAccountingJournalsQuery.
//
// -----------------------------------------------------------------------------
//
// Examples:
//
//     GET /accounting/journals
//
//     GET /accounting/journals?status=DRAFT
//
//     GET /accounting/journals?currency=KES
//
//     GET /accounting/journals?periodPublicId=7b4c7b7e-2d2a-4e6c-8a8b-7f2d9a1c1234
//
//     GET /accounting/journals?status=POSTED&currency=KES
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS Swagger
// -----------------------------------------------------------------------------

import { ApiPropertyOptional } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Class Transformer
// -----------------------------------------------------------------------------

import { Transform, type TransformFnParams } from 'class-transformer';

// -----------------------------------------------------------------------------
// Class Validator
// -----------------------------------------------------------------------------

import {
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

// =============================================================================
// Constants
// =============================================================================

export const ACCOUNTING_JOURNAL_STATUSES = [
  'DRAFT',
  'POSTED',
  'REVERSED',
] as const;

export const ACCOUNTING_JOURNAL_CURRENCIES = [
  'KES',
  'USD',
  'EUR',
  'GBP',
] as const;

export const ACCOUNTING_JOURNAL_CURRENCY_LENGTH = 3;

// =============================================================================
// DTO
// =============================================================================

/**
 * Query parameters for retrieving Accounting Journals.
 *
 * All filters are optional.
 */
export class GetAccountingJournalsQueryDto {
  // ===========================================================================
  // Status
  // ===========================================================================

  /**
   * Optional Accounting Journal lifecycle status filter.
   */
  @ApiPropertyOptional({
    enum: ACCOUNTING_JOURNAL_STATUSES,
    example: 'POSTED',
    description: 'Optional Accounting Journal lifecycle status filter.',
  })
  @IsOptional()
  @Transform(({ value }: TransformFnParams): unknown =>
    typeof value === 'string' ? value.trim().toUpperCase() : value,
  )
  @IsString({
    message: 'status must be a string.',
  })
  @IsIn(ACCOUNTING_JOURNAL_STATUSES, {
    message: 'status must be one of DRAFT, POSTED, or REVERSED.',
  })
  status?: (typeof ACCOUNTING_JOURNAL_STATUSES)[number];

  // ===========================================================================
  // Currency
  // ===========================================================================

  /**
   * Optional accounting currency filter.
   */
  @ApiPropertyOptional({
    enum: ACCOUNTING_JOURNAL_CURRENCIES,
    example: 'KES',
    description: 'Optional accounting currency filter.',
  })
  @IsOptional()
  @Transform(({ value }: TransformFnParams): unknown =>
    typeof value === 'string' ? value.trim().toUpperCase() : value,
  )
  @IsString({
    message: 'currency must be a string.',
  })
  @MinLength(ACCOUNTING_JOURNAL_CURRENCY_LENGTH, {
    message: `currency must be exactly ${ACCOUNTING_JOURNAL_CURRENCY_LENGTH} characters.`,
  })
  @MaxLength(ACCOUNTING_JOURNAL_CURRENCY_LENGTH, {
    message: `currency must be exactly ${ACCOUNTING_JOURNAL_CURRENCY_LENGTH} characters.`,
  })
  @IsIn(ACCOUNTING_JOURNAL_CURRENCIES, {
    message: 'currency must be one of KES, USD, EUR, or GBP.',
  })
  currency?: string;

  // ===========================================================================
  // Accounting Period
  // ===========================================================================

  /**
   * Optional public identity of the Accounting Period.
   */
  @ApiPropertyOptional({
    example: '7b4c7b7e-2d2a-4e6c-8a8b-7f2d9a1c1234',
    description:
      'Optional public identity of the Accounting Period used to filter journals.',
    format: 'uuid',
  })
  @IsOptional()
  @IsString({
    message: 'periodPublicId must be a string.',
  })
  @IsUUID('4', {
    message: 'periodPublicId must be a valid UUID.',
  })
  periodPublicId?: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetAccountingJournalsQueryDto;
