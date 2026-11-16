
/**
 * -----------------------------------------------------------------------------
 * SisiMove — M-PESA Daraja 3.0 C2B Confirmation DTO
 * -----------------------------------------------------------------------------
 *
 * Represents the C2B confirmation callback payload received from Safaricom
 * Daraja after a customer payment.
 *
 * This DTO defines the provider payload only. FinancialModule is responsible
 * for payment matching, idempotency, reconciliation and financial effects.
 * -----------------------------------------------------------------------------
 */

import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

// =============================================================================
// DTO
// =============================================================================

export class C2BConfirmationDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/)
  public readonly TransactionType!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/\S/)
  public readonly TransID!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/\S/)
  public readonly TransTime!: string;

  @IsInt()
  public readonly TransAmount!: number;

  @IsString()
  @IsNotEmpty()
  @Matches(/^254(?:7|1)\d{8}$/)
  public readonly MSISDN!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/\S/)
  public readonly BusinessShortCode!: string;

  @IsOptional()
  @IsString()
  public readonly BillRefNumber?: string;

  @IsOptional()
  @IsString()
  public readonly InvoiceNumber?: string;

  @IsOptional()
  @IsString()
  public readonly OrgAccountBalance?: string;

  @IsOptional()
  @IsString()
  public readonly ThirdPartyTransID?: string;

  @IsOptional()
  @IsString()
  public readonly FirstName?: string;

  @IsOptional()
  @IsString()
  public readonly MiddleName?: string;

  @IsOptional()
  @IsString()
  public readonly LastName?: string;
}

export default C2BConfirmationDto;
