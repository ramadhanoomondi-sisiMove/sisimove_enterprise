/**
 * sisiMove — Journey Settlement Response Mapper
 *
 * Maps flat API responses and nested settlement domain objects
 * into frontend settlement models.
 */

import type {
  JourneySettlement,
  JourneySettlementResponseModel,
} from '../models/journey-settlement.model';

type BackendDate = Date | string;

type NestedValue<T> = {
  _value: T;
};

type NestedStatus = {
  props: {
    value: string;
  };
};

interface FlatSettlementResponse {
  publicId: string;
  completionId: string;
  journeyPublicId: string;
  providerPublicId: string;
  financialTransactionPublicId?: string | null;
  status: string;
  submittedAt?: BackendDate | null;
  processingAt?: BackendDate | null;
  completedAt?: BackendDate | null;
  failedAt?: BackendDate | null;
  heldAt?: BackendDate | null;
  cancelledAt?: BackendDate | null;
  failureReason?: string | null;
  version: number;
  createdAt: BackendDate;
  updatedAt: BackendDate;
}

interface NestedSettlementResponse {
  _id?: NestedValue<string>;
  _publicId?: NestedValue<string>;
  props: {
    publicId: NestedValue<string>;
    completionId: NestedValue<string>;
    journeyPublicId: NestedValue<string>;
    providerPublicId: NestedValue<string>;
    financialTransactionPublicId?: NestedValue<string> | null;
    status: NestedStatus;
    submittedAt?: BackendDate | null;
    processingAt?: BackendDate | null;
    completedAt?: BackendDate | null;
    failedAt?: BackendDate | null;
    heldAt?: BackendDate | null;
    cancelledAt?: BackendDate | null;
    failureReason?: string | null;
    version: number;
    createdAt: BackendDate;
    updatedAt: BackendDate;
  };
}

export type JourneySettlementBackendResponse =
  | FlatSettlementResponse
  | NestedSettlementResponse;

function isNestedResponse(
  response: JourneySettlementBackendResponse,
): response is NestedSettlementResponse {
  return 'props' in response && response.props != null;
}

function unwrap<T>(
  value: NestedValue<T> | T | null | undefined,
): T | null | undefined {
  if (value == null) return value;

  if (
    typeof value === 'object' &&
    '_value' in value
  ) {
    return (value as NestedValue<T>)._value;
  }

  return value as T;
}

function normalizeResponse(
  response: JourneySettlementBackendResponse,
): FlatSettlementResponse {
  if (!isNestedResponse(response)) {
    return response;
  }

  const props = response.props;

  return {
    publicId: unwrap(props.publicId) ?? unwrap(response._publicId) ?? '',
    completionId: unwrap(props.completionId) ?? '',
    journeyPublicId: unwrap(props.journeyPublicId) ?? '',
    providerPublicId: unwrap(props.providerPublicId) ?? '',
    financialTransactionPublicId:
      unwrap(props.financialTransactionPublicId) ?? null,
    status: props.status?.props?.value ?? '',
    submittedAt: props.submittedAt,
    processingAt: props.processingAt,
    completedAt: props.completedAt,
    failedAt: props.failedAt,
    heldAt: props.heldAt,
    cancelledAt: props.cancelledAt,
    failureReason: props.failureReason ?? null,
    version: props.version,
    createdAt: props.createdAt,
    updatedAt: props.updatedAt,
  };
}

function toIsoString(
  value: BackendDate | null | undefined,
  field: string,
): string {
  if (value == null || value === '') {
    throw new Error(
      `Missing required date in JourneySettlementResponseMapper: ${field}`,
    );
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(
      `Invalid date received by JourneySettlementResponseMapper: ${field}`,
    );
  }

  return date.toISOString();
}

function toNullableIsoString(
  value: BackendDate | null | undefined,
  field: string,
): string | null {
  if (value == null || value === '') return null;

  return toIsoString(value, field);
}

export class JourneySettlementResponseMapper {
  static toModel(
    input: JourneySettlementBackendResponse,
  ): JourneySettlementResponseModel {
    const response = normalizeResponse(input);

    return {
      publicId: response.publicId,
      completionId: response.completionId,
      journeyPublicId: response.journeyPublicId,
      providerPublicId: response.providerPublicId,
      financialTransactionPublicId:
        response.financialTransactionPublicId ?? null,
      status: response.status,

      submittedAt: toNullableIsoString(
        response.submittedAt,
        'submittedAt',
      ),
      processingAt: toNullableIsoString(
        response.processingAt,
        'processingAt',
      ),
      completedAt: toNullableIsoString(
        response.completedAt,
        'completedAt',
      ),
      failedAt: toNullableIsoString(
        response.failedAt,
        'failedAt',
      ),
      heldAt: toNullableIsoString(
        response.heldAt,
        'heldAt',
      ),
      cancelledAt: toNullableIsoString(
        response.cancelledAt,
        'cancelledAt',
      ),

      failureReason: response.failureReason ?? null,
      version: response.version,
      createdAt: toIsoString(response.createdAt, 'createdAt'),
      updatedAt: toIsoString(response.updatedAt, 'updatedAt'),
    };
  }

  static toModels(
    responses: JourneySettlementBackendResponse[],
  ): JourneySettlement[] {
    return responses.map((response) =>
      JourneySettlementResponseMapper.toModel(response),
    );
  }
}

export default JourneySettlementResponseMapper;