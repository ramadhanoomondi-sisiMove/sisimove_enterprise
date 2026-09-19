// -----------------------------------------------------------------------------
// sisiMove — Authenticated Header Barrel
// -----------------------------------------------------------------------------
//
// Public export boundary for authenticated header components.
//
// The header is composed from:
//
//     AuthenticatedHeader
//         ├── AuthenticatedLogo
//         ├── AuthenticatedNavigation
//         ├── AuthenticatedAccountMenu
//         └── AuthenticatedNotifications
//
// This barrel only re-exports components.
// It does NOT:
// - manage authentication,
// - manage sessions,
// - perform authorization,
// - fetch traveller data,
// - fetch notifications,
// - contain marketplace logic.
//
// -----------------------------------------------------------------------------

export {
  AuthenticatedHeader,
} from './authenticated-header';

export {
  AuthenticatedLogo,
} from './authenticated-logo';

export {
  AuthenticatedNavigation,
} from './authenticated-navigation';

export {
  AuthenticatedAccountMenu,
} from './authenticated-account-menu';

export {
  AuthenticatedNotifications,
} from './authenticated-notifications';

