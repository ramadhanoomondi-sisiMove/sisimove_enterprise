
// -----------------------------------------------------------------------------
// Admin Journey Settlement — Operations
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Command Metadata
// -----------------------------------------------------------------------------

export interface AdminJourneySettlementCommandMetadata {
  correlationId?: string;
  causationId?: string;
}

// -----------------------------------------------------------------------------
// Create Settlement
// -----------------------------------------------------------------------------

export interface AdminJourneySettlementCreateRequest
  extends AdminJourneySettlementCommandMetadata {
  completionId: string;
  journeyPublicId: string;
  providerPublicId: string;
}

// -----------------------------------------------------------------------------
// Submit Settlement
// -----------------------------------------------------------------------------

export interface AdminJourneySettlementSubmitRequest
  extends AdminJourneySettlementCommandMetadata {
  submittedAt?: string;
}

// -----------------------------------------------------------------------------
// Process Settlement
// -----------------------------------------------------------------------------

export interface AdminJourneySettlementProcessRequest
  extends AdminJourneySettlementCommandMetadata {
  processingAt?: string;
}

// -----------------------------------------------------------------------------
// Complete Settlement
// -----------------------------------------------------------------------------

export interface AdminJourneySettlementCompleteRequest
  extends AdminJourneySettlementCommandMetadata {
  financialTransactionPublicId: string;
  completedAt?: string;
}

// -----------------------------------------------------------------------------
// Fail Settlement
// -----------------------------------------------------------------------------

export interface AdminJourneySettlementFailRequest
  extends AdminJourneySettlementCommandMetadata {
  failureReason: string;
  failedAt?: string;
}

// -----------------------------------------------------------------------------
// Hold Settlement
// -----------------------------------------------------------------------------

export interface AdminJourneySettlementHoldRequest
  extends AdminJourneySettlementCommandMetadata {
  heldAt?: string;
}

// -----------------------------------------------------------------------------
// Cancel Settlement
// -----------------------------------------------------------------------------

export interface AdminJourneySettlementCancelRequest
  extends AdminJourneySettlementCommandMetadata {
  cancelledAt?: string;
}

// -----------------------------------------------------------------------------
// Operation Union
// -----------------------------------------------------------------------------

export type AdminJourneySettlementOperation =
  | {
      type: 'CREATE';
      payload: AdminJourneySettlementCreateRequest;
    }
  | {
      type: 'SUBMIT';
      journeySettlementPublicId: string;
      payload: AdminJourneySettlementSubmitRequest;
    }
  | {
      type: 'PROCESS';
      journeySettlementPublicId: string;
      payload: AdminJourneySettlementProcessRequest;
    }
  | {
      type: 'COMPLETE';
      journeySettlementPublicId: string;
      payload: AdminJourneySettlementCompleteRequest;
    }
  | {
      type: 'FAIL';
      journeySettlementPublicId: string;
      payload: AdminJourneySettlementFailRequest;
    }
  | {
      type: 'HOLD';
      journeySettlementPublicId: string;
      payload: AdminJourneySettlementHoldRequest;
    }
  | {
      type: 'CANCEL';
      journeySettlementPublicId: string;
      payload: AdminJourneySettlementCancelRequest;
    };
