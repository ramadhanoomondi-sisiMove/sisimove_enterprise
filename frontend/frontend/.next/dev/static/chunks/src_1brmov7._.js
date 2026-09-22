(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/landing/shared/account-actions/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// -----------------------------------------------------------------------------
// sisiMove — Landing Account Actions
// -----------------------------------------------------------------------------
//
// Public barrel for reusable account-access presentation components used by
// public landing surfaces.
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$shared$2f$account$2d$actions$2f$join$2d$sisi$2d$move$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/shared/account-actions/join-sisi-move.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$shared$2f$account$2d$actions$2f$sign$2d$in$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/shared/account-actions/sign-in.tsx [app-client] (ecmascript)");
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/landing/shared/account-actions/join-sisi-move.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "JoinSisiMove",
    ()=>JoinSisiMove,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// sisiMove — Join sisiMove
// -----------------------------------------------------------------------------
//
// Reusable public account-action component for visitors who want to join
// sisiMove.
//
// Presentation-only:
// - no authentication state;
// - no API calls;
// - no registration logic;
// - no business rules.
//
// The authentication boundary owns the actual registration flow.
//
// Routing:
// - The default destination comes from the canonical authentication routing
//   boundary.
// - Consumers may override the destination when composing the component in a
//   different navigation context.
//
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$routing$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/foundation/routing/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$routing$2f$authentication$2d$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/routing/authentication-routes.ts [app-client] (ecmascript)");
;
;
;
function JoinSisiMove({ href = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$routing$2f$authentication$2d$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AUTHENTICATION_ROUTES"].REGISTER, className, compact = false }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        href: href,
        className: [
            // ---------------------------------------------------------------------
            // Base
            // ---------------------------------------------------------------------
            'inline-flex',
            'min-w-0',
            'items-center',
            'justify-center',
            'gap-2',
            'rounded-[var(--radius-md)]',
            'border',
            'font-semibold',
            'whitespace-nowrap',
            'select-none',
            // ---------------------------------------------------------------------
            // Brand-outline action
            // ---------------------------------------------------------------------
            //
            // The header should remain visually light.
            //
            // Join sisiMove is still the stronger account action, but it does not
            // compete with the page's primary blue CTA.
            //
            'border-[color:var(--brand)]',
            'bg-[color:var(--surface)]',
            'text-[color:var(--brand)]',
            'transition-colors',
            'duration-150',
            'ease-out',
            // ---------------------------------------------------------------------
            // Hover
            // ---------------------------------------------------------------------
            'hover:bg-[color:var(--brand-soft)]',
            'hover:border-[color:var(--brand-hover)]',
            'hover:text-[color:var(--brand-hover)]',
            // ---------------------------------------------------------------------
            // Keyboard focus
            // ---------------------------------------------------------------------
            'focus-visible:outline-none',
            'focus-visible:ring-2',
            'focus-visible:ring-[color:var(--brand)]',
            'focus-visible:ring-offset-2',
            'focus-visible:ring-offset-[color:var(--background)]',
            // ---------------------------------------------------------------------
            // Density
            // ---------------------------------------------------------------------
            compact ? [
                'min-h-9',
                'px-3.5',
                'py-1.5',
                'text-sm'
            ].join(' ') : [
                'min-h-10',
                'px-4',
                'py-2',
                'text-sm',
                'sm:min-h-11',
                'sm:px-5',
                'sm:py-2.5'
            ].join(' '),
            // ---------------------------------------------------------------------
            // Consumer customization
            // ---------------------------------------------------------------------
            className
        ].filter(Boolean).join(' '),
        children: "Join sisiMove"
    }, void 0, false, {
        fileName: "[project]/src/components/landing/shared/account-actions/join-sisi-move.tsx",
        lineNumber: 63,
        columnNumber: 5
    }, this);
}
_c = JoinSisiMove;
const __TURBOPACK__default__export__ = JoinSisiMove;
var _c;
__turbopack_context__.k.register(_c, "JoinSisiMove");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/landing/shared/account-actions/sign-in.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SignIn",
    ()=>SignIn,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// sisiMove — Sign In
// -----------------------------------------------------------------------------
//
// Reusable public account-action component for existing sisiMove members.
//
// This component is presentation-only.
//
// It does NOT:
// - authenticate the user;
// - access session state;
// - call an API;
// - perform login;
// - determine whether the visitor is already authenticated.
//
// The authentication boundary owns the actual sign-in flow.
//
// -----------------------------------------------------------------------------
// NAVIGATION
// -----------------------------------------------------------------------------
//
// The component receives an href rather than owning authentication behavior.
//
// This keeps it reusable across:
// - public navigation;
// - landing-page actions;
// - marketplace surfaces;
// - account prompts;
// - other public presentation contexts.
//
// The default destination comes from the canonical authentication routing
// boundary.
//
// -----------------------------------------------------------------------------
// VISUAL ROLE
// -----------------------------------------------------------------------------
//
// Sign in is a secondary account action.
//
// It intentionally uses a transparent/neutral treatment while Join sisiMove
// uses the primary brand treatment:
//
//     [ Sign in ]   [ Join sisiMove ]
//
// This establishes a clear visual hierarchy without making authentication
// behavior part of this component.
//
// -----------------------------------------------------------------------------
// COMPACT MODE
// -----------------------------------------------------------------------------
//
// `compact` changes presentation density only.
//
// It does not change:
// - destination;
// - authentication behavior;
// - authorization;
// - application state.
//
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$routing$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/foundation/routing/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$routing$2f$authentication$2d$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/routing/authentication-routes.ts [app-client] (ecmascript)");
;
;
;
function SignIn({ href = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$routing$2f$authentication$2d$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AUTHENTICATION_ROUTES"].LOGIN, className, compact = false }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        href: href,
        className: [
            // ---------------------------------------------------------------------
            // Base
            // ---------------------------------------------------------------------
            'inline-flex',
            'items-center',
            'justify-center',
            'gap-2',
            'font-medium',
            'whitespace-nowrap',
            'select-none',
            'rounded-lg',
            // ---------------------------------------------------------------------
            // Secondary action
            // ---------------------------------------------------------------------
            'border border-transparent',
            'bg-transparent',
            'text-[var(--foreground-secondary)]',
            'transition-colors',
            'duration-150',
            'ease-out',
            'hover:bg-[var(--background-subtle)]',
            'hover:text-[var(--foreground)]',
            'active:bg-[var(--background-muted)]',
            // ---------------------------------------------------------------------
            // Keyboard focus
            // ---------------------------------------------------------------------
            'focus-visible:outline-none',
            'focus-visible:ring-2',
            'focus-visible:ring-[var(--brand)]',
            'focus-visible:ring-offset-2',
            'focus-visible:ring-offset-[var(--background)]',
            // ---------------------------------------------------------------------
            // Density
            // ---------------------------------------------------------------------
            compact ? [
                'min-h-9',
                'px-3.5',
                'py-1.5',
                'text-sm'
            ].join(' ') : [
                'min-h-10',
                'px-4',
                'py-2',
                'text-sm',
                'sm:min-h-11',
                'sm:px-4',
                'sm:py-2.5'
            ].join(' '),
            // ---------------------------------------------------------------------
            // Consumer customization
            // ---------------------------------------------------------------------
            className
        ].filter(Boolean).join(' '),
        children: "Sign in"
    }, void 0, false, {
        fileName: "[project]/src/components/landing/shared/account-actions/sign-in.tsx",
        lineNumber: 104,
        columnNumber: 5
    }, this);
}
_c = SignIn;
const __TURBOPACK__default__export__ = SignIn;
var _c;
__turbopack_context__.k.register(_c, "SignIn");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layout/desktop-navigation.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DesktopNavigation",
    ()=>DesktopNavigation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$navigation$2d$link$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/navigation-link.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
