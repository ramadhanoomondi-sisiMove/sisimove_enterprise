(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/authentication-provider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthenticationProvider",
    ()=>AuthenticationProvider,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$state$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/authentication/state/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$state$2f$authentication$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/authentication/state/authentication-context.tsx [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// sisiMove — Application Authentication Provider
// -----------------------------------------------------------------------------
//
// Application/provider composition boundary for authentication.
//
// The authentication feature owns the actual authentication state machine:
//
//     features/authentication/state/authentication-context.tsx
//
// This application-level provider exists so the Next.js application can mount
// authentication once at the root provider boundary without exposing feature
// implementation details throughout the app tree.
//
// Responsibilities:
// - Mount the feature-owned AuthenticationProvider.
// - Provide authentication context to the application tree.
//
// This component intentionally does NOT:
// - Perform login.
// - Perform registration.
// - Perform logout directly.
// - Read or write localStorage.
// - Manage access/refresh tokens.
// - Fetch identity data.
// - Fetch verification status.
// - Manage roles or permissions.
// - Perform route redirects.
//
// Those concerns belong to their respective feature/application boundaries.
//
// -----------------------------------------------------------------------------
'use client';
;
;
function AuthenticationProvider({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$state$2f$authentication$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthenticationProvider"], {
        children: children
    }, void 0, false, {
        fileName: "[project]/src/authentication-provider.tsx",
        lineNumber: 50,
        columnNumber: 5
    }, this);
}
_c = AuthenticationProvider;
const __TURBOPACK__default__export__ = AuthenticationProvider;
var _c;
__turbopack_context__.k.register(_c, "AuthenticationProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/authentication/session/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Authentication Session Barrel
// -----------------------------------------------------------------------------
//
// Public exports for the authentication session feature.
//
// The session feature owns:
// - AuthSession — client representation of a successful authenticated session.
// - authSessionStorage — persistence boundary for AuthSession.
//
// Consumers should import session concerns from this barrel rather than
// reaching into the models/ or storage/ implementation directories.
//
// -----------------------------------------------------------------------------
__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$session$2f$storage$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/authentication/session/storage/index.ts [app-client] (ecmascript) <locals>");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/authentication/session/storage/auth-session.storage.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Authentication Session Storage
// -----------------------------------------------------------------------------
//
// Client-side persistence boundary for the authenticated sisiMove session.
//
// Responsibilities:
// - Persist the AuthSession returned by a successful login.
// - Restore the persisted AuthSession when the application starts.
// - Remove the persisted AuthSession during client-side logout.
// - Keep storage access out of React components, hooks, and API adapters.
//
// Non-responsibilities:
// - Login or logout HTTP requests.
// - Token generation.
// - Token refresh.
// - Session validation.
// - Authentication state management.
// - Identity/Profile/Trust/Verification state.
// - Device management.
//
// The storage layer stores the complete AuthSession because all values belong
// to the backend-issued authentication session:
//
//   identityPublicId
//   authenticationPublicId
//   devicePublicId
//   sessionPublicId
//   accessToken
//   refreshToken
//
// The storage implementation intentionally uses browser localStorage because
// the authenticated session is expected to survive a browser restart.
//
// Security boundary:
// - This module is browser-only.
// - No credentials are stored here.
// - No password is stored here.
// - No device fingerprint is stored here.
// - No registration data is stored here.
// - Tokens are persisted only as part of the AuthSession returned by login.
//
// If the application later moves token persistence to HttpOnly cookies, this
// file remains the natural replacement boundary and consumers do not need to
// change.
//
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "authSessionStorage",
    ()=>authSessionStorage
]);
/**
 * Storage key used for the persisted sisiMove authentication session.
 *
 * The key is intentionally owned by the authentication session storage
 * boundary rather than being exposed to application components.
 */ const AUTH_SESSION_STORAGE_KEY = 'sisimove.auth.session';
