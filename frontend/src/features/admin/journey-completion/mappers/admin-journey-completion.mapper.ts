
import {
  AdminJourneyCompletionConfirmationRole,
  AdminJourneyCompletionConfirmationStatus,
  AdminJourneyCompletionDisputeReason,
  AdminJourneyCompletionDisputeStatus,
  AdminJourneyCompletionStatus,
} from '../models/admin-journey-completion.enums';

import type {
  AdminJourneyCompletion,
  AdminJourneyCompletionConfirmation,
  AdminJourneyCompletionDispute,
} from '../models/admin-journey-completion.model';

/**
 * API response types.
 *
 * Dates are represented as ISO strings by the HTTP API.
 * Optional nullable database fields are represented as string | null.
 */

interface ApiJourneyCompletionConfirmation {
  publicId: string;
  completionId: string;
  memberPublicId: string;
  bookingPublicId?: string | null;
  role: AdminJourneyCompletionConfirmationRole;
  status: AdminJourneyCompletionConfirmationStatus;
  confirmedAt: string;
  withdrawnAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ApiJourneyCompletionDispute {
  publicId: string;
  completionId: string;
  raisedByPublicId: string;
  reason: AdminJourneyCompletionDisputeReason;
  description?: string | null;
  status: AdminJourneyCompletionDisputeStatus;
  resolvedByPublicId?: string | null;
  resolutionSummary?: string | null;
  openedAt: string;
  resolvedAt?: string | null;
  rejectedAt?: string | null;
  withdrawnAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiAdminJourneyCompletion {
  publicId: string;
  journeyPublicId: string;
  providerPublicId: string;
  status: AdminJourneyCompletionStatus;
  completionRequestedAt?: string | null;
  confirmedAt?: string | null;
  disputedAt?: string | null;
  cancelledAt?: string | null;
  requiredConfirmations: number;
  confirmedCount: number;
  version: number;
  confirmations: ApiJourneyCompletionConfirmation[];
  disputes: ApiJourneyCompletionDispute[];
  createdAt: string;
  updatedAt: string;
}

export class AdminJourneyCompletionMapper {
  /**
   * Maps one API completion response to the frontend model.
   */
  static toModel(
    response: ApiAdminJourneyCompletion,
  ): AdminJourneyCompletion {
    return {
      publicId: response.publicId,
      journeyPublicId: response.journeyPublicId,
      providerPublicId: response.providerPublicId,
      status: response.status,

      completionRequestedAt:
        response.completionRequestedAt ?? undefined,

      confirmedAt: response.confirmedAt ?? undefined,
      disputedAt: response.disputedAt ?? undefined,
      cancelledAt: response.cancelledAt ?? undefined,

      requiredConfirmations: response.requiredConfirmations,
      confirmedCount: response.confirmedCount,
      version: response.version,

      confirmations: response.confirmations.map(
        (confirmation) => this.mapConfirmation(confirmation),
      ),

      disputes: response.disputes.map(
        (dispute) => this.mapDispute(dispute),
      ),

      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    };
  }

  /**
   * Maps a collection of API completion responses.
   */
  static toModelList(
    responses: ApiAdminJourneyCompletion[],
  ): AdminJourneyCompletion[] {
    return responses.map((response) => this.toModel(response));
  }

  /**
   * Maps one confirmation.
   */
  static mapConfirmation(
    response: ApiJourneyCompletionConfirmation,
  ): AdminJourneyCompletionConfirmation {
    return {
      publicId: response.publicId,
      completionId: response.completionId,
      memberPublicId: response.memberPublicId,
      bookingPublicId: response.bookingPublicId ?? undefined,
      role: response.role,
      status: response.status,
      confirmedAt: response.confirmedAt,
      withdrawnAt: response.withdrawnAt ?? undefined,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    };
  }

  /**
   * Maps one dispute.
   */
  static mapDispute(
    response: ApiJourneyCompletionDispute,
  ): AdminJourneyCompletionDispute {
    return {
      publicId: response.publicId,
      completionId: response.completionId,
      raisedByPublicId: response.raisedByPublicId,
      reason: response.reason,
      description: response.description ?? undefined,
      status: response.status,
      resolvedByPublicId: response.resolvedByPublicId ?? undefined,
      resolutionSummary: response.resolutionSummary ?? undefined,
      openedAt: response.openedAt,
      resolvedAt: response.resolvedAt ?? undefined,
      rejectedAt: response.rejectedAt ?? undefined,
      withdrawnAt: response.withdrawnAt ?? undefined,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    };
  }
}

export default AdminJourneyCompletionMapper;
