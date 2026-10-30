
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  Award,
  BadgeCheck,
  Banknote,
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  CreditCard,
  FileSearch,
  Landmark,
  LayoutDashboard,
  LogOut,
  Network,
  ReceiptText,
  Route,
  Scale,
  ShieldAlert,
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
        label: "Finance Control Center",
        href: ADMIN_ROUTES.FINANCE_HOME,
        icon: Wallet,
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

const TRUST_CHILDREN = [
  {
    label: "Trust Profiles",
    href: ADMIN_ROUTES.TRUST_PROFILES,
    icon: Users,
  },
  {
    label: "Ratings",
    href: ADMIN_ROUTES.TRUST_RATINGS,
    icon: Award,
  },
  {
    label: "Reviews",
    href: ADMIN_ROUTES.TRUST_REVIEWS,
    icon: ClipboardList,
  },
  {
    label: "Badges",
    href: ADMIN_ROUTES.TRUST_BADGES,
    icon: Award,
  },
  {
    label: "Moderation",
    href: ADMIN_ROUTES.TRUST_MODERATION,
    icon: ShieldAlert,
  },
  {
    label: "Trust Events",
    href: ADMIN_ROUTES.TRUST_EVENTS,
    icon: Activity,
  },
] as const;

const FINANCE_CHILDREN = [
  {
    label: "Overview",
    href: ADMIN_ROUTES.FINANCE_HOME,
    icon: LayoutDashboard,
  },
  {
    label: "Accounts & Balances",
    href: ADMIN_ROUTES.FINANCE_ACCOUNTS,
    icon: Building2,
  },
  {
    label: "Payments",
    href: ADMIN_ROUTES.FINANCE_PAYMENTS,
    icon: Wallet,
  },
  {
    label: "Payment Methods",
    href: ADMIN_ROUTES.FINANCE_PAYMENT_METHODS,
    icon: CreditCard,
  },
  {
    label: "Payment Providers",
    href: ADMIN_ROUTES.FINANCE_PROVIDERS,
    icon: Network,
  },
  {
    label: "Transactions & Ledger",
    href: ADMIN_ROUTES.FINANCE_TRANSACTIONS,
    icon: CreditCard,
  },
  {
    label: "Booking Payments",
    href: ADMIN_ROUTES.FINANCE_BOOKING_PAYMENTS,
    icon: ReceiptText,
  },
  {
    label: "Commissions",
    href: ADMIN_ROUTES.FINANCE_COMMISSIONS,
    icon: Banknote,
  },
  {
    label: "Settlements",
    href: ADMIN_ROUTES.FINANCE_SETTLEMENTS,
    icon: Scale,
  },
  {
    label: "Provider Settlements",
    href: ADMIN_ROUTES.FINANCE_PROVIDER_SETTLEMENTS,
    icon: Users,
  },
  {
    label: "Disbursements",
    href: ADMIN_ROUTES.FINANCE_DISBURSEMENTS,
    icon: Banknote,
  },
  {
    label: "Withdrawals",
    href: ADMIN_ROUTES.FINANCE_WITHDRAWALS,
    icon: Wallet,
  },
  {
    label: "Account Holds",
    href: ADMIN_ROUTES.FINANCE_HOLDS,
    icon: ShieldAlert,
  },
  {
    label: "Accounting",
    href: ADMIN_ROUTES.FINANCE_ACCOUNTING,
    icon: Landmark,
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

  const isTrustRoute = isNavigationActive(pathname, ADMIN_ROUTES.TRUST);
  const isFinanceRoute = isNavigationActive(
    pathname,
    ADMIN_ROUTES.FINANCE_HOME,
  );

  const [trustExpanded, setTrustExpanded] = useState(isTrustRoute);
  const [financeExpanded, setFinanceExpanded] = useState(isFinanceRoute);

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
            <p className="text-xs text-slate-500">Super Admin</p>
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
                const active = isNavigationActive(pathname, item.href);
                const isTrustParent = item.href === ADMIN_ROUTES.TRUST;
                const isFinanceParent =
                  item.href === ADMIN_ROUTES.FINANCE_HOME;

                if (isTrustParent || isFinanceParent) {
                  const children = isTrustParent
                    ? TRUST_CHILDREN
                    : FINANCE_CHILDREN;

                  const expanded = isTrustParent
                    ? trustExpanded
                    : financeExpanded;

                  const setExpanded = isTrustParent
                    ? setTrustExpanded
                    : setFinanceExpanded;

                  const parentLabel = isTrustParent
                    ? "Trust & Reputation"
                    : "Finance Control Center";

                  const childrenId = isTrustParent
                    ? "trust-navigation-children"
                    : "finance-navigation-children";

                  return (
                    <div key={item.href} className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Link
                          href={item.href}
                          onClick={onNavigate}
                          title={collapsed ? item.label : undefined}
                          aria-current={
                            pathname === item.href ? "page" : undefined
                          }
                          className={[
                            "flex min-h-10 min-w-0 flex-1 items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                            collapsed ? "justify-center" : "",
                            active
                              ? "bg-blue-50 font-semibold text-blue-700"
                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                          ].join(" ")}
                        >
                          <Icon className="h-[18px] w-[18px] shrink-0" />
                          {!collapsed && (
                            <span className="truncate">{item.label}</span>
                          )}
                        </Link>

                        {!collapsed && (
                          <button
                            type="button"
                            onClick={() =>
                              setExpanded((value) => !value)
                            }
                            aria-label={
                              expanded
                                ? `Collapse ${parentLabel} submenu`
                                : `Expand ${parentLabel} submenu`
                            }
                            aria-expanded={expanded}
                            aria-controls={childrenId}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                          >
                            {expanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </button>
                        )}
                      </div>

                      {(expanded || collapsed) && (
                        <div
                          id={childrenId}
                          className={
                            collapsed
                              ? "space-y-1"
                              : "ml-5 space-y-1 border-l border-slate-200 pl-3"
                          }
                        >
                          {children.map((child) => {
                            const ChildIcon = child.icon;

                            const childActive =
                              child.href === ADMIN_ROUTES.FINANCE_HOME
                                ? pathname === child.href
                                : isNavigationActive(pathname, child.href);

                            return (
                              <Link
                                key={child.href}
                                href={child.href}
                                onClick={onNavigate}
                                title={collapsed ? child.label : undefined}
                                aria-current={
                                  childActive ? "page" : undefined
                                }
                                className={[
                                  "flex min-h-9 items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                                  collapsed ? "justify-center" : "",
                                  childActive
                                    ? "bg-blue-50 font-semibold text-blue-700"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                                ].join(" ")}
                              >
                                <ChildIcon className="h-4 w-4 shrink-0" />
                                {!collapsed && (
                                  <span className="truncate">
                                    {child.label}
                                  </span>
                                )}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

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
                      <span className="truncate">{item.label}</span>
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
          {!collapsed && <span className="truncate">Open Main App</span>}
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
            <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
          )}
        </button>
      </div>
    </aside>
  );
}
