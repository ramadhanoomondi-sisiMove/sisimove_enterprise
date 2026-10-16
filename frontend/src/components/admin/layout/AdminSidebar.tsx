
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  BadgeCheck,
  BriefcaseBusiness,
  ClipboardList,
  CreditCard,
  FileSearch,
  LayoutDashboard,
  LogOut,
  Route,
  ShieldCheck,
  Store,
  Users,
  Wallet,
  MonitorSmartphone,
} from "lucide-react";

import { ADMIN_ROUTES } from "@/foundation/routing/admin-routes";
import { AUTHENTICATED_ROUTES } from "@/foundation/routing/authenticated-routes";
import { useLogout } from "@/features/authentication/logout";

const NAVIGATION_GROUPS = [
  {
    label: "Platform Overview",
    items: [
      {
        label: "Overview",
        href: ADMIN_ROUTES.HOME,
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "People & Trust",
    items: [
      {
        label: "Members",
        href: ADMIN_ROUTES.MEMBERS,
        icon: Users,
      },
      {
        label: "Verifications",
        href: ADMIN_ROUTES.VERIFICATIONS,
        icon: BadgeCheck,
      },
      {
        label: "Verification Requests",
        href: ADMIN_ROUTES.VERIFICATION_REQUESTS,
        icon: ClipboardList,
      },
      {
        label: "Trust & Reputation",
        href: ADMIN_ROUTES.TRUST,
        icon: ShieldCheck,
      },
      {
        label: "Assets",
        href: ADMIN_ROUTES.ASSETS,
        icon: FileSearch,
      },
    ],
  },
  {
    label: "Journey Operations",
    items: [
      {
        label: "Journeys",
        href: ADMIN_ROUTES.JOURNEYS,
        icon: Route,
      },
      {
        label: "Bookings",
        href: ADMIN_ROUTES.BOOKINGS,
        icon: ClipboardList,
      },
      {
        label: "Booking Cancellations",
        href: ADMIN_ROUTES.BOOKING_CANCELLATIONS,
        icon: Activity,
      },
      {
        label: "Boarding",
        href: ADMIN_ROUTES.BOARDING,
        icon: BriefcaseBusiness,
      },
    ],
  },
  {
    label: "Finance & Transactions",
    items: [
      {
        label: "Payments",
        href: ADMIN_ROUTES.PAYMENTS,
        icon: Wallet,
      },
      {
        label: "Transactions",
        href: ADMIN_ROUTES.TRANSACTIONS,
        icon: CreditCard,
      },
    ],
  },
  {
    label: "Security & Governance",
    items: [
      {
        label: "Authentications",
        href: ADMIN_ROUTES.AUTHENTICATIONS,
        icon: ShieldCheck,
      },
      {
        label: "Sessions",
        href: ADMIN_ROUTES.SESSIONS,
        icon: MonitorSmartphone,
      },
      {
        label: "Devices",
        href: ADMIN_ROUTES.DEVICES,
        icon: MonitorSmartphone,
      },
      {
        label: "Recoveries",
        href: ADMIN_ROUTES.RECOVERIES,
        icon: Activity,
      },
      {
        label: "Roles",
        href: ADMIN_ROUTES.ROLES,
        icon: ShieldCheck,
      },
      {
        label: "Permissions",
        href: ADMIN_ROUTES.PERMISSIONS,
        icon: BadgeCheck,
      },
      {
        label: "Role Assignments",
        href: ADMIN_ROUTES.IDENTITY_ROLES,
        icon: Users,
      },
      {
        label: "Audit Log",
        href: ADMIN_ROUTES.AUDIT_LOG,
        icon: Activity,
      },
    ],
  },
] as const;

function isNavigationActive(pathname: string, href: string) {
  if (href === ADMIN_ROUTES.HOME) {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

interface AdminSidebarProps {
  pathname: string;
  collapsed: boolean;
  onNavigate?: () => void;
}

export default function AdminSidebar({
  pathname,
  collapsed,
  onNavigate,
}: AdminSidebarProps) {
  const router = useRouter();
  const { logout, isLoggingOut } = useLogout();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/login");
    } catch {
      // Preserve the current page if logout fails.
      // The logout hook retains its error state.
    }
  };

  return (
    <aside
      className={[
        "flex h-full flex-col border-r border-slate-200 bg-white",
        collapsed ? "w-[76px]" : "w-[260px]",
      ].join(" ")}
    >
      {/* Brand */}
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-100 px-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
          sM
        </div>

        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-900">
              sisiMove
            </p>
            <p className="text-xs text-slate-500">
              Super Admin
            </p>
          </div>
        )}
      </div>

      {/* Grouped navigation */}
      <nav
        aria-label="Super Admin navigation"
        className="flex-1 space-y-4 overflow-y-auto p-3"
      >
        {NAVIGATION_GROUPS.map((group) => (
          <section key={group.label}>
            {!collapsed && (
              <p className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                {group.label}
              </p>
            )}

            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isNavigationActive(
                  pathname,
                  item.href,
                );

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    title={collapsed ? item.label : undefined}
                    aria-current={active ? "page" : undefined}
                    className={[
                      "flex min-h-10 items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      collapsed ? "justify-center" : "",
                      active
                        ? "bg-blue-50 font-semibold text-blue-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                    ].join(" ")}
                  >
                    <Icon className="h-[18px] w-[18px] shrink-0" />

                    {!collapsed && (
                      <span className="truncate">
                        {item.label}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </nav>

      {/* Footer actions */}
      <div className="space-y-3 border-t border-slate-100 p-4">
        <Link
          href={AUTHENTICATED_ROUTES.HOME}
          onClick={onNavigate}
          title={collapsed ? "Open Main App" : undefined}
          className={[
            "flex min-h-10 w-full items-center gap-3 rounded-lg px-3 py-2",
            "text-sm text-slate-600 transition-colors",
            "hover:bg-blue-50 hover:text-blue-700",
            collapsed ? "justify-center" : "",
          ].join(" ")}
        >
          <Store className="h-[18px] w-[18px] shrink-0" />

          {!collapsed && (
            <span className="truncate">Open Main App</span>
          )}
        </Link>

        {!collapsed && (
          <p className="text-xs leading-5 text-slate-500">
            Platform-wide administration
            <br />
            Access subject to permissions
          </p>
        )}

        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          title={collapsed ? "Log out" : undefined}
          aria-label={isLoggingOut ? "Logging out" : "Log out"}
          className={[
            "flex min-h-10 w-full items-center gap-3 rounded-lg px-3 py-2",
            "text-sm text-red-600 transition-colors",
            "hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60",
            collapsed ? "justify-center" : "",
          ].join(" ")}
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" />

          {!collapsed && (
            <span>
              {isLoggingOut ? "Logging out..." : "Log out"}
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
