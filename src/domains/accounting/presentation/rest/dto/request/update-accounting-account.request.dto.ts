// -----------------------------------------------------------------------------
// Accounting — Update Account Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for updating an existing Accounting Account.
//
// Aggregate:
//
// AccountingAccountAggregate
// └── AccountingAccountEntity
//
// User-facing intent:
//
//     Update Accounting Account
//
// The request identifies the account through its PUBLIC identity.
//
// Only mutable information is accepted.
//
// Optional updates:
//
// - code;
// - name;
// - type;
// - parentAccountPublicId.
//
// Parent-account removal is represented explicitly through:
//
//     removeParentAccount
//
// This distinction is important:
//
//     parentAccountPublicId omitted
//         → do not change the current parent.
//
//     removeParentAccount = true
//         → remove the current parent.
//
//     parentAccountPublicId supplied
//         → assign/change the parent.
//
// The client must never provide the internal account ID.
//
// The application layer is responsible for resolving public identities into
// the internal domain references required by the command.
//
// The request does NOT supply:
//
// - persistence/internal ID;
// - status;
// - createdAt;
// - updatedAt;
// - lifecycle timestamps;
// - correlationId;
// - causationId.
//
// This DTO does NOT:
//
// - load the aggregate;
// - access Prisma;
// - access repositories;
// - enforce lifecycle rules;
// - perform authorization;
// - persist changes;
// - construct domain events.
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
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

// =============================================================================
// Helpers
// =============================================================================

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

// =============================================================================
// Constants
// =============================================================================

const MIN_ACCOUNT_CODE_LENGTH = 1;
const MAX_ACCOUNT_CODE_LENGTH = 50;

const MIN_ACCOUNT_NAME_LENGTH = 1;
const MAX_ACCOUNT_NAME_LENGTH = 150;

const ACCOUNT_TYPES = [
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
 * REST request for updating an Accounting Account.
 *
 * The account public identity is required.
 *
 * All mutable attributes are optional.
 *
 * When no mutable field is supplied, the application layer should reject the
 * operation rather than performing an unnecessary persistence operation.
 */
export class UpdateAccountingAccountRequestDto {
  // ===========================================================================
  // Account Public Identity
  // ===========================================================================

  /**
   * Public identity of the Accounting Account to update.
   */
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Public identity of the Accounting Account to update.',
    format: 'uuid',
  })
  @IsString({
    message: 'publicId must be a string.',
  })
  @IsUUID('4', {
    message: 'publicId must be a valid UUID.',
  })
  publicId!: string;

  // ===========================================================================
  // Account Code
  // ===========================================================================

  /**
   * New accounting code.
   *
   * Omit this property when the code should remain unchanged.
   */
  @ApiPropertyOptional({
    example: '1010',
    description:
      'New accounting code. Omit when the existing code should remain unchanged.',
    minLength: MIN_ACCOUNT_CODE_LENGTH,
    maxLength: MAX_ACCOUNT_CODE_LENGTH,
  })
  @IsOptional()
  @Transform(trimString)
  @IsString({
    message: 'code must be a string.',
  })
  @MinLength(MIN_ACCOUNT_CODE_LENGTH, {
    message: `code must be at least ${MIN_ACCOUNT_CODE_LENGTH} character.`,
  })
  @MaxLength(MAX_ACCOUNT_CODE_LENGTH, {
    message: `code must not exceed ${MAX_ACCOUNT_CODE_LENGTH} characters.`,
  })
  code?: string;

  // ===========================================================================
  // Account Name
  // ===========================================================================

  /**
   * New human-readable account name.
   *
   * Omit this property when the name should remain unchanged.
   */
  @ApiPropertyOptional({
    example: 'Main Cash Account',
    description:
      'New account name. Omit when the existing name should remain unchanged.',
    minLength: MIN_ACCOUNT_NAME_LENGTH,
    maxLength: MAX_ACCOUNT_NAME_LENGTH,
  })
  @IsOptional()
  @Transform(trimString)
  @IsString({
    message: 'name must be a string.',
  })
  @MinLength(MIN_ACCOUNT_NAME_LENGTH, {
    message: `name must be at least ${MIN_ACCOUNT_NAME_LENGTH} character.`,
  })
  @MaxLength(MAX_ACCOUNT_NAME_LENGTH, {
    message: `name must not exceed ${MAX_ACCOUNT_NAME_LENGTH} characters.`,
  })
  name?: string;

  // ===========================================================================
  // Account Type
  // ===========================================================================

  /**
   * New accounting classification.
   *
   * Omit this property when the classification should remain unchanged.
   */
  @ApiPropertyOptional({
    example: 'ASSET',
    description:
      'New accounting classification. Omit when the existing classification should remain unchanged.',
    enum: ACCOUNT_TYPES,
  })
  @IsOptional()
  @Transform(trimString)
  @IsString({
    message: 'type must be a string.',
  })
  @IsIn(ACCOUNT_TYPES, {
    message: 'type must be one of: ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE.',
  })
  type?: string;

  // ===========================================================================
  // Parent Account
  // ===========================================================================

  /**
   * Public identity of the new parent Accounting Account.
   *
   * Omit this property when the parent relationship should remain unchanged.
   *
   * To remove the parent relationship, use removeParentAccount instead.
   */
  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description:
      'Public identity of the new parent Accounting Account. Omit when the current parent should remain unchanged.',
    format: 'uuid',
  })
  @IsOptional()
  @Transform(trimString)
  @IsString({
    message: 'parentAccountPublicId must be a string.',
  })
  @IsUUID('4', {
    message: 'parentAccountPublicId must be a valid UUID.',
  })
  parentAccountPublicId?: string;

  // ===========================================================================
  // Remove Parent Account
  // ===========================================================================

  /**
   * Explicitly removes the current parent-account relationship.
   *
   * Defaults to false when omitted.
   */
  @ApiPropertyOptional({
    example: false,
    default: false,
    description: 'Whether to remove the current parent-account relationship.',
  })
  @IsOptional()
  @IsBoolean({
    message: 'removeParentAccount must be a boolean.',
  })
  removeParentAccount?: boolean = false;
}

// -----------------------------------------------------------------------------
// Exported Constants
// -----------------------------------------------------------------------------

export {
  MIN_ACCOUNT_CODE_LENGTH as ACCOUNTING_ACCOUNT_CODE_MIN_LENGTH,
  MAX_ACCOUNT_CODE_LENGTH as ACCOUNTING_ACCOUNT_CODE_MAX_LENGTH,
  MIN_ACCOUNT_NAME_LENGTH as ACCOUNTING_ACCOUNT_NAME_MIN_LENGTH,
  MAX_ACCOUNT_NAME_LENGTH as ACCOUNTING_ACCOUNT_NAME_MAX_LENGTH,
  ACCOUNT_TYPES as ACCOUNTING_ACCOUNT_TYPES,
};
