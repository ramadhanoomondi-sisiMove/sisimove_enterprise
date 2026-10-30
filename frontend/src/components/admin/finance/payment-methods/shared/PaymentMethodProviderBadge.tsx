// -----------------------------------------------------------------------------
// sisiMove Admin — Payment Method Provider Badge
// -----------------------------------------------------------------------------
//
// Displays a provider label using the shared Badge primitive.
// Provider values remain owned by the backend domain.
// -----------------------------------------------------------------------------

import { Badge } from '@/components/ui';

export interface PaymentMethodProviderBadgeProps {
  provider: string;
}

function formatProvider(provider: string): string {
  return provider
    .trim()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function PaymentMethodProviderBadge({
  provider,
}: PaymentMethodProviderBadgeProps) {
  return (
    <Badge variant="default" size="sm">
      {provider.trim() ? formatProvider(provider) : 'Unknown provider'}
    </Badge>
  );
}

export default PaymentMethodProviderBadge;