// -----------------------------------------------------------------------------
// sisiMove — Desktop Navigation
// -----------------------------------------------------------------------------
//
// Desktop navigation for the sisiMove public site shell.
//
// Responsibilities:
// - Render primary public navigation.
// - Provide consistent desktop spacing and alignment.
// - Highlight the active route.
// - Reuse the shared NavigationLink primitive.
//
// Architectural boundary:
//
// - Presentation only.
// - No authentication or business logic.
// - No API calls.
// - No feature/domain dependencies.
//
// Active-route detection belongs to this navigation component because it
// requires Next.js router state. NavigationLink remains router-state agnostic
// apart from receiving the presentation-level `active` value.
//
// -----------------------------------------------------------------------------
'use client';
;
;
// =============================================================================
// Navigation Items
// =============================================================================
//
// Keep public navigation declarative.
//
// These destinations belong to the public site shell. Authenticated
// application navigation should be introduced separately rather than making
// this component aware of account/application state.
//
// -----------------------------------------------------------------------------
const navigationItems = [
    {
        href: '/',
        label: 'Explore'
    },
    {
        href: '/how-it-works',
        label: 'How it works'
    }
];
// =============================================================================
// Helpers
// =============================================================================
/**
 * Determines whether a public navigation item represents the current route.
 *
 * The root route is handled separately because every pathname starts with
 * `/`.
 *
 * Nested routes are considered active for both their exact path and their
 * descendants:
 *
 *     /how-it-works
 *     /how-it-works/example
 *
 * This keeps route interpretation inside the navigation layer rather than
 * coupling the reusable NavigationLink primitive to pathname state.
 */ function isNavigationItemActive(pathname, href) {
    if (href === '/') {
        return pathname === '/';
    }
    return pathname === href || pathname.startsWith(`${href}/`);
}
function DesktopNavigation() {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        "aria-label": "Primary navigation",
        className: [
            'hidden',
            'min-w-0',
            'items-center',
            'gap-1',
            'md:flex'
        ].join(' '),
        children: navigationItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$navigation$2d$link$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NavigationLink"], {
                href: item.href,
                active: isNavigationItemActive(pathname, item.href),
                children: item.label
            }, item.href, false, {
                fileName: "[project]/src/components/layout/desktop-navigation.tsx",
                lineNumber: 120,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/src/components/layout/desktop-navigation.tsx",
        lineNumber: 109,
        columnNumber: 5
    }, this);
}
_s(DesktopNavigation, "xbyQPtUVMO7MNj7WjJlpdWqRcTo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = DesktopNavigation;
var _c;
__turbopack_context__.k.register(_c, "DesktopNavigation");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layout/mobile-navigation.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MobileNavigation",
    ()=>MobileNavigation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$navigation$2d$link$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/navigation-link.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
// -----------------------------------------------------------------------------
// sisiMove — Mobile Navigation
// -----------------------------------------------------------------------------
//
// Primary public navigation for compact/mobile layouts.
//
// Responsibilities:
// - Render public navigation links on small screens.
// - Highlight the active route.
// - Reuse the shared NavigationLink primitive.
// - Remain independent of feature/domain implementations.
//
// Architectural boundary:
//
// - Presentation only.
// - No authentication or business logic.
// - No API calls.
// - No feature/domain dependencies.
// - Does not own navigation destinations outside this public navigation list.
//
// Active-route detection is intentionally kept here rather than inside
// NavigationLink. NavigationLink remains a reusable presentation primitive,
// while this component owns the router-specific pathname interpretation.
//
// -----------------------------------------------------------------------------
'use client';
;
;
// =============================================================================
// Navigation Items
// =============================================================================
//
// Keep this list declarative.
//
// These are public site-navigation destinations, not authenticated application
// routes.
//
// -----------------------------------------------------------------------------
const navigationItems = [
    {
        href: '/',
        label: 'Explore'
    },
    {
        href: '/how-it-works',
        label: 'How it works'
    }
];
// =============================================================================
// Helpers
// =============================================================================
/**
 * Determines whether a navigation item represents the current route.
 *
 * Root is treated specially because every pathname begins with `/`.
 *
 * For nested public routes, both the exact route and descendants are treated
 * as active:
 *
 *     /how-it-works
 *     /how-it-works/example
 *
 * This keeps active-state calculation local to the navigation layer and
 * prevents NavigationLink from becoming coupled to Next.js routing state.
 */ function isNavigationItemActive(pathname, href) {
    if (href === '/') {
        return pathname === '/';
    }
    return pathname === href || pathname.startsWith(`${href}/`);
}
function MobileNavigation() {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        "aria-label": "Mobile navigation",
        className: [
            'flex',
            'min-w-0',
            'items-center',
            'gap-1',
            'md:hidden'
        ].join(' '),
        children: navigationItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$navigation$2d$link$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NavigationLink"], {
                href: item.href,
                active: isNavigationItemActive(pathname, item.href),
                className: "shrink-0",
                children: item.label
            }, item.href, false, {
                fileName: "[project]/src/components/layout/mobile-navigation.tsx",
                lineNumber: 119,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/src/components/layout/mobile-navigation.tsx",
        lineNumber: 108,
        columnNumber: 5
    }, this);
}
_s(MobileNavigation, "xbyQPtUVMO7MNj7WjJlpdWqRcTo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = MobileNavigation;
var _c;
__turbopack_context__.k.register(_c, "MobileNavigation");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layout/navigation-link.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NavigationLink",
    ()=>NavigationLink
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/utils/cn.ts [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// sisiMove — Navigation Link
// -----------------------------------------------------------------------------
//
// Reusable navigation-link primitive for the sisiMove application shell.
//
// Responsibilities:
// - Render consistent navigation links.
// - Support active/inactive visual states.
// - Support optional leading content.
// - Preserve native Next.js navigation behavior.
//
// Architectural boundary:
//
// - Presentation only.
// - Domain-agnostic.
// - No authentication or business logic.
// - No API calls.
// - Does not determine the current route.
// - The parent navigation component owns active-state calculation.
//
// -----------------------------------------------------------------------------
//
// ACCESSIBILITY
//
// `active` represents an actual current navigation destination, so the active
// state is exposed through `aria-current="page"`.
//
// `leadingContent` is decorative from the link's accessible-name perspective;
// the visible navigation label remains the accessible name.
//
// -----------------------------------------------------------------------------
'use client';
;
;
;
function NavigationLink({ href, children, active = false, leadingContent, className, onClick, ...props }) {
    const hasLeadingContent = Boolean(leadingContent);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        ...props,
        href: href,
        "aria-current": active ? 'page' : undefined,
        onClick: onClick,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(// ---------------------------------------------------------------------
        // Base
        // ---------------------------------------------------------------------
        'inline-flex', 'min-h-9', 'min-w-0', 'shrink-0', 'items-center', 'gap-2', 'rounded-[var(--radius-md)]', 'px-3', 'text-sm', 'font-medium', 'leading-5', 'outline-none', 'transition-colors', 'duration-150', 'ease-out', // ---------------------------------------------------------------------
        // Keyboard focus
        // ---------------------------------------------------------------------
        'focus-visible:ring-2', 'focus-visible:ring-[var(--brand)]', 'focus-visible:ring-offset-2', 'focus-visible:ring-offset-[var(--background)]', // ---------------------------------------------------------------------
        // Active / inactive state
        // ---------------------------------------------------------------------
        active ? [
            'bg-[var(--brand-soft)]',
            'text-[var(--brand)]'
        ].join(' ') : [
            'text-[var(--foreground-secondary)]',
            'hover:bg-[var(--background-subtle)]',
            'hover:text-[var(--foreground)]',
            'active:bg-[var(--background-muted)]'
        ].join(' '), // ---------------------------------------------------------------------
        // Leading content
        // ---------------------------------------------------------------------
        hasLeadingContent && 'pl-2.5', // ---------------------------------------------------------------------
        // Consumer overrides
        // ---------------------------------------------------------------------
        className),
        children: [
            leadingContent && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                "aria-hidden": "true",
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('inline-flex', 'shrink-0', 'items-center', active ? 'text-[var(--brand)]' : 'text-[var(--foreground-muted)]'),
                children: leadingContent
            }, void 0, false, {
                fileName: "[project]/src/components/layout/navigation-link.tsx",
                lineNumber: 171,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "min-w-0 truncate",
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/layout/navigation-link.tsx",
                lineNumber: 186,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/layout/navigation-link.tsx",
        lineNumber: 106,
        columnNumber: 5
    }, this);
}
_c = NavigationLink;
var _c;
__turbopack_context__.k.register(_c, "NavigationLink");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layout/site-header.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SiteHeader",
    ()=>SiteHeader,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/foundation/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/utils/cn.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$routing$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/foundation/routing/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$routing$2f$authentication$2d$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/routing/authentication-routes.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$routing$2f$public$2d$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/routing/public-routes.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/ui/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$container$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/container.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$shared$2f$account$2d$actions$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/landing/shared/account-actions/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$shared$2f$account$2d$actions$2f$join$2d$sisi$2d$move$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/shared/account-actions/join-sisi-move.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$shared$2f$account$2d$actions$2f$sign$2d$in$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/shared/account-actions/sign-in.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$desktop$2d$navigation$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/desktop-navigation.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$mobile$2d$navigation$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/mobile-navigation.tsx [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// sisiMove — Site Header
// -----------------------------------------------------------------------------
//
// Public site header.
//
// Responsibilities:
// - Render the sisiMove brand.
// - Compose desktop and mobile navigation.
// - Provide public authentication entry points.
// - Provide the public "Share travel plan" entry point.
// - Route protected public actions to the authentication boundary.
// - Remain independent of authentication implementation details.
//
// Architectural boundary:
//
// - SiteHeader is a public-shell composition component.
// - It does not access authentication state.
// - It does not perform authentication.
// - It does not call APIs.
// - It does not contain marketplace/domain logic.
// - It does not determine whether a user is authenticated.
// - It does not determine whether a user is verified.
//
// Public action rule:
//
//     Share travel plan → /login
//
// The public header does not attempt to determine whether the visitor can
// create or publish a journey. The login route is the entry boundary for
// this protected action.
//
// After authentication, the authenticated application is responsible for
// determining the user's verification/capability requirements.
//
// Import boundary:
//
// - Sibling layout components are imported directly.
// - Shared account-action primitives are imported from their shared boundary.
// - This component must not import from './index'.
// - The layout barrel is intended for consumers outside this module.
//
// Account actions:
//
// - SignIn owns the presentation of the sign-in action.
// - JoinSisiMove owns the presentation of the registration action.
// - SiteHeader composes those actions.
// - "Share travel plan" is a public-shell navigation action and therefore
//   remains a plain Link to the authentication boundary.
//
// Authentication state, session handling, authorization, verification,
// and registration behavior remain outside this component.
//
// -----------------------------------------------------------------------------
'use client';
;
;
;
;
;
;
;
;
function SiteHeader() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('sticky top-0 z-40', 'w-full min-w-0', 'border-b border-[var(--border)]', 'bg-[var(--surface)]/95', 'backdrop-blur'),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$container$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Container"], {
            size: "xl",
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex min-w-0', 'min-h-14', 'items-center', 'justify-between', 'gap-3', 'sm:min-h-16 sm:gap-4'),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$routing$2f$public$2d$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PUBLIC_ROUTES"].HOME,
                    "aria-label": "sisiMove home",
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('shrink-0', 'rounded-[var(--radius-md)]', 'text-xl font-bold tracking-tight', 'text-[var(--foreground)]', 'outline-none', 'transition-colors duration-150 ease-out', 'hover:text-[var(--brand)]', 'focus-visible:ring-2', 'focus-visible:ring-[var(--brand)]', 'focus-visible:ring-offset-2', 'focus-visible:ring-offset-[var(--surface)]', 'sm:text-2xl'),
                    children: [
                        "sisi",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-[var(--brand)]",
                            children: "Move"
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/site-header.tsx",
                            lineNumber: 124,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/layout/site-header.tsx",
                    lineNumber: 105,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('hidden min-w-0 flex-1', 'justify-center', 'md:flex'),
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$desktop$2d$navigation$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DesktopNavigation"], {}, void 0, false, {
                        fileName: "[project]/src/components/layout/site-header.tsx",
                        lineNumber: 138,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/layout/site-header.tsx",
                    lineNumber: 131,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('hidden shrink-0', 'items-center gap-1.5', 'md:flex'),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$routing$2f$authentication$2d$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AUTHENTICATION_ROUTES"].LOGIN,
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('inline-flex items-center justify-center', 'min-h-9', 'rounded-[var(--radius-md)]', 'px-3', 'text-sm font-medium', 'text-[var(--foreground)]', 'outline-none', 'transition-colors duration-150 ease-out', 'hover:bg-[var(--muted)]', 'hover:text-[var(--brand)]', 'focus-visible:ring-2', 'focus-visible:ring-[var(--brand)]', 'focus-visible:ring-offset-2', 'focus-visible:ring-offset-[var(--surface)]'),
                            children: "Share travel plan"
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/site-header.tsx",
                            lineNumber: 169,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$shared$2f$account$2d$actions$2f$sign$2d$in$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SignIn"], {
                            compact: true
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/site-header.tsx",
                            lineNumber: 191,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$shared$2f$account$2d$actions$2f$join$2d$sisi$2d$move$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JoinSisiMove"], {
                            compact: true
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/site-header.tsx",
                            lineNumber: 193,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/layout/site-header.tsx",
                    lineNumber: 145,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex min-w-0 shrink-0', 'items-center gap-1.5', 'md:hidden'),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$mobile$2d$navigation$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MobileNavigation"], {}, void 0, false, {
                            fileName: "[project]/src/components/layout/site-header.tsx",
                            lineNumber: 207,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$shared$2f$account$2d$actions$2f$sign$2d$in$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SignIn"], {
                            compact: true
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/site-header.tsx",
                            lineNumber: 209,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/layout/site-header.tsx",
                    lineNumber: 200,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/layout/site-header.tsx",
            lineNumber: 90,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/layout/site-header.tsx",
        lineNumber: 81,
        columnNumber: 5
    }, this);
}
_c = SiteHeader;
const __TURBOPACK__default__export__ = SiteHeader;
var _c;
__turbopack_context__.k.register(_c, "SiteHeader");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/avatar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Avatar",
    ()=>Avatar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/utils/cn.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
