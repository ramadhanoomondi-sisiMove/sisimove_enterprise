(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/landing/calls-to-action/create-demand-section.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CreateDemandSection",
    ()=>CreateDemandSection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// sisiMove — Create Demand Section
// -----------------------------------------------------------------------------
//
// Landing-page call-to-action for travellers who cannot find a suitable
// published Journey.
//
// -----------------------------------------------------------------------------
// MARKETPLACE ROLE
// -----------------------------------------------------------------------------
//
// Journey Demand is a first-class marketplace object.
//
// When a suitable published Journey is not available, a visitor can make
// their travel need visible by creating a Demand.
//
// The marketplace can then expose that Demand to:
//
// - other travellers who may want to join the same plan;
// - potential providers who may be able to publish a suitable Journey.
//
// The important distinction is:
//
//     Create Demand
//          │
//          ├── Other travellers may join
//          │
//          └── Potential providers may discover the need
//
// Creating a Demand does NOT require another traveller to join before a
// provider can discover it.
//
// -----------------------------------------------------------------------------
// LANDING-PAGE ACCESS RULE
// -----------------------------------------------------------------------------
//
// This component is used on the public landing marketplace.
//
// An unauthenticated visitor may:
//
// - view published Journeys;
// - view Journey Demands.
//
// An unauthenticated visitor may NOT:
//
// - create a Journey Demand;
// - publish a Journey;
// - book a Journey;
// - join a Journey Demand.
//
// Therefore:
//
//     Create travel demand
//              │
//              ▼
//          Sign in
//
// Authentication is the first access boundary. Verification is handled
// later by the authenticated marketplace when the user attempts to perform
// the protected action.
//
// This component does not perform that access check itself.
//
// -----------------------------------------------------------------------------
// ARCHITECTURE
// -----------------------------------------------------------------------------
//
// This component is presentation-only.
//
// It does NOT:
//
// - create a Journey Demand;
// - call an API;
// - access authentication state;
// - own authentication logic;
// - determine permissions;
// - determine verification status;
// - resolve marketplace matching;
// - resolve authentication state;
// - determine the final post-login destination.
//
// Navigation is expressed through `href` so the surrounding application can
// decide how authenticated and unauthenticated visitors should be handled.
//
// The public landing page supplies the sign-in destination for this CTA.
//
// -----------------------------------------------------------------------------
// NAVIGATION
// -----------------------------------------------------------------------------
//
// The CTA is a Next.js Link because its purpose is navigation.
//
// For the public landing marketplace, the default destination is the
// canonical authentication route:
//
//     /login
//
// The actual Demand creation flow remains an authenticated concern.
//
// -----------------------------------------------------------------------------
// VISUAL ROLE
// -----------------------------------------------------------------------------
//
// This is intentionally quieter than the LandingHero.
//
// The marketplace inventory remains the primary product surface.
//
// This section acts as a useful fallback:
//
//     "I don't see what I need → make the need visible."
//
// The CTA still communicates the intended user action:
//
//     Create travel demand
//
// but the landing page routes the unauthenticated visitor through sign-in
// before they can create the Demand.
//
// -----------------------------------------------------------------------------
// FUTURE AUTHENTICATED MARKETPLACE
// -----------------------------------------------------------------------------
//
// The authenticated marketplace may reuse this presentation component with
// an authenticated destination or action boundary.
//
// That future composition must apply:
//
//     Authenticated
//          │
//          └── Create Demand
//                  │
//                  └── Verification guidance when required
//
// Authentication and verification therefore remain outside this component.
//
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-right.mjs [app-client] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pinned$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPinned$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pinned.mjs [app-client] (ecmascript) <export default as MapPinned>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2d$round$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UsersRound$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users-round.mjs [app-client] (ecmascript) <export default as UsersRound>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/foundation/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/utils/cn.ts [app-client] (ecmascript)");
;
;
;
;
function CreateDemandSection({ href = '/login', className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        "aria-labelledby": "create-demand-heading",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('w-full min-w-0', 'border-y border-[var(--border-subtle)]', 'bg-[var(--background-subtle)]', className),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('mx-auto w-full max-w-7xl', 'px-1 py-6', 'sm:px-1.5 sm:py-7', 'md:px-2 md:py-8', 'lg:px-3 lg:py-9'),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('relative mx-auto w-full max-w-4xl', 'overflow-hidden', 'rounded-[var(--radius-xl)]', 'border border-[var(--brand)]/15', 'bg-[var(--surface)]', 'shadow-[var(--shadow-sm)]'),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        "aria-hidden": "true",
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('pointer-events-none absolute -right-16 -top-20', 'h-48 w-48 rounded-full', 'bg-[var(--brand-soft)]', 'blur-3xl')
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/calls-to-action/create-demand-section.tsx",
                        lineNumber: 212,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        "aria-hidden": "true",
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('pointer-events-none absolute -bottom-20 -left-16', 'h-40 w-40 rounded-full', 'bg-[var(--brand-soft)]', 'blur-3xl')
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/calls-to-action/create-demand-section.tsx",
                        lineNumber: 222,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('relative grid min-w-0', 'gap-6', 'px-4 py-5', 'sm:px-6 sm:py-6', 'md:grid-cols-[auto_minmax(0,1fr)_auto]', 'md:items-center md:gap-6', 'lg:px-7'),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex shrink-0 items-center justify-center', 'md:self-center'),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex h-12 w-12 items-center justify-center', 'rounded-[var(--radius-lg)]', 'bg-[var(--brand-soft)]', 'text-[var(--brand)]', 'ring-1 ring-[var(--brand)]/10'),
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pinned$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPinned$3e$__["MapPinned"], {
                                        "aria-hidden": "true",
                                        className: "h-5 w-5"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/calls-to-action/create-demand-section.tsx",
                                        lineNumber: 262,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/landing/calls-to-action/create-demand-section.tsx",
                                    lineNumber: 253,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/landing/calls-to-action/create-demand-section.tsx",
                                lineNumber: 247,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "min-w-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('inline-flex items-center gap-2', 'text-[10px] font-semibold uppercase', 'tracking-[0.16em]', 'text-[var(--brand)]'),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2d$round$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UsersRound$3e$__["UsersRound"], {
                                                "aria-hidden": "true",
                                                className: "h-3.5 w-3.5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/calls-to-action/create-demand-section.tsx",
                                                lineNumber: 282,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Can't find your journey?"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/calls-to-action/create-demand-section.tsx",
                                                lineNumber: 287,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/landing/calls-to-action/create-demand-section.tsx",
                                        lineNumber: 274,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        id: "create-demand-heading",
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('mt-1.5', 'text-xl font-semibold', 'leading-tight tracking-[-0.025em]', 'text-[var(--foreground)]', 'sm:text-2xl'),
                                        children: "Tell the market where you need to go."
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/calls-to-action/create-demand-section.tsx",
                                        lineNumber: 290,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('mt-2 max-w-2xl', 'text-sm leading-6', 'text-[var(--foreground-secondary)]', 'sm:text-base sm:leading-7'),
                                        children: "Create a travel demand and make your plan visible to people who may want to join or providers who may be able to offer the journey."
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/calls-to-action/create-demand-section.tsx",
                                        lineNumber: 303,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/landing/calls-to-action/create-demand-section.tsx",
                                lineNumber: 273,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "shrink-0 md:justify-self-end",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: href,
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('group inline-flex min-h-10 w-full', 'items-center justify-center gap-2', 'rounded-[var(--radius-md)]', 'border border-[var(--brand)]', 'bg-[var(--brand)]', 'px-4 py-2', 'text-sm font-semibold', 'text-[var(--brand-foreground)]', 'shadow-[var(--shadow-sm)]', 'transition-all duration-150', 'hover:border-[var(--brand-hover)]', 'hover:bg-[var(--brand-hover)]', 'hover:shadow-[var(--shadow-md)]', 'focus-visible:outline-none', 'focus-visible:ring-2', 'focus-visible:ring-[var(--brand)]', 'focus-visible:ring-offset-2', 'focus-visible:ring-offset-[var(--surface)]', 'sm:w-auto'),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Create travel demand"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/landing/calls-to-action/create-demand-section.tsx",
                                            lineNumber: 346,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                            "aria-hidden": "true",
                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('h-4 w-4', 'transition-transform duration-150', 'group-hover:translate-x-0.5')
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/landing/calls-to-action/create-demand-section.tsx",
                                            lineNumber: 348,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/landing/calls-to-action/create-demand-section.tsx",
                                    lineNumber: 322,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/landing/calls-to-action/create-demand-section.tsx",
                                lineNumber: 321,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/landing/calls-to-action/create-demand-section.tsx",
                        lineNumber: 232,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/landing/calls-to-action/create-demand-section.tsx",
                lineNumber: 198,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/landing/calls-to-action/create-demand-section.tsx",
            lineNumber: 189,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/landing/calls-to-action/create-demand-section.tsx",
        lineNumber: 180,
        columnNumber: 5
    }, this);
}
_c = CreateDemandSection;
var _c;
__turbopack_context__.k.register(_c, "CreateDemandSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/landing/calls-to-action/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// -----------------------------------------------------------------------------
// sisiMove — Landing Call-to-Action Components
// -----------------------------------------------------------------------------
//
// Public barrel for landing-page marketplace CTAs.
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$calls$2d$to$2d$action$2f$create$2d$demand$2d$section$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/calls-to-action/create-demand-section.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$calls$2d$to$2d$action$2f$publish$2d$journey$2d$section$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/calls-to-action/publish-journey-section.tsx [app-client] (ecmascript)");
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/landing/calls-to-action/publish-journey-section.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PublishJourneySection",
    ()=>PublishJourneySection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// sisiMove — Publish Journey Section
// -----------------------------------------------------------------------------
//
// Landing-page call-to-action for people who can provide a Journey.
//
// -----------------------------------------------------------------------------
// MARKETPLACE ROLE
// -----------------------------------------------------------------------------
//
// A Journey represents existing travel supply.
//
// Someone is already planning to travel and may have available seats. By
// publishing that Journey, they make the opportunity visible in the
// marketplace so travellers looking for that route can discover it.
//
// The marketplace relationship is:
//
//     Existing travel plan
//            │
//            ▼
//     Publish Journey
//            │
//            ▼
//     Available seats become discoverable
//            │
//            ▼
//     Travellers can find and book
//
// Publishing a Journey does NOT mean that this component itself creates,
// publishes, validates, or matches anything.
//
// -----------------------------------------------------------------------------
// LANDING-PAGE ACCESS RULE
// -----------------------------------------------------------------------------
//
// This component is used on the public landing marketplace.
//
// An unauthenticated visitor may:
//
// - view published Journeys;
// - view Journey Demands.
//
// An unauthenticated visitor may NOT:
//
// - publish a Journey;
// - create a Journey Demand;
// - book a Journey;
// - join a Journey Demand.
//
// Therefore:
//
//     Publish a journey
//            │
//            ▼
//         Sign in
//
// Authentication is the first access boundary. Verification is handled later
// by the authenticated marketplace when the user attempts to perform the
// protected action.
//
// This component does not perform that access check itself.
//
// -----------------------------------------------------------------------------
// ARCHITECTURE
// -----------------------------------------------------------------------------
//
// Presentation-only.
//
// This component does NOT:
//
// - create a Journey;
// - publish a Journey;
// - call an API;
// - access authentication state;
// - determine permissions;
// - determine verification status;
// - resolve provider eligibility;
// - perform booking or matching logic;
// - determine the final post-login destination.
//
// The CTA receives an `href` from the surrounding application.
//
// -----------------------------------------------------------------------------
// NAVIGATION
// -----------------------------------------------------------------------------
//
// The CTA is a Next.js Link because its purpose is navigation.
//
// For the public landing marketplace, the default destination is the
// canonical sign-in route:
//
//     /login
//
// The actual Journey creation and publishing flow remains an authenticated
// concern.
//
// -----------------------------------------------------------------------------
// VISUAL ROLE
// -----------------------------------------------------------------------------
//
// This section complements CreateDemandSection:
//
//     CREATE DEMAND
//     "I need a journey."
//
//     PUBLISH JOURNEY
//     "I am already travelling."
//
// The CTA remains secondary. The marketplace inventory remains the primary
// product surface.
//
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-right.mjs [app-client] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$car$2d$front$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CarFront$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/car-front.mjs [app-client] (ecmascript) <export default as CarFront>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$route$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Route$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/route.mjs [app-client] (ecmascript) <export default as Route>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/foundation/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/utils/cn.ts [app-client] (ecmascript)");
;
;
;
;
function PublishJourneySection({ href = '/login', className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        "aria-labelledby": "publish-journey-heading",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('w-full min-w-0', 'border-t border-[var(--border-subtle)]', 'bg-[var(--background)]', className),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('mx-auto w-full max-w-7xl', 'px-1 py-6', 'sm:px-1.5 sm:py-7', 'md:px-2 md:py-8', 'lg:px-3 lg:py-9'),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('relative mx-auto w-full max-w-4xl', 'overflow-hidden', 'rounded-[var(--radius-xl)]', 'border border-[var(--border)]', 'bg-[var(--surface)]', 'shadow-[var(--shadow-sm)]'),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        "aria-hidden": "true",
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('pointer-events-none absolute -right-16 -top-20', 'h-48 w-48 rounded-full', 'bg-[var(--brand-soft)]', 'blur-3xl')
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/calls-to-action/publish-journey-section.tsx",
                        lineNumber: 189,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        "aria-hidden": "true",
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('pointer-events-none absolute -bottom-20 -left-16', 'h-40 w-40 rounded-full', 'bg-[var(--success-soft)]', 'blur-3xl')
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/calls-to-action/publish-journey-section.tsx",
                        lineNumber: 199,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('relative grid min-w-0', 'gap-6', 'px-4 py-5', 'sm:px-6 sm:py-6', 'md:grid-cols-[auto_minmax(0,1fr)_auto]', 'md:items-center md:gap-6', 'lg:px-7'),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex shrink-0 items-center justify-center', 'md:self-center'),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex h-12 w-12 items-center justify-center', 'rounded-[var(--radius-lg)]', 'bg-[var(--brand-soft)]', 'text-[var(--brand)]', 'ring-1 ring-[var(--brand)]/10'),
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$car$2d$front$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CarFront$3e$__["CarFront"], {
                                        "aria-hidden": "true",
                                        className: "h-5 w-5"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/calls-to-action/publish-journey-section.tsx",
                                        lineNumber: 239,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/landing/calls-to-action/publish-journey-section.tsx",
                                    lineNumber: 230,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/landing/calls-to-action/publish-journey-section.tsx",
                                lineNumber: 224,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "min-w-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('inline-flex items-center gap-2', 'text-[10px] font-semibold uppercase', 'tracking-[0.16em]', 'text-[var(--brand)]'),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$route$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Route$3e$__["Route"], {
                                                "aria-hidden": "true",
                                                className: "h-3.5 w-3.5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/calls-to-action/publish-journey-section.tsx",
                                                lineNumber: 259,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Already travelling?"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/calls-to-action/publish-journey-section.tsx",
                                                lineNumber: 264,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/landing/calls-to-action/publish-journey-section.tsx",
                                        lineNumber: 251,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        id: "publish-journey-heading",
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('mt-1.5', 'text-xl font-semibold', 'leading-tight tracking-[-0.025em]', 'text-[var(--foreground)]', 'sm:text-2xl'),
                                        children: "Make your available seats discoverable."
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/calls-to-action/publish-journey-section.tsx",
                                        lineNumber: 267,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('mt-2 max-w-2xl', 'text-sm leading-6', 'text-[var(--foreground-secondary)]', 'sm:text-base sm:leading-7'),
                                        children: "Publish the Journey you are already making and let travellers looking for the same route discover the available seats."
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/calls-to-action/publish-journey-section.tsx",
                                        lineNumber: 280,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/landing/calls-to-action/publish-journey-section.tsx",
                                lineNumber: 250,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "shrink-0 md:justify-self-end",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: href,
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('group inline-flex min-h-10 w-full', 'items-center justify-center gap-2', 'rounded-[var(--radius-md)]', 'border border-[var(--brand)]', 'bg-[var(--surface)]', 'px-4 py-2', 'text-sm font-semibold', 'text-[var(--brand)]', 'shadow-[var(--shadow-sm)]', 'transition-all duration-150', 'hover:border-[var(--brand-hover)]', 'hover:bg-[var(--brand-soft)]', 'hover:text-[var(--brand-hover)]', 'hover:shadow-[var(--shadow-md)]', 'focus-visible:outline-none', 'focus-visible:ring-2', 'focus-visible:ring-[var(--brand)]', 'focus-visible:ring-offset-2', 'focus-visible:ring-offset-[var(--surface)]', 'sm:w-auto'),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Publish a journey"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/landing/calls-to-action/publish-journey-section.tsx",
                                            lineNumber: 323,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                            "aria-hidden": "true",
                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('h-4 w-4', 'transition-transform duration-150', 'group-hover:translate-x-0.5')
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/landing/calls-to-action/publish-journey-section.tsx",
                                            lineNumber: 325,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/landing/calls-to-action/publish-journey-section.tsx",
                                    lineNumber: 298,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/landing/calls-to-action/publish-journey-section.tsx",
                                lineNumber: 297,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/landing/calls-to-action/publish-journey-section.tsx",
                        lineNumber: 209,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/landing/calls-to-action/publish-journey-section.tsx",
                lineNumber: 175,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/landing/calls-to-action/publish-journey-section.tsx",
            lineNumber: 166,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/landing/calls-to-action/publish-journey-section.tsx",
        lineNumber: 157,
        columnNumber: 5
    }, this);
}
_c = PublishJourneySection;
var _c;
__turbopack_context__.k.register(_c, "PublishJourneySection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/landing/demands/demand-card-actions.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DemandCardActions",
    ()=>DemandCardActions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Marketplace Actions
// -----------------------------------------------------------------------------
//
// Navigation-only actions for a public Journey Demand marketplace card.
//
// ARCHITECTURAL BOUNDARY
// ----------------------
//
// This component is presentation-only.
//
// It does NOT determine:
//
// - whether the visitor may join
// - whether the Demand is joinable
// - whether the Demand is fulfilled
// - whether the visitor owns the Demand
// - whether authentication is required
// - whether the Demand is still accepting participants
//
// Those decisions belong to the marketplace/application layer.
//
// The application layer supplies:
//
// - viewHref
// - joinHref
// - viewDisabled
// - joinDisabled
//
// This component simply renders those navigation affordances.
//
// RESPONSIVE MARKETPLACE RULE
// ---------------------------
//
// The marketplace card remains a horizontal row at every viewport size.
//
// Therefore this action column must also:
//
// - remain horizontally contained within its allocated flex column
// - have min-w-0
// - never define a fixed desktop width
// - never force horizontal scrolling
// - contract its padding, gap, typography, and controls at smaller sizes
//
// The parent DemandMarketplaceCard owns the outer marketplace column
// allocation. This component owns only the internal action presentation.
//
// -----------------------------------------------------------------------------
// VERTICAL ALIGNMENT
// ------------------
//
// DemandMarketplaceCard uses `items-stretch`, allowing each marketplace
// section to occupy the natural height of the row.
//
// The action group therefore uses `justify-end`.
//
// This intentionally places View / Join toward the lower portion of the
// marketplace row rather than vertically centering them.
//
// This is especially important when another marketplace section — such as
// requester trust information or route information — determines the row's
// natural height.
//
// No fixed height or min-height is introduced.
//
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
;
;
// -----------------------------------------------------------------------------
// Disabled navigation helper
// -----------------------------------------------------------------------------
//
// Next.js <Link> does not have a native disabled state.
//
// When the application layer marks navigation as disabled, prevent the
// navigation event here while also communicating the state through ARIA.
//
// This remains presentation behavior; the component does not decide WHY
// navigation is disabled.
// -----------------------------------------------------------------------------
function handleDisabledClick(event) {
    event.preventDefault();
}
function DemandCardActions({ viewHref, joinHref, viewDisabled = false, joinDisabled = false, className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: [
            // -------------------------------------------------------------------
            // Layout
            // -------------------------------------------------------------------
            //
            // Keep the action section vertically arranged internally while the
            // marketplace card itself remains a horizontal row.
            //
            // `justify-end` deliberately anchors the action group toward the
            // bottom of the natural marketplace row.
            //
            'flex',
            'min-w-0',
            'flex-col',
            'justify-end',
            // -------------------------------------------------------------------
            // Proportional internal density
            // -------------------------------------------------------------------
            //
            // The outer marketplace column already receives its responsive
            // section padding from DemandMarketplaceCard.
            //
            // These values control only the spacing between the actions and the
            // small internal separation from the upper edge of the action area.
            //
            'gap-1',
            'sm:gap-1.5',
            'md:gap-2',
            'pt-1.5',
            'sm:pt-2',
            'md:pt-2.5',
            className
        ].filter(Boolean).join(' '),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                href: viewHref,
                "aria-disabled": viewDisabled,
                tabIndex: viewDisabled ? -1 : undefined,
                onClick: viewDisabled ? handleDisabledClick : undefined,
                className: [
                    // ----------------------------------------------------------------
                    // Control geometry
                    // ----------------------------------------------------------------
                    'inline-flex',
                    'min-h-8',
                    'sm:min-h-8',
                    'md:min-h-9',
                    'w-full',
                    'min-w-0',
                    'items-center',
                    'justify-center',
                    // ----------------------------------------------------------------
                    // Shape
                    // ----------------------------------------------------------------
                    'rounded-[var(--radius-md)]',
                    'border',
                    'border-[var(--border)]',
                    'bg-[var(--background)]',
                    // ----------------------------------------------------------------
                    // Responsive control spacing
                    // ----------------------------------------------------------------
                    'px-2',
                    'py-1',
                    'sm:px-2.5',
                    'sm:py-1.5',
                    'md:px-3',
                    'md:py-1.5',
                    // ----------------------------------------------------------------
                    // Responsive typography
                    // ----------------------------------------------------------------
                    'text-[11px]',
                    'sm:text-xs',
                    'md:text-sm',
                    'font-medium',
                    'leading-tight',
                    // ----------------------------------------------------------------
                    // Colour / interaction
                    // ----------------------------------------------------------------
                    'text-[var(--foreground)]',
                    'transition-colors',
                    'hover:border-[var(--border-strong)]',
                    'hover:bg-[var(--background-subtle)]',
                    // ----------------------------------------------------------------
                    // Accessibility / keyboard focus
                    // ----------------------------------------------------------------
                    'focus-visible:outline-none',
                    'focus-visible:ring-2',
                    'focus-visible:ring-[color:var(--brand)]',
                    'focus-visible:ring-offset-2',
                    'focus-visible:ring-offset-[color:var(--background)]',
                    // ----------------------------------------------------------------
                    // Disabled presentation
                    // ----------------------------------------------------------------
                    viewDisabled ? [
                        'pointer-events-none',
                        'cursor-not-allowed',
                        'opacity-50'
                    ].join(' ') : ''
                ].filter(Boolean).join(' '),
                children: "View"
            }, void 0, false, {
                fileName: "[project]/src/components/landing/demands/demand-card-actions.tsx",
                lineNumber: 179,
                columnNumber: 7
            }, this),
            joinHref && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                href: joinHref,
                "aria-disabled": joinDisabled,
                tabIndex: joinDisabled ? -1 : undefined,
                onClick: joinDisabled ? handleDisabledClick : undefined,
                className: [
                    // ----------------------------------------------------------------
                    // Control geometry
                    // ----------------------------------------------------------------
                    'inline-flex',
                    'min-h-8',
                    'sm:min-h-8',
                    'md:min-h-9',
                    'w-full',
                    'min-w-0',
                    'items-center',
                    'justify-center',
                    // ----------------------------------------------------------------
                    // Shape
                    // ----------------------------------------------------------------
                    'rounded-[var(--radius-md)]',
                    'bg-[var(--brand)]',
                    // ----------------------------------------------------------------
                    // Responsive control spacing
                    // ----------------------------------------------------------------
                    'px-2',
                    'py-1',
                    'sm:px-2.5',
                    'sm:py-1.5',
                    'md:px-3',
                    'md:py-1.5',
                    // ----------------------------------------------------------------
                    // Responsive typography
                    // ----------------------------------------------------------------
                    'text-[11px]',
                    'sm:text-xs',
                    'md:text-sm',
                    'font-medium',
                    'leading-tight',
                    // ----------------------------------------------------------------
                    // Colour / interaction
                    // ----------------------------------------------------------------
                    //
                    // Explicit white keeps the primary action readable against the
                    // brand background without relying on another foreground token.
                    //
                    'text-white',
                    'transition-colors',
                    'hover:bg-[var(--brand-hover)]',
                    // ----------------------------------------------------------------
                    // Accessibility / keyboard focus
                    // ----------------------------------------------------------------
                    'focus-visible:outline-none',
                    'focus-visible:ring-2',
                    'focus-visible:ring-[color:var(--brand)]',
                    'focus-visible:ring-offset-2',
                    'focus-visible:ring-offset-[color:var(--background)]',
                    // ----------------------------------------------------------------
                    // Disabled presentation
                    // ----------------------------------------------------------------
                    joinDisabled ? [
                        'pointer-events-none',
                        'cursor-not-allowed',
                        'opacity-50'
                    ].join(' ') : ''
                ].filter(Boolean).join(' '),
                children: "Join"
            }, void 0, false, {
                fileName: "[project]/src/components/landing/demands/demand-card-actions.tsx",
                lineNumber: 270,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/landing/demands/demand-card-actions.tsx",
        lineNumber: 136,
        columnNumber: 5
    }, this);
}
_c = DemandCardActions;
var _c;
__turbopack_context__.k.register(_c, "DemandCardActions");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/landing/demands/demand-card-date.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Marketplace Date
// -----------------------------------------------------------------------------
//
// Compact schedule column for a public Journey Demand.
//
// IMPORTANT
// ---------
//
// A Journey has one concrete departure:
//
//     departureAt
//
// A Journey Demand does NOT necessarily have a single departure time.
//
// Its public schedule contains:
//
//     earliestDeparture
//     latestDeparture
//     targetArrival
//     maximumArrival
//     timezone
//
// Therefore this component deliberately presents a REQUESTED TIME WINDOW
// rather than pretending that the Demand has a fixed departure.
//
// PRESENTATION BOUNDARY
// ---------------------
//
// This component:
//
// - formats public schedule values
// - displays the requested departure window
// - displays optional arrival requirements
// - uses Intl.DateTimeFormat for timezone-aware presentation
//
// This component does NOT:
//
// - perform booking logic
// - perform matching logic
// - interpret Demand status
// - mutate schedule data
// - determine whether a Demand is joinable
// - determine whether a visitor may participate
//
// RESPONSIVE MARKETPLACE RULE
// ---------------------------
//
// The marketplace card remains a horizontal row at every viewport size.
//
// Therefore this component must:
//
// - remain horizontally contained within its allocated column
// - use min-w-0
// - never define a fixed desktop width
// - never use shrink-0
// - contract spacing and typography at smaller sizes
// - avoid forcing horizontal scrolling
//
// The parent DemandMarketplaceCard owns the column width:
//
//     flex-[0.8]
//
// This component owns only the visual contents of that column.
//
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "DemandCardDate",
    ()=>DemandCardDate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
// -----------------------------------------------------------------------------
// Formatting helpers
// -----------------------------------------------------------------------------
function parseDate(value) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
}
function formatDate(value, timezone) {
    const date = parseDate(value);
    if (!date) {
        return null;
    }
    const dateFormatter = new Intl.DateTimeFormat('en-KE', {
        timeZone: timezone,
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
    const timeFormatter = new Intl.DateTimeFormat('en-KE', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
    const parts = dateFormatter.formatToParts(date);
    const weekday = parts.find((part)=>part.type === 'weekday')?.value ?? '';
    const day = parts.find((part)=>part.type === 'day')?.value ?? '';
    const month = parts.find((part)=>part.type === 'month')?.value ?? '';
    const year = parts.find((part)=>part.type === 'year')?.value ?? '';
    return {
        weekday: weekday.toUpperCase(),
        day,
        monthYear: `${month} ${year}`.toUpperCase(),
        time: timeFormatter.format(date)
    };
}
function DemandCardDate({ schedule, className }) {
    const earliest = formatDate(schedule.earliestDeparture, schedule.timezone);
    const latest = formatDate(schedule.latestDeparture, schedule.timezone);
    const targetArrival = schedule.targetArrival ? formatDate(schedule.targetArrival, schedule.timezone) : null;
    const maximumArrival = schedule.maximumArrival ? formatDate(schedule.maximumArrival, schedule.timezone) : null;
    // ---------------------------------------------------------------------------
    // Invalid / unavailable schedule
    // ---------------------------------------------------------------------------
    //
    // The public read model should normally contain valid schedule values.
    // Nevertheless, the presentation boundary should fail gracefully instead
    // of throwing during rendering when an unexpected API value reaches it.
    // ---------------------------------------------------------------------------
    if (!earliest || !latest) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: [
                'flex',
                'min-w-0',
                'flex-col',
                'justify-center',
                'gap-0.5',
                'text-center',
                className
            ].filter(Boolean).join(' '),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: [
                        'text-[9px]',
                        'sm:text-[10px]',
                        'md:text-xs',
                        'font-medium',
                        'uppercase',
                        'tracking-wide',
                        'text-[var(--foreground-muted)]'
                    ].join(' '),
                    children: "Travel"
                }, void 0, false, {
                    fileName: "[project]/src/components/landing/demands/demand-card-date.tsx",
                    lineNumber: 200,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: [
                        'min-w-0',
                        'text-[10px]',
                        'sm:text-[11px]',
                        'md:text-xs',
                        'font-medium',
                        'leading-tight',
                        'text-[var(--foreground)]'
                    ].join(' '),
                    children: "Schedule unavailable"
                }, void 0, false, {
                    fileName: "[project]/src/components/landing/demands/demand-card-date.tsx",
                    lineNumber: 214,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/landing/demands/demand-card-date.tsx",
            lineNumber: 187,
            columnNumber: 7
        }, this);
    }
    // ---------------------------------------------------------------------------
    // Departure window
    // ---------------------------------------------------------------------------
    const sameCalendarDate = earliest.day === latest.day && earliest.monthYear === latest.monthYear;
    // ---------------------------------------------------------------------------
    // Render
    // ---------------------------------------------------------------------------
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: [
            'flex',
            'min-w-0',
            'flex-col',
            'justify-center',
            'overflow-hidden',
            className
        ].filter(Boolean).join(' '),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: [
                    'text-[9px]',
                    'sm:text-[10px]',
                    'md:text-xs',
                    'font-medium',
                    'uppercase',
                    'tracking-wide',
                    'text-[var(--foreground-muted)]'
                ].join(' '),
                children: "Travel"
            }, void 0, false, {
                fileName: "[project]/src/components/landing/demands/demand-card-date.tsx",
                lineNumber: 260,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: [
                    'mt-0.5',
                    'text-[9px]',
                    'sm:text-[10px]',
                    'md:text-xs',
                    'font-semibold',
                    'uppercase',
                    'leading-tight',
                    'text-[var(--foreground-secondary)]'
                ].join(' '),
                children: earliest.weekday
            }, void 0, false, {
                fileName: "[project]/src/components/landing/demands/demand-card-date.tsx",
                lineNumber: 274,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: [
                    'text-xl',
                    'sm:text-[22px]',
                    'md:text-2xl',
                    'font-semibold',
                    'leading-none',
                    'text-[var(--foreground)]'
                ].join(' '),
                children: earliest.day
            }, void 0, false, {
                fileName: "[project]/src/components/landing/demands/demand-card-date.tsx",
                lineNumber: 289,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: [
                    'mt-0.5',
                    'truncate',
                    'text-[9px]',
                    'sm:text-[10px]',
                    'md:text-xs',
                    'font-medium',
                    'uppercase',
                    'leading-tight',
                    'text-[var(--foreground-muted)]'
                ].join(' '),
                children: earliest.monthYear
            }, void 0, false, {
                fileName: "[project]/src/components/landing/demands/demand-card-date.tsx",
                lineNumber: 302,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: [
                    'mt-1',
                    'truncate',
                    'text-[11px]',
                    'sm:text-xs',
                    'md:text-sm',
                    'font-semibold',
                    'leading-tight',
                    'text-[var(--foreground)]'
                ].join(' '),
                children: sameCalendarDate ? `${earliest.time}–${latest.time}` : `${earliest.time}–`
            }, void 0, false, {
                fileName: "[project]/src/components/landing/demands/demand-card-date.tsx",
                lineNumber: 318,
                columnNumber: 7
            }, this),
            !sameCalendarDate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: [
                    'mt-0.5',
                    'truncate',
                    'text-[9px]',
                    'sm:text-[10px]',
                    'md:text-xs',
                    'leading-tight',
                    'text-[var(--foreground-muted)]'
                ].join(' '),
                children: [
                    "until ",
                    latest.weekday,
                    " ",
                    latest.day
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/landing/demands/demand-card-date.tsx",
                lineNumber: 336,
                columnNumber: 9
            }, this),
            targetArrival || maximumArrival ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: [
                    'mt-1.5',
                    'sm:mt-2',
                    'border-t',
                    'border-[var(--border-subtle)]',
                    'pt-1.5',
                    'sm:pt-2'
                ].join(' '),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: [
                            'text-[8px]',
                            'sm:text-[9px]',
                            'md:text-[10px]',
                            'font-medium',
                            'uppercase',
                            'tracking-wide',
                            'text-[var(--foreground-subtle)]'
                        ].join(' '),
                        children: "Arrival"
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/demands/demand-card-date.tsx",
                        lineNumber: 365,
                        columnNumber: 11
                    }, this),
                    targetArrival && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: [
                            'truncate',
                            'text-[9px]',
                            'sm:text-[10px]',
                            'md:text-xs',
                            'font-medium',
                            'leading-tight',
                            'text-[var(--foreground-secondary)]'
                        ].join(' '),
                        children: [
                            "Target ",
                            targetArrival.time
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/landing/demands/demand-card-date.tsx",
                        lineNumber: 380,
                        columnNumber: 13
                    }, this),
                    !targetArrival && maximumArrival && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: [
                            'truncate',
                            'text-[9px]',
                            'sm:text-[10px]',
                            'md:text-xs',
                            'font-medium',
                            'leading-tight',
                            'text-[var(--foreground-secondary)]'
                        ].join(' '),
                        children: [
                            "By ",
                            maximumArrival.time
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/landing/demands/demand-card-date.tsx",
                        lineNumber: 396,
                        columnNumber: 13
                    }, this),
                    targetArrival && maximumArrival && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: [
                            'truncate',
                            'text-[9px]',
                            'sm:text-[10px]',
                            'md:text-[11px]',
                            'leading-tight',
                            'text-[var(--foreground-muted)]'
                        ].join(' '),
                        children: [
                            "By ",
                            maximumArrival.time
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/landing/demands/demand-card-date.tsx",
                        lineNumber: 412,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/landing/demands/demand-card-date.tsx",
                lineNumber: 355,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/landing/demands/demand-card-date.tsx",
        lineNumber: 244,
        columnNumber: 5
    }, this);
}
_c = DemandCardDate;
var _c;
__turbopack_context__.k.register(_c, "DemandCardDate");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/landing/demands/demand-card-requester.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DemandCardRequester",
    ()=>DemandCardRequester
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Requester
// -----------------------------------------------------------------------------
//
// Compact WHO column for a public Journey Demand.
//
// The requester is the Traveller who CREATED the Demand.
//
// PublicJourneyDemandRequester already represents the public read-side
// composition:
//
//     requester
//     ├── traveller
//     └── trust
//
// This component renders those supplied public read models directly.
//
// PRESENTATION BOUNDARY
// ---------------------
//
// This component does NOT:
//
// - fetch requester data;
// - resolve Identity IDs;
// - reconstruct Traveller or Trust relationships;
// - determine Demand ownership;
// - determine participation eligibility;
// - contain Journey Demand business logic.
//
// It receives an already-composed public requester representation and renders
// it.
//
// REQUESTER RELATIONSHIP
// ----------------------
//
// The Journey Demand owns the requester relationship.
//
// This component does NOT imply:
//
//     Traveller → owns Demand
//
// or:
//
//     Trust → owns Demand
//
// Instead:
//
//     JourneyDemand
//          ↓
//     requesterPublicId
//          ↓
//     PublicJourneyDemandRequester
//          ├── Traveller
//          └── Trust
//
// INTERNAL LAYOUT
// --------------
//
// The requester identity remains vertically grouped:
//
//     [avatar]
//     @handle
//     ✓ Verified  ★ 4.9 (5)
//     · 2 completed journeys
//
// The parent DemandMarketplaceCard controls the requester's horizontal
// marketplace allocation:
//
//     Date | Requester | Route | Summary | Actions
//
// This component therefore does NOT define:
//
// - a fixed width;
// - shrink behavior;
// - marketplace column padding.
//
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$shared$2f$traveller$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/landing/shared/traveller/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$shared$2f$traveller$2f$traveller$2d$summary$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/shared/traveller/traveller-summary.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$shared$2f$trust$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/landing/shared/trust/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$shared$2f$trust$2f$trust$2d$summary$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/shared/trust/trust-summary.tsx [app-client] (ecmascript)");
;
;
;
function DemandCardRequester({ requester, linkToProfile = true, showTrustBadges = true, className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: [
            // -------------------------------------------------------------------
            // Requester content boundary
            // -------------------------------------------------------------------
            //
            // The parent DemandMarketplaceCard owns the outer responsive section
            // padding and the horizontal flex allocation.
            //
            // Keep this component min-w-0 so the identity and Trust content can
            // contract with the marketplace column rather than forcing overflow.
            //
            'flex',
            'min-w-0',
            'flex-col',
            'justify-center',
            // -------------------------------------------------------------------
            // Internal proportional density
            // -------------------------------------------------------------------
            //
            // This spacing is deliberately smaller than the parent section
            // padding. It controls only the relationship between TravellerSummary
            // and TrustSummary.
            //
            'gap-1',
            'sm:gap-1.5',
            'md:gap-2',
            className
        ].filter(Boolean).join(' '),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$shared$2f$traveller$2f$traveller$2d$summary$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TravellerSummary"], {
                traveller: requester.traveller,
                linkToProfile: linkToProfile,
                orientation: "vertical"
            }, void 0, false, {
                fileName: "[project]/src/components/landing/demands/demand-card-requester.tsx",
                lineNumber: 171,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$shared$2f$trust$2f$trust$2d$summary$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TrustSummary"], {
                trust: requester.trust,
                showBadges: showTrustBadges
            }, void 0, false, {
                fileName: "[project]/src/components/landing/demands/demand-card-requester.tsx",
                lineNumber: 191,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/landing/demands/demand-card-requester.tsx",
        lineNumber: 124,
        columnNumber: 5
    }, this);
}
_c = DemandCardRequester;
var _c;
__turbopack_context__.k.register(_c, "DemandCardRequester");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/landing/demands/demand-card-route.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Route
// -----------------------------------------------------------------------------
//
// Compact route column for a public Journey Demand.
//
// A Demand route is a REQUESTED route.
//
// It is therefore important that this component does not accidentally adopt
// Journey-side semantics such as:
//
//     pickupAllowed
//     dropoffAllowed
//
// Demand waypoints instead expose:
//
//     pickupRequired
//     dropoffRequired
//
// The primary marketplace route remains:
//
//     origin
//        ↓
//     destination
//
// Genuine intermediate waypoints are shown as additional requested locations.
//
// PRESENTATION BOUNDARY
// ---------------------
//
// This component:
//
// - renders the supplied public route;
// - displays origin and destination;
// - displays genuine intermediate waypoints;
// - preserves waypoint sequence.
//
// This component does NOT:
//
// - geocode locations;
// - calculate distance;
// - calculate a route;
// - perform schedule logic;
// - perform matching logic;
// - determine pickup/drop-off eligibility;
// - mutate the route.
//
// RESPONSIVE MARKETPLACE RULE
// ---------------------------
//
// The marketplace card remains a horizontal row at every viewport size.
//
// The parent DemandMarketplaceCard owns the route column allocation:
//
//     flex-[1.6]
//
// This component therefore does NOT define:
//
// - a fixed width;
// - a minimum desktop width;
// - flex-1 sizing;
// - shrink behavior;
// - marketplace-level padding.
//
// Its responsibility is the content inside that allocated column.
//
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "DemandCardRoute",
    ()=>DemandCardRoute
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function DemandCardRoute({ route, className }) {
    // ---------------------------------------------------------------------------
    // Genuine intermediate waypoints
    // ---------------------------------------------------------------------------
    //
    // ORIGIN and DESTINATION are already represented by the primary route
    // fields. They should therefore not be duplicated in the "Via" line.
    //
    // The public Demand model owns waypoint sequence, so presentation preserves
    // that sequence rather than attempting to derive or recalculate it.
    // ---------------------------------------------------------------------------
    const intermediateWaypoints = route.waypoints.filter((waypoint)=>waypoint.type !== 'ORIGIN' && waypoint.type !== 'DESTINATION').sort((a, b)=>a.sequence - b.sequence);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: [
            // -------------------------------------------------------------------
            // Route content boundary
            // -------------------------------------------------------------------
            //
            // The parent marketplace card controls the horizontal column width
            // and outer responsive padding.
            //
            'flex',
            'min-w-0',
            'flex-col',
            'justify-center',
            'overflow-hidden',
            // -------------------------------------------------------------------
            // Internal route density
            // -------------------------------------------------------------------
            //
            // Keep the route compact while allowing the visual spacing to grow
            // gradually on larger viewports.
            //
            'gap-0',
            className
        ].filter(Boolean).join(' '),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-w-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: [
                            'text-[9px]',
                            'sm:text-[10px]',
                            'md:text-xs',
                            'font-medium',
                            'uppercase',
                            'tracking-wide',
                            'leading-tight',
                            'text-[var(--foreground-muted)]'
                        ].join(' '),
                        children: "From"
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/demands/demand-card-route.tsx",
                        lineNumber: 148,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: [
                            'truncate',
                            'text-[11px]',
                            'sm:text-xs',
                            'md:text-sm',
                            'font-semibold',
                            'leading-tight',
                            'text-[var(--foreground)]'
                        ].join(' '),
                        children: route.origin.name
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/demands/demand-card-route.tsx",
                        lineNumber: 163,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/landing/demands/demand-card-route.tsx",
                lineNumber: 147,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                "aria-hidden": "true",
                className: [
                    'my-0.5',
                    'sm:my-1',
                    'text-[11px]',
                    'sm:text-xs',
                    'md:text-sm',
                    'leading-none',
                    'text-[var(--brand)]'
                ].join(' '),
                children: "↓"
            }, void 0, false, {
                fileName: "[project]/src/components/landing/demands/demand-card-route.tsx",
                lineNumber: 182,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-w-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: [
                            'text-[9px]',
                            'sm:text-[10px]',
                            'md:text-xs',
                            'font-medium',
                            'uppercase',
                            'tracking-wide',
                            'leading-tight',
                            'text-[var(--foreground-muted)]'
                        ].join(' '),
                        children: "To"
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/demands/demand-card-route.tsx",
                        lineNumber: 202,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: [
                            'truncate',
                            'text-[11px]',
                            'sm:text-xs',
                            'md:text-sm',
                            'font-semibold',
                            'leading-tight',
                            'text-[var(--foreground)]'
                        ].join(' '),
                        children: route.destination.name
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/demands/demand-card-route.tsx",
                        lineNumber: 217,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/landing/demands/demand-card-route.tsx",
                lineNumber: 201,
                columnNumber: 7
            }, this),
            intermediateWaypoints.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: [
                    'mt-1',
                    'sm:mt-1.5',
                    'md:mt-2',
                    'min-w-0'
                ].join(' '),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: [
                        'truncate',
                        'text-[9px]',
                        'sm:text-[10px]',
                        'md:text-xs',
                        'leading-tight',
                        'text-[var(--foreground-muted)]'
                    ].join(' '),
                    title: intermediateWaypoints.map((waypoint)=>waypoint.name).join(' · '),
                    children: [
                        "Via",
                        ' ',
                        intermediateWaypoints.map((waypoint)=>waypoint.name).join(' · ')
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/landing/demands/demand-card-route.tsx",
                    lineNumber: 244,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/landing/demands/demand-card-route.tsx",
                lineNumber: 236,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/landing/demands/demand-card-route.tsx",
        lineNumber: 115,
        columnNumber: 5
    }, this);
}
_c = DemandCardRoute;
var _c;
__turbopack_context__.k.register(_c, "DemandCardRoute");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/landing/demands/demand-card-summary.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Marketplace Summary
// -----------------------------------------------------------------------------
//
// Compact marketplace summary for a public Journey Demand.
//
// The summary communicates the information that matters when browsing demand:
//
//     - seats still looking for supply
//     - total requested seats
//     - matched seats
//     - active participants
//     - price expectation
//     - lifecycle state
//
// This is intentionally NOT a generic "details" component.
//
// A marketplace card should remain scannable. Detailed Demand information
// belongs on the Demand detail page.
//
// PRESENTATION BOUNDARY
// ---------------------
//
// This component:
//
// - renders supplied public Demand read-model values;
// - counts active participants for display;
// - formats price values;
// - formats the public lifecycle label.
//
// This component does NOT:
//
// - fetch data;
// - determine matching;
// - determine booking eligibility;
// - perform state transitions;
// - mutate Demand state;
// - decide whether a Demand is joinable.
//
// The parent DemandMarketplaceCard owns the horizontal marketplace column
// allocation. This component owns only the summary content inside that
// allocation.
//
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "DemandCardSummary",
    ()=>DemandCardSummary
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------
function formatPrice(amount, currency) {
    if (amount === null) {
        return null;
    }
    return `${currency} ${amount.toLocaleString('en-KE')}`;
}
function getStatusLabel(status) {
    switch(status){
        case 'OPEN':
            return 'Open';
        case 'MATCHED':
            return 'Matched';
        case 'CONVERTED':
            return 'Converted';
        case 'FULFILLED':
            return 'Fulfilled';
        default:
            return status;
    }
}
function getStatusClassName(status) {
    switch(status){
        case 'OPEN':
            return [
                'border',
                'border-[var(--brand)]',
                'bg-[var(--brand-soft)]',
                'text-[var(--brand)]'
            ].join(' ');
        case 'MATCHED':
            return [
                'border',
                'border-[var(--border-strong)]',
                'bg-[var(--background-muted)]',
                'text-[var(--foreground-secondary)]'
            ].join(' ');
        case 'CONVERTED':
        case 'FULFILLED':
            return [
                'border',
                'border-[var(--border-strong)]',
                'bg-[var(--background-subtle)]',
                'text-[var(--foreground-muted)]'
            ].join(' ');
        default:
            return [
                'border',
                'border-[var(--border)]',
                'bg-[var(--background-subtle)]',
                'text-[var(--foreground-secondary)]'
            ].join(' ');
    }
}
function DemandCardSummary({ capacity, pricing, participants, status, className }) {
    // ---------------------------------------------------------------------------
    // Active participant count
    // ---------------------------------------------------------------------------
    //
    // Participant status is already supplied by the public Demand read model.
    // Counting ACTIVE participants here is presentation-level aggregation only;
    // it does not change or interpret the Demand lifecycle.
    // ---------------------------------------------------------------------------
    const activeParticipantCount = participants.filter((participant)=>participant.status === 'ACTIVE').length;
    // ---------------------------------------------------------------------------
    // Price presentation
    // ---------------------------------------------------------------------------
    const preferredPrice = formatPrice(pricing.preferredPricePerSeat, pricing.currency);
    const maximumPrice = formatPrice(pricing.maximumPricePerSeat, pricing.currency);
    const priceLabel = preferredPrice ? `${preferredPrice} preferred` : maximumPrice ? `Up to ${maximumPrice}` : null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: [
            // -------------------------------------------------------------------
            // Summary content boundary
            // -------------------------------------------------------------------
            //
            // The parent DemandMarketplaceCard controls the horizontal column
            // allocation and outer responsive section padding.
            //
            // Do not add flex-1, min-width values, or marketplace-level padding
            // here.
            //
            'flex',
            'min-w-0',
            'flex-col',
            'justify-center',
            'overflow-hidden',
            // -------------------------------------------------------------------
            // Internal proportional density
            // -------------------------------------------------------------------
            //
            // The summary contains several information groups, so its internal
            // spacing is slightly larger than the Route column while still
            // contracting on smaller screens.
            //
            'gap-1.5',
            'sm:gap-2',
            'md:gap-2.5',
            className
        ].filter(Boolean).join(' '),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-w-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: [
                            'text-[9px]',
                            'sm:text-[10px]',
                            'md:text-xs',
                            'font-medium',
                            'uppercase',
                            'tracking-wide',
                            'leading-tight',
                            'text-[var(--foreground-muted)]'
                        ].join(' '),
                        children: "Looking for"
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/demands/demand-card-summary.tsx",
                        lineNumber: 244,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: [
                            'mt-0.5',
                            'truncate',
                            'text-[11px]',
                            'sm:text-xs',
                            'md:text-sm',
                            'font-semibold',
                            'leading-tight',
                            'text-[var(--foreground)]'
                        ].join(' '),
                        children: [
                            capacity.remainingSeats,
                            ' ',
                            capacity.remainingSeats === 1 ? 'seat' : 'seats',
                            " still needed"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/landing/demands/demand-card-summary.tsx",
                        lineNumber: 259,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/landing/demands/demand-card-summary.tsx",
                lineNumber: 243,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: [
                    'flex',
                    'min-w-0',
                    'flex-wrap',
                    'items-center',
                    'gap-x-1',
                    'sm:gap-x-1.5',
                    'md:gap-x-2',
                    'gap-y-0.5',
                    'text-[9px]',
                    'sm:text-[10px]',
                    'md:text-xs',
                    'leading-tight',
                    'text-[var(--foreground-secondary)]'
                ].join(' '),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "truncate",
                        children: [
                            capacity.requestedSeats,
                            ' ',
                            capacity.requestedSeats === 1 ? 'seat' : 'seats',
                            " requested"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/landing/demands/demand-card-summary.tsx",
                        lineNumber: 297,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        "aria-hidden": "true",
                        className: "shrink-0 text-[var(--foreground-subtle)]",
                        children: "·"
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/demands/demand-card-summary.tsx",
                        lineNumber: 302,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "truncate",
                        children: [
                            capacity.matchedSeats,
                            " matched"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/landing/demands/demand-card-summary.tsx",
                        lineNumber: 309,
                        columnNumber: 9
                    }, this),
                    activeParticipantCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                "aria-hidden": "true",
                                className: "shrink-0 text-[var(--foreground-subtle)]",
                                children: "·"
                            }, void 0, false, {
                                fileName: "[project]/src/components/landing/demands/demand-card-summary.tsx",
                                lineNumber: 315,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "truncate",
                                children: [
                                    activeParticipantCount,
                                    ' ',
                                    activeParticipantCount === 1 ? 'participant' : 'participants'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/landing/demands/demand-card-summary.tsx",
                                lineNumber: 322,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/landing/demands/demand-card-summary.tsx",
                        lineNumber: 314,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/landing/demands/demand-card-summary.tsx",
                lineNumber: 280,
                columnNumber: 7
            }, this),
            priceLabel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-w-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: [
                            'text-[9px]',
                            'sm:text-[10px]',
                            'md:text-xs',
                            'leading-tight',
                            'text-[var(--foreground-muted)]'
                        ].join(' '),
                        children: "Price expectation"
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/demands/demand-card-summary.tsx",
                        lineNumber: 338,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: [
                            'mt-0.5',
                            'truncate',
                            'text-[11px]',
                            'sm:text-xs',
                            'md:text-sm',
                            'font-semibold',
                            'leading-tight',
                            'text-[var(--foreground)]'
                        ].join(' '),
                        title: priceLabel,
                        children: priceLabel
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/demands/demand-card-summary.tsx",
                        lineNumber: 350,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/landing/demands/demand-card-summary.tsx",
                lineNumber: 337,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-w-0",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: [
                        'inline-flex',
                        'max-w-full',
                        'items-center',
                        'rounded-full',
                        // ---------------------------------------------------------------
                        // Responsive badge density
                        // ---------------------------------------------------------------
                        'px-1.5',
                        'py-0.5',
                        'sm:px-2',
                        'sm:py-0.5',
                        'md:px-2.5',
                        'md:py-1',
                        // ---------------------------------------------------------------
                        // Responsive typography
                        // ---------------------------------------------------------------
                        'text-[9px]',
                        'sm:text-[10px]',
                        'md:text-xs',
                        'font-medium',
                        'leading-tight',
                        getStatusClassName(status)
                    ].join(' '),
                    children: getStatusLabel(status)
                }, void 0, false, {
                    fileName: "[project]/src/components/landing/demands/demand-card-summary.tsx",
                    lineNumber: 373,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/landing/demands/demand-card-summary.tsx",
                lineNumber: 372,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/landing/demands/demand-card-summary.tsx",
        lineNumber: 204,
        columnNumber: 5
    }, this);
}
_c = DemandCardSummary;
var _c;
__turbopack_context__.k.register(_c, "DemandCardSummary");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/landing/demands/demand-marketplace-card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Marketplace Card
// -----------------------------------------------------------------------------
//
// Horizontal marketplace listing for a public Journey Demand.
//
// A Journey Demand is the primary demand-side marketplace object in sisiMove.
//
// The card is intentionally a dense, horizontally scannable marketplace row.
// It is NOT a Journey Demand detail card.
//
// -----------------------------------------------------------------------------
// Responsive marketplace model
// -----------------------------------------------------------------------------
//
// The card remains HORIZONTAL at every viewport size.
//
// Mobile-first does NOT mean vertically stacking the marketplace sections.
//
// Instead, the complete row contracts as the available viewport width
// decreases:
//
//   Desktop
//
//   ┌──────┬──────────┬──────────┬────────────┬────────┐
//   │ DATE │ REQUESTER│ ROUTE    │ SUMMARY    │ ACTION │
//   └──────┴──────────┴──────────┴────────────┴────────┘
//
//   Tablet
//
//   ┌─────┬────────┬────────┬───────────┬───────┐
//   │DATE │REQUEST.│ ROUTE  │ SUMMARY   │ ACTION│
//   └─────┴────────┴────────┴───────────┴───────┘
//
//   Mobile
//
//   ┌────┬──────┬──────┬────────┬─────┐
//   │DATE│REQ.  │ROUTE │SUMMARY │ACT. │
//   └────┴──────┴──────┴────────┴─────┘
//
// The card therefore:
//
// - remains horizontal;
// - never becomes a vertically stacked card;
// - never requires horizontal page scrolling;
// - does not depend on fixed desktop widths;
// - allows each marketplace column to contract naturally.
//
// Flex ratios preserve the relative importance of each section.
//
// -----------------------------------------------------------------------------
// Proportional density
// -----------------------------------------------------------------------------
//
// The marketplace card is treated as one visual composition.
//
// Responsive density therefore contracts uniformly:
//
//   Mobile → smallest density
//   SM     → compact density
//   MD     → comfortable density
//   LG     → full density
//
// The card shell owns the OUTER responsive density:
//
//   Mobile   px-1   py-1
//   SM       px-1.5 py-1.5
//   MD       px-2   py-2
//   LG       px-3   py-2.5
//
// Individual child components own their internal presentation, but they must
// remain compatible with this density model.
//
// The parent deliberately does not compensate for individual children with
// large desktop-only padding.
//
// This prevents the marketplace row from becoming horizontally narrow while
// remaining unnecessarily tall.
//
// -----------------------------------------------------------------------------
// Marketplace presentation model
// -----------------------------------------------------------------------------
//
// The listing communicates:
//
//   WHEN
//     DemandCardDate
//
//   WHO
//     DemandCardRequester
//
//   WHERE
//     DemandCardRoute
//
//   WHAT IS NEEDED
//     DemandCardSummary
//
//   WHAT CAN I DO
//     DemandCardActions
//
// The card intentionally excludes detailed Demand information that belongs
// on the public Demand detail page.
//
// -----------------------------------------------------------------------------
// Architecture boundary
// -----------------------------------------------------------------------------
//
// Journey Demand remains the primary Demand-side marketplace/domain object.
//
// Requester Traveller and Trust information is public read-side enrichment
// exposed through `demand.requester`.
//
// Participants are already represented by the public Demand read model.
//
// This component does not:
//
// - fetch Demand data;
// - resolve public IDs;
// - build URLs;
// - determine join eligibility;
// - perform matching;
// - calculate Demand capacity;
// - mutate the Demand;
// - create a second Demand model;
// - introduce marketplace business rules.
//
// The marketplace/application boundary supplies the composed public Demand
// read model and navigation destinations.
//
// -----------------------------------------------------------------------------
// Navigation boundary
// -----------------------------------------------------------------------------
//
// `viewHref` and `joinHref` are presentation-level navigation destinations.
//
// This component does not decide whether a Demand can be joined.
//
// If `joinHref` is absent, DemandCardActions determines how the Join action
// should be presented.
//
// `viewDisabled` and `joinDisabled` are explicit presentation inputs and are
// simply forwarded to the action component.
//
// -----------------------------------------------------------------------------
// Layout responsibility
// -----------------------------------------------------------------------------
//
// DemandMarketplaceCard
//   ├── DemandCardDate
//   ├── DemandCardRequester
//   ├── DemandCardRoute
//   ├── DemandCardSummary
//   └── DemandCardActions
//
// This composition root owns:
//
// - horizontal positioning;
// - proportional marketplace column sizing;
// - section separators;
// - responsive density.
//
// Each child remains responsible for rendering its own public Demand slice.
//
// -----------------------------------------------------------------------------
// Responsive sizing
// -----------------------------------------------------------------------------
//
// Column ratios:
//
//   Date       0.8
//   Requester  1.4
//   Route      1.6
//   Summary    1.4
//   Actions    1.1
//
// Route receives the largest share because origin → destination is the most
// important discovery information for a Demand.
//
// Date is intentionally compact because DemandCardDate already communicates
// the flexible departure window.
//
// -----------------------------------------------------------------------------
// CSS token policy
// -----------------------------------------------------------------------------
//
// Only existing sisiMove design tokens are used.
//
// No generic/nonexistent tokens such as:
//
//   --primary
//   --primary-foreground
//   --ring
//   --background-secondary
//
// are introduced here.
//
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "DemandMarketplaceCard",
    ()=>DemandMarketplaceCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$demands$2f$demand$2d$card$2d$actions$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/demands/demand-card-actions.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$demands$2f$demand$2d$card$2d$date$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/demands/demand-card-date.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$demands$2f$demand$2d$card$2d$requester$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/demands/demand-card-requester.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$demands$2f$demand$2d$card$2d$route$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/demands/demand-card-route.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$demands$2f$demand$2d$card$2d$summary$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/demands/demand-card-summary.tsx [app-client] (ecmascript)");
;
;
;
;
;
;
;
// -----------------------------------------------------------------------------
// Responsive marketplace section density
// -----------------------------------------------------------------------------
//
// Every marketplace column uses the same outer density.
//
// This is intentionally centralized.
//
// We do not want:
//
//   Date       → compact
//   Requester  → medium
//   Route      → large
//   Summary    → medium
//   Actions    → desktop-sized
//
// The marketplace row is one visual composition, so its outer spacing
// contracts uniformly.
//
// -----------------------------------------------------------------------------
const MARKETPLACE_SECTION = [
    'flex',
    'min-w-0',
    // ---------------------------------------------------------------------------
    // Horizontal density
    // ---------------------------------------------------------------------------
    //
    // The available width contracts naturally through the flex ratios. Padding
    // contracts with it so horizontal whitespace does not consume a
    // disproportionate amount of the mobile card.
    //
    'px-1',
    'sm:px-1.5',
    'md:px-2',
    'lg:px-3',
    // ---------------------------------------------------------------------------
    // Vertical density
    // ---------------------------------------------------------------------------
    //
    // This is deliberately tighter than the previous py-2 → py-4 progression.
    //
    // The marketplace is a dense discovery surface. Detail-page-level vertical
    // spacing belongs on the Demand detail page.
    //
    'py-1',
    'sm:py-1.5',
    'md:py-2',
    'lg:py-2.5'
].join(' ');
function DemandMarketplaceCard({ demand, viewHref, joinHref, linkToRequesterProfile = true, showTrustBadges = true, viewDisabled = false, joinDisabled = false, className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
        className: [
            // -------------------------------------------------------------------
            // Card shell
            // -------------------------------------------------------------------
            //
            // The marketplace result stream determines the available width.
            //
            // The card consumes that width without establishing a fixed minimum
            // width and without introducing horizontal scrolling.
            //
            'w-full',
            'min-w-0',
            'overflow-hidden',
            'p-0',
            className
        ].filter(Boolean).join(' '),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: [
                // -----------------------------------------------------------------
                // Marketplace row
                // -----------------------------------------------------------------
                //
                // IMPORTANT:
                //
                // This remains horizontal at ALL viewport sizes.
                //
                // There is intentionally no `flex-col`.
                //
                'flex',
                'w-full',
                'min-w-0',
                'items-stretch'
            ].join(' '),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: [
                        MARKETPLACE_SECTION,
                        // Date remains the narrowest information column.
                        'flex-[0.8]'
                    ].join(' '),
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$demands$2f$demand$2d$card$2d$date$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DemandCardDate"], {
                        schedule: demand.schedule,
                        className: "w-full min-w-0"
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/demands/demand-marketplace-card.tsx",
                        lineNumber: 380,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/landing/demands/demand-marketplace-card.tsx",
                    lineNumber: 372,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: [
                        MARKETPLACE_SECTION,
                        // Requester communicates WHO is looking for travel.
                        'flex-[1.4]',
                        'border-l',
                        'border-[var(--border-subtle)]'
                    ].join(' '),
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$demands$2f$demand$2d$card$2d$requester$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DemandCardRequester"], {
                        requester: demand.requester,
                        linkToProfile: linkToRequesterProfile,
                        showTrustBadges: showTrustBadges,
                        className: "w-full min-w-0"
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/demands/demand-marketplace-card.tsx",
                        lineNumber: 401,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/landing/demands/demand-marketplace-card.tsx",
                    lineNumber: 390,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: [
                        MARKETPLACE_SECTION,
                        // Route receives the largest proportional share because
                        // origin → destination is the primary discovery information.
                        'flex-[1.6]',
                        'border-l',
                        'border-[var(--border-subtle)]'
                    ].join(' '),
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$demands$2f$demand$2d$card$2d$route$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DemandCardRoute"], {
                        route: demand.route,
                        className: "w-full min-w-0"
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/demands/demand-marketplace-card.tsx",
                        lineNumber: 425,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/landing/demands/demand-marketplace-card.tsx",
                    lineNumber: 413,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: [
                        MARKETPLACE_SECTION,
                        // Summary communicates the compact demand-side commercial and
                        // capacity context.
                        'flex-[1.4]',
                        'border-l',
                        'border-[var(--border-subtle)]'
                    ].join(' '),
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$demands$2f$demand$2d$card$2d$summary$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DemandCardSummary"], {
                        capacity: demand.capacity,
                        pricing: demand.pricing,
                        participants: demand.participants,
                        status: demand.status,
                        className: "w-full min-w-0"
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/demands/demand-marketplace-card.tsx",
                        lineNumber: 447,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/landing/demands/demand-marketplace-card.tsx",
                    lineNumber: 435,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: [
                        MARKETPLACE_SECTION,
                        // Actions remain visible as part of the same horizontal row.
                        'flex-[1.1]',
                        'border-l',
                        'border-[var(--border-subtle)]'
                    ].join(' '),
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$demands$2f$demand$2d$card$2d$actions$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DemandCardActions"], {
                        viewHref: viewHref,
                        joinHref: joinHref,
                        viewDisabled: viewDisabled,
                        joinDisabled: joinDisabled,
                        className: "w-full min-w-0"
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/demands/demand-marketplace-card.tsx",
                        lineNumber: 471,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/landing/demands/demand-marketplace-card.tsx",
                    lineNumber: 460,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/landing/demands/demand-marketplace-card.tsx",
            lineNumber: 350,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/landing/demands/demand-marketplace-card.tsx",
        lineNumber: 329,
        columnNumber: 5
    }, this);
}
_c = DemandMarketplaceCard;
var _c;
__turbopack_context__.k.register(_c, "DemandMarketplaceCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/landing/demands/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Marketplace Components
// -----------------------------------------------------------------------------
//
// Public barrel for Journey Demand marketplace presentation components.
//
// Consumers should import Journey Demand marketplace components through this
// barrel rather than depending directly on individual implementation files.
//
// Journey Demand is an independent marketplace feature domain. These
// components are responsible only for presenting a public Journey Demand and
// its associated:
//
//   - requested schedule
//   - requester
//   - route
//   - marketplace summary
//   - available navigation actions
//
// They do not:
//
// - fetch Journey Demand data;
// - manage Journey Demand state;
// - perform participation actions;
// - determine whether a visitor may join a Demand;
// - construct marketplace queries;
// - construct marketplace URLs;
// - contain marketplace composition/business logic.
//
// The public read model is supplied by the marketplace/application boundary.
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// Journey Demand Marketplace Card
// -----------------------------------------------------------------------------
//
// Composition root for the individual marketplace listing.
//
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$demands$2f$demand$2d$marketplace$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/demands/demand-marketplace-card.tsx [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// Journey Demand Requested Schedule
// -----------------------------------------------------------------------------
//
// Presents the Demand's flexible departure window and optional arrival
// requirements.
//
// NOTE:
//
// A Journey Demand does not necessarily have one concrete departureAt value.
// Therefore this replaces the old Journey-style date representation.
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$demands$2f$demand$2d$card$2d$date$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/demands/demand-card-date.tsx [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// Journey Demand Requester
// -----------------------------------------------------------------------------
//
// Presents the public traveller who created the Demand together with their
// public trust information.
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$demands$2f$demand$2d$card$2d$requester$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/demands/demand-card-requester.tsx [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// Journey Demand Route
// -----------------------------------------------------------------------------
//
// Presents the requested origin, destination, and intermediate locations.
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$demands$2f$demand$2d$card$2d$route$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/demands/demand-card-route.tsx [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// Journey Demand Marketplace Summary
// -----------------------------------------------------------------------------
//
// Presents the compact marketplace facts:
//
// - requested seats
// - remaining seats
// - matched seats
// - active participants
// - price expectation
// - public Demand status
//
// This intentionally replaces the former generic demand-card-details
// component. Marketplace cards should expose a focused summary rather than
// dumping every public Demand field into one component.
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$demands$2f$demand$2d$card$2d$summary$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/demands/demand-card-summary.tsx [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// Journey Demand Actions
// -----------------------------------------------------------------------------
//
// Navigation-only actions such as View Demand and Join Demand.
//
// Eligibility and participation rules remain outside the presentation
// component.
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$demands$2f$demand$2d$card$2d$actions$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/demands/demand-card-actions.tsx [app-client] (ecmascript)");
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
"[project]/src/components/landing/hero/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// -----------------------------------------------------------------------------
// sisiMove — Landing Hero Barrel
// -----------------------------------------------------------------------------
//
// Public barrel for landing-page hero presentation components.
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$hero$2f$landing$2d$hero$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/hero/landing-hero.tsx [app-client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/landing/hero/landing-hero.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LandingHero",
    ()=>LandingHero
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// sisiMove — Landing Hero
// -----------------------------------------------------------------------------
//
// The hero is intentionally presented as ONE unified visual block.
//
// The copy and the journey illustration belong to the same surface and tell
// the same marketplace story:
//
// ┌───────────────────────────────────────────────────────────────────────────┐
// │                                                                           │
// │  Going somewhere?                    Nairobi ────────→ Mombasa            │
// │  Someone may be going your way.     Journey          Demand               │
// │  [Explore journeys] [Share plan]                                           │
// │                                                                           │
// └───────────────────────────────────────────────────────────────────────────┘
//
// The illustration is supporting visual context, not a separate feature card.
//
// -----------------------------------------------------------------------------
//
// PUBLIC ACTION BOUNDARY
//
// This hero belongs to the public marketplace.
//
// Public visitors may:
//
// - Explore journeys.
// - View marketplace content.
// - View journey and demand details.
//
// Protected actions enter the authentication boundary:
//
// - Share a travel plan → /login
//
// The hero does not inspect authentication state, perform authorization, or
// decide whether the authenticated user is allowed to create a demand.
// Those decisions belong to the authenticated application flow.
//
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-right.mjs [app-client] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$car$2d$front$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CarFront$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/car-front.mjs [app-client] (ecmascript) <export default as CarFront>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.mjs [app-client] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2d$round$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UsersRound$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users-round.mjs [app-client] (ecmascript) <export default as UsersRound>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/foundation/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/utils/cn.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$routing$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/foundation/routing/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$routing$2f$authentication$2d$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/routing/authentication-routes.ts [app-client] (ecmascript)");
;
;
;
;
;
function LandingHero({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        "aria-labelledby": "landing-hero-heading",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('w-full px-1 py-3', 'sm:px-1.5 sm:py-4', 'md:px-2 md:py-5', 'lg:px-3 lg:py-6', className),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('relative isolate overflow-hidden', 'w-full', 'rounded-[var(--radius-2xl)]', 'border border-[var(--border)]', 'bg-[var(--surface)]', 'shadow-[var(--shadow-md)]'),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    "aria-hidden": "true",
                    className: "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('absolute -left-24 -top-24', 'h-64 w-64', 'rounded-full', 'bg-[var(--brand-soft)]', 'blur-3xl')
                        }, void 0, false, {
                            fileName: "[project]/src/components/landing/hero/landing-hero.tsx",
                            lineNumber: 107,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('absolute -bottom-32 -right-16', 'h-72 w-72', 'rounded-full', 'bg-[var(--background-brand)]', 'blur-3xl')
                        }, void 0, false, {
                            fileName: "[project]/src/components/landing/hero/landing-hero.tsx",
                            lineNumber: 117,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/landing/hero/landing-hero.tsx",
                    lineNumber: 103,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('grid min-w-0 items-center', 'grid-cols-1', 'gap-5', 'p-4', 'sm:gap-6 sm:p-6', 'md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]', 'md:gap-7 md:p-7', 'lg:gap-10 lg:p-9'),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "min-w-0",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('mb-3 flex items-center gap-2', 'text-xs font-semibold uppercase tracking-[0.16em]', 'text-[var(--brand)]', 'sm:mb-4'),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            "aria-hidden": "true",
                                            className: "h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand)]"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/landing/hero/landing-hero.tsx",
                                            lineNumber: 156,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Travel, shared"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/landing/hero/landing-hero.tsx",
                                            lineNumber: 161,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/landing/hero/landing-hero.tsx",
                                    lineNumber: 148,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    id: "landing-hero-heading",
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('max-w-xl', 'text-3xl font-semibold', 'leading-[1.08]', 'tracking-[-0.04em]', 'text-[var(--foreground)]', 'sm:text-4xl', 'lg:text-5xl'),
                                    children: [
                                        "Going somewhere?",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "block text-[var(--brand)]",
                                            children: "Someone may be going your way."
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/landing/hero/landing-hero.tsx",
                                            lineNumber: 179,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/landing/hero/landing-hero.tsx",
                                    lineNumber: 165,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('mt-4 max-w-lg', 'text-sm leading-6', 'text-[var(--foreground-secondary)]', 'sm:text-base sm:leading-7'),
                                    children: "Find available seats, join a travel plan, or share where you need to go. Discover journeys already moving across Kenya."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/landing/hero/landing-hero.tsx",
                                    lineNumber: 184,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('mt-5 flex flex-wrap items-center', 'gap-2.5', 'sm:mt-6'),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: "#marketplace",
                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('inline-flex min-h-10 items-center justify-center gap-2', 'rounded-[var(--radius-md)]', 'bg-[var(--brand)] px-4 py-2', 'text-sm font-semibold', 'text-[var(--brand-foreground)]', 'transition-colors', 'hover:bg-[var(--brand-hover)]', 'focus-visible:outline-none', 'focus-visible:ring-2', 'focus-visible:ring-[var(--brand)]', 'focus-visible:ring-offset-2'),
                                            children: [
                                                "Explore journeys",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                                    "aria-hidden": "true",
                                                    className: "h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/landing/hero/landing-hero.tsx",
                                                    lineNumber: 227,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/landing/hero/landing-hero.tsx",
                                            lineNumber: 209,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$routing$2f$authentication$2d$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AUTHENTICATION_ROUTES"].LOGIN,
                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('inline-flex min-h-10 items-center justify-center', 'rounded-[var(--radius-md)]', 'border border-[var(--border-strong)]', 'bg-[var(--surface)] px-4 py-2', 'text-sm font-semibold', 'text-[var(--foreground)]', 'transition-colors', 'hover:border-[var(--brand)]', 'hover:bg-[var(--brand-soft)]', 'hover:text-[var(--brand)]', 'focus-visible:outline-none', 'focus-visible:ring-2', 'focus-visible:ring-[var(--brand)]', 'focus-visible:ring-offset-2'),
                                            children: "Share a travel plan"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/landing/hero/landing-hero.tsx",
                                            lineNumber: 236,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/landing/hero/landing-hero.tsx",
                                    lineNumber: 199,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('mt-5 flex flex-wrap', 'gap-x-4 gap-y-2', 'text-xs', 'text-[var(--foreground-muted)]', 'sm:mt-6'),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "inline-flex items-center gap-1.5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$car$2d$front$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CarFront$3e$__["CarFront"], {
                                                    "aria-hidden": "true",
                                                    className: "h-3.5 w-3.5 text-[var(--brand)]"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/landing/hero/landing-hero.tsx",
                                                    lineNumber: 272,
                                                    columnNumber: 17
                                                }, this),
                                                "Published journeys"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/landing/hero/landing-hero.tsx",
                                            lineNumber: 271,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "inline-flex items-center gap-1.5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2d$round$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UsersRound$3e$__["UsersRound"], {
                                                    "aria-hidden": "true",
                                                    className: "h-3.5 w-3.5 text-[var(--brand)]"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/landing/hero/landing-hero.tsx",
                                                    lineNumber: 281,
                                                    columnNumber: 17
                                                }, this),
                                                "Travel demands"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/landing/hero/landing-hero.tsx",
                                            lineNumber: 280,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/landing/hero/landing-hero.tsx",
                                    lineNumber: 262,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/landing/hero/landing-hero.tsx",
                            lineNumber: 146,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative min-w-0",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('relative min-w-0', 'overflow-hidden', 'rounded-[var(--radius-xl)]', 'border border-[var(--border-subtle)]', 'bg-[var(--brand-soft)]/45', 'p-3', 'sm:p-4'),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex min-w-0 items-center justify-between gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "min-w-0",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('text-[10px] font-semibold uppercase', 'tracking-[0.14em]', 'text-[var(--foreground-muted)]'),
                                                        children: "A shared way"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/landing/hero/landing-hero.tsx",
                                                        lineNumber: 318,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('mt-1 truncate', 'text-sm font-semibold', 'text-[var(--foreground)]', 'sm:text-base'),
                                                        children: "Nairobi to Mombasa"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/landing/hero/landing-hero.tsx",
                                                        lineNumber: 328,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/landing/hero/landing-hero.tsx",
                                                lineNumber: 317,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('shrink-0 rounded-full', 'bg-[var(--surface)]', 'px-2 py-1', 'text-[10px] font-semibold', 'text-[var(--brand)]', 'shadow-[var(--shadow-sm)]'),
                                                children: "sisiMove"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/hero/landing-hero.tsx",
                                                lineNumber: 340,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/landing/hero/landing-hero.tsx",
                                        lineNumber: 316,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('relative', 'my-5 px-2', 'sm:my-6'),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                "aria-hidden": "true",
                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('absolute left-5 right-5 top-1/2', 'border-t border-dashed', 'border-[var(--border-strong)]')
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/hero/landing-hero.tsx",
                                                lineNumber: 365,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative flex items-center justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        "aria-hidden": "true",
                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('h-4 w-4 shrink-0 rounded-full', 'border-4 border-[var(--brand)]', 'bg-[var(--surface)]')
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/landing/hero/landing-hero.tsx",
                                                        lineNumber: 376,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        "aria-hidden": "true",
                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex h-8 w-8 shrink-0 items-center justify-center', 'rounded-full', 'border border-[var(--brand)]', 'bg-[var(--surface)]', 'text-[var(--brand)]', 'shadow-[var(--shadow-sm)]'),
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$car$2d$front$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CarFront$3e$__["CarFront"], {
                                                            className: "h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/landing/hero/landing-hero.tsx",
                                                            lineNumber: 396,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/landing/hero/landing-hero.tsx",
                                                        lineNumber: 385,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        "aria-hidden": "true",
                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('h-4 w-4 shrink-0 rounded-full', 'border-4 border-[var(--brand)]', 'bg-[var(--surface)]')
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/landing/hero/landing-hero.tsx",
                                                        lineNumber: 399,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/landing/hero/landing-hero.tsx",
                                                lineNumber: 375,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('mt-2 flex justify-between gap-3', 'text-[11px] font-medium', 'text-[var(--foreground-secondary)]'),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Nairobi"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/landing/hero/landing-hero.tsx",
                                                        lineNumber: 416,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Mombasa"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/landing/hero/landing-hero.tsx",
                                                        lineNumber: 417,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/landing/hero/landing-hero.tsx",
                                                lineNumber: 409,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/landing/hero/landing-hero.tsx",
                                        lineNumber: 357,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('grid', 'grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]', 'items-center gap-2'),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('min-w-0', 'rounded-[var(--radius-lg)]', 'border border-[var(--border)]', 'bg-[var(--surface)]', 'p-2.5', 'sm:p-3'),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex items-center gap-1.5', 'text-[10px] font-semibold uppercase', 'tracking-wide', 'text-[var(--brand)]'),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$car$2d$front$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CarFront$3e$__["CarFront"], {
                                                                "aria-hidden": "true",
                                                                className: "h-3.5 w-3.5 shrink-0"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/landing/hero/landing-hero.tsx",
                                                                lineNumber: 450,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Journey"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/landing/hero/landing-hero.tsx",
                                                                lineNumber: 455,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/landing/hero/landing-hero.tsx",
                                                        lineNumber: 442,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('mt-2 truncate', 'text-xs font-semibold', 'text-[var(--foreground)]', 'sm:text-sm'),
                                                        children: "Available seats"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/landing/hero/landing-hero.tsx",
                                                        lineNumber: 458,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "mt-1 text-[11px] text-[var(--foreground-muted)]",
                                                        children: "Share the ride"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/landing/hero/landing-hero.tsx",
                                                        lineNumber: 469,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/landing/hero/landing-hero.tsx",
                                                lineNumber: 432,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                "aria-hidden": "true",
                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex h-7 w-7 shrink-0 items-center justify-center', 'rounded-full', 'border border-[var(--border-strong)]', 'bg-[var(--surface)]', 'text-[var(--brand)]'),
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                                    className: "h-3.5 w-3.5"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/landing/hero/landing-hero.tsx",
                                                    lineNumber: 485,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/hero/landing-hero.tsx",
                                                lineNumber: 475,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('min-w-0', 'rounded-[var(--radius-lg)]', 'border border-[var(--border)]', 'bg-[var(--surface)]', 'p-2.5', 'sm:p-3'),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex items-center gap-1.5', 'text-[10px] font-semibold uppercase', 'tracking-wide', 'text-[var(--brand)]'),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2d$round$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UsersRound$3e$__["UsersRound"], {
                                                                "aria-hidden": "true",
                                                                className: "h-3.5 w-3.5 shrink-0"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/landing/hero/landing-hero.tsx",
                                                                lineNumber: 507,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Demand"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/landing/hero/landing-hero.tsx",
                                                                lineNumber: 512,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/landing/hero/landing-hero.tsx",
                                                        lineNumber: 499,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('mt-2 truncate', 'text-xs font-semibold', 'text-[var(--foreground)]', 'sm:text-sm'),
                                                        children: "Looking to travel"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/landing/hero/landing-hero.tsx",
                                                        lineNumber: 515,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "mt-1 text-[11px] text-[var(--foreground-muted)]",
                                                        children: "Find a match"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/landing/hero/landing-hero.tsx",
                                                        lineNumber: 526,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/landing/hero/landing-hero.tsx",
                                                lineNumber: 489,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/landing/hero/landing-hero.tsx",
                                        lineNumber: 424,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('mt-4 flex items-center gap-2', 'border-t border-[var(--border-subtle)]', 'pt-3', 'text-[11px]', 'text-[var(--foreground-muted)]'),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                                "aria-hidden": "true",
                                                className: "h-3.5 w-3.5 shrink-0 text-[var(--brand)]"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/hero/landing-hero.tsx",
                                                lineNumber: 544,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "One marketplace. More ways to get there."
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/hero/landing-hero.tsx",
                                                lineNumber: 549,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/landing/hero/landing-hero.tsx",
                                        lineNumber: 535,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/landing/hero/landing-hero.tsx",
                                lineNumber: 302,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/landing/hero/landing-hero.tsx",
                            lineNumber: 294,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/landing/hero/landing-hero.tsx",
                    lineNumber: 131,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/landing/hero/landing-hero.tsx",
            lineNumber: 90,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/landing/hero/landing-hero.tsx",
        lineNumber: 77,
        columnNumber: 5
    }, this);
}
_c = LandingHero;
var _c;
__turbopack_context__.k.register(_c, "LandingHero");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/landing/how-it-works/how-it-works-section.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HowItWorksSection",
    ()=>HowItWorksSection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// sisiMove — How It Works Section
// -----------------------------------------------------------------------------
//
// Public landing-page explanation of how the sisiMove marketplace works.
//
// The marketplace has two primary objects:
//
//     JOURNEY
//     Someone is already travelling and has available seats.
//
//     JOURNEY DEMAND
//     Someone wants to travel and is looking for a suitable journey.
//
// The section explains the marketplace loop:
//
//     Browse → Find a match → Travel
//
// It also shows the two ways a person can participate:
//
//     Already travelling → Publish a Journey
//     Need to travel     → Create a Journey Demand
//
// -----------------------------------------------------------------------------
// ARCHITECTURE
// -----------------------------------------------------------------------------
//
// Presentation-only.
//
// This component does NOT:
//
// - fetch marketplace data;
// - create Journeys;
// - create Journey Demands;
// - perform bookings;
// - perform authentication;
// - determine permissions;
// - resolve marketplace matches;
// - manage Journey or Demand lifecycle state.
//
// IMPORTANT PUBLIC-MARKETPLACE RULE:
//
// This section is rendered on the public landing page.
//
// Therefore the participation CTAs must NOT navigate directly to protected
// creation routes.
//
// Public visitor:
//
//     Publish a journey  → Sign in
//     Create demand      → Sign in
//
// After authentication, the authenticated marketplace/application boundary
// determines whether the user can continue or must complete verification.
//
// Route ownership remains in the routing foundation. This component consumes
// the authentication route rather than hardcoding `/login`.
//
// Links are navigation destinations supplied through props.
//
// -----------------------------------------------------------------------------
// BRANDING
// -----------------------------------------------------------------------------
//
// Visible sisiMove wordmarks use:
//
//     sisi → foreground / black
//     Move → brand / blue
//
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-right.mjs [app-client] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$car$2d$front$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CarFront$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/car-front.mjs [app-client] (ecmascript) <export default as CarFront>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check.mjs [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.mjs [app-client] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.mjs [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.mjs [app-client] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2d$round$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UsersRound$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users-round.mjs [app-client] (ecmascript) <export default as UsersRound>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/foundation/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/utils/cn.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$routing$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/foundation/routing/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$routing$2f$authentication$2d$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/routing/authentication-routes.ts [app-client] (ecmascript)");
;
;
;
;
;
function HowItWorksSection({ createDemandHref = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$routing$2f$authentication$2d$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AUTHENTICATION_ROUTES"].LOGIN, publishJourneyHref = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$routing$2f$authentication$2d$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AUTHENTICATION_ROUTES"].LOGIN, className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        "aria-labelledby": "how-it-works-heading",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('w-full min-w-0', 'border-t border-[var(--border-subtle)]', 'bg-[var(--background)]', className),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('mx-auto w-full max-w-7xl', 'px-1 py-8', 'sm:px-1.5 sm:py-10', 'md:px-2 md:py-12', 'lg:px-3 lg:py-14'),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-2xl",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('inline-flex items-center gap-2', 'text-xs font-semibold uppercase tracking-[0.16em]', 'text-[var(--brand)]'),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                    "aria-hidden": "true",
                                    className: "h-3.5 w-3.5"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/landing/how-it-works/how-it-works-section.tsx",
                                    lineNumber: 157,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: [
                                        "How",
                                        ' ',
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            "aria-label": "sisiMove",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[var(--foreground)]",
                                                    children: "sisi"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/landing/how-it-works/how-it-works-section.tsx",
                                                    lineNumber: 165,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[var(--brand)]",
                                                    children: "Move"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/landing/how-it-works/how-it-works-section.tsx",
                                                    lineNumber: 166,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/landing/how-it-works/how-it-works-section.tsx",
                                            lineNumber: 164,
                                            columnNumber: 15
                                        }, this),
                                        ' ',
                                        "works"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/landing/how-it-works/how-it-works-section.tsx",
                                    lineNumber: 162,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/landing/how-it-works/how-it-works-section.tsx",
                            lineNumber: 150,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            id: "how-it-works-heading",
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('mt-2', 'text-2xl font-semibold', 'leading-tight tracking-[-0.03em]', 'text-[var(--foreground)]', 'sm:text-3xl'),
                            children: "A simpler way to find your way there."
                        }, void 0, false, {
                            fileName: "[project]/src/components/landing/how-it-works/how-it-works-section.tsx",
                            lineNumber: 172,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('mt-3 max-w-xl', 'text-sm leading-6', 'text-[var(--foreground-secondary)]', 'sm:text-base sm:leading-7'),
                            children: "Browse journeys already happening, make your travel need visible, and connect around a route that works for everyone."
                        }, void 0, false, {
                            fileName: "[project]/src/components/landing/how-it-works/how-it-works-section.tsx",
                            lineNumber: 185,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/landing/how-it-works/how-it-works-section.tsx",
                    lineNumber: 149,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative mt-7 sm:mt-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            "aria-hidden": "true",
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('absolute left-[16.66%] right-[16.66%] top-7', 'hidden border-t border-dashed', 'border-[var(--border-strong)]', 'sm:block')
                        }, void 0, false, {
                            fileName: "[project]/src/components/landing/how-it-works/how-it-works-section.tsx",
                            lineNumber: 209,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('relative grid min-w-0', 'gap-3', 'sm:grid-cols-3 sm:gap-4'),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(HowItWorksStep, {
                                    number: "01",
                                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"],
                                    title: "Browse",
                                    description: "See journeys and travel demands already visible in the marketplace."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/landing/how-it-works/how-it-works-section.tsx",
                                    lineNumber: 226,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(HowItWorksStep, {
                                    number: "02",
                                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"],
                                    title: "Find a match",
                                    description: "Choose an available seat or find a travel plan that fits your route."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/landing/how-it-works/how-it-works-section.tsx",
                                    lineNumber: 233,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(HowItWorksStep, {
                                    number: "03",
                                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"],
                                    title: "Travel",
                                    description: "Arrange the details, meet at the agreed place, and travel together."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/landing/how-it-works/how-it-works-section.tsx",
                                    lineNumber: 240,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/landing/how-it-works/how-it-works-section.tsx",
                            lineNumber: 219,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/landing/how-it-works/how-it-works-section.tsx",
                    lineNumber: 202,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-7 sm:mt-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-3 flex items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    "aria-hidden": "true",
                                    className: "h-px flex-1 bg-[var(--border-subtle)]"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/landing/how-it-works/how-it-works-section.tsx",
                                    lineNumber: 255,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('shrink-0 px-2', 'text-[10px] font-semibold uppercase', 'tracking-[0.16em]', 'text-[var(--foreground-subtle)]'),
                                    children: "Your side of the marketplace"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/landing/how-it-works/how-it-works-section.tsx",
                                    lineNumber: 260,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    "aria-hidden": "true",
                                    className: "h-px flex-1 bg-[var(--border-subtle)]"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/landing/how-it-works/how-it-works-section.tsx",
                                    lineNumber: 271,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/landing/how-it-works/how-it-works-section.tsx",
                            lineNumber: 254,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('grid min-w-0', 'gap-3', 'md:grid-cols-2 md:gap-4'),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MarketplacePath, {
                                    eyebrow: "Already travelling?",
                                    title: "Turn an empty seat into a shared journey.",
                                    description: "Publish the Journey you are already making and let travellers going your way discover the available seats.",
                                    href: publishJourneyHref,
                                    actionLabel: "Publish a journey",
                                    variant: "journey"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/landing/how-it-works/how-it-works-section.tsx",
                                    lineNumber: 284,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MarketplacePath, {
                                    eyebrow: "Need a journey?",
                                    title: "Put your travel plan on the map.",
                                    description: "Create a Journey Demand with where and when you want to travel, then let suitable journeys find the opportunity.",
                                    href: createDemandHref,
                                    actionLabel: "Create travel demand",
                                    variant: "demand"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/landing/how-it-works/how-it-works-section.tsx",
                                    lineNumber: 293,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/landing/how-it-works/how-it-works-section.tsx",
                            lineNumber: 277,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/landing/how-it-works/how-it-works-section.tsx",
                    lineNumber: 253,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('relative mt-5 overflow-hidden', 'rounded-[var(--radius-xl)]', 'border border-[var(--border)]', 'bg-[var(--background-subtle)]', 'px-4 py-4', 'sm:px-5 sm:py-5'),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            "aria-hidden": "true",
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('pointer-events-none absolute -right-12 -top-16', 'h-36 w-36 rounded-full', 'bg-[var(--brand-soft)]', 'blur-3xl')
                        }, void 0, false, {
                            fileName: "[project]/src/components/landing/how-it-works/how-it-works-section.tsx",
                            lineNumber: 319,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('relative flex min-w-0 flex-col', 'gap-4', 'sm:flex-row sm:items-center sm:justify-between'),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex min-w-0 items-start gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex h-9 w-9 shrink-0 items-center justify-center', 'rounded-[var(--radius-md)]', 'bg-[var(--brand-soft)]', 'text-[var(--brand)]'),
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2d$round$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UsersRound$3e$__["UsersRound"], {
                                                "aria-hidden": "true",
                                                className: "h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/how-it-works/how-it-works-section.tsx",
                                                lineNumber: 345,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/landing/how-it-works/how-it-works-section.tsx",
                                            lineNumber: 337,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "min-w-0",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm font-semibold text-[var(--foreground)]",
                                                    children: "Supply meets demand."
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/landing/how-it-works/how-it-works-section.tsx",
                                                    lineNumber: 352,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('mt-0.5 max-w-2xl', 'text-xs leading-5', 'text-[var(--foreground-muted)]', 'sm:text-sm'),
                                                    children: "The more journeys and travel plans people share, the more opportunities there are to travel the same way."
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/landing/how-it-works/how-it-works-section.tsx",
                                                    lineNumber: 356,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/landing/how-it-works/how-it-works-section.tsx",
                                            lineNumber: 351,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/landing/how-it-works/how-it-works-section.tsx",
                                    lineNumber: 336,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    "aria-hidden": "true",
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('hidden h-9 w-9 shrink-0 items-center justify-center', 'rounded-full', 'border border-[var(--border)]', 'bg-[var(--surface)]', 'text-[var(--brand)]', 'sm:flex'),
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/how-it-works/how-it-works-section.tsx",
                                        lineNumber: 381,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/landing/how-it-works/how-it-works-section.tsx",
                                    lineNumber: 370,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/landing/how-it-works/how-it-works-section.tsx",
                            lineNumber: 329,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/landing/how-it-works/how-it-works-section.tsx",
                    lineNumber: 308,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/landing/how-it-works/how-it-works-section.tsx",
            lineNumber: 136,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/landing/how-it-works/how-it-works-section.tsx",
        lineNumber: 127,
        columnNumber: 5
    }, this);
}
_c = HowItWorksSection;
function MarketplacePath({ eyebrow, title, description, href, actionLabel, variant }) {
    const isJourney = variant === 'journey';
    /*
   * Resolve the visual treatment once instead of passing conditional arrays
   * into cn(). This keeps every cn() argument compatible with the project's
   * class-name utility.
   */ const cardTone = isJourney ? 'border-[var(--success)]/20 bg-[var(--success-soft)]' : 'border-[var(--brand)]/20 bg-[var(--brand-soft)]';
    const iconTone = isJourney ? 'text-[var(--success)]' : 'text-[var(--brand)]';
    const labelTone = isJourney ? 'text-[var(--success)]' : 'text-[var(--brand)]';
    const glowTone = isJourney ? 'bg-[var(--success)]/10' : 'bg-[var(--brand)]/10';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('group relative min-w-0 overflow-hidden', 'rounded-[var(--radius-xl)]', 'border', 'p-5', 'transition-shadow duration-200', 'hover:shadow-[var(--shadow-md)]', 'sm:p-6', cardTone),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                "aria-hidden": "true",
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('pointer-events-none absolute -right-10 -top-10', 'h-28 w-28 rounded-full', 'blur-2xl', glowTone)
            }, void 0, false, {
                fileName: "[project]/src/components/landing/how-it-works/how-it-works-section.tsx",
                lineNumber: 448,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex min-w-0 items-center justify-between gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex h-10 w-10 shrink-0 items-center justify-center', 'rounded-[var(--radius-md)]', 'bg-[var(--surface)]', iconTone),
                                children: isJourney ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$car$2d$front$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CarFront$3e$__["CarFront"], {
                                    "aria-hidden": "true",
                                    className: "h-5 w-5"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/landing/how-it-works/how-it-works-section.tsx",
                                    lineNumber: 470,
                                    columnNumber: 15
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2d$round$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UsersRound$3e$__["UsersRound"], {
                                    "aria-hidden": "true",
                                    className: "h-5 w-5"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/landing/how-it-works/how-it-works-section.tsx",
                                    lineNumber: 475,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/landing/how-it-works/how-it-works-section.tsx",
                                lineNumber: 461,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('rounded-full', 'bg-[var(--surface)]/80', 'px-2.5 py-1', 'text-[10px] font-semibold uppercase tracking-[0.12em]', labelTone),
                                children: isJourney ? 'Journey' : 'Demand'
                            }, void 0, false, {
                                fileName: "[project]/src/components/landing/how-it-works/how-it-works-section.tsx",
                                lineNumber: 482,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/landing/how-it-works/how-it-works-section.tsx",
                        lineNumber: 460,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('mt-4', 'text-[10px] font-semibold uppercase', 'tracking-[0.16em]', labelTone),
                        children: eyebrow
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/how-it-works/how-it-works-section.tsx",
                        lineNumber: 495,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('mt-1.5 max-w-lg', 'text-lg font-semibold', 'leading-snug tracking-[-0.02em]', 'text-[var(--foreground)]', 'sm:text-xl'),
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/how-it-works/how-it-works-section.tsx",
                        lineNumber: 506,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('mt-2 max-w-xl', 'text-sm leading-6', 'text-[var(--foreground-secondary)]'),
                        children: description
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/how-it-works/how-it-works-section.tsx",
                        lineNumber: 518,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-5",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: href,
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('inline-flex min-h-10 items-center justify-center gap-2', 'rounded-[var(--radius-md)]', 'border border-[var(--border)]', 'bg-[var(--surface)]', 'px-4 py-2', 'text-sm font-semibold', labelTone, 'shadow-[var(--shadow-sm)]', 'transition-all', 'hover:border-[var(--border-strong)]', 'hover:shadow-[var(--shadow-md)]', 'focus-visible:outline-none', 'focus-visible:ring-2', 'focus-visible:ring-[var(--brand)]', 'focus-visible:ring-offset-2'),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: actionLabel
                                }, void 0, false, {
                                    fileName: "[project]/src/components/landing/how-it-works/how-it-works-section.tsx",
                                    lineNumber: 549,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                    "aria-hidden": "true",
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('h-4 w-4', 'transition-transform duration-200', 'group-hover:translate-x-0.5')
                                }, void 0, false, {
                                    fileName: "[project]/src/components/landing/how-it-works/how-it-works-section.tsx",
                                    lineNumber: 551,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/landing/how-it-works/how-it-works-section.tsx",
                            lineNumber: 529,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/how-it-works/how-it-works-section.tsx",
                        lineNumber: 528,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/landing/how-it-works/how-it-works-section.tsx",
                lineNumber: 458,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/landing/how-it-works/how-it-works-section.tsx",
        lineNumber: 435,
        columnNumber: 5
    }, this);
}
_c1 = MarketplacePath;
function HowItWorksStep({ number, icon: Icon, title, description }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('relative min-w-0', 'rounded-[var(--radius-xl)]', 'border border-[var(--border)]', 'bg-[var(--surface)]', 'p-4', 'shadow-[var(--shadow-sm)]', 'sm:p-5'),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex h-9 w-9 shrink-0 items-center justify-center', 'rounded-full', 'bg-[var(--brand-soft)]', 'text-[var(--brand)]'),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                            "aria-hidden": "true",
                            className: "h-4 w-4"
                        }, void 0, false, {
                            fileName: "[project]/src/components/landing/how-it-works/how-it-works-section.tsx",
                            lineNumber: 612,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/how-it-works/how-it-works-section.tsx",
                        lineNumber: 604,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('text-[10px] font-semibold', 'tracking-[0.12em]', 'text-[var(--foreground-subtle)]'),
                                children: number
                            }, void 0, false, {
                                fileName: "[project]/src/components/landing/how-it-works/how-it-works-section.tsx",
                                lineNumber: 619,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('mt-0.5', 'text-sm font-semibold', 'text-[var(--foreground)]'),
                                children: title
                            }, void 0, false, {
                                fileName: "[project]/src/components/landing/how-it-works/how-it-works-section.tsx",
                                lineNumber: 629,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/landing/how-it-works/how-it-works-section.tsx",
                        lineNumber: 618,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/landing/how-it-works/how-it-works-section.tsx",
                lineNumber: 603,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('mt-3', 'text-sm leading-6', 'text-[var(--foreground-muted)]'),
                children: description
            }, void 0, false, {
                fileName: "[project]/src/components/landing/how-it-works/how-it-works-section.tsx",
                lineNumber: 641,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/landing/how-it-works/how-it-works-section.tsx",
        lineNumber: 592,
        columnNumber: 5
    }, this);
}
_c2 = HowItWorksStep;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "HowItWorksSection");
__turbopack_context__.k.register(_c1, "MarketplacePath");
__turbopack_context__.k.register(_c2, "HowItWorksStep");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/landing/how-it-works/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// -----------------------------------------------------------------------------
// sisiMove — How It Works
// -----------------------------------------------------------------------------
//
// Public barrel for landing-page How It Works components.
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$how$2d$it$2d$works$2f$how$2d$it$2d$works$2d$section$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/how-it-works/how-it-works-section.tsx [app-client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/landing/journeys/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// -----------------------------------------------------------------------------
// sisiMove — Journey Marketplace Components
// -----------------------------------------------------------------------------
//
// Public barrel for Journey marketplace presentation components.
//
// Consumers should import Journey marketplace components through this barrel
// rather than depending directly on individual implementation files.
//
// Journey is the primary marketplace supply feature.
//
// These components are presentation-only. They consume the public Journey
// read model and render the individual marketplace sections:
//
//   JourneyMarketplaceCard
//   ├── JourneyCardDate
//   ├── JourneyCardProvider
//   ├── JourneyCardRoute
//   ├── JourneyCardVehicle
//   ├── JourneyCardPrice
//   └── JourneyCardActions
//
// They do not:
//
// - fetch Journey data;
// - manage Journey state;
// - perform booking actions;
// - determine booking eligibility;
// - construct marketplace queries;
// - perform marketplace filtering or sorting;
// - resolve cross-domain references;
// - contain Journey business rules.
//
// The marketplace composition remains owned by the parent marketplace layer.
// These components only present the public Journey read model.
//
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// Journey Marketplace Card
// -----------------------------------------------------------------------------
//
// Top-level Journey marketplace listing.
//
// This is the component consumers normally use when rendering a Journey in
// the public marketplace result stream.
//
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$journeys$2f$journey$2d$marketplace$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/journeys/journey-marketplace-card.tsx [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// Journey Date
// -----------------------------------------------------------------------------
//
// Compact departure date/time presentation.
//
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$journeys$2f$journey$2d$card$2d$date$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/journeys/journey-card-date.tsx [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// Journey Provider
// -----------------------------------------------------------------------------
//
// Public provider identity and trust presentation.
//
// Journey remains the owner of the provider relationship. Traveller and Trust
// are read-side enrichment exposed through the Journey public read model.
//
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$journeys$2f$journey$2d$card$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/journeys/journey-card-provider.tsx [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// Journey Route
// -----------------------------------------------------------------------------
//
// Origin, destination, and intermediate waypoint presentation.
//
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$journeys$2f$journey$2d$card$2d$route$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/journeys/journey-card-route.tsx [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// Journey Vehicle
// -----------------------------------------------------------------------------
//
// Vehicle image and compact vehicle identity presentation.
//
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$journeys$2f$journey$2d$card$2d$vehicle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/journeys/journey-card-vehicle.tsx [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// Journey Price
// -----------------------------------------------------------------------------
//
// Price-per-seat and seat availability presentation.
//
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$journeys$2f$journey$2d$card$2d$price$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/journeys/journey-card-price.tsx [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// Journey Actions
// -----------------------------------------------------------------------------
//
// Marketplace navigation actions such as View Journey and optional Book.
//
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$journeys$2f$journey$2d$card$2d$actions$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/journeys/journey-card-actions.tsx [app-client] (ecmascript)");
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
"[project]/src/components/landing/journeys/journey-card-actions.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "JourneyCardActions",
    ()=>JourneyCardActions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// sisiMove — Journey Marketplace Card Actions
// -----------------------------------------------------------------------------
//
// Presentation component for the action area of a public Journey marketplace
// listing.
//
// MARKETPLACE PHILOSOPHY
// ----------------------
//
// A Journey marketplace card is intentionally a compact marketplace row:
//
//   WHEN → WHO → WHERE → VEHICLE → PRICE/SEATS → ACTIONS
//
// The action column contains only the actions that the parent marketplace
// read model has explicitly made available.
//
// Current actions:
//
//   1. View
//      Opens the public Journey detail page.
//
//   2. Book
//      Opens the booking flow when the parent supplies a booking destination.
//
// PRESENTATION BOUNDARY
// ---------------------
//
// This component is presentation-only.
//
// It deliberately does not:
//
// - determine whether a Journey is bookable;
// - inspect Journey status;
// - inspect seat availability;
// - check authentication;
// - determine booking eligibility;
// - create a booking;
// - perform programmatic navigation;
// - construct URLs;
// - fetch data;
// - contain Journey or Booking business rules.
//
// The parent owns those decisions and supplies the resulting destinations.
//
// BOOKING CONTRACT
// ----------------
//
// `bookHref` is the presentation-level signal that a Book action exists.
//
//   bookHref provided
//       → render Book.
//
//   bookHref omitted
//       → do not render Book.
//
// This component does not infer why a booking destination is absent.
//
// DISABLED LINKS
// --------------
//
// These controls remain Next.js Links because their normal behavior is
// navigation to a destination supplied by the parent.
//
// When disabled:
//
// - aria-disabled communicates the state to assistive technology;
// - tabIndex={-1} removes the link from normal keyboard navigation;
// - preventDefault() prevents navigation;
// - visual styling communicates the unavailable state.
//
// RESPONSIVE MARKETPLACE RULE
// ---------------------------
//
// The parent marketplace card owns the action column allocation.
//
// This component intentionally does NOT:
//
// - set a fixed column width;
// - set a minimum column width;
// - use shrink-0 on the action column;
// - add marketplace-level padding;
// - control the complete marketplace row.
//
// The parent is responsible for the column allocation:
//
//     Date | Provider | Route | Vehicle | Price | Actions
//
// VERTICAL POSITIONING
// --------------------
//
// Unlike the information columns, the action group is intentionally aligned
// toward the lower part of the marketplace row.
//
// This prevents:
//
//     Price
//     per seat
//     available
//     [View]
//     [Book]
//
// from visually collapsing into one dense vertical block.
//
// The action area therefore uses `justify-end`.
//
// The marketplace parent still controls the row's overall height.
//
// DESIGN-SYSTEM BOUNDARY
// ----------------------
//
// Uses only sisiMove global design tokens:
//
//   --brand
//   --brand-hover
//   --background
//   --background-muted
//   --foreground
//   --foreground-subtle
//   --border
//   --border-strong
//
// No generic or nonexistent tokens are introduced.
//
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
;
;
// -----------------------------------------------------------------------------
// Disabled navigation helper
// -----------------------------------------------------------------------------
//
// Next.js Link does not expose a native disabled state.
//
// The parent can therefore mark a navigation action as unavailable while this
// component handles only the presentation mechanics required to prevent the
// link from navigating.
//
// -----------------------------------------------------------------------------
function handleDisabledClick(event) {
    event.preventDefault();
}
// -----------------------------------------------------------------------------
// Shared control classes
// -----------------------------------------------------------------------------
//
// The two actions share the same responsive geometry and typography.
//
// Keeping the shared structure here makes it harder for View and Book to drift
// apart as the marketplace density is refined.
//
// -----------------------------------------------------------------------------
const ACTION_BASE = [
    'inline-flex',
    'min-h-8',
    'sm:min-h-8',
    'md:min-h-9',
    'w-full',
    'min-w-0',
    'items-center',
    'justify-center',
    'rounded-[var(--radius-md)]',
    'px-2',
    'py-1',
    'sm:px-2.5',
    'sm:py-1.5',
    'md:px-3',
    'md:py-1.5',
    'text-[11px]',
    'sm:text-xs',
    'md:text-sm',
    'font-medium',
    'leading-tight',
    'transition-colors',
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-[color:var(--brand)]',
    'focus-visible:ring-offset-2',
    'focus-visible:ring-offset-[color:var(--background)]'
].join(' ');
function JourneyCardActions({ viewHref, bookHref, viewDisabled = false, bookDisabled = false, className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: [
            // -------------------------------------------------------------------
            // Action content boundary
            // -------------------------------------------------------------------
            //
            // The parent owns the marketplace column width and outer section
            // padding.
            //
            // `justify-end` is intentional. Actions sit toward the lower part of
            // the marketplace row instead of competing vertically with the price.
            //
            'flex',
            'min-w-0',
            'flex-col',
            'justify-end',
            // -------------------------------------------------------------------
            // Responsive internal density
            // -------------------------------------------------------------------
            'gap-1',
            'sm:gap-1.5',
            'md:gap-2',
            // -------------------------------------------------------------------
            // Small separation from the marketplace information above.
            //
            // This is internal action spacing, not marketplace-level padding.
            // -------------------------------------------------------------------
            'pt-1.5',
            'sm:pt-2',
            'md:pt-2.5',
            className
        ].filter(Boolean).join(' '),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                href: viewHref,
                "aria-disabled": viewDisabled,
                tabIndex: viewDisabled ? -1 : undefined,
                onClick: viewDisabled ? handleDisabledClick : undefined,
                className: [
                    ACTION_BASE,
                    viewDisabled ? [
                        'cursor-not-allowed',
                        'border',
                        'border-[var(--border)]',
                        'text-[var(--foreground-subtle)]',
                        'opacity-60',
                        'pointer-events-none'
                    ].join(' ') : [
                        'border',
                        'border-[var(--border)]',
                        'bg-[var(--background)]',
                        'text-[var(--foreground)]',
                        'hover:border-[var(--border-strong)]',
                        'hover:bg-[var(--background-muted)]'
                    ].join(' ')
                ].join(' '),
                children: "View"
            }, void 0, false, {
                fileName: "[project]/src/components/landing/journeys/journey-card-actions.tsx",
                lineNumber: 281,
                columnNumber: 7
            }, this),
            bookHref && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                href: bookHref,
                "aria-disabled": bookDisabled,
                tabIndex: bookDisabled ? -1 : undefined,
                onClick: bookDisabled ? handleDisabledClick : undefined,
                className: [
                    ACTION_BASE,
                    bookDisabled ? [
                        'cursor-not-allowed',
                        'bg-[var(--brand)]',
                        'text-white',
                        'opacity-50',
                        'pointer-events-none'
                    ].join(' ') : [
                        'bg-[var(--brand)]',
                        'text-white',
                        'hover:bg-[var(--brand-hover)]'
                    ].join(' ')
                ].join(' '),
                children: "Book"
            }, void 0, false, {
                fileName: "[project]/src/components/landing/journeys/journey-card-actions.tsx",
                lineNumber: 316,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/landing/journeys/journey-card-actions.tsx",
        lineNumber: 237,
        columnNumber: 5
    }, this);
}
_c = JourneyCardActions;
var _c;
__turbopack_context__.k.register(_c, "JourneyCardActions");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/landing/journeys/journey-card-date.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Journey Marketplace Card Date
// -----------------------------------------------------------------------------
//
// Compact presentation component for the departure date/time displayed in a
// public Journey marketplace listing.
//
// MARKETPLACE ROLE
// ---------------
//
// The Journey marketplace row communicates:
//
//   WHEN → WHO → WHERE → VEHICLE → PRICE/SEATS → ACTIONS
//
// This component owns only the `WHEN` portion.
//
// Its visual hierarchy is:
//
//   TUE
//   16
//   SEP 2026
//   23:33
//
// PRESENTATION BOUNDARY
// ---------------------
//
// This component is presentation-only.
//
// It deliberately does not:
//
// - determine whether a Journey is upcoming;
// - determine whether a Journey is bookable;
// - calculate Journey duration;
// - determine Journey availability;
// - fetch Journey data;
// - construct URLs;
// - contain Journey business rules;
// - modify the supplied date.
//
// The parent supplies the Journey departure value and, optionally, the
// timezone in which that departure should be presented.
//
// DATE / TIMEZONE HANDLING
// ------------------------
//
// The incoming value may be:
//
//   - an ISO date string;
//   - a Date instance.
//
// The component formats the value for the public marketplace using:
//
//   en-KE
//
// When an IANA timezone is supplied, the timestamp is explicitly presented
// in that timezone. This prevents the browser's local timezone from silently
// becoming the presentation timezone for a real-world Journey departure.
//
// When no timezone is supplied, Intl.DateTimeFormat uses the runtime's
// timezone. The public read model should preferably provide an explicit
// Journey timezone.
//
// RESPONSIVE MARKETPLACE DENSITY
// ------------------------------
//
// The marketplace parent owns:
//
// - column width;
// - column padding;
// - column separators;
// - marketplace row geometry.
//
// This component owns only the density of its internal date content.
//
// Consequently it deliberately does NOT:
//
// - define a fixed width;
// - use shrink-0 for the marketplace column;
// - add marketplace-level horizontal padding;
// - add marketplace-level vertical padding;
// - control the complete marketplace row.
//
// Its typography and internal spacing contract progressively:
//
//   mobile → small → medium → large
//
// This keeps the date block visually proportional with the other marketplace
// columns.
//
// DESIGN-SYSTEM BOUNDARY
// ----------------------
//
// Uses only sisiMove global design tokens:
//
//   --foreground
//   --foreground-secondary
//   --foreground-muted
//   --foreground-subtle
//
// No generic or nonexistent tokens are introduced.
//
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "JourneyCardDate",
    ()=>JourneyCardDate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
// -----------------------------------------------------------------------------
// Date formatter
// -----------------------------------------------------------------------------
/**
 * Formats the individual values used by the marketplace date block.
 *
 * The values remain separate rather than becoming one localized date string
 * because the marketplace intentionally gives each part a different visual
 * weight.
 */ function formatDepartureDate(departureAt, timeZone) {
    const date = departureAt instanceof Date ? departureAt : new Date(departureAt);
    // ---------------------------------------------------------------------------
    // Invalid runtime value
    // ---------------------------------------------------------------------------
    //
    // A malformed timestamp should not cause the entire marketplace to fail
    // during rendering.
    //
    // The upstream public read model should normally guarantee a valid
    // timestamp. This is only a presentation-level defensive fallback.
    // ---------------------------------------------------------------------------
    if (Number.isNaN(date.getTime())) {
        return null;
    }
    const formatterOptions = {
        ...timeZone ? {
            timeZone
        } : {}
    };
    const weekday = new Intl.DateTimeFormat('en-KE', {
        ...formatterOptions,
        weekday: 'short'
    }).format(date);
    const day = new Intl.DateTimeFormat('en-KE', {
        ...formatterOptions,
        day: '2-digit'
    }).format(date);
    const monthYear = new Intl.DateTimeFormat('en-KE', {
        ...formatterOptions,
        month: 'short',
        year: 'numeric'
    }).format(date);
    const time = new Intl.DateTimeFormat('en-KE', {
        ...formatterOptions,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }).format(date);
    return {
        weekday: weekday.toUpperCase(),
        day,
        monthYear: monthYear.toUpperCase(),
        time
    };
}
function JourneyCardDate({ departureAt, timeZone, className }) {
    const formatted = formatDepartureDate(departureAt, timeZone);
    // ---------------------------------------------------------------------------
    // Invalid runtime value
    // ---------------------------------------------------------------------------
    //
    // Keep the fallback compact so a malformed record does not distort the
    // marketplace row.
    //
    // This component does not attempt to repair or reinterpret the supplied
    // timestamp.
    // ---------------------------------------------------------------------------
    if (!formatted) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: [
                'flex',
                'min-w-0',
                'flex-col',
                'justify-center',
                'gap-0.5',
                'sm:gap-1',
                className
            ].filter(Boolean).join(' '),
            "aria-label": "Departure date unavailable",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: [
                        'text-[9px]',
                        'sm:text-[10px]',
                        'md:text-xs',
                        'font-medium',
                        'uppercase',
                        'tracking-[0.06em]',
                        'text-[var(--foreground-subtle)]'
                    ].join(' '),
                    children: "Departure"
                }, void 0, false, {
                    fileName: "[project]/src/components/landing/journeys/journey-card-date.tsx",
                    lineNumber: 254,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: [
                        'text-[11px]',
                        'sm:text-xs',
                        'md:text-sm',
                        'font-medium',
                        'leading-tight',
                        'text-[var(--foreground-muted)]'
                    ].join(' '),
                    children: "Date unavailable"
                }, void 0, false, {
                    fileName: "[project]/src/components/landing/journeys/journey-card-date.tsx",
                    lineNumber: 268,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/landing/journeys/journey-card-date.tsx",
            lineNumber: 240,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: [
            'flex',
            'min-w-0',
            'flex-col',
            'justify-center',
            'gap-0',
            className
        ].filter(Boolean).join(' '),
        "aria-label": `Departure ${formatted.weekday} ${formatted.day} ${formatted.monthYear} at ${formatted.time}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: [
                    'text-[9px]',
                    'sm:text-[10px]',
                    'md:text-xs',
                    'font-semibold',
                    'uppercase',
                    'tracking-[0.06em]',
                    'sm:tracking-[0.08em]',
                    'text-[var(--foreground-muted)]',
                    'leading-none'
                ].join(' '),
                children: formatted.weekday
            }, void 0, false, {
                fileName: "[project]/src/components/landing/journeys/journey-card-date.tsx",
                lineNumber: 302,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: [
                    'mt-0.5',
                    'text-xl',
                    'sm:text-[1.375rem]',
                    'md:text-2xl',
                    'font-semibold',
                    'leading-none',
                    'tracking-tight',
                    'text-[var(--foreground)]'
                ].join(' '),
                children: formatted.day
            }, void 0, false, {
                fileName: "[project]/src/components/landing/journeys/journey-card-date.tsx",
                lineNumber: 322,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: [
                    'mt-0.5',
                    'sm:mt-1',
                    'text-[9px]',
                    'sm:text-[10px]',
                    'md:text-xs',
                    'font-medium',
                    'uppercase',
                    'tracking-[0.04em]',
                    'sm:tracking-wide',
                    'text-[var(--foreground-secondary)]',
                    'leading-tight'
                ].join(' '),
                children: formatted.monthYear
            }, void 0, false, {
                fileName: "[project]/src/components/landing/journeys/journey-card-date.tsx",
                lineNumber: 341,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: [
                    'mt-1',
                    'sm:mt-1.5',
                    'text-[11px]',
                    'sm:text-xs',
                    'md:text-sm',
                    'font-semibold',
                    'leading-none',
                    'tabular-nums',
                    'text-[var(--foreground)]'
                ].join(' '),
                children: formatted.time
            }, void 0, false, {
                fileName: "[project]/src/components/landing/journeys/journey-card-date.tsx",
                lineNumber: 363,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/landing/journeys/journey-card-date.tsx",
        lineNumber: 285,
        columnNumber: 5
    }, this);
}
_c = JourneyCardDate;
var _c;
__turbopack_context__.k.register(_c, "JourneyCardDate");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/landing/journeys/journey-card-price.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Journey Marketplace Card Price
// -----------------------------------------------------------------------------
//
// Compact presentation component for the PRICE / SEATS section of a public
// Journey marketplace listing.
//
// MARKETPLACE ROLE
// ----------------
//
// The Journey marketplace row communicates:
//
//   WHEN → WHO → WHERE → VEHICLE → PRICE/SEATS → ACTIONS
//                                      ↑
//                                   this block
//
// This component owns only:
//
//   PRICE / SEATS
//
// Intended presentation:
//
//   Ksh 2,200
//   per seat
//   4 available
//   0 of 4 booked
//
// This is a marketplace summary, not a financial-detail component.
//
// PRESENTATION BOUNDARY
// ---------------------
//
// This component is presentation-only.
//
// It does not:
//
// - determine whether a Journey is bookable;
// - determine booking eligibility;
// - calculate booking totals;
// - calculate commission;
// - calculate fees;
// - calculate Journey revenue;
// - perform currency conversion;
// - fetch Financial or Commercial data;
// - construct booking URLs;
// - mutate Journey capacity;
// - infer business state from seat counts.
//
// The parent supplies the authoritative public Journey read-model values.
//
// MONEY BOUNDARY
// -------------
//
// `amount` is interpreted according to the PublicJourney monetary contract.
//
// This component deliberately does NOT invent a minor-unit convention.
//
// If the public API exposes:
//
//   amount = 2200
//
// for:
//
//   KES 2,200
//
// the formatter displays that public amount directly.
//
// This component never performs currency conversion.
//
// RESPONSIVE MARKETPLACE DENSITY
// ------------------------------
//
// The parent JourneyMarketplaceCard owns:
//
// - the price column width;
// - marketplace column padding;
// - column separators;
// - marketplace row geometry.
//
// This component therefore deliberately does NOT:
//
// - define a fixed marketplace column width;
// - use shrink-0 for the marketplace column;
// - add marketplace-level horizontal padding;
// - add marketplace-level vertical padding.
//
// The important responsive rule is:
//
//   PRICE = atomic / never truncated
//
//   SUPPORTING TEXT = allowed to contract
//
// The price must never disappear character-by-character as the viewport
// becomes narrower. Typography contracts at responsive breakpoints instead.
//
// DESIGN-SYSTEM BOUNDARY
// ----------------------
//
// Uses only sisiMove global design tokens:
//
//   --brand
//   --foreground
//   --foreground-secondary
//   --foreground-muted
//   --foreground-subtle
//
// No generic or nonexistent tokens are introduced.
//
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "JourneyCardPrice",
    ()=>JourneyCardPrice
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
// -----------------------------------------------------------------------------
// Formatting helpers
// -----------------------------------------------------------------------------
/**
 * Formats the Journey price for marketplace presentation.
 *
 * No currency conversion or minor-unit conversion is performed here.
 */ function formatPrice(amount, currency) {
    const safeAmount = Number.isFinite(amount) ? amount : 0;
    return new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: currency || 'KES',
        maximumFractionDigits: 0
    }).format(safeAmount);
}
/**
 * Safely formats a seat count.
 *
 * Public read models should normally contain valid non-negative integers.
 * Presentation code still protects the UI from malformed runtime values.
 */ function formatSeatCount(value) {
    if (value === null || value === undefined || !Number.isFinite(value)) {
        return '0';
    }
    return Math.max(0, Math.trunc(value)).toLocaleString('en-KE');
}
/**
 * Determines whether an optional numeric value is actually available.
 */ function hasNumericValue(value) {
    return value !== null && value !== undefined && Number.isFinite(value);
}
function JourneyCardPrice({ amount, currency, availableSeats, bookedSeats, totalSeats, className }) {
    const formattedPrice = formatPrice(amount, currency);
    const formattedAvailableSeats = formatSeatCount(availableSeats);
    const hasBookedSeats = hasNumericValue(bookedSeats);
    const hasTotalSeats = hasNumericValue(totalSeats);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: [
            // -------------------------------------------------------------------
            // Price column content boundary
            // -------------------------------------------------------------------
            //
            // The parent owns the marketplace column geometry and outer padding.
            // This component only controls its internal content.
            //
            'flex',
            'min-w-0',
            'flex-col',
            'justify-center',
            'gap-0',
            className
        ].filter(Boolean).join(' '),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: [
                    'w-fit',
                    'max-w-full',
                    'whitespace-nowrap',
                    'text-base',
                    'sm:text-lg',
                    'md:text-xl',
                    'lg:text-2xl',
                    'font-semibold',
                    'leading-tight',
                    'tracking-tight',
                    'tabular-nums',
                    'text-[var(--foreground)]'
                ].join(' '),
                children: formattedPrice
            }, void 0, false, {
                fileName: "[project]/src/components/landing/journeys/journey-card-price.tsx",
                lineNumber: 271,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: [
                    'mt-0.5',
                    'w-fit',
                    'max-w-full',
                    'whitespace-nowrap',
                    'text-[9px]',
                    'sm:text-[10px]',
                    'md:text-xs',
                    'font-medium',
                    'leading-tight',
                    'text-[var(--foreground-muted)]'
                ].join(' '),
                children: "per seat"
            }, void 0, false, {
                fileName: "[project]/src/components/landing/journeys/journey-card-price.tsx",
                lineNumber: 294,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: [
                    'mt-1.5',
                    'sm:mt-2',
                    'md:mt-2.5',
                    'flex',
                    'min-w-0',
                    'items-center',
                    'gap-1',
                    'sm:gap-1.5'
                ].join(' '),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: [
                            'h-1',
                            'w-1',
                            'sm:h-1.5',
                            'sm:w-1.5',
                            'shrink-0',
                            'rounded-full',
                            'bg-[var(--brand)]'
                        ].join(' '),
                        "aria-hidden": "true"
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/journeys/journey-card-price.tsx",
                        lineNumber: 328,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: [
                            'min-w-0',
                            'truncate',
                            'text-[10px]',
                            'sm:text-[11px]',
                            'md:text-xs',
                            'font-medium',
                            'leading-tight',
                            'text-[var(--foreground-secondary)]'
                        ].join(' '),
                        children: [
                            formattedAvailableSeats,
                            " available"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/landing/journeys/journey-card-price.tsx",
                        lineNumber: 341,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/landing/journeys/journey-card-price.tsx",
                lineNumber: 315,
                columnNumber: 7
            }, this),
            hasBookedSeats && hasTotalSeats && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: [
                    'mt-0.5',
                    'w-fit',
                    'max-w-full',
                    'whitespace-nowrap',
                    'text-[9px]',
                    'sm:text-[10px]',
                    'md:text-xs',
                    'leading-tight',
                    'tabular-nums',
                    'text-[var(--foreground-subtle)]'
                ].join(' '),
                children: [
                    formatSeatCount(bookedSeats),
                    " of",
                    ' ',
                    formatSeatCount(totalSeats),
                    " booked"
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/landing/journeys/journey-card-price.tsx",
                lineNumber: 362,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/landing/journeys/journey-card-price.tsx",
        lineNumber: 227,
        columnNumber: 5
    }, this);
}
_c = JourneyCardPrice;
var _c;
__turbopack_context__.k.register(_c, "JourneyCardPrice");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/landing/journeys/journey-card-provider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "JourneyCardProvider",
    ()=>JourneyCardProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// sisiMove — Journey Marketplace Card Provider
// -----------------------------------------------------------------------------
//
// Compact presentation component for the provider section of a public Journey
// marketplace listing.
//
// MARKETPLACE ROLE
// ----------------
//
// The Journey marketplace row communicates:
//
//   WHEN → WHO → WHERE → VEHICLE → PRICE/SEATS → ACTIONS
//              ↑
//           this block
//
// The provider is the public Traveller offering the Journey.
//
// PublicJourneyProvider already contains the composed public read models:
//
//   provider
//   ├── traveller
//   └── trust
//
// This component therefore presents those supplied read models directly.
//
// PRESENTATION BOUNDARY
// ---------------------
//
// This component:
//
// - renders the public Traveller identity;
// - renders the provider's public Trust summary;
// - optionally links the Traveller to their public profile.
//
// It deliberately does not:
//
// - fetch provider data;
// - resolve Identity references;
// - reconstruct Traveller or Trust relationships;
// - determine Journey ownership;
// - determine booking eligibility;
// - perform navigation programmatically;
// - contain Journey or Booking business logic.
//
// TravellerSummary and TrustSummary remain the shared presentation boundary
// for public Traveller and Trust information across Journey and Journey Demand
// marketplace cards.
//
// PROVIDER RELATIONSHIP
// --------------------
//
// The Journey owns the provider relationship.
//
// This component does NOT imply:
//
//   Traveller → owns Journey
//
// or:
//
//   Trust → owns Journey
//
// The Journey read model supplies `PublicJourneyProvider`, which composes the
// public Traveller and Trust information needed to represent the provider.
//
// The marketplace therefore consumes:
//
//   Journey
//      ↓
//   PublicJourneyProvider
//      ├── Traveller
//      └── Trust
//
// INTERNAL LAYOUT
// --------------
//
// The provider remains vertically grouped:
//
//   [avatar]
//   @handle
//   ✓ Verified  ★ 4.9 (5) · 2 completed journeys
//
// The parent JourneyMarketplaceCard controls the provider column's:
//
// - width;
// - position;
// - outer padding;
// - separator.
//
// This component controls only the internal composition and density.
//
// RESPONSIVE MARKETPLACE DENSITY
// ------------------------------
//
// The provider column contracts with the rest of the marketplace row.
//
// This component therefore deliberately does NOT:
//
// - define a fixed width;
// - use fixed desktop dimensions;
// - add marketplace-level horizontal padding;
// - add marketplace-level vertical padding.
//
// The internal gap progressively contracts on smaller screens.
//
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$shared$2f$traveller$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/landing/shared/traveller/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$shared$2f$traveller$2f$traveller$2d$summary$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/shared/traveller/traveller-summary.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$shared$2f$trust$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/landing/shared/trust/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$shared$2f$trust$2f$trust$2d$summary$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/shared/trust/trust-summary.tsx [app-client] (ecmascript)");
;
;
;
function JourneyCardProvider({ provider, linkToProfile = true, showTrustBadges = true, className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: [
            // -------------------------------------------------------------------
            // Provider content boundary
            // -------------------------------------------------------------------
            //
            // The parent marketplace column owns the column width, separator,
            // and outer padding.
            //
            // This component only establishes the internal vertical composition.
            //
            'flex',
            'min-w-0',
            'flex-col',
            'justify-center',
            // -------------------------------------------------------------------
            // Progressive internal density
            // -------------------------------------------------------------------
            //
            // The identity and trust blocks remain vertically grouped while their
            // spacing contracts with the marketplace density.
            //
            'gap-1',
            'sm:gap-1.5',
            'md:gap-2',
            className
        ].filter(Boolean).join(' '),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$shared$2f$traveller$2f$traveller$2d$summary$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TravellerSummary"], {
                traveller: provider.traveller,
                linkToProfile: linkToProfile,
                orientation: "vertical",
                className: "w-full min-w-0"
            }, void 0, false, {
                fileName: "[project]/src/components/landing/journeys/journey-card-provider.tsx",
                lineNumber: 204,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$shared$2f$trust$2f$trust$2d$summary$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TrustSummary"], {
                trust: provider.trust,
                showBadges: showTrustBadges,
                className: "w-full min-w-0"
            }, void 0, false, {
                fileName: "[project]/src/components/landing/journeys/journey-card-provider.tsx",
                lineNumber: 226,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/landing/journeys/journey-card-provider.tsx",
        lineNumber: 157,
        columnNumber: 5
    }, this);
}
_c = JourneyCardProvider;
var _c;
__turbopack_context__.k.register(_c, "JourneyCardProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/landing/journeys/journey-card-route.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Journey Marketplace Card Route
// -----------------------------------------------------------------------------
//
// Compact presentation component for the route section of a public Journey
// marketplace listing.
//
// MARKETPLACE ROLE
// ----------------
//
// The Journey marketplace row communicates:
//
//   WHEN → WHO → WHERE → VEHICLE → PRICE/SEATS → ACTIONS
//                       ↑
//                    this block
//
// This component owns the `WHERE` portion:
//
//   From
//   Nairobi
//      ↓
//   To
//   Mombasa
//
// If the Journey contains intermediate waypoints, they are presented as
// secondary route context:
//
//   Via Voi · Mtito Andei
//
// The route remains intentionally compact. It is not a complete Journey
// itinerary or route-detail component.
//
// PRESENTATION BOUNDARY
// ---------------------
//
// This component:
//
// - renders the already-resolved public route;
// - displays origin and destination;
// - displays genuine intermediate waypoints;
// - keeps route information compact and scannable.
//
// It deliberately does not:
//
// - fetch route data;
// - resolve location IDs;
// - calculate distances;
// - calculate duration;
// - determine departure or arrival times;
// - render vehicle information;
// - render pricing;
// - render seat availability;
// - determine booking eligibility;
// - contain Journey business logic.
//
// WAYPOINT BOUNDARY
// -----------------
//
// The public route representation already exposes origin and destination.
//
// Some API representations may additionally contain ORIGIN and DESTINATION
// entries inside `waypoints`.
//
// Those entries are filtered out here so the marketplace never renders:
//
//   Nairobi → Mombasa
//   Via Nairobi · Voi
//
// Instead, only genuine intermediate locations are displayed.
//
// The supplied waypoint sequence is used to keep the Via presentation
// deterministic.
//
// RESPONSIVE MARKETPLACE DENSITY
// ------------------------------
//
// The parent JourneyMarketplaceCard owns:
//
// - the route column width;
// - the route column position;
// - the marketplace column padding;
// - the column separator.
//
// This component therefore deliberately does NOT:
//
// - define a fixed width;
// - define a minimum desktop width;
// - use horizontal scrolling;
// - add marketplace-level horizontal padding;
// - add marketplace-level vertical padding.
//
// The marketplace row remains horizontal at every breakpoint.
//
// The route content itself remains vertically composed:
//
//   From
//   Nairobi
//     ↓
//   To
//   Mombasa
//   Via Voi
//
// Internal typography and spacing progressively contract on smaller screens.
//
// DESIGN-SYSTEM BOUNDARY
// ----------------------
//
// Uses only sisiMove global design tokens:
//
//   --foreground
//   --foreground-secondary
//   --foreground-muted
//   --foreground-subtle
//
// No generic or nonexistent tokens are introduced.
//
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "JourneyCardRoute",
    ()=>JourneyCardRoute
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------
/**
 * Returns only genuine intermediate waypoints.
 *
 * Origin and destination are already represented by `route.origin` and
 * `route.destination`, so they should not be repeated in the Via line.
 *
 * Sorting by sequence keeps the presentation deterministic if the public API
 * does not return the waypoint collection in sequence order.
 */ function getIntermediateWaypoints(route) {
    return route.waypoints.filter((waypoint)=>waypoint.type !== 'ORIGIN' && waypoint.type !== 'DESTINATION').sort((a, b)=>a.sequence - b.sequence);
}
function JourneyCardRoute({ route, className }) {
    const intermediateWaypoints = getIntermediateWaypoints(route);
    const viaLabel = intermediateWaypoints.map((waypoint)=>waypoint.name).filter(Boolean).join(' · ');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: [
            // -------------------------------------------------------------------
            // Route content boundary
            // -------------------------------------------------------------------
            //
            // The parent marketplace column owns width, separator, and outer
            // padding. This component only establishes the internal route
            // composition.
            //
            'flex',
            'min-w-0',
            'flex-col',
            'justify-center',
            className
        ].filter(Boolean).join(' '),
        "aria-label": `Route from ${route.origin.name} to ${route.destination.name}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-w-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: [
                            'text-[9px]',
                            'sm:text-[10px]',
                            'md:text-xs',
                            'font-medium',
                            'uppercase',
                            'tracking-[0.05em]',
                            'sm:tracking-[0.06em]',
                            'leading-none',
                            'text-[var(--foreground-muted)]'
                        ].join(' '),
                        children: "From"
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/journeys/journey-card-route.tsx",
                        lineNumber: 205,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: [
                            'mt-0.5',
                            'min-w-0',
                            'truncate',
                            'text-[11px]',
                            'sm:text-xs',
                            'md:text-sm',
                            'font-semibold',
                            'leading-tight',
                            'text-[var(--foreground)]'
                        ].join(' '),
                        title: route.origin.name,
                        children: route.origin.name
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/journeys/journey-card-route.tsx",
                        lineNumber: 221,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/landing/journeys/journey-card-route.tsx",
                lineNumber: 204,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                "aria-hidden": "true",
                className: [
                    'my-0.5',
                    'sm:my-1',
                    'text-[11px]',
                    'sm:text-xs',
                    'md:text-sm',
                    'font-medium',
                    'leading-none',
                    'text-[var(--foreground-subtle)]'
                ].join(' '),
                children: "↓"
            }, void 0, false, {
                fileName: "[project]/src/components/landing/journeys/journey-card-route.tsx",
                lineNumber: 246,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-w-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: [
                            'text-[9px]',
                            'sm:text-[10px]',
                            'md:text-xs',
                            'font-medium',
                            'uppercase',
                            'tracking-[0.05em]',
                            'sm:tracking-[0.06em]',
                            'leading-none',
                            'text-[var(--foreground-muted)]'
                        ].join(' '),
                        children: "To"
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/journeys/journey-card-route.tsx",
                        lineNumber: 267,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: [
                            'mt-0.5',
                            'min-w-0',
                            'truncate',
                            'text-[11px]',
                            'sm:text-xs',
                            'md:text-sm',
                            'font-semibold',
                            'leading-tight',
                            'text-[var(--foreground)]'
                        ].join(' '),
                        title: route.destination.name,
                        children: route.destination.name
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/journeys/journey-card-route.tsx",
                        lineNumber: 283,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/landing/journeys/journey-card-route.tsx",
                lineNumber: 266,
                columnNumber: 7
            }, this),
            viaLabel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: [
                    'mt-1',
                    'sm:mt-1.5',
                    'md:mt-2',
                    'min-w-0',
                    'truncate',
                    'text-[9px]',
                    'sm:text-[10px]',
                    'md:text-xs',
                    'leading-tight',
                    'text-[var(--foreground-muted)]'
                ].join(' '),
                title: `Via ${viaLabel}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-medium text-[var(--foreground-secondary)]",
                        children: "Via"
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/journeys/journey-card-route.tsx",
                        lineNumber: 320,
                        columnNumber: 11
                    }, this),
                    ' ',
                    viaLabel
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/landing/journeys/journey-card-route.tsx",
                lineNumber: 305,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/landing/journeys/journey-card-route.tsx",
        lineNumber: 179,
        columnNumber: 5
    }, this);
}
_c = JourneyCardRoute;
var _c;
__turbopack_context__.k.register(_c, "JourneyCardRoute");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/landing/journeys/journey-card-vehicle.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "JourneyCardVehicle",
    ()=>JourneyCardVehicle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// sisiMove — Journey Marketplace Card Vehicle
// -----------------------------------------------------------------------------
//
// Compact presentation component for the vehicle section of a public Journey
// marketplace listing.
//
// MARKETPLACE ROLE
// ----------------
//
// The Journey marketplace row communicates:
//
//   WHEN → WHO → WHERE → VEHICLE → PRICE/SEATS → ACTIONS
//                              ↑
//                           this block
//
// This component owns only the `VEHICLE` portion.
//
// Intended presentation:
//
//   [ vehicle image ]
//   Nissan X-Trail · 2022
//   Black
//
// The component is deliberately compact. It is not a vehicle detail card.
//
// PRESENTATION BOUNDARY
// ---------------------
//
// This component:
//
// - displays the public vehicle information supplied by the parent;
// - displays the vehicle image when a public asset is available;
// - delegates image rendering to the shared PublicAssetImage component;
// - gracefully handles an absent image;
// - contains no vehicle business rules.
//
// It deliberately does not:
//
// - fetch vehicle data;
// - resolve vehicle ownership;
// - determine whether a vehicle is verified;
// - determine whether a vehicle is active;
// - construct asset URLs;
// - determine Journey eligibility;
// - contain booking logic;
// - modify the Journey or Vehicle domain models.
//
// PUBLIC ASSET BOUNDARY
// ---------------------
//
// `PublicAssetImage` remains the shared adapter around Next.js Image.
//
// This component decides only:
//
//   "This asset represents this vehicle."
//
// It does not know how the asset URL is stored or resolved.
//
// RESPONSIVE MARKETPLACE DENSITY
// ------------------------------
//
// The parent JourneyMarketplaceCard owns:
//
// - the vehicle column width;
// - the vehicle column position;
// - marketplace column padding;
// - the column separator.
//
// This component therefore deliberately does NOT:
//
// - define a fixed marketplace column width;
// - add marketplace-level horizontal padding;
// - add marketplace-level vertical padding;
// - use a fixed desktop image size.
//
// The image and vehicle typography contract progressively with the rest of
// the marketplace row.
//
// DESIGN-SYSTEM BOUNDARY
// ----------------------
//
// Uses only sisiMove global design tokens:
//
//   --foreground
//   --foreground-secondary
//   --foreground-muted
//   --foreground-subtle
//   --border
//   --background-subtle
//
// No generic or nonexistent tokens are introduced.
//
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$shared$2f$assets$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/landing/shared/assets/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$shared$2f$assets$2f$public$2d$asset$2d$image$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/shared/assets/public-asset-image.tsx [app-client] (ecmascript)");
;
;
// -----------------------------------------------------------------------------
// Formatting helpers
// -----------------------------------------------------------------------------
/**
 * Builds the compact vehicle identity displayed beneath the image.
 *
 * Example:
 *
 *   Nissan X-Trail · 2022
 *
 * This helper performs presentation formatting only.
 */ function formatVehicleName(make, model, year) {
    const identity = [
        make.trim(),
        model.trim()
    ].filter(Boolean).join(' ');
    if (!year) {
        return identity;
    }
    return `${identity} · ${year}`;
}
/**
 * Normalises optional colour text for presentation.
 *
 * Empty or whitespace-only values are treated as absent.
 */ function formatVehicleColor(color) {
    const value = color?.trim();
    return value || null;
}
function JourneyCardVehicle({ make, model, year, color, asset, className }) {
    const vehicleName = formatVehicleName(make, model, year);
    const vehicleColor = formatVehicleColor(color);
    const vehicleLabel = vehicleName || 'Vehicle';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: [
            // -------------------------------------------------------------------
            // Vehicle content boundary
            // -------------------------------------------------------------------
            //
            // The parent owns the marketplace column width, separator, and outer
            // padding. This component controls only the internal composition.
            //
            'flex',
            'min-w-0',
            'flex-col',
            'justify-center',
            // -------------------------------------------------------------------
            // Progressive internal density
            // -------------------------------------------------------------------
            'gap-1.5',
            'sm:gap-2',
            'md:gap-2.5',
            className
        ].filter(Boolean).join(' '),
        children: [
            asset ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: [
                    'relative',
                    'w-full',
                    'max-w-28',
                    'sm:max-w-32',
                    'md:max-w-36',
                    // Progressive image height.
                    'h-14',
                    'sm:h-16',
                    'md:h-20',
                    'overflow-hidden',
                    'rounded-[var(--radius-md)]',
                    'border',
                    'border-[var(--border)]',
                    'bg-[var(--background-subtle)]'
                ].join(' '),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$shared$2f$assets$2f$public$2d$asset$2d$image$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PublicAssetImage"], {
                    asset: asset,
                    alt: `${vehicleLabel} vehicle`,
                    fallbackAlt: `${vehicleLabel} vehicle image`,
                    fill: true,
                    sizes: "(max-width: 639px) 112px, (max-width: 767px) 128px, 144px",
                    className: "object-cover"
                }, void 0, false, {
                    fileName: "[project]/src/components/landing/journeys/journey-card-vehicle.tsx",
                    lineNumber: 260,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/landing/journeys/journey-card-vehicle.tsx",
                lineNumber: 240,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: [
                    'flex',
                    'w-full',
                    'max-w-28',
                    'sm:max-w-32',
                    'md:max-w-36',
                    // Keep the fallback image geometry identical to the real asset.
                    'h-14',
                    'sm:h-16',
                    'md:h-20',
                    'items-center',
                    'justify-center',
                    'overflow-hidden',
                    'rounded-[var(--radius-md)]',
                    'border',
                    'border-[var(--border)]',
                    'bg-[var(--background-subtle)]',
                    'text-[var(--foreground-subtle)]'
                ].join(' '),
                "aria-hidden": "true",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "1.5",
                    className: [
                        'h-5',
                        'w-5',
                        'sm:h-6',
                        'sm:w-6',
                        'md:h-8',
                        'md:w-8'
                    ].join(' '),
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        d: "M5 17h14M6.5 17V9.5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1V17M4 17h16M8 12h8M7 17a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0-0-3Zm10 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0-0-3Z"
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/journeys/journey-card-vehicle.tsx",
                        lineNumber: 308,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/landing/journeys/journey-card-vehicle.tsx",
                    lineNumber: 294,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/landing/journeys/journey-card-vehicle.tsx",
                lineNumber: 270,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-w-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: [
                            'min-w-0',
                            'truncate',
                            'text-[11px]',
                            'sm:text-xs',
                            'md:text-sm',
                            'font-semibold',
                            'leading-tight',
                            'text-[var(--foreground)]'
                        ].join(' '),
                        title: vehicleLabel,
                        children: vehicleLabel
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/journeys/journey-card-vehicle.tsx",
                        lineNumber: 322,
                        columnNumber: 9
                    }, this),
                    vehicleColor && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: [
                            'mt-0.5',
                            'min-w-0',
                            'truncate',
                            'text-[9px]',
                            'sm:text-[10px]',
                            'md:text-xs',
                            'leading-tight',
                            'text-[var(--foreground-muted)]'
                        ].join(' '),
                        title: vehicleColor,
                        children: vehicleColor
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/journeys/journey-card-vehicle.tsx",
                        lineNumber: 343,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/landing/journeys/journey-card-vehicle.tsx",
                lineNumber: 321,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/landing/journeys/journey-card-vehicle.tsx",
        lineNumber: 209,
        columnNumber: 5
    }, this);
}
_c = JourneyCardVehicle;
var _c;
__turbopack_context__.k.register(_c, "JourneyCardVehicle");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/landing/journeys/journey-marketplace-card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Journey Marketplace Card
// -----------------------------------------------------------------------------
//
// Top-level presentation component for a public Journey marketplace listing.
//
// A Journey is the primary supply object in the sisiMove marketplace.
//
// The marketplace card intentionally presents the Journey as a dense,
// horizontally scannable listing rather than as a detail-summary card.
//
// -----------------------------------------------------------------------------
// Responsive marketplace model
// -----------------------------------------------------------------------------
//
// The card is MOBILE-FIRST, but "mobile-first" does NOT mean stacking.
//
// The marketplace row remains horizontal at every viewport size:
//
//   DATE → PROVIDER → ROUTE → VEHICLE → PRICE → ACTIONS
//
// The row NEVER:
//
//   - stacks vertically;
//   - introduces horizontal page scrolling;
//   - requires a fixed desktop width;
//   - hides marketplace columns because the viewport is smaller.
//
// Instead, the complete composition contracts horizontally AND vertically.
//
// -----------------------------------------------------------------------------
// Proportional density
// -----------------------------------------------------------------------------
//
// Responsive behavior is treated as one visual system.
//
// As the available viewport contracts:
//
//   - section padding contracts;
//   - typography contracts through child presentation components;
//   - images contract through child presentation components;
//   - action controls contract through child presentation components;
//   - internal gaps contract;
//   - the overall card remains a single horizontal composition.
//
// The marketplace row itself always remains horizontal.
//
// -----------------------------------------------------------------------------
// Architecture boundary
// -----------------------------------------------------------------------------
//
// Journey remains the primary marketplace/domain object.
//
// Public Traveller and Trust information is read-side enrichment exposed
// through `journey.provider`.
//
// The Journey marketplace card does not:
//
// - fetch Journey data;
// - resolve cross-domain references;
// - determine booking eligibility;
// - calculate availability;
// - perform booking checks;
// - contain marketplace business rules;
// - create a second Journey model;
// - transform Journey domain concepts into unrelated concepts.
//
// The card consumes the already-composed PublicJourney read model.
//
// -----------------------------------------------------------------------------
// Marketplace presentation model
// -----------------------------------------------------------------------------
//
// The listing communicates:
//
//   WHEN
//     JourneyCardDate
//
//   WHO
//     JourneyCardProvider
//
//   WHERE
//     JourneyCardRoute
//
//   WHAT VEHICLE
//     JourneyCardVehicle
//
//   HOW MUCH / HOW MANY SEATS
//     JourneyCardPrice
//
//   WHAT CAN I DO
//     JourneyCardActions
//
// Each child owns only the presentation of its corresponding Journey slice.
//
// -----------------------------------------------------------------------------
// Booking boundary
// -----------------------------------------------------------------------------
//
// `bookHref` is the presentation-level signal supplied by the marketplace
// read boundary.
//
// This component does not determine whether a Journey is bookable.
//
// If `bookHref` is absent, JourneyCardActions does not render Book.
//
// -----------------------------------------------------------------------------
// Layout responsibility
// -----------------------------------------------------------------------------
//
// JourneyMarketplaceCard
//   ├── JourneyCardDate
//   ├── JourneyCardProvider
//   ├── JourneyCardRoute
//   ├── JourneyCardVehicle
//   ├── JourneyCardPrice
//   └── JourneyCardActions
//
// The card shell owns:
//
//   - horizontal section positioning;
//   - responsive section sizing;
//   - vertical separators;
//   - responsive density;
//   - the shared row height.
//
// Each child owns its own public Journey slice.
//
// -----------------------------------------------------------------------------
// Responsive section sizing
// -----------------------------------------------------------------------------
//
// Flex ratios preserve the relative importance of each marketplace section:
//
//   Date       0.8
//   Provider   1.4
//   Route      1.6
//   Vehicle    1.4
//   Price      0.9
//   Actions    1.1
//
// No section receives a fixed desktop width.
//
// -----------------------------------------------------------------------------
// Action positioning
// -----------------------------------------------------------------------------
//
// The action column is intentionally treated differently from the information
// columns.
//
// Information columns:
//
//   Date / Provider / Route / Vehicle / Price
//
// communicate marketplace information.
//
// The Actions column:
//
//   View / Book
//
// is an interaction zone.
//
// The wrapper therefore fills the shared row height and the child action
// component aligns its controls toward the bottom of that available space.
//
// No fixed card height is introduced.
//
// -----------------------------------------------------------------------------
// CSS token policy
// -----------------------------------------------------------------------------
//
// Only existing sisiMove design tokens are used.
//
// No generic/nonexistent tokens such as:
//
//   --primary
//   --primary-foreground
//   --ring
//   --background-secondary
//
// are introduced here.
//
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "JourneyMarketplaceCard",
    ()=>JourneyMarketplaceCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$journeys$2f$journey$2d$card$2d$actions$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/journeys/journey-card-actions.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$journeys$2f$journey$2d$card$2d$date$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/journeys/journey-card-date.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$journeys$2f$journey$2d$card$2d$price$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/journeys/journey-card-price.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$journeys$2f$journey$2d$card$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/journeys/journey-card-provider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$journeys$2f$journey$2d$card$2d$route$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/journeys/journey-card-route.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$journeys$2f$journey$2d$card$2d$vehicle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/journeys/journey-card-vehicle.tsx [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
// -----------------------------------------------------------------------------
// Shared marketplace section classes
// -----------------------------------------------------------------------------
//
// Every marketplace column receives:
//
//   - min-width protection;
//   - responsive horizontal padding;
//   - responsive vertical padding.
//
// The parent owns this outer density.
//
// Child components therefore must not duplicate marketplace-level padding.
//
// -----------------------------------------------------------------------------
const SECTION_BASE = [
    'min-w-0',
    'border-[var(--border-subtle)]',
    // ---------------------------------------------------------------------------
    // Responsive horizontal density
    // ---------------------------------------------------------------------------
    'px-1',
    'sm:px-1.5',
    'md:px-2',
    'lg:px-3',
    // ---------------------------------------------------------------------------
    // Responsive vertical density
    // ---------------------------------------------------------------------------
    'py-1',
    'sm:py-1.5',
    'md:py-2',
    'lg:py-2.5'
].join(' ');
function JourneyMarketplaceCard({ journey, viewHref, bookHref, linkProviderToProfile = true, showProviderTrustBadges = true, className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
        className: [
            // -------------------------------------------------------------------
            // Card shell
            // -------------------------------------------------------------------
            //
            // The result stream determines the available width.
            //
            // The card consumes that width completely. It does not establish a
            // fixed minimum width and does not create horizontal page scrolling.
            //
            'w-full',
            'min-w-0',
            'overflow-hidden',
            'p-0',
            className
        ].filter(Boolean).join(' '),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: [
                // -----------------------------------------------------------------
                // Marketplace row
                // -----------------------------------------------------------------
                //
                // This remains horizontal at every viewport size.
                //
                // There is deliberately no `flex-col`.
                //
                'flex',
                'w-full',
                'min-w-0',
                'items-stretch'
            ].join(' '),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: [
                        SECTION_BASE,
                        'flex',
                        'min-w-0',
                        'flex-[0.8]'
                    ].join(' '),
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$journeys$2f$journey$2d$card$2d$date$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JourneyCardDate"], {
                        departureAt: journey.schedule.departureAt,
                        className: "w-full min-w-0"
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/journeys/journey-marketplace-card.tsx",
                        lineNumber: 338,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/landing/journeys/journey-marketplace-card.tsx",
                    lineNumber: 330,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: [
                        SECTION_BASE,
                        'flex',
                        'min-w-0',
                        'flex-[1.4]',
                        'border-l'
                    ].join(' '),
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$journeys$2f$journey$2d$card$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JourneyCardProvider"], {
                        provider: journey.provider,
                        linkToProfile: linkProviderToProfile,
                        showTrustBadges: showProviderTrustBadges,
                        className: "w-full min-w-0"
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/journeys/journey-marketplace-card.tsx",
                        lineNumber: 357,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/landing/journeys/journey-marketplace-card.tsx",
                    lineNumber: 348,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: [
                        SECTION_BASE,
                        'flex',
                        'min-w-0',
                        'flex-[1.6]',
                        'border-l'
                    ].join(' '),
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$journeys$2f$journey$2d$card$2d$route$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JourneyCardRoute"], {
                        route: journey.route,
                        className: "w-full min-w-0"
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/journeys/journey-marketplace-card.tsx",
                        lineNumber: 378,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/landing/journeys/journey-marketplace-card.tsx",
                    lineNumber: 369,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: [
                        SECTION_BASE,
                        'flex',
                        'min-w-0',
                        'flex-[1.4]',
                        'border-l'
                    ].join(' '),
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$journeys$2f$journey$2d$card$2d$vehicle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JourneyCardVehicle"], {
                        make: journey.vehicle.make,
                        model: journey.vehicle.model,
                        year: journey.vehicle.year,
                        color: journey.vehicle.color,
                        asset: journey.vehicle.asset,
                        className: "w-full min-w-0"
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/journeys/journey-marketplace-card.tsx",
                        lineNumber: 397,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/landing/journeys/journey-marketplace-card.tsx",
                    lineNumber: 388,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: [
                        SECTION_BASE,
                        'flex',
                        'min-w-0',
                        'flex-[0.9]',
                        'border-l'
                    ].join(' '),
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$journeys$2f$journey$2d$card$2d$price$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JourneyCardPrice"], {
                        amount: journey.pricing.amount,
                        currency: journey.pricing.currency,
                        availableSeats: journey.capacity.availableSeats,
                        bookedSeats: journey.capacity.bookedSeats,
                        totalSeats: journey.capacity.totalSeats,
                        className: "w-full min-w-0"
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/journeys/journey-marketplace-card.tsx",
                        lineNumber: 420,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/landing/journeys/journey-marketplace-card.tsx",
                    lineNumber: 411,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: [
                        SECTION_BASE,
                        'flex',
                        'min-w-0',
                        'flex-[1.1]',
                        'border-l'
                    ].join(' '),
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$journeys$2f$journey$2d$card$2d$actions$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JourneyCardActions"], {
                        viewHref: viewHref,
                        bookHref: bookHref,
                        className: "w-full min-w-0"
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/journeys/journey-marketplace-card.tsx",
                        lineNumber: 451,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/landing/journeys/journey-marketplace-card.tsx",
                    lineNumber: 442,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/landing/journeys/journey-marketplace-card.tsx",
            lineNumber: 310,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/landing/journeys/journey-marketplace-card.tsx",
        lineNumber: 289,
        columnNumber: 5
    }, this);
}
_c = JourneyMarketplaceCard;
var _c;
__turbopack_context__.k.register(_c, "JourneyMarketplaceCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/landing/landing-page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LandingPage",
    ()=>LandingPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// sisiMove — Landing Page
// -----------------------------------------------------------------------------
//
// Top-level composition component for the public sisiMove landing page.
//
// The landing page is the public entry point into the sisiMove journey market.
// It follows the physical-market interaction model:
//
//     LANDING
//         │
//         ├── Journey Market introduction
//         │
//         ├── Marketplace
//         │     ├── Journeys
//         │     └── Journey Demand
//         │
//         ├── Create Travel Demand
//         │
//         ├── Publish Journey
//         │
//         └── How It Works
//
// Journey and Journey Demand remain independent feature domains.
//
// LandingPage composes their public marketplace representation but does not
// merge, own, or implement either domain's business logic.
//
// -----------------------------------------------------------------------------
//
// Architectural responsibility
// -----------------------------------------------------------------------------
//
// LandingPage is a pure page-composition boundary.
//
// It is responsible for:
//
// - establishing the order of public landing sections;
// - composing landing presentation components;
// - passing the prepared marketplace contract to MarketplaceSection.
//
// It is NOT responsible for:
//
// - fetching marketplace data;
// - owning marketplace query state;
// - synchronizing marketplace URL state;
// - filtering or sorting marketplace data;
// - constructing API requests;
// - implementing Journey business rules;
// - implementing Journey Demand business rules;
// - determining booking eligibility;
// - determining demand participation eligibility;
// - constructing navigation URLs;
// - communicating directly with the API.
//
// Those responsibilities belong to the appropriate route, application,
// marketplace read-boundary, or feature layer.
//
// -----------------------------------------------------------------------------
//
// Semantic page boundary
// -----------------------------------------------------------------------------
//
// The public route layout owns the document-level <main> element.
//
// LandingPage therefore renders page content only and deliberately does not
// introduce another <main> element.
//
// Result:
//
//     Public Layout
//         ├── SiteHeader
//         ├── <main>
//         │     └── LandingPage
//         │           ├── LandingHero
//         │           ├── MarketplaceSection
//         │           ├── CreateDemandSection
//         │           ├── PublishJourneySection
//         │           └── HowItWorksSection
//         └── SiteFooter
//
// -----------------------------------------------------------------------------
//
// Marketplace boundary
// -----------------------------------------------------------------------------
//
// LandingPage receives the complete MarketplaceSectionProps contract from the
// route/application/client orchestration boundary.
//
// The contract is passed directly to MarketplaceSection.
//
// LandingPage therefore remains independent from:
//
// - marketplace transport;
// - marketplace query orchestration;
// - URL synchronization;
// - request lifecycle management;
// - Journey discovery implementation;
// - Journey Demand discovery implementation.
//
// MarketplaceSection remains the replaceable marketplace presentation boundary
// within the larger landing page.
//
// -----------------------------------------------------------------------------
//
// Visual composition
// -----------------------------------------------------------------------------
//
// The public layout supplies SiteHeader and SiteFooter.
//
// LandingPage supplies the content between them:
//
//     LandingHero
//         ↓
//     MarketplaceSection
//         ↓
//     CreateDemandSection
//         ↓
//     PublishJourneySection
//         ↓
//     HowItWorksSection
//
// The marketplace intentionally appears immediately after the hero.
//
// Visitors should see the actual market before being asked to read supporting
// explanation or choose a participation path.
//
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$hero$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/landing/hero/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$hero$2f$landing$2d$hero$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/hero/landing-hero.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$marketplace$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/landing/marketplace/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$marketplace$2f$marketplace$2d$section$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/marketplace/marketplace-section.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$calls$2d$to$2d$action$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/landing/calls-to-action/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$calls$2d$to$2d$action$2f$create$2d$demand$2d$section$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/calls-to-action/create-demand-section.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$calls$2d$to$2d$action$2f$publish$2d$journey$2d$section$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/calls-to-action/publish-journey-section.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$how$2d$it$2d$works$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/landing/how-it-works/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$how$2d$it$2d$works$2f$how$2d$it$2d$works$2d$section$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/how-it-works/how-it-works-section.tsx [app-client] (ecmascript)");
;
;
;
;
;
function LandingPage({ marketplace }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full min-w-0",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$hero$2f$landing$2d$hero$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LandingHero"], {}, void 0, false, {
                fileName: "[project]/src/components/landing/landing-page.tsx",
                lineNumber: 184,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$marketplace$2f$marketplace$2d$section$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MarketplaceSection"], {
                ...marketplace
            }, void 0, false, {
                fileName: "[project]/src/components/landing/landing-page.tsx",
                lineNumber: 208,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$calls$2d$to$2d$action$2f$create$2d$demand$2d$section$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CreateDemandSection"], {}, void 0, false, {
                fileName: "[project]/src/components/landing/landing-page.tsx",
                lineNumber: 222,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$calls$2d$to$2d$action$2f$publish$2d$journey$2d$section$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PublishJourneySection"], {}, void 0, false, {
                fileName: "[project]/src/components/landing/landing-page.tsx",
                lineNumber: 233,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$how$2d$it$2d$works$2f$how$2d$it$2d$works$2d$section$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HowItWorksSection"], {}, void 0, false, {
                fileName: "[project]/src/components/landing/landing-page.tsx",
                lineNumber: 246,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/landing/landing-page.tsx",
        lineNumber: 172,
        columnNumber: 5
    }, this);
}
_c = LandingPage;
var _c;
__turbopack_context__.k.register(_c, "LandingPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/landing/marketplace/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// -----------------------------------------------------------------------------
// sisiMove — Marketplace Component Barrel
// -----------------------------------------------------------------------------
//
// Public barrel for Marketplace presentation components.
//
// Consumers should import marketplace components through this barrel rather
// than depending directly on individual implementation files.
//
// The marketplace is a presentation/composition boundary over Journey and
// Journey Demand. The components exported here do not own domain state or API
// communication.
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// Marketplace Composition
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$marketplace$2f$marketplace$2d$section$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/marketplace/marketplace-section.tsx [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// Marketplace Header
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$marketplace$2f$marketplace$2d$header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/marketplace/marketplace-header.tsx [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// Marketplace Navigation
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$marketplace$2f$marketplace$2d$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/marketplace/marketplace-tabs.tsx [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// Marketplace Filters
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$marketplace$2f$marketplace$2d$filter$2d$bar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/marketplace/marketplace-filter-bar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$marketplace$2f$marketplace$2d$filters$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/marketplace/marketplace-filters.tsx [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// Marketplace Results
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$marketplace$2f$marketplace$2d$results$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/marketplace/marketplace-results.tsx [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// Marketplace States
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$marketplace$2f$marketplace$2d$loading$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/marketplace/marketplace-loading-state.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$marketplace$2f$marketplace$2d$error$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/marketplace/marketplace-error-state.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$marketplace$2f$marketplace$2d$error$2d$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/marketplace/marketplace-error-icon.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$marketplace$2f$marketplace$2d$empty$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/marketplace/marketplace-empty-state.tsx [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// Marketplace Pagination
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$marketplace$2f$marketplace$2d$load$2d$more$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/marketplace/marketplace-load-more.tsx [app-client] (ecmascript)");
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
"[project]/src/components/landing/marketplace/marketplace-empty-state.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Public Marketplace Empty State
// -----------------------------------------------------------------------------
//
// Empty-state presentation for the public marketplace.
//
// An empty marketplace result does not necessarily mean that sisiMove has no
// journeys or demands. It may mean that the visitor's current refinements do
// not match any publicly visible items.
//
// Examples:
//
// - a selected origin has no matching journeys;
// - a selected destination has no matching demands;
// - a date has no matching published items;
// - the selected marketplace stream has no available results;
// - secondary filters are too restrictive.
//
// The message should therefore explain the current state without making
// unsupported claims about the underlying domains.
//
// This component is intentionally presentation-only.
//
// It does NOT:
// - fetch marketplace data;
// - inspect Journey state;
// - inspect Journey Demand state;
// - modify filters;
// - create a Demand;
// - publish a Journey;
// - determine whether a visitor is authenticated;
// - contain marketplace business rules.
//
// The parent decides when this component should be rendered.
//
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "MarketplaceEmptyState",
    ()=>MarketplaceEmptyState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function MarketplaceEmptyState({ title = "Nothing matches this view yet", description = "Create a Demand to let member/drivers aware of the Demand or Join available demand, you will be notified when a Match is availble.", action, className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        "aria-live": "polite",
        className: [
            "flex min-w-0 flex-col items-center justify-center rounded-lg border border-dashed border-[var(--border)] px-6 py-12 text-center",
            className
        ].filter(Boolean).join(" "),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex max-w-lg flex-col items-center gap-3",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "text-lg font-semibold text-[var(--foreground)]",
                    children: title
                }, void 0, false, {
                    fileName: "[project]/src/components/landing/marketplace/marketplace-empty-state.tsx",
                    lineNumber: 93,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm leading-6 text-[var(--foreground-secondary)]",
                    children: description
                }, void 0, false, {
                    fileName: "[project]/src/components/landing/marketplace/marketplace-empty-state.tsx",
                    lineNumber: 97,
                    columnNumber: 9
                }, this),
                action ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "pt-2",
                    children: action
                }, void 0, false, {
                    fileName: "[project]/src/components/landing/marketplace/marketplace-empty-state.tsx",
                    lineNumber: 102,
                    columnNumber: 11
                }, this) : null
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/landing/marketplace/marketplace-empty-state.tsx",
            lineNumber: 92,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/landing/marketplace/marketplace-empty-state.tsx",
        lineNumber: 83,
        columnNumber: 5
    }, this);
}
_c = MarketplaceEmptyState;
var _c;
__turbopack_context__.k.register(_c, "MarketplaceEmptyState");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/landing/marketplace/marketplace-error-icon.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Marketplace Error Icon
// -----------------------------------------------------------------------------
//
// Reusable visual indicator for marketplace error states.
//
// Responsibilities:
//
// - provide a consistent visual treatment for marketplace errors;
// - remain presentation-only;
// - support optional layout customization through className.
//
// This component does not:
//
// - contain marketplace logic;
// - manage error state;
// - perform requests;
// - handle retry behaviour;
// - depend on the marketplace error-state component.
//
// The icon is decorative. The surrounding error component provides the
// meaningful error title and description for both visual and assistive users.
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "MarketplaceErrorIcon",
    ()=>MarketplaceErrorIcon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function MarketplaceErrorIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "aria-hidden": "true",
        className: [
            'flex size-12 shrink-0 items-center justify-center rounded-full',
            'border border-[var(--border)]',
            'bg-[var(--background-secondary)]',
            'text-[var(--foreground-muted)]',
            className
        ].filter(Boolean).join(' '),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            "aria-hidden": "true",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: 1.8,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            className: "size-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M12 8v4"
                }, void 0, false, {
                    fileName: "[project]/src/components/landing/marketplace/marketplace-error-icon.tsx",
                    lineNumber: 58,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M12 16h0.01"
                }, void 0, false, {
                    fileName: "[project]/src/components/landing/marketplace/marketplace-error-icon.tsx",
                    lineNumber: 59,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M10.3 3.9 2.7 17a2 2 0 0 0 1.7 3h15.2a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"
                }, void 0, false, {
                    fileName: "[project]/src/components/landing/marketplace/marketplace-error-icon.tsx",
                    lineNumber: 60,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/landing/marketplace/marketplace-error-icon.tsx",
            lineNumber: 48,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/landing/marketplace/marketplace-error-icon.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, this);
}
_c = MarketplaceErrorIcon;
var _c;
__turbopack_context__.k.register(_c, "MarketplaceErrorIcon");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/landing/marketplace/marketplace-error-state.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MarketplaceErrorState",
    ()=>MarketplaceErrorState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// sisiMove — Marketplace Error State
// -----------------------------------------------------------------------------
//
// Presentation component for errors encountered while loading or refreshing
// the public marketplace.
//
// Responsibilities:
//
// - present a clear, user-facing error message;
// - present a reusable marketplace error icon;
// - optionally expose a retry action supplied by the parent;
// - communicate the error state accessibly;
// - reflect retry progress without owning request state.
//
// This component does not:
//
// - fetch marketplace data;
// - determine the cause of the error;
// - perform retries internally;
// - manage loading or error state;
// - construct routes or marketplace queries.
//
// The parent application layer owns the request lifecycle and supplies the
// retry callback when retrying is supported.
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$marketplace$2f$marketplace$2d$error$2d$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/marketplace/marketplace-error-icon.tsx [app-client] (ecmascript)");
;
;
function MarketplaceErrorState({ title = 'We could not load the marketplace', description = 'Something went wrong while loading available journeys and travel demands. Please try again.', onRetry, isRetrying = false, className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        role: "alert",
        "aria-live": "assertive",
        className: [
            'flex min-w-0 flex-col items-center justify-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--background)] px-6 py-10 text-center',
            className
        ].filter(Boolean).join(' '),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$marketplace$2f$marketplace$2d$error$2d$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MarketplaceErrorIcon"], {}, void 0, false, {
                fileName: "[project]/src/components/landing/marketplace/marketplace-error-state.tsx",
                lineNumber: 75,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex min-w-0 flex-col items-center gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-base font-semibold text-[var(--foreground)]",
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/marketplace/marketplace-error-state.tsx",
                        lineNumber: 78,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "max-w-xl text-sm leading-6 text-[var(--foreground-muted)]",
                        children: description
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/marketplace/marketplace-error-state.tsx",
                        lineNumber: 82,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/landing/marketplace/marketplace-error-state.tsx",
                lineNumber: 77,
                columnNumber: 7
            }, this),
            onRetry && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: onRetry,
                disabled: isRetrying,
                "aria-busy": isRetrying,
                className: "inline-flex min-h-10 items-center justify-center rounded-md border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--background-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
                children: isRetrying ? 'Retrying…' : 'Try again'
            }, void 0, false, {
                fileName: "[project]/src/components/landing/marketplace/marketplace-error-state.tsx",
                lineNumber: 88,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/landing/marketplace/marketplace-error-state.tsx",
        lineNumber: 65,
        columnNumber: 5
    }, this);
}
_c = MarketplaceErrorState;
var _c;
__turbopack_context__.k.register(_c, "MarketplaceErrorState");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/landing/marketplace/marketplace-filter-bar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Public Marketplace Filter Bar
// -----------------------------------------------------------------------------
//
// Composition boundary for public marketplace discovery controls.
//
// The filter bar composes two presentation components:
//
//     MarketplaceFilters
//         ├── origin
//         ├── destination
//         ├── date
//         └── secondary filters
//
//     MarketplaceTabs
//         ├── All
//         ├── Journeys
//         └── Demand
//
// The marketplace is intentionally browse-first.
//
// Published marketplace content is visible without requiring a search.
// These controls refine the visible marketplace and select which marketplace
// stream is currently being viewed.
//
// -----------------------------------------------------------------------------
// Architectural boundary
// -----------------------------------------------------------------------------
//
// This component is presentation-only.
//
// It does NOT:
//
// - fetch marketplace data;
// - own marketplace query state;
// - update URL state;
// - perform filtering or sorting;
// - determine booking eligibility;
// - contain Journey business rules;
// - contain Journey Demand business rules.
//
// The parent marketplace boundary owns query state and supplies the callbacks
// used to update that state.
//
// -----------------------------------------------------------------------------
// Responsive presentation
// -----------------------------------------------------------------------------
//
// The marketplace filter surface is mobile-first and compact.
//
// The controls:
//
// - remain horizontally oriented;
// - contract with the available viewport;
// - keep stream tabs visually connected to the filters;
// - avoid unnecessary hero-like whitespace;
// - do not introduce horizontal page scrolling.
//
// The child presentation components remain responsible for the exact sizing
// and behavior of their individual controls.
//
// -----------------------------------------------------------------------------
// Visual structure
// -----------------------------------------------------------------------------
//
//     [ From ] [ To ] [ Date ] [ Refine ]
//
//     [ All ] [ Journeys ] [ Demand ]
//
// Refinement remains above stream navigation because the visitor is already
// inside the marketplace. The controls refine the market rather than acting
// as a gate before the market is shown.
//
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "MarketplaceFilterBar",
    ()=>MarketplaceFilterBar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/foundation/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/utils/cn.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$marketplace$2f$marketplace$2d$filters$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/marketplace/marketplace-filters.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$marketplace$2f$marketplace$2d$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/marketplace/marketplace-tabs.tsx [app-client] (ecmascript)");
;
;
;
;
function MarketplaceFilterBar({ query, onTypeChange, onFromChange, onToChange, onDateChange, onFilterChange, className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        "aria-label": "Marketplace controls",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('w-full min-w-0', className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full min-w-0",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$marketplace$2f$marketplace$2d$filters$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MarketplaceFilters"], {
                    query: query,
                    onFromChange: onFromChange,
                    onToChange: onToChange,
                    onDateChange: onDateChange,
                    onFilterChange: onFilterChange
                }, void 0, false, {
                    fileName: "[project]/src/components/landing/marketplace/marketplace-filter-bar.tsx",
                    lineNumber: 170,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/landing/marketplace/marketplace-filter-bar.tsx",
                lineNumber: 169,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('mt-2', 'flex w-full min-w-0', 'items-center', 'sm:mt-2.5'),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$marketplace$2f$marketplace$2d$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MarketplaceTabs"], {
                    value: query.type,
                    onChange: onTypeChange
                }, void 0, false, {
                    fileName: "[project]/src/components/landing/marketplace/marketplace-filter-bar.tsx",
                    lineNumber: 195,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/landing/marketplace/marketplace-filter-bar.tsx",
                lineNumber: 187,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/landing/marketplace/marketplace-filter-bar.tsx",
        lineNumber: 154,
        columnNumber: 5
    }, this);
}
_c = MarketplaceFilterBar;
var _c;
__turbopack_context__.k.register(_c, "MarketplaceFilterBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/landing/marketplace/marketplace-filters.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Public Marketplace Filters
// -----------------------------------------------------------------------------
//
// Primary and secondary discovery controls for the public marketplace.
//
// The marketplace is browse-first:
//
//     Published marketplace
//             ↓
//     Visitor optionally refines
//             ↓
//     Matching marketplace items
//
// This component renders the visitor-facing controls used to refine the
// currently visible marketplace.
//
// It does NOT:
//
// - fetch marketplace data;
// - perform filtering itself;
// - perform sorting;
// - update URL state directly;
// - contain Journey business rules;
// - contain Journey Demand business rules;
// - determine booking eligibility;
// - determine whether a Journey or Demand is valid.
//
// The parent marketplace/query boundary owns the actual query state and
// decides what to do when a value changes.
//
// -----------------------------------------------------------------------------
//
// Query mapping
//
//     Primary discovery
//         ├── From
//         ├── To
//         └── Date
//
//     Secondary refinement
//         ├── Minimum seats
//         ├── Maximum price
//         ├── Verified traveller
//         └── Vehicle available
//
//                         ↓
//
//                 PublicMarketplaceQuery
//
// The component deals only with values already represented by the marketplace
// read model.
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "MarketplaceFilters",
    ()=>MarketplaceFilters
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------
function valueOrEmpty(value) {
    return value ?? '';
}
function filterValue(filter) {
    return filter ?? {
        minimumSeats: null,
        maximumPricePerSeat: null,
        hasVehicle: null,
        verifiedTravellerOnly: null
    };
}
// -----------------------------------------------------------------------------
// Small presentation icons
// -----------------------------------------------------------------------------
//
// These icons are intentionally local to this presentation component.
//
// They do not represent domain concepts, business rules, or feature logic.
// -----------------------------------------------------------------------------
function RoutePointIcon({ type }) {
    if (type === 'from') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            "aria-hidden": "true",
            className: "\r\n\n          flex h-8 w-8 shrink-0 items-center justify-center\r\n\n          rounded-lg\r\n\n          bg-[var(--brand-soft)]\r\n\n          text-[var(--brand)]\r\n\n        ",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                viewBox: "0 0 20 20",
                fill: "none",
                className: "h-4 w-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "10",
                        cy: "10",
                        r: "3",
                        stroke: "currentColor",
                        strokeWidth: "1.5"
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                        lineNumber: 159,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M10 3v3M10 14v3M3 10h3M14 10h3",
                        stroke: "currentColor",
                        strokeWidth: "1.5",
                        strokeLinecap: "round"
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                        lineNumber: 167,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                lineNumber: 154,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
            lineNumber: 145,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        "aria-hidden": "true",
        className: "\r\n\n        flex h-8 w-8 shrink-0 items-center justify-center\r\n\n        rounded-lg\r\n\n        bg-[var(--background-muted)]\r\n\n        text-[var(--foreground-secondary)]\r\n\n      ",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 20 20",
            fill: "none",
            className: "h-4 w-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M10 3.5v10.5m0 0 3.5-3.5M10 14l-3.5-3.5",
                stroke: "currentColor",
                strokeWidth: "1.5",
                strokeLinecap: "round",
                strokeLinejoin: "round"
            }, void 0, false, {
                fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                lineNumber: 193,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
            lineNumber: 188,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
        lineNumber: 179,
        columnNumber: 5
    }, this);
}
_c = RoutePointIcon;
function CalendarIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        viewBox: "0 0 20 20",
        fill: "none",
        className: "h-4 w-4",
        "aria-hidden": "true",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "3",
                y: "4.5",
                width: "14",
                height: "12",
                rx: "2",
                stroke: "currentColor",
                strokeWidth: "1.5"
            }, void 0, false, {
                fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                lineNumber: 214,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M6.5 3v3M13.5 3v3M3 8h14",
                stroke: "currentColor",
                strokeWidth: "1.5",
                strokeLinecap: "round"
            }, void 0, false, {
                fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                lineNumber: 224,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
        lineNumber: 208,
        columnNumber: 5
    }, this);
}
_c1 = CalendarIcon;
function SlidersIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        viewBox: "0 0 20 20",
        fill: "none",
        className: "h-4 w-4",
        "aria-hidden": "true",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M4 5h12M6.5 10h7M8.5 15h3",
                stroke: "currentColor",
                strokeWidth: "1.5",
                strokeLinecap: "round"
            }, void 0, false, {
                fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                lineNumber: 243,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "7",
                cy: "5",
                r: "1.5",
                fill: "var(--surface)",
                stroke: "currentColor",
                strokeWidth: "1.5"
            }, void 0, false, {
                fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                lineNumber: 250,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "13",
                cy: "10",
                r: "1.5",
                fill: "var(--surface)",
                stroke: "currentColor",
                strokeWidth: "1.5"
            }, void 0, false, {
                fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                lineNumber: 259,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "10",
                cy: "15",
                r: "1.5",
                fill: "var(--surface)",
                stroke: "currentColor",
                strokeWidth: "1.5"
            }, void 0, false, {
                fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                lineNumber: 268,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
        lineNumber: 237,
        columnNumber: 5
    }, this);
}
_c2 = SlidersIcon;
function MarketplaceFilters({ query, onFromChange, onToChange, onDateChange, onFilterChange, className }) {
    const filter = filterValue(query.filter);
    /**
   * Applies one or more changes to the current secondary filter state.
   *
   * The presentation component keeps the filter representation coherent but
   * does not decide what those filters mean or how they are applied to the
   * marketplace.
   */ const updateFilter = (changes)=>{
        const nextFilter = {
            ...filter,
            ...changes
        };
        const hasActiveFilter = nextFilter.minimumSeats !== null || nextFilter.maximumPricePerSeat !== null || nextFilter.hasVehicle !== null || nextFilter.verifiedTravellerOnly !== null;
        onFilterChange(hasActiveFilter ? nextFilter : null);
    };
    /**
   * Number of active secondary refinements.
   *
   * This is presentation-only state derived from the controlled query.
   */ const activeFilterCount = [
        filter.minimumSeats !== null,
        filter.maximumPricePerSeat !== null,
        filter.hasVehicle === true,
        filter.verifiedTravellerOnly === true
    ].filter(Boolean).length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        "aria-label": "Marketplace discovery filters",
        className: [
            'w-full min-w-0',
            className
        ].filter(Boolean).join(' '),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "\r\n\n          w-full min-w-0\r\n\n          overflow-hidden\r\n\n          rounded-xl sm:rounded-2xl\r\n\n          border border-[var(--border)]\r\n\n          bg-[var(--surface)]\r\n\n          shadow-[var(--shadow-sm)]\r\n\n        ",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "\r\n\n            grid min-w-0\r\n\n            grid-cols-[minmax(0,1fr)_minmax(0,1fr)]\r\n\n            md:grid-cols-[minmax(0,1.15fr)_minmax(0,1.15fr)_minmax(0,0.9fr)]\r\n\n            lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.8fr)_auto]\r\n\n          ",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "\r\n\n              min-w-0\r\n\n              border-b border-[var(--border)]\r\n\n              md:border-b-0 md:border-r\r\n\n            ",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                htmlFor: "marketplace-from",
                                className: "\r\n\n                flex min-h-[60px] cursor-text\r\n\n                min-w-0 items-center\r\n\n                gap-2 sm:gap-2.5\r\n\n                px-2.5 sm:px-3 md:px-3.5 lg:px-4\r\n\n                transition-colors\r\n\n                hover:bg-[var(--background-subtle)]\r\n\n              ",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RoutePointIcon, {
                                        type: "from"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                                        lineNumber: 389,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "min-w-0 flex-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "\r\n\n                    block truncate\r\n\n                    text-[9px] sm:text-[10px]\r\n\n                    font-semibold uppercase\r\n\n                    tracking-[0.1em]\r\n\n                    text-[var(--foreground-subtle)]\r\n\n                  ",
                                                children: "From"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                                                lineNumber: 392,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                id: "marketplace-from",
                                                type: "text",
                                                value: valueOrEmpty(query.from),
                                                onChange: (event)=>onFromChange(event.target.value || null),
                                                placeholder: "Departure",
                                                autoComplete: "off",
                                                className: "\r\n\n                    mt-0.5 block w-full min-w-0\r\n\n                    border-0 bg-transparent p-0\r\n\n                    text-xs sm:text-sm\r\n\n                    font-medium\r\n\n                    text-[var(--foreground)]\r\n\n                    outline-none\r\n\n                    placeholder:text-[var(--foreground-subtle)]\r\n\n                  "
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                                                lineNumber: 404,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                                        lineNumber: 391,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                                lineNumber: 378,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                            lineNumber: 371,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "\r\n\n              min-w-0\r\n\n              border-b border-[var(--border)]\r\n\n              md:border-b-0 md:border-r\r\n\n            ",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                htmlFor: "marketplace-to",
                                className: "\r\n\n                flex min-h-[60px] cursor-text\r\n\n                min-w-0 items-center\r\n\n                gap-2 sm:gap-2.5\r\n\n                px-2.5 sm:px-3 md:px-3.5 lg:px-4\r\n\n                transition-colors\r\n\n                hover:bg-[var(--background-subtle)]\r\n\n              ",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RoutePointIcon, {
                                        type: "to"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                                        lineNumber: 447,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "min-w-0 flex-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "\r\n\n                    block truncate\r\n\n                    text-[9px] sm:text-[10px]\r\n\n                    font-semibold uppercase\r\n\n                    tracking-[0.1em]\r\n\n                    text-[var(--foreground-subtle)]\r\n\n                  ",
                                                children: "To"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                                                lineNumber: 450,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                id: "marketplace-to",
                                                type: "text",
                                                value: valueOrEmpty(query.to),
                                                onChange: (event)=>onToChange(event.target.value || null),
                                                placeholder: "Destination",
                                                autoComplete: "off",
                                                className: "\r\n\n                    mt-0.5 block w-full min-w-0\r\n\n                    border-0 bg-transparent p-0\r\n\n                    text-xs sm:text-sm\r\n\n                    font-medium\r\n\n                    text-[var(--foreground)]\r\n\n                    outline-none\r\n\n                    placeholder:text-[var(--foreground-subtle)]\r\n\n                  "
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                                                lineNumber: 462,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                                        lineNumber: 449,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                                lineNumber: 436,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                            lineNumber: 429,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "\r\n\n              min-w-0\r\n\n              border-b border-[var(--border)]\r\n\n              md:col-span-1\r\n\n              md:border-b-0 md:border-r\r\n\n              max-[767px]:col-span-2\r\n\n            ",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                htmlFor: "marketplace-date",
                                className: "\r\n\n                flex min-h-[60px] cursor-pointer\r\n\n                min-w-0 items-center\r\n\n                gap-2 sm:gap-2.5\r\n\n                px-2.5 sm:px-3 md:px-3.5 lg:px-4\r\n\n                transition-colors\r\n\n                hover:bg-[var(--background-subtle)]\r\n\n              ",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        "aria-hidden": "true",
                                        className: "\r\n\n                  flex h-8 w-8 shrink-0 items-center justify-center\r\n\n                  rounded-lg\r\n\n                  bg-[var(--background-muted)]\r\n\n                  text-[var(--foreground-secondary)]\r\n\n                ",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CalendarIcon, {}, void 0, false, {
                                            fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                                            lineNumber: 516,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                                        lineNumber: 507,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "min-w-0 flex-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "\r\n\n                    block truncate\r\n\n                    text-[9px] sm:text-[10px]\r\n\n                    font-semibold uppercase\r\n\n                    tracking-[0.1em]\r\n\n                    text-[var(--foreground-subtle)]\r\n\n                  ",
                                                children: "Date"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                                                lineNumber: 520,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                id: "marketplace-date",
                                                type: "date",
                                                value: valueOrEmpty(query.date),
                                                onChange: (event)=>onDateChange(event.target.value || null),
                                                className: "\r\n\n                    mt-0.5 block w-full min-w-0\r\n\n                    border-0 bg-transparent p-0\r\n\n                    text-xs sm:text-sm\r\n\n                    font-medium\r\n\n                    text-[var(--foreground)]\r\n\n                    outline-none\r\n\n                  "
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                                                lineNumber: 532,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                                        lineNumber: 519,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                                lineNumber: 496,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                            lineNumber: 487,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "\r\n\n              flex min-h-[60px]\r\n\n              min-w-0\r\n\n              items-center\r\n\n              px-2.5 sm:px-3 md:px-3.5 lg:px-4\r\n\n              max-[767px]:col-span-2\r\n\n            ",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "\r\n\n                flex w-full min-w-0\r\n\n                items-center\r\n\n                gap-2.5\r\n\n              ",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        "aria-hidden": "true",
                                        className: "\r\n\n                  flex h-8 w-8 shrink-0\r\n\n                  items-center justify-center\r\n\n                  rounded-lg\r\n\n                  bg-[var(--brand-soft)]\r\n\n                  text-[var(--brand)]\r\n\n                ",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SlidersIcon, {}, void 0, false, {
                                            fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                                            lineNumber: 580,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                                        lineNumber: 570,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "min-w-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "\r\n\n                    block truncate\r\n\n                    text-[9px] sm:text-[10px]\r\n\n                    font-semibold uppercase\r\n\n                    tracking-[0.1em]\r\n\n                    text-[var(--foreground-subtle)]\r\n\n                  ",
                                                children: "Refine"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                                                lineNumber: 584,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "\r\n\n                    block truncate\r\n\n                    text-xs sm:text-sm\r\n\n                    font-medium\r\n\n                    text-[var(--foreground)]\r\n\n                  ",
                                                children: activeFilterCount > 0 ? `${activeFilterCount} active` : 'All options'
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                                                lineNumber: 596,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                                        lineNumber: 583,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                                lineNumber: 563,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                            lineNumber: 554,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                    lineNumber: 361,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "\r\n\n            border-t border-[var(--border)]\r\n\n            bg-[var(--background-subtle)]\r\n\n            px-2.5 py-2.5\r\n\n            sm:px-3 sm:py-3\r\n\n            md:px-4\r\n\n          ",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "\r\n\n              flex min-w-0\r\n\n              flex-wrap\r\n\n              items-center\r\n\n              gap-2\r\n\n            ",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "\r\n\n                mr-1 shrink-0\r\n\n                text-[9px] sm:text-[10px]\r\n\n                font-semibold uppercase\r\n\n                tracking-[0.1em]\r\n\n                text-[var(--foreground-subtle)]\r\n\n              ",
                                children: "Refine results"
                            }, void 0, false, {
                                fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                                lineNumber: 640,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "\r\n\n                flex min-w-0 min-h-9\r\n\n                items-center gap-1.5\r\n\n                rounded-lg\r\n\n                border border-[var(--border)]\r\n\n                bg-[var(--surface)]\r\n\n                px-2.5\r\n\n                transition-colors\r\n\n                focus-within:border-[var(--brand)]\r\n\n                focus-within:ring-2\r\n\n                focus-within:ring-[var(--brand)]/10\r\n\n              ",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "\r\n\n                  shrink-0\r\n\n                  text-[11px] sm:text-xs\r\n\n                  text-[var(--foreground-muted)]\r\n\n                ",
                                        children: "Seats"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                                        lineNumber: 668,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        "aria-label": "Minimum seats",
                                        value: filter.minimumSeats ?? '',
                                        onChange: (event)=>updateFilter({
                                                minimumSeats: event.target.value ? Number(event.target.value) : null
                                            }),
                                        className: "\r\n\n                  min-w-0\r\n\n                  border-0 bg-transparent\r\n\n                  py-1 pr-0\r\n\n                  text-xs sm:text-sm\r\n\n                  font-medium\r\n\n                  text-[var(--foreground)]\r\n\n                  outline-none\r\n\n                ",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "",
                                                children: "Any"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                                                lineNumber: 698,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "1",
                                                children: "1+ seat"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                                                lineNumber: 699,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "2",
                                                children: "2+ seats"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                                                lineNumber: 700,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "3",
                                                children: "3+ seats"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                                                lineNumber: 701,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "4",
                                                children: "4+ seats"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                                                lineNumber: 702,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                                        lineNumber: 678,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                                lineNumber: 654,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "\r\n\n                flex min-w-0 min-h-9\r\n\n                items-center gap-1.5\r\n\n                rounded-lg\r\n\n                border border-[var(--border)]\r\n\n                bg-[var(--surface)]\r\n\n                px-2.5\r\n\n                transition-colors\r\n\n                focus-within:border-[var(--brand)]\r\n\n                focus-within:ring-2\r\n\n                focus-within:ring-[var(--brand)]/10\r\n\n              ",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "\r\n\n                  shrink-0\r\n\n                  text-[11px] sm:text-xs\r\n\n                  text-[var(--foreground-muted)]\r\n\n                ",
                                        children: "Price"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                                        lineNumber: 722,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        "aria-label": "Maximum price per seat",
                                        value: filter.maximumPricePerSeat ?? '',
                                        onChange: (event)=>updateFilter({
                                                maximumPricePerSeat: event.target.value ? Number(event.target.value) : null
                                            }),
                                        className: "\r\n\n                  min-w-0\r\n\n                  border-0 bg-transparent\r\n\n                  py-1 pr-0\r\n\n                  text-xs sm:text-sm\r\n\n                  font-medium\r\n\n                  text-[var(--foreground)]\r\n\n                  outline-none\r\n\n                ",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "",
                                                children: "Any"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                                                lineNumber: 752,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "500",
                                                children: "KES 500"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                                                lineNumber: 753,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "1000",
                                                children: "KES 1,000"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                                                lineNumber: 754,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "2000",
                                                children: "KES 2,000"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                                                lineNumber: 755,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "5000",
                                                children: "KES 5,000"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                                                lineNumber: 756,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                                        lineNumber: 732,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                                lineNumber: 708,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "\r\n\n                inline-flex min-h-9\r\n\n                min-w-0\r\n\n                cursor-pointer\r\n\n                items-center gap-1.5\r\n\n                rounded-lg\r\n\n                border border-transparent\r\n\n                px-2\r\n\n                text-xs sm:text-sm\r\n\n                text-[var(--foreground-secondary)]\r\n\n                transition-colors\r\n\n                hover:bg-[var(--surface)]\r\n\n              ",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "checkbox",
                                        checked: filter.verifiedTravellerOnly === true,
                                        onChange: (event)=>updateFilter({
                                                verifiedTravellerOnly: event.target.checked ? true : null
                                            }),
                                        className: "\r\n\n                  size-4 shrink-0\r\n\n                  rounded\r\n\n                  border-[var(--border-strong)]\r\n\n                  accent-[var(--brand)]\r\n\n                "
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                                        lineNumber: 777,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "truncate",
                                        children: "Verified travellers"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                                        lineNumber: 795,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                                lineNumber: 762,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "\r\n\n                inline-flex min-h-9\r\n\n                min-w-0\r\n\n                cursor-pointer\r\n\n                items-center gap-1.5\r\n\n                rounded-lg\r\n\n                border border-transparent\r\n\n                px-2\r\n\n                text-xs sm:text-sm\r\n\n                text-[var(--foreground-secondary)]\r\n\n                transition-colors\r\n\n                hover:bg-[var(--surface)]\r\n\n              ",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "checkbox",
                                        checked: filter.hasVehicle === true,
                                        onChange: (event)=>updateFilter({
                                                hasVehicle: event.target.checked ? true : null
                                            }),
                                        className: "\r\n\n                  size-4 shrink-0\r\n\n                  rounded\r\n\n                  border-[var(--border-strong)]\r\n\n                  accent-[var(--brand)]\r\n\n                "
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                                        lineNumber: 817,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "truncate",
                                        children: "Vehicle available"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                                        lineNumber: 835,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                                lineNumber: 802,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                        lineNumber: 632,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
                    lineNumber: 623,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
            lineNumber: 341,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/landing/marketplace/marketplace-filters.tsx",
        lineNumber: 332,
        columnNumber: 5
    }, this);
}
_c3 = MarketplaceFilters;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "RoutePointIcon");
__turbopack_context__.k.register(_c1, "CalendarIcon");
__turbopack_context__.k.register(_c2, "SlidersIcon");
__turbopack_context__.k.register(_c3, "MarketplaceFilters");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/landing/marketplace/marketplace-header.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MarketplaceHeader",
    ()=>MarketplaceHeader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// sisiMove — Public Marketplace Header
// -----------------------------------------------------------------------------
//
// Compact presentation header for the public marketplace.
//
// The landing hero introduces the journey market. This component does not
// repeat that introduction.
//
// Its responsibility is to establish the marketplace discovery surface and
// provide concise context for the marketplace stream currently selected.
//
//     MARKET
//     Browse the marketplace
//     Browse available journeys and travel plans.
//
// The selected stream is supplied by the parent marketplace boundary.
//
// This component does NOT:
//
// - fetch marketplace data;
// - own marketplace query state;
// - update URL state;
// - perform filtering;
// - perform sorting;
// - determine whether marketplace items exist;
// - contain Journey business logic;
// - contain Journey Demand business logic;
// - render marketplace results;
// - render marketplace tabs.
//
// MarketplaceTabs owns the interactive stream selection control.
//
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$car$2d$front$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CarFront$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/car-front.mjs [app-client] (ecmascript) <export default as CarFront>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Store$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/store.mjs [app-client] (ecmascript) <export default as Store>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2d$round$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UsersRound$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users-round.mjs [app-client] (ecmascript) <export default as UsersRound>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/foundation/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/utils/cn.ts [app-client] (ecmascript)");
;
;
;
// =============================================================================
// Presentation helpers
// =============================================================================
function getMarketplaceDescription(type) {
    switch(type){
        case 'JOURNEY':
            return 'Browse published journeys with available seats.';
        case 'DEMAND':
            return 'Browse travel plans looking for a match.';
        case 'ALL':
        default:
            return 'Browse available journeys and travel plans.';
    }
}
// =============================================================================
// Marketplace Scope Icon
// =============================================================================
//
// Keep this component stable outside MarketplaceHeader's render.
//
// Do not return a Lucide component from a render-time helper and then render
// that returned component as <MarketplaceIcon />. React/compiler rules treat
// that as creating a component during render.
//
// Instead, this stable component owns the switch and renders the appropriate
// Lucide component directly.
// -----------------------------------------------------------------------------
function MarketplaceScopeIcon({ type }) {
    switch(type){
        case 'JOURNEY':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$car$2d$front$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CarFront$3e$__["CarFront"], {
                "aria-hidden": "true",
                className: "h-3.5 w-3.5"
            }, void 0, false, {
                fileName: "[project]/src/components/landing/marketplace/marketplace-header.tsx",
                lineNumber: 106,
                columnNumber: 9
            }, this);
        case 'DEMAND':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2d$round$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UsersRound$3e$__["UsersRound"], {
                "aria-hidden": "true",
                className: "h-3.5 w-3.5"
            }, void 0, false, {
                fileName: "[project]/src/components/landing/marketplace/marketplace-header.tsx",
                lineNumber: 114,
                columnNumber: 9
            }, this);
        case 'ALL':
        default:
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Store$3e$__["Store"], {
                "aria-hidden": "true",
                className: "h-3.5 w-3.5"
            }, void 0, false, {
                fileName: "[project]/src/components/landing/marketplace/marketplace-header.tsx",
                lineNumber: 123,
                columnNumber: 9
            }, this);
    }
}
_c = MarketplaceScopeIcon;
function MarketplaceHeader({ type, className }) {
    const description = getMarketplaceDescription(type);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        "aria-labelledby": "marketplace-heading",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('min-w-0', className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex min-w-0 items-center gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        "aria-hidden": "true",
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex h-6 w-6 shrink-0 items-center justify-center', 'rounded-[var(--radius-sm)]', 'bg-[var(--brand-soft)]', 'text-[var(--brand)]'),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MarketplaceScopeIcon, {
                            type: type
                        }, void 0, false, {
                            fileName: "[project]/src/components/landing/marketplace/marketplace-header.tsx",
                            lineNumber: 167,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/marketplace/marketplace-header.tsx",
                        lineNumber: 158,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('text-[9px] font-semibold uppercase', 'tracking-[0.16em]', 'text-[var(--brand)]', 'sm:text-[10px]'),
                        children: "Market"
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/marketplace/marketplace-header.tsx",
                        lineNumber: 170,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/landing/marketplace/marketplace-header.tsx",
                lineNumber: 157,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-1.5 min-w-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        id: "marketplace-heading",
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('text-lg font-semibold', 'tracking-[-0.02em]', 'text-[var(--foreground)]', 'sm:text-xl'),
                        children: "Browse the marketplace"
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/marketplace/marketplace-header.tsx",
                        lineNumber: 187,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('mt-0.5 max-w-2xl', 'text-xs leading-5', 'text-[var(--foreground-muted)]', 'sm:text-sm sm:leading-6'),
                        children: description
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/marketplace/marketplace-header.tsx",
                        lineNumber: 199,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/landing/marketplace/marketplace-header.tsx",
                lineNumber: 186,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/landing/marketplace/marketplace-header.tsx",
        lineNumber: 142,
        columnNumber: 5
    }, this);
}
_c1 = MarketplaceHeader;
var _c, _c1;
__turbopack_context__.k.register(_c, "MarketplaceScopeIcon");
__turbopack_context__.k.register(_c1, "MarketplaceHeader");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/landing/marketplace/marketplace-load-more.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Public Marketplace Load More
// -----------------------------------------------------------------------------
//
// Pagination control for the public marketplace.
//
// The marketplace may contain many published Journeys and Journey Demands.
// Results are therefore loaded in manageable pages.
//
// This component represents the "load more" interaction:
//
//     Current results
//           ↓
//       Load more
//           ↓
//     Request next page
//           ↓
//     Append results
//
// This component is intentionally presentation-only.
//
// It does NOT:
//
// - fetch marketplace data;
// - construct pagination cursors;
// - interpret continuation tokens;
// - append marketplace items;
// - own marketplace state;
// - determine whether another page exists;
// - contain Journey business rules;
// - contain Journey Demand business rules.
//
// The marketplace feature/read boundary owns pagination behavior and supplies
// the current state through props.
//
// -----------------------------------------------------------------------------
//
// Pagination boundary
//
// PublicMarketplacePagination
//     │
//     ├── count
//     ├── limit
//     ├── nextCursor
//     └── hasMore
//             │
//             ↓
//     MarketplaceLoadMore
//
// The component only needs `hasMore` and `isLoading` to determine whether the
// control should be displayed and whether it should be temporarily disabled.
//
// The cursor remains completely outside the UI component.
//
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "MarketplaceLoadMore",
    ()=>MarketplaceLoadMore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
// -----------------------------------------------------------------------------
// Presentation helpers
// -----------------------------------------------------------------------------
function LoadingSpinner() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        "aria-hidden": "true",
        className: "\r\n\n        h-4 w-4\r\n\n        animate-spin\r\n\n        rounded-full\r\n\n        border-2\r\n\n        border-[var(--border-strong)]\r\n\n        border-t-[var(--brand)]\r\n\n      "
    }, void 0, false, {
        fileName: "[project]/src/components/landing/marketplace/marketplace-load-more.tsx",
        lineNumber: 95,
        columnNumber: 5
    }, this);
}
_c = LoadingSpinner;
function MarketplaceLoadMore({ hasMore, isLoading = false, onLoadMore, className }) {
    /**
   * There is no useful action when the marketplace has reached its final
   * page. Returning null keeps the result stream visually clean.
   */ if (!hasMore) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: [
            'flex min-w-0 justify-center',
            'pt-1 sm:pt-2',
            className
        ].filter(Boolean).join(' '),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            type: "button",
            onClick: onLoadMore,
            disabled: isLoading,
            "aria-busy": isLoading,
            className: "\r\n\n          inline-flex\r\n\n          min-h-10\r\n\n          min-w-[120px]\r\n\n          items-center\r\n\n          justify-center\r\n\n          gap-2\r\n\n          rounded-lg\r\n\n          border border-[var(--border)]\r\n\n          bg-[var(--surface)]\r\n\n          px-4\r\n\n          py-2\r\n\n          text-sm\r\n\n          font-medium\r\n\n          text-[var(--foreground)]\r\n\n          shadow-[var(--shadow-sm)]\r\n\n          transition-colors\r\n\n          hover:bg-[var(--background-subtle)]\r\n\n          hover:border-[var(--border-strong)]\r\n\n          focus-visible:outline-none\r\n\n          focus-visible:ring-2\r\n\n          focus-visible:ring-[var(--brand)]\r\n\n          focus-visible:ring-offset-2\r\n\n          focus-visible:ring-offset-[var(--background)]\r\n\n          disabled:cursor-not-allowed\r\n\n          disabled:opacity-60\r\n\n        ",
            children: isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LoadingSpinner, {}, void 0, false, {
                        fileName: "[project]/src/components/landing/marketplace/marketplace-load-more.tsx",
                        lineNumber: 173,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "Loading…"
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/marketplace/marketplace-load-more.tsx",
                        lineNumber: 174,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/landing/marketplace/marketplace-load-more.tsx",
                lineNumber: 172,
                columnNumber: 11
            }, this) : 'Load more'
        }, void 0, false, {
            fileName: "[project]/src/components/landing/marketplace/marketplace-load-more.tsx",
            lineNumber: 138,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/landing/marketplace/marketplace-load-more.tsx",
        lineNumber: 129,
        columnNumber: 5
    }, this);
}
_c1 = MarketplaceLoadMore;
var _c, _c1;
__turbopack_context__.k.register(_c, "LoadingSpinner");
__turbopack_context__.k.register(_c1, "MarketplaceLoadMore");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/landing/marketplace/marketplace-loading-state.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Public Marketplace Loading State
// -----------------------------------------------------------------------------
//
// Loading-state presentation for the public marketplace.
//
// The marketplace may load:
//
// - the initial public marketplace;
// - a refined marketplace query;
// - another pagination page;
// - refreshed Journey and Journey Demand results.
//
// During these operations, the interface should preserve the marketplace
// structure instead of displaying a large blank area or abruptly changing
// layout.
//
// This component renders lightweight visual placeholders that intentionally
// mirror the horizontal geometry of the real marketplace cards.
//
// It is intentionally presentation-only.
//
// It does NOT:
//
// - fetch marketplace data;
// - own loading state;
// - determine which items are being loaded;
// - render actual Journey data;
// - render actual Journey Demand data;
// - perform filtering or sorting;
// - contain marketplace business rules.
//
// The parent decides when this component should be displayed.
//
// -----------------------------------------------------------------------------
//
// Loading boundary
//
// Marketplace read boundary
//          │
//          ├── isLoading
//          └── isRefreshing
//                  │
//                  ↓
//       MarketplaceLoadingState
//
// The component does not distinguish between Journey and Demand skeletons.
//
// Both marketplace item types use the same high-level horizontal loading
// geometry:
//
//     Date | Person | Route | Details | Price/Summary | Actions
//
// The exact content differs between Journey and Demand, but the marketplace
// presentation boundary benefits from a stable shared loading shape.
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "MarketplaceLoadingState",
    ()=>MarketplaceLoadingState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
// -----------------------------------------------------------------------------
// Skeleton primitives
// -----------------------------------------------------------------------------
//
// These primitives are local presentation helpers.
//
// They intentionally do not depend on Journey or Journey Demand models.
// A loading state should never require fabricated domain objects.
// -----------------------------------------------------------------------------
function SkeletonBlock({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "aria-hidden": "true",
        className: [
            'animate-pulse',
            'rounded-md',
            'bg-[var(--background-muted)]',
            className
        ].join(' ')
    }, void 0, false, {
        fileName: "[project]/src/components/landing/marketplace/marketplace-loading-state.tsx",
        lineNumber: 91,
        columnNumber: 5
    }, this);
}
_c = SkeletonBlock;
function SkeletonCircle({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "aria-hidden": "true",
        className: [
            'animate-pulse',
            'shrink-0',
            'rounded-full',
            'bg-[var(--background-muted)]',
            className
        ].join(' ')
    }, void 0, false, {
        fileName: "[project]/src/components/landing/marketplace/marketplace-loading-state.tsx",
        lineNumber: 110,
        columnNumber: 5
    }, this);
}
_c1 = SkeletonCircle;
// -----------------------------------------------------------------------------
// Marketplace Skeleton Card
// -----------------------------------------------------------------------------
//
// IMPORTANT:
//
// This skeleton deliberately follows the same horizontal composition model
// as the real marketplace cards.
//
// It does NOT reproduce Journey/Demand business content. It only preserves:
//
// - column geometry;
// - approximate density;
// - separators;
// - responsive shrinking;
// - action placement.
//
// This minimizes layout shift when real marketplace data arrives.
// -----------------------------------------------------------------------------
function MarketplaceSkeletonCard() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "aria-hidden": "true",
        className: "\r\n\n        flex\r\n\n        w-full\r\n\n        min-w-0\r\n\n        items-stretch\r\n\n        overflow-hidden\r\n\n        rounded-xl\r\n\n        border border-[var(--border)]\r\n\n        bg-[var(--surface)]\r\n\n        shadow-[var(--shadow-sm)]\r\n\n      ",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "\r\n\n          min-w-0\r\n\n          flex-[0.8]\r\n\n          px-1.5 py-2\r\n\n          sm:px-2 sm:py-2.5\r\n\n          md:px-2.5 md:py-3\r\n\n          lg:px-4 lg:py-4\r\n\n        ",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex min-w-0 flex-col gap-1.5",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SkeletonBlock, {
                            className: "h-2.5 w-10"
                        }, void 0, false, {
                            fileName: "[project]/src/components/landing/marketplace/marketplace-loading-state.tsx",
                            lineNumber: 175,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SkeletonBlock, {
                            className: "h-5 w-8"
                        }, void 0, false, {
                            fileName: "[project]/src/components/landing/marketplace/marketplace-loading-state.tsx",
                            lineNumber: 176,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SkeletonBlock, {
                            className: "h-2.5 w-10"
                        }, void 0, false, {
                            fileName: "[project]/src/components/landing/marketplace/marketplace-loading-state.tsx",
                            lineNumber: 177,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SkeletonBlock, {
                            className: "mt-1 h-3 w-12"
                        }, void 0, false, {
                            fileName: "[project]/src/components/landing/marketplace/marketplace-loading-state.tsx",
                            lineNumber: 178,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/landing/marketplace/marketplace-loading-state.tsx",
                    lineNumber: 174,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/landing/marketplace/marketplace-loading-state.tsx",
                lineNumber: 164,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "\r\n\n          min-w-0\r\n\n          flex-[1.4]\r\n\n          border-l border-[var(--border-subtle)]\r\n\n          px-1.5 py-2\r\n\n          sm:px-2 sm:py-2.5\r\n\n          md:px-2.5 md:py-3\r\n\n          lg:px-4 lg:py-4\r\n\n        ",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex min-w-0 items-center gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SkeletonCircle, {
                            className: "size-8 sm:size-9"
                        }, void 0, false, {
                            fileName: "[project]/src/components/landing/marketplace/marketplace-loading-state.tsx",
                            lineNumber: 198,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "min-w-0 flex-1 space-y-1.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SkeletonBlock, {
                                    className: "h-3 w-3/4 max-w-24"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/landing/marketplace/marketplace-loading-state.tsx",
                                    lineNumber: 201,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SkeletonBlock, {
                                    className: "h-2.5 w-1/2 max-w-16"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/landing/marketplace/marketplace-loading-state.tsx",
                                    lineNumber: 202,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SkeletonBlock, {
                                    className: "h-2.5 w-2/3 max-w-20"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/landing/marketplace/marketplace-loading-state.tsx",
                                    lineNumber: 203,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/landing/marketplace/marketplace-loading-state.tsx",
                            lineNumber: 200,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/landing/marketplace/marketplace-loading-state.tsx",
                    lineNumber: 197,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/landing/marketplace/marketplace-loading-state.tsx",
                lineNumber: 186,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "\r\n\n          min-w-0\r\n\n          flex-[1.6]\r\n\n          border-l border-[var(--border-subtle)]\r\n\n          px-1.5 py-2\r\n\n          sm:px-2 sm:py-2.5\r\n\n          md:px-2.5 md:py-3\r\n\n          lg:px-4 lg:py-4\r\n\n        ",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex min-w-0 flex-col justify-center gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex min-w-0 items-center gap-1.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SkeletonBlock, {
                                    className: "h-3 w-2.5"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/landing/marketplace/marketplace-loading-state.tsx",
                                    lineNumber: 225,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SkeletonBlock, {
                                    className: "h-3 w-3/5 max-w-24"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/landing/marketplace/marketplace-loading-state.tsx",
                                    lineNumber: 226,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/landing/marketplace/marketplace-loading-state.tsx",
                            lineNumber: 224,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex min-w-0 items-center gap-1.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SkeletonBlock, {
                                    className: "h-3 w-2.5"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/landing/marketplace/marketplace-loading-state.tsx",
                                    lineNumber: 230,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SkeletonBlock, {
                                    className: "h-3 w-3/4 max-w-28"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/landing/marketplace/marketplace-loading-state.tsx",
                                    lineNumber: 231,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/landing/marketplace/marketplace-loading-state.tsx",
                            lineNumber: 229,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SkeletonBlock, {
                            className: "h-2.5 w-1/2 max-w-20"
                        }, void 0, false, {
                            fileName: "[project]/src/components/landing/marketplace/marketplace-loading-state.tsx",
                            lineNumber: 234,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/landing/marketplace/marketplace-loading-state.tsx",
                    lineNumber: 223,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/landing/marketplace/marketplace-loading-state.tsx",
                lineNumber: 212,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "\r\n\n          min-w-0\r\n\n          flex-[1.4]\r\n\n          border-l border-[var(--border-subtle)]\r\n\n          px-1.5 py-2\r\n\n          sm:px-2 sm:py-2.5\r\n\n          md:px-2.5 md:py-3\r\n\n          lg:px-4 lg:py-4\r\n\n        ",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex min-w-0 items-center gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SkeletonBlock, {
                            className: "h-10 w-12 shrink-0 rounded-md sm:h-11 sm:w-14"
                        }, void 0, false, {
                            fileName: "[project]/src/components/landing/marketplace/marketplace-loading-state.tsx",
                            lineNumber: 254,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "min-w-0 flex-1 space-y-1.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SkeletonBlock, {
                                    className: "h-3 w-4/5 max-w-24"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/landing/marketplace/marketplace-loading-state.tsx",
                                    lineNumber: 257,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SkeletonBlock, {
                                    className: "h-2.5 w-3/5 max-w-20"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/landing/marketplace/marketplace-loading-state.tsx",
                                    lineNumber: 258,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SkeletonBlock, {
                                    className: "h-2.5 w-2/3 max-w-16"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/landing/marketplace/marketplace-loading-state.tsx",
                                    lineNumber: 259,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/landing/marketplace/marketplace-loading-state.tsx",
                            lineNumber: 256,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/landing/marketplace/marketplace-loading-state.tsx",
                    lineNumber: 253,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/landing/marketplace/marketplace-loading-state.tsx",
                lineNumber: 242,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "\r\n\n          min-w-0\r\n\n          flex-[0.9]\r\n\n          border-l border-[var(--border-subtle)]\r\n\n          px-1.5 py-2\r\n\n          sm:px-2 sm:py-2.5\r\n\n          md:px-2.5 md:py-3\r\n\n          lg:px-3 lg:py-4\r\n\n        ",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex min-w-0 flex-col gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SkeletonBlock, {
                            className: "h-4 w-3/4 max-w-20"
                        }, void 0, false, {
                            fileName: "[project]/src/components/landing/marketplace/marketplace-loading-state.tsx",
                            lineNumber: 280,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SkeletonBlock, {
                            className: "h-2.5 w-1/2 max-w-14"
                        }, void 0, false, {
                            fileName: "[project]/src/components/landing/marketplace/marketplace-loading-state.tsx",
                            lineNumber: 281,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SkeletonBlock, {
                            className: "h-2.5 w-4/5 max-w-20"
                        }, void 0, false, {
                            fileName: "[project]/src/components/landing/marketplace/marketplace-loading-state.tsx",
                            lineNumber: 282,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/landing/marketplace/marketplace-loading-state.tsx",
                    lineNumber: 279,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/landing/marketplace/marketplace-loading-state.tsx",
                lineNumber: 268,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "\r\n\n          flex\r\n\n          min-w-0\r\n\n          flex-[1.1]\r\n\n          items-center\r\n\n          border-l border-[var(--border-subtle)]\r\n\n          px-1.5 py-2\r\n\n          sm:px-2 sm:py-2.5\r\n\n          md:px-2.5 md:py-3\r\n\n          lg:px-3 lg:py-4\r\n\n        ",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex min-w-0 flex-wrap gap-1.5",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SkeletonBlock, {
                            className: "h-9 w-16 rounded-lg sm:w-20"
                        }, void 0, false, {
                            fileName: "[project]/src/components/landing/marketplace/marketplace-loading-state.tsx",
                            lineNumber: 304,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SkeletonBlock, {
                            className: "h-9 w-14 rounded-lg sm:w-16"
                        }, void 0, false, {
                            fileName: "[project]/src/components/landing/marketplace/marketplace-loading-state.tsx",
                            lineNumber: 305,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/landing/marketplace/marketplace-loading-state.tsx",
                    lineNumber: 303,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/landing/marketplace/marketplace-loading-state.tsx",
                lineNumber: 290,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/landing/marketplace/marketplace-loading-state.tsx",
        lineNumber: 146,
        columnNumber: 5
    }, this);
}
_c2 = MarketplaceSkeletonCard;
function MarketplaceLoadingState({ count = 6, className }) {
    /**
   * Protect the presentation layer from invalid counts while preserving the
   * caller's intended pagination/loading configuration.
   *
   * This does not represent marketplace business logic.
   */ const safeCount = Math.max(1, Math.floor(count));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        "aria-label": "Loading marketplace",
        "aria-busy": "true",
        className: [
            'flex min-w-0 flex-col gap-4',
            className
        ].filter(Boolean).join(' '),
        children: Array.from({
            length: safeCount
        }, (_, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MarketplaceSkeletonCard, {}, index, false, {
                fileName: "[project]/src/components/landing/marketplace/marketplace-loading-state.tsx",
                lineNumber: 341,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/src/components/landing/marketplace/marketplace-loading-state.tsx",
        lineNumber: 330,
        columnNumber: 5
    }, this);
}
_c3 = MarketplaceLoadingState;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "SkeletonBlock");
__turbopack_context__.k.register(_c1, "SkeletonCircle");
__turbopack_context__.k.register(_c2, "MarketplaceSkeletonCard");
__turbopack_context__.k.register(_c3, "MarketplaceLoadingState");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/landing/marketplace/marketplace-results.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Marketplace Results
// -----------------------------------------------------------------------------
//
// Presentation component for the public marketplace result collection.
//
// The marketplace is composed from two independent feature domains:
//
// - Journey
// - Journey Demand
//
// PublicMarketplaceItem is therefore a discriminated union. This component
// uses the item's `type` discriminator to select the appropriate presentation
// component:
//
// - JOURNEY → JourneyMarketplaceCard
// - DEMAND  → DemandMarketplaceCard
//
// -----------------------------------------------------------------------------
// RESULT LAYOUT
// -----------------------------------------------------------------------------
//
// Each marketplace item occupies one complete horizontal result row.
//
// The collection is rendered as a single vertical stream:
//
//     Journey 1
//     Journey 2
//     Demand 1
//     Journey 3
//     Demand 2
//
// This component deliberately does not use a multi-column grid. A grid would
// cause multiple marketplace items to appear beside one another, which is not
// the intended marketplace browsing experience.
//
// The individual JourneyMarketplaceCard and DemandMarketplaceCard components
// are responsible for the internal presentation of one marketplace item.
//
// This component is responsible only for stacking those items vertically and
// selecting the correct feature-domain presentation component.
// -----------------------------------------------------------------------------
//
// RESPONSIBILITIES
// -----------------------------------------------------------------------------
//
// This component:
//
// - renders marketplace items;
// - selects the correct card from the item discriminator;
// - preserves the order supplied by the parent;
// - receives presentation URLs from the parent;
// - renders Journey and Journey Demand in one marketplace stream;
// - preserves the independence of Journey and Journey Demand.
//
// This component does not:
//
// - fetch marketplace data;
// - filter or sort results;
// - construct URLs;
// - determine booking eligibility;
// - determine whether a Demand can be joined;
// - manage pagination;
// - contain marketplace business rules.
//
// The parent marketplace/application layer owns those concerns and supplies
// the resulting URLs and presentation configuration.
// -----------------------------------------------------------------------------
//
// IMMUTABILITY
// -----------------------------------------------------------------------------
//
// The marketplace collection is a public read-model collection.
//
// MarketplaceResults therefore accepts:
//
//     readonly PublicMarketplaceItem[]
//
// The presentation layer never mutates marketplace items. Keeping the
// collection readonly preserves the immutable read-model contract from the
// marketplace composition boundary through to the result renderer.
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "MarketplaceResults",
    ()=>MarketplaceResults
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$demands$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/landing/demands/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$demands$2f$demand$2d$marketplace$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/demands/demand-marketplace-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$journeys$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/landing/journeys/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$journeys$2f$journey$2d$marketplace$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/journeys/journey-marketplace-card.tsx [app-client] (ecmascript)");
;
;
;
// -----------------------------------------------------------------------------
// Exhaustiveness helper
// -----------------------------------------------------------------------------
//
// PublicMarketplaceItem is a discriminated union.
//
// Keeping this helper here means that adding another marketplace item type
// requires this renderer to be updated.
//
// This is preferable to silently returning `null`, because an unhandled
// marketplace type should become a compile-time architecture signal.
// -----------------------------------------------------------------------------
function assertNever(value) {
    throw new Error(`Unsupported marketplace item type: ${String(value)}`);
}
function MarketplaceResults({ items, getJourneyViewHref, getJourneyBookHref, getDemandViewHref, getDemandJoinHref, linkJourneyProviderToProfile = true, showJourneyProviderTrustBadges = true, linkDemandRequesterToProfile = true, showDemandRequesterTrustBadges = true, className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: [
            // -------------------------------------------------------------------
            // Result stream
            // -------------------------------------------------------------------
            //
            // The marketplace collection is intentionally a vertical stream.
            //
            // Each child card owns its own horizontal responsive layout.
            //
            // `min-w-0` is important because the child cards contain route,
            // traveller, vehicle, pricing and action content that must be allowed
            // to shrink with the available viewport.
            //
            'flex',
            'min-w-0',
            'flex-col',
            'gap-4',
            className
        ].filter(Boolean).join(' '),
        children: items.map((item)=>{
            // -------------------------------------------------------------------
            // Journey
            // -------------------------------------------------------------------
            switch(item.type){
                case 'JOURNEY':
                    {
                        const journey = item.journey;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$journeys$2f$journey$2d$marketplace$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JourneyMarketplaceCard"], {
                            journey: journey,
                            viewHref: getJourneyViewHref(journey.publicId),
                            bookHref: getJourneyBookHref?.(journey.publicId),
                            linkProviderToProfile: linkJourneyProviderToProfile,
                            showProviderTrustBadges: showJourneyProviderTrustBadges
                        }, `journey-${journey.publicId}`, false, {
                            fileName: "[project]/src/components/landing/marketplace/marketplace-results.tsx",
                            lineNumber: 243,
                            columnNumber: 15
                        }, this);
                    }
                // -----------------------------------------------------------------
                // Journey Demand
                // -----------------------------------------------------------------
                case 'DEMAND':
                    {
                        const demand = item.demand;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$demands$2f$demand$2d$marketplace$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DemandMarketplaceCard"], {
                            demand: demand,
                            viewHref: getDemandViewHref(demand.publicId),
                            joinHref: getDemandJoinHref?.(demand.publicId),
                            linkToRequesterProfile: linkDemandRequesterToProfile,
                            showTrustBadges: showDemandRequesterTrustBadges
                        }, `demand-${demand.publicId}`, false, {
                            fileName: "[project]/src/components/landing/marketplace/marketplace-results.tsx",
                            lineNumber: 270,
                            columnNumber: 15
                        }, this);
                    }
                // -----------------------------------------------------------------
                // Defensive / exhaustive branch
                // -----------------------------------------------------------------
                //
                // If PublicMarketplaceItem gains another discriminator, TypeScript
                // will report an error here because `item.type` will no longer be
                // narrowed to `never`.
                //
                // This prevents a newly introduced marketplace feature from being
                // silently omitted from the public marketplace.
                // -----------------------------------------------------------------
                default:
                    return assertNever(item);
            }
        })
    }, void 0, false, {
        fileName: "[project]/src/components/landing/marketplace/marketplace-results.tsx",
        lineNumber: 209,
        columnNumber: 5
    }, this);
}
_c = MarketplaceResults;
var _c;
__turbopack_context__.k.register(_c, "MarketplaceResults");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/landing/marketplace/marketplace-section.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Marketplace Section
// -----------------------------------------------------------------------------
//
// Top-level presentation section for the public Journey Marketplace.
//
// The marketplace is a composition boundary over two independent feature
// domains:
//
// - Journey
// - Journey Demand
//
// MarketplaceSection owns only the visual composition of the marketplace.
//
// The marketplace data lifecycle remains owned by the parent/application
// layer.
//
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "MarketplaceSection",
    ()=>MarketplaceSection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$marketplace$2f$marketplace$2d$empty$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/marketplace/marketplace-empty-state.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$marketplace$2f$marketplace$2d$error$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/marketplace/marketplace-error-state.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$marketplace$2f$marketplace$2d$filters$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/marketplace/marketplace-filters.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$marketplace$2f$marketplace$2d$header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/marketplace/marketplace-header.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$marketplace$2f$marketplace$2d$loading$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/marketplace/marketplace-loading-state.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$marketplace$2f$marketplace$2d$results$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/marketplace/marketplace-results.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$marketplace$2f$marketplace$2d$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/marketplace/marketplace-tabs.tsx [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
// -----------------------------------------------------------------------------
// Styling
// -----------------------------------------------------------------------------
const SECTION_CLASS_NAME = [
    'w-full',
    'min-w-0',
    'border-t border-[var(--border)]'
].join(' ');
const CONTAINER_CLASS_NAME = [
    'mx-auto',
    'flex',
    'w-full',
    'max-w-7xl',
    'min-w-0',
    'flex-col',
    'px-1',
    'py-5',
    'sm:px-1.5',
    'sm:py-6',
    'md:px-2',
    'md:py-7',
    'lg:px-3',
    'lg:py-8'
].join(' ');
function MarketplaceSection({ items, query, isLoading = false, isError = false, onRetry, onTypeChange, onFromChange, onToChange, onDateChange, onFilterChange, getJourneyViewHref, getJourneyBookHref, getDemandViewHref, getDemandJoinHref, linkJourneyProviderToProfile = true, showJourneyProviderTrustBadges = true, linkDemandRequesterToProfile = true, showDemandRequesterTrustBadges = true, className }) {
    // ---------------------------------------------------------------------------
    // Presentation state
    // ---------------------------------------------------------------------------
    //
    // Existing inventory always takes precedence over transitional loading and
    // error states. This preserves the browse-first marketplace experience when
    // the parent changes filters or refreshes one of the marketplace sources.
    // ---------------------------------------------------------------------------
    /**
   * Show the loading state only when there is no inventory to preserve.
   */ const showInitialLoading = isLoading && items.length === 0;
    /**
   * Show the error state only when there is no inventory to preserve and the
   * marketplace is not currently displaying its initial loading state.
   */ const showInitialError = isError && items.length === 0 && !showInitialLoading;
    /**
   * Show the empty state only after loading and error states have completed.
   */ const showEmptyState = !isLoading && !isError && items.length === 0;
    /**
   * Existing inventory remains visible during loading and error transitions.
   */ const showResults = items.length > 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        id: "marketplace",
        "aria-labelledby": "marketplace-heading",
        className: [
            SECTION_CLASS_NAME,
            className
        ].filter(Boolean).join(' '),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: CONTAINER_CLASS_NAME,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$marketplace$2f$marketplace$2d$header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MarketplaceHeader"], {
                    type: query.type
                }, void 0, false, {
                    fileName: "[project]/src/components/landing/marketplace/marketplace-section.tsx",
                    lineNumber: 270,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-4 min-w-0 sm:mt-5",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$marketplace$2f$marketplace$2d$filters$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MarketplaceFilters"], {
                        query: query,
                        onFromChange: onFromChange,
                        onToChange: onToChange,
                        onDateChange: onDateChange,
                        onFilterChange: onFilterChange
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/marketplace/marketplace-section.tsx",
                        lineNumber: 276,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/landing/marketplace/marketplace-section.tsx",
                    lineNumber: 275,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-3 flex min-w-0 items-center sm:mt-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$marketplace$2f$marketplace$2d$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MarketplaceTabs"], {
                        value: query.type,
                        onChange: onTypeChange
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/marketplace/marketplace-section.tsx",
                        lineNumber: 289,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/landing/marketplace/marketplace-section.tsx",
                    lineNumber: 288,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-4 flex min-w-0 flex-col sm:mt-5",
                    children: [
                        !showInitialLoading && !showInitialError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mb-2 text-xs leading-5 text-[var(--foreground-muted)] sm:mb-3 sm:text-sm sm:leading-6",
                            children: items.length > 0 ? 'Showing what’s available' : 'No marketplace inventory available yet'
                        }, void 0, false, {
                            fileName: "[project]/src/components/landing/marketplace/marketplace-section.tsx",
                            lineNumber: 303,
                            columnNumber: 13
                        }, this),
                        showInitialLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$marketplace$2f$marketplace$2d$loading$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MarketplaceLoadingState"], {}, void 0, false, {
                            fileName: "[project]/src/components/landing/marketplace/marketplace-section.tsx",
                            lineNumber: 313,
                            columnNumber: 34
                        }, this),
                        showInitialError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$marketplace$2f$marketplace$2d$error$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MarketplaceErrorState"], {
                            onRetry: onRetry
                        }, void 0, false, {
                            fileName: "[project]/src/components/landing/marketplace/marketplace-section.tsx",
                            lineNumber: 319,
                            columnNumber: 13
                        }, this),
                        showEmptyState && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$marketplace$2f$marketplace$2d$empty$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MarketplaceEmptyState"], {}, void 0, false, {
                            fileName: "[project]/src/components/landing/marketplace/marketplace-section.tsx",
                            lineNumber: 325,
                            columnNumber: 30
                        }, this),
                        showResults && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$marketplace$2f$marketplace$2d$results$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MarketplaceResults"], {
                            items: items,
                            getJourneyViewHref: getJourneyViewHref,
                            getJourneyBookHref: getJourneyBookHref,
                            getDemandViewHref: getDemandViewHref,
                            getDemandJoinHref: getDemandJoinHref,
                            linkJourneyProviderToProfile: linkJourneyProviderToProfile,
                            showJourneyProviderTrustBadges: showJourneyProviderTrustBadges,
                            linkDemandRequesterToProfile: linkDemandRequesterToProfile,
                            showDemandRequesterTrustBadges: showDemandRequesterTrustBadges
                        }, void 0, false, {
                            fileName: "[project]/src/components/landing/marketplace/marketplace-section.tsx",
                            lineNumber: 331,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/landing/marketplace/marketplace-section.tsx",
                    lineNumber: 298,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/landing/marketplace/marketplace-section.tsx",
            lineNumber: 266,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/landing/marketplace/marketplace-section.tsx",
        lineNumber: 256,
        columnNumber: 5
    }, this);
}
_c = MarketplaceSection;
var _c;
__turbopack_context__.k.register(_c, "MarketplaceSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/landing/marketplace/marketplace-tabs.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Public Marketplace Tabs
// -----------------------------------------------------------------------------
//
// Navigation control for the public marketplace.
//
// The marketplace contains three presentation scopes:
//
//     ALL
//         Published Journeys and published Journey Demands.
//
//     JOURNEY
//         Published travel supply.
//
//     DEMAND
//         Published travel demand.
//
// This component only presents and selects the marketplace scope.
//
// It does not:
//
// - fetch marketplace data;
// - perform filtering;
// - perform sorting;
// - manipulate URL state;
// - determine which items exist;
// - contain Journey business rules;
// - contain Journey Demand business rules.
//
// The parent/application boundary owns the actual marketplace query state.
//
// -----------------------------------------------------------------------------
// CONTROLLED INTERACTION
// -----------------------------------------------------------------------------
//
//     MarketplaceTabs
//          │
//          │ onChange("JOURNEY")
//          ↓
//     MarketplaceSection / marketplace state owner
//          │
//          ↓
//     PublicMarketplaceQuery.type
//
// The component is intentionally controlled.
//
// -----------------------------------------------------------------------------
// VISUAL BEHAVIOR
// -----------------------------------------------------------------------------
//
// The selected marketplace stream is immediately recognizable.
//
// Active:
//
//     ┌────────────────┐
//     │ ● Journeys     │
//     └────────────────┘
//
// Inactive:
//
//     ┌─────────────┐
//     │  Journeys   │
//     └─────────────┘
//
// The active tab uses the sisiMove brand treatment.
// Inactive tabs remain quiet until hovered.
//
// -----------------------------------------------------------------------------
// RESPONSIVE BEHAVIOR
// -----------------------------------------------------------------------------
//
// MarketplaceTabs is mobile-first.
//
// The tabs:
//
// - remain compact;
// - wrap when necessary;
// - never create horizontal page overflow;
// - remain comfortably touchable;
// - do not introduce horizontal scrolling.
//
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "MarketplaceTabs",
    ()=>MarketplaceTabs
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/foundation/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/utils/cn.ts [app-client] (ecmascript)");
;
;
// =============================================================================
// Tab Definition
// =============================================================================
//
// Labels describe marketplace discovery scopes rather than domain lifecycle
// states.
//
// The values intentionally use the actual PublicMarketplaceType values.
// -----------------------------------------------------------------------------
const MARKETPLACE_TABS = [
    {
        value: 'ALL',
        label: 'All'
    },
    {
        value: 'JOURNEY',
        label: 'Journeys'
    },
    {
        value: 'DEMAND',
        label: 'Demand'
    }
];
function MarketplaceTabs({ value, onChange, className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        "aria-label": "Marketplace scope",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex min-w-0 flex-wrap items-center', 'gap-1', className),
        children: MARKETPLACE_TABS.map((tab)=>{
            const isActive = value === tab.value;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                "aria-pressed": isActive,
                onClick: ()=>onChange(tab.value),
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(// -----------------------------------------------------------------
                // Base control
                // -----------------------------------------------------------------
                'inline-flex min-h-9 shrink-0', 'items-center justify-center gap-1.5', 'rounded-full', 'border', 'px-3 py-1.5', 'text-sm font-medium', 'leading-5', // -----------------------------------------------------------------
                // Interaction
                // -----------------------------------------------------------------
                'transition-all duration-150', 'focus-visible:outline-none', 'focus-visible:ring-2', 'focus-visible:ring-[var(--brand)]', 'focus-visible:ring-offset-2', 'focus-visible:ring-offset-[var(--background)]', // -----------------------------------------------------------------
                // Active / inactive state
                // -----------------------------------------------------------------
                isActive ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('border-[var(--brand)]', 'bg-[var(--brand)]', 'text-[var(--brand-foreground)]', 'shadow-[var(--shadow-sm)]') : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('border-transparent', 'bg-transparent', 'text-[var(--foreground-secondary)]', 'hover:border-[var(--border)]', 'hover:bg-[var(--background-subtle)]', 'hover:text-[var(--foreground)]')),
                children: [
                    isActive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        "aria-hidden": "true",
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$utils$2f$cn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('h-1.5 w-1.5 shrink-0', 'rounded-full', 'bg-[var(--brand-foreground)]')
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/marketplace/marketplace-tabs.tsx",
                        lineNumber: 217,
                        columnNumber: 15
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: tab.label
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/marketplace/marketplace-tabs.tsx",
                        lineNumber: 227,
                        columnNumber: 13
                    }, this)
                ]
            }, tab.value, true, {
                fileName: "[project]/src/components/landing/marketplace/marketplace-tabs.tsx",
                lineNumber: 166,
                columnNumber: 11
            }, this);
        })
    }, void 0, false, {
        fileName: "[project]/src/components/landing/marketplace/marketplace-tabs.tsx",
        lineNumber: 154,
        columnNumber: 5
    }, this);
}
_c = MarketplaceTabs;
var _c;
__turbopack_context__.k.register(_c, "MarketplaceTabs");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/landing/marketplace/public-marketplace-content.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PublicMarketplaceContent",
    ()=>PublicMarketplaceContent,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$landing$2d$page$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/landing-page.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$public$2d$marketplace$2f$hooks$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/public-marketplace/hooks/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$public$2d$marketplace$2f$hooks$2f$use$2d$public$2d$marketplace$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/public-marketplace/hooks/use-public-marketplace.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
// -----------------------------------------------------------------------------
// sisiMove — Public Marketplace Content
// -----------------------------------------------------------------------------
//
// Client/application boundary for the public SisiMove marketplace.
//
// The Public Marketplace is composed from the independent public Journey and
// Journey Demand feature domains through usePublicMarketplace().
//
// This component owns:
//
// - marketplace query state;
// - marketplace query interaction;
// - consumption of the Public Marketplace hook;
// - translation of marketplace state into landing presentation props;
// - public route construction for marketplace actions.
//
// It does NOT:
//
// - call Journey APIs directly;
// - call Journey Demand APIs directly;
// - call fetch directly;
// - implement marketplace composition;
// - implement marketplace filtering or sorting;
// - fabricate pagination;
// - create marketplace server-state semantics;
// - render Journey or Demand cards.
//
// -----------------------------------------------------------------------------
// ARCHITECTURE
// -----------------------------------------------------------------------------
//
//   Public Route
//       │
//       ▼
//   PublicMarketplaceContent
//       │
//       │ usePublicMarketplace(query)
//       ▼
//   Public Marketplace Hook
//       │
//       ├── usePublicJourneys()
//       │
//       └── useJourneyDemands()
//       │
//       ▼
//   PublicMarketplaceItem[]
//       │
//       ▼
//   LandingPage
//       │
//       ▼
//   MarketplaceSection
//       │
//       ├── MarketplaceHeader
//       ├── MarketplaceFilters
//       ├── MarketplaceTabs
//       └── MarketplaceResults
//
// PublicMarketplaceContent is therefore the client/application orchestration
// boundary between the marketplace read model and the landing presentation.
//
// -----------------------------------------------------------------------------
// IMPORTANT — CURRENT MARKETPLACE CONTRACT
// -----------------------------------------------------------------------------
//
// The current Public Marketplace hook intentionally exposes:
//
//   items
//   isLoading
//   error
//
// It does NOT expose a unified marketplace pagination envelope.
//
// This component therefore does not invent:
//
//   limit
//   nextCursor
//   hasMore
//   page
//   refetch
//
// Unified marketplace pagination belongs to a future canonical marketplace
// read boundary when the independent Journey and Journey Demand pagination
// contracts can be composed truthfully.
//
// -----------------------------------------------------------------------------
// BROWSE-FIRST BEHAVIOR
// -----------------------------------------------------------------------------
//
// The initial query deliberately contains no route or date restrictions:
//
//   type: ALL
//   from: null
//   to: null
//   date: null
//
// This means the public landing page initially asks:
//
//     "What is available?"
//
// rather than:
//
//     "What are you searching for?"
//
// Filters subsequently refine the marketplace snapshot.
// -----------------------------------------------------------------------------
'use client';
;
;
;
// =============================================================================
// Initial Query
// =============================================================================
/**
 * Default public marketplace query.
 *
 * The public marketplace starts unfiltered so visitors can immediately browse
 * the currently available Journey and Journey Demand inventory.
 *
 * Query controls subsequently refine this initial marketplace snapshot.
 */ const INITIAL_MARKETPLACE_QUERY = {
    type: 'ALL',
    from: null,
    to: null,
    date: null,
    filter: null,
    sort: null
};
function PublicMarketplaceContent() {
    _s();
    // ---------------------------------------------------------------------------
    // Marketplace query state
    // ---------------------------------------------------------------------------
    //
    // Query state belongs to the client/application boundary rather than inside
    // MarketplaceSection.
    //
    // MarketplaceSection remains a controlled presentation component.
    // ---------------------------------------------------------------------------
    const [query, setQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(INITIAL_MARKETPLACE_QUERY);
    // ---------------------------------------------------------------------------
    // Marketplace read state
    // ---------------------------------------------------------------------------
    //
    // usePublicMarketplace() is the sole marketplace composition point exposed
    // to this component.
    //
    // This boundary does not independently call Journey or Journey Demand hooks.
    // ---------------------------------------------------------------------------
    const { items, isLoading, error } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$public$2d$marketplace$2f$hooks$2f$use$2d$public$2d$marketplace$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePublicMarketplace"])(query);
    // ---------------------------------------------------------------------------
    // Query interaction
    // ---------------------------------------------------------------------------
    //
    // Each handler updates only its corresponding controlled query property.
    //
    // The existing query object is preserved so future query properties can be
    // added without changing every handler.
    // ---------------------------------------------------------------------------
    const handleTypeChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PublicMarketplaceContent.useCallback[handleTypeChange]": (type)=>{
            setQuery({
                "PublicMarketplaceContent.useCallback[handleTypeChange]": (current)=>({
                        ...current,
                        type
                    })
            }["PublicMarketplaceContent.useCallback[handleTypeChange]"]);
        }
    }["PublicMarketplaceContent.useCallback[handleTypeChange]"], []);
    const handleFromChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PublicMarketplaceContent.useCallback[handleFromChange]": (from)=>{
            setQuery({
                "PublicMarketplaceContent.useCallback[handleFromChange]": (current)=>({
                        ...current,
                        from
                    })
            }["PublicMarketplaceContent.useCallback[handleFromChange]"]);
        }
    }["PublicMarketplaceContent.useCallback[handleFromChange]"], []);
    const handleToChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PublicMarketplaceContent.useCallback[handleToChange]": (to)=>{
            setQuery({
                "PublicMarketplaceContent.useCallback[handleToChange]": (current)=>({
                        ...current,
                        to
                    })
            }["PublicMarketplaceContent.useCallback[handleToChange]"]);
        }
    }["PublicMarketplaceContent.useCallback[handleToChange]"], []);
    const handleDateChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PublicMarketplaceContent.useCallback[handleDateChange]": (date)=>{
            setQuery({
                "PublicMarketplaceContent.useCallback[handleDateChange]": (current)=>({
                        ...current,
                        date
                    })
            }["PublicMarketplaceContent.useCallback[handleDateChange]"]);
        }
    }["PublicMarketplaceContent.useCallback[handleDateChange]"], []);
    const handleFilterChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PublicMarketplaceContent.useCallback[handleFilterChange]": (filter)=>{
            setQuery({
                "PublicMarketplaceContent.useCallback[handleFilterChange]": (current)=>({
                        ...current,
                        filter
                    })
            }["PublicMarketplaceContent.useCallback[handleFilterChange]"]);
        }
    }["PublicMarketplaceContent.useCallback[handleFilterChange]"], []);
    // ---------------------------------------------------------------------------
    // Public Journey routes
    // ---------------------------------------------------------------------------
    //
    // Marketplace presentation components do not know the application's route
    // structure.
    //
    // They receive already-resolved public hrefs from this application boundary.
    //
    // These callbacks are memoized because they are passed through several
    // presentation boundaries and do not need to be recreated on every render.
    // ---------------------------------------------------------------------------
    const getJourneyViewHref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PublicMarketplaceContent.useCallback[getJourneyViewHref]": (publicId)=>`/journeys/${publicId}`
    }["PublicMarketplaceContent.useCallback[getJourneyViewHref]"], []);
    const getJourneyBookHref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PublicMarketplaceContent.useCallback[getJourneyBookHref]": (publicId)=>`/journeys/${publicId}?action=book`
    }["PublicMarketplaceContent.useCallback[getJourneyBookHref]"], []);
    // ---------------------------------------------------------------------------
    // Public Journey Demand routes
    // ---------------------------------------------------------------------------
    const getDemandViewHref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PublicMarketplaceContent.useCallback[getDemandViewHref]": (publicId)=>`/demands/${publicId}`
    }["PublicMarketplaceContent.useCallback[getDemandViewHref]"], []);
    const getDemandJoinHref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PublicMarketplaceContent.useCallback[getDemandJoinHref]": (publicId)=>`/demands/${publicId}?action=join`
    }["PublicMarketplaceContent.useCallback[getDemandJoinHref]"], []);
    // ---------------------------------------------------------------------------
    // Presentation boundary
    // ---------------------------------------------------------------------------
    //
    // The marketplace read result is passed through without adding another
    // client-side representation or pagination model.
    //
    // LandingPage receives the controlled marketplace contract and remains
    // responsible for rendering the marketplace presentation tree.
    // ---------------------------------------------------------------------------
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$landing$2d$page$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LandingPage"], {
        marketplace: {
            items,
            query,
            isLoading,
            isError: error !== null,
            onTypeChange: handleTypeChange,
            onFromChange: handleFromChange,
            onToChange: handleToChange,
            onDateChange: handleDateChange,
            onFilterChange: handleFilterChange,
            getJourneyViewHref,
            getJourneyBookHref,
            getDemandViewHref,
            getDemandJoinHref,
            linkJourneyProviderToProfile: true,
            showJourneyProviderTrustBadges: true,
            linkDemandRequesterToProfile: true,
            showDemandRequesterTrustBadges: true
        }
    }, void 0, false, {
        fileName: "[project]/src/components/landing/marketplace/public-marketplace-content.tsx",
        lineNumber: 334,
        columnNumber: 5
    }, this);
}
_s(PublicMarketplaceContent, "k1G4ARW20JBYEAHYrersMn0gjPo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$public$2d$marketplace$2f$hooks$2f$use$2d$public$2d$marketplace$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePublicMarketplace"]
    ];
});
_c = PublicMarketplaceContent;
const __TURBOPACK__default__export__ = PublicMarketplaceContent;
var _c;
__turbopack_context__.k.register(_c, "PublicMarketplaceContent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/landing/shared/assets/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// -----------------------------------------------------------------------------
// sisiMove — Asset Shared Components
// -----------------------------------------------------------------------------
//
// Public barrel for reusable Asset presentation components.
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$shared$2f$assets$2f$public$2d$asset$2d$image$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/shared/assets/public-asset-image.tsx [app-client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/landing/shared/assets/public-asset-image.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PublicAssetImage",
    ()=>PublicAssetImage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// sisiMove — Public Asset Image
// -----------------------------------------------------------------------------
//
// Reusable presentation component for rendering a public Asset.
//
// This component is intentionally a thin adapter around Next.js `Image`.
//
// It:
//
// - receives an already-resolved PublicAsset model;
// - uses only the Asset's safe public URL;
// - uses the Asset's public alt text when available;
// - allows the consuming surface to provide an explicit alt override;
// - does not construct URLs from storage metadata;
// - does not fetch Asset data;
// - does not expose internal Asset information;
// - does not determine how an Asset should be styled;
// - can be reused by Journey cards, Demand cards, Traveller surfaces,
//   marketplace sections, and public detail pages.
//
// -----------------------------------------------------------------------------
// Architecture boundary
// -----------------------------------------------------------------------------
//
// The Assets public read boundary is responsible for resolving a safe public
// Asset representation.
//
// PublicAssetImage does not know about:
//
// - storage providers;
// - object keys;
// - bucket names;
// - internal storage IDs;
// - signed/private URLs;
// - upload state;
// - Asset persistence.
//
// It receives:
//
//     PublicAsset.url
//
// and passes that public URL directly to Next.js Image.
//
// Storage concerns therefore remain outside the presentation layer.
//
// -----------------------------------------------------------------------------
// Presentation responsibility
// -----------------------------------------------------------------------------
//
// This component intentionally does NOT impose:
//
// - width;
// - height;
// - aspect ratio;
// - object-fit;
// - border radius;
// - shadows;
// - cropping;
// - marketplace-specific layout.
//
// Those decisions belong to the consuming component.
//
// Example:
//
//     JourneyCardVehicle
//         └── PublicAssetImage
//
// JourneyCardVehicle can decide:
//
//     aspect-ratio
//     object-cover
//     rounded corners
//     vehicle image dimensions
//
// while PublicAssetImage remains reusable elsewhere.
//
// -----------------------------------------------------------------------------
// Accessibility
// -----------------------------------------------------------------------------
//
// Alt text resolution follows this order:
//
//     explicit `alt`
//         ↓
//     asset.alt
//         ↓
//     fallbackAlt
//
// An explicit non-empty `alt` therefore allows the consuming surface to give
// the image context-specific alternative text without modifying the public
// Asset model.
//
// -----------------------------------------------------------------------------
// Invalid Asset URLs
// -----------------------------------------------------------------------------
//
// A public Asset object may exist while its URL is empty or whitespace-only.
//
// This component must never pass an empty string to Next.js Image:
//
//     <Image src="" />
//
// An empty `src` can cause the browser to request the current document again.
//
// Therefore an empty or whitespace-only public Asset URL is treated as an
// unavailable image and the image element is not rendered.
//
// This is a presentation-level defensive boundary. The component does not
// attempt to repair, infer, or construct the missing URL.
//
// -----------------------------------------------------------------------------
// Next.js Image boundary
// -----------------------------------------------------------------------------
//
// All normal Next.js ImageProps remain available to the consumer.
//
// This component only owns:
//
//     src
//     alt
//
// The consumer therefore remains responsible for choosing the appropriate
// rendering mode, dimensions, `fill`, `sizes`, loading priority, and other
// image behavior required by its layout.
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
;
;
// =============================================================================
// Helpers
// =============================================================================
/**
 * Resolve the final alternative text for a public Asset.
 *
 * Precedence:
 *
 *     explicit alt → asset alt → fallback
 *
 * Empty or whitespace-only values are treated as unavailable.
 */ function resolveAltText(asset, alt, fallbackAlt) {
    const explicitAlt = alt?.trim();
    if (explicitAlt) {
        return explicitAlt;
    }
    const assetAlt = asset.alt?.trim();
    if (assetAlt) {
        return assetAlt;
    }
    const resolvedFallback = fallbackAlt.trim();
    return resolvedFallback || 'Public asset';
}
/**
 * Resolve a renderable public Asset URL.
 *
 * Empty and whitespace-only URLs are treated as unavailable.
 *
 * The helper deliberately does not attempt to:
 *
 * - construct a URL;
 * - resolve an Asset ID;
 * - access storage metadata;
 * - infer a fallback URL.
 */ function resolveAssetUrl(asset) {
    const url = asset.url?.trim();
    return url || null;
}
function PublicAssetImage({ asset, alt, fallbackAlt = 'Public asset', ...imageProps }) {
    const resolvedUrl = resolveAssetUrl(asset);
    /*
   * An Asset record can exist without containing a usable public URL.
   *
   * Do not pass an empty string to Next.js Image. Apart from being invalid
   * image input, an empty src can cause the browser to request the current
   * document again.
   *
   * Returning null also avoids inventing presentation data that does not
   * exist in the public Asset model.
   */ if (!resolvedUrl) {
        return null;
    }
    const resolvedAlt = resolveAltText(asset, alt, fallbackAlt);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        ...imageProps,
        src: resolvedUrl,
        alt: resolvedAlt
    }, void 0, false, {
        fileName: "[project]/src/components/landing/shared/assets/public-asset-image.tsx",
        lineNumber: 273,
        columnNumber: 5
    }, this);
}
_c = PublicAssetImage;
var _c;
__turbopack_context__.k.register(_c, "PublicAssetImage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/landing/shared/traveller/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// -----------------------------------------------------------------------------
// sisiMove — Traveller Shared Components
// -----------------------------------------------------------------------------
//
// Public barrel for reusable Traveller presentation components.
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$shared$2f$traveller$2f$traveller$2d$summary$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/shared/traveller/traveller-summary.tsx [app-client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/landing/shared/traveller/traveller-summary.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TravellerSummary",
    ()=>TravellerSummary
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// sisiMove — Traveller Summary
// -----------------------------------------------------------------------------
//
// Reusable public presentation component for displaying a compact Traveller
// Profile summary.
//
// This component supports two presentation orientations:
//
//     horizontal:
//
//     [avatar]  @traveller
//
//     vertical:
//
//        [avatar]
//        @traveller
//
// Trust information is deliberately NOT rendered here.
//
// TrustSummary remains responsible for:
//
//     ✓ Verification
//     ★ Rating
//     · Completed journeys
//     · Public trust badges
//
// This separation allows TravellerSummary to remain reusable across:
//
//     - Journey marketplace cards;
//     - Journey Demand marketplace cards;
//     - public Traveller pages;
//     - other public identity surfaces.
//
// -----------------------------------------------------------------------------
// Architecture boundary
// -----------------------------------------------------------------------------
//
// This component is presentation-only.
//
// It:
//
// - receives an already-resolved PublicTraveller model;
// - displays public Traveller identity information;
// - optionally links to the public Traveller page;
// - supports horizontal or vertical identity presentation;
// - does not fetch Traveller data;
// - does not fetch Trust data;
// - does not resolve identity references;
// - does not access private identity information;
// - does not calculate trust;
// - does not contain marketplace business logic.
//
// The Traveller Profile / public read boundary is responsible for providing
// the public Traveller representation.
//
// TravellerSummary only presents that representation.
//
// -----------------------------------------------------------------------------
// Marketplace presentation
// -----------------------------------------------------------------------------
//
// The default marketplace identity block remains compact:
//
//     [avatar]  @traveller
//
// A vertical presentation is also available for marketplace columns where the
// identity should be visually prioritized:
//
//        [avatar]
//        @traveller
//
// A Traveller bio is intentionally omitted.
//
// Marketplace cards prioritize:
//
//     WHO → WHERE → WHAT → PRICE → ACTION
//
// rather than consuming scarce space with profile prose.
//
// -----------------------------------------------------------------------------
// Orientation
// -----------------------------------------------------------------------------
//
// `orientation` controls only the internal presentation of the Traveller
// identity:
//
//     horizontal
//         [avatar] @handle
//
//     vertical
//         [avatar]
//         @handle
//
// The default is `horizontal` to preserve the existing presentation for all
// existing consumers.
//
// A parent component may request `vertical` when the available column is
// better suited to a stacked identity presentation.
//
// This component still owns all Traveller identity rendering in either mode.
//
// -----------------------------------------------------------------------------
// Responsive behavior
// -----------------------------------------------------------------------------
//
// Marketplace cards remain horizontal even on small screens.
//
// Therefore this component must be able to shrink inside a constrained
// marketplace column.
//
// Important rules:
//
// - root uses `min-w-0`;
// - identity content uses `min-w-0`;
// - avatar remains `shrink-0`;
// - handle is allowed to truncate in horizontal mode;
// - no fixed desktop width is introduced;
// - no horizontal scrolling is introduced.
//
// Vertical mode intentionally centers the identity block while still allowing
// the component itself to shrink within the marketplace column.
//
// -----------------------------------------------------------------------------
// URL policy
// -----------------------------------------------------------------------------
//
// Public Traveller pages use the Traveller handle:
//
//     /travellers/:handle
//
// The handle is normalized and encoded before being inserted into the URL
// path so unusual public handles cannot accidentally create malformed paths.
//
// -----------------------------------------------------------------------------
// CSS token policy
// -----------------------------------------------------------------------------
//
// Use established sisiMove tokens:
//
//     --brand
//     --background
//     --foreground
//     --foreground-muted
//
// Do not introduce generic/nonexistent application tokens such as:
//
//     --ring
//     --primary
//     --primary-foreground
//
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/avatar.tsx [app-client] (ecmascript)");
;
;
;
// =============================================================================
// Helpers
// =============================================================================
/**
 * Normalize a public Traveller handle.
 *
 * Public handles are stored/displayed consistently without multiple leading
 * `@` characters.
 *
 * This helper is intentionally presentation-oriented and does not mutate the
 * underlying PublicTraveller model.
 */ function normalizeHandle(handle) {
    return handle.trim().replace(/^@+/, '');
}
/**
 * Format a public Traveller handle for display.
 *
 * Public handles are consistently displayed with exactly one leading `@`.
 */ function formatHandle(handle) {
    const normalizedHandle = normalizeHandle(handle);
    return normalizedHandle.length > 0 ? `@${normalizedHandle}` : '@traveller';
}
/**
 * Derive a compact avatar fallback from the public Traveller handle.
 *
 * The handle is the only identity value required by this presentation
 * component.
 *
 * No private identity information is inspected.
 */ function getTravellerInitials(traveller) {
    const normalizedHandle = normalizeHandle(traveller.handle);
    if (normalizedHandle.length === 0) {
        return '?';
    }
    const words = normalizedHandle.split(/[\s_-]+/).filter(Boolean);
    if (words.length === 0) {
        return '?';
    }
    if (words.length === 1) {
        return words[0].slice(0, 2).toUpperCase();
    }
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
}
/**
 * Build the public Traveller profile destination.
 *
 * The normalized handle is encoded because it is inserted directly into the
 * URL path.
 */ function getTravellerProfileHref(traveller) {
    const normalizedHandle = normalizeHandle(traveller.handle);
    return `/travellers/${encodeURIComponent(normalizedHandle)}`;
}
function TravellerSummary({ traveller, linkToProfile = true, orientation = 'horizontal', className }) {
    const handleLabel = formatHandle(traveller.handle);
    const initials = getTravellerInitials(traveller);
    const profileHref = getTravellerProfileHref(traveller);
    const avatar = traveller.avatar;
    // ---------------------------------------------------------------------------
    // Avatar
    // ---------------------------------------------------------------------------
    //
    // The avatar is already part of the public Traveller representation.
    //
    // TravellerSummary does not resolve an Asset separately.
    //
    // Avatar remains a reusable UI primitive while this component supplies the
    // public Traveller-specific information.
    // ---------------------------------------------------------------------------
    const avatarContent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Avatar"], {
        src: avatar?.url ?? undefined,
        alt: avatar?.alt ?? `${handleLabel} avatar`,
        fallback: initials,
        size: "md"
    }, void 0, false, {
        fileName: "[project]/src/components/landing/shared/traveller/traveller-summary.tsx",
        lineNumber: 344,
        columnNumber: 5
    }, this);
    // ---------------------------------------------------------------------------
    // Orientation
    // ---------------------------------------------------------------------------
    //
    // Horizontal mode:
    //
    //     [avatar] @handle
    //
    // Vertical mode:
    //
    //        [avatar]
    //        @handle
    //
    // The orientation affects only the layout of the identity summary. It does
    // not alter the underlying Traveller model or navigation behavior.
    // ---------------------------------------------------------------------------
    const isVertical = orientation === 'vertical';
    // ---------------------------------------------------------------------------
    // Root
    // ---------------------------------------------------------------------------
    //
    // `min-w-0` is important because TravellerSummary is placed inside a
    // shrinking marketplace column.
    //
    // Without it, long handles can force the marketplace card wider than its
    // available viewport.
    //
    // Vertical mode centers the identity block so the visual order is clearly:
    //
    //        avatar
    //        handle
    //
    // Horizontal mode retains the existing compact marketplace presentation.
    // ---------------------------------------------------------------------------
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: [
            'flex',
            'min-w-0',
            isVertical ? [
                'flex-col',
                'items-center',
                'justify-center',
                'gap-1.5'
            ].join(' ') : [
                'flex-row',
                'items-center',
                'gap-2',
                'sm:gap-2.5'
            ].join(' '),
            className
        ].filter(Boolean).join(' '),
        children: [
            linkToProfile ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                href: profileHref,
                "aria-label": `View ${handleLabel} traveller profile`,
                className: [
                    'shrink-0',
                    'rounded-full',
                    'outline-offset-2',
                    'transition-opacity',
                    'hover:opacity-85',
                    'focus-visible:outline',
                    'focus-visible:outline-2',
                    'focus-visible:outline-[var(--brand)]'
                ].join(' '),
                children: avatarContent
            }, void 0, false, {
                fileName: "[project]/src/components/landing/shared/traveller/traveller-summary.tsx",
                lineNumber: 423,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "shrink-0",
                children: avatarContent
            }, void 0, false, {
                fileName: "[project]/src/components/landing/shared/traveller/traveller-summary.tsx",
                lineNumber: 443,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: [
                    'min-w-0',
                    isVertical ? [
                        'max-w-full',
                        'text-center'
                    ].join(' ') : [
                        'flex-1'
                    ].join(' ')
                ].join(' '),
                children: linkToProfile ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: profileHref,
                    "aria-label": `View ${handleLabel} traveller profile`,
                    className: [
                        'block',
                        'min-w-0',
                        'max-w-full',
                        // Long handles remain safely constrained in both orientations.
                        'truncate',
                        'rounded-sm',
                        'text-xs',
                        'font-semibold',
                        'leading-5',
                        'text-[var(--foreground)]',
                        'outline-offset-2',
                        'hover:underline',
                        'focus-visible:outline',
                        'focus-visible:outline-2',
                        'focus-visible:outline-[var(--brand)]',
                        'sm:text-sm'
                    ].join(' '),
                    children: handleLabel
                }, void 0, false, {
                    fileName: "[project]/src/components/landing/shared/traveller/traveller-summary.tsx",
                    lineNumber: 467,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: [
                        'block',
                        'min-w-0',
                        'max-w-full',
                        'truncate',
                        'text-xs',
                        'font-semibold',
                        'leading-5',
                        'text-[var(--foreground)]',
                        'sm:text-sm'
                    ].join(' '),
                    children: handleLabel
                }, void 0, false, {
                    fileName: "[project]/src/components/landing/shared/traveller/traveller-summary.tsx",
                    lineNumber: 499,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/landing/shared/traveller/traveller-summary.tsx",
                lineNumber: 452,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/landing/shared/traveller/traveller-summary.tsx",
        lineNumber: 395,
        columnNumber: 5
    }, this);
}
_c = TravellerSummary;
var _c;
__turbopack_context__.k.register(_c, "TravellerSummary");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/landing/shared/trust/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// -----------------------------------------------------------------------------
// sisiMove — Trust Shared Components
// -----------------------------------------------------------------------------
//
// Public barrel for reusable Trust presentation components.
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$shared$2f$trust$2f$trust$2d$summary$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/shared/trust/trust-summary.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$shared$2f$trust$2f$verification$2d$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/shared/trust/verification-badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$shared$2f$trust$2f$rating$2d$summary$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/shared/trust/rating-summary.tsx [app-client] (ecmascript)");
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/landing/shared/trust/rating-summary.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Rating Summary
// -----------------------------------------------------------------------------
//
// Reusable presentation component for displaying a Traveller's public rating.
//
// This component is intentionally compact and suitable for dense public
// surfaces such as:
//
//     Journey marketplace cards
//     Journey Demand marketplace cards
//     Traveller summaries
//     Public Traveller pages
//
// Visual form:
//
//     ★ 4.9  (128)
//
// The component:
//
// - receives rating values from the public Trust read model;
// - does not fetch Trust data;
// - does not render individual reviews;
// - does not expose private rating records;
// - does not calculate the rating average;
// - does not infer completed journeys;
// - can be reused across independent public presentation surfaces.
//
// -----------------------------------------------------------------------------
// PRESENTATION BOUNDARY
// -----------------------------------------------------------------------------
//
// `ratingAverage` and `ratingCount` are already public read-model values.
//
// This component only:
//
//   1. safely normalizes invalid runtime values;
//   2. formats the values for compact presentation;
//   3. exposes an accessible text alternative.
//
// It does NOT:
//
// - determine whether a Traveller is trusted;
// - determine verification status;
// - calculate the rating average;
// - load reviews;
// - infer completed journeys from rating count.
//
// IMPORTANT:
//
//     ratingCount !== completedJourneyCount
//
// A completed journey/trip count must come from its own public read-model
// property and should be rendered by the appropriate Traveller/Trust
// presentation component.
//
// -----------------------------------------------------------------------------
// MARKETPLACE VISUAL LANGUAGE
// -----------------------------------------------------------------------------
//
// The rating remains intentionally compact:
//
//     ★ 4.9  (128)
//
// The star is a visual rating indicator, not an interactive control.
//
// The star therefore uses:
//
//     --warning
//
// Other established SisiMove tokens:
//
//     --foreground
//     --foreground-muted
//
// No generic/nonexistent tokens are introduced:
//
//     --primary
//     --muted
//     --muted-foreground
//     --ring
//
// -----------------------------------------------------------------------------
// RESPONSIVE BEHAVIOR
// -----------------------------------------------------------------------------
//
// Marketplace cards remain horizontal on small screens.
//
// RatingSummary therefore:
//
// - has `min-w-0`;
// - does not introduce a fixed width;
// - keeps the star from shrinking;
// - allows the numeric content to remain compact;
// - does not create horizontal scrolling.
// -----------------------------------------------------------------------------
// =============================================================================
// Props
// =============================================================================
__turbopack_context__.s([
    "RatingSummary",
    ()=>RatingSummary
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
// =============================================================================
// Helpers
// =============================================================================
/**
 * Format the public average rating for compact presentation.
 *
 * Ratings are intentionally displayed to one decimal place so the visual
 * representation remains consistent across Journey, Demand, and Traveller
 * surfaces.
 *
 * This does not clamp the rating to 0–5. Domain validation belongs upstream.
 */ function formatRating(ratingAverage) {
    if (!Number.isFinite(ratingAverage)) {
        return '0.0';
    }
    return ratingAverage.toFixed(1);
}
/**
 * Format the public rating count.
 *
 * Rating counts are integer quantities. Fractional runtime values are reduced
 * to their integer component rather than displayed as misleading decimal
 * counts.
 */ function formatRatingCount(ratingCount) {
    if (!Number.isFinite(ratingCount) || ratingCount < 0) {
        return '0';
    }
    return Math.floor(ratingCount).toLocaleString('en-KE');
}
function RatingSummary({ ratingAverage, ratingCount, showCount = true, className }) {
    const formattedRating = formatRating(ratingAverage);
    const formattedCount = formatRatingCount(ratingCount);
    // ---------------------------------------------------------------------------
    // Accessible description
    // ---------------------------------------------------------------------------
    //
    // The visible star is decorative because the accessible meaning is supplied
    // by the parent element's aria-label.
    // ---------------------------------------------------------------------------
    const accessibleLabel = [
        `${formattedRating} out of 5 stars`,
        showCount ? `${formattedCount} ratings` : null
    ].filter(Boolean).join(', ');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        "aria-label": accessibleLabel,
        className: [
            'inline-flex',
            'min-w-0',
            'items-center',
            'gap-1',
            'text-sm',
            'leading-5',
            className
        ].filter(Boolean).join(' '),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                "aria-hidden": "true",
                className: [
                    'shrink-0',
                    'text-[var(--warning)]'
                ].join(' '),
                children: "★"
            }, void 0, false, {
                fileName: "[project]/src/components/landing/shared/trust/rating-summary.tsx",
                lineNumber: 248,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: [
                    'shrink-0',
                    'font-semibold',
                    'text-[var(--foreground)]'
                ].join(' '),
                children: formattedRating
            }, void 0, false, {
                fileName: "[project]/src/components/landing/shared/trust/rating-summary.tsx",
                lineNumber: 262,
                columnNumber: 7
            }, this),
            showCount ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: [
                    'min-w-0',
                    'truncate',
                    'text-[var(--foreground-muted)]'
                ].join(' '),
                children: [
                    "(",
                    formattedCount,
                    ")"
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/landing/shared/trust/rating-summary.tsx",
                lineNumber: 277,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/landing/shared/trust/rating-summary.tsx",
        lineNumber: 229,
        columnNumber: 5
    }, this);
}
_c = RatingSummary;
var _c;
__turbopack_context__.k.register(_c, "RatingSummary");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/landing/shared/trust/trust-summary.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Trust Summary
// -----------------------------------------------------------------------------
//
// Composite public trust presentation component.
//
// This component presents already-resolved public trust information for a
// Traveller in a compact, reusable form.
//
// Primary trust signals:
//
//   ✓ Verification
//   ★ Rating
//   · Completed journeys
//
// Optional secondary signal:
//
//   Awarded public trust badges
//
// This component is intentionally suitable for dense public surfaces:
//
//   - Journey Marketplace Card
//   - Journey Demand Marketplace Card
//   - Traveller public profile
//
// It receives the already-resolved PublicTravellerTrust model and performs no
// API requests, reference resolution, or trust/business-rule evaluation.
//
// -----------------------------------------------------------------------------
// ARCHITECTURE BOUNDARY
// -----------------------------------------------------------------------------
//
// TrustSummary is presentation-only.
//
// The Trust domain owns the underlying trust information:
//
//   - verification level;
//   - rating average;
//   - rating count;
//   - completed journeys;
//   - awarded public badges.
//
// This component does not:
//
// - fetch Trust data;
// - calculate ratings;
// - determine verification eligibility;
// - infer trust levels;
// - calculate completed journeys;
// - decide which badges a Traveller deserves;
// - expose private trust records.
//
// It simply presents the public values supplied by the read model.
//
// -----------------------------------------------------------------------------
// MARKETPLACE PRESENTATION
// -----------------------------------------------------------------------------
//
// The compact representation is:
//
//   ✓ Verified
//   ★ 4.9 (128)
//   · 2 completed journeys
//
// Public badges, when enabled, appear beneath the primary trust signals:
//
//   [Highly verified] [Reliable traveller]
//
// The trust signals remain grouped vertically so that TrustSummary works
// naturally beneath a vertically-oriented TravellerSummary:
//
//        [avatar]
//        @traveller
//        ✓ Verified
//        ★ 4.9 (128)
//        · 2 completed journeys
//
// -----------------------------------------------------------------------------
// RESPONSIVE BEHAVIOR
// -----------------------------------------------------------------------------
//
// Marketplace cards remain horizontal on small screens.
//
// TrustSummary therefore:
//
// - uses `min-w-0`;
// - allows primary trust signals to wrap;
// - allows badge groups to wrap;
// - prevents individual badges from forcing the column wider;
// - introduces no fixed width;
// - introduces no horizontal scrolling.
//
// -----------------------------------------------------------------------------
// CSS TOKEN POLICY
// -----------------------------------------------------------------------------
//
// Use SisiMove's established design tokens:
//
//   --foreground
//   --foreground-secondary
//   --foreground-muted
//   --border
//   --background-muted
//
// VerificationBadge and RatingSummary own their respective visual details.
//
// TrustSummary only controls composition.
//
// No generic/nonexistent tokens are introduced:
//
//   --primary
//   --muted
//   --muted-foreground
//   --ring
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "TrustSummary",
    ()=>TrustSummary
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$shared$2f$trust$2f$rating$2d$summary$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/shared/trust/rating-summary.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$shared$2f$trust$2f$verification$2d$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/shared/trust/verification-badge.tsx [app-client] (ecmascript)");
;
;
;
// =============================================================================
// Helpers
// =============================================================================
/**
 * Format completed journey statistics for compact public presentation.
 *
 * This value deliberately remains separate from RatingSummary because:
 *
 *     completedJourneys !== ratingCount
 *
 * They represent different public trust signals.
 *
 * Domain validation remains outside this presentation component.
 */ function formatCompletedJourneys(completedJourneys) {
    if (!Number.isFinite(completedJourneys) || completedJourneys < 0) {
        return '0 completed journeys';
    }
    const count = Math.floor(completedJourneys);
    const formattedCount = count.toLocaleString('en-KE');
    return `${formattedCount} completed ${count === 1 ? 'journey' : 'journeys'}`;
}
function TrustSummary({ trust, showBadges = true, className }) {
    const completedJourneys = formatCompletedJourneys(trust.completedJourneys);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: [
            // -------------------------------------------------------------------
            // Root
            // -------------------------------------------------------------------
            //
            // TrustSummary is intentionally a vertical group. This makes it
            // compose naturally below TravellerSummary when the provider card
            // uses vertical Traveller presentation.
            //
            'flex',
            'min-w-0',
            'flex-col',
            'gap-1.5',
            className
        ].filter(Boolean).join(' '),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: [
                    'flex',
                    'min-w-0',
                    'flex-wrap',
                    'items-center',
                    'gap-x-2',
                    'gap-y-1'
                ].join(' '),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$shared$2f$trust$2f$verification$2d$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VerificationBadge"], {
                        verificationLevel: trust.verificationLevel
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/shared/trust/trust-summary.tsx",
                        lineNumber: 256,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$shared$2f$trust$2f$rating$2d$summary$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RatingSummary"], {
                        ratingAverage: trust.ratingAverage,
                        ratingCount: trust.ratingCount
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/shared/trust/trust-summary.tsx",
                        lineNumber: 265,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: [
                            'inline-flex',
                            'min-w-0',
                            'max-w-full',
                            'items-center',
                            'text-xs',
                            'leading-5',
                            'text-[var(--foreground-muted)]'
                        ].join(' '),
                        "aria-label": completedJourneys,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                "aria-hidden": "true",
                                className: "shrink-0",
                                children: "·"
                            }, void 0, false, {
                                fileName: "[project]/src/components/landing/shared/trust/trust-summary.tsx",
                                lineNumber: 290,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "ml-1 truncate",
                                children: completedJourneys
                            }, void 0, false, {
                                fileName: "[project]/src/components/landing/shared/trust/trust-summary.tsx",
                                lineNumber: 297,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/landing/shared/trust/trust-summary.tsx",
                        lineNumber: 277,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/landing/shared/trust/trust-summary.tsx",
                lineNumber: 243,
                columnNumber: 7
            }, this),
            showBadges && trust.badges.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: [
                    'flex',
                    'min-w-0',
                    'max-w-full',
                    'flex-wrap',
                    'gap-1.5'
                ].join(' '),
                "aria-label": "Public trust badges",
                children: trust.badges.map((badge)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        title: badge.description ?? badge.name,
                        className: [
                            'inline-flex',
                            'min-w-0',
                            'max-w-full',
                            'items-center',
                            'rounded-full',
                            'border',
                            'border-[var(--border)]',
                            'bg-[var(--background-muted)]',
                            'px-2',
                            'py-0.5',
                            'text-[11px]',
                            'font-medium',
                            'leading-4',
                            'text-[var(--foreground-secondary)]'
                        ].join(' '),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "truncate",
                            children: badge.name
                        }, void 0, false, {
                            fileName: "[project]/src/components/landing/shared/trust/trust-summary.tsx",
                            lineNumber: 346,
                            columnNumber: 15
                        }, this)
                    }, badge.publicId, false, {
                        fileName: "[project]/src/components/landing/shared/trust/trust-summary.tsx",
                        lineNumber: 319,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/landing/shared/trust/trust-summary.tsx",
                lineNumber: 308,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/landing/shared/trust/trust-summary.tsx",
        lineNumber: 214,
        columnNumber: 5
    }, this);
}
_c = TrustSummary;
var _c;
__turbopack_context__.k.register(_c, "TrustSummary");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/landing/shared/trust/verification-badge.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Verification Badge
// -----------------------------------------------------------------------------
//
// Reusable presentation component for displaying a Traveller's public
// verification level.
//
// This component is intentionally compact because it is used inside dense
// marketplace trust summaries:
//
//     ✓ Verified
//     ✓ Highly verified
//
// It can also be used independently on public Traveller profiles.
//
// The component:
//
// - receives a public verification level;
// - does not fetch Trust data;
// - does not expose verification evidence;
// - does not import backend or Prisma enums;
// - does not determine verification eligibility;
// - does not infer what evidence was used;
// - can be reused by Journey cards, Demand cards, and public profiles.
//
// -----------------------------------------------------------------------------
// ARCHITECTURE BOUNDARY
// -----------------------------------------------------------------------------
//
// `verificationLevel` is already part of the public Trust read model.
//
// This component translates that public value into:
//
//   1. a human-readable public label;
//   2. a compact visual treatment;
//   3. an accessible description.
//
// It does NOT:
//
// - inspect government ID records;
// - inspect phone verification records;
// - determine whether a Traveller should be verified;
// - make API requests;
// - expose private verification evidence.
//
// -----------------------------------------------------------------------------
// VERIFICATION LEVELS
// -----------------------------------------------------------------------------
//
// Public verification levels currently supported:
//
//   NONE
//   BASIC
//   VERIFIED
//   HIGHLY_VERIFIED
//
// Unknown runtime values safely fall back to the public "Not verified"
// presentation.
//
// -----------------------------------------------------------------------------
// MARKETPLACE PRESENTATION
// -----------------------------------------------------------------------------
//
// Preferred compact presentation:
//
//   ✓ Verified
//
// or:
//
//   ✓ Highly verified
//
// When `showLabel={false}`:
//
//   ✓
//
// For NONE, the verification indicator is intentionally omitted:
//
//   Not verified
//
// This prevents the visual checkmark from implying that an unverified
// Traveller has passed verification.
//
// -----------------------------------------------------------------------------
// RESPONSIVE BEHAVIOR
// -----------------------------------------------------------------------------
//
// Marketplace cards remain horizontal on small screens.
//
// The badge therefore:
//
// - remains shrink-safe;
// - remains on one line;
// - wraps as a whole when its parent trust row wraps;
// - does not introduce a fixed width;
// - does not create horizontal scrolling.
//
// -----------------------------------------------------------------------------
// CSS TOKEN POLICY
// -----------------------------------------------------------------------------
//
// Use established sisiMove design tokens:
//
//   --success
//   --brand
//   --brand-soft
//   --background
//   --background-muted
//   --background-subtle
//   --foreground-secondary
//   --foreground-muted
//   --border
//
// Avoid generic/nonexistent application tokens:
//
//   --primary
//   --muted
//   --muted-foreground
//   --ring
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "VerificationBadge",
    ()=>VerificationBadge
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
// =============================================================================
// Helpers
// =============================================================================
/**
 * Convert the public verification level into its public-facing label.
 *
 * This is presentation mapping only.
 *
 * It does not reinterpret or calculate Trust domain semantics.
 */ function getVerificationLabel(verificationLevel) {
    switch(verificationLevel){
        case 'BASIC':
            return 'Basic';
        case 'VERIFIED':
            return 'Verified';
        case 'HIGHLY_VERIFIED':
            return 'Highly verified';
        case 'NONE':
        default:
            return 'Not verified';
    }
}
/**
 * Return the compact visual treatment for the public verification level.
 *
 * Visual strength follows the public verification state:
 *
 * HIGHLY_VERIFIED
 *   → success treatment
 *
 * VERIFIED
 *   → brand treatment
 *
 * BASIC
 *   → neutral treatment
 *
 * NONE
 *   → subdued neutral treatment
 *
 * This function does not determine whether a level is trustworthy. It only
 * maps an already-resolved public state to presentation styles.
 */ function getVerificationStyles(verificationLevel) {
    switch(verificationLevel){
        case 'HIGHLY_VERIFIED':
            return [
                'border-[color-mix(in_srgb,var(--success)_25%,transparent)]',
                'bg-[color-mix(in_srgb,var(--success)_10%,transparent)]',
                'text-[var(--success)]'
            ].join(' ');
        case 'VERIFIED':
            return [
                'border-[color-mix(in_srgb,var(--brand)_25%,transparent)]',
                'bg-[var(--brand-soft)]',
                'text-[var(--brand)]'
            ].join(' ');
        case 'BASIC':
            return [
                'border-[var(--border)]',
                'bg-[var(--background-muted)]',
                'text-[var(--foreground-secondary)]'
            ].join(' ');
        case 'NONE':
        default:
            return [
                'border-[var(--border)]',
                'bg-[var(--background-subtle)]',
                'text-[var(--foreground-muted)]'
            ].join(' ');
    }
}
/**
 * Determine whether the verification state has a positive verification
 * indicator.
 *
 * NONE deliberately has no checkmark.
 *
 * The distinction is presentation-only. The Trust domain remains responsible
 * for defining the meaning of the verification level.
 */ function hasVerificationIndicator(verificationLevel) {
    return verificationLevel === 'BASIC' || verificationLevel === 'VERIFIED' || verificationLevel === 'HIGHLY_VERIFIED';
}
function VerificationBadge({ verificationLevel, showLabel = true, className }) {
    const label = getVerificationLabel(verificationLevel);
    const styles = getVerificationStyles(verificationLevel);
    const showIndicator = hasVerificationIndicator(verificationLevel);
    const accessibleLabel = `Verification level: ${label}`;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        title: accessibleLabel,
        "aria-label": accessibleLabel,
        className: [
            // -------------------------------------------------------------------
            // Compact badge shell
            // -------------------------------------------------------------------
            //
            // `shrink-0` is intentional. The verification badge should wrap as a
            // complete unit when TrustSummary becomes narrow rather than becoming
            // visually compressed.
            //
            'inline-flex',
            'max-w-full',
            'shrink-0',
            'items-center',
            'gap-1',
            'rounded-full',
            'border',
            'px-2',
            'py-0.5',
            'text-[11px]',
            'font-medium',
            'leading-4',
            'whitespace-nowrap',
            styles,
            className
        ].filter(Boolean).join(' '),
        children: [
            showIndicator ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                "aria-hidden": "true",
                className: [
                    'shrink-0',
                    'text-[11px]',
                    'font-bold',
                    'leading-none'
                ].join(' '),
                children: "✓"
            }, void 0, false, {
                fileName: "[project]/src/components/landing/shared/trust/verification-badge.tsx",
                lineNumber: 337,
                columnNumber: 9
            }, this) : null,
            showLabel ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "truncate",
                children: label
            }, void 0, false, {
                fileName: "[project]/src/components/landing/shared/trust/verification-badge.tsx",
                lineNumber: 354,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/landing/shared/trust/verification-badge.tsx",
        lineNumber: 297,
        columnNumber: 5
    }, this);
}
_c = VerificationBadge;
var _c;
__turbopack_context__.k.register(_c, "VerificationBadge");
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
"[project]/src/features/journey-demands/api/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// -----------------------------------------------------------------------------
// sisiMove — Journey Demand API
// -----------------------------------------------------------------------------
//
// Feature-level API barrel.
//
// Public marketplace discovery and authenticated owner operations are exposed
// through separate API modules.
//
// Consumers should normally import Journey Demand API operations through this
// feature boundary rather than importing implementation files directly.
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// Public Marketplace
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$journey$2d$demands$2f$api$2f$public$2d$journey$2d$demands$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/journey-demands/api/public-journey-demands.api.ts [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// Authenticated Owner
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$journey$2d$demands$2f$api$2f$my$2d$journey$2d$demands$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/journey-demands/api/my-journey-demands.api.ts [app-client] (ecmascript)");
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/journey-demands/api/my-journey-demands.api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getMyJourneyDemands",
    ()=>getMyJourneyDemands
]);
// -----------------------------------------------------------------------------
// sisiMove — My Journey Demands API
// -----------------------------------------------------------------------------
//
// Authenticated API operations for the currently authenticated user's
// Journey Demands.
//
// This API is intentionally separated from the public Journey Demand API.
//
// Public discovery:
//
//     GET /journey-demands
//     GET /journey-demands/:journeyDemandPublicId
//
// Authenticated ownership:
//
//     GET /journey-demands/me
//
// The `/me` endpoint is resolved from the authenticated identity on the
// backend. The frontend does not send a requesterPublicId and must never
// determine ownership by trusting a client-supplied requester identifier.
//
// Authentication rule:
//
//     Public Journey Demand reads
//         → apiClient
//
//     Authenticated "my Journey Demands" reads
//         → authenticatedApiClient
//
// The authenticated API client obtains the current AuthSession and injects:
//
//     Authorization: Bearer <accessToken>
//
// into the request.
//
// The response is an authenticated owner read model. It is different from
// PublicJourneyDemand because the owner needs lifecycle and management state
// that is intentionally not exposed by the public marketplace projection.
//
// The frontend consumes the MyJourneyDemand read model only. It does not
// depend on JourneyDemandAggregate, domain entities, Prisma models, or other
// backend persistence representations.
//
// IMPORTANT:
//
// An empty array is a successful result:
//
//     []
//
// It means the authenticated user currently has no Journey Demands.
//
// It is NOT an error and must not be converted into an exception here.
// The presentation layer is responsible for displaying the appropriate
// empty state.
//
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/authentication/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$http$2f$authenticated$2d$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/authentication/http/authenticated-api-client.ts [app-client] (ecmascript)");
;
// =============================================================================
// API Paths
// =============================================================================
/**
 * Canonical Journey Demand HTTP resource path.
 *
 * The authenticated owner collection is exposed through the `/me` sub-route.
 */ const JOURNEY_DEMANDS_PATH = '/journey-demands';
async function getMyJourneyDemands(query) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$http$2f$authenticated$2d$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authenticatedApiClient"].get(`${JOURNEY_DEMANDS_PATH}/me`, {
        query: {
            ...query?.limit !== undefined ? {
                limit: query.limit
            } : {},
            ...query?.offset !== undefined ? {
                offset: query.offset
            } : {}
        }
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/journey-demands/api/public-journey-demands.api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getPublicJourneyDemandByPublicId",
    ()=>getPublicJourneyDemandByPublicId,
    "getPublicJourneyDemands",
    ()=>getPublicJourneyDemands
]);
// -----------------------------------------------------------------------------
// sisiMove — Public Journey Demand API
// -----------------------------------------------------------------------------
//
// Public API operations for Journey Demand discovery.
//
// This API is intentionally limited to anonymous/public read operations.
//
// Canonical backend endpoints:
//
//   GET /journey-demands
//   GET /journey-demands/:journeyDemandPublicId
//
// The collection endpoint supports an empty query. Therefore, the public
// marketplace can display all publicly discoverable Journey Demands before
// the visitor applies any search or filtering.
//
// Public visibility is enforced by the backend public application query
// boundary. The frontend does not use a separate `/public/journey-demands`
// HTTP prefix.
//
// Authentication, mutation, participation, and private requester operations
// belong to their respective authenticated Journey Demand boundaries.
//
// The frontend consumes public read models only. It does not depend on the
// backend's JourneyDemandAggregate or persistence representation.
//
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$http$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/http/api-client.ts [app-client] (ecmascript)");
;
// -----------------------------------------------------------------------------
// API Paths
// -----------------------------------------------------------------------------
/**
 * Canonical Journey Demand HTTP resource path.
 *
 * Public discovery uses GET operations on this resource.
 *
 * Authenticated commands may also use this resource path, but authentication
 * and authorization are enforced by the corresponding backend command routes.
 */ const JOURNEY_DEMANDS_PATH = '/journey-demands';
async function getPublicJourneyDemands(query) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$http$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].get(JOURNEY_DEMANDS_PATH, {
        query: {
            ...query?.from !== undefined ? {
                from: query.from
            } : {},
            ...query?.to !== undefined ? {
                to: query.to
            } : {},
            ...query?.date !== undefined ? {
                date: query.date
            } : {},
            ...query?.limit !== undefined ? {
                limit: query.limit
            } : {},
            ...query?.offset !== undefined ? {
                offset: query.offset
            } : {}
        }
    });
}
async function getPublicJourneyDemandByPublicId(journeyDemandPublicId) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$http$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].get(`${JOURNEY_DEMANDS_PATH}/${encodeURIComponent(journeyDemandPublicId)}`);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/journey-demands/hooks/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Hooks
// -----------------------------------------------------------------------------
//
// Public hook exports for the Journey Demand feature.
//
// Two distinct read boundaries are exposed:
//
//     Public marketplace
//     ├── useJourneyDemands
//     └── useJourneyDemand
//
//     Authenticated owner
//     └── useMyJourneyDemands
//
// The authenticated hook is intentionally separate from the public discovery
// hooks because ownership comes from the authenticated backend session.
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// Public Journey Demand Collection
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$journey$2d$demands$2f$hooks$2f$use$2d$journey$2d$demands$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/journey-demands/hooks/use-journey-demands.ts [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// Public Journey Demand Detail
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$journey$2d$demands$2f$hooks$2f$use$2d$journey$2d$demand$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/journey-demands/hooks/use-journey-demand.ts [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// Authenticated — My Journey Demands
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$journey$2d$demands$2f$hooks$2f$use$2d$my$2d$journey$2d$demands$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/journey-demands/hooks/use-my-journey-demands.ts [app-client] (ecmascript)");
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/journey-demands/hooks/use-journey-demand.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useJourneyDemand",
    ()=>useJourneyDemand
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$journey$2d$demands$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/journey-demands/api/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$journey$2d$demands$2f$api$2f$public$2d$journey$2d$demands$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/journey-demands/api/public-journey-demands.api.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
// -----------------------------------------------------------------------------
// sisiMove — Public Journey Demand Detail Hook
// -----------------------------------------------------------------------------
//
// Client-side hook for loading one publicly discoverable Journey Demand.
//
// A missing public ID does not trigger a request. The hook therefore remains
// safe to use while a route parameter is unavailable.
//
// Public visibility is enforced by the backend public-read boundary. The
// frontend does not attempt to determine whether a Journey Demand is public.
//
// The API already returns the frontend PublicJourneyDemand representation.
// There is therefore no mapper layer in this hook. A mapper should only be
// introduced if the API representation and frontend representation genuinely
// diverge.
//
// Request cancellation and request IDs prevent a stale detail response from
// replacing the result for a newer public Journey Demand.
//
// The effect is responsible only for synchronizing the hook with the external
// API request. It does not synchronously reset React state from inside the
// effect body.
// -----------------------------------------------------------------------------
'use client';
;
;
function useJourneyDemand(journeyDemandPublicId) {
    _s();
    const normalizedPublicId = journeyDemandPublicId?.trim() || null;
    const hasPublicId = normalizedPublicId !== null;
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(hasPublicId);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const requestIdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    // ---------------------------------------------------------------------------
    // Load Public Journey Demand
    // ---------------------------------------------------------------------------
    //
    // A missing public ID means that there is no external resource to load.
    //
    // The effect therefore exits without synchronously mutating React state.
    // ---------------------------------------------------------------------------
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useJourneyDemand.useEffect": ()=>{
            if (normalizedPublicId === null) {
                return;
            }
            let cancelled = false;
            const requestId = ++requestIdRef.current;
            const load = {
                "useJourneyDemand.useEffect.load": async ()=>{
                    try {
                        const journeyDemand = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$journey$2d$demands$2f$api$2f$public$2d$journey$2d$demands$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPublicJourneyDemandByPublicId"])(normalizedPublicId);
                        // Ignore responses from cancelled or superseded requests.
                        if (cancelled || requestId !== requestIdRef.current) {
                            return;
                        }
                        // The public API already returns the frontend public read model.
                        //
                        // No API-to-frontend mapper is required because both boundaries
                        // currently use the same PublicJourneyDemand contract.
                        setData(journeyDemand);
                        setError(null);
                    } catch (cause) {
                        if (cancelled || requestId !== requestIdRef.current) {
                            return;
                        }
                        setData(null);
                        setError(cause instanceof Error ? cause : new Error('Unable to load the public Journey Demand.'));
                    } finally{
                        if (!cancelled && requestId === requestIdRef.current) {
                            setIsLoading(false);
                        }
                    }
                }
            }["useJourneyDemand.useEffect.load"];
            void load();
            return ({
                "useJourneyDemand.useEffect": ()=>{
                    cancelled = true;
                }
            })["useJourneyDemand.useEffect"];
        }
    }["useJourneyDemand.useEffect"], [
        normalizedPublicId
    ]);
    // ---------------------------------------------------------------------------
    // Public State
    // ---------------------------------------------------------------------------
    //
    // When no public ID exists, there is no resource being requested.
    //
    // Return the appropriate derived state directly instead of synchronously
    // resetting React state from inside the effect.
    // ---------------------------------------------------------------------------
    if (!hasPublicId) {
        return {
            data: null,
            isLoading: false,
            error: null
        };
    }
    return {
        data,
        isLoading,
        error
    };
}
_s(useJourneyDemand, "VPyRifTGmR041atPtGZ8sD98v6Q=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/journey-demands/hooks/use-journey-demands.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useJourneyDemands",
    ()=>useJourneyDemands
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$journey$2d$demands$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/journey-demands/api/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$journey$2d$demands$2f$api$2f$public$2d$journey$2d$demands$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/journey-demands/api/public-journey-demands.api.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
// -----------------------------------------------------------------------------
// sisiMove — Public Journey Demands Hook
// -----------------------------------------------------------------------------
//
// Client-side hook for discovering publicly available Journey Demands.
//
// The hook intentionally loads the public collection on mount and whenever the
// marketplace query changes.
//
// An empty query is valid and represents the default marketplace state:
//
//     show publicly discoverable Journey Demands
//
// Search and filtering are refinements of that marketplace state, not a
// prerequisite for discovery.
//
// Request cancellation and request IDs prevent stale responses from replacing
// newer marketplace results when filters or pagination change quickly.
//
// The API already returns the frontend PublicJourneyDemand representation.
// There is therefore no mapper layer here. A mapper should only be introduced
// if the API representation and frontend representation genuinely diverge.
//
// -----------------------------------------------------------------------------
'use client';
;
;
function useJourneyDemands(query) {
    _s();
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const requestIdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    // ---------------------------------------------------------------------------
    // Query Dependencies
    // ---------------------------------------------------------------------------
    //
    // Extract primitive values so the effect does not re-run merely because a
    // caller creates a new query object with the same values.
    //
    // Pagination values are included because changing either value represents a
    // new marketplace collection request.
    // ---------------------------------------------------------------------------
    const from = query?.from;
    const to = query?.to;
    const date = query?.date;
    const limit = query?.limit;
    const offset = query?.offset;
    // ---------------------------------------------------------------------------
    // Load Public Journey Demands
    // ---------------------------------------------------------------------------
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useJourneyDemands.useEffect": ()=>{
            let cancelled = false;
            const requestId = ++requestIdRef.current;
            const load = {
                "useJourneyDemands.useEffect.load": async ()=>{
                    setIsLoading(true);
                    setError(null);
                    try {
                        const journeyDemands = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$journey$2d$demands$2f$api$2f$public$2d$journey$2d$demands$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPublicJourneyDemands"])({
                            ...from !== undefined ? {
                                from
                            } : {},
                            ...to !== undefined ? {
                                to
                            } : {},
                            ...date !== undefined ? {
                                date
                            } : {},
                            ...limit !== undefined ? {
                                limit
                            } : {},
                            ...offset !== undefined ? {
                                offset
                            } : {}
                        });
                        // ---------------------------------------------------------------------
                        // Ignore cancelled or superseded requests.
                        // ---------------------------------------------------------------------
                        //
                        // A visitor can change marketplace filters quickly. If an older
                        // request finishes after a newer request, its response must not
                        // overwrite the newer marketplace state.
                        // ---------------------------------------------------------------------
                        if (cancelled || requestId !== requestIdRef.current) {
                            return;
                        }
                        // The public API already returns PublicJourneyDemand objects.
                        //
                        // No mapper is required because there is currently no API-to-frontend
                        // transformation at this boundary.
                        setData(journeyDemands);
                    } catch (cause) {
                        if (cancelled || requestId !== requestIdRef.current) {
                            return;
                        }
                        setError(cause instanceof Error ? cause : new Error('Unable to load public Journey Demands.'));
                    } finally{
                        if (!cancelled && requestId === requestIdRef.current) {
                            setIsLoading(false);
                        }
                    }
                }
            }["useJourneyDemands.useEffect.load"];
            void load();
            return ({
                "useJourneyDemands.useEffect": ()=>{
                    cancelled = true;
                }
            })["useJourneyDemands.useEffect"];
        }
    }["useJourneyDemands.useEffect"], [
        from,
        to,
        date,
        limit,
        offset
    ]);
    // ---------------------------------------------------------------------------
    // Public Hook State
    // ---------------------------------------------------------------------------
    return {
        data,
        isLoading,
        error
    };
}
_s(useJourneyDemands, "Mc/J21wZ5NsDTPJ+dURUN54tW/Y=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/journey-demands/hooks/use-my-journey-demands.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useMyJourneyDemands",
    ()=>useMyJourneyDemands
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$journey$2d$demands$2f$api$2f$my$2d$journey$2d$demands$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/journey-demands/api/my-journey-demands.api.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
// -----------------------------------------------------------------------------
// sisiMove — useMyJourneyDemands
// -----------------------------------------------------------------------------
//
// React hook for retrieving Journey Demands belonging to the currently
// authenticated user.
//
// Data boundary:
//
//     useMyJourneyDemands
//             ↓
//     getMyJourneyDemands()
//             ↓
//     GET /journey-demands/me
//             ↓
//     MyJourneyDemand[]
//
// Ownership is resolved by the backend from the authenticated session.
//
// The hook never accepts or sends a requesterPublicId.
//
// The hook owns only frontend request state:
//     - demands
//     - isLoading
//     - error
//     - refetch
//
// Authentication, authorization, and ownership remain backend concerns.
//
// -----------------------------------------------------------------------------
'use client';
;
;
function useMyJourneyDemands() {
    _s();
    const [demands, setDemands] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // ---------------------------------------------------------------------------
    // Load
    // ---------------------------------------------------------------------------
    /**
   * Performs the actual API request.
   *
   * This function is intentionally responsible only for retrieving and
   * storing the successful result.
   *
   * Loading and error lifecycle state is managed by the caller so that the
   * initial effect and explicit refetch follow the same API boundary without
   * coupling request execution to one particular lifecycle.
   */ const fetchDemands = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useMyJourneyDemands.useCallback[fetchDemands]": async ()=>{
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$journey$2d$demands$2f$api$2f$my$2d$journey$2d$demands$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMyJourneyDemands"])();
            setDemands(result);
        }
    }["useMyJourneyDemands.useCallback[fetchDemands]"], []);
    // ---------------------------------------------------------------------------
    // Initial Load
    // ---------------------------------------------------------------------------
    /**
   * Load the authenticated user's Journey Demands after mount.
   *
   * The active flag prevents state updates after the component has been
   * unmounted or the effect has been invalidated.
   */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useMyJourneyDemands.useEffect": ()=>{
            let active = true;
            const load = {
                "useMyJourneyDemands.useEffect.load": async ()=>{
                    try {
                        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$journey$2d$demands$2f$api$2f$my$2d$journey$2d$demands$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMyJourneyDemands"])();
                        if (!active) {
                            return;
                        }
                        setDemands(result);
                        setError(null);
                    } catch (cause) {
                        if (!active) {
                            return;
                        }
                        setError(cause instanceof Error ? cause : new Error('Failed to load your journey demands.'));
                    } finally{
                        if (active) {
                            setIsLoading(false);
                        }
                    }
                }
            }["useMyJourneyDemands.useEffect.load"];
            void load();
            return ({
                "useMyJourneyDemands.useEffect": ()=>{
                    active = false;
                }
            })["useMyJourneyDemands.useEffect"];
        }
    }["useMyJourneyDemands.useEffect"], []);
    // ---------------------------------------------------------------------------
    // Refetch
    // ---------------------------------------------------------------------------
    /**
   * Explicitly reload the authenticated user's Journey Demands.
   *
   * Refetch is initiated by a user/application action and therefore owns the
   * request lifecycle state directly.
   */ const refetch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useMyJourneyDemands.useCallback[refetch]": async ()=>{
            setIsLoading(true);
            setError(null);
            try {
                await fetchDemands();
            } catch (cause) {
                setError(cause instanceof Error ? cause : new Error('Failed to load your journey demands.'));
            } finally{
                setIsLoading(false);
            }
        }
    }["useMyJourneyDemands.useCallback[refetch]"], [
        fetchDemands
    ]);
    // ---------------------------------------------------------------------------
    // Result
    // ---------------------------------------------------------------------------
    return {
        demands,
        isLoading,
        error,
        refetch
    };
}
_s(useMyJourneyDemands, "yB5X67dp0zK199h2w+on4JcO7qE=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/journeys/api/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// src/features/journeys/api/index.ts
// -----------------------------------------------------------------------------
// sisiMove — Journey API Barrel
// -----------------------------------------------------------------------------
//
// Public feature boundary for Journey HTTP operations.
//
// Consumers should normally import Journey API functions through:
//
//     @/features/journeys
//
// rather than importing individual API modules directly.
//
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// Public Journeys
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$journeys$2f$api$2f$public$2d$journeys$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/journeys/api/public-journeys.api.ts [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// Authenticated — My Journeys
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$journeys$2f$api$2f$my$2d$journeys$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/journeys/api/my-journeys.api.ts [app-client] (ecmascript)");
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/journeys/api/my-journeys.api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getMyJourneys",
    ()=>getMyJourneys
]);
// -----------------------------------------------------------------------------
// sisiMove — My Journeys API
// -----------------------------------------------------------------------------
//
// Authenticated HTTP operations for Journeys belonging to the currently
// authenticated traveller.
//
// Backend route:
//
//   GET /journeys/me
//
// Authenticated Journey architecture:
//
//   Authenticated session
//        ↓
//   AuthenticatedIdentity
//        ↓
//   JourneyController
//        ↓
//   GetJourneysByProviderQuery
//        ↓
//   JourneyRepository
//        ↓
//   MyJourneyMapper
//        ↓
//   MyJourneyResponse[]
//        ↓
//   MyJourney[]
//
// IMPORTANT
// -----------------------------------------------------------------------------
//
// This API is intentionally separate from:
//
//   public-journeys.api.ts
//
// Public Journey discovery answers:
//
//   "Which Journeys are publicly discoverable?"
//
// This API answers:
//
//   "Which Journeys belong to me?"
//
// The current identity is determined by the backend from the authenticated
// access token.
//
// The frontend MUST NOT provide a providerPublicId for this operation.
//
// Therefore this module does NOT:
//
// - accept or construct a providerPublicId;
// - determine the current identity;
// - inspect Journey ownership;
// - determine authorization;
// - perform public visibility checks;
// - recreate Journey domain rules;
// - load Traveller Profile or Trust Profile independently.
//
// Authentication, authorization, ownership, and lifecycle rules belong to
// the backend.
//
// Authentication rule:
//
//   Public Journey reads
//        → apiClient
//
//   Authenticated "my Journeys" reads
//        → authenticatedApiClient
//
// The authenticated API client obtains the current AuthSession and injects:
//
//   Authorization: Bearer <accessToken>
//
// into the request.
//
// Empty collection rule:
//
//   []
//
// is a successful response and means that the authenticated traveller has
// no Journeys.
//
// It is NOT an API error and must not be converted into an exception here.
// The presentation layer is responsible for displaying the appropriate
// empty state.
//
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// Authentication — Authenticated HTTP
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/authentication/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$http$2f$authenticated$2d$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/authentication/http/authenticated-api-client.ts [app-client] (ecmascript)");
;
// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------
/**
 * Base route for the Journey HTTP controller.
 *
 * NestJS:
 *
 *     @Controller('journeys')
 *
 * The authenticated current-identity collection is exposed as:
 *
 *     GET /journeys/me
 */ const JOURNEYS_PATH = '/journeys';
async function getMyJourneys() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$http$2f$authenticated$2d$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authenticatedApiClient"].get(`${JOURNEYS_PATH}/me`);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/journeys/api/public-journeys.api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getPublicJourneyByPublicId",
    ()=>getPublicJourneyByPublicId,
    "getPublicJourneys",
    ()=>getPublicJourneys
]);
// src/features/journeys/api/public-journeys.api.ts
// -----------------------------------------------------------------------------
// sisiMove — Public Journeys API
// -----------------------------------------------------------------------------
//
// Public HTTP operations for Journey discovery.
//
// Backend routes:
//
//   GET /journeys/public
//       Public Journey marketplace collection.
//
//   GET /journeys/:journeyPublicId
//       Public Journey detail.
//
// Public Journey architecture:
//
//   JourneyController
//        ↓
//   GetPublicJourneysQuery
//        ↓
//   GetPublicJourneysQueryHandler
//        ↓
//   PublicJourneyResponse
//        ├── Journey
//        └── provider
//              ├── traveller
//              └── trust
//
// The frontend receives the completed public Journey representation.
//
// IMPORTANT
// ---------
//
// Journey owns Journey creation and Journey state.
//
// Traveller Profile and Trust Profile do NOT own Journey and are not
// independently composed by this API module.
//
// The backend public-read boundary performs that composition.
//
// This module therefore:
//
// - retrieves publicly discoverable Journeys;
// - retrieves one publicly discoverable Journey;
// - passes optional marketplace discovery filters to the backend;
// - translates frontend query state into HTTP query parameters;
// - preserves the backend public Journey representation.
//
// This module does NOT:
//
// - own Journey domain models;
// - compose Traveller Profile or Trust Profile data;
// - implement marketplace business rules;
// - perform authentication;
// - inspect Journey lifecycle/status;
// - determine public visibility;
// - recreate backend public-read rules.
//
// Public visibility belongs to the backend Journey public-read boundary.
//
// The Marketplace feature may consume these operations when composing the
// public marketplace with Journey Demand.
//
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// Foundation — HTTP
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$http$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/http/api-client.ts [app-client] (ecmascript)");
;
// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------
/**
 * Base route for the Journey HTTP controller.
 *
 * The NestJS JourneyController is mounted at:
 *
 *     /journeys
 *
 * Public discovery is exposed beneath that controller:
 *
 *     GET /journeys/public
 *     GET /journeys/:journeyPublicId
 */ const JOURNEYS_PATH = '/journeys';
async function getPublicJourneys(query) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$http$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].get(`${JOURNEYS_PATH}/public`, {
        query: {
            from: query?.from,
            to: query?.to,
            date: query?.date
        }
    });
}
async function getPublicJourneyByPublicId(journeyPublicId) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$http$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].get(`${JOURNEYS_PATH}/${encodeURIComponent(journeyPublicId)}`);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/journeys/hooks/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// src/features/journeys/hooks/index.ts
// -----------------------------------------------------------------------------
// sisiMove — Journey Hooks Barrel
// -----------------------------------------------------------------------------
//
// Public feature boundary for Journey React hooks.
//
// Consumers should normally import hooks through:
// 
//     @/features/journeys
//
// rather than importing individual hook files directly.
//
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// Public Journeys
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$journeys$2f$hooks$2f$public$2d$use$2d$journeys$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/journeys/hooks/public-use-journeys.ts [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// Public Journey
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$journeys$2f$hooks$2f$public$2d$use$2d$journey$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/journeys/hooks/public-use-journey.ts [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// Authenticated — My Journeys
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$journeys$2f$hooks$2f$use$2d$my$2d$journeys$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/journeys/hooks/use-my-journeys.ts [app-client] (ecmascript)");
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/journeys/hooks/public-use-journey.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePublicJourney",
    ()=>usePublicJourney
]);
// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// Journey — Public API
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$journeys$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/journeys/api/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$journeys$2f$api$2f$public$2d$journeys$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/journeys/api/public-journeys.api.ts [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// Journey — Public Mappers
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$journeys$2f$mappers$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/journeys/mappers/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$journeys$2f$mappers$2f$map$2d$public$2d$journey$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/journeys/mappers/map-public-journey.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
// src/features/journeys/hooks/public-use-journey.ts
// -----------------------------------------------------------------------------
// sisiMove — Public Journey Detail Hook
// -----------------------------------------------------------------------------
//
// React hook for retrieving one publicly discoverable Journey.
//
// Public Journey detail flow:
//
//     usePublicJourney(publicId)
//             │
//             ▼
//     getPublicJourneyByPublicId()
//             │
//             ▼
//     GET /journeys/:journeyPublicId
//             │
//             ▼
//     Journey public-read boundary
//             │
//             ▼
//     PublicJourney API response
//             │
//             ▼
//     mapPublicJourney()
//             │
//             ▼
//     frontend PublicJourney
//
// Architectural boundary
// ----------------------
//
// Journey remains the primary domain object.
//
// The backend public-read boundary is responsible for returning the complete
// public Journey representation, including the provider composition:
//
//     provider.traveller
//     provider.trust
//
// This hook does not reconstruct that relationship.
//
// Responsibilities:
// - accept a Journey public identifier;
// - retrieve the public Journey detail;
// - map the API representation into the frontend PublicJourney model;
// - expose loading, data, and error state;
// - prevent stale Journey data from being displayed after navigation;
// - prevent obsolete requests from mutating current state.
//
// This hook does NOT:
// - fetch Traveller Profile data;
// - fetch Trust data;
// - fetch Journey Demand data;
// - compose Marketplace data;
// - perform Journey lifecycle operations;
// - require authentication;
// - implement Journey business rules;
// - determine Journey public visibility.
//
// Marketplace composition belongs above the Journey feature boundary.
//
// -----------------------------------------------------------------------------
'use client';
;
;
;
function usePublicJourney(journeyPublicId) {
    _s();
    // ===========================================================================
    // Normalize Identifier
    // ===========================================================================
    /**
   * Normalize the external identifier before using it as request state.
   *
   * Whitespace-only identifiers are treated as absent.
   */ const normalizedPublicId = typeof journeyPublicId === 'string' ? journeyPublicId.trim() : '';
    const hasPublicId = normalizedPublicId.length > 0;
    // ===========================================================================
    // Result State
    // ===========================================================================
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    /**
   * Identifies the Journey represented by `data`.
   *
   * `null` means that no completed result is currently represented.
   */ const [loadedPublicId, setLoadedPublicId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // ===========================================================================
    // Request Identity
    // ===========================================================================
    //
    // The request sequence advances whenever the identifier changes, including
    // when the identifier becomes empty.
    //
    // This is deliberate.
    //
    // Example:
    //
    //     Journey A request → id 1
    //     navigation to B   → id 2
    //     navigation to ""  → id 3
    //
    // No older request can commit after the identifier has moved on.
    //
    // ===========================================================================
    const requestIdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    // ===========================================================================
    // Load Public Journey
    // ===========================================================================
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "usePublicJourney.useEffect": ()=>{
            /*
     * Every identifier transition creates a new request generation.
     *
     * This happens before checking whether an identifier exists so that an
     * invalid/empty identifier also invalidates any previous network request.
     */ const requestId = ++requestIdRef.current;
            /*
     * There is no request to perform without a valid public identifier.
     *
     * The returned state is derived from the identifier and loaded result, so
     * no synchronous state update is necessary here.
     */ if (!hasPublicId) {
                return;
            }
            let cancelled = false;
            // -------------------------------------------------------------------------
            // Load
            // -------------------------------------------------------------------------
            const load = {
                "usePublicJourney.useEffect.load": async ()=>{
                    try {
                        // ---------------------------------------------------------------------
                        // Request
                        // ---------------------------------------------------------------------
                        const journey = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$journeys$2f$api$2f$public$2d$journeys$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPublicJourneyByPublicId"])(normalizedPublicId);
                        // ---------------------------------------------------------------------
                        // Stale Request Protection
                        // ---------------------------------------------------------------------
                        //
                        // The response is ignored if:
                        //
                        // - the effect was cleaned up; or
                        // - another identifier has created a newer request generation.
                        //
                        // ---------------------------------------------------------------------
                        if (cancelled || requestId !== requestIdRef.current) {
                            return;
                        }
                        // ---------------------------------------------------------------------
                        // API → Frontend Model
                        // ---------------------------------------------------------------------
                        //
                        // The backend has already composed the public Journey representation.
                        //
                        // The mapper performs only the API/frontend translation.
                        //
                        // It must preserve:
                        //
                        //     provider.traveller
                        //     provider.trust
                        //
                        // without performing additional requests.
                        //
                        const mappedJourney = journey === null ? null : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$journeys$2f$mappers$2f$map$2d$public$2d$journey$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapPublicJourney"])(journey);
                        // ---------------------------------------------------------------------
                        // Commit Result
                        // ---------------------------------------------------------------------
                        setData(mappedJourney);
                        setLoadedPublicId(normalizedPublicId);
                        setError(null);
                    } catch (cause) {
                        // ---------------------------------------------------------------------
                        // Ignore Stale Failures
                        // ---------------------------------------------------------------------
                        if (cancelled || requestId !== requestIdRef.current) {
                            return;
                        }
                        // ---------------------------------------------------------------------
                        // Commit Error
                        // ---------------------------------------------------------------------
                        //
                        // The failed identifier is still marked as loaded because the request
                        // has completed. This allows `isLoading` to become false while the
                        // error remains associated with the correct Journey identifier.
                        //
                        // ---------------------------------------------------------------------
                        setData(null);
                        setLoadedPublicId(normalizedPublicId);
                        setError(cause instanceof Error ? cause : new Error('Unable to load the public Journey.'));
                    }
                }
            }["usePublicJourney.useEffect.load"];
            // -------------------------------------------------------------------------
            // Execute
            // -------------------------------------------------------------------------
            void load();
            // -------------------------------------------------------------------------
            // Cleanup
            // -------------------------------------------------------------------------
            //
            // Mark this request lifecycle as inactive.
            //
            // The request sequence remains the stronger protection because the HTTP
            // operation itself may continue after React cleans up the effect.
            //
            // -------------------------------------------------------------------------
            return ({
                "usePublicJourney.useEffect": ()=>{
                    cancelled = true;
                }
            })["usePublicJourney.useEffect"];
        }
    }["usePublicJourney.useEffect"], [
        hasPublicId,
        normalizedPublicId
    ]);
    // ===========================================================================
    // Current Result
    // ===========================================================================
    //
    // A stored result is valid only when it belongs to the currently requested
    // identifier.
    //
    // Therefore:
    //
    //     Journey A loaded
    //     ↓
    //     navigate to Journey B
    //     ↓
    //     loadedPublicId === A
    //     normalizedPublicId === B
    //     ↓
    //     A is not exposed
    //
    // This avoids rendering stale Journey A data while Journey B loads.
    //
    // ===========================================================================
    const isCurrentResult = hasPublicId && loadedPublicId === normalizedPublicId;
    // ===========================================================================
    // Derived Loading State
    // ===========================================================================
    /**
   * A valid identifier is loading until a completed result or error has been
   * associated with that same identifier.
   */ const isLoading = hasPublicId && !isCurrentResult;
    // ===========================================================================
    // Derived Current Data
    // ===========================================================================
    const currentData = isCurrentResult ? data : null;
    // ===========================================================================
    // Derived Current Error
    // ===========================================================================
    const currentError = isCurrentResult ? error : null;
    // ===========================================================================
    // Public State
    // ===========================================================================
    return {
        data: currentData,
        isLoading,
        error: currentError
    };
}
_s(usePublicJourney, "VVNd9SrygqIL7haAQmWKXCIRp6U=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/journeys/hooks/public-use-journeys.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePublicJourneys",
    ()=>usePublicJourneys
]);
// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// Journey — Public API
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$journeys$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/journeys/api/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$journeys$2f$api$2f$public$2d$journeys$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/journeys/api/public-journeys.api.ts [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// Journey — Public Mappers
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$journeys$2f$mappers$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/journeys/mappers/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$journeys$2f$mappers$2f$map$2d$public$2d$journey$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/journeys/mappers/map-public-journey.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
// src/features/journeys/hooks/public-use-journeys.ts
// -----------------------------------------------------------------------------
// sisiMove — Public Journeys Hook
// -----------------------------------------------------------------------------
//
// React hook for retrieving publicly discoverable Journeys.
//
// Public Journey read flow:
//
//     usePublicJourneys()
//             │
//             ▼
//     getPublicJourneys()
//             │
//             ▼
//     GET /journeys/public
//             │
//             ▼
//     Journey public-read boundary
//             │
//             ▼
//     PublicJourney API responses
//             │
//             ▼
//     mapPublicJourney()
//             │
//             ▼
//     frontend PublicJourney[]
//
// Architectural boundary
// ----------------------
//
// Journey remains the primary domain object.
//
// The backend public-read boundary is responsible for composing the public
// representation of a Journey, including:
//
//     provider.traveller
//     provider.trust
//
// The frontend hook does not reconstruct that relationship.
//
// Its only responsibility is:
//
//     transport → mapping → React state
//
// Responsibilities:
// - execute the public Journey collection request;
// - support the unfiltered marketplace collection;
// - support optional Journey discovery filters;
// - expose loading, error, and data state;
// - preserve existing Journey data while a new request is loading;
// - map API responses into the frontend PublicJourney model;
// - protect state from stale requests.
//
// This hook does NOT:
// - compose Journey Demand;
// - own marketplace state;
// - perform authentication;
// - implement Journey business rules;
// - determine Journey public visibility;
// - load Traveller Profile separately;
// - load Trust Profile separately;
// - reconstruct the Journey provider.
//
// Public visibility and provider composition belong to the backend Journey
// public-read boundary.
//
// Marketplace composition belongs to the Public Marketplace feature.
//
// -----------------------------------------------------------------------------
'use client';
;
;
;
function usePublicJourneys(query) {
    _s();
    // ===========================================================================
    // Query Values
    // ===========================================================================
    //
    // Extract primitive values so the request lifecycle follows actual query
    // changes rather than object identity.
    //
    // ===========================================================================
    const from = query?.from;
    const to = query?.to;
    const date = query?.date;
    // ===========================================================================
    // State
    // ===========================================================================
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // ===========================================================================
    // Request Identity
    // ===========================================================================
    //
    // Each effect execution receives a monotonically increasing request ID.
    //
    // Example:
    //
    //     Request A starts → id 1
    //     Request B starts → id 2
    //     Request B completes
    //     Request A completes later
    //
    // Request A must not overwrite Request B.
    //
    // The request ID therefore protects state even when the underlying HTTP
    // client cannot physically abort an already-running request.
    //
    // ===========================================================================
    const requestIdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    // ===========================================================================
    // Public Journey Request
    // ===========================================================================
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "usePublicJourneys.useEffect": ()=>{
            let cancelled = false;
            const requestId = ++requestIdRef.current;
            // -------------------------------------------------------------------------
            // Load
            // -------------------------------------------------------------------------
            const load = {
                "usePublicJourneys.useEffect.load": async ()=>{
                    // -----------------------------------------------------------------------
                    // Request Start
                    // -----------------------------------------------------------------------
                    //
                    // Do NOT clear `data`.
                    //
                    // The marketplace should continue displaying the previous committed
                    // Journey collection while the next filtered collection is loading.
                    //
                    // This avoids:
                    //
                    //     data → []
                    //     loading → true
                    //
                    // followed by the new response.
                    //
                    // Instead:
                    //
                    //     previous data remains visible
                    //     loading → true
                    //     new data replaces previous data when ready
                    //
                    // -----------------------------------------------------------------------
                    setIsLoading(true);
                    setError(null);
                    try {
                        // ---------------------------------------------------------------------
                        // API Query
                        // ---------------------------------------------------------------------
                        //
                        // An entirely empty query represents the marketplace inventory:
                        //
                        //     GET /journeys/public
                        //
                        // This corresponds to the backend's empty GetPublicJourneysQuery.
                        //
                        // Only defined filters are forwarded when discovery is being narrowed.
                        //
                        // ---------------------------------------------------------------------
                        const apiQuery = from === undefined && to === undefined && date === undefined ? undefined : {
                            from,
                            to,
                            date
                        };
                        // ---------------------------------------------------------------------
                        // Request
                        // ---------------------------------------------------------------------
                        const responses = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$journeys$2f$api$2f$public$2d$journeys$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPublicJourneys"])(apiQuery);
                        // ---------------------------------------------------------------------
                        // Stale Request Protection
                        // ---------------------------------------------------------------------
                        //
                        // Check immediately after the asynchronous boundary.
                        //
                        // A response from an obsolete request must not be allowed to continue
                        // into mapping or state commitment.
                        //
                        // ---------------------------------------------------------------------
                        if (cancelled || requestId !== requestIdRef.current) {
                            return;
                        }
                        // ---------------------------------------------------------------------
                        // API → Frontend Mapping
                        // ---------------------------------------------------------------------
                        //
                        // The API layer owns HTTP communication.
                        //
                        // The mapper owns the API/frontend representation boundary.
                        //
                        // The mapper must preserve the provider composition supplied by the
                        // backend:
                        //
                        //     provider.traveller
                        //     provider.trust
                        //
                        // It must not issue additional network requests or reconstruct the
                        // Journey provider.
                        //
                        // ---------------------------------------------------------------------
                        const mappedJourneys = responses.map(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$journeys$2f$mappers$2f$map$2d$public$2d$journey$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapPublicJourney"]);
                        // ---------------------------------------------------------------------
                        // Commit
                        // ---------------------------------------------------------------------
                        //
                        // The request was still current after the asynchronous HTTP operation,
                        // so the mapped collection can become the new committed state.
                        //
                        // ---------------------------------------------------------------------
                        setData(mappedJourneys);
                    } catch (cause) {
                        // ---------------------------------------------------------------------
                        // Ignore Stale Failures
                        // ---------------------------------------------------------------------
                        //
                        // A stale request must never replace the active request's error.
                        //
                        // ---------------------------------------------------------------------
                        if (cancelled || requestId !== requestIdRef.current) {
                            return;
                        }
                        // ---------------------------------------------------------------------
                        // Normalize Error
                        // ---------------------------------------------------------------------
                        setError(cause instanceof Error ? cause : new Error('Unable to load public Journeys.'));
                    } finally{
                        // ---------------------------------------------------------------------
                        // Request Completion
                        // ---------------------------------------------------------------------
                        //
                        // Only the active request can finish the loading state.
                        //
                        // Without the request identity check, an older request could complete
                        // while a newer request is still in flight and incorrectly set:
                        //
                        //     isLoading = false
                        //
                        // ---------------------------------------------------------------------
                        if (!cancelled && requestId === requestIdRef.current) {
                            setIsLoading(false);
                        }
                    }
                }
            }["usePublicJourneys.useEffect.load"];
            // -------------------------------------------------------------------------
            // Execute
            // -------------------------------------------------------------------------
            void load();
            // -------------------------------------------------------------------------
            // Cleanup
            // -------------------------------------------------------------------------
            //
            // Mark this request lifecycle as inactive.
            //
            // This does not necessarily abort the HTTP operation itself. The request
            // ID check remains the authoritative protection against stale state.
            //
            // -------------------------------------------------------------------------
            return ({
                "usePublicJourneys.useEffect": ()=>{
                    cancelled = true;
                }
            })["usePublicJourneys.useEffect"];
        }
    }["usePublicJourneys.useEffect"], [
        from,
        to,
        date
    ]);
    // ===========================================================================
    // Public Hook State
    // ===========================================================================
    return {
        data,
        isLoading,
        error
    };
}
_s(usePublicJourneys, "Mc/J21wZ5NsDTPJ+dURUN54tW/Y=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/journeys/hooks/use-my-journeys.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useMyJourneys",
    ()=>useMyJourneys
]);
// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// Journey — API
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$journeys$2f$api$2f$my$2d$journeys$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/journeys/api/my-journeys.api.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
// -----------------------------------------------------------------------------
// sisiMove — useMyJourneys
// -----------------------------------------------------------------------------
//
// Authenticated Journey data hook.
//
// Responsibilities:
//
//   React component
//        ↓
//   useMyJourneys()
//        ↓
//   getMyJourneys()
//        ↓
//   GET /journeys/me
//
// This hook is intentionally thin.
//
// It does NOT:
//
// - determine the current identity;
// - accept a providerPublicId;
// - perform authorization;
// - determine Journey ownership;
// - recreate Journey lifecycle rules;
// - query Traveller Profile;
// - query Trust;
// - query Assets independently.
//
// The backend remains the source of truth for authentication, authorization,
// ownership, and Journey lifecycle state.
//
// -----------------------------------------------------------------------------
'use client';
;
;
function useMyJourneys() {
    _s();
    const [journeys, setJourneys] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // ---------------------------------------------------------------------------
    // Initial load
    // ---------------------------------------------------------------------------
    //
    // The request is started from the effect, but state updates happen only
    // after the asynchronous operation resolves or rejects.
    //
    // This avoids the synchronous setState-in-effect pattern flagged by the
    // React hooks lint rule.
    //
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useMyJourneys.useEffect": ()=>{
            let cancelled = false;
            const load = {
                "useMyJourneys.useEffect.load": async ()=>{
                    try {
                        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$journeys$2f$api$2f$my$2d$journeys$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMyJourneys"])();
                        if (cancelled) {
                            return;
                        }
                        setJourneys(result);
                        setError(null);
                    } catch (cause) {
                        if (cancelled) {
                            return;
                        }
                        const nextError = cause instanceof Error ? cause : new Error('Failed to load your journeys.');
                        setError(nextError);
                    } finally{
                        if (!cancelled) {
                            setIsLoading(false);
                        }
                    }
                }
            }["useMyJourneys.useEffect.load"];
            void load();
            return ({
                "useMyJourneys.useEffect": ()=>{
                    cancelled = true;
                }
            })["useMyJourneys.useEffect"];
        }
    }["useMyJourneys.useEffect"], []);
    // ---------------------------------------------------------------------------
    // Refetch
    // ---------------------------------------------------------------------------
    //
    // Refetch is an explicit user/application action rather than an effect.
    //
    // It is therefore appropriate to update loading/error state synchronously
    // here before starting the request.
    //
    const refetch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useMyJourneys.useCallback[refetch]": async ()=>{
            setIsLoading(true);
            setError(null);
            try {
                const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$journeys$2f$api$2f$my$2d$journeys$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMyJourneys"])();
                setJourneys(result);
            } catch (cause) {
                const nextError = cause instanceof Error ? cause : new Error('Failed to load your journeys.');
                setError(nextError);
            } finally{
                setIsLoading(false);
            }
        }
    }["useMyJourneys.useCallback[refetch]"], []);
    return {
        journeys,
        isLoading,
        error,
        refetch
    };
}
_s(useMyJourneys, "teHv2O9pn0plAucGo/tgKQaOP9Y=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/journeys/mappers/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// src/features/journeys/mappers/index.ts
// -----------------------------------------------------------------------------
// sisiMove — Journey Mapper Barrel
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$journeys$2f$mappers$2f$map$2d$public$2d$journey$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/journeys/mappers/map-public-journey.ts [app-client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/journeys/mappers/map-public-journey.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/features/journeys/mappers/map-public-journey.ts
// -----------------------------------------------------------------------------
// sisiMove — Public Journey Mapper
// -----------------------------------------------------------------------------
//
// Maps the backend public Journey HTTP representation into the frontend
// PublicJourney model.
//
// Architectural boundary
// ----------------------
//
// The backend public Journey endpoint returns an already-composed public
// Journey read model:
//
//   Journey
//     ├── provider
//     │     ├── traveller
//     │     └── trust
//     ├── route
//     ├── schedule
//     ├── vehicle
//     ├── capacity
//     ├── pricing
//     ├── preferences
//     └── assets
//
// Journey remains the primary domain object. Traveller and Trust do not own
// the Journey and are not reconstructed here.
//
// This mapper only translates the external HTTP representation into the
// frontend model consumed by the Journey feature.
//
// Responsibilities:
// - define the API/frontend boundary;
// - preserve the public Journey provider composition;
// - normalize API values into the frontend model;
// - prevent API response details from leaking into UI components.
//
// This mapper does NOT:
// - fetch Traveller Profile data;
// - fetch Trust data;
// - fetch Assets;
// - compose Journey Demand;
// - perform marketplace composition;
// - reconstruct a provider from separate objects;
// - apply business rules.
//
// The backend public read boundary is responsible for composing the public
// Journey response. The frontend mapper must not duplicate that composition.
//
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "mapPublicJourney",
    ()=>mapPublicJourney
]);
function mapPublicJourney(response) {
    return {
        publicId: response.publicId,
        provider: {
            traveller: response.provider.traveller,
            trust: response.provider.trust
        },
        route: response.route,
        schedule: response.schedule,
        vehicle: response.vehicle,
        capacity: response.capacity,
        pricing: response.pricing,
        preferences: response.preferences,
        assets: response.assets
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/public-marketplace/constants/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// -----------------------------------------------------------------------------
// sisiMove — Public Marketplace Constants
// -----------------------------------------------------------------------------
//
// Public export surface for marketplace constants.
//
// Consumers should import marketplace constants through:
//
//     @/features/public-marketplace/constants
//
// rather than depending on the internal constant-file layout.
//
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$public$2d$marketplace$2f$constants$2f$marketplace$2e$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/public-marketplace/constants/marketplace.constants.ts [app-client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/public-marketplace/constants/marketplace.constants.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Public Marketplace Constants
// -----------------------------------------------------------------------------
//
// Constants owned by the Public Marketplace feature.
//
// These values describe marketplace presentation/query conventions that are
// stable across the landing page, marketplace hooks, filters, sorting, and
// pagination.
//
// They are NOT business-domain constants.
//
// Journey-specific rules belong to the Journey feature.
// Journey Demand rules belong to the Journey Demand feature.
// Trust rules belong to the Trust feature.
//
// The marketplace constants only describe how those public resources are
// discovered and presented together.
//
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "DEFAULT_MARKETPLACE_PAGE_SIZE",
    ()=>DEFAULT_MARKETPLACE_PAGE_SIZE,
    "DEFAULT_MARKETPLACE_SORT",
    ()=>DEFAULT_MARKETPLACE_SORT,
    "DEFAULT_MARKETPLACE_TYPE",
    ()=>DEFAULT_MARKETPLACE_TYPE,
    "MARKETPLACE_ITEM_TYPES",
    ()=>MARKETPLACE_ITEM_TYPES,
    "MARKETPLACE_LABELS",
    ()=>MARKETPLACE_LABELS,
    "MARKETPLACE_QUERY_PARAMS",
    ()=>MARKETPLACE_QUERY_PARAMS,
    "MARKETPLACE_ROUTES",
    ()=>MARKETPLACE_ROUTES,
    "MARKETPLACE_SORT_DIRECTIONS",
    ()=>MARKETPLACE_SORT_DIRECTIONS,
    "MARKETPLACE_SORT_FIELDS",
    ()=>MARKETPLACE_SORT_FIELDS,
    "MARKETPLACE_TYPES",
    ()=>MARKETPLACE_TYPES,
    "MAX_MARKETPLACE_PAGE_SIZE",
    ()=>MAX_MARKETPLACE_PAGE_SIZE
]);
const DEFAULT_MARKETPLACE_TYPE = "ALL";
const DEFAULT_MARKETPLACE_PAGE_SIZE = 12;
const MAX_MARKETPLACE_PAGE_SIZE = 48;
const MARKETPLACE_ITEM_TYPES = [
    "JOURNEY",
    "DEMAND"
];
const MARKETPLACE_TYPES = [
    "ALL",
    "JOURNEY",
    "DEMAND"
];
const MARKETPLACE_SORT_FIELDS = [
    "RELEVANCE",
    "DATE",
    "PRICE",
    "NEWEST"
];
const MARKETPLACE_SORT_DIRECTIONS = [
    "ASC",
    "DESC"
];
const DEFAULT_MARKETPLACE_SORT = {
    field: "RELEVANCE",
    direction: "DESC"
};
const MARKETPLACE_QUERY_PARAMS = {
    TYPE: "type",
    FROM: "from",
    TO: "to",
    DATE: "date",
    MINIMUM_SEATS: "minimumSeats",
    MAXIMUM_PRICE_PER_SEAT: "maximumPricePerSeat",
    HAS_VEHICLE: "hasVehicle",
    VERIFIED_TRAVELLER_ONLY: "verifiedTravellerOnly",
    SORT: "sort",
    DIRECTION: "direction",
    LIMIT: "limit",
    CURSOR: "cursor"
};
const MARKETPLACE_LABELS = {
    ALL: "All",
    JOURNEYS: "Journeys",
    DEMANDS: "Demand",
    SHOWING: "Showing what's available",
    LOAD_MORE: "Load more",
    VIEW_JOURNEY: "View journey",
    VIEW_DEMAND: "View demand",
    BOOK: "Book",
    JOIN: "Join"
};
const MARKETPLACE_ROUTES = {
    HOME: "/",
    JOURNEY: "/journeys",
    DEMAND: "/demands"
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/public-marketplace/hooks/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// -----------------------------------------------------------------------------
// sisiMove — Public Marketplace Hooks
// -----------------------------------------------------------------------------
//
// Public hook API for the Public Marketplace feature.
//
// Consumers should import marketplace hooks through this barrel rather than
// depending on individual implementation files.
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$public$2d$marketplace$2f$hooks$2f$use$2d$public$2d$marketplace$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/public-marketplace/hooks/use-public-marketplace.ts [app-client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/public-marketplace/hooks/use-public-marketplace.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePublicMarketplace",
    ()=>usePublicMarketplace
]);
// -----------------------------------------------------------------------------
// sisiMove — Public Marketplace Hook
// -----------------------------------------------------------------------------
//
// The Public Marketplace is a frontend composition boundary over the
// independent public Journey and Journey Demand feature domains.
//
// The marketplace does not own either domain's API implementation.
//
// It composes:
//
//     usePublicJourneys()
//              +
//     useJourneyDemands()
//              ↓
//     PublicMarketplaceItem[]
//
// The marketplace is responsible for:
//
// - consuming canonical PublicMarketplaceQuery state;
// - passing route/date discovery criteria to the domain public hooks;
// - composing Journey and Demand into one discriminated marketplace stream;
// - applying marketplace-level filtering that can be derived truthfully from
//   the public read models;
// - applying only sorting semantics that can be derived from those models.
//
// -----------------------------------------------------------------------------
//
// IMPORTANT — QUERY MAPPING
// -----------------------------------------------------------------------------
//
// External query representations such as URLSearchParams must first pass
// through:
//
//     mapMarketplaceQuery()
//
// That mapper is the canonical boundary for:
//
// - type normalization;
// - date validation;
// - numeric filter parsing;
// - boolean filter parsing;
// - sort field normalization;
// - sort direction normalization.
//
// This hook therefore does NOT repeat URL/query parsing logic.
//
// -----------------------------------------------------------------------------
//
// IMPORTANT — PAGINATION
// -----------------------------------------------------------------------------
//
// The current Journey and Journey Demand collection hooks return arrays rather
// than a unified marketplace pagination envelope.
//
// Consequently this hook does not fabricate:
//
// - limit;
// - nextCursor;
// - hasMore.
//
// Those values belong to a future unified Public Marketplace read boundary.
//
// -----------------------------------------------------------------------------
//
// IMPORTANT — SORTING
// -----------------------------------------------------------------------------
//
// DATE and PRICE can be derived from the current public models.
//
// RELEVANCE cannot be reconstructed reliably on the client.
//
// NEWEST cannot be reconstructed because the current public models deliberately
// do not expose creation/publication timestamps.
//
// Those two sorts therefore preserve the underlying source order until the
// marketplace backend/read boundary supplies canonical ranking information.
//
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$journeys$2f$hooks$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/journeys/hooks/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$journeys$2f$hooks$2f$public$2d$use$2d$journeys$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/journeys/hooks/public-use-journeys.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$journey$2d$demands$2f$hooks$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/journey-demands/hooks/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$journey$2d$demands$2f$hooks$2f$use$2d$journey$2d$demands$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/journey-demands/hooks/use-journey-demands.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$public$2d$marketplace$2f$constants$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/public-marketplace/constants/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$public$2d$marketplace$2f$constants$2f$marketplace$2e$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/public-marketplace/constants/marketplace.constants.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
;
;
function usePublicMarketplace(query) {
    _s();
    // ---------------------------------------------------------------------------
    // Domain discovery query
    // ---------------------------------------------------------------------------
    const domainQuery = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "usePublicMarketplace.useMemo[domainQuery]": ()=>({
                ...query.from !== null ? {
                    from: query.from
                } : {},
                ...query.to !== null ? {
                    to: query.to
                } : {},
                ...query.date !== null ? {
                    date: query.date
                } : {}
            })
    }["usePublicMarketplace.useMemo[domainQuery]"], [
        query.from,
        query.to,
        query.date
    ]);
    // ---------------------------------------------------------------------------
    // Public Journey source
    // ---------------------------------------------------------------------------
    const journeys = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$journeys$2f$hooks$2f$public$2d$use$2d$journeys$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePublicJourneys"])(domainQuery);
    // ---------------------------------------------------------------------------
    // Public Journey Demand source
    // ---------------------------------------------------------------------------
    const demands = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$journey$2d$demands$2f$hooks$2f$use$2d$journey$2d$demands$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useJourneyDemands"])(domainQuery);
    // ---------------------------------------------------------------------------
    // Compose marketplace streams
    // ---------------------------------------------------------------------------
    const composedItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "usePublicMarketplace.useMemo[composedItems]": ()=>{
            const journeyItems = query.type === "DEMAND" ? [] : journeys.data.map({
                "usePublicMarketplace.useMemo[composedItems]": (journey)=>({
                        type: "JOURNEY",
                        journey
                    })
            }["usePublicMarketplace.useMemo[composedItems]"]);
            const demandItems = query.type === "JOURNEY" ? [] : demands.data.map({
                "usePublicMarketplace.useMemo[composedItems]": (demand)=>({
                        type: "DEMAND",
                        demand
                    })
            }["usePublicMarketplace.useMemo[composedItems]"]);
            return [
                ...journeyItems,
                ...demandItems
            ];
        }
    }["usePublicMarketplace.useMemo[composedItems]"], [
        query.type,
        journeys.data,
        demands.data
    ]);
    // ---------------------------------------------------------------------------
    // Marketplace filters
    // ---------------------------------------------------------------------------
    const filteredItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "usePublicMarketplace.useMemo[filteredItems]": ()=>applyMarketplaceFilter(composedItems, query.filter)
    }["usePublicMarketplace.useMemo[filteredItems]"], [
        composedItems,
        query.filter
    ]);
    // ---------------------------------------------------------------------------
    // Marketplace sorting
    // ---------------------------------------------------------------------------
    //
    // PublicMarketplaceQuery intentionally permits `sort: null`.
    //
    // Null means that no explicit sort was supplied by the caller. The
    // marketplace therefore resolves it to the feature's canonical default
    // rather than passing null into the sorting implementation.
    // ---------------------------------------------------------------------------
    const marketplaceSort = query.sort ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$public$2d$marketplace$2f$constants$2f$marketplace$2e$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_MARKETPLACE_SORT"];
    const sortedItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "usePublicMarketplace.useMemo[sortedItems]": ()=>applyMarketplaceSort(filteredItems, marketplaceSort)
    }["usePublicMarketplace.useMemo[sortedItems]"], [
        filteredItems,
        marketplaceSort
    ]);
    // ---------------------------------------------------------------------------
    // Loading
    // ---------------------------------------------------------------------------
    const isLoading = journeys.isLoading || demands.isLoading;
    // ---------------------------------------------------------------------------
    // Error
    // ---------------------------------------------------------------------------
    const error = journeys.error ?? demands.error ?? null;
    return {
        items: sortedItems,
        isLoading,
        error
    };
}
_s(usePublicMarketplace, "1Q+UTH7UqobjTzRV9ZRt77Zdbf0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$journeys$2f$hooks$2f$public$2d$use$2d$journeys$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePublicJourneys"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$journey$2d$demands$2f$hooks$2f$use$2d$journey$2d$demands$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useJourneyDemands"]
    ];
});
// -----------------------------------------------------------------------------
// Filtering
// -----------------------------------------------------------------------------
function applyMarketplaceFilter(items, filter) {
    if (filter === null) {
        return [
            ...items
        ];
    }
    return items.filter((item)=>{
        // -------------------------------------------------------------------------
        // Minimum seats
        // -------------------------------------------------------------------------
        if (filter.minimumSeats !== null) {
            const availableSeats = item.type === "JOURNEY" ? item.journey.capacity.availableSeats : item.demand.capacity.remainingSeats;
            if (availableSeats < filter.minimumSeats) {
                return false;
            }
        }
        // -------------------------------------------------------------------------
        // Maximum price per seat
        // -------------------------------------------------------------------------
        if (filter.maximumPricePerSeat !== null) {
            if (item.type === "JOURNEY") {
                if (item.journey.pricing.amount > filter.maximumPricePerSeat) {
                    return false;
                }
            } else {
                const maximumPrice = item.demand.pricing.maximumPricePerSeat;
                if (maximumPrice !== null && maximumPrice > filter.maximumPricePerSeat) {
                    return false;
                }
            }
        }
        // -------------------------------------------------------------------------
        // Vehicle
        // -------------------------------------------------------------------------
        if (filter.hasVehicle !== null) {
            if (item.type === "JOURNEY") {
                const hasVehicleAsset = item.journey.vehicle.asset !== null;
                if (hasVehicleAsset !== filter.hasVehicle) {
                    return false;
                }
            } else if (filter.hasVehicle) {
                return false;
            }
        }
        // -------------------------------------------------------------------------
        // Verified traveller
        // -------------------------------------------------------------------------
        if (filter.verifiedTravellerOnly) {
            const trust = item.type === "JOURNEY" ? item.journey.provider.trust : item.demand.requester.trust;
            const verified = trust.verificationLevel === "VERIFIED" || trust.verificationLevel === "HIGHLY_VERIFIED";
            if (!verified) {
                return false;
            }
        }
        return true;
    });
}
// -----------------------------------------------------------------------------
// Sorting
// -----------------------------------------------------------------------------
function applyMarketplaceSort(items, sort) {
    // ---------------------------------------------------------------------------
    // Relevance
    // ---------------------------------------------------------------------------
    //
    // Relevance is a marketplace ranking concern and cannot be reconstructed
    // reliably from the current public models.
    // ---------------------------------------------------------------------------
    if (sort.field === "RELEVANCE") {
        return [
            ...items
        ];
    }
    // ---------------------------------------------------------------------------
    // Newest
    // ---------------------------------------------------------------------------
    //
    // The current public models intentionally expose neither creation nor
    // publication timestamps.
    // ---------------------------------------------------------------------------
    if (sort.field === "NEWEST") {
        return [
            ...items
        ];
    }
    const direction = sort.direction === "ASC" ? 1 : -1;
    return [
        ...items
    ].sort((left, right)=>{
        const leftValue = getSortableValue(left, sort.field);
        const rightValue = getSortableValue(right, sort.field);
        if (leftValue === null && rightValue === null) {
            return 0;
        }
        if (leftValue === null) {
            return 1;
        }
        if (rightValue === null) {
            return -1;
        }
        return compareSortableValues(leftValue, rightValue) * direction;
    });
}
function getSortableValue(item, field) {
    switch(field){
        case "DATE":
            return getMarketplaceDate(item);
        case "PRICE":
            return getMarketplacePrice(item);
        case "RELEVANCE":
        case "NEWEST":
            return null;
    }
}
// -----------------------------------------------------------------------------
// Marketplace date
// -----------------------------------------------------------------------------
function getMarketplaceDate(item) {
    if (item.type === "JOURNEY") {
        return item.journey.schedule.departureAt;
    }
    return item.demand.schedule.earliestDeparture;
}
// -----------------------------------------------------------------------------
// Marketplace price
// -----------------------------------------------------------------------------
function getMarketplacePrice(item) {
    if (item.type === "JOURNEY") {
        return item.journey.pricing.amount;
    }
    return item.demand.pricing.maximumPricePerSeat ?? item.demand.pricing.preferredPricePerSeat;
}
// -----------------------------------------------------------------------------
// Value comparison
// -----------------------------------------------------------------------------
function compareSortableValues(left, right) {
    if (typeof left === "number" && typeof right === "number") {
        return left - right;
    }
    return String(left).localeCompare(String(right));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_1ia6t8u._.js.map