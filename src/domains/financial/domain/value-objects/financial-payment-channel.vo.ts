// -----------------------------------------------------------------------------
// Financial Payment Channel Value Object
// -----------------------------------------------------------------------------
//
// Purpose:
// - Identifies how a customer makes a payment to SisiMove.
// - Distinguishes an SisiMove-initiated STK Push from a customer-initiated
//   M-PESA PayBill/Till payment received through the C2B callback.
//
// This value object does NOT:
// - Identify the payment provider (for example, M-PESA).
// - Identify the funding instrument/payment method (for example, MOBILE_MONEY).
// - Execute provider requests or process callbacks.
// - Change payment status, create attempts, or modify account balances.
//
// -----------------------------------------------------------------------------

export type FinancialPaymentChannelValue = 'STK_PUSH' | 'C2B';

export class FinancialPaymentChannel {
  private constructor(private readonly channel: FinancialPaymentChannelValue) {}

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(value: string): FinancialPaymentChannel {
    const normalized = value.trim().toUpperCase();

    if (!FinancialPaymentChannel.isValid(normalized)) {
      throw new Error(`Unsupported Financial Payment Channel: ${value}`);
    }

    return new FinancialPaymentChannel(normalized);
  }

  // ---------------------------------------------------------------------------
  // Type Guards
  // ---------------------------------------------------------------------------

  private static isValid(value: string): value is FinancialPaymentChannelValue {
    return value === 'STK_PUSH' || value === 'C2B';
  }

  // ---------------------------------------------------------------------------
  // Queries
  // ---------------------------------------------------------------------------

  public get value(): FinancialPaymentChannelValue {
    return this.channel;
  }

  public isStkPush(): boolean {
    return this.channel === 'STK_PUSH';
  }

  public isC2B(): boolean {
    return this.channel === 'C2B';
  }

  public equals(other: FinancialPaymentChannel): boolean {
    return this.channel === other.channel;
  }

  public toString(): string {
    return this.channel;
  }
}
