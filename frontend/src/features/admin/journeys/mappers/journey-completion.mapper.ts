/**
 * sisiMove — Journey Completion Response Mapper
 *
 * Normalizes both the flat API contract and the nested domain-object response
 * currently returned by GET /journey-completions/by-journey/:journeyPublicId.
 * Optional lifecycle timestamps are allowed to be absent or null.
 */

type DateInput = Date | string | null | undefined;
type UnknownRecord = Record<string, unknown>;

export interface JourneyCompletionConfirmationResponseModel {
  publicId: string;
  completionId: string;
  memberPublicId: string;
  bookingPublicId: string | null;
  role: string;
  status: string;
  confirmedAt: string | null;
  withdrawnAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface JourneyCompletionDisputeResponseModel {
  publicId: string;
  completionId: string;
  raisedByPublicId: string;
  reason: string;
  description: string | null;
  status: string;
  resolvedByPublicId: string | null;
  resolutionSummary: string | null;
  openedAt: string;
  resolvedAt: string | null;
  rejectedAt: string | null;
  withdrawnAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface JourneyCompletionResponseModel {
  publicId: string;
  journeyPublicId: string;
  providerPublicId: string;
  status: string;
  completionRequestedAt: string | null;
  confirmedAt: string | null;
  disputedAt: string | null;
  cancelledAt: string | null;
  requiredConfirmations: number;
  confirmedCount: number;
  version: number;
  confirmations: JourneyCompletionConfirmationResponseModel[];
  disputes: JourneyCompletionDisputeResponseModel[];
  createdAt: string;
  updatedAt: string;
}

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function record(value: unknown): UnknownRecord {
  return isRecord(value) ? value : {};
}

function unwrapValue(value: unknown): unknown {
  if (!isRecord(value)) return value;
  if ('_value' in value) return value._value;
  if ('props' in value && isRecord(value.props) && 'value' in value.props) {
    return value.props.value;
  }
  return value;
}

function read(source: UnknownRecord, key: string): unknown {
  return source[key];
}

function readString(source: UnknownRecord, key: string): string {
  const value = unwrapValue(read(source, key));
  if (typeof value === 'string' && value.trim()) return value.trim();
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return '';
}

function readOptionalString(source: UnknownRecord, key: string): string | null {
  const value = unwrapValue(read(source, key));
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function readNumber(source: UnknownRecord, key: string): number {
  const value = unwrapValue(read(source, key));
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function dateToIso(value: DateInput, field: string, required = false): string | null {
  if (value === null || value === undefined || value === '') {
    if (required) throw new Error(`Missing required date in JourneyCompletionResponseMapper: ${field}`);
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date received by JourneyCompletionResponseMapper: ${field}`);
  }
  return date.toISOString();
}

function readDate(
  source: UnknownRecord,
  key: string,
  fieldPrefix: string,
  required = false,
): string | null {
  const value = read(source, key);
  if (value instanceof Date || typeof value === 'string' || value == null) {
    return dateToIso(value as DateInput, `${fieldPrefix}.${key}`, required);
  }
  return dateToIso(unwrapValue(value) as DateInput, `${fieldPrefix}.${key}`, required);
}

function nestedProps(response: UnknownRecord): UnknownRecord {
  const props = record(response.props);
  return Object.keys(props).length > 0 ? props : response;
}

function mapConfirmation(value: unknown, index: number): JourneyCompletionConfirmationResponseModel {
  const raw = record(value);
  const source = nestedProps(raw);
  return {
    publicId: readString(source, 'publicId') || readString(raw, '_publicId'),
    completionId: readString(source, 'completionId'),
    memberPublicId: readString(source, 'memberPublicId'),
    bookingPublicId: readOptionalString(source, 'bookingPublicId'),
    role: readString(source, 'role'),
    status: readString(source, 'status'),
    confirmedAt: readDate(source, 'confirmedAt', `confirmations[${index}]`),
    withdrawnAt: readDate(source, 'withdrawnAt', `confirmations[${index}]`),
    createdAt: readDate(source, 'createdAt', `confirmations[${index}]`, true)!,
    updatedAt: readDate(source, 'updatedAt', `confirmations[${index}]`, true)!,
  };
}

function mapDispute(value: unknown, index: number): JourneyCompletionDisputeResponseModel {
  const raw = record(value);
  const source = nestedProps(raw);
  return {
    publicId: readString(source, 'publicId') || readString(raw, '_publicId'),
    completionId: readString(source, 'completionId'),
    raisedByPublicId: readString(source, 'raisedByPublicId'),
    reason: readString(source, 'reason'),
    description: readOptionalString(source, 'description'),
    status: readString(source, 'status'),
    resolvedByPublicId: readOptionalString(source, 'resolvedByPublicId'),
    resolutionSummary: readOptionalString(source, 'resolutionSummary'),
    openedAt: readDate(source, 'openedAt', `disputes[${index}]`, true)!,
    resolvedAt: readDate(source, 'resolvedAt', `disputes[${index}]`),
    rejectedAt: readDate(source, 'rejectedAt', `disputes[${index}]`),
    withdrawnAt: readDate(source, 'withdrawnAt', `disputes[${index}]`),
    createdAt: readDate(source, 'createdAt', `disputes[${index}]`, true)!,
    updatedAt: readDate(source, 'updatedAt', `disputes[${index}]`, true)!,
  };
}

export class JourneyCompletionResponseMapper {
  static toModel(input: unknown): JourneyCompletionResponseModel {
    const raw = record(input);
    const source = nestedProps(raw);
    const confirmations = read(source, 'confirmations');
    const disputes = read(source, 'disputes');

    const publicId = readString(source, 'publicId') || readString(raw, '_publicId');
    const completionRequestedAt = readDate(source, 'completionRequestedAt', 'completion');
    const confirmedAt = readDate(source, 'confirmedAt', 'completion');
    const disputedAt = readDate(source, 'disputedAt', 'completion');
    const cancelledAt = readDate(source, 'cancelledAt', 'completion');

    return {
      publicId,
      journeyPublicId: readString(source, 'journeyPublicId'),
      providerPublicId: readString(source, 'providerPublicId'),
      status: readString(source, 'status'),
      completionRequestedAt,
      confirmedAt,
      disputedAt,
      cancelledAt,
      requiredConfirmations: readNumber(source, 'requiredConfirmations'),
      confirmedCount: readNumber(source, 'confirmedCount'),
      version: readNumber(source, 'version'),
      confirmations: Array.isArray(confirmations) ? confirmations.map(mapConfirmation) : [],
      disputes: Array.isArray(disputes) ? disputes.map(mapDispute) : [],
      createdAt: readDate(source, 'createdAt', 'completion', true)!,
      updatedAt: readDate(source, 'updatedAt', 'completion', true)!,
    };
  }

  static toModels(inputs: unknown[]): JourneyCompletionResponseModel[] {
    return inputs.map((input) => this.toModel(input));
  }
}

export default JourneyCompletionResponseMapper;
