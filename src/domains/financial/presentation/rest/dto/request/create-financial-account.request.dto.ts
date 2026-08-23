// -----------------------------------------------------------------------------
// Financial Account — Create Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for creating a Financial Account aggregate.
//
// Aggregate:
//
// FinancialAccountAggregate
// ├── FinancialAccountEntity
// └── FinancialAccountBalanceEntity
//
// This DTO intentionally contains primitive transport values.
//
// Conversion into domain value objects belongs to the presentation/application
// boundary and must not be performed inside the domain entity or aggregate.
//
// The DTO does NOT expose:
//
// - Financial Account public ID;
// - lifecycle status;
// - createdAt;
// - updatedAt;
// - balance;
// - available amount;
// - pending amount;
// - held amount;
// - domain events.
//
// Those values are owned by the Financial Account domain.
//
// The initial lifecycle status and zero balance are determined by the domain
// creation workflow.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST request DTO for creating a Financial Account.
 *
 * Transport values:
 *
 * - ownerPublicId
 * - type
 * - currency
 * - correlationId
 * - causationId
 *
 * The application boundary is responsible for converting these primitive
 * values into:
 *
 * - FinancialAccountOwnerPublicId;
 * - FinancialAccountType;
 * - Currency.
 */
export class CreateFinancialAccountDto {
  // ===========================================================================
  // Owner
  // ===========================================================================

  /**
   * Public identity of the owner of the Financial Account.
   *
   * This is an opaque cross-domain reference to Identity.
   */
  @IsString()
  @IsNotEmpty()
  public readonly ownerPublicId!: string;

  // ===========================================================================
  // Account Type
  // ===========================================================================

  /**
   * Classification of the Financial Account.
   *
   * Examples may include:
   *
   * - USER
   * - PLATFORM
   * - HOLDING
   * - SETTLEMENT
   */
  @IsString()
  @IsNotEmpty()
  public readonly type!: string;

  // ===========================================================================
  // Currency
  // ===========================================================================

  /**
   * Currency in which the Financial Account balance is maintained.
   */
  @IsString()
  @IsNotEmpty()
  public readonly currency!: string;

  // ===========================================================================
  // Correlation
  // ===========================================================================

  /**
   * Correlation identifier for distributed tracing and domain-event
   * correlation.
   *
   * This value is supplied by the application/request boundary and is not
   * part of the Financial Account entity state.
   */
  @IsString()
  @IsNotEmpty()
  public readonly correlationId!: string;

  // ===========================================================================
  // Causation
  // ===========================================================================

  /**
   * Optional identifier of the command or event that caused this operation.
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public readonly causationId?: string;
}
