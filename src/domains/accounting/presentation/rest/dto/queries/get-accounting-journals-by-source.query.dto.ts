// -----------------------------------------------------------------------------
// Accounting — Get Accounting Journals By Source Query DTO
// -----------------------------------------------------------------------------
//
// REST query DTO for retrieving Accounting Journals associated with a posting
// source.
//
// User-facing intent:
//
//     Get Accounting Journals By Source
//
// Required source identity:
//
// - sourceType;
// - sourcePublicId.
//
// The source is an opaque cross-domain reference.
//
// The Accounting domain does not need to know the source aggregate's internal
// persistence identity or load the source aggregate to perform this query.
//
// This DTO does NOT:
//
// - load the source aggregate;
// - validate the source aggregate;
// - interpret source-specific business rules;
// - access Prisma;
// - access repositories directly;
// - modify Accounting Journals;
// - authorize the caller;
// - publish domain events.
//
// The application layer constructs:
//
//     GetAccountingJournalsBySourceQuery
//
// and delegates the lookup to AccountingJournalRepository.
//
// -----------------------------------------------------------------------------
//
// Examples:
//
//     GET /accounting/journals/source?sourceType=BOOKING&sourcePublicId=...
//
//     GET /accounting/journals/by-source?sourceType=JOURNEY&sourcePublicId=...
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

import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

// =============================================================================
// Constants
// =============================================================================

export const ACCOUNTING_POSTING_SOURCE_TYPE_MIN_LENGTH = 1;
export const ACCOUNTING_POSTING_SOURCE_TYPE_MAX_LENGTH = 100;

export const ACCOUNTING_POSTING_SOURCE_PUBLIC_ID_MIN_LENGTH = 1;
export const ACCOUNTING_POSTING_SOURCE_PUBLIC_ID_MAX_LENGTH = 255;

// =============================================================================
// DTO
// =============================================================================

/**
 * Query parameters for retrieving Accounting Journals by posting source.
 */
export class GetAccountingJournalsBySourceQueryDto {
  // ===========================================================================
  // Source Type
  // ===========================================================================

  /**
   * Type/category of the aggregate or domain object that originated the
   * accounting posting.
   */
  @ApiProperty({
    example: 'BOOKING',
    description:
      'Type or category of the object that originated the accounting posting.',
    minLength: ACCOUNTING_POSTING_SOURCE_TYPE_MIN_LENGTH,
    maxLength: ACCOUNTING_POSTING_SOURCE_TYPE_MAX_LENGTH,
  })
  @Transform(({ value }: TransformFnParams): unknown =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString({
    message: 'sourceType must be a string.',
  })
  @IsNotEmpty({
    message: 'sourceType must not be empty.',
  })
  @MinLength(ACCOUNTING_POSTING_SOURCE_TYPE_MIN_LENGTH, {
    message: `sourceType must be at least ${ACCOUNTING_POSTING_SOURCE_TYPE_MIN_LENGTH} character.`,
  })
  @MaxLength(ACCOUNTING_POSTING_SOURCE_TYPE_MAX_LENGTH, {
    message: `sourceType must not exceed ${ACCOUNTING_POSTING_SOURCE_TYPE_MAX_LENGTH} characters.`,
  })
  sourceType!: string;

  // ===========================================================================
  // Source Public Identity
  // ===========================================================================

  /**
   * Public identifier of the source that originated the accounting posting.
   *
   * This remains opaque to the Accounting domain.
   */
  @ApiProperty({
    example: '7b4c7b7e-2d2a-4e6c-8a8b-7f2d9a1c1234',
    description:
      'Public identifier of the object that originated the accounting posting.',
    minLength: ACCOUNTING_POSTING_SOURCE_PUBLIC_ID_MIN_LENGTH,
    maxLength: ACCOUNTING_POSTING_SOURCE_PUBLIC_ID_MAX_LENGTH,
  })
  @Transform(({ value }: TransformFnParams): unknown =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString({
    message: 'sourcePublicId must be a string.',
  })
  @IsNotEmpty({
    message: 'sourcePublicId must not be empty.',
  })
  @MinLength(ACCOUNTING_POSTING_SOURCE_PUBLIC_ID_MIN_LENGTH, {
    message: `sourcePublicId must be at least ${ACCOUNTING_POSTING_SOURCE_PUBLIC_ID_MIN_LENGTH} character.`,
  })
  @MaxLength(ACCOUNTING_POSTING_SOURCE_PUBLIC_ID_MAX_LENGTH, {
    message: `sourcePublicId must not exceed ${ACCOUNTING_POSTING_SOURCE_PUBLIC_ID_MAX_LENGTH} characters.`,
  })
  sourcePublicId!: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetAccountingJournalsBySourceQueryDto;
