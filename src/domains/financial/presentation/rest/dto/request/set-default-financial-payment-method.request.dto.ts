// -----------------------------------------------------------------------------
// Financial Payment Method — Set Default Request DTO
// -----------------------------------------------------------------------------

import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST request DTO for setting a Financial Payment Method as the default.
 *
 * The payment method public ID is supplied through the route parameter,
 * not the request body.
 *
 * The DTO contains only operation metadata.
 */
export class SetDefaultFinancialPaymentMethodDto {
  // ===========================================================================
  // Correlation
  // ===========================================================================

  @IsString()
  @IsNotEmpty()
  public readonly correlationId!: string;

  // ===========================================================================
  // Causation
  // ===========================================================================

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public readonly causationId?: string;

  // ===========================================================================
  // Default Timestamp
  // ===========================================================================

  @IsOptional()
  @IsDateString()
  public readonly defaultedAt?: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default SetDefaultFinancialPaymentMethodDto;
