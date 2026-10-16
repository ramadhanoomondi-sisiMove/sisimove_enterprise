
"use client";

// -----------------------------------------------------------------------------
// Path: src/components/admin/layout/AdminShell.tsx
// -----------------------------------------------------------------------------
// sisiMove — Admin Shell
// -----------------------------------------------------------------------------

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState, type ReactNode } from "react";

import AdminHeader from "./AdminHeader";
import AdminMobileHeader from "./AdminMobileHeader";
import AdminSidebar from "./AdminSidebar";

interface AdminShellProps {
  readonly children: ReactNode;
}

export default function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setCollapsed((current) => !current);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setMobileOpen((current) => !current);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileOpen(false);
  }, []);

  // Close the drawer whenever navigation changes.
  // No effect-based state update is needed.
  const handleNavigate = closeMobileMenu;

  // Synchronize mobile drawer state with browser scrolling and keyboard input.
  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen, closeMobileMenu]);

  return (
    <div className="min-h-screen min-w-0 bg-[var(--background)] text-[var(--foreground)]">
      {/* Desktop sidebar: visible at lg and above */}
      <div className="fixed inset-y-0 left-0 z-30 hidden lg:block">
        <AdminSidebar
          pathname={pathname}
          collapsed={collapsed}
        />
      </div>

      {/* Desktop workspace */}
      <div
        className={[
          "hidden min-h-screen min-w-0 flex-col transition-[padding] duration-200 lg:flex",
          collapsed ? "lg:pl-[76px]" : "lg:pl-[260px]",
        ].join(" ")}
      >
        <AdminHeader
          collapsed={collapsed}
          onToggleSidebar={toggleSidebar}
        />

        <main className="min-w-0 flex-1 p-[clamp(1rem,2.5vw,2rem)]">
          {children}
        </main>
      </div>

      {/* Mobile workspace */}
      <div className="min-w-0 lg:hidden">
        <AdminMobileHeader
          mobileOpen={mobileOpen}
          onToggleMenu={toggleMobileMenu}
        />

        <main className="min-w-0 p-[clamp(0.75rem,3vw,1.5rem)]">
          {children}
        </main>

        {/* Mobile sidebar drawer */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-50 flex lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Admin navigation menu"
          >
            {/* Sidebar panel */}
            <div
              id="admin-mobile-navigation"
              className="h-full w-[min(84vw,260px)] shrink-0 overflow-hidden bg-white shadow-xl"
            >
              <AdminSidebar
                pathname={pathname}
                collapsed={false}
                onNavigate={handleNavigate}
              />
            </div>

            {/* Backdrop: tap to close */}
            <button
              type="button"
              aria-label="Close admin navigation"
              onClick={closeMobileMenu}
              className="min-w-0 flex-1 bg-slate-950/50"
            />
          </div>
        )}
      </div>
    </div>
  );
}
