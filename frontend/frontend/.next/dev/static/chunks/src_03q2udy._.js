(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/(authenticated)/layout.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AuthenticatedLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// Authenticated Application
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$authenticated$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/authenticated/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$authenticated$2f$authenticated$2d$shell$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/authenticated/authenticated-shell.tsx [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// Traveller Profile
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/traveller-profile/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$hooks$2f$use$2d$current$2d$traveller$2d$profile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/traveller-profile/hooks/use-current-traveller-profile.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
// -----------------------------------------------------------------------------
// sisiMove — Authenticated Route Layout
// -----------------------------------------------------------------------------
//
// Application route boundary for authenticated SisiMove surfaces.
//
// Route structure:
//
//     app/(authenticated)/layout.tsx
//              │
//              ├── Current Traveller Profile
//              │       │
//              │       └── useCurrentTravellerProfile()
//              │
//              └── AuthenticatedShell
//                      │
//                      ├── AuthenticatedHeader
//                      ├── Page content
//                      └── AuthenticatedFooter
//
// -----------------------------------------------------------------------------
//
// RESPONSIBILITIES
// -----------------------------------------------------------------------------
//
// This layout:
//
// - composes authenticated route content through AuthenticatedShell;
// - resolves the current Traveller Profile required by the shell;
// - supplies the Traveller Profile handle to the presentation shell;
// - keeps Traveller Profile fetching outside header and shell components.
//
// -----------------------------------------------------------------------------
//
// NON-RESPONSIBILITIES
// -----------------------------------------------------------------------------
//
// This layout does NOT:
//
// - implement Traveller Profile HTTP calls;
// - access the API client directly;
// - construct Asset URLs;
// - implement verification logic;
// - implement marketplace capability logic;
// - fetch marketplace data;
// - create or persist authentication sessions;
// - introduce a second authentication/session mechanism.
//
// -----------------------------------------------------------------------------
//
// AUTHENTICATION
// -----------------------------------------------------------------------------
//
// Authentication/session state remains owned by the existing authentication
// infrastructure.
//
// This route layout consumes authenticated application state indirectly
// through the existing authenticated route boundary and the authenticated
// Traveller Profile API.
//
// It does not create, persist, refresh, or otherwise manage sessions.
//
// -----------------------------------------------------------------------------
//
// TRAVELLER IDENTITY
// -----------------------------------------------------------------------------
//
// AuthSession contains authentication identifiers.
//
// The Traveller Profile owns the traveller handle.
//
// Therefore the handle is resolved through:
//
//     authenticated access token
//             ↓
//     GET /traveller-profiles/me
//             ↓
//     useCurrentTravellerProfile()
//             ↓
//     Traveller Profile
//             ↓
//     traveller.handle
//             ↓
//     AuthenticatedShell
//
// The layout deliberately does not attempt to derive the handle from:
//
// - identityPublicId;
// - sessionPublicId;
// - authenticationPublicId;
// - JWT claims.
//
// -----------------------------------------------------------------------------
//
// PROFILE FAILURE
// -----------------------------------------------------------------------------
//
// The authenticated shell requires a Traveller Profile handle.
//
// Therefore the shell is not rendered while the current Traveller Profile is
// loading or when the profile cannot be resolved.
//
// This prevents the header from being rendered with:
//
// - an empty handle;
// - a fabricated handle;
// - an Identity identifier used as a handle;
// - incomplete Traveller Profile state.
//
// Authentication failures themselves remain the responsibility of the existing
// authentication/API infrastructure.
//
// -----------------------------------------------------------------------------
'use client';
;
;
function AuthenticatedLayout({ children }) {
    _s();
    const { data: travellerProfile, isLoading, isError } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$hooks$2f$use$2d$current$2d$traveller$2d$profile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCurrentTravellerProfile"])();
    // ---------------------------------------------------------------------------
    // Current Traveller Profile Loading
    // ---------------------------------------------------------------------------
    //
    // The authenticated shell requires the Traveller Profile handle for the
    // account control.
    //
    // Do not render the shell while the profile is being resolved.
    // ---------------------------------------------------------------------------
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-background text-foreground",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex min-h-screen items-center justify-center px-4",
                "aria-live": "polite",
                "aria-busy": "true",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm text-muted-foreground",
                    children: "Loading your profile…"
                }, void 0, false, {
                    fileName: "[project]/src/app/(authenticated)/layout.tsx",
                    lineNumber: 184,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/(authenticated)/layout.tsx",
                lineNumber: 179,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/(authenticated)/layout.tsx",
            lineNumber: 178,
            columnNumber: 7
        }, this);
    }
    // ---------------------------------------------------------------------------
    // Current Traveller Profile Failure
    // ---------------------------------------------------------------------------
    //
    // A successful authenticated route requires a Traveller Profile because the
    // authenticated shell depends on its handle.
    //
    // Do not fabricate a handle or derive one from authentication identifiers.
    //
    // Authentication/session failures remain outside this layout's
    // responsibility.
    // ---------------------------------------------------------------------------
    if (isError || travellerProfile == null) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-background text-foreground",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex min-h-screen items-center justify-center px-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-md text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-lg font-semibold",
                            children: "We could not load your profile"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(authenticated)/layout.tsx",
                            lineNumber: 210,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-2 text-sm text-muted-foreground",
                            children: "Your Traveller Profile is required to continue."
                        }, void 0, false, {
                            fileName: "[project]/src/app/(authenticated)/layout.tsx",
                            lineNumber: 214,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(authenticated)/layout.tsx",
                    lineNumber: 209,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/(authenticated)/layout.tsx",
                lineNumber: 208,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/(authenticated)/layout.tsx",
            lineNumber: 207,
            columnNumber: 7
        }, this);
    }
    // ---------------------------------------------------------------------------
    // Authenticated Application Shell
    // ---------------------------------------------------------------------------
    //
    // The layout owns profile resolution.
    //
    // The shell remains presentation-oriented and receives only the information
    // it needs to render the authenticated application chrome.
    // ---------------------------------------------------------------------------
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$authenticated$2f$authenticated$2d$shell$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthenticatedShell"], {
        travellerHandle: travellerProfile.handle,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/app/(authenticated)/layout.tsx",
        lineNumber: 234,
        columnNumber: 5
    }, this);
}
_s(AuthenticatedLayout, "WXIlOAYYaxLe0JGmPTRBuoXASLE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$hooks$2f$use$2d$current$2d$traveller$2d$profile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCurrentTravellerProfile"]
    ];
});
_c = AuthenticatedLayout;
var _c;
__turbopack_context__.k.register(_c, "AuthenticatedLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/authenticated/authenticated-footer/authenticated-footer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthenticatedFooter",
    ()=>AuthenticatedFooter,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// sisiMove — Authenticated Footer
// -----------------------------------------------------------------------------
//
// Footer for authenticated application surfaces.
//
// Responsibilities:
// - Provide lightweight application footer content.
// - Provide secondary navigation for authenticated users.
// - Provide sisiMove copyright information.
// - Establish the visual boundary below authenticated page content.
//
// This component does NOT:
// - inspect authentication state,
// - manage sessions,
// - perform authorization,
// - contain marketplace logic,
// - fetch data,
// - determine verification status,
// - contain marketplace capabilities.
//
// Authenticated shell:
//
//     AuthenticatedShell
//         ├── AuthenticatedHeader
//         ├── Page content
//         └── AuthenticatedFooter
//
// The footer intentionally remains smaller than the public landing footer.
// Authenticated users are already inside the application, so the footer
// provides only essential identity, copyright, help, support, and legal links.
//
// Branding:
//
//     sisi + Move
//
// "sisi" is black / foreground.
// "Move" is sisiMove blue / brand.
//
// The authenticated footer uses the same sisiMove brand expression as the
// public and authenticated headers.
//
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$routing$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/foundation/routing/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$routing$2f$authenticated$2d$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/routing/authenticated-routes.ts [app-client] (ecmascript)");
;
;
;
// =============================================================================
// Footer Links
// =============================================================================
const AUTHENTICATED_FOOTER_LINKS = [
    {
        label: 'Safety',
        href: '/safety'
    },
    {
        label: 'Help',
        href: '/help'
    },
    {
        label: 'Support',
        href: '/support'
    },
    {
        label: 'Terms',
        href: '/terms'
    },
    {
        label: 'Privacy',
        href: '/privacy'
    }
];
function AuthenticatedFooter() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
        className: "border-t border-[var(--border)] bg-[var(--surface)]",
        "aria-label": "Application footer",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col gap-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$routing$2f$authenticated$2d$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AUTHENTICATED_ROUTES"].HOME,
                                    "aria-label": "sisiMove home",
                                    className: "w-fit rounded-[var(--radius-md)] text-sm font-semibold tracking-tight outline-none transition-opacity duration-150 ease-out hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[var(--foreground)]",
                                            children: "sisi"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/authenticated/authenticated-footer/authenticated-footer.tsx",
                                            lineNumber: 103,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[var(--brand)]",
                                            children: "Move"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/authenticated/authenticated-footer/authenticated-footer.tsx",
                                            lineNumber: 107,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/authenticated/authenticated-footer/authenticated-footer.tsx",
                                    lineNumber: 98,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-[var(--muted-foreground)]",
                                    children: "Long-distance journeys shared by people travelling the same way."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/authenticated/authenticated-footer/authenticated-footer.tsx",
                                    lineNumber: 112,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/authenticated/authenticated-footer/authenticated-footer.tsx",
                            lineNumber: 97,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-[var(--muted-foreground)]",
                            children: [
                                "© ",
                                new Date().getFullYear(),
                                " sisiMove. All rights reserved."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/authenticated/authenticated-footer/authenticated-footer.tsx",
                            lineNumber: 117,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/authenticated/authenticated-footer/authenticated-footer.tsx",
                    lineNumber: 95,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                    "aria-label": "Footer navigation",
                    className: "flex flex-wrap items-center gap-x-4 gap-y-2",
                    children: AUTHENTICATED_FOOTER_LINKS.map((link)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: link.href,
                            className: "rounded-[var(--radius-md)] text-sm text-[var(--muted-foreground)] outline-none transition-colors duration-150 ease-out hover:text-[var(--brand)] focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]",
                            children: link.label
                        }, link.href, false, {
                            fileName: "[project]/src/components/authenticated/authenticated-footer/authenticated-footer.tsx",
                            lineNumber: 132,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/components/authenticated/authenticated-footer/authenticated-footer.tsx",
                    lineNumber: 127,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/authenticated/authenticated-footer/authenticated-footer.tsx",
            lineNumber: 89,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/authenticated/authenticated-footer/authenticated-footer.tsx",
        lineNumber: 85,
        columnNumber: 5
    }, this);
}
_c = AuthenticatedFooter;
const __TURBOPACK__default__export__ = AuthenticatedFooter;
var _c;
__turbopack_context__.k.register(_c, "AuthenticatedFooter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/authenticated/authenticated-footer/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// -----------------------------------------------------------------------------
// sisiMove — Authenticated Footer Barrel
// -----------------------------------------------------------------------------
//
// Public export boundary for authenticated footer components.
//
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$authenticated$2f$authenticated$2d$footer$2f$authenticated$2d$footer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/authenticated/authenticated-footer/authenticated-footer.tsx [app-client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/authenticated/authenticated-header/authenticated-account-menu.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthenticatedAccountMenu",
    ()=>AuthenticatedAccountMenu,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/avatar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$logout$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/authentication/logout/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$logout$2f$hooks$2f$use$2d$logout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/authentication/logout/hooks/use-logout.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$routing$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/foundation/routing/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$routing$2f$authenticated$2d$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/routing/authenticated-routes.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$routing$2f$authentication$2d$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/routing/authentication-routes.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
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
;
;
;
;
;
;
// =============================================================================
// Account Menu Items
// =============================================================================
const ACCOUNT_MENU_ITEMS = [
    {
        label: 'Profile',
        href: '/profile'
    },
    {
        label: 'Wallet',
        href: '/wallet'
    },
    {
        label: 'Support',
        href: '/support'
    },
    {
        label: 'Settings',
        href: '/settings'
    }
];
function AuthenticatedAccountMenu({ travellerHandle, travellerName, avatarSrc }) {
    _s();
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { logout, isLoggingOut } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$logout$2f$hooks$2f$use$2d$logout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLogout"])();
    // ---------------------------------------------------------------------------
    // Menu Boundary
    // ---------------------------------------------------------------------------
    const menuRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // ---------------------------------------------------------------------------
    // Close On Outside Interaction
    // ---------------------------------------------------------------------------
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthenticatedAccountMenu.useEffect": ()=>{
            if (!isOpen) {
                return;
            }
            const handlePointerDown = {
                "AuthenticatedAccountMenu.useEffect.handlePointerDown": (event)=>{
                    const target = event.target;
                    if (!(target instanceof Node)) {
                        return;
                    }
                    if (!menuRef.current?.contains(target)) {
                        setIsOpen(false);
                    }
                }
            }["AuthenticatedAccountMenu.useEffect.handlePointerDown"];
            document.addEventListener('pointerdown', handlePointerDown, true);
            return ({
                "AuthenticatedAccountMenu.useEffect": ()=>{
                    document.removeEventListener('pointerdown', handlePointerDown, true);
                }
            })["AuthenticatedAccountMenu.useEffect"];
        }
    }["AuthenticatedAccountMenu.useEffect"], [
        isOpen
    ]);
    // ---------------------------------------------------------------------------
    // Traveller Presentation
    // ---------------------------------------------------------------------------
    const normalizedHandle = travellerHandle.trim();
    const displayHandle = normalizedHandle.startsWith('@') ? normalizedHandle : `@${normalizedHandle}`;
    const avatarFallback = travellerName?.trim() || normalizedHandle || 'Traveller';
    // ---------------------------------------------------------------------------
    // Sign Out
    // ---------------------------------------------------------------------------
    const handleSignOut = async ()=>{
        if (isLoggingOut) {
            return;
        }
        setIsOpen(false);
        try {
            await logout();
            router.replace(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$routing$2f$authentication$2d$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AUTHENTICATION_ROUTES"].LOGIN);
            router.refresh();
        } catch  {
        /**
       * The logout hook owns the error state.
       *
       * Keep the user on the authenticated surface when server-side logout
       * fails because the backend session may still be active.
       */ }
    };
    // ---------------------------------------------------------------------------
    // Render
    // ---------------------------------------------------------------------------
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: menuRef,
        className: "relative",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                "aria-expanded": isOpen,
                "aria-haspopup": "menu",
                "aria-label": `Account menu for ${displayHandle}`,
                onClick: ()=>setIsOpen((current)=>!current),
                disabled: isLoggingOut,
                className: [
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
                    'disabled:opacity-60'
                ].join(' '),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Avatar"], {
                        src: avatarSrc,
                        alt: "",
                        fallback: avatarFallback,
                        size: "sm"
                    }, void 0, false, {
                        fileName: "[project]/src/components/authenticated/authenticated-header/authenticated-account-menu.tsx",
                        lineNumber: 290,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "hidden sm:inline",
                        children: displayHandle
                    }, void 0, false, {
                        fileName: "[project]/src/components/authenticated/authenticated-header/authenticated-account-menu.tsx",
                        lineNumber: 297,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        "aria-hidden": "true",
                        viewBox: "0 0 20 20",
                        fill: "currentColor",
                        className: [
                            'size-4',
                            'transition-transform',
                            'duration-150',
                            'ease-out',
                            isOpen ? 'rotate-180' : ''
                        ].join(' '),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            fillRule: "evenodd",
                            d: "M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 1 1-1.08 1.04l4.25-4.5a.75.75 0 0 1 .02 1.06Z",
                            clipRule: "evenodd"
                        }, void 0, false, {
                            fileName: "[project]/src/components/authenticated/authenticated-header/authenticated-account-menu.tsx",
                            lineNumber: 313,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/authenticated/authenticated-header/authenticated-account-menu.tsx",
                        lineNumber: 301,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/authenticated/authenticated-header/authenticated-account-menu.tsx",
                lineNumber: 260,
                columnNumber: 7
            }, this),
            isOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                role: "menu",
                "aria-label": "Account menu",
                className: [
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
                    'shadow-lg'
                ].join(' '),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$routing$2f$authenticated$2d$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AUTHENTICATED_ROUTES"].HOME,
                        role: "menuitem",
                        onClick: ()=>setIsOpen(false),
                        className: [
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
                            'hover:text-[var(--brand)]'
                        ].join(' '),
                        children: "Home"
                    }, void 0, false, {
                        fileName: "[project]/src/components/authenticated/authenticated-header/authenticated-account-menu.tsx",
                        lineNumber: 344,
                        columnNumber: 11
                    }, this),
                    ACCOUNT_MENU_ITEMS.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: item.href,
                            role: "menuitem",
                            onClick: ()=>setIsOpen(false),
                            className: [
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
                                'hover:text-[var(--brand)]'
                            ].join(' '),
                            children: item.label
                        }, item.href, false, {
                            fileName: "[project]/src/components/authenticated/authenticated-header/authenticated-account-menu.tsx",
                            lineNumber: 366,
                            columnNumber: 13
                        }, this)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        "aria-hidden": "true",
                        className: "my-1.5 border-t border-[var(--border-subtle)]"
                    }, void 0, false, {
                        fileName: "[project]/src/components/authenticated/authenticated-header/authenticated-account-menu.tsx",
                        lineNumber: 393,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        role: "menuitem",
                        onClick: handleSignOut,
                        disabled: isLoggingOut,
                        "aria-busy": isLoggingOut,
                        className: [
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
                            'disabled:opacity-60'
                        ].join(' '),
                        children: isLoggingOut ? 'Signing out…' : 'Sign out'
                    }, void 0, false, {
                        fileName: "[project]/src/components/authenticated/authenticated-header/authenticated-account-menu.tsx",
                        lineNumber: 402,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/authenticated/authenticated-header/authenticated-account-menu.tsx",
                lineNumber: 326,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/authenticated/authenticated-header/authenticated-account-menu.tsx",
        lineNumber: 252,
        columnNumber: 5
    }, this);
}
_s(AuthenticatedAccountMenu, "W/o3QfnTOqRbJlzXQ4+d2zMScck=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$logout$2f$hooks$2f$use$2d$logout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLogout"]
    ];
});
_c = AuthenticatedAccountMenu;
const __TURBOPACK__default__export__ = AuthenticatedAccountMenu;
var _c;
__turbopack_context__.k.register(_c, "AuthenticatedAccountMenu");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/authenticated/authenticated-header/authenticated-header.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthenticatedHeader",
    ()=>AuthenticatedHeader,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// sisiMove — Authenticated Header
