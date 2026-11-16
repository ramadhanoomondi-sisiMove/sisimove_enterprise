/**
 * -----------------------------------------------------------------------------
 * SisiMove — M-PESA Daraja 3.0 B2C Queue Timeout DTO
 * -----------------------------------------------------------------------------
 *
 * Represents the queue timeout callback payload received from Safaricom
 * Daraja when a B2C request cannot be processed within the provider's
 * expected queue processing period.
 *
 * This DTO describes the provider payload only.
 * FinancialModule owns disbursement reconciliation and financial effects.
 * -----------------------------------------------------------------------------
 */

import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';

// =============================================================================
// QUEUE TIMEOUT RESULT
// =============================================================================

export class B2CQueueTimeoutResultDto {
  /**
   * Original SisiMove request correlation identifier supplied to Daraja.
   */
  @IsString()
  @IsNotEmpty()
  public readonly OriginatorConversationID!: string;

  /**
   * Daraja conversation identifier, when supplied.
   */
  @IsOptional()
  @IsString()
  public readonly ConversationID?: string;

  /**
   * Provider timeout description.
   */
  @IsString()
  @IsNotEmpty()
  public readonly ResultDesc!: string;
}

// =============================================================================
// CALLBACK
// =============================================================================

export class B2CQueueTimeoutDto {
  @IsObject()
  @ValidateNested()
  @Type(() => B2CQueueTimeoutResultDto)
  public readonly Result!: B2CQueueTimeoutResultDto;
}

export default B2CQueueTimeoutDto;
