// -----------------------------------------------------------------------------
// Financial Account Hold — Create Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for creating a Financial Account Hold.
//
// A Financial Account Hold represents a reservation of funds against a
// Financial Account.
//
// Aggregate:
//
// FinancialAccountHoldAggregate
// └── FinancialAccountHoldEntity
//
// This DTO contains transport-level primitive values only.
//
// DTO-to-domain conversion belongs to the presentation/application boundary.
//
// This DTO does NOT:
//
// - Modify Financial Account balances.
// - Create a Financial HOLD transaction.
// - Execute a Financial HOLD transaction.
// - Move money.
// - Communicate with payment providers.
//
// The application workflow is responsible for coordinating the hold creation
// with the associated Financial HOLD transaction.
//
// Monetary values are expressed in the smallest monetary unit supported by
// the Financial domain.
//
// For example:
//
//     KES 4,254 = 4254
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
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MIN_HOLD_AMOUNT = 1;
const MAX_HOLD_AMOUNT = 999999999999;

const MIN_REFERENCE_TYPE_LENGTH = 1;
const MAX_REFERENCE_TYPE_LENGTH = 100;

const MIN_REFERENCE_PUBLIC_ID_LENGTH = 1;
const MAX_REFERENCE_PUBLIC_ID_LENGTH = 100;

const MIN_CORRELATION_ID_LENGTH = 1;
const MAX_CORRELATION_ID_LENGTH = 128;

const MIN_CAUSATION_ID_LENGTH = 1;
const MAX_CAUSATION_ID_LENGTH = 128;

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST request for creating a Financial Account Hold.
 *
 * Represents the application-level intent to establish a reservation against
 * a Financial Account.
 *
 * The DTO intentionally contains primitive transport values.
 *
 * Conversion into:
 *
 * - FinancialAccountPublicId
 * - FinancialAccountHeldAmount
 * - FinancialHoldReference
 * - FinancialHoldExpiry
 *
 * belongs to the presentation/application mapping boundary.
 *
 * The initial Financial Account Hold lifecycle status is NOT supplied by the
 * request. The domain determines the initial ACTIVE state.
 */
export class CreateFinancialAccountHoldRequestDto {
  // ===========================================================================
  // Financial Account
  // ===========================================================================

  /**
   * Public identifier of the Financial Account against which the funds are
   * reserved.
   */
  @ApiProperty({
    example: 'FIA-WQC6Y7G',
    description:
      'Public identifier of the Financial Account against which the funds are reserved.',
  })
  @Transform(trimString)
  @IsString({
    message: 'accountPublicId must be a string.',
  })
  @MinLength(1, {
    message: 'accountPublicId must not be empty.',
  })
  @Matches(/^FIA-[A-Z0-9]+$/, {
    message:
      'accountPublicId must be a valid Financial Account public identifier.',
  })
  accountPublicId!: string;

  // ===========================================================================
  // Held Amount
  // ===========================================================================

  /**
   * Amount of funds to reserve.
   *
   * The Financial domain represents monetary values as integers in the
   * smallest supported monetary unit.
   *
   * For example:
   *
   *     4254 = KES 4,254
   */
  @ApiProperty({
    example: 4254,
    description:
      'Amount of funds to reserve, expressed as an integer in the smallest monetary unit supported by the Financial domain.',
    minimum: MIN_HOLD_AMOUNT,
    maximum: MAX_HOLD_AMOUNT,
    type: Number,
  })
  @IsNumber(
    {
      allowInfinity: false,
      allowNaN: false,
      maxDecimalPlaces: 0,
    },
    {
      message: 'amount must be a finite integer in the smallest monetary unit.',
    },
  )
  @IsInt({
    message: 'amount must be an integer.',
  })
  @Min(MIN_HOLD_AMOUNT, {
    message: 'amount must be greater than zero.',
  })
  @Max(MAX_HOLD_AMOUNT, {
    message: 'amount exceeds the maximum supported value.',
  })
  amount!: number;

  // ===========================================================================
  // Business Reference
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Reference Type
  // ---------------------------------------------------------------------------