// -----------------------------------------------------------------------------
//
// Primary header for authenticated application surfaces.
//
// Header structure:
//
//     sisiMove
//         │
//         ├── 🧳 My Journeys
//         │
//         ├── 📋 My Demands
//         │
//         ├── @traveller ▾
//         │
//         └── 🔔
//
// Responsibilities:
//
// - Compose the authenticated application header.
// - Provide the authenticated sisiMove brand/home control.
// - Provide primary authenticated navigation.
// - Provide the authenticated account control.
// - Provide the notification control.
//
// Non-responsibilities:
//
// - No authentication-state management.
// - No session restoration.
// - No login/logout implementation.
// - No Traveller Profile fetching.
// - No verification logic.
// - No marketplace capability logic.
// - No marketplace data fetching.
// - No Journey data fetching.
// - No Journey Demand data fetching.
//
// The header is intentionally a presentation/composition boundary.
//
// The authenticated application layer resolves the current Traveller Profile
// and supplies only the presentation data required by the header.
//
// Traveller Profile resolution:
//
//   Authentication
//        ↓
//   useCurrentTravellerProfile()
//        ↓
//   Authenticated application composition
//        ↓
//   AuthenticatedHeader
//        ↓
//   AuthenticatedAccountMenu
//
// Navigation resolution:
//
//   AuthenticatedHeader
//        ↓
//   AuthenticatedNavigation
//        ├── Home
//        ├── My Journeys
//        └── My Demands
//
// The header does not know how Journey or Journey Demand data is loaded.
// Navigation only provides entry points into those authenticated feature
// surfaces.
//
// Branding:
//
// The authenticated header uses the same sisiMove wordmark treatment as the
// public SiteHeader:
//
//     sisi + Move
//
// "sisi" uses the application foreground colour.
// "Move" uses the sisiMove brand colour.
//
// The authenticated shell therefore continues the public brand identity
// rather than introducing a separate authenticated visual treatment.
//
// Branding is presentation-only. It does not introduce routing, authentication,
// marketplace, or domain responsibilities.
//
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$authenticated$2f$authenticated$2d$header$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/authenticated/authenticated-header/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$authenticated$2f$authenticated$2d$header$2f$authenticated$2d$account$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/authenticated/authenticated-header/authenticated-account-menu.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$authenticated$2f$authenticated$2d$header$2f$authenticated$2d$logo$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/authenticated/authenticated-header/authenticated-logo.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$authenticated$2f$authenticated$2d$header$2f$authenticated$2d$navigation$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/authenticated/authenticated-header/authenticated-navigation.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$authenticated$2f$authenticated$2d$header$2f$authenticated$2d$notifications$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/authenticated/authenticated-header/authenticated-notifications.tsx [app-client] (ecmascript)");
;
;
function AuthenticatedHeader({ travellerHandle }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto flex min-h-14 w-full max-w-7xl items-center px-4 sm:min-h-16 sm:px-6 lg:px-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex min-w-0 flex-1 items-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$authenticated$2f$authenticated$2d$header$2f$authenticated$2d$logo$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthenticatedLogo"], {}, void 0, false, {
                            fileName: "[project]/src/components/authenticated/authenticated-header/authenticated-header.tsx",
                            lineNumber: 130,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "ml-6",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$authenticated$2f$authenticated$2d$header$2f$authenticated$2d$navigation$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthenticatedNavigation"], {}, void 0, false, {
                                fileName: "[project]/src/components/authenticated/authenticated-header/authenticated-header.tsx",
                                lineNumber: 133,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/authenticated/authenticated-header/authenticated-header.tsx",
                            lineNumber: 132,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/authenticated/authenticated-header/authenticated-header.tsx",
                    lineNumber: 129,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$authenticated$2f$authenticated$2d$header$2f$authenticated$2d$account$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthenticatedAccountMenu"], {
                            travellerHandle: travellerHandle
                        }, void 0, false, {
                            fileName: "[project]/src/components/authenticated/authenticated-header/authenticated-header.tsx",
                            lineNumber: 142,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$authenticated$2f$authenticated$2d$header$2f$authenticated$2d$notifications$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthenticatedNotifications"], {}, void 0, false, {
                            fileName: "[project]/src/components/authenticated/authenticated-header/authenticated-header.tsx",
                            lineNumber: 146,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/authenticated/authenticated-header/authenticated-header.tsx",
                    lineNumber: 141,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/authenticated/authenticated-header/authenticated-header.tsx",
            lineNumber: 123,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/authenticated/authenticated-header/authenticated-header.tsx",
        lineNumber: 122,
        columnNumber: 5
    }, this);
}
_c = AuthenticatedHeader;
const __TURBOPACK__default__export__ = AuthenticatedHeader;
var _c;
__turbopack_context__.k.register(_c, "AuthenticatedHeader");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/authenticated/authenticated-header/authenticated-logo.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthenticatedLogo",
    ()=>AuthenticatedLogo,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// sisiMove — Authenticated Logo
// -----------------------------------------------------------------------------
//
// Brand/home control for the authenticated application header.
//
// The sisiMove logo is the authenticated application's Home navigation:
//
//     sisiMove → /home
//
// Responsibilities:
// - Render the sisiMove wordmark.
// - Link the authenticated application logo to authenticated Home.
// - Provide accessible naming for the home destination.
//
// Non-responsibilities:
// - No authentication-state management.
// - No session management.
// - No authorization.
// - No marketplace logic.
// - No traveller-profile logic.
// - No navigation state.
// - No data fetching.
//
// Route ownership:
//
//     AUTHENTICATED_ROUTES.HOME
//         ↓
//     /home
//
// Branding:
//
// The authenticated logo mirrors the public SiteHeader wordmark:
//
//     sisi + Move
//
// - "sisi" uses the application foreground colour.
// - "Move" uses the sisiMove brand colour.
//
// The authenticated shell therefore uses the same brand expression as the
// public shell while retaining its authenticated Home route.
//
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/foundation/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/utils/cn.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$routing$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/foundation/routing/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$routing$2f$authenticated$2d$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/routing/authenticated-routes.ts [app-client] (ecmascript)");
;
;
;
;
function AuthenticatedLogo() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        href: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$routing$2f$authenticated$2d$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AUTHENTICATED_ROUTES"].HOME,
        "aria-label": "sisiMove home",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('shrink-0', 'rounded-[var(--radius-md)]', 'text-xl font-bold tracking-tight', 'text-[var(--foreground)]', 'outline-none', 'transition-colors duration-150 ease-out', 'hover:text-[var(--brand)]', 'focus-visible:ring-2', 'focus-visible:ring-[var(--brand)]', 'focus-visible:ring-offset-2', 'focus-visible:ring-offset-[var(--surface)]', 'sm:text-2xl'),
        children: [
            "sisi",
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-[var(--brand)]",
                children: "Move"
            }, void 0, false, {
                fileName: "[project]/src/components/authenticated/authenticated-header/authenticated-logo.tsx",
                lineNumber: 76,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/authenticated/authenticated-header/authenticated-logo.tsx",
        lineNumber: 57,
        columnNumber: 5
    }, this);
}
_c = AuthenticatedLogo;
const __TURBOPACK__default__export__ = AuthenticatedLogo;
var _c;
__turbopack_context__.k.register(_c, "AuthenticatedLogo");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/authenticated/authenticated-header/authenticated-navigation.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthenticatedNavigation",
    ()=>AuthenticatedNavigation,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/foundation/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/utils/cn.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$routing$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/foundation/routing/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$routing$2f$authenticated$2d$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/routing/authenticated-routes.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
