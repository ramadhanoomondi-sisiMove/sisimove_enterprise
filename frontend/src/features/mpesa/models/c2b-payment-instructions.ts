
/**
 * sisiMove — C2B Payment Instructions
 *
 * Member-facing instructions for making an M-PESA C2B payment.
 */

export type MpesaC2BBusinessType = 'PAYBILL' | 'BUY_GOODS';

export interface C2BPaymentInstructions {
  /** Payment provider. */
  provider: 'MPESA';

  /** Payment channel. */
  paymentMethod: 'C2B';

  /** Configured Safaricom business type. */
  businessType: MpesaC2BBusinessType;

  /** Safaricom PayBill or Till number. */
  shortcode: string;

  /**
   * Financial Account reference.
   * Available for PayBill account-level payments.
   */
  accountReference?: string;

  /** Payment currency. */
  currency: string;

  /** Instructions returned by the backend. */
  instructions: string;
}
