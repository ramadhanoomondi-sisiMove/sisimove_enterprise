(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/(authenticated)/profile/error.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProfileRouteError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$error$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/error-state.tsx [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// sisiMove — Profile Route Error Boundary
// -----------------------------------------------------------------------------
//
// Route-level error boundary for the authenticated profile page.
//
// Responsibilities:
// - Catch render/runtime errors within the /profile route.
// - Present the shared design-system ErrorState.
// - Allow the user to retry the failed route render.
// - Remain independent of profile-domain fetching and business logic.
//
// Non-responsibilities:
// - Fetch profile data.
// - Interpret domain errors.
// - Perform authentication.
// - Navigate to another profile/account route.
// - Expose internal error details to the user.
//
// Next.js requires this component to be a Client Component because the
// route-level error boundary receives the `reset` recovery function.
//
// -----------------------------------------------------------------------------
'use client';
;
;
function ProfileRouteError({ reset }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "mx-auto flex min-h-[60vh] w-full max-w-5xl items-center px-4 py-8 sm:px-6 lg:px-8",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$error$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ErrorState"], {
            title: "We could not load your profile",
            description: "Something went wrong while loading your profile. Please try again.",
            retryAction: {
                label: 'Try again',
                onClick: reset
            }
        }, void 0, false, {
            fileName: "[project]/src/app/(authenticated)/profile/error.tsx",
            lineNumber: 61,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/(authenticated)/profile/error.tsx",
        lineNumber: 60,
        columnNumber: 5
    }, this);
}
_c = ProfileRouteError;
var _c;
__turbopack_context__.k.register(_c, "ProfileRouteError");
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
]);

//# sourceMappingURL=src_11wjh6l._.js.map