  /**
   * Optional type of the business object that caused the hold.
   *
   * Examples:
   *
   * - JOURNEY_BOOKING
   * - JOURNEY_COMPLETION
   * - COMMERCIAL_BOOKING
   */
  @ApiPropertyOptional({
    example: 'JOURNEY_BOOKING',
    description:
      'Optional type of the business object that caused the Financial Account Hold.',
    minLength: MIN_REFERENCE_TYPE_LENGTH,
    maxLength: MAX_REFERENCE_TYPE_LENGTH,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString({
    message: 'referenceType must be a string.',
  })
  @MinLength(MIN_REFERENCE_TYPE_LENGTH, {
    message: 'referenceType must not be empty.',
  })
  @MaxLength(MAX_REFERENCE_TYPE_LENGTH, {
    message: `referenceType must not exceed ${MAX_REFERENCE_TYPE_LENGTH} characters.`,
  })
  referenceType?: string;

  // ---------------------------------------------------------------------------
  // Reference Public ID
  // ---------------------------------------------------------------------------

  /**
   * Optional public identifier of the business object that caused the hold.
   */
  @ApiPropertyOptional({
    example: 'JBK-7H3K9P2',
    description:
      'Optional public identifier of the business object that caused the Financial Account Hold.',
    minLength: MIN_REFERENCE_PUBLIC_ID_LENGTH,
    maxLength: MAX_REFERENCE_PUBLIC_ID_LENGTH,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString({
    message: 'referencePublicId must be a string.',
  })
  @MinLength(MIN_REFERENCE_PUBLIC_ID_LENGTH, {
    message: 'referencePublicId must not be empty.',
  })
  @MaxLength(MAX_REFERENCE_PUBLIC_ID_LENGTH, {
    message: `referencePublicId must not exceed ${MAX_REFERENCE_PUBLIC_ID_LENGTH} characters.`,
  })
  referencePublicId?: string;

  // ===========================================================================
  // Expiry
  // ===========================================================================

  /**
   * Optional ISO 8601 timestamp after which the hold becomes eligible for
   * expiry processing.
   */
  @ApiPropertyOptional({
    example: '2026-08-25T21:30:00.000Z',
    description:
      'Optional ISO 8601 timestamp after which the Financial Account Hold is eligible for expiry processing.',
    format: 'date-time',
    nullable: true,
  })
  @Transform(trimString)
  @IsOptional()
  @IsDateString(
    {},
    {
      message: 'expiresAt must be a valid ISO 8601 date-time.',
    },
  )
  expiresAt?: string;

  // ===========================================================================
  // Correlation
  // ===========================================================================

  /**
   * Correlation identifier for the create command and resulting domain events.
   */
  @ApiProperty({
    example: 'COR-01K3R8Y7Q2',
    description:
      'Correlation identifier for the create command and resulting domain events.',
    minLength: MIN_CORRELATION_ID_LENGTH,
    maxLength: MAX_CORRELATION_ID_LENGTH,
  })
  @Transform(trimString)
  @IsString({
    message: 'correlationId must be a string.',
  })
  @MinLength(MIN_CORRELATION_ID_LENGTH, {
    message: 'correlationId must not be empty.',
  })
  @MaxLength(MAX_CORRELATION_ID_LENGTH, {
    message: `correlationId must not exceed ${MAX_CORRELATION_ID_LENGTH} characters.`,
  })
  correlationId!: string;

  // ===========================================================================
  // Causation
  // ===========================================================================

  /**
   * Optional identifier of the command or operation that caused this create
   * command.
   */
  @ApiPropertyOptional({
    example: 'CMD-01K3R8Y6M4',
    description:
      'Optional identifier of the command or operation that caused this create command.',
    nullable: true,
    minLength: MIN_CAUSATION_ID_LENGTH,
    maxLength: MAX_CAUSATION_ID_LENGTH,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString({
    message: 'causationId must be a string.',
  })
  @MinLength(MIN_CAUSATION_ID_LENGTH, {
    message: 'causationId must not be empty.',
  })
  @MaxLength(MAX_CAUSATION_ID_LENGTH, {
    message: `causationId must not exceed ${MAX_CAUSATION_ID_LENGTH} characters.`,
  })
  causationId?: string;
}

// -----------------------------------------------------------------------------
// Exported Constants
// -----------------------------------------------------------------------------

export {
  MIN_HOLD_AMOUNT as FINANCIAL_ACCOUNT_HOLD_AMOUNT_MIN,
  MAX_HOLD_AMOUNT as FINANCIAL_ACCOUNT_HOLD_AMOUNT_MAX,
  MIN_REFERENCE_TYPE_LENGTH as FINANCIAL_ACCOUNT_HOLD_REFERENCE_TYPE_MIN_LENGTH,
  MAX_REFERENCE_TYPE_LENGTH as FINANCIAL_ACCOUNT_HOLD_REFERENCE_TYPE_MAX_LENGTH,
  MIN_REFERENCE_PUBLIC_ID_LENGTH as FINANCIAL_ACCOUNT_HOLD_REFERENCE_PUBLIC_ID_MIN_LENGTH,
  MAX_REFERENCE_PUBLIC_ID_LENGTH as FINANCIAL_ACCOUNT_HOLD_REFERENCE_PUBLIC_ID_MAX_LENGTH,
  MIN_CORRELATION_ID_LENGTH as FINANCIAL_ACCOUNT_HOLD_CORRELATION_ID_MIN_LENGTH,
  MAX_CORRELATION_ID_LENGTH as FINANCIAL_ACCOUNT_HOLD_CORRELATION_ID_MAX_LENGTH,
  MIN_CAUSATION_ID_LENGTH as FINANCIAL_ACCOUNT_HOLD_CAUSATION_ID_MIN_LENGTH,
  MAX_CAUSATION_ID_LENGTH as FINANCIAL_ACCOUNT_HOLD_CAUSATION_ID_MAX_LENGTH,
};