// -----------------------------------------------------------------------------
// sisiMove — Avatar
// -----------------------------------------------------------------------------
//
// Reusable avatar primitive for the sisiMove design system.
//
// Responsibilities:
// - Display optimized profile images through next/image
// - Provide accessible fallback initials
// - Support semantic sizes
// - Handle broken image sources gracefully
// - Provide responsive image sizing for optimized delivery
//
// The component remains domain-agnostic.
//
// -----------------------------------------------------------------------------
'use client';
;
;
;
// -----------------------------------------------------------------------------
// Styles
// -----------------------------------------------------------------------------
const sizeClasses = {
    xs: 'h-6 w-6 text-[10px]',
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg',
    // Large identity avatar used by profile headers and other
    // primary traveller identity surfaces.
    '2xl': 'h-24 w-24 text-2xl'
};
const imageSizes = {
    xs: '24px',
    sm: '32px',
    md: '40px',
    lg: '48px',
    xl: '64px',
    '2xl': '96px'
};
// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------
function getInitials(value) {
    const normalized = value?.trim();
    if (!normalized) {
        return '?';
    }
    const parts = normalized.split(/\s+/).filter(Boolean);
    if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase();
    }
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}
function Avatar({ src, alt = '', fallback, size = 'md', className, onError, sizes, ...props }) {
    _s();
    const [failedSource, setFailedSource] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const source = src?.trim() || undefined;
    const imageFailed = Boolean(source) && failedSource === source;
    const showFallback = !source || imageFailed;
    const handleError = (event)=>{
        if (source) {
            setFailedSource(source);
        }
        onError?.(event);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('relative', 'inline-flex', 'shrink-0', 'items-center', 'justify-center', 'overflow-hidden', 'rounded-[var(--radius-full)]', 'bg-[var(--background-muted)]', 'font-semibold', 'text-[var(--foreground-secondary)]', 'select-none', sizeClasses[size], className),
        children: showFallback ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            "aria-hidden": "true",
            className: "flex h-full w-full items-center justify-center",
            children: getInitials(fallback)
        }, void 0, false, {
            fileName: "[project]/src/components/ui/avatar.tsx",
            lineNumber: 186,
            columnNumber: 9
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            ...props,
            src: source,
            alt: alt,
            fill: true,
            sizes: sizes ?? imageSizes[size],
            onError: handleError,
            className: "object-cover"
        }, void 0, false, {
            fileName: "[project]/src/components/ui/avatar.tsx",
            lineNumber: 193,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/avatar.tsx",
        lineNumber: 168,
        columnNumber: 5
    }, this);
}
_s(Avatar, "4L6bL/FD7mtTIrpv2c+tiP/x6b8=");
_c = Avatar;
var _c;
__turbopack_context__.k.register(_c, "Avatar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/badge.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Badge
// -----------------------------------------------------------------------------
//
// Reusable status / metadata badge for the sisiMove design system.
//
// Responsibilities:
// - Compact semantic status presentation
// - Consistent typography and spacing
// - Optional leading/trailing content
// - Domain-agnostic presentation
//
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "Badge",
    ()=>Badge
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/utils/cn.ts [app-client] (ecmascript)");
;
;
// -----------------------------------------------------------------------------
// Styles
// -----------------------------------------------------------------------------
const variantClasses = {
    default: [
        'bg-[var(--background-muted)]',
        'text-[var(--foreground-secondary)]'
    ].join(' '),
    brand: [
        'bg-[var(--brand-soft)]',
        'text-[var(--brand)]'
    ].join(' '),
    success: [
        'bg-[var(--success-soft)]',
        'text-[var(--success)]'
    ].join(' '),
    warning: [
        'bg-[var(--warning-soft)]',
        'text-[var(--warning)]'
    ].join(' '),
    danger: [
        'bg-[var(--danger-soft)]',
        'text-[var(--danger)]'
    ].join(' '),
    outline: [
        'border',
        'border-[var(--border)]',
        'bg-transparent',
        'text-[var(--foreground-secondary)]'
    ].join(' ')
};
const sizeClasses = {
    sm: [
        'min-h-5',
        'px-2',
        'text-[11px]',
        'leading-4'
    ].join(' '),
    md: [
        'min-h-6',
        'px-2.5',
        'text-xs',
        'leading-4'
    ].join(' ')
};
function Badge({ variant = 'default', size = 'md', leadingContent, trailingContent, children, className, ...props }) {
    const hasLeadingContent = Boolean(leadingContent);
    const hasTrailingContent = Boolean(trailingContent);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        ...props,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('inline-flex', 'w-fit', 'shrink-0', 'items-center', 'justify-center', 'gap-1.5', 'rounded-[var(--radius-full)]', 'font-medium', 'whitespace-nowrap', 'select-none', variantClasses[variant], sizeClasses[size], hasLeadingContent && 'pl-2', hasTrailingContent && 'pr-2', className),
        children: [
            leadingContent && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                "aria-hidden": "true",
                className: "inline-flex shrink-0 items-center",
                children: leadingContent
            }, void 0, false, {
                fileName: "[project]/src/components/ui/badge.tsx",
                lineNumber: 158,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/ui/badge.tsx",
                lineNumber: 166,
                columnNumber: 7
            }, this),
            trailingContent && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                "aria-hidden": "true",
                className: "inline-flex shrink-0 items-center",
                children: trailingContent
            }, void 0, false, {
                fileName: "[project]/src/components/ui/badge.tsx",
                lineNumber: 169,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/badge.tsx",
        lineNumber: 137,
        columnNumber: 5
    }, this);
}
_c = Badge;
var _c;
__turbopack_context__.k.register(_c, "Badge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Button
// -----------------------------------------------------------------------------
//
// Reusable button primitive for the sisiMove design system.
//
// Responsibilities:
// - Consistent button appearance
// - Semantic variants
// - Consistent sizing
// - Keyboard/focus accessibility
// - Disabled/loading states
// - Native button behavior
//
// The component intentionally contains no business/domain logic.
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "Button",
    ()=>Button
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/utils/cn.ts [app-client] (ecmascript)");
;
;
// -----------------------------------------------------------------------------
// Variant Classes
// -----------------------------------------------------------------------------
const variantClasses = {
    primary: [
        'bg-[var(--brand)]',
        'text-[var(--brand-foreground)]',
        'border',
        'border-transparent',
        'hover:bg-[var(--brand-hover)]',
        'active:bg-[var(--brand-hover)]'
    ].join(' '),
    secondary: [
        'bg-[var(--background-muted)]',
        'text-[var(--foreground)]',
        'border',
        'border-transparent',
        'hover:bg-[var(--border)]',
        'active:bg-[var(--border-strong)]'
    ].join(' '),
    outline: [
        'bg-transparent',
        'text-[var(--foreground)]',
        'border',
        'border-[var(--border-strong)]',
        'hover:bg-[var(--background-subtle)]',
        'hover:border-[var(--foreground-subtle)]',
        'active:bg-[var(--background-muted)]'
    ].join(' '),
    ghost: [
        'bg-transparent',
        'text-[var(--foreground-secondary)]',
        'border',
        'border-transparent',
        'hover:bg-[var(--background-subtle)]',
        'hover:text-[var(--foreground)]',
        'active:bg-[var(--background-muted)]'
    ].join(' '),
    danger: [
        'bg-[var(--danger)]',
        'text-[var(--brand-foreground)]',
        'border',
        'border-transparent',
        'hover:opacity-90',
        'active:opacity-80'
    ].join(' ')
};
// -----------------------------------------------------------------------------
// Size Classes
// -----------------------------------------------------------------------------
const sizeClasses = {
    sm: [
        'min-h-9',
        'px-3',
        'text-sm',
        'rounded-[var(--radius-md)]'
    ].join(' '),
    md: [
        'min-h-10',
        'px-4',
        'text-sm',
        'rounded-[var(--radius-md)]'
    ].join(' '),
    lg: [
        'min-h-12',
        'px-5',
        'text-base',
        'rounded-[var(--radius-lg)]'
    ].join(' ')
};
// -----------------------------------------------------------------------------
// Base Classes
// -----------------------------------------------------------------------------
const baseClasses = [
    'inline-flex',
    'items-center',
    'justify-center',
    'gap-2',
    'font-medium',
    'whitespace-nowrap',
    'select-none',
    'transition-colors',
    'duration-150',
    'ease-out',
    'focus-visible:outline-2',
    'focus-visible:outline-[var(--brand)]',
    'focus-visible:outline-offset-2',
    'disabled:pointer-events-none',
    'disabled:cursor-not-allowed',
    'disabled:opacity-50'
].join(' ');
// -----------------------------------------------------------------------------
// Loading Indicator
// -----------------------------------------------------------------------------
function ButtonSpinner() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        "aria-hidden": "true",
        className: [
            'h-4',
            'w-4',
            'shrink-0',
            'animate-spin',
            'rounded-full',
            'border-2',
            'border-current',
            'border-t-transparent'
        ].join(' ')
    }, void 0, false, {
        fileName: "[project]/src/components/ui/button.tsx",
        lineNumber: 183,
        columnNumber: 5
    }, this);
}
_c = ButtonSpinner;
function Button({ variant = 'primary', size = 'md', loading = false, leadingIcon, trailingIcon, disabled, children, className, type = 'button', ...props }) {
    const isDisabled = disabled || loading;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        ...props,
        type: type,
        disabled: isDisabled,
        "aria-busy": loading || undefined,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(baseClasses, variantClasses[variant], sizeClasses[size], className),
        children: [
            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ButtonSpinner, {}, void 0, false, {
                fileName: "[project]/src/components/ui/button.tsx",
                lineNumber: 231,
                columnNumber: 9
            }, this) : leadingIcon,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/ui/button.tsx",
                lineNumber: 236,
                columnNumber: 7
            }, this),
            !loading && trailingIcon
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/button.tsx",
        lineNumber: 218,
        columnNumber: 5
    }, this);
}
_c1 = Button;
var _c, _c1;
__turbopack_context__.k.register(_c, "ButtonSpinner");
__turbopack_context__.k.register(_c1, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Card
// -----------------------------------------------------------------------------
//
// Reusable surface/card primitive for the sisiMove design system.
//
// Responsibilities:
// - Provide consistent surface styling
// - Support semantic visual variants
// - Support optional padding and interaction states
// - Remain domain-agnostic
//
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "Card",
    ()=>Card
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/utils/cn.ts [app-client] (ecmascript)");
;
;
// -----------------------------------------------------------------------------
// Styles
// -----------------------------------------------------------------------------
const variantClasses = {
    default: [
        'border',
        'border-[var(--border)]',
        'bg-[var(--surface)]'
    ].join(' '),
    muted: [
        'border',
        'border-[var(--border-subtle)]',
        'bg-[var(--background-muted)]'
    ].join(' '),
    outlined: [
        'border',
        'border-[var(--border-strong)]',
        'bg-transparent'
    ].join(' ')
};
const paddingClasses = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
};
function Card({ variant = 'default', padding = 'md', header, footer, interactive = false, children, className, ...props }) {
    const hasHeader = Boolean(header);
    const hasFooter = Boolean(footer);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ...props,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('rounded-[var(--radius-lg)]', 'shadow-[var(--shadow-sm)]', 'transition-colors', 'duration-150', 'ease-out', variantClasses[variant], paddingClasses[padding], interactive && [
            'cursor-pointer',
            'hover:border-[var(--border-strong)]',
            'hover:shadow-[var(--shadow-md)]'
        ].join(' '), className),
        children: [
            hasHeader && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex', 'items-center', 'justify-between', 'gap-3', padding !== 'none' && 'mb-4'),
                children: header
            }, void 0, false, {
                fileName: "[project]/src/components/ui/card.tsx",
                lineNumber: 141,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/ui/card.tsx",
                lineNumber: 154,
                columnNumber: 7
            }, this),
            hasFooter && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex', 'items-center', 'justify-between', 'gap-3', padding !== 'none' && 'mt-4'),
                children: footer
            }, void 0, false, {
                fileName: "[project]/src/components/ui/card.tsx",
                lineNumber: 157,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 122,
        columnNumber: 5
    }, this);
}
_c = Card;
var _c;
__turbopack_context__.k.register(_c, "Card");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/container.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/components/ui/container.tsx
// -----------------------------------------------------------------------------
// sisiMove — Container
// -----------------------------------------------------------------------------
//
// Reusable layout container for the sisiMove design system.
//
// Responsibilities:
// - Constrain content to the application's responsive content width
// - Provide consistent horizontal spacing
// - Support configurable maximum widths
// - Remain domain-agnostic
//
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "Container",
    ()=>Container
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/utils/cn.ts [app-client] (ecmascript)");
;
;
// -----------------------------------------------------------------------------
// Styles
// -----------------------------------------------------------------------------
const sizeClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-3xl',
    lg: 'max-w-5xl',
    xl: 'max-w-6xl',
    '2xl': 'max-w-7xl',
    full: 'max-w-none'
};
const paddingClasses = [
    'px-4',
    'sm:px-6',
    'lg:px-8'
].join(' ');
function Container({ size = 'xl', padded = true, children, className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ...props,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('mx-auto', 'w-full', sizeClasses[size], padded && paddingClasses, className),
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/container.tsx",
        lineNumber: 87,
        columnNumber: 5
    }, this);
}
_c = Container;
var _c;
__turbopack_context__.k.register(_c, "Container");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/dialog.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Dialog",
    ()=>Dialog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/utils/cn.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
