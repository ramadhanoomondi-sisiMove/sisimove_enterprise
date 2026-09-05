// -----------------------------------------------------------------------------
// Accounting — Get Accounting Accounts Query DTO
// -----------------------------------------------------------------------------
//
// REST query DTO for retrieving Accounting Account aggregates.
//
// User-facing intent:
//
//     Get Accounting Accounts
//
// Optional filters:
//
// - Accounting Account status;
// - Accounting Account type.
//
// When no filters are supplied, all Accounting Accounts are requested.
//
// This DTO does NOT:
//
// - load Accounting Accounts;
// - access repositories;
// - access Prisma;
// - calculate account balances;
// - modify accounts;
// - authorize the caller;
// - publish domain events.
//
// The application layer maps the primitive query parameters into the
// corresponding Accounting domain value objects before constructing
// GetAccountingAccountsQuery.
//
// -----------------------------------------------------------------------------
//
// Examples:
//
//     GET /accounting/accounts
//
//     GET /accounting/accounts?status=ACTIVE
//
//     GET /accounting/accounts?type=ASSET
//
//     GET /accounting/accounts?status=ACTIVE&type=ASSET
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

export const ACCOUNTING_ACCOUNT_STATUSES = [
  'ACTIVE',
  'INACTIVE',
  'CLOSED',
] as const;

export const ACCOUNTING_ACCOUNT_TYPES = [
  'ASSET',
  'LIABILITY',
  'EQUITY',
  'REVENUE',
  'EXPENSE',
] as const;

// =============================================================================
// DTO
// =============================================================================

/**
 * Query parameters for retrieving Accounting Accounts.
 *
 * Both filters are optional.
 */
export class GetAccountingAccountsQueryDto {
  // ===========================================================================
  // Status
  // ===========================================================================

  /**
   * Optional Accounting Account lifecycle status filter.
   */
  @ApiPropertyOptional({
    enum: ACCOUNTING_ACCOUNT_STATUSES,
    example: 'ACTIVE',
    description: 'Optional Accounting Account lifecycle status filter.',
  })
  @IsOptional()
  @Transform(({ value }: TransformFnParams): unknown =>
    typeof value === 'string' ? value.trim().toUpperCase() : value,
  )
  @IsString({
    message: 'status must be a string.',
  })
  @IsIn(ACCOUNTING_ACCOUNT_STATUSES, {
    message: 'status must be one of ACTIVE, INACTIVE, or CLOSED.',
  })
  status?: (typeof ACCOUNTING_ACCOUNT_STATUSES)[number];

  // ===========================================================================
  // Type
  // ===========================================================================

  /**
   * Optional Accounting Account classification/type filter.
   */
  @ApiPropertyOptional({
    enum: ACCOUNTING_ACCOUNT_TYPES,
    example: 'ASSET',
    description: 'Optional Accounting Account classification/type filter.',
  })
  @IsOptional()
  @Transform(({ value }: TransformFnParams): unknown =>
    typeof value === 'string' ? value.trim().toUpperCase() : value,
  )
  @IsString({
    message: 'type must be a string.',
  })
  @IsIn(ACCOUNTING_ACCOUNT_TYPES, {
    message:
      'type must be one of ASSET, LIABILITY, EQUITY, REVENUE, or EXPENSE.',
  })
  type?: (typeof ACCOUNTING_ACCOUNT_TYPES)[number];
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetAccountingAccountsQueryDto;
