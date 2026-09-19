// -----------------------------------------------------------------------------
// sisiMove — Authenticated Account Menu
// -----------------------------------------------------------------------------
//
// Account control for the authenticated application header.
//
// Header placement:
//
//     sisiMove
//         │
//         ├── 🧳 My Journeys
//         ├── @traveller ▾
//         └── 🔔
//
// Responsibilities:
// - Display the authenticated traveller's public handle.
// - Display the traveller's avatar through the shared Avatar primitive.
// - Provide the account-menu trigger.
// - Provide navigation to authenticated account surfaces.
// - Provide the visual boundary for the account dropdown.
// - Close the account menu when interaction occurs outside its boundary.
// - Initiate the authenticated logout workflow through useLogout().
//
// Profile navigation:
//
//     Account Menu
//          │
//          └── Profile
//                │
//                ▼
//           /profile
//                │
//                ▼
//        Authenticated Profile
//        └── ProfilePage
//
// The account menu does NOT fetch the profile page data.
// The authenticated profile route owns the profile workflow and loads the
// profile data required by ProfilePage.
//
// Non-responsibilities:
// - No authentication-state implementation.
// - No session persistence.
// - No direct localStorage access.
// - No direct logout API communication.
// - No traveller-profile fetching.
// - No verification logic.
// - No marketplace capability logic.
// - No authorization decisions.
// - No profile data orchestration.
// - No dashboard route invention.
//
// Logout ownership:
//
//     AuthenticatedAccountMenu
//              │
//              ▼
//          useLogout()
//              │
//              ├── logoutUser()
//              │       │
//              │       └── POST /sessions/logout
//              │
//              └── authSessionStorage.remove()
//                       │
//                       ▼
//                  public login
//
// The component owns the user interaction.
// The authentication feature owns the logout lifecycle.
//
// -----------------------------------------------------------------------------

'use client';

import {
  useEffect,
  useRef,
  useState,
} from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Avatar } from '@/components/ui/avatar';
import { useLogout } from '@/features/authentication/logout';
import {
  AUTHENTICATED_ROUTES,
  AUTHENTICATION_ROUTES,
} from '@/foundation/routing';

// =============================================================================
// Props
// =============================================================================

export interface AuthenticatedAccountMenuProps {
  /**
   * Public TravellerProfile handle displayed in the authenticated header.
   *
   * Example:
   *
   *     ramadhan
   *
   * The @ prefix is presentation-only and is added by this component.
   */
  readonly travellerHandle: string;

  /**
   * TravellerProfile display name used as the avatar fallback.
   */
  readonly travellerName?: string | null;

  /**
   * Public profile-image URL.
   *
   * This is presentation data supplied by the authenticated application
   * boundary. The Avatar primitive owns image rendering and fallback
   * behavior.
   */
  readonly avatarSrc?: string | null;
}

// =============================================================================
// Account Menu Items
// =============================================================================

const ACCOUNT_MENU_ITEMS = [
  {
    label: 'Profile',
    href: '/profile',
  },
  {
    label: 'Wallet',
    href: '/wallet',
  },
  {
    label: 'Support',
    href: '/support',
  },
  {
    label: 'Settings',
    href: '/settings',
  },
] as const;

// =============================================================================
// Component
// =============================================================================

