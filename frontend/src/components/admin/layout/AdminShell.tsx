"use client";

import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

import AdminHeader from "./AdminHeader";
import AdminMobileHeader from "./AdminMobileHeader";
import AdminSidebar from "./AdminSidebar";

interface AdminShellProps {
  children: ReactNode;
}

export default function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="fixed inset-y-0 left-0 z-30 hidden lg:block">
        <AdminSidebar pathname={pathname} collapsed={collapsed} />
      </div>

      <div
        className={[
          "hidden min-h-screen flex-col transition-[padding] duration-200 lg:flex",
          collapsed ? "lg:pl-[76px]" : "lg:pl-[260px]",
        ].join(" ")}
      >
        <AdminHeader
          collapsed={collapsed}
          onToggleSidebar={() => setCollapsed((value) => !value)}
        />

        <main className="min-w-0 flex-1 p-5 sm:p-8">
          {children}
        </main>
      </div>

      <div className="lg:hidden">
        <AdminMobileHeader
          mobileOpen={mobileOpen}
          onToggleMenu={() => setMobileOpen((value) => !value)}
        />

        {mobileOpen && (
          <div className="fixed inset-0 z-40 flex">
            <div className="h-full w-[min(84vw,300px)] shadow-xl">
              <AdminSidebar
                pathname={pathname}
                collapsed={false}
                onNavigate={() => setMobileOpen(false)}
              />
            </div>

            <button
              type="button"
              aria-label="Close admin menu"
              onClick={() => setMobileOpen(false)}
              className="flex-1 bg-slate-950/40"
            />
          </div>
        )}

        <main className="min-w-0 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}