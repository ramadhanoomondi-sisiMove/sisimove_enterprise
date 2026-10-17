
import { Badge } from "@/components/ui/badge";

import type { BadgeVariant } from "@/components/ui/badge";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface VerificationRequestTypeBadgeProps {
  type: string;
  size?: "sm" | "md";
  className?: string;
}

// -----------------------------------------------------------------------------
// Type Presentation
// -----------------------------------------------------------------------------

interface TypePresentation {
  label: string;
  variant: BadgeVariant;
}

/**
 * Presentation mappings for verification request evidence types.
 *
 * Keep these values aligned with VerificationRequestType in the backend.
 */
const TYPE_PRESENTATION: Record<string, TypePresentation> = {
  PROFILE_PHOTO: {
    label: "Profile photo",
    variant: "brand",
  },
  GOVERNMENT_ID: {
    label: "Government ID",
    variant: "default",
  },
  DRIVER_LICENSE: {
    label: "Driver's license",
    variant: "success",
  },
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function VerificationRequestTypeBadge({
  type,
  size = "sm",
  className,
}: VerificationRequestTypeBadgeProps) {
  const normalizedType = type.trim().toUpperCase();

  const presentation = TYPE_PRESENTATION[normalizedType] ?? {
    label:
      normalizedType
        .toLowerCase()
        .replace(/[_-]+/g, " ")
        .replace(/\b\w/g, (character) => character.toUpperCase()) ||
      "Unknown type",
    variant: "outline" as const,
  };

  return (
    <Badge
      variant={presentation.variant}
      size={size}
      className={className}
      aria-label={`Verification evidence type: ${presentation.label}`}
    >
      {presentation.label}
    </Badge>
  );
}

export default VerificationRequestTypeBadge;
