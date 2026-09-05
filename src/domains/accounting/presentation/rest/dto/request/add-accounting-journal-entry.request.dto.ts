// -----------------------------------------------------------------------------
// Accounting Journal — Add Accounting Journal Entry Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for adding an Accounting Journal Entry to an existing
// Accounting Journal aggregate.
//
// Aggregate context:
//
// AccountingJournalAggregate
// └── AccountingJournalEntity
//     └── AccountingJournalEntryEntity
//
// Route context supplies:
//
// - journalPublicId.
//
// This request supplies only the information required from the caller:
//
// - journal entry date;
// - optional journal entry description.
//
// The request does NOT supply:
//
// - Accounting Journal public ID;
// - Accounting Journal Entry public ID;
// - Accounting Journal Entry internal ID;
// - creation timestamp;
// - update timestamp;
// - correlation ID;
// - causation ID.
//
// Those values belong to routing, the domain, persistence, or the application
// execution context.
//
// This DTO does NOT:
//
// - load the Accounting Journal;
// - construct the Accounting Journal Entry;
// - validate the Accounting Journal lifecycle state;
// - validate journal ownership;
// - validate entry identity uniqueness;
// - persist the aggregate;
// - access Prisma;
// - perform authorization.
//
// -----------------------------------------------------------------------------
//
// Example:
//
//     {
//       "entryDate": "2026-09-05T10:30:00.000Z",
//       "description": "Journey booking settlement"
//     }
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS Swagger
// -----------------------------------------------------------------------------

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Class Transformer
// -----------------------------------------------------------------------------

import { Transform, Type, type TransformFnParams } from 'class-transformer';

// -----------------------------------------------------------------------------
// Class Validator
// -----------------------------------------------------------------------------

import { IsDate, IsOptional, IsString, MaxLength } from 'class-validator';

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MAX_DESCRIPTION_LENGTH = 500;

// =============================================================================
// DTO
// =============================================================================

/**
 * REST request for adding an Accounting Journal Entry.
 *
 * The target Accounting Journal is identified by the route.
 *
 * Required transport input:
 *
 * - entryDate.
 *
 * Optional transport input:
 *
 * - description.
 *
 * The application layer converts the transport date into the value required
 * by AddAccountingJournalEntryCommand.
 *
 * Journal identity, entry identity, lifecycle timestamps, correlation metadata,
 * and causation metadata are intentionally not supplied by the caller.
 */
export class AddAccountingJournalEntryRequestDto {
  // ===========================================================================
  // Entry Date
  // ===========================================================================

  /**
   * Effective accounting date of the journal entry.
   *
   * This represents when the accounting event occurred. It is distinct from
   * the system creation timestamp, which is established by the domain or
   * application workflow.
   */
  @ApiProperty({
    example: '2026-09-05T10:30:00.000Z',
    description: 'Effective accounting date and time of the journal entry.',
    format: 'date-time',
  })
  @Type(() => Date)
  @IsDate({
    message: 'entryDate must be a valid date.',
  })
  entryDate!: Date;

  // ===========================================================================
  // Description
  // ===========================================================================

  /**
   * Optional human-readable description of the journal entry.
   */
  @ApiPropertyOptional({
    example: 'Journey booking settlement',
    description:
      'Optional human-readable description of the Accounting Journal Entry.',
    maxLength: MAX_DESCRIPTION_LENGTH,
  })
  @IsOptional()
  @Transform(trimString)
  @IsString({
    message: 'description must be a string.',
  })
  @MaxLength(MAX_DESCRIPTION_LENGTH, {
    message: `description must not exceed ${MAX_DESCRIPTION_LENGTH} characters.`,
  })
  description?: string;
}

// -----------------------------------------------------------------------------
// Exported Constants
// -----------------------------------------------------------------------------

export { MAX_DESCRIPTION_LENGTH as ACCOUNTING_JOURNAL_ENTRY_DESCRIPTION_MAX_LENGTH };