// -----------------------------------------------------------------------------
// sisiMove — Dialog
// -----------------------------------------------------------------------------
//
// Reusable modal/dialog primitive for the sisiMove design system.
//
// Responsibilities:
// - Provide an accessible modal surface
// - Manage open/closed presentation
// - Support Escape-to-close
// - Support backdrop interaction
// - Restore focus when closed
// - Provide consistent dialog styling
// - Remain completely domain-agnostic
//
// The component intentionally contains no business/domain logic.
// -----------------------------------------------------------------------------
'use client';
;
;
// -----------------------------------------------------------------------------
// Size Classes
// -----------------------------------------------------------------------------
const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
};
function Dialog({ open, onOpenChange, title, description, children, footer, size = 'md', closeOnBackdropClick = true, closeOnEscape = true, showCloseButton = true, className, ...props }) {
    _s();
    const titleId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])();
    const descriptionId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])();
    const dialogRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const previouslyFocusedElementRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // ---------------------------------------------------------------------------
    // Open / Close lifecycle
    // ---------------------------------------------------------------------------
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Dialog.useEffect": ()=>{
            if (!open) {
                return;
            }
            previouslyFocusedElementRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
            const previousOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            requestAnimationFrame({
                "Dialog.useEffect": ()=>{
                    dialogRef.current?.focus();
                }
            }["Dialog.useEffect"]);
            return ({
                "Dialog.useEffect": ()=>{
                    document.body.style.overflow = previousOverflow;
                    previouslyFocusedElementRef.current?.focus();
                    previouslyFocusedElementRef.current = null;
                }
            })["Dialog.useEffect"];
        }
    }["Dialog.useEffect"], [
        open
    ]);
    // ---------------------------------------------------------------------------
    // Escape
    // ---------------------------------------------------------------------------
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Dialog.useEffect": ()=>{
            if (!open || !closeOnEscape) {
                return;
            }
            function handleKeyDown(event) {
                if (event.key !== 'Escape') {
                    return;
                }
                event.preventDefault();
                onOpenChange(false);
            }
            document.addEventListener('keydown', handleKeyDown);
            return ({
                "Dialog.useEffect": ()=>{
                    document.removeEventListener('keydown', handleKeyDown);
                }
            })["Dialog.useEffect"];
        }
    }["Dialog.useEffect"], [
        open,
        closeOnEscape,
        onOpenChange
    ]);
    // ---------------------------------------------------------------------------
    // Closed
    // ---------------------------------------------------------------------------
    if (!open) {
        return null;
    }
    // ---------------------------------------------------------------------------
    // Render
    // ---------------------------------------------------------------------------
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: [
            'fixed',
            'inset-0',
            'z-50',
            'flex',
            'items-center',
            'justify-center',
            'p-4',
            'sm:p-6'
        ].join(' '),
        role: "presentation",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                "aria-hidden": "true",
                className: [
                    'absolute',
                    'inset-0',
                    'bg-[rgb(15_23_42_/_0.45)]',
                    'backdrop-blur-[2px]'
                ].join(' '),
                onMouseDown: (event)=>{
                    if (closeOnBackdropClick && event.target === event.currentTarget) {
                        onOpenChange(false);
                    }
                }
            }, void 0, false, {
                fileName: "[project]/src/components/ui/dialog.tsx",
                lineNumber: 225,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ...props,
                ref: dialogRef,
                role: "dialog",
                "aria-modal": "true",
                "aria-labelledby": titleId,
                "aria-describedby": description ? descriptionId : undefined,
                tabIndex: -1,
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('relative', 'z-10', 'flex', 'max-h-[calc(100vh-2rem)]', 'w-full', 'flex-col', 'overflow-hidden', 'rounded-[var(--radius-xl)]', 'border', 'border-[var(--border)]', 'bg-[var(--surface)]', 'shadow-[var(--shadow-lg)]', 'outline-none', 'sm:max-h-[calc(100vh-3rem)]', sizeClasses[size], className),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: [
                            'flex',
                            'shrink-0',
                            'items-start',
                            'justify-between',
                            'gap-4',
                            'border-b',
                            'border-[var(--border-subtle)]',
                            'px-4',
                            'py-4',
                            'sm:px-6',
                            'sm:py-5'
                        ].join(' '),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "min-w-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        id: titleId,
                                        className: [
                                            'text-base',
                                            'font-semibold',
                                            'leading-6',
                                            'text-[var(--foreground)]',
                                            'sm:text-lg'
                                        ].join(' '),
                                        children: title
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ui/dialog.tsx",
                                        lineNumber: 296,
                                        columnNumber: 13
                                    }, this),
                                    description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        id: descriptionId,
                                        className: [
                                            'mt-1',
                                            'text-sm',
                                            'leading-5',
                                            'text-[var(--foreground-muted)]'
                                        ].join(' '),
                                        children: description
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ui/dialog.tsx",
                                        lineNumber: 310,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ui/dialog.tsx",
                                lineNumber: 295,
                                columnNumber: 11
                            }, this),
                            showCloseButton && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                "aria-label": "Close dialog",
                                onClick: ()=>onOpenChange(false),
                                className: [
                                    'inline-flex',
                                    'h-9',
                                    'w-9',
                                    'shrink-0',
                                    'items-center',
                                    'justify-center',
                                    'rounded-[var(--radius-md)]',
                                    'border',
                                    'border-transparent',
                                    'text-[var(--foreground-muted)]',
                                    'transition-colors',
                                    'duration-150',
                                    'ease-out',
                                    'hover:bg-[var(--background-subtle)]',
                                    'hover:text-[var(--foreground)]',
                                    'focus-visible:outline-2',
                                    'focus-visible:outline-[var(--brand)]',
                                    'focus-visible:outline-offset-2'
                                ].join(' '),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    viewBox: "0 0 20 20",
                                    fill: "none",
                                    stroke: "currentColor",
                                    strokeWidth: "1.75",
                                    className: "h-5 w-5",
                                    "aria-hidden": "true",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M5 5l10 10M15 5 5 15",
                                        strokeLinecap: "round"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ui/dialog.tsx",
                                        lineNumber: 358,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/dialog.tsx",
                                    lineNumber: 350,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/dialog.tsx",
                                lineNumber: 325,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/dialog.tsx",
                        lineNumber: 280,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: [
                            'min-h-0',
                            'flex-1',
                            'overflow-y-auto',
                            'px-4',
                            'py-5',
                            'sm:px-6',
                            'sm:py-6'
                        ].join(' '),
                        children: children
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/dialog.tsx",
                        lineNumber: 371,
                        columnNumber: 9
                    }, this),
                    footer && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: [
                            'flex',
                            'shrink-0',
                            'flex-col-reverse',
                            'gap-2',
                            'border-t',
                            'border-[var(--border-subtle)]',
                            'px-4',
                            'py-4',
                            'sm:flex-row',
                            'sm:items-center',
                            'sm:justify-end',
                            'sm:px-6',
                            'sm:py-5'
                        ].join(' '),
                        children: footer
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/dialog.tsx",
                        lineNumber: 390,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/dialog.tsx",
                lineNumber: 247,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/dialog.tsx",
        lineNumber: 208,
        columnNumber: 5
    }, this);
}
_s(Dialog, "dVkNI9mu+KaiYTSsElqm4+pxwMU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"]
    ];
});
_c = Dialog;
var _c;
__turbopack_context__.k.register(_c, "Dialog");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/divider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Divider
// -----------------------------------------------------------------------------
//
// Reusable divider primitive for the sisiMove design system.
//
// Responsibilities:
// - Separate related content visually
// - Support horizontal and vertical orientations
// - Support optional accessible labeling
// - Remain domain-agnostic
//
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "Divider",
    ()=>Divider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/utils/cn.ts [app-client] (ecmascript)");
;
;
function Divider({ orientation = 'horizontal', label, className, role = 'separator', ...props }) {
    const isHorizontal = orientation === 'horizontal';
    if (!isHorizontal) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            ...props,
            role: role,
            "aria-orientation": "vertical",
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('w-px', 'self-stretch', 'bg-[var(--border)]', className)
        }, void 0, false, {
            fileName: "[project]/src/components/ui/divider.tsx",
            lineNumber: 60,
            columnNumber: 7
        }, this);
    }
    if (!label) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            ...props,
            role: role,
            "aria-orientation": "horizontal",
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('h-px', 'w-full', 'bg-[var(--border)]', className)
        }, void 0, false, {
            fileName: "[project]/src/components/ui/divider.tsx",
            lineNumber: 76,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ...props,
        role: role,
        "aria-orientation": "horizontal",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex', 'w-full', 'items-center', 'gap-3', className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                "aria-hidden": "true",
                className: "h-px flex-1 bg-[var(--border)]"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/divider.tsx",
                lineNumber: 103,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "shrink-0 text-xs font-medium text-[var(--foreground-muted)]",
                children: label
            }, void 0, false, {
                fileName: "[project]/src/components/ui/divider.tsx",
                lineNumber: 108,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                "aria-hidden": "true",
                className: "h-px flex-1 bg-[var(--border)]"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/divider.tsx",
                lineNumber: 112,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/divider.tsx",
        lineNumber: 91,
        columnNumber: 5
    }, this);
}
_c = Divider;
var _c;
__turbopack_context__.k.register(_c, "Divider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/empty-state.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Empty State
// -----------------------------------------------------------------------------
//
// Reusable empty-state primitive for the sisiMove design system.
//
// Responsibilities:
// - Communicate that a collection or view has no content
// - Provide optional supporting text
// - Provide optional visual content
// - Support a primary and secondary action
// - Remain domain-agnostic
//
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "EmptyState",
    ()=>EmptyState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/utils/cn.ts [app-client] (ecmascript)");
;
;
// -----------------------------------------------------------------------------
// Action
// -----------------------------------------------------------------------------
function EmptyStateActionButton({ action }) {
    const { label, leadingContent, variant = 'primary', className, type = 'button', ...props } = action;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        ...props,
        type: type,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('inline-flex', 'min-h-10', 'items-center', 'justify-center', 'gap-2', 'rounded-[var(--radius-md)]', 'px-4', 'text-sm', 'font-medium', 'transition-colors', 'duration-150', 'ease-out', 'outline-none', 'focus-visible:ring-2', 'focus-visible:ring-[var(--brand)]/30', 'disabled:cursor-not-allowed', 'disabled:opacity-60', variant === 'primary' && [
            'bg-[var(--brand)]',
            'text-[var(--brand-foreground)]',
            'hover:bg-[var(--brand-hover)]'
        ].join(' '), variant === 'secondary' && [
            'bg-[var(--background-muted)]',
            'text-[var(--foreground)]',
            'hover:bg-[var(--background-subtle)]'
        ].join(' '), variant === 'outline' && [
            'border',
            'border-[var(--border)]',
            'bg-[var(--surface)]',
            'text-[var(--foreground)]',
            'hover:border-[var(--border-strong)]',
            'hover:bg-[var(--background-muted)]'
        ].join(' '), variant === 'ghost' && [
            'bg-transparent',
            'text-[var(--foreground-secondary)]',
            'hover:bg-[var(--background-muted)]',
            'hover:text-[var(--foreground)]'
        ].join(' '), className),
        children: [
            leadingContent && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                "aria-hidden": "true",
                className: "inline-flex shrink-0 items-center",
                children: leadingContent
            }, void 0, false, {
                fileName: "[project]/src/components/ui/empty-state.tsx",
                lineNumber: 150,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: label
            }, void 0, false, {
                fileName: "[project]/src/components/ui/empty-state.tsx",
                lineNumber: 158,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/empty-state.tsx",
        lineNumber: 96,
        columnNumber: 5
    }, this);
}
_c = EmptyStateActionButton;
function EmptyState({ icon, title, description, primaryAction, secondaryAction, className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex', 'w-full', 'flex-col', 'items-center', 'justify-center', 'px-6', 'py-12', 'text-center', className),
        children: [
            icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                "aria-hidden": "true",
                className: [
                    'mb-4',
                    'flex',
                    'h-12',
                    'w-12',
                    'items-center',
                    'justify-center',
                    'rounded-[var(--radius-full)]',
                    'bg-[var(--brand-soft)]',
                    'text-[var(--brand)]'
                ].join(' '),
                children: icon
            }, void 0, false, {
                fileName: "[project]/src/components/ui/empty-state.tsx",
                lineNumber: 190,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "text-base font-semibold text-[var(--foreground)]",
                children: title
            }, void 0, false, {
                fileName: "[project]/src/components/ui/empty-state.tsx",
                lineNumber: 208,
                columnNumber: 7
            }, this),
            description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-2 max-w-md text-sm leading-6 text-[var(--foreground-muted)]",
                children: description
            }, void 0, false, {
                fileName: "[project]/src/components/ui/empty-state.tsx",
                lineNumber: 213,
                columnNumber: 9
            }, this),
            (primaryAction || secondaryAction) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-6 flex flex-wrap items-center justify-center gap-3",
                children: [
                    primaryAction && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EmptyStateActionButton, {
                        action: primaryAction
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/empty-state.tsx",
                        lineNumber: 221,
                        columnNumber: 13
                    }, this),
                    secondaryAction && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EmptyStateActionButton, {
                        action: secondaryAction
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/empty-state.tsx",
                        lineNumber: 225,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/empty-state.tsx",
                lineNumber: 219,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/empty-state.tsx",
        lineNumber: 176,
        columnNumber: 5
    }, this);
}
_c1 = EmptyState;
var _c, _c1;
__turbopack_context__.k.register(_c, "EmptyStateActionButton");
__turbopack_context__.k.register(_c1, "EmptyState");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/error-state.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Error State
// -----------------------------------------------------------------------------
//
// Reusable error-state primitive for the sisiMove design system.
//
// Responsibilities:
// - Communicate recoverable loading or data errors
// - Provide optional supporting information
// - Provide retry and secondary actions
// - Remain domain-agnostic
//
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "ErrorState",
    ()=>ErrorState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/utils/cn.ts [app-client] (ecmascript)");
