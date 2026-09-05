// -----------------------------------------------------------------------------
// Accounting — Create Accounting Period Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for creating an Accounting Period.
//
// Aggregate:
//
// AccountingPeriodAggregate
// └── AccountingPeriodEntity
//
// This request supplies only the information required from the caller:
//
// - Accounting Period name;
// - period start date;
// - period end date.
//
// A newly created Accounting Period:
//
// - receives its public identity from the domain;
// - receives its internal identity from the domain;
// - begins in its default lifecycle state;
// - receives lifecycle timestamps from the domain/application workflow.
//
// The request does NOT supply:
//
// - Accounting Period public ID;
// - persistence/internal ID;
// - period status;
// - closed timestamp;
// - creation timestamp;
// - update timestamp;
// - correlation ID;
// - causation ID.
//
// Those values belong to the domain, persistence model, or application
// execution context.
//
// This DTO does NOT:
//
// - create AccountingPeriodEntity;
// - create AccountingPeriodAggregate;
// - determine period overlap;
// - enforce period lifecycle rules;
// - validate other Accounting Period aggregates;
// - persist the aggregate;
// - access repositories;
// - access Prisma;
// - perform authorization;
// - generate domain events.
//
// -----------------------------------------------------------------------------
//
// Example:
//
//     {
//       "name": "September 2026",
//       "startsAt": "2026-09-01T00:00:00.000Z",
//       "endsAt": "2026-09-30T23:59:59.999Z"
//     }
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS Swagger
// -----------------------------------------------------------------------------

import { ApiProperty } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Class Transformer
// -----------------------------------------------------------------------------

import { Transform, Type, type TransformFnParams } from 'class-transformer';

// -----------------------------------------------------------------------------
// Class Validator
// -----------------------------------------------------------------------------

import { IsDate, IsString, MaxLength, MinLength } from 'class-validator';

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MIN_NAME_LENGTH = 1;
const MAX_NAME_LENGTH = 255;

// =============================================================================
// DTO
// =============================================================================

/**
 * REST request for creating an Accounting Period.
 *
 * Required transport input:
 *
 * - name;
 * - startsAt;
 * - endsAt.
 *
 * The application layer converts primitive transport values into the
 * corresponding domain value objects before constructing
 * CreateAccountingPeriodCommand.
 *
 * The Accounting Period identity, lifecycle state, timestamps, correlation ID,
 * and causation ID are intentionally not supplied by the caller.
 */
export class CreateAccountingPeriodRequestDto {
  // ===========================================================================
  // Name
  // ===========================================================================

  /**
   * Human-readable name of the Accounting Period.
   *
   * The transport string is converted to AccountingPeriodName at the
   * presentation/application mapping boundary.
   */
  @ApiProperty({
    example: 'September 2026',
    description: 'Human-readable name of the Accounting Period.',
    minLength: MIN_NAME_LENGTH,
    maxLength: MAX_NAME_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'name must be a string.',
  })
  @MinLength(MIN_NAME_LENGTH, {
    message: `name must be at least ${MIN_NAME_LENGTH} character.`,
  })
  @MaxLength(MAX_NAME_LENGTH, {
    message: `name must not exceed ${MAX_NAME_LENGTH} characters.`,
  })
  name!: string;

  // ===========================================================================
  // Start Date
  // ===========================================================================

  /**
   * Timestamp at which the Accounting Period begins.
   *
   * The domain entity enforces the relationship between startsAt and endsAt.
   */
  @ApiProperty({
    example: '2026-09-01T00:00:00.000Z',
    description: 'Timestamp at which the Accounting Period begins.',
    format: 'date-time',
  })
  @Type(() => Date)
  @IsDate({
    message: 'startsAt must be a valid date.',
  })
  startsAt!: Date;

  // ===========================================================================
  // End Date
  // ===========================================================================

  /**
   * Timestamp at which the Accounting Period ends.
   *
   * The domain entity enforces:
   *
   *     startsAt < endsAt
   */
  @ApiProperty({
    example: '2026-09-30T23:59:59.999Z',
    description: 'Timestamp at which the Accounting Period ends.',
    format: 'date-time',
  })
  @Type(() => Date)
  @IsDate({
    message: 'endsAt must be a valid date.',
  })
  endsAt!: Date;
}

// -----------------------------------------------------------------------------
// Exported Constants
// -----------------------------------------------------------------------------

export {
  MIN_NAME_LENGTH as ACCOUNTING_PERIOD_NAME_MIN_LENGTH,
  MAX_NAME_LENGTH as ACCOUNTING_PERIOD_NAME_MAX_LENGTH,
};
