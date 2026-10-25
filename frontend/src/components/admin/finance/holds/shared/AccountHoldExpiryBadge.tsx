
import { Badge } from '@/components/ui/badge';

export interface AccountHoldExpiryBadgeProps {
  expiresAt?: string | Date;
  hasExpiry: boolean;
  isExpired: boolean;
  size?: 'sm' | 'md';
}

export function AccountHoldExpiryBadge({
  expiresAt,
  hasExpiry,
  isExpired,
  size = 'sm',
}: AccountHoldExpiryBadgeProps) {
  if (!hasExpiry) {
    return (
      <Badge variant="default" size={size}>
        No expiry
      </Badge>
    );
  }

  if (isExpired) {
    return (
      <Badge variant="danger" size={size}>
        Expired
      </Badge>
    );
  }

  const expiryDate = expiresAt ? new Date(expiresAt) : null;
  const validExpiry =
    expiryDate && !Number.isNaN(expiryDate.getTime());

  return (
    <Badge
      variant="success"
      size={size}
      title={validExpiry ? expiryDate.toISOString() : undefined}
    >
      {validExpiry
        ? `Expires ${expiryDate.toLocaleDateString('en-KE', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}`
        : 'Expiry set'}
    </Badge>
  );
}