;
;
// -----------------------------------------------------------------------------
// Action
// -----------------------------------------------------------------------------
function ErrorStateActionButton({ action }) {
    const { label, leadingContent, variant = 'primary', className, type = 'button', ...props } = action;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        ...props,
        type: type,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('inline-flex', 'min-h-10', 'items-center', 'justify-center', 'gap-2', 'rounded-[var(--radius-md)]', 'px-4', 'text-sm', 'font-medium', 'transition-colors', 'duration-150', 'ease-out', 'outline-none', 'focus-visible:ring-2', 'focus-visible:ring-[var(--brand)]/30', 'disabled:cursor-not-allowed', 'disabled:opacity-60', variant === 'primary' && [
            'bg-[var(--brand)]',
            'text-[var(--brand-foreground)]',
            'hover:bg-[var(--brand-hover)]'
        ].join(' '), variant === 'secondary' && [
            'bg-[var(--background-muted)]',
            'text-[var(--foreground)]',
            'hover:bg-[var(--background-subtle)]'
        ].join(' '), variant === 'outline' && [
            'border',
            'border-[var(--border)]',
            'bg-[var(--surface)]',
            'text-[var(--foreground)]',
            'hover:border-[var(--border-strong)]',
            'hover:bg-[var(--background-muted)]'
        ].join(' '), variant === 'ghost' && [
            'bg-transparent',
            'text-[var(--foreground-secondary)]',
            'hover:bg-[var(--background-muted)]',
            'hover:text-[var(--foreground)]'
        ].join(' '), className),
        children: [
            leadingContent && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                "aria-hidden": "true",
                className: "inline-flex shrink-0 items-center",
                children: leadingContent
            }, void 0, false, {
                fileName: "[project]/src/components/ui/error-state.tsx",
                lineNumber: 149,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: label
            }, void 0, false, {
                fileName: "[project]/src/components/ui/error-state.tsx",
                lineNumber: 157,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/error-state.tsx",
        lineNumber: 95,
        columnNumber: 5
    }, this);
}
_c = ErrorStateActionButton;
function ErrorState({ icon, title = 'Something went wrong', description = 'We could not complete your request. Please try again.', retryAction, secondaryAction, className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        role: "alert",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex', 'w-full', 'flex-col', 'items-center', 'justify-center', 'px-6', 'py-12', 'text-center', className),
        children: [
            icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                "aria-hidden": "true",
                className: [
                    'mb-4',
                    'flex',
                    'h-12',
                    'w-12',
                    'items-center',
                    'justify-center',
                    'rounded-[var(--radius-full)]',
                    'bg-[var(--danger-soft)]',
                    'text-[var(--danger)]'
                ].join(' '),
                children: icon
            }, void 0, false, {
                fileName: "[project]/src/components/ui/error-state.tsx",
                lineNumber: 190,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "text-base font-semibold text-[var(--foreground)]",
                children: title
            }, void 0, false, {
                fileName: "[project]/src/components/ui/error-state.tsx",
                lineNumber: 208,
                columnNumber: 7
            }, this),
            description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-2 max-w-md text-sm leading-6 text-[var(--foreground-muted)]",
                children: description
            }, void 0, false, {
                fileName: "[project]/src/components/ui/error-state.tsx",
                lineNumber: 213,
                columnNumber: 9
            }, this),
            (retryAction || secondaryAction) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-6 flex flex-wrap items-center justify-center gap-3",
                children: [
                    retryAction && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ErrorStateActionButton, {
                        action: retryAction
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/error-state.tsx",
                        lineNumber: 221,
                        columnNumber: 13
                    }, this),
                    secondaryAction && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ErrorStateActionButton, {
                        action: secondaryAction
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/error-state.tsx",
                        lineNumber: 225,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/error-state.tsx",
                lineNumber: 219,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/error-state.tsx",
        lineNumber: 175,
        columnNumber: 5
    }, this);
}
_c1 = ErrorState;
var _c, _c1;
__turbopack_context__.k.register(_c, "ErrorStateActionButton");
__turbopack_context__.k.register(_c1, "ErrorState");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// -----------------------------------------------------------------------------
// sisiMove — UI Components
// -----------------------------------------------------------------------------
//
// Public barrel for reusable design-system UI primitives.
//
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/textarea.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/select.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/avatar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$divider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/divider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$container$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/container.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/skeleton.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$spinner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/spinner.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$empty$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/empty-state.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$error$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/error-state.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/dialog.tsx [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/input.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Input
// -----------------------------------------------------------------------------
//
// Reusable text input primitive for the sisiMove design system.
//
// Responsibilities:
// - Consistent input appearance
// - Accessible labeling support
// - Error and helper states
// - Leading/trailing content
// - Native HTML input behavior
//
// The component remains domain-agnostic.
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "Input",
    ()=>Input
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/utils/cn.ts [app-client] (ecmascript)");
;
;
function Input({ id, label, helperText, error, leadingContent, trailingContent, fullWidth = true, className, disabled, required, ...props }) {
    const generatedId = id ?? undefined;
    const describedById = generatedId ? error ? `${generatedId}-error` : helperText ? `${generatedId}-helper` : undefined : undefined;
    const hasError = Boolean(error);
    const hasLeadingContent = Boolean(leadingContent);
    const hasTrailingContent = Boolean(trailingContent);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex flex-col gap-1.5', fullWidth && 'w-full'),
        children: [
            label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                htmlFor: generatedId,
                className: "text-sm font-medium text-[var(--foreground)]",
                children: [
                    label,
                    required && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        "aria-hidden": "true",
                        className: "ml-1 text-[var(--danger)]",
                        children: "*"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/input.tsx",
                        lineNumber: 107,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/input.tsx",
                lineNumber: 100,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative",
                children: [
                    leadingContent && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        "aria-hidden": "true",
                        className: [
                            'pointer-events-none',
                            'absolute',
                            'inset-y-0',
                            'left-3',
                            'flex',
                            'items-center',
                            'text-[var(--foreground-muted)]'
                        ].join(' '),
                        children: leadingContent
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/input.tsx",
                        lineNumber: 119,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        ...props,
                        id: generatedId,
                        disabled: disabled,
                        required: required,
                        "aria-invalid": hasError || undefined,
                        "aria-describedby": describedById,
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('min-h-10', 'w-full', 'rounded-[var(--radius-md)]', 'border', 'bg-[var(--surface)]', 'px-3', 'text-sm', 'text-[var(--foreground)]', 'placeholder:text-[var(--foreground-subtle)]', 'transition-colors', 'duration-150', 'ease-out', 'outline-none', 'border-[var(--border)]', 'hover:border-[var(--border-strong)]', 'focus:border-[var(--brand)]', 'focus:ring-2', 'focus:ring-[var(--brand)]/10', 'disabled:cursor-not-allowed', 'disabled:bg-[var(--background-muted)]', 'disabled:text-[var(--foreground-muted)]', 'disabled:opacity-70', hasError && [
                            'border-[var(--danger)]',
                            'focus:border-[var(--danger)]',
                            'focus:ring-2',
                            'focus:ring-[var(--danger)]/10'
                        ].join(' '), hasLeadingContent && 'pl-10', hasTrailingContent && 'pr-10', className)
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/input.tsx",
                        lineNumber: 135,
                        columnNumber: 9
                    }, this),
                    trailingContent && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        "aria-hidden": "true",
                        className: [
                            'pointer-events-none',
                            'absolute',
                            'inset-y-0',
                            'right-3',
                            'flex',
                            'items-center',
                            'text-[var(--foreground-muted)]'
                        ].join(' '),
                        children: trailingContent
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/input.tsx",
                        lineNumber: 179,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/input.tsx",
                lineNumber: 117,
                columnNumber: 7
            }, this),
            error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                id: generatedId ? `${generatedId}-error` : undefined,
                className: "text-sm text-[var(--danger)]",
                children: error
            }, void 0, false, {
                fileName: "[project]/src/components/ui/input.tsx",
                lineNumber: 197,
                columnNumber: 9
            }, this) : helperText ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                id: generatedId ? `${generatedId}-helper` : undefined,
                className: "text-sm text-[var(--foreground-muted)]",
                children: helperText
            }, void 0, false, {
                fileName: "[project]/src/components/ui/input.tsx",
                lineNumber: 204,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/input.tsx",
        lineNumber: 93,
        columnNumber: 5
    }, this);
}
_c = Input;
var _c;
__turbopack_context__.k.register(_c, "Input");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/select.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Select
// -----------------------------------------------------------------------------
//
// Reusable native select primitive for the sisiMove design system.
//
// Responsibilities:
// - Consistent select appearance
// - Accessible labeling support
// - Helper and validation states
// - Native HTML select behavior
//
// The component remains domain-agnostic.
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "Select",
    ()=>Select
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/utils/cn.ts [app-client] (ecmascript)");
;
;
function Select({ id, label, helperText, error, options, leadingContent, fullWidth = true, className, disabled, required, children, ...props }) {
    const generatedId = id ?? undefined;
    const hasError = Boolean(error);
    const hasLeadingContent = Boolean(leadingContent);
    const describedById = generatedId ? error ? `${generatedId}-error` : helperText ? `${generatedId}-helper` : undefined : undefined;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex flex-col gap-1.5', fullWidth && 'w-full'),
        children: [
            label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                htmlFor: generatedId,
                className: "text-sm font-medium text-[var(--foreground)]",
                children: [
                    label,
                    required && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        "aria-hidden": "true",
                        className: "ml-1 text-[var(--danger)]",
                        children: "*"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/select.tsx",
                        lineNumber: 114,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/select.tsx",
                lineNumber: 107,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative",
                children: [
                    leadingContent && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        "aria-hidden": "true",
                        className: [
                            'pointer-events-none',
                            'absolute',
                            'inset-y-0',
                            'left-3',
                            'z-10',
                            'flex',
                            'items-center',
                            'text-[var(--foreground-muted)]'
                        ].join(' '),
                        children: leadingContent
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/select.tsx",
                        lineNumber: 126,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        ...props,
                        id: generatedId,
                        disabled: disabled,
                        required: required,
                        "aria-invalid": hasError || undefined,
                        "aria-describedby": describedById,
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('min-h-10', 'w-full', 'appearance-none', 'rounded-[var(--radius-md)]', 'border', 'bg-[var(--surface)]', 'px-3', 'pr-10', 'text-sm', 'text-[var(--foreground)]', 'transition-colors', 'duration-150', 'ease-out', 'outline-none', 'border-[var(--border)]', 'hover:border-[var(--border-strong)]', 'focus:border-[var(--brand)]', 'focus:ring-2', 'focus:ring-[var(--brand)]/10', 'disabled:cursor-not-allowed', 'disabled:bg-[var(--background-muted)]', 'disabled:text-[var(--foreground-muted)]', 'disabled:opacity-70', hasLeadingContent && 'pl-10', hasError && [
                            'border-[var(--danger)]',
                            'focus:border-[var(--danger)]',
                            'focus:ring-2',
                            'focus:ring-[var(--danger)]/10'
                        ].join(' '), className),
                        children: options ? options.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: option.value,
                                disabled: option.disabled,
                                children: option.label
                            }, option.value, false, {
                                fileName: "[project]/src/components/ui/select.tsx",
                                lineNumber: 187,
                                columnNumber: 17
                            }, this)) : children
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/select.tsx",
                        lineNumber: 143,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        "aria-hidden": "true",
                        className: [
                            'pointer-events-none',
                            'absolute',
                            'inset-y-0',
                            'right-3',
                            'flex',
                            'items-center',
                            'text-[var(--foreground-muted)]'
                        ].join(' '),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            viewBox: "0 0 20 20",
                            fill: "none",
                            stroke: "currentColor",
                            strokeWidth: "1.75",
                            className: "h-4 w-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "m5.5 7.5 4.5 4.5 4.5-4.5",
                                strokeLinecap: "round",
                                strokeLinejoin: "round"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/select.tsx",
                                lineNumber: 217,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/select.tsx",
                            lineNumber: 210,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/select.tsx",
                        lineNumber: 198,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/select.tsx",
                lineNumber: 124,
                columnNumber: 7
            }, this),
            error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                id: generatedId ? `${generatedId}-error` : undefined,
                className: "text-sm text-[var(--danger)]",
                children: error
            }, void 0, false, {
                fileName: "[project]/src/components/ui/select.tsx",
                lineNumber: 227,
                columnNumber: 9
            }, this) : helperText ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                id: generatedId ? `${generatedId}-helper` : undefined,
                className: "text-sm text-[var(--foreground-muted)]",
                children: helperText
            }, void 0, false, {
                fileName: "[project]/src/components/ui/select.tsx",
                lineNumber: 234,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/select.tsx",
        lineNumber: 100,
        columnNumber: 5
    }, this);
}
_c = Select;
var _c;
__turbopack_context__.k.register(_c, "Select");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/skeleton.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Skeleton
// -----------------------------------------------------------------------------
//
// Reusable loading placeholder for the sisiMove design system.
//
// Responsibilities:
// - Represent loading content without layout jumps
// - Support arbitrary dimensions through className
// - Support rounded and rectangular shapes
// - Respect reduced-motion preferences
//
// The component remains domain-agnostic.
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "Skeleton",
    ()=>Skeleton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/utils/cn.ts [app-client] (ecmascript)");
