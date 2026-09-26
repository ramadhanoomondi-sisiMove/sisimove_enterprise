// -----------------------------------------------------------------------------
// sisiMove — Notifications Page
// -----------------------------------------------------------------------------
//
// Authenticated Notification collection page.
//
// Responsibilities:
// - compose the authenticated Notifications surface;
// - provide route-level page structure;
// - delegate notification rendering to the NotificationList component.
//
// Non-responsibilities:
// - authentication;
// - session management;
// - notification fetching;
// - notification mutations;
// - notification lifecycle decisions;
// - notification business logic.
//
// The NotificationList component owns the notification collection query.
// -----------------------------------------------------------------------------

import {
  NotificationList,
} from '@/components/notification/notification-list';

export default function NotificationsPage() {
  return (
    <main className="page-container py-6 sm:py-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-5">
          <h1 className="text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl">
            Notifications
          </h1>

          <p className="mt-1 text-sm leading-6 text-[var(--foreground-muted)]">
            Stay up to date with activity related to your sisiMove account.
          </p>
        </header>

        <NotificationList />
      </div>
    </main>
  );
}