/**
 * Browser localStorage implementation of AuthSessionStorage.
 *
 * All browser-storage access is isolated here.
 */ class LocalAuthSessionStorage {
    /**
   * Restore the persisted authentication session.
   *
   * Invalid or malformed JSON is treated as an unavailable session rather
   * than being allowed to crash authentication initialization.
   */ async get() {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        const serializedSession = window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY);
        if (serializedSession === null) {
            return null;
        }
        try {
            const parsedSession = JSON.parse(serializedSession);
            if (!isAuthSession(parsedSession)) {
                window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
                return null;
            }
            return parsedSession;
        } catch  {
            /**
       * A corrupted persisted value must not prevent the application from
       * loading. Remove the invalid value and treat the browser as
       * unauthenticated.
       */ window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
            return null;
        }
    }
    /**
   * Persist the complete authenticated session.
   */ async set(session) {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        if (!isAuthSession(session)) {
            throw new Error('A valid authentication session is required.');
        }
        window.localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session));
    }
    /**
   * Remove the persisted authentication session.
   */ async remove() {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
    }
}
/**
 * Runtime validation for data restored from browser storage.
 *
 * localStorage contains untyped external data from the application's
 * perspective. TypeScript cannot guarantee that the stored JSON still
 * conforms to AuthSession, so the boundary performs a minimal structural
 * validation before returning it to the application.
 *
 * This validates the storage shape only. It does NOT validate whether the
 * access token or refresh token is still accepted by the backend.
 */ function isAuthSession(value) {
    if (typeof value !== 'object' || value === null) {
        return false;
    }
    const candidate = value;
    return typeof candidate.identityPublicId === 'string' && candidate.identityPublicId.length > 0 && typeof candidate.authenticationPublicId === 'string' && candidate.authenticationPublicId.length > 0 && typeof candidate.devicePublicId === 'string' && candidate.devicePublicId.length > 0 && typeof candidate.sessionPublicId === 'string' && candidate.sessionPublicId.length > 0 && typeof candidate.accessToken === 'string' && candidate.accessToken.length > 0 && typeof candidate.refreshToken === 'string' && candidate.refreshToken.length > 0;
}
const authSessionStorage = new LocalAuthSessionStorage();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/authentication/session/storage/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Authentication Session Storage Barrel
// -----------------------------------------------------------------------------
__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$session$2f$storage$2f$auth$2d$session$2e$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/authentication/session/storage/auth-session.storage.ts [app-client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/authentication/state/authentication-context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthenticationProvider",
    ()=>AuthenticationProvider,
    "useAuthentication",
    ()=>useAuthentication
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// sisiMove — Authentication Context
// -----------------------------------------------------------------------------
//
// React state boundary for the authenticated sisiMove session.
//
// Responsibilities:
// - Restore the persisted AuthSession on application startup.
// - Expose authentication state to React consumers.
// - Establish state after a successful login.
// - Persist a successful authenticated session.
// - Clear client-side authentication state during logout.
//
// Non-responsibilities:
// - Performing registration.
// - Performing login HTTP requests.
// - Performing token refresh.
// - Loading Identity.
// - Loading Verification.
// - Loading IdentityRole/Permission.
// - Loading TravellerProfile.
// - Loading TrustProfile.
// - Managing the backend Device aggregate.
// - Deciding marketplace verification eligibility.
//
// Login remains owned by the login feature:
//
//   LoginForm
//       ↓
//   useAuthenticateLogin
//       ↓
//   authenticate-login.api
//       ↓
//   AuthSession
//       ↓
//   authentication context
//
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$session$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/authentication/session/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$session$2f$storage$2f$auth$2d$session$2e$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/authentication/session/storage/auth-session.storage.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$state$2f$authentication$2d$state$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/authentication/state/authentication-state.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
const AuthenticationContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthenticationProvider({ children }) {
    _s();
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$state$2f$authentication$2d$state$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INITIAL_AUTHENTICATION_STATE"]);
    /**
   * Restore the persisted authentication session once on application startup.
   */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthenticationProvider.useEffect": ()=>{
            let cancelled = false;
            const restoreSession = {
                "AuthenticationProvider.useEffect.restoreSession": async ()=>{
                    try {
                        const session = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$session$2f$storage$2f$auth$2d$session$2e$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authSessionStorage"].get();
                        if (cancelled) {
                            return;
                        }
                        if (session === null) {
                            setState((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$state$2f$authentication$2d$state$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createUnauthenticatedState"])());
                            return;
                        }
                        setState((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$state$2f$authentication$2d$state$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createAuthenticatedState"])(session));
                    } catch (error) {
                        if (cancelled) {
                            return;
                        }
                        setState((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$state$2f$authentication$2d$state$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createAuthenticationErrorState"])(error instanceof Error ? error : new Error('Unable to restore authentication session.')));
                    }
                }
            }["AuthenticationProvider.useEffect.restoreSession"];
            void restoreSession();
            return ({
                "AuthenticationProvider.useEffect": ()=>{
                    cancelled = true;
                }
            })["AuthenticationProvider.useEffect"];
        }
    }["AuthenticationProvider.useEffect"], []);
    /**
   * Persist and activate a successful authenticated session.
   *
   * Storage is completed before the React state is transitioned. This avoids
   * exposing an authenticated state when the browser could not persist the
   * session required to restore it after a reload.
   */ const authenticate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthenticationProvider.useCallback[authenticate]": async (session)=>{
            if (!session) {
                throw new Error('Authentication session is required.');
            }
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$session$2f$storage$2f$auth$2d$session$2e$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authSessionStorage"].set(session);
                setState((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$state$2f$authentication$2d$state$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createAuthenticatedState"])(session));
            } catch (error) {
                const normalizedError = error instanceof Error ? error : new Error('Unable to persist authentication session.');
                setState((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$state$2f$authentication$2d$state$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createAuthenticationErrorState"])(normalizedError));
                throw normalizedError;
            }
        }
    }["AuthenticationProvider.useCallback[authenticate]"], []);
    /**
   * Remove the persisted session and transition the application to the
   * unauthenticated state.
   *
   * Backend session revocation is intentionally outside this client state
   * boundary. When a backend logout operation exists, it can be composed by
   * the authentication feature before or alongside this operation.
   */ const logout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthenticationProvider.useCallback[logout]": async ()=>{
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$session$2f$storage$2f$auth$2d$session$2e$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authSessionStorage"].remove();
                setState((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$state$2f$authentication$2d$state$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createUnauthenticatedState"])());
            } catch (error) {
                const normalizedError = error instanceof Error ? error : new Error('Unable to clear authentication session.');
                setState((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$state$2f$authentication$2d$state$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createAuthenticationErrorState"])(normalizedError));
                throw normalizedError;
            }
        }
    }["AuthenticationProvider.useCallback[logout]"], []);
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AuthenticationProvider.useMemo[value]": ()=>({
                state,
                isAuthenticated: state.status === 'AUTHENTICATED',
                session: state.session,
                authenticate,
                logout
            })
    }["AuthenticationProvider.useMemo[value]"], [
        state,
        authenticate,
        logout
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthenticationContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/features/authentication/state/authentication-context.tsx",
        lineNumber: 223,
        columnNumber: 5
    }, this);
}
_s(AuthenticationProvider, "GAjw4vBmEdi+bsd4S4mJe5poAGI=");
_c = AuthenticationProvider;
function useAuthentication() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthenticationContext);
    if (context === undefined) {
        throw new Error('useAuthentication must be used within an AuthenticationProvider.');
    }
    return context;
}
_s1(useAuthentication, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "AuthenticationProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/authentication/state/authentication-state.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Authentication State
// -----------------------------------------------------------------------------
//
// Client-side authentication state.
//
// This state represents whether the browser currently has an authenticated
// sisiMove session. It deliberately does NOT mirror the backend Identity,
// Authentication, Session, Device, Verification, Role, TravellerProfile, or
// TrustProfile models.
//
// Domain boundaries:
//
//   AuthenticationState
//       └── AuthSession
//
// Other account information belongs to its own feature/domain boundary.
//
// Registration does not authenticate the user. A successful registration
// therefore never creates an authenticated state.
//
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "INITIAL_AUTHENTICATION_STATE",
    ()=>INITIAL_AUTHENTICATION_STATE,
    "createAuthenticatedState",
    ()=>createAuthenticatedState,
    "createAuthenticationErrorState",
    ()=>createAuthenticationErrorState,
    "createUnauthenticatedState",
    ()=>createUnauthenticatedState,
    "hasAuthenticationError",
    ()=>hasAuthenticationError,
    "isAuthenticated",
    ()=>isAuthenticated,
    "isUnauthenticated",
    ()=>isUnauthenticated
]);
const INITIAL_AUTHENTICATION_STATE = {
    status: 'INITIALIZING',
    session: null,
    error: null
};
function createAuthenticatedState(session) {
    if (!session) {
        throw new Error('Authentication session is required.');
    }
    return {
        status: 'AUTHENTICATED',
        session,
        error: null
    };
}
function createUnauthenticatedState() {
    return {
        status: 'UNAUTHENTICATED',
        session: null,
        error: null
    };
}
function createAuthenticationErrorState(error) {
    if (!error) {
        throw new Error('Authentication error is required.');
    }
    return {
        status: 'ERROR',
        session: null,
        error
    };
}
function isAuthenticated(state) {
    return state.status === 'AUTHENTICATED' && state.session !== null;
}
function isUnauthenticated(state) {
    return state.status === 'UNAUTHENTICATED' && state.session === null;
}
function hasAuthenticationError(state) {
    return state.status === 'ERROR' && state.error !== null;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/authentication/state/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// -----------------------------------------------------------------------------
// sisiMove — Authentication State Barrel
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$state$2f$authentication$2d$state$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/authentication/state/authentication-state.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$state$2f$authentication$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/authentication/state/authentication-context.tsx [app-client] (ecmascript)");
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/query-provider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "QueryProvider",
    ()=>QueryProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/queryClient.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
//src/query-provider.tsx
// -----------------------------------------------------------------------------
// sisiMove — Query Provider
// -----------------------------------------------------------------------------
//
// Application-level provider for TanStack Query.
//
// Responsibilities:
// - Create and own the application's QueryClient.
// - Provide the QueryClient to the React component tree.
// - Keep query configuration centralized at the provider boundary.
//
// This provider does NOT:
// - fetch application data;
// - define feature queries;
// - contain marketplace logic;
// - contain authentication logic;
// - contain API clients;
// - contain domain state;
// - replace the existing foundation HTTP layer.
//
// Feature-level hooks remain responsible for defining their own queries.
// The provider only supplies the shared TanStack Query runtime.
//
// -----------------------------------------------------------------------------
// Architecture
// -----------------------------------------------------------------------------
//
// App
//   │
//   ▼
// QueryProvider
//   │
//   ▼
// QueryClientProvider
//   │
//   ├── Public Marketplace
//   ├── Journeys
//   ├── Journey Demands
//   ├── Traveller Profiles
//   ├── Trust
//   └── Assets
//
// -----------------------------------------------------------------------------
//
'use client';
;
;
function QueryProvider({ children }) {
    _s();
    const [queryClient] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "QueryProvider.useState": ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryClient"]({
                defaultOptions: {
                    queries: {
                        staleTime: 30_000,
                        gcTime: 5 * 60_000,
                        retry: 1,
                        refetchOnWindowFocus: false
                    }
                }
            })
    }["QueryProvider.useState"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryClientProvider"], {
        client: queryClient,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/query-provider.tsx",
        lineNumber: 86,
        columnNumber: 5
    }, this);
}
_s(QueryProvider, "QJpeXPEyrr7bgOAfh0bH/p4+g3c=");
_c = QueryProvider;
var _c;
__turbopack_context__.k.register(_c, "QueryProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_12d8l96._.js.map