
import type { AdminWithdrawal } from '../models/admin-withdrawal.model';
import {
  isAdminWithdrawalDestinationType,
  isAdminWithdrawalStatus,
} from '../models/admin-withdrawal.enums';

// -----------------------------------------------------------------------------
// Backend REST response
// -----------------------------------------------------------------------------

/**
 * Dates may arrive as ISO strings from JSON or as Date instances in tests.
 * Optional backend properties may be omitted when their value is undefined.
 */
export interface AdminWithdrawalResponse {
  publicId: string;
  accountPublicId: string;
  amount: number;
  currency: string;
  destinationType: string;
  destinationValue: string;
  status: string;

  referenceType?: string | null;
  referencePublicId?: string | null;
  disbursementPublicId?: string | null;

  requestedAt: string | Date;
  completedAt?: string | Date | null;
  failedAt?: string | Date | null;
  cancelledAt?: string | Date | null;

  createdAt: string | Date;
  updatedAt: string | Date;
}

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

export class AdminWithdrawalMapper {
  private constructor() {}

  /**
   * Maps a backend REST response into the frontend withdrawal model.
   */
  public static toModel(
    response: AdminWithdrawalResponse,
  ): AdminWithdrawal {
    if (!response || typeof response !== 'object') {
      throw new TypeError('Invalid withdrawal response.');
    }

    if (!isAdminWithdrawalStatus(response.status)) {
      throw new TypeError(
        `Invalid withdrawal status: ${response.status}`,
      );
    }

    if (!isAdminWithdrawalDestinationType(response.destinationType)) {
      throw new TypeError(
        `Invalid withdrawal destination type: ${response.destinationType}`,
      );
    }

    return {
      publicId: response.publicId,
      accountPublicId: response.accountPublicId,
      amount: response.amount,
      currency: response.currency,
      destinationType: response.destinationType,
      destinationValue: response.destinationValue,
      status: response.status,

      referenceType: response.referenceType ?? undefined,
      referencePublicId: response.referencePublicId ?? undefined,
      disbursementPublicId:
        response.disbursementPublicId ?? undefined,

      requestedAt: this.toIsoString(response.requestedAt),
      completedAt: this.toOptionalIsoString(response.completedAt),
      failedAt: this.toOptionalIsoString(response.failedAt),
      cancelledAt: this.toOptionalIsoString(response.cancelledAt),

      createdAt: this.toIsoString(response.createdAt),
      updatedAt: this.toIsoString(response.updatedAt),
    };
  }

  /**
   * Maps a collection of backend withdrawal responses.
   */
  public static toModels(
    responses: readonly AdminWithdrawalResponse[],
  ): AdminWithdrawal[] {
    return responses.map((response) => this.toModel(response));
  }

  // ---------------------------------------------------------------------------
  // Date normalization
  // ---------------------------------------------------------------------------

  private static toIsoString(value: string | Date): string {
    const date = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.getTime())) {
      throw new TypeError(`Invalid withdrawal date: ${String(value)}`);
    }

    return date.toISOString();
  }

  private static toOptionalIsoString(
    value?: string | Date | null,
  ): string | undefined {
    return value == null ? undefined : this.toIsoString(value);
  }
}
