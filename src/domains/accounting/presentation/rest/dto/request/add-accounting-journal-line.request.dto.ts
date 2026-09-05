// -----------------------------------------------------------------------------
// Accounting Journal — Add Accounting Journal Line Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for adding a debit or credit line to an existing
// Accounting Journal Entry.
//
// Aggregate context:
//
// AccountingJournalAggregate
// └── AccountingJournalEntity
//     └── AccountingJournalEntryEntity
//         └── AccountingJournalLineEntity
//
// Route context supplies:
//
// - journalPublicId;
// - entryId.
//
// This request supplies only the information required from the caller:
//
// - referenced Accounting Account;
// - debit or credit direction;
// - accounting amount;
// - currency;
// - optional description.
//
// The request does NOT supply:
//
// - journal public ID;
// - journal entry internal ID;
// - journal line public ID;
// - journal line internal ID;
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
// - load the Accounting Journal Entry;
// - load the Accounting Account;
// - validate cross-aggregate references;
// - determine whether the journal is balanced;
// - validate the journal lifecycle state;
// - persist the aggregate;
// - access Prisma;
// - perform authorization.
//
// -----------------------------------------------------------------------------
//
// Example:
//
//     {
//       "accountPublicId": "ACC_01JABC123XYZ",
//       "type": "DEBIT",
//       "amount": 1500,
//       "currency": "KES",
//       "description": "Journey booking payment"
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

import { Transform, type TransformFnParams } from 'class-transformer';

// -----------------------------------------------------------------------------
// Class Validator
// -----------------------------------------------------------------------------

import {
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MAX_DESCRIPTION_LENGTH = 500;

const ACCOUNTING_JOURNAL_LINE_TYPES = ['DEBIT', 'CREDIT'] as const;

const MIN_ACCOUNTING_AMOUNT = 0;

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST request for adding a line to an Accounting Journal Entry.
 *
 * The target journal and entry are identified by the route.
 *
 * Required transport input:
 *
 * - accountPublicId;
 * - type;
 * - amount;
 * - currency.
 *
 * Optional transport input:
 *
 * - description.
 *
 * The application layer converts primitive transport values into the
 * corresponding domain value objects before constructing
 * AddAccountingJournalLineCommand.
 */
export class AddAccountingJournalLineRequestDto {
  // ===========================================================================
  // Accounting Account
  // ===========================================================================

  /**
   * Public identity of the Accounting Account referenced by this line.
   *
   * The application layer resolves and validates the referenced account.
   */
  @ApiProperty({
    example: 'ACC_01JABC123XYZ',
    description:
      'Public identity of the Accounting Account referenced by this journal line.',
  })
  @Transform(trimString)
  @IsString({
    message: 'accountPublicId must be a string.',
  })
  accountPublicId!: string;

  // ===========================================================================
  // Line Type
  // ===========================================================================

  /**
   * Debit or credit direction of the journal line.
   */
  @ApiProperty({
    example: 'DEBIT',
    enum: ACCOUNTING_JOURNAL_LINE_TYPES,
    description: 'Debit or credit direction of the journal line.',
  })
  @Transform(({ value }: TransformFnParams): unknown =>
    typeof value === 'string' ? value.trim().toUpperCase() : value,
  )
  @IsString({
    message: 'type must be a string.',
  })
  @IsIn(ACCOUNTING_JOURNAL_LINE_TYPES, {
    message: 'type must be either DEBIT or CREDIT.',
  })
  type!: (typeof ACCOUNTING_JOURNAL_LINE_TYPES)[number];

  // ===========================================================================
  // Amount
  // ===========================================================================

  /**
   * Non-negative accounting amount represented by the journal line.
   */
  @ApiProperty({
    example: 1500,
    description: 'Non-negative accounting amount for the journal line.',
    minimum: MIN_ACCOUNTING_AMOUNT,
  })
  @IsNumber(
    {
      allowInfinity: false,
      allowNaN: false,
      maxDecimalPlaces: 2,
    },
    {
      message: 'amount must be a valid numeric value.',
    },
  )
  @Min(MIN_ACCOUNTING_AMOUNT, {
    message: `amount must be greater than or equal to ${MIN_ACCOUNTING_AMOUNT}.`,
  })
  amount!: number;

  // ===========================================================================
  // Currency
  // ===========================================================================

  /**
   * ISO-style three-letter currency code for the journal line.
   *
   * The aggregate later ensures that the line currency is consistent with
   * the Accounting Journal currency.
   */
  @ApiProperty({
    example: 'KES',
    description: 'Three-letter currency code for the journal line.',
    minLength: 3,
    maxLength: 3,
  })
  @Transform(({ value }: TransformFnParams): unknown =>
    typeof value === 'string' ? value.trim().toUpperCase() : value,
  )
  @IsString({
    message: 'currency must be a string.',
  })
  @MaxLength(3, {
    message: 'currency must not exceed 3 characters.',
  })
  currency!: string;

  // ===========================================================================
  // Description
  // ===========================================================================

  /**
   * Optional human-readable description of the journal line.
   */
  @ApiPropertyOptional({
    example: 'Journey booking payment',
    description: 'Optional human-readable description of the journal line.',
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

export {
  ACCOUNTING_JOURNAL_LINE_TYPES,
  MAX_DESCRIPTION_LENGTH as ACCOUNTING_JOURNAL_LINE_DESCRIPTION_MAX_LENGTH,
};