export function AuthenticatedAccountMenu({
  travellerHandle,
  travellerName,
  avatarSrc,
}: AuthenticatedAccountMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const {
    logout,
    isLoggingOut,
  } = useLogout();

  // ---------------------------------------------------------------------------
  // Menu Boundary
  // ---------------------------------------------------------------------------

  const menuRef = useRef<HTMLDivElement>(null);

  // ---------------------------------------------------------------------------
  // Close On Outside Interaction
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (!menuRef.current?.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener(
      'pointerdown',
      handlePointerDown,
      true,
    );

    return () => {
      document.removeEventListener(
        'pointerdown',
        handlePointerDown,
        true,
      );
    };
  }, [isOpen]);

  // ---------------------------------------------------------------------------
  // Traveller Presentation
  // ---------------------------------------------------------------------------

  const normalizedHandle = travellerHandle.trim();

  const displayHandle = normalizedHandle.startsWith('@')
    ? normalizedHandle
    : `@${normalizedHandle}`;

  const avatarFallback =
    travellerName?.trim() ||
    normalizedHandle ||
    'Traveller';

  // ---------------------------------------------------------------------------
  // Sign Out
  // ---------------------------------------------------------------------------

  const handleSignOut = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsOpen(false);

    try {
      await logout();

      router.replace(AUTHENTICATION_ROUTES.LOGIN);
      router.refresh();
    } catch {
      /**
       * The logout hook owns the error state.
       *
       * Keep the user on the authenticated surface when server-side logout
       * fails because the backend session may still be active.
       */
    }
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div
      ref={menuRef}
      className="relative"
    >
      {/* ---------------------------------------------------------------------
          Account Trigger
          --------------------------------------------------------------------- */}

      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={`Account menu for ${displayHandle}`}
        onClick={() => setIsOpen((current) => !current)}
        disabled={isLoggingOut}
        className={[
          'inline-flex',
          'h-9',
          'items-center',
          'gap-2',
          'rounded-full',
          'px-2',
          'text-sm',
          'font-medium',
          'text-[var(--foreground)]',
          'transition-colors',
          'duration-150',
          'ease-out',
          'hover:bg-[var(--brand-soft)]',
          'focus-visible:outline-none',
          'focus-visible:ring-2',
          'focus-visible:ring-[var(--brand)]',
          'focus-visible:ring-offset-2',
          'focus-visible:ring-offset-[var(--surface)]',
          'disabled:pointer-events-none',
          'disabled:opacity-60',
        ].join(' ')}
      >
        <Avatar
          src={avatarSrc}
          alt=""
          fallback={avatarFallback}
          size="sm"
        />

        <span className="hidden sm:inline">
          {displayHandle}
        </span>

        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={[
            'size-4',
            'transition-transform',
            'duration-150',
            'ease-out',
            isOpen ? 'rotate-180' : '',
          ].join(' ')}
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 1 1-1.08 1.04l4.25-4.5a.75.75 0 0 1 .02 1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* ---------------------------------------------------------------------
          Account Dropdown
          --------------------------------------------------------------------- */}

      {isOpen ? (
        <div
          role="menu"
          aria-label="Account menu"
          className={[
            'absolute',
            'right-0',
            'z-50',
            'mt-2',
            'w-52',
            'overflow-hidden',
            'rounded-[var(--radius-xl)]',
            'border',
            'border-[var(--border)]',
            'bg-[var(--surface)]',
            'p-1.5',
            'shadow-lg',
          ].join(' ')}
        >
          <Link
            href={AUTHENTICATED_ROUTES.HOME}
            role="menuitem"
            onClick={() => setIsOpen(false)}
            className={[
              'block',
              'rounded-[var(--radius-md)]',
              'px-3',
              'py-2',
              'text-sm',
              'text-[var(--foreground)]',
              'transition-colors',
              'duration-150',
              'ease-out',
              'hover:bg-[var(--brand-soft)]',
              'hover:text-[var(--brand)]',
            ].join(' ')}
          >
            Home
          </Link>

          {ACCOUNT_MENU_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className={[
                'block',
                'rounded-[var(--radius-md)]',
                'px-3',
                'py-2',
                'text-sm',
                'text-[var(--foreground)]',
                'transition-colors',
                'duration-150',
                'ease-out',
                'hover:bg-[var(--brand-soft)]',
                'hover:text-[var(--brand)]',
              ].join(' ')}
            >
              {item.label}
            </Link>
          ))}

          {/* -----------------------------------------------------------------
              Separator
              ----------------------------------------------------------------- */}

          <div
            aria-hidden="true"
            className="my-1.5 border-t border-[var(--border-subtle)]"
          />

          {/* -----------------------------------------------------------------
              Sign Out
              ----------------------------------------------------------------- */}

          <button
            type="button"
            role="menuitem"
            onClick={handleSignOut}
            disabled={isLoggingOut}
            aria-busy={isLoggingOut}
            className={[
              'block',
              'w-full',
              'rounded-[var(--radius-md)]',
              'px-3',
              'py-2',
              'text-left',
              'text-sm',
              'text-[var(--foreground)]',
              'transition-colors',
              'duration-150',
              'ease-out',
              'hover:bg-[var(--brand-soft)]',
              'hover:text-[var(--brand)]',
              'disabled:pointer-events-none',
              'disabled:opacity-60',
            ].join(' ')}
          >
            {isLoggingOut ? 'Signing out…' : 'Sign out'}
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default AuthenticatedAccountMenu;