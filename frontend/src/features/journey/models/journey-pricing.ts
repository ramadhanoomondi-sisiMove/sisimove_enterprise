// -----------------------------------------------------------------------------
// sisiMove — Journey Pricing Model
// -----------------------------------------------------------------------------
//
// Represents the Journey's cost-sharing price.
//
// amount is represented as an integer minor-unit amount, consistent with the
// backend financial convention.
//
// For KES:
//   1500 => KES 15.00
//
// The frontend should not use floating-point arithmetic for monetary operations.
// -----------------------------------------------------------------------------

export interface JourneyPricing {
  publicId: string;

  amount: number;

  currency: string;
}