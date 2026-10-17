
import { Badge } from "@/components/ui/badge";

import type { BadgeVariant } from "@/components/ui/badge";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type VerificationLevel =
  | "NONE"
  | "MEMBER"
  | "DRIVER";

export interface VerificationLevelBadgeProps {
  level: VerificationLevel | string;
  size?: "sm" | "md";
  className?: string;
}

// -----------------------------------------------------------------------------
// Level Presentation
// -----------------------------------------------------------------------------

interface LevelPresentation {
  label: string;
  variant: BadgeVariant;
}

const LEVEL_PRESENTATION: Record<string, LevelPresentation> = {
  NONE: {
    label: "Unverified",
    variant: "default",
  },
  MEMBER: {
    label: "Member",
    variant: "brand",
  },
  DRIVER: {
    label: "Driver",
    variant: "success",
  },
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function VerificationLevelBadge({
  level,
  size = "sm",
  className,
}: VerificationLevelBadgeProps) {
  const normalizedLevel = level.trim().toUpperCase();

  const presentation = LEVEL_PRESENTATION[normalizedLevel] ?? {
    label:
      level
        .trim()
        .toLowerCase()
        .replace(/[_-]+/g, " ")
        .replace(/\b\w/g, (character) => character.toUpperCase()) ||
      "Unknown",
    variant: "outline" as const,
  };

  return (
    <Badge
      variant={presentation.variant}
      size={size}
      className={className}
      aria-label={`Verification level: ${presentation.label}`}
    >
      {presentation.label}
    </Badge>
  );
}

export default VerificationLevelBadge;
