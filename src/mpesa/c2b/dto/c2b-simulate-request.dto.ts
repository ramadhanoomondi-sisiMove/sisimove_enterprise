/**
 * -----------------------------------------------------------------------------
 * SisiMove — M-PESA Daraja 3.0 C2B Simulation Request DTO
 * -----------------------------------------------------------------------------
 *
 * Validates requests to simulate a C2B customer payment through Safaricom
 * Daraja. This operation is intended for sandbox testing.
 *
 * The shortcode is resolved from the configured M-PESA provider.
 * -----------------------------------------------------------------------------
 */

import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';

// =============================================================================
// DTO
// =============================================================================

export class C2BSimulateRequestDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, {
    message: 'providerPublicId must not contain only whitespace.',
  })
  @MaxLength(50)
  public readonly providerPublicId!: string;

  @IsString()
  @Matches(/^254(?:7|1)\d{8}$/, {
    message: 'phoneNumber must be a valid Kenyan number in 254 format.',
  })
  public readonly phoneNumber!: string;

  @IsInt()
  @Min(1)
  public readonly amount!: number;

  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, {
    message: 'billRefNumber must not contain only whitespace.',
  })
  @MaxLength(20)
  public readonly billRefNumber!: string;

  @IsString()
  @IsIn(['CustomerPayBillOnline', 'CustomerBuyGoodsOnline'])
  public readonly commandId!:
    'CustomerPayBillOnline' | 'CustomerBuyGoodsOnline';
}

export default C2BSimulateRequestDto;
