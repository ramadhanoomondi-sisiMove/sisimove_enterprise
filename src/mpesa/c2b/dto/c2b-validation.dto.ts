/**
 * -----------------------------------------------------------------------------
 * SisiMove — M-PESA Daraja 3.0 C2B Validation DTO
 * -----------------------------------------------------------------------------
 *
 * Represents the C2B validation callback payload received from Safaricom
 * Daraja before a customer payment is confirmed.
 *
 * FinancialModule remains responsible for deciding whether a payment
 * can be accepted.
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

export class C2BValidationDto {
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

export default C2BValidationDto;
