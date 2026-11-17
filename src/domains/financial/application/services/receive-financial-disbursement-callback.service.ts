/**
 * -----------------------------------------------------------------------------
 * Financial — Receive Disbursement Callback Service
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 *
 * - Receive normalized external disbursement callback events.
 * - Persist B2C result callbacks durably.
 * - Persist B2C queue-timeout callbacks durably.
 * - Preserve the original provider callback payload.
 * - Rely on repository idempotency to prevent duplicate records.
 *
 * Architecture:
 *
 * - FinancialModule owns callback persistence.
 * - The provider adapter validates and normalizes external payloads.
 * - This service does not communicate with external providers.
 * - This service does not process financial consequences.
 * - This service does not modify balances or disbursement aggregates.
 *
 * Transaction ownership remains with the application UnitOfWork.
 *
 * -----------------------------------------------------------------------------
 */

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Repository Token
// -----------------------------------------------------------------------------

import { FINANCIAL_DISBURSEMENT_CALLBACK_TOKENS } from '../financial-disbursement-callback.tokens';

// -----------------------------------------------------------------------------
// Repository Contract
// -----------------------------------------------------------------------------

import type {
  FinancialDisbursementCallbackRepository,
  FinancialDisbursementCallbackRecord,
} from '../../../financial-payment-providers/domain/repositories/financial-disbursement-callback.repository';

// =============================================================================
// Normalized Callback Contracts
// =============================================================================
//
// These structural contracts intentionally avoid importing M-PESA adapter
// types into the Financial application layer.
//
// =============================================================================

export interface ReceiveB2CResultCallbackInput {
  provider: 'MPESA';
  type: 'RESULT';

  resultType: number;
  resultCode: number;
  resultDescription: string;

  originatorConversationId: string;
  conversationId: string;

  transactionId?: string;

  resultParameters?: readonly unknown[];
}

export interface ReceiveB2CQueueTimeoutCallbackInput {
  provider: 'MPESA';
  type: 'QUEUE_TIMEOUT';

  originatorConversationId: string;
  conversationId?: string;

  resultCode?: number;
  resultDescription?: string;
}

// =============================================================================
// Service
// =============================================================================

@Injectable()
export class ReceiveFinancialDisbursementCallbackService {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(FINANCIAL_DISBURSEMENT_CALLBACK_TOKENS.REPOSITORY)
    private readonly callbackRepository: FinancialDisbursementCallbackRepository,
  ) {}

  // ===========================================================================
  // Receive B2C Result Callback
  // ===========================================================================

  /**
   * Persists a normalized B2C result callback.
   *
   * The original provider payload is preserved separately from the normalized
   * callback fields.
   *
   * A result code of zero or non-zero is stored as received. FinancialModule's
   * callback processor determines the appropriate financial consequences.
   */

  public async receiveResultCallback(
    event: ReceiveB2CResultCallbackInput,
    originalPayload: unknown,
  ): Promise<FinancialDisbursementCallbackRecord> {
    if (event.type !== 'RESULT' || event.provider !== 'MPESA') {
      throw new Error('Invalid M-PESA B2C result callback event.');
    }

    return this.callbackRepository.createIfNotExists({
      provider: event.provider,
      type: event.type,

      originatorConversationId: event.originatorConversationId,
      conversationId: event.conversationId,
      transactionId: event.transactionId ?? null,

      resultCode: event.resultCode,
      resultDesc: event.resultDescription,

      payload: originalPayload,
    });
  }

  // ===========================================================================
  // Receive B2C Queue Timeout Callback
  // ===========================================================================

  /**
   * Persists a normalized B2C queue-timeout callback.
   *
   * A queue timeout does not establish payout success or failure.
   *
   * This service only records the provider event. FinancialModule's
   * reconciliation process determines what happens next.
   */

  public async receiveQueueTimeoutCallback(
    event: ReceiveB2CQueueTimeoutCallbackInput,
    originalPayload: unknown,
  ): Promise<FinancialDisbursementCallbackRecord> {
    if (event.type !== 'QUEUE_TIMEOUT' || event.provider !== 'MPESA') {
      throw new Error('Invalid M-PESA B2C queue-timeout callback event.');
    }

    return this.callbackRepository.createIfNotExists({
      provider: event.provider,
      type: event.type,

      originatorConversationId: event.originatorConversationId,
      conversationId: event.conversationId ?? null,

      resultCode: event.resultCode ?? null,
      resultDesc: event.resultDescription ?? null,

      payload: originalPayload,
    });
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default ReceiveFinancialDisbursementCallbackService;