;
;
// -----------------------------------------------------------------------------
// Styles
// -----------------------------------------------------------------------------
const radiusClasses = {
    none: 'rounded-none',
    sm: 'rounded-[var(--radius-sm)]',
    md: 'rounded-[var(--radius-md)]',
    lg: 'rounded-[var(--radius-lg)]',
    full: 'rounded-[var(--radius-full)]'
};
function Skeleton({ radius = 'md', className, role = 'status', 'aria-label': ariaLabel = 'Loading', ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ...props,
        role: role,
        "aria-label": ariaLabel,
        "aria-busy": "true",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('animate-pulse', 'bg-[var(--background-muted)]', radiusClasses[radius], className)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/skeleton.tsx",
        lineNumber: 65,
        columnNumber: 5
    }, this);
}
_c = Skeleton;
var _c;
__turbopack_context__.k.register(_c, "Skeleton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/spinner.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Spinner
// -----------------------------------------------------------------------------
//
// Reusable loading spinner for the sisiMove design system.
//
// Responsibilities:
// - Indicate an active loading state
// - Support semantic sizes
// - Provide accessible status text
// - Remain domain-agnostic
//
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "Spinner",
    ()=>Spinner
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/utils/cn.ts [app-client] (ecmascript)");
;
;
// -----------------------------------------------------------------------------
// Styles
// -----------------------------------------------------------------------------
const sizeClasses = {
    xs: 'h-3 w-3 border',
    sm: 'h-4 w-4 border-2',
    md: 'h-5 w-5 border-2',
    lg: 'h-6 w-6 border-2'
};
function Spinner({ size = 'md', label = 'Loading', className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        ...props,
        role: "status",
        "aria-label": label,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('inline-block', 'shrink-0', 'animate-spin', 'rounded-[var(--radius-full)]', 'border-[var(--border)]', 'border-t-[var(--brand)]', sizeClasses[size], className)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/spinner.tsx",
        lineNumber: 66,
        columnNumber: 5
    }, this);
}
_c = Spinner;
var _c;
__turbopack_context__.k.register(_c, "Spinner");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/textarea.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Textarea
// -----------------------------------------------------------------------------
//
// Reusable multiline text input primitive for the sisiMove design system.
//
// Responsibilities:
// - Consistent textarea appearance
// - Accessible labeling support
// - Helper and validation states
// - Native textarea behavior
//
// The component remains domain-agnostic.
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "Textarea",
    ()=>Textarea
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/utils/cn.ts [app-client] (ecmascript)");
;
;
function Textarea({ id, label, helperText, error, trailingContent, fullWidth = true, className, disabled, required, ...props }) {
    const generatedId = id ?? undefined;
    const hasError = Boolean(error);
    const hasTrailingContent = Boolean(trailingContent);
    const describedById = generatedId ? error ? `${generatedId}-error` : helperText ? `${generatedId}-helper` : undefined : undefined;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex flex-col gap-1.5', fullWidth && 'w-full'),
        children: [
            label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                htmlFor: generatedId,
                className: "text-sm font-medium text-[var(--foreground)]",
                children: [
                    label,
                    required && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        "aria-hidden": "true",
                        className: "ml-1 text-[var(--danger)]",
                        children: "*"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/textarea.tsx",
                        lineNumber: 102,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/textarea.tsx",
                lineNumber: 95,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                        ...props,
                        id: generatedId,
                        disabled: disabled,
                        required: required,
                        "aria-invalid": hasError || undefined,
                        "aria-describedby": describedById,
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('min-h-24', 'w-full', 'resize-y', 'rounded-[var(--radius-md)]', 'border', 'bg-[var(--surface)]', 'px-3', 'py-2.5', 'text-sm', 'leading-6', 'text-[var(--foreground)]', 'placeholder:text-[var(--foreground-subtle)]', 'transition-colors', 'duration-150', 'ease-out', 'outline-none', 'border-[var(--border)]', 'hover:border-[var(--border-strong)]', 'focus:border-[var(--brand)]', 'focus:ring-2', 'focus:ring-[var(--brand)]/10', 'disabled:cursor-not-allowed', 'disabled:resize-none', 'disabled:bg-[var(--background-muted)]', 'disabled:text-[var(--foreground-muted)]', 'disabled:opacity-70', hasError && [
                            'border-[var(--danger)]',
                            'focus:border-[var(--danger)]',
                            'focus:ring-2',
                            'focus:ring-[var(--danger)]/10'
                        ].join(' '), hasTrailingContent && 'pr-20', className)
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/textarea.tsx",
                        lineNumber: 113,
                        columnNumber: 9
                    }, this),
                    trailingContent && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        "aria-hidden": "true",
                        className: [
                            'pointer-events-none',
                            'absolute',
                            'right-3',
                            'bottom-3',
                            'text-xs',
                            'text-[var(--foreground-muted)]'
                        ].join(' '),
                        children: trailingContent
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/textarea.tsx",
                        lineNumber: 160,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/textarea.tsx",
                lineNumber: 112,
                columnNumber: 7
            }, this),
            error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                id: generatedId ? `${generatedId}-error` : undefined,
                className: "text-sm text-[var(--danger)]",
                children: error
            }, void 0, false, {
                fileName: "[project]/src/components/ui/textarea.tsx",
                lineNumber: 177,
                columnNumber: 9
            }, this) : helperText ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                id: generatedId ? `${generatedId}-helper` : undefined,
                className: "text-sm text-[var(--foreground-muted)]",
                children: helperText
            }, void 0, false, {
                fileName: "[project]/src/components/ui/textarea.tsx",
                lineNumber: 184,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/textarea.tsx",
        lineNumber: 88,
        columnNumber: 5
    }, this);
}
_c = Textarea;
var _c;
__turbopack_context__.k.register(_c, "Textarea");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/foundation/auth/auth-client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DefaultAuthClient",
    ()=>DefaultAuthClient
]);
class DefaultAuthClient {
    api;
    constructor(api){
        this.api = api;
    }
    async login(credentials) {
        return this.api.post('/auth/login', credentials);
    }
    async register(input) {
        return this.api.post('/auth/register', input);
    }
    async logout() {
        await this.api.post('/auth/logout');
    }
    async getCurrentIdentity() {
        try {
            return await this.api.get('/auth/me');
        } catch  {
            return null;
        }
    }
    async refresh() {
        try {
            return await this.api.post('/auth/refresh');
        } catch  {
            return null;
        }
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/foundation/auth/auth-provider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthContext",
    ()=>AuthContext,
    "AuthProvider",
    ()=>AuthProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$http$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/foundation/http/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$http$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/http/api-client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$auth$2f$auth$2d$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/auth/auth-storage.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$auth$2f$auth$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/auth/auth-client.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
const apiClient = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$http$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiClient"]();
const authClient = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$auth$2f$auth$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DefaultAuthClient"](apiClient);
const authStorage = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$auth$2f$auth$2d$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthStorage"]();
function AuthProvider({ children }) {
    _s();
    const [session, setSession] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('unknown');
    const restore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[restore]": async ()=>{
            const storedSession = authStorage.get();
            if (storedSession) {
                setSession(storedSession);
                setStatus('authenticated');
                return;
            }
            const currentIdentity = await authClient.getCurrentIdentity();
            if (currentIdentity) {
                setStatus('authenticated');
                setSession({
                    identity: currentIdentity,
                    accessToken: '',
                    expiresAt: 0
                });
                return;
            }
            setStatus('unauthenticated');
        }
    }["AuthProvider.useCallback[restore]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            void restore();
        }
    }["AuthProvider.useEffect"], [
        restore
    ]);
    const login = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[login]": async (credentials)=>{
            const nextSession = await authClient.login(credentials);
            authStorage.set(nextSession);
            setSession(nextSession);
            setStatus('authenticated');
        }
    }["AuthProvider.useCallback[login]"], []);
    const register = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[register]": async (input)=>{
            const nextSession = await authClient.register(input);
            authStorage.set(nextSession);
            setSession(nextSession);
            setStatus('authenticated');
        }
    }["AuthProvider.useCallback[register]"], []);
    const logout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[logout]": async ()=>{
            try {
                await authClient.logout();
            } finally{
                authStorage.clear();
                setSession(null);
                setStatus('unauthenticated');
            }
        }
    }["AuthProvider.useCallback[logout]"], []);
    const refresh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[refresh]": async ()=>{
            const nextSession = await authClient.refresh();
            if (!nextSession) {
                authStorage.clear();
                setSession(null);
                setStatus('unauthenticated');
                return;
            }
            authStorage.set(nextSession);
            setSession(nextSession);
            setStatus('authenticated');
        }
    }["AuthProvider.useCallback[refresh]"], []);
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AuthProvider.useMemo[value]": ()=>({
                status,
                identity: session?.identity ?? null,
                login,
                register,
                logout,
                refresh
            })
    }["AuthProvider.useMemo[value]"], [
        status,
        session,
        login,
        register,
        logout,
        refresh
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/foundation/auth/auth-provider.tsx",
        lineNumber: 163,
        columnNumber: 5
    }, this);
}
_s(AuthProvider, "ZAeUABX/wxlKiFAbppmnRsy5lAg=");
_c = AuthProvider;
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/foundation/auth/auth-storage.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthStorage",
    ()=>AuthStorage
]);
const AUTH_STORAGE_KEY = 'sisimove.auth.session';
class AuthStorage {
    get() {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        const raw = window.sessionStorage.getItem(AUTH_STORAGE_KEY);
        if (!raw) {
            return null;
        }
        try {
            return JSON.parse(raw);
        } catch  {
            this.clear();
            return null;
        }
    }
    set(session) {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        window.sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    }
    clear() {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/foundation/auth/auth.types.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/foundation/auth/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// foundation/auth/index.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$auth$2f$auth$2e$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/auth/auth.types.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$auth$2f$auth$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/auth/auth-client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$auth$2f$auth$2d$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/auth/auth-storage.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$auth$2f$auth$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/auth/auth-provider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$auth$2f$use$2d$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/auth/use-auth.ts [app-client] (ecmascript)");
;
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/foundation/auth/use-auth.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$auth$2f$auth$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/auth/auth-provider.tsx [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function useAuth() {
    _s();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$auth$2f$auth$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthContext"]);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider.');
    }
    return context;
}
_s(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/foundation/config/api.config.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "apiConfig",
    ()=>apiConfig
]);
// -----------------------------------------------------------------------------
// API Configuration
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$config$2f$environment$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/config/environment.ts [app-client] (ecmascript)");
;
const apiConfig = {
    baseUrl: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$config$2f$environment$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["environment"].apiUrl,
    timeoutMs: 15_000,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/foundation/config/app.config.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// Application Configuration
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "appConfig",
    ()=>appConfig
]);
const appConfig = {
    name: 'sisiMove',
    description: "A long-distance travel social network.",
    currency: {
        code: 'KES',
        locale: 'en-KE',
        symbol: 'KSh'
    },
    timezone: 'Africa/Nairobi',
    pagination: {
        defaultPageSize: 20,
        maxPageSize: 100
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/foundation/config/environment.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "environment",
    ()=>environment
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// sisiMove — Frontend Environment
// -----------------------------------------------------------------------------
//
// Centralized access to frontend environment variables.
//
// Responsibilities:
// - Read public frontend environment variables.
// - Provide safe development defaults.
// - Expose normalized environment flags.
// - Keep environment access outside feature and presentation layers.
//
// Important:
// - Only NEXT_PUBLIC_* variables are available to browser-side code.
// - Secrets must never be placed in this file or exposed through
//   NEXT_PUBLIC_* variables.
// - The API URL points to the SisiMove NestJS API, not the Next.js frontend.
//
// Expected development setup:
//
//   Next.js frontend
//       http://localhost:3000
//
//   SisiMove API
//       http://localhost:3001/api/v1
//
// The actual value of NEXT_PUBLIC_API_URL takes precedence over the fallback.
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// Environment Variable Reader
// -----------------------------------------------------------------------------
const readEnvironmentVariable = (key, fallback)=>{
    const value = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env[key];
    if (value !== undefined && value.trim().length > 0) {
        return value.trim();
    }
    if (fallback !== undefined) {
        return fallback;
    }
    return '';
};
// -----------------------------------------------------------------------------
// Environment Values
// -----------------------------------------------------------------------------
const appEnv = readEnvironmentVariable('NEXT_PUBLIC_APP_ENV', 'development');
const environment = {
    /**
   * Base URL for the SisiMove HTTP API.
   *
   * Development default:
   *
   *   http://localhost:3001/api/v1
   *
   * Override with:
   *
   *   NEXT_PUBLIC_API_URL
   *
   * Example:
   *
   *   NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
   */ apiUrl: readEnvironmentVariable('NEXT_PUBLIC_API_URL', 'http://localhost:3001/api/v1'),
    /**
   * Current frontend application environment.
   *
   * Override with:
   *
   *   NEXT_PUBLIC_APP_ENV
   */ appEnv,
    /**
   * True when the frontend is running in development mode.
   */ isDevelopment: appEnv === 'development',
    /**
   * True when the frontend is running in production mode.
   */ isProduction: appEnv === 'production',
    /**
   * True when the frontend is running in test mode.
   */ isTest: appEnv === 'test'
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/foundation/config/feature-flags.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// Feature Flags
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "featureFlags",
    ()=>featureFlags
]);
const featureFlags = {
    journeyDemand: true,
    wallet: true,
    messaging: true,
    notifications: true,
    support: true,
    analytics: true,
    experimental: {
        newDiscoveryFeed: false
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/foundation/config/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// foundation/config/index.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$config$2f$api$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/config/api.config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$config$2f$app$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/config/app.config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$config$2f$environment$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/config/environment.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$config$2f$feature$2d$flags$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/config/feature-flags.ts [app-client] (ecmascript)");
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/foundation/errors/api-error.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ApiError",
    ()=>ApiError
]);
// -----------------------------------------------------------------------------
// API Error
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$errors$2f$app$2d$error$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/errors/app-error.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$errors$2f$error$2d$codes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/errors/error-codes.ts [app-client] (ecmascript)");
;
;
class ApiError extends __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$errors$2f$app$2d$error$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AppError"] {
    statusCode;
    constructor(message, statusCode, code, details){
        super(message, code ?? mapStatusToErrorCode(statusCode), details);
        this.name = 'ApiError';
        this.statusCode = statusCode;
    }
}
function mapStatusToErrorCode(statusCode) {
    switch(statusCode){
        case 401:
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$errors$2f$error$2d$codes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["errorCodes"].unauthorized;
        case 403:
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$errors$2f$error$2d$codes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["errorCodes"].forbidden;
        case 404:
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$errors$2f$error$2d$codes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["errorCodes"].notFound;
        case 409:
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$errors$2f$error$2d$codes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["errorCodes"].conflict;
        case 422:
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$errors$2f$error$2d$codes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["errorCodes"].validation;
        case 429:
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$errors$2f$error$2d$codes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["errorCodes"].rateLimited;
        default:
            if (statusCode >= 500) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$errors$2f$error$2d$codes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["errorCodes"].server;
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$errors$2f$error$2d$codes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["errorCodes"].unknown;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/foundation/errors/app-error.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// Application Error
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "AppError",
    ()=>AppError
]);
class AppError extends Error {
    code;
    details;
    constructor(message, code = 'APP_ERROR', details){
        super(message);
        this.name = 'AppError';
        this.code = code;
        this.details = details;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/foundation/errors/error-codes.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// Error Codes
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "errorCodes",
    ()=>errorCodes
]);
const errorCodes = {
    unknown: 'UNKNOWN_ERROR',
    network: 'NETWORK_ERROR',
    timeout: 'TIMEOUT_ERROR',
    unauthorized: 'UNAUTHORIZED',
    forbidden: 'FORBIDDEN',
    notFound: 'NOT_FOUND',
    validation: 'VALIDATION_ERROR',
    conflict: 'CONFLICT',
    rateLimited: 'RATE_LIMITED',
    server: 'SERVER_ERROR',
    invalidResponse: 'INVALID_RESPONSE'
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/foundation/errors/error-normalizer.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "normalizeError",
    ()=>normalizeError
]);
// -----------------------------------------------------------------------------
// Error Normalizer
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$errors$2f$api$2d$error$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/errors/api-error.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$errors$2f$app$2d$error$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/errors/app-error.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$errors$2f$error$2d$codes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/errors/error-codes.ts [app-client] (ecmascript)");
;
;
;
function normalizeError(error) {
    if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$errors$2f$api$2d$error$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiError"]) {
        return {
            error,
            message: error.message,
            code: error.code,
            statusCode: error.statusCode
        };
    }
    if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$errors$2f$app$2d$error$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AppError"]) {
        return {
            error,
            message: error.message,
            code: error.code
        };
    }
    if (error instanceof Error) {
        const normalized = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$errors$2f$app$2d$error$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AppError"](error.message, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$errors$2f$error$2d$codes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["errorCodes"].unknown, error);
        return {
            error: normalized,
            message: normalized.message,
            code: normalized.code
        };
    }
    const normalized = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$errors$2f$app$2d$error$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AppError"]('An unexpected error occurred.', __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$errors$2f$error$2d$codes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["errorCodes"].unknown, error);
    return {
        error: normalized,
        message: normalized.message,
        code: normalized.code
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/foundation/errors/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// foundation/errors/index.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$errors$2f$app$2d$error$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/errors/app-error.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$errors$2f$api$2d$error$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/errors/api-error.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$errors$2f$error$2d$codes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/errors/error-codes.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$errors$2f$error$2d$normalizer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/errors/error-normalizer.ts [app-client] (ecmascript)");
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/foundation/formatters/currency.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatCurrency",
    ()=>formatCurrency,
    "formatCurrencyMinorUnits",
    ()=>formatCurrencyMinorUnits
]);
function formatCurrency(amount, currency = 'KES') {
    return new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0
    }).format(amount);
}
function formatCurrencyMinorUnits(amount, currency = 'KES') {
    const formatter = new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency
    });
    const fractionDigits = formatter.resolvedOptions().maximumFractionDigits ?? 0;
    const majorUnitAmount = amount / 10 ** fractionDigits;
    return formatter.format(majorUnitAmount);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/foundation/formatters/date.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// Date Formatter
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "formatDate",
    ()=>formatDate,
    "formatDateTime",
    ()=>formatDateTime,
    "formatTime",
    ()=>formatTime
]);
function formatDate(value, options) {
    const date = value instanceof Date ? value : new Date(value);
    return new Intl.DateTimeFormat('en-KE', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        ...options
    }).format(date);
}
function formatTime(value, options) {
    const date = value instanceof Date ? value : new Date(value);
    return new Intl.DateTimeFormat('en-KE', {
        hour: 'numeric',
        minute: '2-digit',
        ...options
    }).format(date);
}
function formatDateTime(value, options) {
    const date = value instanceof Date ? value : new Date(value);
    return new Intl.DateTimeFormat('en-KE', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        ...options
    }).format(date);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/foundation/formatters/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// foundation/formatters/index.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$formatters$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/formatters/currency.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$formatters$2f$date$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/formatters/date.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$formatters$2f$number$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/formatters/number.ts [app-client] (ecmascript)");
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/foundation/formatters/number.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatNumber",
    ()=>formatNumber
]);
function formatNumber(value) {
    return new Intl.NumberFormat('en-KE').format(value);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/foundation/http/api-client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ApiClient",
    ()=>ApiClient,
    "apiClient",
    ()=>apiClient
]);
// -----------------------------------------------------------------------------
// API Client
// -----------------------------------------------------------------------------
//
// Lightweight fetch-based HTTP client.
// No Axios dependency.
//
// Supports:
// - JSON request bodies
// - FormData request bodies
// - Authentication context
// - Correlation IDs
// - Query parameters
// - Request cancellation
// - Request timeout
// - Standardized API errors
//
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$config$2f$api$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/config/api.config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$errors$2f$api$2d$error$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/errors/api-error.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$errors$2f$error$2d$codes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/errors/error-codes.ts [app-client] (ecmascript)");
;
;
;
class ApiClient {
    baseUrl;
    constructor(baseUrl = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$config$2f$api$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiConfig"].baseUrl){
        this.baseUrl = baseUrl;
    }
    async get(path, options) {
        return this.request('GET', path, options);
    }
    async post(path, body, options) {
        return this.request('POST', path, {
            ...options,
            body
        });
    }
    async patch(path, body, options) {
        return this.request('PATCH', path, {
            ...options,
            body
        });
    }
    async put(path, body, options) {
        return this.request('PUT', path, {
            ...options,
            body
        });
    }
    async delete(path, options) {
        return this.request('DELETE', path, options);
    }
    async request(method, path, options = {}) {
        const url = this.buildUrl(path, options.query);
        const headers = new Headers({
            ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$config$2f$api$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiConfig"].headers,
            ...options.headers
        });
        if (options.context?.accessToken) {
            headers.set('Authorization', `Bearer ${options.context.accessToken}`);
        }
        if (options.context?.correlationId) {
            headers.set('X-Correlation-ID', options.context.correlationId);
        }
        /**
     * FormData must be passed directly to fetch().
     *
     * JSON.stringify(FormData) would discard the multipart fields and
     * prevent Nest's multipart parser from populating @Body() and
     * @UploadedFile().
     *
     * The browser automatically generates the correct:
     *
     *     Content-Type: multipart/form-data; boundary=...
     *
     * header when the body is FormData.
     *
     * Therefore Content-Type is removed when sending FormData.
     */ const requestBody = this.prepareRequestBody(options.body, headers);
        const controller = new AbortController();
        const timeout = setTimeout(()=>{
            controller.abort();
        }, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$config$2f$api$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiConfig"].timeoutMs);
        try {
            const response = await fetch(url, {
                method,
                headers,
                signal: options.context?.signal ?? controller.signal,
                credentials: 'include',
                body: requestBody
            });
            const payload = await this.parseResponse(response);
            if (!response.ok) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$errors$2f$api$2d$error$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiError"](this.extractErrorMessage(payload), response.status, undefined, payload);
            }
            return this.unwrapResponse(payload);
        } catch (error) {
            if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$errors$2f$api$2d$error$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiError"]) {
                throw error;
            }
            if (error instanceof DOMException && error.name === 'AbortError') {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$errors$2f$api$2d$error$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiError"]('The request timed out or was cancelled.', 408, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$errors$2f$error$2d$codes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["errorCodes"].timeout);
            }
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$errors$2f$api$2d$error$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiError"]('Unable to connect to the SisiMove service.', 0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$errors$2f$error$2d$codes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["errorCodes"].network, error);
        } finally{
            clearTimeout(timeout);
        }
    }
    prepareRequestBody(body, headers) {
        if (body === undefined) {
            return undefined;
        }
        if (body instanceof FormData) {
            /**
       * Do not manually specify Content-Type for multipart requests.
       *
       * The browser adds the multipart boundary automatically.
       */ headers.delete('Content-Type');
            return body;
        }
        if (body instanceof Blob) {
            return body;
        }
        if (body instanceof URLSearchParams) {
            return body;
        }
        if (typeof body === 'string') {
            return body;
        }
        headers.set('Content-Type', 'application/json');
        return JSON.stringify(body);
    }
    buildUrl(path, query) {
        const normalizedBase = this.baseUrl.replace(/\/+$/, '');
        const normalizedPath = path.startsWith('/') ? path : `/${path}`;
        const url = new URL(`${normalizedBase}${normalizedPath}`, window.location.origin);
        if (query) {
            for (const [key, value] of Object.entries(query)){
                if (value !== undefined && value !== null && value !== '') {
                    url.searchParams.set(key, String(value));
                }
            }
        }
        return url.toString();
    }
    async parseResponse(response) {
        const contentType = response.headers.get('content-type') ?? '';
        if (contentType.includes('application/json')) {
            return response.json();
        }
        const text = await response.text();
        if (!text) {
            return null;
        }
        return text;
    }
    unwrapResponse(payload) {
        if (payload && typeof payload === 'object' && 'data' in payload) {
            return payload.data;
        }
        return payload;
    }
    extractErrorMessage(payload) {
        if (payload && typeof payload === 'object' && 'message' in payload) {
            const message = payload.message;
            if (Array.isArray(message)) {
                return message.join(', ');
            }
            if (typeof message === 'string') {
                return message;
            }
        }
        return 'The request could not be completed.';
    }
}
const apiClient = new ApiClient();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/foundation/http/api-response.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

