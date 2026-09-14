// -----------------------------------------------------------------------------
// sisiMove — Public Journey Pricing
// -----------------------------------------------------------------------------
//
// Public price representation for a Journey.
//
// No commission, settlement, provider-income, wallet, or accounting data
// belongs in the public Journey pricing model.
// -----------------------------------------------------------------------------

export interface PublicJourneyPricing {
  amount: number;
  currency: string;
}