// -----------------------------------------------------------------------------
// sisiMove — Authenticated Navigation
// -----------------------------------------------------------------------------
//
// Primary navigation for authenticated application surfaces.
//
// Current navigation:
//
//     🧳 My Journeys
//         → /my-journeys
//
//     📋 My Demands
//         → /my-demands
//
//     📁 Assets
//         → /assets
//
// The sisiMove logo → /home is intentionally handled by
// AuthenticatedLogo. Therefore, Home is not rendered here.
//
// Account and notification controls are also intentionally separate:
//
//     AuthenticatedAccountMenu
//     AuthenticatedNotifications
//
// Responsibilities:
// - Render primary authenticated application navigation.
// - Provide canonical links to authenticated application surfaces.
// - Highlight the currently active authenticated surface.
// - Provide entry points into the user's owned Journey and Demand surfaces.
// - Provide entry point into the user's Asset-management surface.
//
// Non-responsibilities:
// - No authentication-state management.
// - No session management.
// - No authorization.
// - No verification logic.
// - No marketplace capability logic.
// - No Journey data fetching.
// - No Journey Demand data fetching.
// - No Asset data fetching.
// - No account-menu behavior.
// - No notification behavior.
//
// Navigation is intentionally static. Whether a user is authorized to
// perform an action on a destination surface is resolved by that surface
// and the corresponding backend authorization boundary.
//
// Active-state ownership:
//
//     usePathname()
//          ↓
//     AuthenticatedNavigation
//          ↓
//     active navigation item
//
// The active state is presentation-only. It does not determine authorization
// or access to the destination.
//
// -----------------------------------------------------------------------------
'use client';
;
;
;
;
function AuthenticatedNavigation() {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const isMyJourneysActive = pathname === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$routing$2f$authenticated$2d$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AUTHENTICATED_ROUTES"].MY_JOURNEYS || pathname.startsWith(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$routing$2f$authenticated$2d$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AUTHENTICATED_ROUTES"].MY_JOURNEYS}/`);
    const isMyDemandsActive = pathname === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$routing$2f$authenticated$2d$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AUTHENTICATED_ROUTES"].MY_DEMANDS || pathname.startsWith(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$routing$2f$authenticated$2d$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AUTHENTICATED_ROUTES"].MY_DEMANDS}/`);
    const isAssetsActive = pathname === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$routing$2f$authenticated$2d$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AUTHENTICATED_ROUTES"].ASSETS || pathname.startsWith(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$routing$2f$authenticated$2d$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AUTHENTICATED_ROUTES"].ASSETS}/`);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        "aria-label": "Authenticated navigation",
        className: "flex items-center",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                href: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$routing$2f$authenticated$2d$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AUTHENTICATED_ROUTES"].MY_JOURNEYS,
                "aria-current": isMyJourneysActive ? 'page' : undefined,
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('inline-flex items-center gap-2 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium outline-none transition-colors duration-150 ease-out', isMyJourneysActive ? 'bg-[var(--brand)]/10 text-[var(--brand)]' : 'text-[var(--foreground)] hover:bg-[var(--muted)] hover:text-[var(--brand)]', 'focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]'),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        "aria-hidden": "true",
                        children: "🧳"
                    }, void 0, false, {
                        fileName: "[project]/src/components/authenticated/authenticated-header/authenticated-navigation.tsx",
                        lineNumber: 109,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "My Journeys"
                    }, void 0, false, {
                        fileName: "[project]/src/components/authenticated/authenticated-header/authenticated-navigation.tsx",
                        lineNumber: 111,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/authenticated/authenticated-header/authenticated-navigation.tsx",
                lineNumber: 98,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                href: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$routing$2f$authenticated$2d$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AUTHENTICATED_ROUTES"].MY_DEMANDS,
                "aria-current": isMyDemandsActive ? 'page' : undefined,
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('inline-flex items-center gap-2 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium outline-none transition-colors duration-150 ease-out', isMyDemandsActive ? 'bg-[var(--brand)]/10 text-[var(--brand)]' : 'text-[var(--foreground)] hover:bg-[var(--muted)] hover:text-[var(--brand)]', 'focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]'),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        "aria-hidden": "true",
                        children: "📋"
                    }, void 0, false, {
                        fileName: "[project]/src/components/authenticated/authenticated-header/authenticated-navigation.tsx",
                        lineNumber: 129,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "My Demands"
                    }, void 0, false, {
                        fileName: "[project]/src/components/authenticated/authenticated-header/authenticated-navigation.tsx",
                        lineNumber: 131,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/authenticated/authenticated-header/authenticated-navigation.tsx",
                lineNumber: 118,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                href: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$routing$2f$authenticated$2d$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AUTHENTICATED_ROUTES"].ASSETS,
                "aria-current": isAssetsActive ? 'page' : undefined,
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('inline-flex items-center gap-2 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium outline-none transition-colors duration-150 ease-out', isAssetsActive ? 'bg-[var(--brand)]/10 text-[var(--brand)]' : 'text-[var(--foreground)] hover:bg-[var(--muted)] hover:text-[var(--brand)]', 'focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]'),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        "aria-hidden": "true",
                        children: "📁"
                    }, void 0, false, {
                        fileName: "[project]/src/components/authenticated/authenticated-header/authenticated-navigation.tsx",
                        lineNumber: 149,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "Assets"
                    }, void 0, false, {
                        fileName: "[project]/src/components/authenticated/authenticated-header/authenticated-navigation.tsx",
                        lineNumber: 151,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/authenticated/authenticated-header/authenticated-navigation.tsx",
                lineNumber: 138,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/authenticated/authenticated-header/authenticated-navigation.tsx",
        lineNumber: 90,
        columnNumber: 5
    }, this);
}
_s(AuthenticatedNavigation, "xbyQPtUVMO7MNj7WjJlpdWqRcTo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = AuthenticatedNavigation;
const __TURBOPACK__default__export__ = AuthenticatedNavigation;
var _c;
__turbopack_context__.k.register(_c, "AuthenticatedNavigation");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/authenticated/authenticated-header/authenticated-notifications.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthenticatedNotifications",
    ()=>AuthenticatedNotifications,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// sisiMove — Authenticated Notifications
// -----------------------------------------------------------------------------
//
// Notification control for the authenticated application header.
//
// Responsibilities:
// - Render the authenticated notification control.
// - Provide an accessible label for the notification action.
// - Provide a stable presentation boundary for future notification state.
//
// Non-responsibilities:
// - No notification fetching.
// - No notification state management.
// - No unread-count calculation.
// - No authentication state management.
// - No session management.
// - No authorization.
// - No marketplace logic.
//
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
'use client';
;
;
function AuthenticatedNotifications({ unreadCount = 0, href = '/notifications' }) {
    const hasUnreadNotifications = unreadCount > 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        href: href,
        "aria-label": hasUnreadNotifications ? `Notifications, ${unreadCount} unread` : 'Notifications',
        className: [
            'relative inline-flex size-9 items-center justify-center',
            'rounded-full',
            'transition-colors duration-150 ease-out',
            'hover:bg-[var(--brand-soft)]',
            'focus-visible:outline-none',
            'focus-visible:ring-2',
            'focus-visible:ring-[var(--brand)]',
            'focus-visible:ring-offset-2',
            'focus-visible:ring-offset-[var(--surface)]'
        ].join(' '),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                "aria-hidden": "true",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "var(--brand)",
                strokeWidth: "1.8",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                className: "size-5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"
                    }, void 0, false, {
                        fileName: "[project]/src/components/authenticated/authenticated-header/authenticated-notifications.tsx",
                        lineNumber: 78,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M13.73 21a2 2 0 0 1-3.46 0"
                    }, void 0, false, {
                        fileName: "[project]/src/components/authenticated/authenticated-header/authenticated-notifications.tsx",
                        lineNumber: 79,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/authenticated/authenticated-header/authenticated-notifications.tsx",
                lineNumber: 68,
                columnNumber: 7
            }, this),
            hasUnreadNotifications ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                "aria-hidden": "true",
                className: [
                    'absolute right-1.5 top-1.5 size-2 rounded-full',
                    'bg-[var(--brand)]',
                    'ring-2 ring-[var(--surface)]'
                ].join(' ')
            }, void 0, false, {
                fileName: "[project]/src/components/authenticated/authenticated-header/authenticated-notifications.tsx",
                lineNumber: 83,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/authenticated/authenticated-header/authenticated-notifications.tsx",
        lineNumber: 49,
        columnNumber: 5
    }, this);
}
_c = AuthenticatedNotifications;
const __TURBOPACK__default__export__ = AuthenticatedNotifications;
var _c;
__turbopack_context__.k.register(_c, "AuthenticatedNotifications");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/authenticated/authenticated-header/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$authenticated$2f$authenticated$2d$header$2f$authenticated$2d$header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/authenticated/authenticated-header/authenticated-header.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$authenticated$2f$authenticated$2d$header$2f$authenticated$2d$logo$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/authenticated/authenticated-header/authenticated-logo.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$authenticated$2f$authenticated$2d$header$2f$authenticated$2d$navigation$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/authenticated/authenticated-header/authenticated-navigation.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$authenticated$2f$authenticated$2d$header$2f$authenticated$2d$account$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/authenticated/authenticated-header/authenticated-account-menu.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$authenticated$2f$authenticated$2d$header$2f$authenticated$2d$notifications$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/authenticated/authenticated-header/authenticated-notifications.tsx [app-client] (ecmascript)");
;
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/authenticated/authenticated-shell.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Authenticated Shell
// -----------------------------------------------------------------------------
//
// Application shell for authenticated SisiMove routes.
//
// Shell structure:
//
//     AuthenticatedShell
//         │
//         ├── AuthenticatedHeader
//         │     ├── Logo
//         │     ├── Navigation
//         │     ├── Account Menu
//         │     └── Notifications
//         │
//         ├── Page content
//         │
//         └── AuthenticatedFooter
//
// Responsibilities:
// - Establish the authenticated application's visual shell.
// - Compose the authenticated header.
// - Provide the page-content boundary.
// - Compose the authenticated footer.
//
// Non-responsibilities:
// - No authentication-state management.
// - No session restoration.
// - No login/logout implementation.
// - No route protection.
// - No authorization.
// - No verification logic.
// - No marketplace capability logic.
// - No marketplace data fetching.
// - No traveller-profile fetching.
//
// Authentication boundary:
//
//     (authenticated)/layout.tsx
//              │
//              ▼
//     AuthenticatedShell
//
// Route protection should remain at the authenticated route boundary and
// should use the existing authentication infrastructure. The shell itself
// must not create a second authentication mechanism.
//
// Traveller identity:
//
// AuthSession contains authentication/session identifiers, but the public
// traveller handle belongs to TravellerProfile. Therefore the shell receives
// travellerHandle from the authenticated application boundary rather than
// reading it from AuthSession.
//
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "AuthenticatedShell",
    ()=>AuthenticatedShell,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$authenticated$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/authenticated/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$authenticated$2f$authenticated$2d$footer$2f$authenticated$2d$footer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/authenticated/authenticated-footer/authenticated-footer.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$authenticated$2f$authenticated$2d$header$2f$authenticated$2d$header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/authenticated/authenticated-header/authenticated-header.tsx [app-client] (ecmascript)");
;
;
function AuthenticatedShell({ children, travellerHandle }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-background text-foreground",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-h-screen flex-col",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$authenticated$2f$authenticated$2d$header$2f$authenticated$2d$header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthenticatedHeader"], {
                    travellerHandle: travellerHandle
                }, void 0, false, {
                    fileName: "[project]/src/components/authenticated/authenticated-shell.tsx",
                    lineNumber: 90,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                    className: "min-w-0 flex-1",
                    children: children
                }, void 0, false, {
                    fileName: "[project]/src/components/authenticated/authenticated-shell.tsx",
                    lineNumber: 94,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$authenticated$2f$authenticated$2d$footer$2f$authenticated$2d$footer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthenticatedFooter"], {}, void 0, false, {
                    fileName: "[project]/src/components/authenticated/authenticated-shell.tsx",
                    lineNumber: 98,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/authenticated/authenticated-shell.tsx",
            lineNumber: 89,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/authenticated/authenticated-shell.tsx",
        lineNumber: 88,
        columnNumber: 5
    }, this);
}
_c = AuthenticatedShell;
const __TURBOPACK__default__export__ = AuthenticatedShell;
var _c;
__turbopack_context__.k.register(_c, "AuthenticatedShell");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/authenticated/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$authenticated$2f$authenticated$2d$shell$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/authenticated/authenticated-shell.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$authenticated$2f$authenticated$2d$header$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/authenticated/authenticated-header/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$authenticated$2f$authenticated$2d$footer$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/authenticated/authenticated-footer/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$authenticated$2f$marketplace$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/authenticated/marketplace/index.ts [app-client] (ecmascript) <locals>");
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/authenticated/marketplace/authenticated-marketplace-actions.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthenticatedMarketplaceActions",
    ()=>AuthenticatedMarketplaceActions,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// sisiMove — Authenticated Marketplace Actions
// -----------------------------------------------------------------------------
//
// Compact action prompt for the authenticated marketplace.
//
// Marketplace participation:
//
//     Existing journey found
//              │
//              └── Book / continue to journey
//
//     Journey not found
//              │
//              └── Create travel demand
//                       │
//                       └── Demand stays visible in the marketplace
//                              │
//                              └── When a suitable journey becomes available,
//                                  the member can be notified
//
//     Traveller has available seats
//              │
//              └── Publish a journey
//
// The component explains how travellers can participate in both sides of the
// SisiMove marketplace: publishing available seats or expressing unmet travel
// demand.
//
// A travel demand is not simply a failed search. It gives the marketplace a
// clear signal of where someone needs to travel. When a suitable journey
// becomes available, the member can be notified so they have an opportunity
// to act on the new supply.
//
// This component is presentation-only. It does not perform search, matching,
// notification delivery, or authorization.
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-right.mjs [app-client] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$car$2d$front$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CarFront$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/car-front.mjs [app-client] (ecmascript) <export default as CarFront>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2d$round$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UsersRound$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users-round.mjs [app-client] (ecmascript) <export default as UsersRound>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/foundation/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/utils/cn.ts [app-client] (ecmascript)");
;
;
;
;
function AuthenticatedMarketplaceActions({ publishJourneyHref, createDemandHref, className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        "aria-labelledby": "authenticated-marketplace-actions-heading",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('w-full', 'border-b border-[var(--border-subtle)]', 'bg-[var(--background-brand)]', className),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-5 lg:px-8",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex flex-col gap-4', 'sm:flex-row sm:items-center sm:justify-between'),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                id: "authenticated-marketplace-actions-heading",
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('text-lg font-semibold tracking-tight', 'text-[var(--foreground)]', 'sm:text-xl'),
                                children: "What are you looking to do?"
                            }, void 0, false, {
                                fileName: "[project]/src/components/authenticated/marketplace/authenticated-marketplace-actions.tsx",
                                lineNumber: 101,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('mt-1 max-w-2xl', 'text-sm leading-5', 'text-[var(--foreground-secondary)]'),
                                children: "Have available seats? Publish your journey and make your trip discoverable. Can’t find the journey you need? Create a travel demand so your travel need is visible to the marketplace. When a suitable journey becomes available, you can be notified."
                            }, void 0, false, {
                                fileName: "[project]/src/components/authenticated/marketplace/authenticated-marketplace-actions.tsx",
                                lineNumber: 112,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/authenticated/marketplace/authenticated-marketplace-actions.tsx",
                        lineNumber: 100,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex shrink-0 flex-wrap items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: publishJourneyHref,
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('inline-flex min-h-10 items-center justify-center gap-2', 'rounded-[var(--radius-md)]', 'bg-[var(--brand)] px-3.5 py-2', 'text-sm font-semibold', 'text-[var(--brand-foreground)]', 'transition-colors duration-150 ease-out', 'hover:bg-[var(--brand-hover)]', 'focus-visible:outline-none', 'focus-visible:ring-2', 'focus-visible:ring-[var(--brand)]', 'focus-visible:ring-offset-2', 'focus-visible:ring-offset-[var(--background-brand)]'),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$car$2d$front$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CarFront$3e$__["CarFront"], {
                                        "aria-hidden": "true",
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/authenticated/marketplace/authenticated-marketplace-actions.tsx",
                                        lineNumber: 152,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Publish a journey"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/authenticated/marketplace/authenticated-marketplace-actions.tsx",
                                        lineNumber: 157,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/authenticated/marketplace/authenticated-marketplace-actions.tsx",
                                lineNumber: 135,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: createDemandHref,
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('inline-flex min-h-10 items-center justify-center gap-2', 'rounded-[var(--radius-md)]', 'border border-[var(--border-strong)]', 'bg-[var(--surface)] px-3.5 py-2', 'text-sm font-semibold', 'text-[var(--foreground)]', 'transition-colors duration-150 ease-out', 'hover:border-[var(--brand)]', 'hover:bg-[var(--brand-soft)]', 'hover:text-[var(--brand)]', 'focus-visible:outline-none', 'focus-visible:ring-2', 'focus-visible:ring-[var(--brand)]', 'focus-visible:ring-offset-2', 'focus-visible:ring-offset-[var(--background-brand)]'),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2d$round$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UsersRound$3e$__["UsersRound"], {
                                        "aria-hidden": "true",
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/authenticated/marketplace/authenticated-marketplace-actions.tsx",
                                        lineNumber: 184,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Create travel demand"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/authenticated/marketplace/authenticated-marketplace-actions.tsx",
                                        lineNumber: 189,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                        "aria-hidden": "true",
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/authenticated/marketplace/authenticated-marketplace-actions.tsx",
                                        lineNumber: 191,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/authenticated/marketplace/authenticated-marketplace-actions.tsx",
                                lineNumber: 164,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/authenticated/marketplace/authenticated-marketplace-actions.tsx",
                        lineNumber: 130,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/authenticated/marketplace/authenticated-marketplace-actions.tsx",
                lineNumber: 90,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/authenticated/marketplace/authenticated-marketplace-actions.tsx",
            lineNumber: 89,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/authenticated/marketplace/authenticated-marketplace-actions.tsx",
        lineNumber: 80,
        columnNumber: 5
    }, this);
}
_c = AuthenticatedMarketplaceActions;
const __TURBOPACK__default__export__ = AuthenticatedMarketplaceActions;
var _c;
__turbopack_context__.k.register(_c, "AuthenticatedMarketplaceActions");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/authenticated/marketplace/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// src/components/authenticated/marketplace/index.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$authenticated$2f$marketplace$2f$authenticated$2d$marketplace$2d$actions$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/authenticated/marketplace/authenticated-marketplace-actions.tsx [app-client] (ecmascript)");
;
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
"[project]/src/features/authentication/constants/authentication.constants.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Authentication Constants
// -----------------------------------------------------------------------------
//
// Frontend constants shared across the authentication feature.
//
// Responsibilities:
// - Define stable authentication-related client constants.
// - Keep authentication API identifiers out of presentation components.
// - Keep authentication entry-route identifiers centralized.
// - Provide stable authentication form field identifiers.
//
// Non-responsibilities:
// - No authentication state.
// - No access-token or refresh-token storage.
// - No backend domain logic.
// - No user credentials.
// - No session mutation.
// - No authenticated application routes.
// - No marketplace capability or verification rules.
//
// Architectural boundary:
//
//     Authentication
//         ├── Registration
//         ├── Login
//         ├── Logout
//         ├── Session
//         └── Device
//
//     Authenticated Application
//         ├── /home
//         ├── /my-journeys
//         └── future authenticated surfaces
//
// Authenticated application routes deliberately do NOT belong in this file.
//
// Backend authentication contract:
//
// POST /api/v1/authentications/login
//
// Headers:
//   x-device-type
//   x-device-fingerprint
//
// Request body:
//   emailOrPhoneNumber
//   password
//
// Successful login response contains:
//   identityPublicId
//   authenticationPublicId
//   devicePublicId
//   sessionPublicId
//   accessToken
//   refreshToken
//
// Logout contract:
//
// POST /api/v1/sessions/logout
//
// Logout does not accept a sessionPublicId from the client.
// The backend derives the current session from the authenticated
// access-token principal.
//
// -----------------------------------------------------------------------------
/**
 * Authentication API paths.
 *
 * These paths are relative to the configured API base URL.
 *
 * Although logout is implemented by the backend Session boundary,
 * it is exposed here because logout is an authentication lifecycle
 * operation from the frontend application's perspective.
 */ __turbopack_context__.s([
    "AUTHENTICATION_API_PATHS",
    ()=>AUTHENTICATION_API_PATHS,
    "AUTHENTICATION_DEVICE_TYPES",
    ()=>AUTHENTICATION_DEVICE_TYPES,
    "AUTHENTICATION_FIELDS",
    ()=>AUTHENTICATION_FIELDS,
    "AUTHENTICATION_HEADERS",
    ()=>AUTHENTICATION_HEADERS,
    "AUTHENTICATION_ROUTES",
    ()=>AUTHENTICATION_ROUTES,
    "AUTHENTICATION_STORAGE_KEYS",
    ()=>AUTHENTICATION_STORAGE_KEYS,
    "AUTHENTICATION_SUCCESS",
    ()=>AUTHENTICATION_SUCCESS,
    "DEFAULT_AUTHENTICATION_DEVICE_TYPE",
    ()=>DEFAULT_AUTHENTICATION_DEVICE_TYPE,
    "REGISTER_USER_NEXT",
    ()=>REGISTER_USER_NEXT,
    "REGISTER_USER_STATUS",
    ()=>REGISTER_USER_STATUS
]);
const AUTHENTICATION_API_PATHS = {
    REGISTER: '/authentications/register',
    LOGIN: '/authentications/login',
    LOGOUT: '/sessions/logout'
};
const AUTHENTICATION_HEADERS = {
    DEVICE_TYPE: 'x-device-type',
    DEVICE_FINGERPRINT: 'x-device-fingerprint'
};
const AUTHENTICATION_DEVICE_TYPES = {
    WEB: 'WEB'
};
const DEFAULT_AUTHENTICATION_DEVICE_TYPE = AUTHENTICATION_DEVICE_TYPES.WEB;
const REGISTER_USER_STATUS = {
    REGISTERED: 'REGISTERED'
};
const REGISTER_USER_NEXT = {
    LOGIN: 'LOGIN'
};
const AUTHENTICATION_SUCCESS = true;
const AUTHENTICATION_STORAGE_KEYS = {
    SESSION: 'sisimove.auth.session'
};
const AUTHENTICATION_ROUTES = {
    REGISTER: '/register',
    LOGIN: '/login'
};
const AUTHENTICATION_FIELDS = {
    REGISTRATION: {
        TRAVELLER_NAME: 'travellerName',
        TRAVELLER_HANDLE: 'travellerHandle',
        COUNTRY_CODE: 'countryCode',
        EMAIL: 'email',
        PHONE_NUMBER: 'phoneNumber',
        PASSWORD: 'password',
        CONFIRM_PASSWORD: 'confirmPassword',
        TERMS_ACCEPTED: 'termsAccepted'
    },
    LOGIN: {
        EMAIL_OR_PHONE_NUMBER: 'emailOrPhoneNumber',
        PASSWORD: 'password'
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/authentication/constants/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// -----------------------------------------------------------------------------
// sisiMove — Authentication Constants Barrel
// -----------------------------------------------------------------------------
//
// Public barrel for authentication constants.
//
// Responsibilities:
// - Re-export authentication constants from the feature constants module.
// - Re-export only type helpers actually owned by that module.
//
// Non-responsibilities:
// - No authentication state.
// - No session storage.
// - No API implementation.
// - No device-domain type ownership.
//
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$constants$2f$authentication$2e$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/authentication/constants/authentication.constants.ts [app-client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/authentication/device/device-fingerprint.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getDeviceFingerprint",
    ()=>getDeviceFingerprint
]);
'use client';
// -----------------------------------------------------------------------------
// sisiMove — Authentication Device Fingerprint
// -----------------------------------------------------------------------------
//
// Browser-side device fingerprint used by the authentication boundary.
//
// The fingerprint is sent to the backend during login:
//
//   x-device-fingerprint: <fingerprint>
//
// Important distinction:
//
//   device fingerprint
//       ↓
//   client-generated identifier used to identify the browser/device
//
//   devicePublicId
//       ↓
//   backend-issued Device public identifier returned after successful login
//
// They are NOT the same value.
//
// This module does not:
// - create a backend Device
// - persist an authentication session
// - store tokens
// - store passwords
// - identify the user
// - make network requests
//
// The fingerprint is intentionally generated from stable browser characteristics
// available to the web application. It is not intended to be a cryptographic
// identity or security credential. Backend authentication remains authoritative.
//
// -----------------------------------------------------------------------------
const DEVICE_FINGERPRINT_STORAGE_KEY = 'sisimove.device.fingerprint';
function getDeviceFingerprint() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const existingFingerprint = window.localStorage.getItem(DEVICE_FINGERPRINT_STORAGE_KEY);
    if (existingFingerprint !== null && existingFingerprint.length > 0) {
        return existingFingerprint;
    }
    const fingerprint = createFingerprint();
    window.localStorage.setItem(DEVICE_FINGERPRINT_STORAGE_KEY, fingerprint);
    return fingerprint;
}
/**
 * Generate the initial browser-local fingerprint.
 *
 * `crypto.randomUUID()` is preferred because it is available in modern
 * browsers and produces an opaque UUID without requiring custom hashing.
 */ function createFingerprint() {
    if (("TURBOPACK compile-time value", "object") !== 'undefined' && typeof window.crypto?.randomUUID === 'function') {
        return window.crypto.randomUUID();
    }
    /**
   * This fallback exists for environments where randomUUID is unavailable.
   *
   * It is only used to create a client identifier. It is not a security
   * primitive and must never be treated as one.
   */ return [
        Date.now().toString(36),
        Math.random().toString(36).slice(2),
        Math.random().toString(36).slice(2)
    ].join('-');
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/authentication/device/device-type.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Authentication Device Type
// -----------------------------------------------------------------------------
//
// Canonical device-type contract for the Authentication feature.
//
// This represents the type of client initiating authentication. It is NOT the
// backend Device entity and must not be confused with Device.publicId.
//
// Ownership:
//   Authentication → Device → Device Type
//
// Current supported authentication client:
//   WEB
//
// Backend login contract:
//
//   x-device-type: WEB
//
// The frontend intentionally defines its own string union instead of importing
// a backend or Prisma enum. This keeps the frontend independent of backend
// persistence implementation details.
//
// -----------------------------------------------------------------------------
/**
 * Authentication client types supported by the sisiMove frontend.
 *
 * This type describes the client/application surface initiating authentication,
 * not a persisted backend Device entity.
 *
 * Add additional client types here only when the authentication contract
 * explicitly supports them, for example a future native mobile application.
 */ __turbopack_context__.s([
    "AUTHENTICATION_DEVICE_TYPE",
    ()=>AUTHENTICATION_DEVICE_TYPE
]);
const AUTHENTICATION_DEVICE_TYPE = 'WEB';
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/authentication/device/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// -----------------------------------------------------------------------------
// sisiMove — Authentication Device Barrel
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$device$2f$device$2d$type$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/authentication/device/device-type.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$device$2f$device$2d$fingerprint$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/authentication/device/device-fingerprint.ts [app-client] (ecmascript)");
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/authentication/http/authenticated-api-client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthenticatedApiClient",
    ()=>AuthenticatedApiClient,
    "AuthenticationRequiredError",
    ()=>AuthenticationRequiredError,
    "authenticatedApiClient",
    ()=>authenticatedApiClient
]);
// -----------------------------------------------------------------------------
// sisiMove — Authenticated API Client
// -----------------------------------------------------------------------------
//
// Authentication-aware HTTP boundary for protected API requests.
//
// Responsibilities:
// - Restore the current AuthSession.
// - Extract the backend-issued access token.
// - Attach the token to RequestContext.
// - Delegate HTTP execution to the foundation ApiClient.
//
// Non-responsibilities:
// - Login.
// - Logout.
// - Token generation.
// - Token refresh.
// - Session validation.
// - localStorage access outside authSessionStorage.
// - Feature-specific API calls.
// - Identity/Profile/Trust/Journey/Booking logic.
//
// Architectural boundary:
//
//   Authentication Session
//          │
//          │ accessToken
//          ▼
//   AuthenticatedApiClient
//          │
//          │ RequestContext.accessToken
//          ▼
//   Foundation ApiClient
//          │
//          ▼
//   SisiMove API
//
// Feature API adapters should use this client when calling protected
// endpoints. They must not read authSessionStorage directly.
//
// IMPORTANT:
// The foundation ApiClient contract distinguishes request body from
// RequestOptions:
//
//   GET    → apiClient.get(path, options)
//   POST   → apiClient.post(path, body, options)
//   PATCH  → apiClient.patch(path, body, options)
//   PUT    → apiClient.put(path, body, options)
//   DELETE → apiClient.delete(path, options)
//
// This client MUST preserve that contract.
//
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$http$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/foundation/http/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$http$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/http/api-client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/authentication/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$session$2f$storage$2f$auth$2d$session$2e$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/authentication/session/storage/auth-session.storage.ts [app-client] (ecmascript)");
;
;
class AuthenticationRequiredError extends Error {
    code = 'AUTHENTICATION_REQUIRED';
    constructor(){
        super('An authenticated session is required for this request.');
        this.name = 'AuthenticationRequiredError';
    }
}
class AuthenticatedApiClient {
    /**
   * Execute an authenticated GET request.
   */ async get(path, options = {}) {
        return this.request('GET', path, undefined, options);
    }
    /**
   * Execute an authenticated POST request.
   *
   * The second argument is the request body.
   * The third argument contains RequestOptions.
   */ async post(path, body, options = {}) {
        return this.request('POST', path, body, options);
    }
    /**
   * Execute an authenticated PATCH request.
   *
   * The second argument is the request body.
   * The third argument contains RequestOptions.
   */ async patch(path, body, options = {}) {
        return this.request('PATCH', path, body, options);
    }
    /**
   * Execute an authenticated PUT request.
   *
   * The second argument is the request body.
   * The third argument contains RequestOptions.
   */ async put(path, body, options = {}) {
        return this.request('PUT', path, body, options);
    }
    /**
   * Execute an authenticated DELETE request.
   *
   * DELETE does not carry a request body through this abstraction.
   */ async delete(path, options = {}) {
        return this.request('DELETE', path, undefined, options);
    }
    /**
   * Resolve the current access token and delegate the request to the
   * foundation HTTP client.
   */ async request(method, path, body, options) {
        const session = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$session$2f$storage$2f$auth$2d$session$2e$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authSessionStorage"].get();
        if (session === null) {
            throw new AuthenticationRequiredError();
        }
        /**
     * Preserve any existing request context and inject the access token
     * belonging to the currently authenticated session.
     */ const context = {
            ...options.context,
            accessToken: session.accessToken
        };
        const authenticatedOptions = {
            ...options,
            context
        };
        switch(method){
            case 'GET':
                return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$http$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].get(path, authenticatedOptions);
            case 'POST':
                return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$http$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].post(path, body, authenticatedOptions);
            case 'PATCH':
                return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$http$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].patch(path, body, authenticatedOptions);
            case 'PUT':
                return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$http$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].put(path, body, authenticatedOptions);
            case 'DELETE':
                return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$http$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].delete(path, authenticatedOptions);
        }
    }
}
const authenticatedApiClient = new AuthenticatedApiClient();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/authentication/http/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// -----------------------------------------------------------------------------
// sisiMove — Authentication HTTP Barrel
// -----------------------------------------------------------------------------
//
// Public HTTP boundary for authentication-aware API requests.
//
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$http$2f$authenticated$2d$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/authentication/http/authenticated-api-client.ts [app-client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/authentication/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// -----------------------------------------------------------------------------
// sisiMove — Authentication Feature Barrel
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$registration$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/authentication/registration/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$login$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/authentication/login/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$session$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/authentication/session/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$device$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/authentication/device/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$state$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/authentication/state/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$http$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/authentication/http/index.ts [app-client] (ecmascript) <locals>");
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
"[project]/src/features/authentication/login/api/authenticate-login.api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "authenticateLogin",
    ()=>authenticateLogin
]);
// -----------------------------------------------------------------------------
// sisiMove — Authenticate Login API
// -----------------------------------------------------------------------------
//
// Feature API boundary for:
//
//     POST /authentications/login
//
// The backend login contract intentionally separates:
//
// 1. User credentials
//      - emailOrPhoneNumber
//      - password
//
// 2. Technical device metadata
//      - x-device-type
//      - x-device-fingerprint
//
// The credentials are represented by AuthenticateLoginRequest.
//
// The required device metadata is supplied here at the HTTP boundary because
// it is technical transport information, not part of the user-facing login
// form model.
//
// Backend contract:
//
//     POST /api/v1/authentications/login
//
// Body:
//
//     {
//       "emailOrPhoneNumber": "...",
//       "password": "..."
//     }
//
// Required headers:
//
//     x-device-type
//     x-device-fingerprint
//
// Successful response:
//
//     {
//       "success": true,
//       "identityPublicId": "...",
//       "authenticationPublicId": "...",
//       "devicePublicId": "...",
//       "sessionPublicId": "...",
//       "accessToken": "...",
//       "refreshToken": "..."
//     }
//
// This module does NOT:
//
// - persist the authentication session;
// - update authentication state;
// - navigate the user;
// - validate the form;
// - refresh tokens;
// - decode JWTs;
// - perform authentication orchestration.
//
// Those responsibilities belong to their respective feature boundaries.
//
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// Foundation — HTTP
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$http$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/foundation/http/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$http$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/http/api-client.ts [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// Authentication — Constants
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$constants$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/authentication/constants/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$constants$2f$authentication$2e$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/authentication/constants/authentication.constants.ts [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// Authentication — Device
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$device$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/authentication/device/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$device$2f$device$2d$fingerprint$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/authentication/device/device-fingerprint.ts [app-client] (ecmascript)");
;
;
;
async function authenticateLogin(request) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$http$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].post(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$constants$2f$authentication$2e$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AUTHENTICATION_API_PATHS"].LOGIN, request, {
        headers: {
            [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$constants$2f$authentication$2e$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AUTHENTICATION_HEADERS"].DEVICE_TYPE]: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$constants$2f$authentication$2e$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_AUTHENTICATION_DEVICE_TYPE"],
            [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$constants$2f$authentication$2e$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AUTHENTICATION_HEADERS"].DEVICE_FINGERPRINT]: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$device$2f$device$2d$fingerprint$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDeviceFingerprint"])()
        }
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/authentication/login/api/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// -----------------------------------------------------------------------------
// sisiMove — Login API Barrel
// -----------------------------------------------------------------------------
//
// Public exports for the Authentication Login API boundary.
//
// Keep this barrel limited to login API operations. Models, schemas, device
// utilities, session storage, and authentication state have their own
// boundaries.
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$login$2f$api$2f$authenticate$2d$login$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/authentication/login/api/authenticate-login.api.ts [app-client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/authentication/login/hooks/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// -----------------------------------------------------------------------------
// sisiMove — Login Hooks Barrel
// -----------------------------------------------------------------------------
//
// Public exports for Authentication Login hooks.
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$login$2f$hooks$2f$use$2d$authenticate$2d$login$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/authentication/login/hooks/use-authenticate-login.ts [app-client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/authentication/login/hooks/use-authenticate-login.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAuthenticateLogin",
    ()=>useAuthenticateLogin
]);
// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// Authentication — API
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$login$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/authentication/login/api/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$login$2f$api$2f$authenticate$2d$login$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/authentication/login/api/authenticate-login.api.ts [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// Authentication — State
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$state$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/authentication/state/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$state$2f$authentication$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/authentication/state/authentication-context.tsx [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
// -----------------------------------------------------------------------------
// sisiMove — Authenticate Login Hook
// -----------------------------------------------------------------------------
//
// Feature hook for the complete client-side login operation.
//
// Responsibilities:
//
//     Login Form
//         │
//         ▼
//     useAuthenticateLogin()
//         │
//         ├── authenticateLogin()
//         │       └── HTTP API
//         │
//         ├── map successful response → AuthSession
//         │
//         └── AuthenticationContext.authenticate()
//                 ├── persist session
//                 └── update authentication state
//
// This hook intentionally does NOT:
//
// - validate form values;
// - construct device fingerprints;
// - construct HTTP headers;
// - persist directly to localStorage;
// - manipulate AuthenticationContext state directly;
// - navigate the application;
// - decode JWTs;
// - refresh tokens;
// - perform registration.
//
// Those responsibilities belong to the appropriate feature boundaries.
//
// -----------------------------------------------------------------------------
// Client Component
// -----------------------------------------------------------------------------
'use client';
;
;
;
// =============================================================================
// Response → Session Mapping
// =============================================================================
/**
 * Converts the backend login response into the frontend authentication
 * session contract.
 *
 * The mapping is intentionally explicit rather than spreading the response.
 * This keeps the AuthSession contract independent from the HTTP response
 * representation.
 */ function toAuthSession(response) {
    if (!response) {
        throw new Error('Authentication login response is required.');
    }
    return {
        identityPublicId: response.identityPublicId,
        authenticationPublicId: response.authenticationPublicId,
        devicePublicId: response.devicePublicId,
        sessionPublicId: response.sessionPublicId,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken
    };
}
function useAuthenticateLogin() {
    _s();
    // ---------------------------------------------------------------------------
    // Authentication State Boundary
    // ---------------------------------------------------------------------------
    const { authenticate } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$state$2f$authentication$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthentication"])();
    // ---------------------------------------------------------------------------
    // Request State
    // ---------------------------------------------------------------------------
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // ---------------------------------------------------------------------------
    // Login
    // ---------------------------------------------------------------------------
    const login = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAuthenticateLogin.useCallback[login]": async (request)=>{
            setIsLoading(true);
            setData(null);
            setError(null);
            try {
                // ---------------------------------------------------------------------
                // HTTP Authentication
                // ---------------------------------------------------------------------
                //
                // The API boundary adds the required device headers. The hook only
                // supplies the user credential request.
                //
                // ---------------------------------------------------------------------
                const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$login$2f$api$2f$authenticate$2d$login$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authenticateLogin"])(request);
                // ---------------------------------------------------------------------
                // Establish Frontend Authentication Session
                // ---------------------------------------------------------------------
                //
                // AuthenticationContext owns:
                //
                // - session persistence;
                // - authenticated state;
                // - subsequent consumers of authentication state.
                //
                // ---------------------------------------------------------------------
                const session = toAuthSession(response);
                await authenticate(session);
                // ---------------------------------------------------------------------
                // Store Successful Request Result
                // ---------------------------------------------------------------------
                setData(response);
                return response;
            } catch (caughtError) {
                // ---------------------------------------------------------------------
                // Normalize Unknown Errors
                // ---------------------------------------------------------------------
                const normalizedError = caughtError instanceof Error ? caughtError : new Error('Unable to sign in.');
                setError(normalizedError);
                // ---------------------------------------------------------------------
                // Preserve Failure Semantics
                // ---------------------------------------------------------------------
                //
                // The caller may use the rejected promise for form-level handling,
                // while the hook also exposes the error through its state.
                //
                // ---------------------------------------------------------------------
                throw normalizedError;
            } finally{
                setIsLoading(false);
            }
        }
    }["useAuthenticateLogin.useCallback[login]"], [
        authenticate
    ]);
    // ---------------------------------------------------------------------------
    // Reset
    // ---------------------------------------------------------------------------
    const reset = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAuthenticateLogin.useCallback[reset]": ()=>{
            setIsLoading(false);
            setData(null);
            setError(null);
        }
    }["useAuthenticateLogin.useCallback[reset]"], []);
    // ---------------------------------------------------------------------------
    // Result
    // ---------------------------------------------------------------------------
    return {
        isLoading,
        data,
        error,
        login,
        reset
    };
}
_s(useAuthenticateLogin, "cnvJ940i55fFlWkmAvjmqM9anN0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$state$2f$authentication$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthentication"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/authentication/login/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// -----------------------------------------------------------------------------
// sisiMove — Authentication Login Feature Barrel
// -----------------------------------------------------------------------------
//
// Public entry point for the Authentication Login feature.
//
// The login feature exposes:
//
//     API
//     ├── authenticateLogin
//
//     Models
//     ├── AuthenticateLoginRequest
//     └── AuthenticateLoginResponse
//
//     Validation
//     ├── authenticateLoginSchema
//     └── AuthenticateLoginFormValues
//
//     Hooks
//     ├── useAuthenticateLogin
//     ├── UseAuthenticateLoginState
//     └── UseAuthenticateLoginResult
//
// Lower-level implementation details remain behind their respective feature
// boundaries.
//
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$login$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/authentication/login/api/index.ts [app-client] (ecmascript) <locals>");
// -----------------------------------------------------------------------------
// Schemas
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$login$2f$schemas$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/authentication/login/schemas/index.ts [app-client] (ecmascript) <locals>");
// -----------------------------------------------------------------------------
// Hooks
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$login$2f$hooks$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/authentication/login/hooks/index.ts [app-client] (ecmascript) <locals>");
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/authentication/login/schemas/authenticate-login.schema.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "authenticateLoginSchema",
    ()=>authenticateLoginSchema
]);
// -----------------------------------------------------------------------------
// sisiMove — Authenticate Login Schema
// -----------------------------------------------------------------------------
//
// Frontend validation schema for the login form.
//
// Login requires only:
//
// - emailOrPhoneNumber
// - password
//
// Technical device metadata is intentionally NOT represented here.
//
// Device metadata is supplied separately by the authentication API boundary:
//
//     x-device-fingerprint
//     x-device-type
//     x-device-name
//     x-device-platform
//     x-device-operating-system
//     x-device-operating-system-version
//     x-device-browser
//     x-device-browser-version
//     x-country-code
//     x-city
//
// This schema therefore validates the user-facing login form only.
//
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-client] (ecmascript) <export * as z>");
;
const authenticateLoginSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    // ---------------------------------------------------------------------------
    // Email / Phone Number
    // ---------------------------------------------------------------------------
    emailOrPhoneNumber: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().min(1, 'Enter your email or phone number.'),
    // ---------------------------------------------------------------------------
    // Password
    // ---------------------------------------------------------------------------
    password: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Enter your password.')
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/authentication/login/schemas/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// -----------------------------------------------------------------------------
// sisiMove — Login Schema Public Exports
// -----------------------------------------------------------------------------
//
// Public validation boundary for login.
//
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$login$2f$schemas$2f$authenticate$2d$login$2e$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/authentication/login/schemas/authenticate-login.schema.ts [app-client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/authentication/logout/api/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// -----------------------------------------------------------------------------
// sisiMove — Logout API Barrel
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$logout$2f$api$2f$logout$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/authentication/logout/api/logout.api.ts [app-client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/authentication/logout/api/logout.api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "logoutUser",
    ()=>logoutUser
]);
// -----------------------------------------------------------------------------
// sisiMove — Logout API
// -----------------------------------------------------------------------------
//
// Authentication feature API adapter for authenticated logout.
//
// Responsibilities:
// - Call the backend logout endpoint.
// - Use the authenticated API client so the current access token is attached.
// - Return the backend logout response.
//
// Non-responsibilities:
// - No session storage.
// - No navigation.
// - No sessionPublicId.
// - No access-token parsing.
// - No refresh-token handling.
// - No logout state management.
//
// Backend contract:
//
//     POST /sessions/logout
//
// The backend derives the authenticated session from:
//
//     JWT.sub → identityPublicId
//     JWT.sid → sessionPublicId
//
// Therefore the frontend intentionally sends no session identifier.
//
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$http$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/authentication/http/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$http$2f$authenticated$2d$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/authentication/http/authenticated-api-client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$constants$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/authentication/constants/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$constants$2f$authentication$2e$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/authentication/constants/authentication.constants.ts [app-client] (ecmascript)");
;
;
async function logoutUser() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$http$2f$authenticated$2d$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authenticatedApiClient"].post(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$constants$2f$authentication$2e$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AUTHENTICATION_API_PATHS"].LOGOUT);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/authentication/logout/hooks/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// -----------------------------------------------------------------------------
// sisiMove — Logout Hooks Barrel
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$logout$2f$hooks$2f$use$2d$logout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/authentication/logout/hooks/use-logout.ts [app-client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/authentication/logout/hooks/use-logout.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useLogout",
    ()=>useLogout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$logout$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/authentication/logout/api/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$logout$2f$api$2f$logout$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/authentication/logout/api/logout.api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$session$2f$storage$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/authentication/session/storage/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$session$2f$storage$2f$auth$2d$session$2e$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/authentication/session/storage/auth-session.storage.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
// -----------------------------------------------------------------------------
// sisiMove — Use Logout
// -----------------------------------------------------------------------------
//
// React hook for the authenticated user's logout action.
//
// Responsibilities:
// - Execute the backend logout request.
// - Remove the locally persisted authentication session after successful
//   server-side logout.
// - Expose logout loading and error state to presentation components.
// - Keep logout orchestration out of UI components.
//
// Non-responsibilities:
// - No direct HTTP implementation.
// - No access-token parsing.
// - No refresh-token manipulation.
// - No session ID construction.
// - No localStorage access.
// - No navigation implementation.
// - No authentication business rules.
//
// Logout flow:
//
//     UI
//      │
//      ▼
// useLogout()
//      │
//      ├── logoutUser()
//      │       │
//      │       └── POST /sessions/logout
//      │
//      └── authSessionStorage.remove()
//
// Backend derives the current session from the authenticated JWT.
// The frontend therefore does NOT send a sessionPublicId.
//
// -----------------------------------------------------------------------------
'use client';
;
;
;
function useLogout() {
    _s();
    const [isLoggingOut, setIsLoggingOut] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const logout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useLogout.useCallback[logout]": async ()=>{
            setIsLoggingOut(true);
            setError(null);
            try {
                /**
       * Revoke the current backend session.
       *
       * The API adapter intentionally receives no sessionPublicId because
       * the backend derives the current session from the authenticated JWT.
       */ const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$logout$2f$api$2f$logout$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logoutUser"])();
                /**
       * Remove the locally persisted AuthSession only after the backend
       * confirms successful logout.
       */ await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$session$2f$storage$2f$auth$2d$session$2e$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authSessionStorage"].remove();
                return response;
            } catch (caughtError) {
                setError(caughtError);
                throw caughtError;
            } finally{
                setIsLoggingOut(false);
            }
        }
    }["useLogout.useCallback[logout]"], []);
    return {
        logout,
        isLoggingOut,
        error
    };
}
_s(useLogout, "SWhvemRxOjCBr0pI+JH7KgwP2gM=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/authentication/logout/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// -----------------------------------------------------------------------------
// sisiMove — Logout Feature Barrel
// -----------------------------------------------------------------------------
//
// Public exports for the authentication logout feature.
//
// The feature barrel allows consumers to import logout functionality from:
//
//     @/features/authentication/logout
//
// Internal folder structure remains an implementation detail.
//
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$logout$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/authentication/logout/api/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$logout$2f$hooks$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/authentication/logout/hooks/index.ts [app-client] (ecmascript) <locals>");
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/authentication/registration/api/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// -----------------------------------------------------------------------------
// sisiMove — Registration API Public Exports
// -----------------------------------------------------------------------------
//
// Public API boundary for the registration feature.
//
// Consumers should import registration API functionality from this barrel
// rather than reaching into implementation files.
//
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$registration$2f$api$2f$register$2d$user$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/authentication/registration/api/register-user.api.ts [app-client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/authentication/registration/api/register-user.api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "registerUser",
    ()=>registerUser
]);
// -----------------------------------------------------------------------------
// sisiMove — Register User API
// -----------------------------------------------------------------------------
//
// Feature API boundary for user registration.
//
// HTTP endpoint:
//
//     POST /api/v1/authentications/register
//
// Responsibilities:
// - send the registration request to the backend;
// - use the shared foundation ApiClient;
// - return the typed registration response.
//
// This module does NOT:
// - perform validation;
// - hash passwords;
// - create sessions;
// - authenticate the user;
// - store tokens;
// - manipulate authentication state;
// - derive the traveller handle;
// - construct backend commands;
// - know about Identity, Verification, Trust, or TravellerProfile internals.
//
// The backend is authoritative for registration behavior and for the
// travellerHandle returned after successful registration.
//
// -----------------------------------------------------------------------------
//
// Request contract:
//
// {
//   travellerName: string;
//   countryCode: string;
//   email: string;
//   phoneNumber: string;
//   password: string;
//   termsAccepted: boolean;
// }
//
// Response contract:
//
// {
//   status: 'REGISTERED';
//   identityPublicId: string;
//   travellerHandle: string;
//   next: 'LOGIN';
// }
//
// `confirmPassword` is intentionally absent because it is a frontend-only
// validation concern and is NOT part of the backend HTTP contract.
//
// `handle` is intentionally absent because the backend derives the traveller
// handle from travellerName and returns the authoritative value.
//
// Registration does not authenticate the user. The response explicitly tells
// the client that the next action is LOGIN.
//
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// Foundation — HTTP
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$http$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/foundation/http/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$http$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/http/api-client.ts [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// Authentication — Constants
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$constants$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/authentication/constants/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$constants$2f$authentication$2e$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/authentication/constants/authentication.constants.ts [app-client] (ecmascript)");
;
;
async function registerUser(request) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$http$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].post(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$constants$2f$authentication$2e$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AUTHENTICATION_API_PATHS"].REGISTER, request);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/authentication/registration/hooks/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// -----------------------------------------------------------------------------
// sisiMove — Registration Hooks Public Exports
// -----------------------------------------------------------------------------
//
// Public exports for registration React hooks.
//
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$registration$2f$hooks$2f$use$2d$register$2d$user$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/authentication/registration/hooks/use-register-user.ts [app-client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/authentication/registration/hooks/use-register-user.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useRegisterUser",
    ()=>useRegisterUser
]);
// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// Registration — API
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$registration$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/authentication/registration/api/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$registration$2f$api$2f$register$2d$user$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/authentication/registration/api/register-user.api.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
// -----------------------------------------------------------------------------
// sisiMove — Register User Hook
// -----------------------------------------------------------------------------
//
// React hook for executing the user-registration API operation.
//
// Flow:
//
//     RegisterForm
//          │
//          ▼
//     useRegisterUser()
//          │
//          ▼
//     registerUser()
//          │
//          ▼
//     ApiClient
//          │
//          ▼
//     POST /authentications/register
//
// This hook owns the client-side execution state of the registration request.
//
// It does NOT own:
//
// - form validation;
// - password confirmation;
// - request DTO construction beyond accepting the API request model;
// - password hashing;
// - Identity creation;
// - TravellerProfile creation;
// - TrustProfile creation;
// - Verification;
// - Authentication creation;
// - Session creation;
// - token storage;
// - authentication state;
// - navigation.
//
// Registration is intentionally not authentication.
//
// A successful registration returns:
//
//     {
//       status: 'REGISTERED',
//       identityPublicId: string,
//       travellerHandle: string,
//       next: 'LOGIN'
//     }
//
// The consuming registration page/form decides how to present that result and
// navigate the user to login.
//
// -----------------------------------------------------------------------------
'use client';
;
;
function useRegisterUser() {
    _s();
    // ---------------------------------------------------------------------------
    // State
    // ---------------------------------------------------------------------------
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // ---------------------------------------------------------------------------
    // Register
    // ---------------------------------------------------------------------------
    //
    // A new request clears the previous result/error before execution.
    //
    // The error is retained in hook state and also re-thrown so the consuming
    // form can perform request-specific behavior when required.
    //
    // ---------------------------------------------------------------------------
    const register = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useRegisterUser.useCallback[register]": async (request)=>{
            setIsLoading(true);
            setData(null);
            setError(null);
            try {
                const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$registration$2f$api$2f$register$2d$user$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["registerUser"])(request);
                setData(response);
                return response;
            } catch (caughtError) {
                const error = caughtError instanceof Error ? caughtError : new Error('Unable to register your account.');
                setError(error);
                throw error;
            } finally{
                setIsLoading(false);
            }
        }
    }["useRegisterUser.useCallback[register]"], []);
    // ---------------------------------------------------------------------------
    // Reset
    // ---------------------------------------------------------------------------
    const reset = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useRegisterUser.useCallback[reset]": ()=>{
            setIsLoading(false);
            setData(null);
            setError(null);
        }
    }["useRegisterUser.useCallback[reset]"], []);
    // ---------------------------------------------------------------------------
    // Result
    // ---------------------------------------------------------------------------
    return {
        isLoading,
        data,
        error,
        register,
        reset
    };
}
_s(useRegisterUser, "iaq0ly2c6kZ4o8itUYQJY2fWGjI=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/authentication/registration/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// -----------------------------------------------------------------------------
// sisiMove — Registration Feature Public Exports
// -----------------------------------------------------------------------------
//
// Public entry point for the registration feature.
//
// Consumers should import registration functionality from this file rather
// than reaching into individual implementation directories.
//
// Registration
// ├── api
// │   └── registerUser
// ├── models
// │   ├── RegisterUserRequest
// │   └── RegisterUserResponse
// ├── schemas
// │   ├── registerUserSchema
// │   └── RegisterUserFormValues
// └── hooks
//     ├── useRegisterUser
//     ├── UseRegisterUserState
//     └── UseRegisterUserResult
//
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$registration$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/authentication/registration/api/index.ts [app-client] (ecmascript) <locals>");
// -----------------------------------------------------------------------------
// Schemas
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$registration$2f$schemas$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/authentication/registration/schemas/index.ts [app-client] (ecmascript) <locals>");
// -----------------------------------------------------------------------------
// Hooks
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$registration$2f$hooks$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/authentication/registration/hooks/index.ts [app-client] (ecmascript) <locals>");
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/authentication/registration/schemas/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// -----------------------------------------------------------------------------
// sisiMove — Registration Schema Barrel
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$registration$2f$schemas$2f$register$2d$user$2e$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/authentication/registration/schemas/register-user.schema.ts [app-client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/authentication/registration/schemas/register-user.schema.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "registerUserSchema",
    ()=>registerUserSchema
]);
// -----------------------------------------------------------------------------
// sisiMove — Register User Validation Schema
// -----------------------------------------------------------------------------
//
// Validation boundary for the registration form.
//
// Important distinction:
//
// 1. RegisterUserFormValues
//    Mutable UI state. `termsAccepted` is boolean because the checkbox can
//    legitimately be false while the user is filling out the form.
//
// 2. RegisterUserValidatedValues
//    Output of the schema. `termsAccepted` is guaranteed to be `true` because
//    registration is only valid after the user accepts the terms.
//
// Phone number:
//
// - Users must enter the phone number in international format.
// - The value MUST begin with `+`.
// - The frontend does NOT silently convert local numbers.
// - Example:
//       +254 700 000 000
//
// The API request is deliberately NOT defined by this schema.
// The registration API model remains the authoritative HTTP contract.
//
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-client] (ecmascript) <export * as z>");
;
const registerUserSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    travellerName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().min(2, 'Enter your name.').max(100, 'Your name is too long.'),
    countryCode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().length(2, 'Select a valid country.').transform((value)=>value.toUpperCase()),
    email: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().email('Enter a valid email address.'),
    phoneNumber: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().min(1, 'Enter your phone number.').max(20, 'Your phone number is too long.').regex(/^\+[1-9][0-9\s()-]{6,18}[0-9]$/, 'Use international format, starting with +. Example: +254 700 000 000'),
    password: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(8, 'Password must be at least 8 characters.').max(128, 'Password is too long.'),
    confirmPassword: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Confirm your password.'),
    termsAccepted: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal(true, {
        error: 'You must accept the Terms and Privacy Policy.'
    })
}).superRefine((values, context)=>{
    if (values.password !== values.confirmPassword) {
        context.addIssue({
            code: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].ZodIssueCode.custom,
            path: [
                'confirmPassword'
            ],
            message: 'Passwords do not match.'
        });
    }
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/traveller-profile/api/change-traveller-profile-avatar.api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "changeTravellerProfileAvatar",
    ()=>changeTravellerProfileAvatar
]);
// -----------------------------------------------------------------------------
// sisiMove — Change Traveller Profile Avatar API
// -----------------------------------------------------------------------------
//
// Authenticated API adapter for changing the avatar associated with a
// TravellerProfile.
//
// Backend contract:
//
// PATCH /traveller-profiles/:travellerProfileId/avatar
//
// Body:
// {
//   avatarAssetPublicId: string | null
// }
//
// Responsibilities:
// - Build the authenticated HTTP request.
// - Encode the TravellerProfile public ID.
// - Pass the Asset public ID selected for the avatar.
// - Support clearing the avatar by sending null.
//
// Non-responsibilities:
// - Uploading the Asset.
// - Resolving the Asset URL.
// - Validating Asset ownership.
// - Managing TravellerProfile state.
// - Managing UI state.
//
// Those concerns belong to their respective feature boundaries.
//
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/authentication/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$http$2f$authenticated$2d$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/authentication/http/authenticated-api-client.ts [app-client] (ecmascript)");
;
const TRAVELLER_PROFILES_PATH = '/traveller-profiles';
async function changeTravellerProfileAvatar(travellerProfileId, input) {
    const encodedTravellerProfileId = encodeURIComponent(travellerProfileId);
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$http$2f$authenticated$2d$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authenticatedApiClient"].patch(`${TRAVELLER_PROFILES_PATH}/${encodedTravellerProfileId}/avatar`, {
        avatarAssetPublicId: input.avatarAssetPublicId
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/traveller-profile/api/create-travel-corridor.api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createTravelCorridor",
    ()=>createTravelCorridor
]);
// -----------------------------------------------------------------------------
// sisiMove — Create Travel Corridor API
// -----------------------------------------------------------------------------
//
// Authenticated HTTP operation for creating a Traveller Profile travel
// corridor.
//
// Backend route:
//
//   POST /traveller-profiles/:travellerProfileId/corridors
//
// IMPORTANT
// -----------------------------------------------------------------------------
//
// This API module is a thin HTTP adapter around the Traveller Profile
// application command:
//
//   CreateTravellerProfileCorridorCommand
//
// It does NOT:
//
// - determine the current identity;
// - determine Traveller Profile ownership;
// - perform authorization;
// - calculate coordinates;
// - normalize corridor names;
// - determine corridor matching behavior;
// - enforce domain rules;
// - update other Traveller Profile data.
//
// Authentication is provided by authenticatedApiClient.
//
// The backend remains authoritative for authentication, authorization,
// ownership, validation, persistence, and corridor business rules.
//
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// Authentication — Authenticated HTTP
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/authentication/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$http$2f$authenticated$2d$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/authentication/http/authenticated-api-client.ts [app-client] (ecmascript)");
;
// =============================================================================
// Constants
// =============================================================================
/**
 * Base route for the Traveller Profile HTTP controller.
 *
 * NestJS:
 *
 *     @Controller('traveller-profiles')
 */ const TRAVELLER_PROFILES_PATH = '/traveller-profiles';
async function createTravelCorridor(travellerProfileId, input) {
    const encodedTravellerProfileId = encodeURIComponent(travellerProfileId);
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$http$2f$authenticated$2d$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authenticatedApiClient"].post(`${TRAVELLER_PROFILES_PATH}/${encodedTravellerProfileId}/corridors`, {
        originName: input.originName,
        destinationName: input.destinationName,
        originLatitude: input.originLatitude,
        originLongitude: input.originLongitude,
        destinationLatitude: input.destinationLatitude,
        destinationLongitude: input.destinationLongitude,
        corridorKey: input.corridorKey,
        isPrimary: input.isPrimary
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/traveller-profile/api/delete-travel-corridor.api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "deleteTravelCorridor",
    ()=>deleteTravelCorridor
]);
// -----------------------------------------------------------------------------
// sisiMove — Delete Travel Corridor API
// -----------------------------------------------------------------------------
//
// Authenticated HTTP operation for deleting an existing Traveller Profile
// travel corridor.
//
// Backend route:
//
//   DELETE /traveller-profiles/:travellerProfileId/corridors/:corridorId
//
// IMPORTANT
// -----------------------------------------------------------------------------
//
// This API module is a thin HTTP adapter around the Traveller Profile
// application command.
//
// It does NOT:
//
// - determine the current identity;
// - determine Traveller Profile ownership;
// - perform authorization;
// - apply corridor business rules;
// - update Traveller Profile preferences;
// - manage Traveller Profile visibility.
//
// Authentication is provided by authenticatedApiClient.
//
// The backend remains authoritative for authentication, authorization,
// ownership, validation, persistence, and domain behavior.
//
// The current backend controller returns no response body for this mutation.
// Therefore this API function returns `void`.
//
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// Authentication — Authenticated HTTP
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/authentication/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$http$2f$authenticated$2d$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/authentication/http/authenticated-api-client.ts [app-client] (ecmascript)");
;
// =============================================================================
// Constants
// =============================================================================
/**
 * Base route for the Traveller Profile HTTP controller.
 *
 * NestJS:
 *
 *     @Controller('traveller-profiles')
 */ const TRAVELLER_PROFILES_PATH = '/traveller-profiles';
async function deleteTravelCorridor(travellerProfileId, corridorId) {
    const encodedTravellerProfileId = encodeURIComponent(travellerProfileId);
    const encodedCorridorId = encodeURIComponent(corridorId);
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$http$2f$authenticated$2d$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authenticatedApiClient"].delete(`${TRAVELLER_PROFILES_PATH}/${encodedTravellerProfileId}/corridors/${encodedCorridorId}`);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/traveller-profile/api/get-travel-corridors.api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getTravelCorridors",
    ()=>getTravelCorridors
]);
// -----------------------------------------------------------------------------
// sisiMove — Get Travel Corridors API
// -----------------------------------------------------------------------------
//
// Authenticated HTTP operation for retrieving the Traveller Profile's
// frequent travel corridors.
//
// Backend route:
//
//   GET /traveller-profiles/:travellerProfileId/corridors
//
// IMPORTANT
// -----------------------------------------------------------------------------
//
// This API module is a thin HTTP adapter around the Traveller Profile
// application query:
//
//   GetTravellerProfileCorridorsQuery
//
// It does NOT:
//
// - determine the current identity;
// - determine Traveller Profile ownership;
// - perform authorization;
// - calculate corridors;
// - apply matching logic;
// - determine the primary corridor;
// - construct domain entities;
// - modify Traveller Profile state.
//
// Authentication is provided by authenticatedApiClient.
//
// The backend remains authoritative for authentication, authorization,
// ownership, validation, persistence, and corridor behavior.
//
// Empty collection:
//
//   []
//
// is a valid successful response and means that the Traveller Profile
// currently has no configured travel corridors.
//
// The presentation layer is responsible for the appropriate empty state.
//
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// Authentication — Authenticated HTTP
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/authentication/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$http$2f$authenticated$2d$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/authentication/http/authenticated-api-client.ts [app-client] (ecmascript)");
;
// =============================================================================
// Constants
// =============================================================================
/**
 * Base route for the Traveller Profile HTTP controller.
 *
 * NestJS:
 *
 *     @Controller('traveller-profiles')
 */ const TRAVELLER_PROFILES_PATH = '/traveller-profiles';
async function getTravelCorridors(travellerProfileId) {
    const encodedTravellerProfileId = encodeURIComponent(travellerProfileId);
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$http$2f$authenticated$2d$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authenticatedApiClient"].get(`${TRAVELLER_PROFILES_PATH}/${encodedTravellerProfileId}/corridors`);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/traveller-profile/api/get-travel-preferences.api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getTravelPreferences",
    ()=>getTravelPreferences
]);
// -----------------------------------------------------------------------------
// sisiMove — Get Travel Preferences API
// -----------------------------------------------------------------------------
//
// Authenticated HTTP operation for retrieving the Traveller Profile's travel
// preferences.
//
// Backend route:
//
//   GET /traveller-profiles/:travellerProfileId/preferences
//
// IMPORTANT
// -----------------------------------------------------------------------------
//
// This API module is a thin HTTP adapter.
//
// It does NOT:
//
// - determine the current identity;
// - determine Traveller Profile ownership;
// - perform authorization;
// - construct domain entities;
// - apply preference defaults;
// - manage profile updates;
// - manage travel corridors.
//
// Authentication is provided by authenticatedApiClient.
//
// The backend remains authoritative for authentication, authorization,
// ownership, persistence, and preference behavior.
//
// Empty preferences:
//
//   null
//
// is a valid response according to the current backend controller contract.
// It means the Traveller Profile does not currently have a persisted
// TravellerProfilePreferences record.
//
// The presentation layer decides how that state should be displayed.
//
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// Authentication — Authenticated HTTP
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/authentication/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$http$2f$authenticated$2d$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/authentication/http/authenticated-api-client.ts [app-client] (ecmascript)");
;
// =============================================================================
// Constants
// =============================================================================
/**
 * Base route for the Traveller Profile HTTP controller.
 *
 * NestJS:
 *
 *     @Controller('traveller-profiles')
 */ const TRAVELLER_PROFILES_PATH = '/traveller-profiles';
async function getTravelPreferences(travellerProfileId) {
    const encodedTravellerProfileId = encodeURIComponent(travellerProfileId);
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$http$2f$authenticated$2d$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authenticatedApiClient"].get(`${TRAVELLER_PROFILES_PATH}/${encodedTravellerProfileId}/preferences`);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/traveller-profile/api/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// -----------------------------------------------------------------------------
// sisiMove — Traveller Profile API
// -----------------------------------------------------------------------------
//
// Public API barrel for the Traveller Profile feature.
//
// Consumers should import Traveller Profile API operations through this barrel
// instead of depending on individual implementation files.
//
// Public operations:
//
// - retrieve the current authenticated Traveller Profile;
// - retrieve a public Traveller Profile by Traveller Profile public ID;
// - retrieve a public Traveller Profile by Member public ID;
// - retrieve a public Traveller Profile by Traveller handle.
//
// Boundary:
//
//   Public operations
//       ↓
//   Public Traveller Profile REST boundary
//
//   Authenticated current-traveller operation
//       ↓
//   Authenticated Traveller Profile REST boundary
//
// The barrel intentionally exposes only operations backed by explicit
// Traveller Profile REST read boundaries.
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$api$2f$traveller$2d$profile$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/traveller-profile/api/traveller-profile.api.ts [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// sisiMove — Traveller Profile API
// -----------------------------------------------------------------------------
//
// Public API barrel for authenticated Traveller Profile HTTP operations.
//
// This file only re-exports API adapters. It contains no business logic,
// HTTP configuration, validation, or domain behavior.
//
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// Profile
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$api$2f$update$2d$traveller$2d$profile$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/traveller-profile/api/update-traveller-profile.api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$api$2f$update$2d$profile$2d$visibility$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/traveller-profile/api/update-profile-visibility.api.ts [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// Travel Preferences
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$api$2f$get$2d$travel$2d$preferences$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/traveller-profile/api/get-travel-preferences.api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$api$2f$update$2d$travel$2d$preferences$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/traveller-profile/api/update-travel-preferences.api.ts [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// Travel Corridors
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$api$2f$get$2d$travel$2d$corridors$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/traveller-profile/api/get-travel-corridors.api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$api$2f$create$2d$travel$2d$corridor$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/traveller-profile/api/create-travel-corridor.api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$api$2f$update$2d$travel$2d$corridor$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/traveller-profile/api/update-travel-corridor.api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$api$2f$delete$2d$travel$2d$corridor$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/traveller-profile/api/delete-travel-corridor.api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$api$2f$change$2d$traveller$2d$profile$2d$avatar$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/traveller-profile/api/change-traveller-profile-avatar.api.ts [app-client] (ecmascript)");
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
"[project]/src/features/traveller-profile/api/traveller-profile.api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getCurrentTravellerProfile",
    ()=>getCurrentTravellerProfile,
    "getTravellerProfileByHandle",
    ()=>getTravellerProfileByHandle,
    "getTravellerProfileByMemberPublicId",
    ()=>getTravellerProfileByMemberPublicId,
    "getTravellerProfileByPublicId",
    ()=>getTravellerProfileByPublicId
]);
// -----------------------------------------------------------------------------
// sisiMove — Traveller Profile API
// -----------------------------------------------------------------------------
//
// Frontend API adapter for Traveller Profile read boundaries.
//
// This adapter deliberately separates:
//
//   1. Public Traveller Profile reads
//   2. Authenticated current-Traveller Profile reads
//
// Public reads return the reduced PublicTraveller model.
//
// The authenticated `/me` read returns the complete authenticated
// TravellerProfile model required by the Profile UI.
//
// Architectural boundary:
//
//   Backend Traveller Profile API
//              ↓
//   REST response
//              ↓
//   This API adapter
//              ↓
//   Frontend Traveller Profile model
//              ↓
//   UI
//
// The frontend does not consume:
//
// - TravellerProfile domain entities;
// - Prisma models;
// - internal database IDs;
// - Identity domain objects;
// - backend domain value objects.
//
// Asset rule:
//
// The backend owns Asset URL resolution.
//
// Public Traveller endpoints return a resolved public avatar:
//
//     avatar: {
//       publicId,
//       url,
//       alt
//     }
//
// The authenticated `/me` endpoint currently returns:
//
//     avatarAssetPublicId
//
// as an opaque Asset reference.
//
// Therefore the authenticated TravellerProfile model intentionally retains
// `avatarAssetPublicId` rather than constructing a URL. The Profile UI may
// resolve that public Asset through the dedicated Assets feature when it needs
// to display the avatar.
//
// Authentication rule:
//
// Public Traveller Profile endpoints use the generic `apiClient` because they
// do not require an authenticated session.
//
// The authenticated `/me` endpoint uses `authenticatedApiClient` because the
// backend derives the current Traveller Profile from the authenticated
// Identity represented by the Bearer access token.
//
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$http$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/http/api-client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/authentication/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$http$2f$authenticated$2d$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/authentication/http/authenticated-api-client.ts [app-client] (ecmascript)");
;
;
// =============================================================================
// API Paths
// =============================================================================
const TRAVELLER_PROFILE_API_PATH = '/traveller-profiles';
async function getCurrentTravellerProfile() {
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$http$2f$authenticated$2d$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authenticatedApiClient"].get(`${TRAVELLER_PROFILE_API_PATH}/me`);
    if (response === null) {
        throw new Error('Authenticated Traveller Profile was not found.');
    }
    return mapCurrentTravellerProfileResponse(response);
}
async function getTravellerProfileByPublicId(travellerProfilePublicId) {
    const normalizedPublicId = travellerProfilePublicId.trim();
    if (normalizedPublicId.length === 0) {
        throw new Error('Traveller profile public ID is required.');
    }
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$http$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].get(`${TRAVELLER_PROFILE_API_PATH}/public/${encodeURIComponent(normalizedPublicId)}`);
    return response === null ? null : mapPublicTravellerResponse(response);
}
async function getTravellerProfileByMemberPublicId(memberPublicId) {
    const normalizedMemberPublicId = memberPublicId.trim();
    if (normalizedMemberPublicId.length === 0) {
        throw new Error('Member public ID is required.');
    }
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$http$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].get(`${TRAVELLER_PROFILE_API_PATH}/public/member/${encodeURIComponent(normalizedMemberPublicId)}`);
    return response === null ? null : mapPublicTravellerResponse(response);
}
async function getTravellerProfileByHandle(handle) {
    const normalizedHandle = handle.trim();
    if (normalizedHandle.length === 0) {
        throw new Error('Traveller handle is required.');
    }
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$http$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].get(`${TRAVELLER_PROFILE_API_PATH}/public/handle/${encodeURIComponent(normalizedHandle)}`);
    return response === null ? null : mapPublicTravellerResponse(response);
}
// =============================================================================
// Authenticated Traveller Profile Mapper
// =============================================================================
/**
 * Map the authenticated `/me` transport representation into the frontend
 * TravellerProfile model.
 *
 * Important:
 *
 * `avatarAssetPublicId` remains an opaque Asset reference.
 *
 * This mapper does NOT construct an Asset URL.
 *
 * The Assets feature remains responsible for public Asset retrieval when the
 * authenticated UI needs to render the avatar.
 */ function mapCurrentTravellerProfileResponse(response) {
    return {
        publicId: response.publicId,
        memberPublicId: response.memberPublicId,
        handle: response.handle,
        bio: response.bio,
        avatarAssetPublicId: response.avatarAssetPublicId,
        countryCode: response.countryCode,
        status: mapTravellerProfileStatus(response.status),
        visibility: mapTravellerProfileVisibility(response.visibility),
        totalJourneys: response.totalJourneys,
        completedJourneys: response.completedJourneys,
        providerJourneys: response.providerJourneys,
        passengerJourneys: response.passengerJourneys,
        completedProviderJourneys: response.completedProviderJourneys,
        completedPassengerJourneys: response.completedPassengerJourneys,
        preferences: response.preferences === null ? null : mapTravellerProfilePreferencesResponse(response.preferences),
        corridors: response.corridors.map(mapTravellerProfileCorridorResponse),
        createdAt: response.createdAt,
        updatedAt: response.updatedAt
    };
}
// =============================================================================
// Authenticated Traveller Profile Value Mappers
// =============================================================================
/**
 * Keep backend status values constrained to the frontend model.
 *
 * The backend currently serializes the enum as a string. We validate the
 * transport value at this adapter boundary instead of spreading arbitrary
 * strings through the application.
 */ function mapTravellerProfileStatus(status) {
    switch(status){
        case 'ACTIVE':
        case 'RESTRICTED':
        case 'SUSPENDED':
        case 'CLOSED':
            return status;
        default:
            throw new Error(`Unsupported Traveller Profile status received: ${status}`);
    }
}
/**
 * Keep backend visibility values constrained to the frontend model.
 */ function mapTravellerProfileVisibility(visibility) {
    switch(visibility){
        case 'PUBLIC':
        case 'LIMITED':
        case 'PRIVATE':
            return visibility;
        default:
            throw new Error(`Unsupported Traveller Profile visibility received: ${visibility}`);
    }
}
function mapTravellerProfilePreferencesResponse(response) {
    return {
        publicId: response.publicId,
        profileId: response.profileId,
        showJourneyHistory: response.showJourneyHistory,
        showJourneyStatistics: response.showJourneyStatistics,
        allowJourneyInvites: response.allowJourneyInvites,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt
    };
}
function mapTravellerProfileCorridorResponse(response) {
    return {
        publicId: response.publicId,
        profileId: response.profileId,
        originName: response.originName,
        destinationName: response.destinationName,
        originLatitude: response.originLatitude,
        originLongitude: response.originLongitude,
        destinationLatitude: response.destinationLatitude,
        destinationLongitude: response.destinationLongitude,
        corridorKey: response.corridorKey,
        isPrimary: response.isPrimary,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt
    };
}
// =============================================================================
// Public Traveller Profile Mapper
// =============================================================================
/**
 * Map the backend public Traveller Profile transport representation into the
 * frontend PublicTraveller model.
 *
 * This is transport-to-frontend mapping only.
 *
 * It does not:
 *
 * - apply Traveller Profile business rules;
 * - reconstruct omitted backend information;
 * - resolve Assets;
 * - infer private profile information;
 * - construct URLs.
 */ function mapPublicTravellerResponse(response) {
    return {
        publicId: response.publicId,
        handle: response.handle,
        bio: response.bio,
        avatar: response.avatar === null ? null : mapPublicTravellerAvatarResponse(response.avatar),
        countryCode: response.countryCode
    };
}
// =============================================================================
// Public Traveller Avatar Mapper
// =============================================================================
/**
 * Map the backend public avatar representation into the public avatar model.
 *
 * The URL is supplied by the backend public read boundary.
 *
 * No URL is constructed from the avatar public ID.
 */ function mapPublicTravellerAvatarResponse(response) {
    return {
        publicId: response.publicId,
        url: response.url,
        alt: response.alt
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/traveller-profile/api/update-profile-visibility.api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "updateProfileVisibility",
    ()=>updateProfileVisibility
]);
// -----------------------------------------------------------------------------
// sisiMove — Update Profile Visibility API
// -----------------------------------------------------------------------------
//
// Authenticated HTTP operation for changing the visibility of the currently
// authenticated traveller's Traveller Profile.
//
// Backend route:
//
//   PATCH /traveller-profiles/:travellerProfileId/visibility
//
// IMPORTANT
// -----------------------------------------------------------------------------
//
// The backend exposes visibility as a dedicated Traveller Profile command.
//
// Therefore this API module does NOT:
//
// - determine the current identity;
// - determine Traveller Profile ownership;
// - perform authorization;
// - recreate visibility rules;
// - update other Traveller Profile fields;
// - manage travel preferences;
// - manage travel corridors;
// - manage verification.
//
// The authenticated API client supplies the access token.
//
// The backend remains authoritative for authentication, authorization,
// validation, ownership, persistence, and domain behavior.
//
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// Authentication — Authenticated HTTP
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/authentication/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$http$2f$authenticated$2d$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/authentication/http/authenticated-api-client.ts [app-client] (ecmascript)");
;
// =============================================================================
// Constants
// =============================================================================
/**
 * Base route for the Traveller Profile HTTP controller.
 *
 * NestJS:
 *
 *     @Controller('traveller-profiles')
 */ const TRAVELLER_PROFILES_PATH = '/traveller-profiles';
async function updateProfileVisibility(travellerProfileId, input) {
    const encodedTravellerProfileId = encodeURIComponent(travellerProfileId);
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$http$2f$authenticated$2d$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authenticatedApiClient"].patch(`${TRAVELLER_PROFILES_PATH}/${encodedTravellerProfileId}/visibility`, {
        visibility: input.visibility
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/traveller-profile/api/update-travel-corridor.api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "updateTravelCorridor",
    ()=>updateTravelCorridor
]);
// -----------------------------------------------------------------------------
// sisiMove — Update Travel Corridor API
// -----------------------------------------------------------------------------
//
// Authenticated HTTP operation for updating an existing Traveller Profile
// travel corridor.
//
// Backend route:
//
//   PATCH /traveller-profiles/:travellerProfileId/corridors/:corridorId
//
// IMPORTANT
// -----------------------------------------------------------------------------
//
// This API module is a thin HTTP adapter around the Traveller Profile
// application command.
//
// It does NOT:
//
// - determine the current identity;
// - determine Traveller Profile ownership;
// - perform authorization;
// - calculate coordinates;
// - normalize corridor names;
// - apply corridor business rules;
// - manage Traveller Profile preferences;
// - manage Traveller Profile visibility.
//
// Authentication is provided by authenticatedApiClient.
//
// The backend remains authoritative for authentication, authorization,
// ownership, validation, persistence, and corridor business rules.
//
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// Authentication — Authenticated HTTP
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/authentication/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$http$2f$authenticated$2d$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/authentication/http/authenticated-api-client.ts [app-client] (ecmascript)");
;
// =============================================================================
// Constants
// =============================================================================
/**
 * Base route for the Traveller Profile HTTP controller.
 *
 * NestJS:
 *
 *     @Controller('traveller-profiles')
 */ const TRAVELLER_PROFILES_PATH = '/traveller-profiles';
async function updateTravelCorridor(travellerProfileId, corridorId, input) {
    const encodedTravellerProfileId = encodeURIComponent(travellerProfileId);
    const encodedCorridorId = encodeURIComponent(corridorId);
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$http$2f$authenticated$2d$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authenticatedApiClient"].patch(`${TRAVELLER_PROFILES_PATH}/${encodedTravellerProfileId}/corridors/${encodedCorridorId}`, {
        originName: input.originName,
        destinationName: input.destinationName,
        originLatitude: input.originLatitude,
        originLongitude: input.originLongitude,
        destinationLatitude: input.destinationLatitude,
        destinationLongitude: input.destinationLongitude,
        corridorKey: input.corridorKey,
        isPrimary: input.isPrimary
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/traveller-profile/api/update-travel-preferences.api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "updateTravelPreferences",
    ()=>updateTravelPreferences
]);
// -----------------------------------------------------------------------------
// sisiMove — Update Travel Preferences API
// -----------------------------------------------------------------------------
//
// Authenticated HTTP operation for updating the Traveller Profile's travel
// preferences.
//
// Backend route:
//
//   PATCH /traveller-profiles/:travellerProfileId/preferences
//
// IMPORTANT
// -----------------------------------------------------------------------------
//
// This API module is a thin HTTP adapter around the existing Traveller
// Profile application command:
//
//   ChangeTravellerProfilePreferencesCommand
//
// It does NOT:
//
// - determine the current identity;
// - determine Traveller Profile ownership;
// - perform authorization;
// - apply business rules;
// - manage profile visibility;
// - manage travel corridors;
// - create or remove the preferences entity.
//
// Authentication is provided by authenticatedApiClient.
//
// The backend remains authoritative for authentication, authorization,
// ownership, validation, persistence, and domain behavior.
//
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// Authentication — Authenticated HTTP
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/authentication/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$http$2f$authenticated$2d$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/authentication/http/authenticated-api-client.ts [app-client] (ecmascript)");
;
// =============================================================================
// Constants
// =============================================================================
/**
 * Base route for the Traveller Profile HTTP controller.
 *
 * NestJS:
 *
 *     @Controller('traveller-profiles')
 */ const TRAVELLER_PROFILES_PATH = '/traveller-profiles';
async function updateTravelPreferences(travellerProfileId, input) {
    const encodedTravellerProfileId = encodeURIComponent(travellerProfileId);
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$http$2f$authenticated$2d$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authenticatedApiClient"].patch(`${TRAVELLER_PROFILES_PATH}/${encodedTravellerProfileId}/preferences`, {
        showJourneyHistory: input.showJourneyHistory,
        showJourneyStatistics: input.showJourneyStatistics,
        allowJourneyInvites: input.allowJourneyInvites
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/traveller-profile/api/update-traveller-profile.api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "updateTravellerProfile",
    ()=>updateTravellerProfile
]);
// -----------------------------------------------------------------------------
// sisiMove — Update Traveller Profile API
// -----------------------------------------------------------------------------
//
// Authenticated HTTP operations for updating the currently authenticated
// traveller's editable profile fields.
//
// Backend routes:
//
//   PATCH /traveller-profiles/:travellerProfileId/handle
//   PATCH /traveller-profiles/:travellerProfileId/bio
//   PATCH /traveller-profiles/:travellerProfileId/avatar
//   PATCH /traveller-profiles/:travellerProfileId/country
//
// IMPORTANT
// -----------------------------------------------------------------------------
//
// The backend currently exposes profile-field mutations as separate commands.
// Therefore this API module does NOT invent:
//
//   PATCH /traveller-profiles/me
//
// Each changed field is delegated to its corresponding backend command
// endpoint.
//
// Authentication, authorization, ownership, validation, and domain rules
// remain backend responsibilities.
//
// This module does NOT:
//
// - determine the current identity;
// - determine Traveller Profile ownership;
// - perform authorization;
// - recreate domain validation;
// - manage profile visibility;
// - manage preferences;
// - manage verification;
// - manage travel corridors.
//
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// Authentication — Authenticated HTTP
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/authentication/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$http$2f$authenticated$2d$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/authentication/http/authenticated-api-client.ts [app-client] (ecmascript)");
;
// =============================================================================
// Constants
// =============================================================================
/**
 * Base route for the Traveller Profile HTTP controller.
 *
 * NestJS:
 *
 *     @Controller('traveller-profiles')
 */ const TRAVELLER_PROFILES_PATH = '/traveller-profiles';
async function updateTravellerProfile(travellerProfileId, input) {
    const encodedTravellerProfileId = encodeURIComponent(travellerProfileId);
    if (input.handle !== undefined) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$http$2f$authenticated$2d$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authenticatedApiClient"].patch(`${TRAVELLER_PROFILES_PATH}/${encodedTravellerProfileId}/handle`, {
            handle: input.handle
        });
    }
    if (input.bio !== undefined) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$http$2f$authenticated$2d$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authenticatedApiClient"].patch(`${TRAVELLER_PROFILES_PATH}/${encodedTravellerProfileId}/bio`, {
            bio: input.bio
        });
    }
    if (input.countryCode !== undefined) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$http$2f$authenticated$2d$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authenticatedApiClient"].patch(`${TRAVELLER_PROFILES_PATH}/${encodedTravellerProfileId}/country`, {
            countryCode: input.countryCode
        });
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/traveller-profile/hooks/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// -----------------------------------------------------------------------------
// sisiMove — Traveller Profile Hooks
// -----------------------------------------------------------------------------
//
// Public hook barrel for the Traveller Profile feature.
//
// Consumers should import hooks through this barrel rather than depending on
// individual implementation files.
//
// Hooks:
//
// - useTravellerProfile()
//     Public Traveller Profile lookup by public ID, member public ID, or
//     traveller handle.
//
// - useCurrentTravellerProfile()
//     Authenticated lookup of the Traveller Profile belonging to the current
//     authenticated Identity.
//
// The two hooks intentionally remain separate because they represent
// different backend read boundaries.
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$hooks$2f$use$2d$traveller$2d$profile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/traveller-profile/hooks/use-traveller-profile.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$hooks$2f$use$2d$current$2d$traveller$2d$profile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/traveller-profile/hooks/use-current-traveller-profile.ts [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// sisiMove — Traveller Profile Hooks
// -----------------------------------------------------------------------------
//
// Public barrel for Traveller Profile React hooks.
//
// This file only re-exports hooks. It contains no React state, API calls,
// business logic, validation, or transformation.
//
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// Traveller Profile
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$hooks$2f$use$2d$update$2d$traveller$2d$profile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/traveller-profile/hooks/use-update-traveller-profile.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$hooks$2f$use$2d$update$2d$profile$2d$visibility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/traveller-profile/hooks/use-update-profile-visibility.ts [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// Travel Preferences
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$hooks$2f$use$2d$travel$2d$preferences$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/traveller-profile/hooks/use-travel-preferences.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$hooks$2f$use$2d$update$2d$travel$2d$preferences$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/traveller-profile/hooks/use-update-travel-preferences.ts [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// Travel Corridors
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$hooks$2f$use$2d$travel$2d$corridors$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/traveller-profile/hooks/use-travel-corridors.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$hooks$2f$use$2d$create$2d$travel$2d$corridor$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/traveller-profile/hooks/use-create-travel-corridor.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$hooks$2f$use$2d$update$2d$travel$2d$corridor$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/traveller-profile/hooks/use-update-travel-corridor.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$hooks$2f$use$2d$delete$2d$travel$2d$corridor$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/traveller-profile/hooks/use-delete-travel-corridor.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$hooks$2f$use$2d$traveller$2d$profile$2d$avatar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/traveller-profile/hooks/use-traveller-profile-avatar.ts [app-client] (ecmascript)");
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
"[project]/src/features/traveller-profile/hooks/use-create-travel-corridor.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCreateTravelCorridor",
    ()=>useCreateTravelCorridor
]);
// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/traveller-profile/api/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$api$2f$create$2d$travel$2d$corridor$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/traveller-profile/api/create-travel-corridor.api.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
// -----------------------------------------------------------------------------
// sisiMove — Use Create Travel Corridor
// -----------------------------------------------------------------------------
//
// React hook for creating a Traveller Profile travel corridor.
//
// Responsibilities:
// - Execute the travel corridor creation operation.
// - Expose mutation loading and error state.
// - Return the created corridor.
// - Provide a reset operation.
//
// Non-responsibilities:
// - HTTP configuration.
// - Authentication/token handling.
// - Authorization.
// - Domain validation.
// - Profile ownership checks.
// - Rendering or navigation.
//
// HTTP concerns remain in:
//     ../api/create-travel-corridor.api.ts
//
// -----------------------------------------------------------------------------
'use client';
;
;
function useCreateTravelCorridor() {
    _s();
    const [isCreating, setIsCreating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const create = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useCreateTravelCorridor.useCallback[create]": async (travellerProfileId, input)=>{
            setIsCreating(true);
            setError(null);
            try {
                return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$api$2f$create$2d$travel$2d$corridor$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createTravelCorridor"])(travellerProfileId, input);
            } catch (cause) {
                const normalizedError = cause instanceof Error ? cause : new Error('Failed to create travel corridor.');
                setError(normalizedError);
                throw normalizedError;
            } finally{
                setIsCreating(false);
            }
        }
    }["useCreateTravelCorridor.useCallback[create]"], []);
    const reset = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useCreateTravelCorridor.useCallback[reset]": ()=>{
            setError(null);
        }
    }["useCreateTravelCorridor.useCallback[reset]"], []);
    return {
        create,
        isCreating,
        error,
        reset
    };
}
_s(useCreateTravelCorridor, "7Ur6cJH/9MNFuR6ZjrZ4GrjUV6M=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/traveller-profile/hooks/use-current-traveller-profile.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "useCurrentTravellerProfile",
    ()=>useCurrentTravellerProfile
]);
// -----------------------------------------------------------------------------
// TanStack Query
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/traveller-profile/api/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$api$2f$traveller$2d$profile$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/traveller-profile/api/traveller-profile.api.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
// -----------------------------------------------------------------------------
// sisiMove — Current Traveller Profile Hook
// -----------------------------------------------------------------------------
//
// React hook for consuming the authenticated current Traveller Profile read
// boundary.
//
// This hook is intentionally separate from `useTravellerProfile()`.
//
// Public Traveller:
//
//   useTravellerProfile()
//       ↓
//   Public Traveller Profile API
//       ↓
//   PublicTraveller
//
// Authenticated current Traveller:
//
//   useCurrentTravellerProfile()
//       ↓
//   GET /traveller-profiles/me
//       ↓
//   TravellerProfile
//
// The authenticated API determines the current Traveller from the access
// token. The frontend therefore never supplies:
//
// - identityPublicId;
// - memberPublicId;
// - travellerProfilePublicId;
// - travellerHandle.
//
// The backend resolves the current Identity and uses its public identifier
// to locate TravellerProfile.
//
// Responsibilities:
//
// - expose the authenticated TravellerProfile as TanStack Query state;
// - provide a stable query key;
// - keep HTTP concerns inside the API adapter;
// - keep server state outside presentation components.
//
// This hook does not:
//
// - access the backend directly;
// - construct Asset URLs;
// - know backend transport DTOs;
// - access Prisma/domain entities;
// - infer the current Traveller from AuthSession;
// - contain Traveller Profile business rules.
//
// -----------------------------------------------------------------------------
'use client';
;
;
// -----------------------------------------------------------------------------
// Query Key
// -----------------------------------------------------------------------------
const CURRENT_TRAVELLER_PROFILE_QUERY_KEY = [
    'traveller-profile',
    'me'
];
function useCurrentTravellerProfile() {
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: CURRENT_TRAVELLER_PROFILE_QUERY_KEY,
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$api$2f$traveller$2d$profile$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentTravellerProfile"],
        staleTime: 5 * 60 * 1000
    });
}
_s(useCurrentTravellerProfile, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
const __TURBOPACK__default__export__ = useCurrentTravellerProfile;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/traveller-profile/hooks/use-delete-travel-corridor.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useDeleteTravelCorridor",
    ()=>useDeleteTravelCorridor
]);
// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/traveller-profile/api/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$api$2f$delete$2d$travel$2d$corridor$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/traveller-profile/api/delete-travel-corridor.api.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
// -----------------------------------------------------------------------------
// sisiMove — Use Delete Travel Corridor
// -----------------------------------------------------------------------------
//
// React hook for deleting an existing Traveller Profile travel corridor.
//
// Responsibilities:
// - Execute the travel corridor deletion operation.
// - Expose mutation loading and error state.
// - Provide a reset operation.
//
// Non-responsibilities:
// - HTTP configuration.
// - Authentication/token handling.
// - Authorization.
// - Domain validation.
// - Profile ownership checks.
// - Rendering or navigation.
//
// HTTP concerns remain in:
//     ../api/delete-travel-corridor.api.ts
//
// -----------------------------------------------------------------------------
'use client';
;
;
function useDeleteTravelCorridor() {
    _s();
    const [isDeleting, setIsDeleting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const remove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useDeleteTravelCorridor.useCallback[remove]": async (travellerProfileId, corridorId)=>{
            setIsDeleting(true);
            setError(null);
            try {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$api$2f$delete$2d$travel$2d$corridor$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteTravelCorridor"])(travellerProfileId, corridorId);
            } catch (cause) {
                const normalizedError = cause instanceof Error ? cause : new Error('Failed to delete travel corridor.');
                setError(normalizedError);
                throw normalizedError;
            } finally{
                setIsDeleting(false);
            }
        }
    }["useDeleteTravelCorridor.useCallback[remove]"], []);
    const reset = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useDeleteTravelCorridor.useCallback[reset]": ()=>{
            setError(null);
        }
    }["useDeleteTravelCorridor.useCallback[reset]"], []);
    return {
        remove,
        isDeleting,
        error,
        reset
    };
}
_s(useDeleteTravelCorridor, "fbV5lHXd/pQHAQvgqbXwWlZ+1pg=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/traveller-profile/hooks/use-travel-corridors.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useTravelCorridors",
    ()=>useTravelCorridors
]);
// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/traveller-profile/api/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$api$2f$get$2d$travel$2d$corridors$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/traveller-profile/api/get-travel-corridors.api.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
// -----------------------------------------------------------------------------
// sisiMove — Use Travel Corridors
// -----------------------------------------------------------------------------
//
// React hook for retrieving a Traveller Profile's travel corridors.
//
// Responsibilities:
// - Load travel corridors.
// - Expose loading, error, and data state.
// - Provide a reload operation.
//
// Non-responsibilities:
// - HTTP configuration.
// - Authentication/token handling.
// - Corridor creation.
// - Corridor updates.
// - Corridor deletion.
// - Domain validation.
// - Rendering or navigation.
//
// HTTP concerns remain in:
//     ../api/get-travel-corridors.api.ts
//
// -----------------------------------------------------------------------------
'use client';
;
;
function useTravelCorridors(travellerProfileId) {
    _s();
    const [corridors, setCorridors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const loadCorridors = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useTravelCorridors.useCallback[loadCorridors]": async ()=>{
            setIsLoading(true);
            setError(null);
            try {
                const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$api$2f$get$2d$travel$2d$corridors$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTravelCorridors"])(travellerProfileId);
                setCorridors(result);
            } catch (cause) {
                const normalizedError = cause instanceof Error ? cause : new Error('Failed to load travel corridors.');
                setError(normalizedError);
            } finally{
                setIsLoading(false);
            }
        }
    }["useTravelCorridors.useCallback[loadCorridors]"], [
        travellerProfileId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useTravelCorridors.useEffect": ()=>{
            let cancelled = false;
            const load = {
                "useTravelCorridors.useEffect.load": async ()=>{
                    try {
                        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$api$2f$get$2d$travel$2d$corridors$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTravelCorridors"])(travellerProfileId);
                        if (cancelled) {
                            return;
                        }
                        setCorridors(result);
                        setError(null);
                    } catch (cause) {
                        if (cancelled) {
                            return;
                        }
                        const normalizedError = cause instanceof Error ? cause : new Error('Failed to load travel corridors.');
                        setError(normalizedError);
                    } finally{
                        if (!cancelled) {
                            setIsLoading(false);
                        }
                    }
                }
            }["useTravelCorridors.useEffect.load"];
            void load();
            return ({
                "useTravelCorridors.useEffect": ()=>{
                    cancelled = true;
                }
            })["useTravelCorridors.useEffect"];
        }
    }["useTravelCorridors.useEffect"], [
        travellerProfileId
    ]);
    return {
        corridors,
        isLoading,
        error,
        reload: loadCorridors
    };
}
_s(useTravelCorridors, "wpy5iBHP6pfHbq3i+zFV/rOa6QE=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/traveller-profile/hooks/use-travel-preferences.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useTravelPreferences",
    ()=>useTravelPreferences
]);
// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/traveller-profile/api/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$api$2f$get$2d$travel$2d$preferences$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/traveller-profile/api/get-travel-preferences.api.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
// -----------------------------------------------------------------------------
// sisiMove — Use Travel Preferences
// -----------------------------------------------------------------------------
//
// React hook for retrieving the authenticated Traveller Profile's travel
// preferences.
//
// Responsibilities:
// - Load travel preferences.
// - Expose loading, error, and data state.
// - Provide a reload operation.
//
// Non-responsibilities:
// - HTTP configuration.
// - Authentication/token handling.
// - Preference mutation.
// - Domain validation.
// - Rendering or navigation.
//
// HTTP concerns remain in:
//     ../api/get-travel-preferences.api.ts
//
// -----------------------------------------------------------------------------
'use client';
;
;
function useTravelPreferences(travellerProfileId) {
    _s();
    const [preferences, setPreferences] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const loadPreferences = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useTravelPreferences.useCallback[loadPreferences]": async ()=>{
            setIsLoading(true);
            setError(null);
            try {
                const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$api$2f$get$2d$travel$2d$preferences$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTravelPreferences"])(travellerProfileId);
                setPreferences(result);
            } catch (cause) {
                const normalizedError = cause instanceof Error ? cause : new Error('Failed to load travel preferences.');
                setError(normalizedError);
            } finally{
                setIsLoading(false);
            }
        }
    }["useTravelPreferences.useCallback[loadPreferences]"], [
        travellerProfileId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useTravelPreferences.useEffect": ()=>{
            let cancelled = false;
            const load = {
                "useTravelPreferences.useEffect.load": async ()=>{
                    try {
                        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$api$2f$get$2d$travel$2d$preferences$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTravelPreferences"])(travellerProfileId);
                        if (cancelled) {
                            return;
                        }
                        setPreferences(result);
                        setError(null);
                    } catch (cause) {
                        if (cancelled) {
                            return;
                        }
                        const normalizedError = cause instanceof Error ? cause : new Error('Failed to load travel preferences.');
                        setError(normalizedError);
                    } finally{
                        if (!cancelled) {
                            setIsLoading(false);
                        }
                    }
                }
            }["useTravelPreferences.useEffect.load"];
            void load();
            return ({
                "useTravelPreferences.useEffect": ()=>{
                    cancelled = true;
                }
            })["useTravelPreferences.useEffect"];
        }
    }["useTravelPreferences.useEffect"], [
        travellerProfileId
    ]);
    return {
        preferences,
        isLoading,
        error,
        reload: loadPreferences
    };
}
_s(useTravelPreferences, "+g/o/w966ISxlYHbe4Okmn4tpis=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/traveller-profile/hooks/use-traveller-profile-avatar.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useTravellerProfileAvatar",
    ()=>useTravellerProfileAvatar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/traveller-profile/api/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$api$2f$change$2d$traveller$2d$profile$2d$avatar$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/traveller-profile/api/change-traveller-profile-avatar.api.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
// -----------------------------------------------------------------------------
// sisiMove — Traveller Profile Avatar Hook
// -----------------------------------------------------------------------------
//
// Client-side mutation hook for changing the authenticated TravellerProfile
// avatar.
//
// Responsibilities:
// - Execute the change-avatar API operation.
// - Track mutation/loading state.
// - Expose a normalized Error state.
// - Allow callers to clear the mutation error.
//
// Non-responsibilities:
// - Uploading Assets.
// - Resolving public Asset URLs.
// - Fetching TravellerProfile data.
// - Updating local TravellerProfile state.
// - Deciding which Asset represents a profile photo.
//
// The consuming workflow owns orchestration.
//
// Typical flow:
//
// AssetUploadDialog
//       │
//       ▼
//    Asset
//       │
//       │ asset.publicId
//       ▼
// useTravellerProfileAvatar()
//       │
//       ▼
// PATCH /traveller-profiles/:id/avatar
//       │
//       ▼
// refetch TravellerProfile
//       │
//       ▼
// usePublicAsset(profile.avatarAssetPublicId)
//
// -----------------------------------------------------------------------------
'use client';
;
;
// -----------------------------------------------------------------------------
// Error normalization
// -----------------------------------------------------------------------------
function toAvatarError(error) {
    if (error instanceof Error && error.message) {
        return error;
    }
    return new Error('The profile photo could not be changed. Please try again.');
}
function useTravellerProfileAvatar() {
    _s();
    const [isChanging, setIsChanging] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const changeAvatar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useTravellerProfileAvatar.useCallback[changeAvatar]": async (travellerProfileId, input)=>{
            setIsChanging(true);
            setError(null);
            try {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$api$2f$change$2d$traveller$2d$profile$2d$avatar$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["changeTravellerProfileAvatar"])(travellerProfileId, input);
            } catch (error) {
                const normalizedError = toAvatarError(error);
                setError(normalizedError);
                throw normalizedError;
            } finally{
                setIsChanging(false);
            }
        }
    }["useTravellerProfileAvatar.useCallback[changeAvatar]"], []);
    const clearError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useTravellerProfileAvatar.useCallback[clearError]": ()=>{
            setError(null);
        }
    }["useTravellerProfileAvatar.useCallback[clearError]"], []);
    return {
        isChanging,
        error,
        changeAvatar,
        clearError
    };
}
_s(useTravellerProfileAvatar, "lzPEnUfRogUodBSSTzMUqUCoLQs=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/traveller-profile/hooks/use-traveller-profile.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "useTravellerProfile",
    ()=>useTravellerProfile
]);
// -----------------------------------------------------------------------------
// TanStack Query
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/traveller-profile/api/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$api$2f$traveller$2d$profile$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/traveller-profile/api/traveller-profile.api.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
// -----------------------------------------------------------------------------
// sisiMove — Public Traveller Profile Hook
// -----------------------------------------------------------------------------
//
// React hook for consuming the public Traveller Profile read boundary.
//
// Responsibilities:
//
// - expose a TanStack Query for a public Traveller Profile;
// - select the appropriate public API operation;
// - provide stable query-key semantics;
// - avoid duplicating HTTP or transport mapping logic;
// - keep server state outside presentation components.
//
// Architecture:
//
//   Component
//       ↓
//   useTravellerProfile()
//       ↓
//   TanStack Query
//       ↓
//   Traveller Profile API
//       ↓
//   PublicTraveller
//
// This hook consumes only the frontend-safe `PublicTraveller` model.
//
// It does not:
//
// - access the backend directly;
// - construct Asset URLs;
// - know backend response DTOs;
// - access Prisma/domain entities;
// - contain Traveller Profile business rules.
//
// -----------------------------------------------------------------------------
'use client';
;
;
// -----------------------------------------------------------------------------
// Query Key
// -----------------------------------------------------------------------------
const TRAVELLER_PROFILE_QUERY_KEY = 'traveller-profile';
function useTravellerProfile(options) {
    _s();
    const normalizedPublicId = options.publicId?.trim() ?? '';
    const normalizedMemberPublicId = options.memberPublicId?.trim() ?? '';
    const normalizedHandle = options.handle?.trim() ?? '';
    const hasPublicId = normalizedPublicId.length > 0;
    const hasMemberPublicId = normalizedMemberPublicId.length > 0;
    const hasHandle = normalizedHandle.length > 0;
    // ---------------------------------------------------------------------------
    // Deterministic lookup selection
    // ---------------------------------------------------------------------------
    //
    // Public profile ID has highest precedence, followed by member public ID,
    // followed by handle.
    //
    // `lookupType` and `lookupValue` are derived together so the query key and
    // query function always describe the same lookup operation.
    //
    // ---------------------------------------------------------------------------
    const lookupType = hasPublicId ? 'public-id' : hasMemberPublicId ? 'member-public-id' : hasHandle ? 'handle' : null;
    const lookupValue = hasPublicId ? normalizedPublicId : hasMemberPublicId ? normalizedMemberPublicId : normalizedHandle;
    const enabled = options.enabled !== false && lookupType !== null && lookupValue.length > 0;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        // -------------------------------------------------------------------------
        // Query key
        // -------------------------------------------------------------------------
        //
        // The lookup type is part of the key intentionally.
        //
        // These are different server queries:
        //
        //   ['traveller-profile', 'handle', 'ramadhan']
        //   ['traveller-profile', 'member-public-id', 'MEM-123']
        //
        // Even if they ultimately resolve to the same Traveller Profile, TanStack
        // Query should not be forced to treat the two lookup boundaries as the
        // same request.
        //
        // -------------------------------------------------------------------------
        queryKey: [
            TRAVELLER_PROFILE_QUERY_KEY,
            lookupType,
            lookupValue
        ],
        // -------------------------------------------------------------------------
        // Query function
        // -------------------------------------------------------------------------
        //
        // The API layer owns transport details and response mapping. The hook only
        // selects the appropriate public API operation.
        //
        // -------------------------------------------------------------------------
        queryFn: {
            "useTravellerProfile.useQuery": ()=>{
                if (hasPublicId) {
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$api$2f$traveller$2d$profile$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTravellerProfileByPublicId"])(normalizedPublicId);
                }
                if (hasMemberPublicId) {
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$api$2f$traveller$2d$profile$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTravellerProfileByMemberPublicId"])(normalizedMemberPublicId);
                }
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$api$2f$traveller$2d$profile$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTravellerProfileByHandle"])(normalizedHandle);
            }
        }["useTravellerProfile.useQuery"],
        enabled,
        staleTime: 5 * 60 * 1000
    });
}
_s(useTravellerProfile, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
const __TURBOPACK__default__export__ = useTravellerProfile;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/traveller-profile/hooks/use-update-profile-visibility.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useUpdateProfileVisibility",
    ()=>useUpdateProfileVisibility
]);
// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/traveller-profile/api/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$api$2f$update$2d$profile$2d$visibility$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/traveller-profile/api/update-profile-visibility.api.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
// -----------------------------------------------------------------------------
// sisiMove — Use Update Profile Visibility
// -----------------------------------------------------------------------------
//
// React hook for changing Traveller Profile visibility.
//
// Responsibilities:
// - Execute the profile visibility mutation.
// - Expose mutation loading and error state.
// - Provide a reusable reset operation.
//
// Non-responsibilities:
// - HTTP configuration.
// - Authentication/token handling.
// - Authorization.
// - Domain validation.
// - Profile ownership checks.
// - Rendering or navigation.
//
// HTTP concerns remain in:
//     ../api/update-profile-visibility.api.ts
//
// -----------------------------------------------------------------------------
'use client';
;
;
function useUpdateProfileVisibility() {
    _s();
    const [isUpdating, setIsUpdating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const update = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useUpdateProfileVisibility.useCallback[update]": async (travellerProfileId, input)=>{
            setIsUpdating(true);
            setError(null);
            try {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$api$2f$update$2d$profile$2d$visibility$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateProfileVisibility"])(travellerProfileId, input);
            } catch (cause) {
                const normalizedError = cause instanceof Error ? cause : new Error('Failed to update profile visibility.');
                setError(normalizedError);
                throw normalizedError;
            } finally{
                setIsUpdating(false);
            }
        }
    }["useUpdateProfileVisibility.useCallback[update]"], []);
    const reset = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useUpdateProfileVisibility.useCallback[reset]": ()=>{
            setError(null);
        }
    }["useUpdateProfileVisibility.useCallback[reset]"], []);
    return {
        update,
        isUpdating,
        error,
        reset
    };
}
_s(useUpdateProfileVisibility, "TlIwOWi4mCLycHfMHI2PLFGTU6Y=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/traveller-profile/hooks/use-update-travel-corridor.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useUpdateTravelCorridor",
    ()=>useUpdateTravelCorridor
]);
// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/traveller-profile/api/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$api$2f$update$2d$travel$2d$corridor$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/traveller-profile/api/update-travel-corridor.api.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
// -----------------------------------------------------------------------------
// sisiMove — Use Update Travel Corridor
// -----------------------------------------------------------------------------
//
// React hook for updating an existing Traveller Profile travel corridor.
//
// Responsibilities:
// - Execute the travel corridor update operation.
// - Expose mutation loading and error state.
// - Return the updated corridor.
// - Provide a reset operation.
//
// Non-responsibilities:
// - HTTP configuration.
// - Authentication/token handling.
// - Authorization.
// - Domain validation.
// - Profile ownership checks.
// - Rendering or navigation.
//
// HTTP concerns remain in:
//     ../api/update-travel-corridor.api.ts
//
// -----------------------------------------------------------------------------
'use client';
;
;
function useUpdateTravelCorridor() {
    _s();
    const [isUpdating, setIsUpdating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const update = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useUpdateTravelCorridor.useCallback[update]": async (travellerProfileId, corridorId, input)=>{
            setIsUpdating(true);
            setError(null);
            try {
                return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$api$2f$update$2d$travel$2d$corridor$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateTravelCorridor"])(travellerProfileId, corridorId, input);
            } catch (cause) {
                const normalizedError = cause instanceof Error ? cause : new Error('Failed to update travel corridor.');
                setError(normalizedError);
                throw normalizedError;
            } finally{
                setIsUpdating(false);
            }
        }
    }["useUpdateTravelCorridor.useCallback[update]"], []);
    const reset = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useUpdateTravelCorridor.useCallback[reset]": ()=>{
            setError(null);
        }
    }["useUpdateTravelCorridor.useCallback[reset]"], []);
    return {
        update,
        isUpdating,
        error,
        reset
    };
}
_s(useUpdateTravelCorridor, "TlIwOWi4mCLycHfMHI2PLFGTU6Y=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/traveller-profile/hooks/use-update-travel-preferences.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useUpdateTravelPreferences",
    ()=>useUpdateTravelPreferences
]);
// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/traveller-profile/api/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$api$2f$update$2d$travel$2d$preferences$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/traveller-profile/api/update-travel-preferences.api.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
// -----------------------------------------------------------------------------
// sisiMove — Use Update Travel Preferences
// -----------------------------------------------------------------------------
//
// React hook for updating a Traveller Profile's travel preferences.
//
// Responsibilities:
// - Execute the travel preferences mutation.
// - Expose mutation loading and error state.
// - Provide a reset operation.
//
// Non-responsibilities:
// - HTTP configuration.
// - Authentication/token handling.
// - Authorization.
// - Domain validation.
// - Profile ownership checks.
// - Rendering or navigation.
//
// HTTP concerns remain in:
//     ../api/update-travel-preferences.api.ts
//
// -----------------------------------------------------------------------------
'use client';
;
;
function useUpdateTravelPreferences() {
    _s();
    const [isUpdating, setIsUpdating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const update = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useUpdateTravelPreferences.useCallback[update]": async (travellerProfileId, input)=>{
            setIsUpdating(true);
            setError(null);
            try {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$api$2f$update$2d$travel$2d$preferences$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateTravelPreferences"])(travellerProfileId, input);
            } catch (cause) {
                const normalizedError = cause instanceof Error ? cause : new Error('Failed to update travel preferences.');
                setError(normalizedError);
                throw normalizedError;
            } finally{
                setIsUpdating(false);
            }
        }
    }["useUpdateTravelPreferences.useCallback[update]"], []);
    const reset = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useUpdateTravelPreferences.useCallback[reset]": ()=>{
            setError(null);
        }
    }["useUpdateTravelPreferences.useCallback[reset]"], []);
    return {
        update,
        isUpdating,
        error,
        reset
    };
}
_s(useUpdateTravelPreferences, "TlIwOWi4mCLycHfMHI2PLFGTU6Y=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/traveller-profile/hooks/use-update-traveller-profile.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useUpdateTravellerProfile",
    ()=>useUpdateTravellerProfile
]);
// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/traveller-profile/api/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$api$2f$update$2d$traveller$2d$profile$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/traveller-profile/api/update-traveller-profile.api.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
// -----------------------------------------------------------------------------
// sisiMove — Use Update Traveller Profile
// -----------------------------------------------------------------------------
//
// React hook for updating the authenticated user's Traveller Profile.
//
// Responsibilities:
// - Execute the profile update operation.
// - Expose mutation loading and error state.
// - Provide a reusable mutate function.
//
// Non-responsibilities:
// - HTTP configuration.
// - Authentication/token handling.
// - Domain validation.
// - Profile ownership checks.
// - Cache management.
// - Rendering or navigation.
//
// HTTP concerns remain in:
//     ../api/update-traveller-profile.api.ts
//
// -----------------------------------------------------------------------------
'use client';
;
;
function useUpdateTravellerProfile() {
    _s();
    const [isUpdating, setIsUpdating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const update = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useUpdateTravellerProfile.useCallback[update]": async (travellerProfileId, input)=>{
            setIsUpdating(true);
            setError(null);
            try {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$api$2f$update$2d$traveller$2d$profile$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateTravellerProfile"])(travellerProfileId, input);
            } catch (cause) {
                const normalizedError = cause instanceof Error ? cause : new Error('Failed to update traveller profile.');
                setError(normalizedError);
                throw normalizedError;
            } finally{
                setIsUpdating(false);
            }
        }
    }["useUpdateTravellerProfile.useCallback[update]"], []);
    const reset = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useUpdateTravellerProfile.useCallback[reset]": ()=>{
            setError(null);
        }
    }["useUpdateTravellerProfile.useCallback[reset]"], []);
    return {
        update,
        isUpdating,
        error,
        reset
    };
}
_s(useUpdateTravellerProfile, "TlIwOWi4mCLycHfMHI2PLFGTU6Y=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/traveller-profile/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// -----------------------------------------------------------------------------
// sisiMove — Traveller Profile Feature
// -----------------------------------------------------------------------------
//
// Public feature barrel for the Traveller Profile frontend feature.
//
// Consumers should import Traveller Profile functionality through this barrel
// rather than reaching into individual implementation directories.
//
// Exposed boundaries:
//
//   API
//   ├── getCurrentTravellerProfile
//   ├── getTravellerProfileByPublicId
//   ├── getTravellerProfileByMemberPublicId
//   └── getTravellerProfileByHandle
//
//   Hooks
//   ├── useCurrentTravellerProfile
//   └── useTravellerProfile
//
//   Models
//   ├── PublicTraveller
//   ├── PublicTravellerAvatar
//   └── PublicTravellerProfile
//
// Implementation details remain behind the feature boundary.
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/traveller-profile/api/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$hooks$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/traveller-profile/hooks/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$models$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/traveller-profile/models/index.ts [app-client] (ecmascript)");
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/traveller-profile/models/index.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Traveller Profile Models
// -----------------------------------------------------------------------------
//
// Public barrel for Traveller Profile frontend models.
//
// Consumers should normally import models through the Traveller Profile
// feature boundary:
//
//     import type {
//       PublicTraveller,
//       PublicTravellerAvatar,
//       PublicTravellerProfile,
//       TravellerProfile,
//       TravellerProfilePreferences,
//       TravellerProfileCorridor,
//     } from '@/features/traveller-profile';
//
// Individual model-file paths remain internal to the feature.
//
// Architecture:
//
// - PublicTraveller* models represent the public traveller read surface.
// - TravellerProfile represents the authenticated Traveller Profile read model.
// - TravellerProfilePreferences represents profile travel/display preferences.
// - TravellerProfileCorridor represents a saved frequent-travel corridor.
//
// These are frontend application contracts.
//
// They are NOT:
// - Prisma models.
// - Backend domain entities.
// - Aggregate types.
// - API DTOs.
//
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// Public traveller models
// -----------------------------------------------------------------------------
__turbopack_context__.s([]);
;
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

//# sourceMappingURL=src_03q2udy._.js.map