export interface AdminAccountHoldMetrics {
  totalHolds: number;
  activeHolds: number;
  releasedHolds: number;
  capturedHolds: number;
  cancelledHolds: number;

  expiredActiveHolds: number;

  totalActiveHeldAmount: number;
  totalReleasedAmount: number;
  totalCapturedAmount: number;
  totalCancelledAmount: number;

  currency: string;
}