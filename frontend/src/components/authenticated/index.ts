// -----------------------------------------------------------------------------
// sisiMove — Authenticated Components Barrel
// -----------------------------------------------------------------------------
//
// Public export boundary for the authenticated application shell.
//
// Composition:
//
//     AuthenticatedShell
//         │
//         ├── AuthenticatedHeader
//         │     ├── AuthenticatedLogo
//         │     ├── AuthenticatedNavigation
//         │     ├── AuthenticatedAccountMenu
//         │     └── AuthenticatedNotifications
//         │
//         └── AuthenticatedFooter
//
// This barrel exposes the authenticated shell and its primary composition
// boundaries to application route layouts.
//
// It does NOT:
// - manage authentication,
// - restore sessions,
// - enforce authorization,
// - perform redirects,
// - fetch marketplace data,
// - determine verification,
// - determine marketplace capabilities.
//
// -----------------------------------------------------------------------------

export {
  AuthenticatedShell,
} from './authenticated-shell';

export {
  AuthenticatedHeader,
  AuthenticatedLogo,
  AuthenticatedNavigation,
  AuthenticatedAccountMenu,
  AuthenticatedNotifications,
} from './authenticated-header';

export {
  AuthenticatedFooter,
} from './authenticated-footer';

export * from './marketplace';