// -----------------------------------------------------------------------------
// Accounting — Create Account Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for creating an Accounting Account.
//
// Aggregate:
//
// AccountingAccountAggregate
// └── AccountingAccountEntity
//
// This DTO represents the minimum information that a human user or an
// operational application service needs to provide in order to create an
// Accounting Account.
//
// Required:
//
// - code;
// - name;
// - type.
//
// Optional:
//
// - parentAccountPublicId.
//
// The parent account is identified through its PUBLIC identity.
//
// The application layer is responsible for resolving:
//
//     parentAccountPublicId
//             ↓
//     Accounting Account
//             ↓
//     internal UniqueEntityId
//             ↓
//     CreateAccountingAccountCommand
//
// The client must never provide the persistence/internal account ID.
//
// The request does NOT supply:
//
// - Accounting Account public ID;
// - persistence/internal ID;
// - status;
// - createdAt;
// - updatedAt;
// - lifecycle state;
// - correlationId;
// - causationId.
//
// Those values belong to the domain or application execution context.
//
// This DTO does NOT:
//
// - create the entity;
// - create the aggregate;
// - access repositories;
// - access Prisma;
// - validate aggregate invariants;
// - persist the account;
// - emit domain events;
// - authorize the operation.
//
// -----------------------------------------------------------------------------
//
// Example:
//
//     {
//       "code": "1000",
//       "name": "Cash",
//       "type": "ASSET"
//     }
//
// Or:
//
//     {
//       "code": "1100",
//       "name": "Bank Account",
//       "type": "ASSET",
//       "parentAccountPublicId": "550e8400-e29b-41d4-a716-446655440000"
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
 * REST request for creating an Accounting Account.
 *
 * Represents the minimum transport information required to create an
 * Accounting Account.
 *
 * The domain establishes the account's identity, lifecycle state and
 * timestamps.
 */
export class CreateAccountingAccountRequestDto {
  // ===========================================================================
  // Account Code
  // ===========================================================================

  /**
   * Unique accounting code assigned to the account.
   *
   * Example:
   *
   * - 1000
   * - 1100
   * - 4000
   */
  @ApiProperty({
    example: '1000',
    description: 'Unique accounting code assigned to the account.',
    minLength: MIN_ACCOUNT_CODE_LENGTH,
    maxLength: MAX_ACCOUNT_CODE_LENGTH,
  })
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
  code!: string;

  // ===========================================================================
  // Account Name
  // ===========================================================================

  /**
   * Human-readable name of the Accounting Account.
   *
   * Example:
   *
   * - Cash
   * - Bank Account
   * - Service Revenue
   */
  @ApiProperty({
    example: 'Cash',
    description: 'Human-readable name of the Accounting Account.',
    minLength: MIN_ACCOUNT_NAME_LENGTH,
    maxLength: MAX_ACCOUNT_NAME_LENGTH,
  })
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
  name!: string;

  // ===========================================================================
  // Account Type
  // ===========================================================================

  /**
   * Accounting classification of the account.
   *
   * The transport representation uses the accounting type name.
   *
   * Allowed values:
   *
   * - ASSET
   * - LIABILITY
   * - EQUITY
   * - REVENUE
   * - EXPENSE
   */
  @ApiProperty({
    example: 'ASSET',
    description: 'Accounting classification of the account.',
    enum: ACCOUNT_TYPES,
  })
  @Transform(trimString)
  @IsString({
    message: 'type must be a string.',
  })
  @IsIn(ACCOUNT_TYPES, {
    message: 'type must be one of: ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE.',
  })
  type!: string;

  // ===========================================================================
  // Parent Account
  // ===========================================================================

  /**
   * Public identity of the optional parent Accounting Account.
   *
   * This is a public reference only.
   *
   * The application layer resolves it to the internal account identity
   * required by the domain command.
   *
   * Example:
   *
   * - 550e8400-e29b-41d4-a716-446655440000
   */
  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Public identity of the optional parent Accounting Account.',
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
