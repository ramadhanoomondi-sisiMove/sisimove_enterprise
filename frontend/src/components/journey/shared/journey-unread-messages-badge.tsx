
import Link from "next/link";
import { MessageCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export interface JourneyUnreadMessagesBadgeProps {
  readonly count: number;
  readonly href: string;
  readonly className?: string;
}

export function JourneyUnreadMessagesBadge({
  count,
  href,
  className,
}: JourneyUnreadMessagesBadgeProps) {
  const unreadCount =
    Number.isFinite(count) && count > 0 ? Math.floor(count) : 0;

  const hasUnreadMessages = unreadCount > 0;

  const tooltip = hasUnreadMessages
    ? `You have ${unreadCount} unread ${
        unreadCount === 1 ? "message" : "messages"
      } from this Journey`
    : "Message Journey participants";

  return (
    <span className="group relative inline-flex">
      <Link
        href={href}
        aria-label={`${tooltip}. Open Journey messages.`}
        title={tooltip}
        className={[
          "inline-flex rounded-full",
          "transition-all duration-200 ease-out",
          "hover:-translate-y-0.5 hover:shadow-md",
          "active:translate-y-0 active:scale-[0.98]",
          "focus-visible:outline-none",
          "focus-visible:ring-2",
          "focus-visible:ring-[var(--brand)]",
          "focus-visible:ring-offset-2",
        ].join(" ")}
      >
        <Badge
          variant="outline"
          size="sm"
          className={[
            "gap-1.5 border",
            "transition-colors duration-200",
            hasUnreadMessages
              ? [
                  "border-[var(--danger)]",
                  "bg-[var(--danger-soft)]",
                  "text-[var(--danger)]",
                  "group-hover:border-[var(--danger)]",
                ].join(" ")
              : [
                  "border-[var(--border)]",
                  "bg-[var(--background-subtle)]",
                  "text-[var(--foreground-secondary)]",
                  "group-hover:border-[var(--brand)]",
                  "group-hover:text-[var(--brand)]",
                ].join(" "),
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          leadingContent={
            <MessageCircle
              className={[
                "size-3.5",
                "transition-transform duration-200",
                "group-hover:rotate-[-8deg]",
                hasUnreadMessages ? "group-hover:scale-110" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-hidden="true"
            />
          }
        >
          Messages
          <span className="ml-1 font-semibold tabular-nums">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        </Badge>
      </Link>

      {/* Helpful tooltip shown on hover and keyboard focus */}
      <span
        role="tooltip"
        className={[
          "pointer-events-none absolute bottom-full left-1/2 z-50 mb-2",
          "-translate-x-1/2 translate-y-1 opacity-0",
          "whitespace-nowrap rounded-md",
          "bg-[var(--foreground)] px-3 py-1.5",
          "text-xs font-medium text-[var(--surface)]",
          "shadow-lg",
          "transition-all duration-200 ease-out",
          "group-hover:translate-y-0 group-hover:opacity-100",
          "group-focus-within:translate-y-0",
          "group-focus-within:opacity-100",
        ].join(" ")}
      >
        {tooltip}
        <span
          aria-hidden="true"
          className={[
            "absolute left-1/2 top-full -translate-x-1/2",
            "border-[5px] border-transparent",
            "border-t-[var(--foreground)]",
          ].join(" ")}
        />
      </span>
    </span>
  );
}
