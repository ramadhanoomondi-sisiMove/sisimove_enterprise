// -----------------------------------------------------------------------------
// Accounting — Get Accounting Periods Query DTO
// -----------------------------------------------------------------------------
//
// REST query DTO for retrieving Accounting Period aggregates.
//
// User-facing intent:
//
//     Get Accounting Periods
//
// Optional filter:
//
// - Accounting Period lifecycle status.
//
// When status is omitted, all Accounting Periods are requested.
//
// This DTO does NOT:
//
// - load Accounting Periods;
// - access repositories;
// - access Prisma;
// - validate period overlap;
// - modify periods;
// - authorize the caller;
// - publish domain events.
//
// The application layer maps the primitive status value into
// AccountingPeriodStatus before constructing GetAccountingPeriodsQuery.
//
// -----------------------------------------------------------------------------
//
// Examples:
//
//     GET /accounting/periods
//
//     GET /accounting/periods?status=OPEN
//
//     GET /accounting/periods?status=CLOSED
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

import { IsIn, IsOptional, IsString } from 'class-validator';

// =============================================================================
// Constants
// =============================================================================

export const ACCOUNTING_PERIOD_STATUSES = ['OPEN', 'CLOSED'] as const;

// =============================================================================
// DTO
// =============================================================================

/**
 * Query parameters for retrieving Accounting Periods.
 */
export class GetAccountingPeriodsQueryDto {
  // ===========================================================================
  // Status
  // ===========================================================================

  /**
   * Optional Accounting Period lifecycle status filter.
   */
  @ApiPropertyOptional({
    enum: ACCOUNTING_PERIOD_STATUSES,
    example: 'OPEN',
    description: 'Optional Accounting Period lifecycle status filter.',
  })
  @IsOptional()
  @Transform(({ value }: TransformFnParams): unknown =>
    typeof value === 'string' ? value.trim().toUpperCase() : value,
  )
  @IsString({
    message: 'status must be a string.',
  })
  @IsIn(ACCOUNTING_PERIOD_STATUSES, {
    message: 'status must be either OPEN or CLOSED.',
  })
  status?: (typeof ACCOUNTING_PERIOD_STATUSES)[number];
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetAccountingPeriodsQueryDto;
