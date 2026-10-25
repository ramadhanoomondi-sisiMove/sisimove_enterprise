export enum AdminAccountHoldStatus {
  ACTIVE = 'ACTIVE',
  RELEASED = 'RELEASED',
  CAPTURED = 'CAPTURED',
  CANCELLED = 'CANCELLED',
}

export enum AdminAccountHoldOperation {
  CAPTURE = 'CAPTURE',
  RELEASE = 'RELEASE',
  CANCEL = 'CANCEL',
}

export enum AdminAccountHoldReferenceType {
  JOURNEY_BOOKING = 'JOURNEY_BOOKING',
  JOURNEY_COMPLETION = 'JOURNEY_COMPLETION',
  COMMERCIAL_BOOKING = 'COMMERCIAL_BOOKING',
}