//src/foundation/http/api-respose.ts
// -----------------------------------------------------------------------------
// API Response Types
// -----------------------------------------------------------------------------
__turbopack_context__.s([]);
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/foundation/http/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// foundation/http/index.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$http$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/http/api-client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$http$2f$api$2d$response$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/http/api-response.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$http$2f$request$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/http/request-context.ts [app-client] (ecmascript)"); // -----------------------------------------------------------------------------
 // sisiMove — Authentication HTTP Barrel
 // -----------------------------------------------------------------------------
 //
 // Public HTTP boundary for authentication-aware API requests.
 //
 // -----------------------------------------------------------------------------
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/foundation/http/request-context.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

//src/foundation/http/request-context.ts
// -----------------------------------------------------------------------------
// Request Context
// -----------------------------------------------------------------------------
__turbopack_context__.s([]);
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/foundation/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// foundation/index.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$config$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/foundation/config/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$errors$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/foundation/errors/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$http$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/foundation/http/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$storage$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/foundation/storage/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/foundation/types/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/foundation/utils/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$formatters$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/foundation/formatters/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$auth$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/foundation/auth/index.ts [app-client] (ecmascript) <locals>");
;
;
;
;
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/foundation/routing/authenticated-routes.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Authenticated Routes
// -----------------------------------------------------------------------------
//
// Canonical routes for authenticated application surfaces.
//
// These routes are intentionally separate from:
//
//     PUBLIC_ROUTES
//         Public marketplace and informational pages.
//
//     AUTHENTICATION_ROUTES
//         Registration and login entry points.
//
// The authenticated route group is responsible only for identifying the
// canonical URL of an authenticated application surface.
//
// This file does NOT:
// - authenticate users,
// - inspect authentication state,
// - restore sessions,
// - redirect unauthenticated users,
// - enforce verification,
// - enforce marketplace capabilities,
// - perform navigation,
// - define Next.js middleware.
//
// Those responsibilities belong to their respective application boundaries.
//
// Current authenticated application:
//
//     /home
//         Authenticated marketplace home.
//
//     /my-journeys
//         Traveller's journey-management surface.
//
//     /my-demands
//         Traveller's journey-demand management surface.
//
//     /assets
//         Traveller's Asset-management surface.
//
// Next.js route-group relationship:
//
//     app/(authenticated)/home/page.tsx
//         → /home
//
//     app/(authenticated)/my-journeys/page.tsx
//         → /my-journeys
//
//     app/(authenticated)/my-demands/page.tsx
//         → /my-demands
//
//     app/(authenticated)/assets/page.tsx
//         → /assets
//
// The "(authenticated)" directory is a Next.js route group and therefore
// does not appear in the URL.
//
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "AUTHENTICATED_ROUTES",
    ()=>AUTHENTICATED_ROUTES
]);
const AUTHENTICATED_ROUTES = {
    HOME: '/home',
    MY_JOURNEYS: '/my-journeys',
    MY_DEMANDS: '/my-demands',
    ASSETS: '/assets'
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/foundation/routing/authentication-routes.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Authentication Routes
// -----------------------------------------------------------------------------
//
// Canonical routes used to enter the authentication flows.
//
// Registration and login are public pages, but they are kept in a dedicated
// authentication route contract because they represent authentication
// boundaries rather than marketplace resources.
//
// This file does NOT:
// - perform navigation,
// - authenticate users,
// - redirect users,
// - manage sessions,
// - enforce authorization.
//
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "AUTHENTICATION_ROUTES",
    ()=>AUTHENTICATION_ROUTES
]);
const AUTHENTICATION_ROUTES = {
    REGISTER: '/register',
    LOGIN: '/login'
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/foundation/routing/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// -----------------------------------------------------------------------------
// sisiMove — Routing Barrel
// -----------------------------------------------------------------------------
//
// Central export boundary for canonical application route contracts.
//
// Route ownership is intentionally separated:
//
// PUBLIC_ROUTES
//     Public marketplace and informational routes.
//
// AUTHENTICATION_ROUTES
//     Registration and login entry routes.
//
// AUTHENTICATED_ROUTES
//     Authenticated application surfaces.
//
// This barrel only re-exports route contracts.
// It does NOT:
// - perform navigation,
// - inspect authentication state,
// - redirect users,
// - enforce authorization,
// - define middleware,
// - manage sessions.
//
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$routing$2f$authenticated$2d$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/routing/authenticated-routes.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$routing$2f$authentication$2d$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/routing/authentication-routes.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$routing$2f$public$2d$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/routing/public-routes.ts [app-client] (ecmascript)");
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/foundation/routing/public-routes.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Public Routes
// -----------------------------------------------------------------------------
//
// Canonical route definitions for publicly accessible SisiMove pages.
//
// This file is a route contract only.
// It does NOT:
// - perform navigation,
// - inspect authentication state,
// - redirect users,
// - define Next.js middleware,
// - contain route guards.
//
// Authentication-aware behavior belongs to the application/router boundary.
//
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "PUBLIC_ROUTES",
    ()=>PUBLIC_ROUTES
]);
const PUBLIC_ROUTES = {
    HOME: '/',
    JOURNEYS: '/journeys',
    DEMANDS: '/demands',
    HOW_IT_WORKS: '/how-it-works',
    journey: (publicId)=>`/journeys/${encodeURIComponent(publicId)}`,
    demand: (publicId)=>`/demands/${encodeURIComponent(publicId)}`,
    traveller: (handle)=>`/travellers/${encodeURIComponent(handle)}`
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/foundation/storage/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Foundation Storage Barrel
// -----------------------------------------------------------------------------
//
// Public storage boundary.
//
// Consumers should import storage contracts and adapters from this barrel
// rather than reaching into individual implementation files.
//
// -----------------------------------------------------------------------------
__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$storage$2f$local$2d$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/storage/local-storage.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$storage$2f$session$2d$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/storage/session-storage.ts [app-client] (ecmascript)");
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/foundation/storage/local-storage.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Local Storage Adapter
// -----------------------------------------------------------------------------
//
// Browser localStorage implementation of the foundation Storage contract.
//
// This adapter is intentionally generic. It does not know about authentication,
// sessions, identities, tokens, or any feature-specific data.
//
// Serialization:
// - Values are serialized with JSON.stringify().
// - Values are deserialized with JSON.parse().
//
// SSR:
// - Browser storage is unavailable during server rendering.
// - Reads return null.
// - has() returns false.
// - writes/removes/clear() are safely ignored.
//
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "localStorageAdapter",
    ()=>localStorageAdapter
]);
class BrowserLocalStorage {
    get(key) {
        if (!this.isAvailable()) {
            return null;
        }
        const value = window.localStorage.getItem(key);
        if (value === null) {
            return null;
        }
        try {
            return JSON.parse(value);
        } catch  {
            // A malformed value should not escape the storage boundary.
            //
            // Remove it so subsequent reads do not repeatedly encounter the same
            // invalid persisted value.
            window.localStorage.removeItem(key);
            return null;
        }
    }
    set(key, value) {
        if (!this.isAvailable()) {
            return;
        }
        window.localStorage.setItem(key, JSON.stringify(value));
    }
    remove(key) {
        if (!this.isAvailable()) {
            return;
        }
        window.localStorage.removeItem(key);
    }
    clear() {
        if (!this.isAvailable()) {
            return;
        }
        window.localStorage.clear();
    }
    has(key) {
        if (!this.isAvailable()) {
            return false;
        }
        return window.localStorage.getItem(key) !== null;
    }
    isAvailable() {
        return ("TURBOPACK compile-time value", "object") !== 'undefined' && typeof window.localStorage !== 'undefined';
    }
}
const localStorageAdapter = new BrowserLocalStorage();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/foundation/storage/session-storage.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Session Storage Adapter
// -----------------------------------------------------------------------------
//
// Browser sessionStorage implementation of the foundation Storage contract.
//
// This adapter is intentionally generic. It does not know about authentication,
// sessions, identities, tokens, or any feature-specific data.
//
// Serialization:
// - Values are serialized with JSON.stringify().
// - Values are deserialized with JSON.parse().
//
// SSR:
// - Browser storage is unavailable during server rendering.
// - Reads return null.
// - has() returns false.
// - writes/removes/clear() are safely ignored.
//
// Browser semantics:
// - sessionStorage is scoped to the current browser tab.
// - Its contents normally survive page reloads within that tab.
// - Its contents are removed when the browsing session ends.
//
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "sessionStorageAdapter",
    ()=>sessionStorageAdapter
]);
class BrowserSessionStorage {
    get(key) {
        if (!this.isAvailable()) {
            return null;
        }
        const value = window.sessionStorage.getItem(key);
        if (value === null) {
            return null;
        }
        try {
            return JSON.parse(value);
        } catch  {
            // Invalid persisted data must not escape the storage boundary.
            window.sessionStorage.removeItem(key);
            return null;
        }
    }
    set(key, value) {
        if (!this.isAvailable()) {
            return;
        }
        window.sessionStorage.setItem(key, JSON.stringify(value));
    }
    remove(key) {
        if (!this.isAvailable()) {
            return;
        }
        window.sessionStorage.removeItem(key);
    }
    clear() {
        if (!this.isAvailable()) {
            return;
        }
        window.sessionStorage.clear();
    }
    has(key) {
        if (!this.isAvailable()) {
            return false;
        }
        return window.sessionStorage.getItem(key) !== null;
    }
    isAvailable() {
        return ("TURBOPACK compile-time value", "object") !== 'undefined' && typeof window.sessionStorage !== 'undefined';
    }
}
const sessionStorageAdapter = new BrowserSessionStorage();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/foundation/types/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// Shared API Types
// -----------------------------------------------------------------------------
__turbopack_context__.s([]);
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/foundation/types/async-state.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// Async State
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "idleAsyncState",
    ()=>idleAsyncState
]);
const idleAsyncState = ()=>({
        status: 'idle',
        data: null,
        error: null
    });
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/foundation/types/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// foundation/types/index.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$types$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/types/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$types$2f$async$2d$state$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/types/async-state.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$types$2f$pagination$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/types/pagination.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$types$2f$result$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/types/result.ts [app-client] (ecmascript)");
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/foundation/types/pagination.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// Pagination
// -----------------------------------------------------------------------------
__turbopack_context__.s([]);
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/foundation/types/result.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// Result
// -----------------------------------------------------------------------------
__turbopack_context__.s([]);
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/foundation/utils/cn.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// Class Name Utility
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "cn",
    ()=>cn
]);
function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/foundation/utils/dates.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// Date Utilities
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "endOfDay",
    ()=>endOfDay,
    "isValidDate",
    ()=>isValidDate,
    "startOfDay",
    ()=>startOfDay,
    "toDate",
    ()=>toDate
]);
function isValidDate(value) {
    return !Number.isNaN(value.getTime());
}
function toDate(value) {
    return value instanceof Date ? value : new Date(value);
}
function startOfDay(date) {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
}
function endOfDay(date) {
    const result = new Date(date);
    result.setHours(23, 59, 59, 999);
    return result;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/foundation/utils/ids.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// ID Utilities
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "isPublicId",
    ()=>isPublicId
]);
function isPublicId(value) {
    return typeof value === 'string' && value.trim().length > 0;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/foundation/utils/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// foundation/utils/index.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/utils/cn.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$dates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/utils/dates.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$ids$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/utils/ids.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$objects$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/utils/objects.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$strings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/utils/strings.ts [app-client] (ecmascript)");
;
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/foundation/utils/objects.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// Object Utilities
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "isRecord",
    ()=>isRecord,
    "omit",
    ()=>omit
]);
function isRecord(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function omit(object, keys) {
    const result = {
        ...object
    };
    for (const key of keys){
        delete result[key];
    }
    return result;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/foundation/utils/strings.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// String Utilities
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "capitalize",
    ()=>capitalize,
    "normalizeWhitespace",
    ()=>normalizeWhitespace,
    "truncate",
    ()=>truncate
]);
function capitalize(value) {
    if (!value) {
        return value;
    }
    return value.charAt(0).toUpperCase() + value.slice(1);
}
function truncate(value, maxLength) {
    if (value.length <= maxLength) {
        return value;
    }
    return `${value.slice(0, maxLength - 1)}…`;
}
function normalizeWhitespace(value) {
    return value.trim().replace(/\s+/g, ' ');
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_1brmov7._.js.map