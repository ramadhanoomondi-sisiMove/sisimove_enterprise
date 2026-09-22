(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/authentication/login/login-credentials.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LoginCredentials",
    ()=>LoginCredentials,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// sisiMove — Login Credentials
// -----------------------------------------------------------------------------
//
// Presentation component for the primary login identifier.
//
// The backend login contract accepts:
//
//     emailOrPhoneNumber
//
// This field therefore deliberately allows either an email address or a phone
// number. It does not attempt to determine which one the user entered.
//
// Responsibilities:
// - Render the email/phone login identifier field.
// - Forward controlled input changes to the owning form.
// - Display field-level validation errors.
// - Communicate the disabled state.
//
// This component intentionally does NOT:
// - Validate the identifier.
// - Normalize the identifier.
// - Determine whether it is an email or phone number.
// - Call the login API.
// - Authenticate the user.
// - Manage authentication state.
// - Persist credentials.
//
// Validation is owned by:
//
//     features/authentication/login/schemas
//
// Authentication is owned by:
//
//     features/authentication/login/hooks
//
// -----------------------------------------------------------------------------
'use client';
;
function LoginCredentials({ value, onChange, error, disabled = false }) {
    const errorId = 'login-credentials-error';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                htmlFor: "login-email-or-phone",
                className: "block text-sm font-medium text-slate-900",
                children: "Email or phone number"
            }, void 0, false, {
                fileName: "[project]/src/components/authentication/login/login-credentials.tsx",
                lineNumber: 70,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                id: "login-email-or-phone",
                name: "emailOrPhoneNumber",
                type: "text",
                inputMode: "email",
                value: value,
                onChange: onChange,
                disabled: disabled,
                autoComplete: "username",
                "aria-invalid": Boolean(error),
                "aria-describedby": error ? errorId : undefined,
                placeholder: "Email or phone number",
                className: [
                    'block w-full rounded-lg border bg-white px-4 py-3 text-sm text-slate-950',
                    'outline-none transition',
                    'placeholder:text-slate-400',
                    'focus:ring-2 focus:ring-blue-500 focus:ring-offset-0',
                    'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500',
                    error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-blue-500'
                ].join(' ')
            }, void 0, false, {
                fileName: "[project]/src/components/authentication/login/login-credentials.tsx",
                lineNumber: 77,
                columnNumber: 7
            }, this),
            error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                id: errorId,
                role: "alert",
                className: "text-sm text-red-600",
                children: error
            }, void 0, false, {
                fileName: "[project]/src/components/authentication/login/login-credentials.tsx",
                lineNumber: 102,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/authentication/login/login-credentials.tsx",
        lineNumber: 69,
        columnNumber: 5
    }, this);
}
_c = LoginCredentials;
const __TURBOPACK__default__export__ = LoginCredentials;
var _c;
__turbopack_context__.k.register(_c, "LoginCredentials");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/authentication/login/login-error.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LoginError",
    ()=>LoginError,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// sisiMove — Login Error
// -----------------------------------------------------------------------------
//
// Presentation component for login failures.
//
// Responsibilities:
// - Display a safe, user-facing login error.
// - Provide an accessible error region.
//
// This component intentionally does NOT:
// - Interpret backend error codes.
// - Reveal whether an account exists.
// - Reveal authentication/device state.
// - Display raw API/transport errors.
// - Perform retry logic.
// - Reset the login form.
// - Navigate the user.
//
// The authentication API deliberately uses generic credential failures.
// Therefore the UI should provide actionable guidance without exposing
// account-enumeration information.
//
// -----------------------------------------------------------------------------
'use client';
;
function LoginError({ error, fallbackMessage = 'We could not sign you in. Check your email or phone number and password, then try again.', icon }) {
    if (!error) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        id: "login-error",
        role: "alert",
        "aria-live": "assertive",
        className: "flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700",
        children: [
            icon ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                "aria-hidden": "true",
                className: "mt-0.5 shrink-0",
                children: icon
            }, void 0, false, {
                fileName: "[project]/src/components/authentication/login/login-error.tsx",
                lineNumber: 77,
                columnNumber: 9
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "leading-5",
                children: fallbackMessage
            }, void 0, false, {
                fileName: "[project]/src/components/authentication/login/login-error.tsx",
                lineNumber: 85,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/authentication/login/login-error.tsx",
        lineNumber: 70,
        columnNumber: 5
    }, this);
}
_c = LoginError;
const __TURBOPACK__default__export__ = LoginError;
var _c;
__turbopack_context__.k.register(_c, "LoginError");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/authentication/login/login-forgot-password.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LoginForgotPassword",
    ()=>LoginForgotPassword,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// sisiMove — Login Forgot Password
// -----------------------------------------------------------------------------
//
// Presentation component for the password-recovery entry point.
//
// Responsibilities:
// - Present the "Forgot password?" action.
// - Navigate to a caller-supplied password-recovery route.
//
// This component intentionally does NOT:
// - Implement password recovery.
// - Call a recovery API.
// - Validate an identity.
// - Send an OTP.
// - Reset a password.
// - Manage authentication state.
//
// The destination is supplied by the parent because the current routing
// contract does not define a password-recovery route yet. This prevents the
// presentation layer from inventing or coupling itself to an unconfirmed URL.
//
// -----------------------------------------------------------------------------
'use client';
;
;
function LoginForgotPassword({ href, label = 'Forgot password?', disabled = false }) {
    if (disabled) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            "aria-disabled": "true",
            className: "text-sm font-medium text-slate-400",
            children: label
        }, void 0, false, {
            fileName: "[project]/src/components/authentication/login/login-forgot-password.tsx",
            lineNumber: 65,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        href: href,
        className: "text-sm font-medium text-blue-600 underline-offset-4 transition-colors hover:text-blue-700 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        children: label
    }, void 0, false, {
        fileName: "[project]/src/components/authentication/login/login-forgot-password.tsx",
        lineNumber: 75,
        columnNumber: 5
    }, this);
}
_c = LoginForgotPassword;
const __TURBOPACK__default__export__ = LoginForgotPassword;
var _c;
__turbopack_context__.k.register(_c, "LoginForgotPassword");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/authentication/login/login-form-header.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LoginFormHeader",
    ()=>LoginFormHeader,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// sisiMove — Login Form Header
// -----------------------------------------------------------------------------
//
// Presentation-only header for the authentication login form.
//
// Responsibilities:
// - Present the login eyebrow, title, and supporting description.
// - Render the sisiMove brand with its canonical colour treatment.
// - Allow the parent form to override copy when needed.
//
// Non-responsibilities:
// - No authentication logic.
// - No validation.
// - No API calls.
// - No routing.
// - No session management.
//
// The component deliberately owns no authentication state.
// -----------------------------------------------------------------------------
'use client';
;
function LoginFormHeader({ eyebrow = 'WELCOME BACK', title = 'SIGN IN TO sisiMove', description = 'Sign in to access your account and continue exploring the marketplace.' }) {
    const defaultTitle = title === 'SIGN IN TO sisiMove';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "space-y-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs font-semibold uppercase tracking-[0.18em] text-blue-600",
                children: eyebrow
            }, void 0, false, {
                fileName: "[project]/src/components/authentication/login/login-form-header.tsx",
                lineNumber: 39,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl",
                children: defaultTitle ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        "SIGN IN TO",
                        ' ',
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-slate-950",
                            children: "sisi"
                        }, void 0, false, {
                            fileName: "[project]/src/components/authentication/login/login-form-header.tsx",
                            lineNumber: 47,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-blue-600",
                            children: "Move"
                        }, void 0, false, {
                            fileName: "[project]/src/components/authentication/login/login-form-header.tsx",
                            lineNumber: 48,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/authentication/login/login-form-header.tsx",
                    lineNumber: 45,
                    columnNumber: 11
                }, this) : title
            }, void 0, false, {
                fileName: "[project]/src/components/authentication/login/login-form-header.tsx",
                lineNumber: 43,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "max-w-md text-sm leading-6 text-slate-600",
                children: description
            }, void 0, false, {
                fileName: "[project]/src/components/authentication/login/login-form-header.tsx",
                lineNumber: 55,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/authentication/login/login-form-header.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, this);
}
_c = LoginFormHeader;
const __TURBOPACK__default__export__ = LoginFormHeader;
var _c;
__turbopack_context__.k.register(_c, "LoginFormHeader");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/authentication/login/login-form.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LoginForm",
    ()=>LoginForm,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$login$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/authentication/login/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$login$2f$schemas$2f$authenticate$2d$login$2e$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/authentication/login/schemas/authenticate-login.schema.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$login$2f$hooks$2f$use$2d$authenticate$2d$login$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/authentication/login/hooks/use-authenticate-login.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$authentication$2f$login$2f$login$2d$credentials$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/authentication/login/login-credentials.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$authentication$2f$login$2f$login$2d$error$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/authentication/login/login-error.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$authentication$2f$login$2f$login$2d$form$2d$header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/authentication/login/login-form-header.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$authentication$2f$login$2f$login$2d$forgot$2d$password$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/authentication/login/login-forgot-password.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$authentication$2f$login$2f$login$2d$password$2d$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/authentication/login/login-password-field.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$authentication$2f$login$2f$login$2d$submit$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/authentication/login/login-submit.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
// -----------------------------------------------------------------------------
// sisiMove — Login Form
// -----------------------------------------------------------------------------
//
// Authentication form orchestration boundary.
//
// Responsibilities:
// - Own login form state.
// - Validate credentials with authenticateLoginSchema.
// - Present field-level validation errors.
// - Invoke useAuthenticateLogin for authentication.
// - Present authentication errors.
// - Expose successful authentication to the parent through onSuccess.
// - Present the password-recovery entry point.
//
// Non-responsibilities:
// - No direct HTTP requests.
// - No device fingerprint handling.
// - No token/session persistence.
// - No authentication-context manipulation.
// - No routing.
//
// The feature hook owns the application authentication workflow.
// This component owns only the form interaction boundary.
//
// Import boundary:
//
// - Feature dependencies are imported from the authentication feature.
// - Sibling presentation components are imported directly.
// - This component must not import from './index' because that barrel exports
//   LoginForm itself and would introduce an unnecessary circular dependency.
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
// =============================================================================
// Initial Form State
// =============================================================================
const INITIAL_FORM_VALUES = {
    emailOrPhoneNumber: '',
    password: ''
};
// =============================================================================
// Field Error Helpers
// =============================================================================
function createInitialFieldErrors() {
    return {};
}
function getFieldErrors(issues) {
    const errors = {};
    for (const issue of issues){
        const field = issue.path[0];
        if (field === 'emailOrPhoneNumber' && errors.emailOrPhoneNumber === undefined) {
            errors.emailOrPhoneNumber = issue.message;
        }
        if (field === 'password' && errors.password === undefined) {
            errors.password = issue.message;
        }
    }
    return errors;
}
function LoginForm({ forgotPasswordHref = '#', onSuccess, className }) {
    _s();
    const [values, setValues] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(INITIAL_FORM_VALUES);
    const [fieldErrors, setFieldErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(createInitialFieldErrors);
    const { login, isLoading, data, error, reset } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$login$2f$hooks$2f$use$2d$authenticate$2d$login$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthenticateLogin"])();
    // ===========================================================================
    // Credentials Change
    // ===========================================================================
    const handleCredentialsChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "LoginForm.useCallback[handleCredentialsChange]": (event)=>{
            const { value } = event.target;
            setValues({
                "LoginForm.useCallback[handleCredentialsChange]": (current)=>({
                        ...current,
                        emailOrPhoneNumber: value
                    })
            }["LoginForm.useCallback[handleCredentialsChange]"]);
            setFieldErrors({
                "LoginForm.useCallback[handleCredentialsChange]": (current)=>{
                    if (current.emailOrPhoneNumber === undefined) {
                        return current;
                    }
                    const next = {
                        ...current
                    };
                    delete next.emailOrPhoneNumber;
                    return next;
                }
            }["LoginForm.useCallback[handleCredentialsChange]"]);
            reset();
        }
    }["LoginForm.useCallback[handleCredentialsChange]"], [
        reset
    ]);
    // ===========================================================================
    // Password Change
    // ===========================================================================
    const handlePasswordChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "LoginForm.useCallback[handlePasswordChange]": (event)=>{
            const { value } = event.target;
            setValues({
                "LoginForm.useCallback[handlePasswordChange]": (current)=>({
                        ...current,
                        password: value
                    })
            }["LoginForm.useCallback[handlePasswordChange]"]);
            setFieldErrors({
                "LoginForm.useCallback[handlePasswordChange]": (current)=>{
                    if (current.password === undefined) {
                        return current;
                    }
                    const next = {
                        ...current
                    };
                    delete next.password;
                    return next;
                }
            }["LoginForm.useCallback[handlePasswordChange]"]);
            reset();
        }
    }["LoginForm.useCallback[handlePasswordChange]"], [
        reset
    ]);
    // ===========================================================================
    // Submit
    // ===========================================================================
    const handleSubmit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "LoginForm.useCallback[handleSubmit]": async (event)=>{
            event.preventDefault();
            setFieldErrors(createInitialFieldErrors());
            reset();
            const result = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$login$2f$schemas$2f$authenticate$2d$login$2e$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authenticateLoginSchema"].safeParse(values);
            if (!result.success) {
                setFieldErrors(getFieldErrors(result.error.issues));
                return;
            }
            try {
                const response = await login({
                    emailOrPhoneNumber: result.data.emailOrPhoneNumber,
                    password: result.data.password
                });
                if (onSuccess) {
                    await onSuccess(response);
                }
            } catch  {
            // ---------------------------------------------------------------------
            // Authentication errors are owned by the login hook.
            //
            // The hook normalizes the caught error and exposes it through `error`.
            // LoginError is responsible for presenting the safe user-facing
            // message.
            //
            // The form intentionally does not expose raw transport/backend
            // details.
            // ---------------------------------------------------------------------
            }
        }
    }["LoginForm.useCallback[handleSubmit]"], [
        login,
        onSuccess,
        reset,
        values
    ]);
    // ===========================================================================
    // Successful Authentication
    // ===========================================================================
    //
    // AuthenticationProvider has already received and persisted the session
    // through useAuthenticateLogin before `data` becomes available.
    //
    // The form therefore has nothing further to render after successful login.
    //
    // The parent may use `onSuccess` for navigation or another application-level
    // transition.
    // ===========================================================================
    if (data?.success === true) {
        return null;
    }
    // ===========================================================================
    // Form
    // ===========================================================================
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
        onSubmit: handleSubmit,
        noValidate: true,
        className: className ?? 'space-y-6',
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$authentication$2f$login$2f$login$2d$form$2d$header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LoginFormHeader"], {}, void 0, false, {
                fileName: "[project]/src/components/authentication/login/login-form.tsx",
                lineNumber: 312,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$authentication$2f$login$2f$login$2d$credentials$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LoginCredentials"], {
                        value: values.emailOrPhoneNumber,
                        onChange: handleCredentialsChange,
                        error: fieldErrors.emailOrPhoneNumber,
                        disabled: isLoading
                    }, void 0, false, {
                        fileName: "[project]/src/components/authentication/login/login-form.tsx",
                        lineNumber: 319,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$authentication$2f$login$2f$login$2d$password$2d$field$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LoginPasswordField"], {
                        value: values.password,
                        onChange: handlePasswordChange,
                        error: fieldErrors.password,
                        disabled: isLoading
                    }, void 0, false, {
                        fileName: "[project]/src/components/authentication/login/login-form.tsx",
                        lineNumber: 330,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-end",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$authentication$2f$login$2f$login$2d$forgot$2d$password$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LoginForgotPassword"], {
                            href: forgotPasswordHref,
                            disabled: isLoading
                        }, void 0, false, {
                            fileName: "[project]/src/components/authentication/login/login-form.tsx",
                            lineNumber: 345,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/authentication/login/login-form.tsx",
                        lineNumber: 344,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$authentication$2f$login$2f$login$2d$error$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LoginError"], {
                        error: error
                    }, void 0, false, {
                        fileName: "[project]/src/components/authentication/login/login-form.tsx",
                        lineNumber: 355,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$authentication$2f$login$2f$login$2d$submit$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LoginSubmit"], {
                        isLoading: isLoading
                    }, void 0, false, {
                        fileName: "[project]/src/components/authentication/login/login-form.tsx",
                        lineNumber: 361,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/authentication/login/login-form.tsx",
                lineNumber: 314,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/authentication/login/login-form.tsx",
        lineNumber: 307,
        columnNumber: 5
    }, this);
}
_s(LoginForm, "iEiX0tG/FzAc+JP6ufJ27Qz9HpE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$login$2f$hooks$2f$use$2d$authenticate$2d$login$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthenticateLogin"]
    ];
});
_c = LoginForm;
const __TURBOPACK__default__export__ = LoginForm;
var _c;
__turbopack_context__.k.register(_c, "LoginForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/authentication/login/login-page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LoginPage",
    ()=>LoginPage,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$routing$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/foundation/routing/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$routing$2f$authentication$2d$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/routing/authentication-routes.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$authentication$2f$login$2f$login$2d$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/authentication/login/login-form.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
// -----------------------------------------------------------------------------
// sisiMove — Login Page
// -----------------------------------------------------------------------------
//
// Page-level composition boundary for user authentication.
//
// Responsibilities:
// - Compose the public authentication layout.
// - Present the SisiMove introduction/brand context.
// - Provide navigation to registration.
// - Render the LoginForm.
// - Navigate the user to the authenticated marketplace after successful login.
//
// Non-responsibilities:
// - No form state.
// - No validation.
// - No API calls.
// - No token/session management.
// - No authentication state management.
//
// The LoginForm and authentication feature own the actual authentication
// workflow. This component owns the page-level transition that occurs after
// authentication succeeds.
//
// -----------------------------------------------------------------------------
'use client';
;
;
;
;
function LoginPage({ forgotPasswordHref }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    // ---------------------------------------------------------------------------
    // Successful Authentication
    // ---------------------------------------------------------------------------
    //
    // Authentication has already completed successfully inside LoginForm.
    // The authentication feature owns session establishment.
    //
    // The page now performs the application-level transition into the
    // authenticated marketplace.
    //
    // `replace` is intentional: after signing in, the user should not be able
    // to press Back and return to the login page as part of the authenticated
    // navigation history.
    //
    // ---------------------------------------------------------------------------
    const handleLoginSuccess = ()=>{
        router.replace('/home');
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "min-h-[calc(100vh-4rem)] bg-white",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl lg:grid-cols-[0.9fr_1.1fr]",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-16 lg:py-16",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "max-w-lg",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs font-semibold uppercase tracking-[0.18em] text-blue-600",
                                children: "WELCOME BACK"
                            }, void 0, false, {
                                fileName: "[project]/src/components/authentication/login/login-page.tsx",
                                lineNumber: 74,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl",
                                children: [
                                    "Continue your journey with",
                                    ' ',
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-slate-950",
                                        children: "sisi"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/authentication/login/login-page.tsx",
                                        lineNumber: 80,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-blue-600",
                                        children: "Move"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/authentication/login/login-page.tsx",
                                        lineNumber: 81,
                                        columnNumber: 15
                                    }, this),
                                    "."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/authentication/login/login-page.tsx",
                                lineNumber: 78,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-4 max-w-md text-base leading-7 text-slate-600",
                                children: "Sign in to explore journeys, find people travelling your way, and continue from where you left off."
                            }, void 0, false, {
                                fileName: "[project]/src/components/authentication/login/login-page.tsx",
                                lineNumber: 84,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-8 space-y-3 text-sm text-slate-600",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "Discover journeys going your way."
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/authentication/login/login-page.tsx",
                                        lineNumber: 90,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "Find travel demand for the routes you need."
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/authentication/login/login-page.tsx",
                                        lineNumber: 91,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "Share a journey when you have a seat."
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/authentication/login/login-page.tsx",
                                        lineNumber: 92,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/authentication/login/login-page.tsx",
                                lineNumber: 89,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-10 border-t border-slate-200 pt-6",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-slate-600",
                                    children: [
                                        "Don't have an account?",
                                        ' ',
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$routing$2f$authentication$2d$routes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AUTHENTICATION_ROUTES"].REGISTER,
                                            className: "font-semibold transition-colors hover:text-blue-700",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-950",
                                                    children: "Join sisi"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/authentication/login/login-page.tsx",
                                                    lineNumber: 102,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-blue-600",
                                                    children: "Move"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/authentication/login/login-page.tsx",
                                                    lineNumber: 103,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/authentication/login/login-page.tsx",
                                            lineNumber: 98,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/authentication/login/login-page.tsx",
                                    lineNumber: 96,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/authentication/login/login-page.tsx",
                                lineNumber: 95,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/authentication/login/login-page.tsx",
                        lineNumber: 73,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/authentication/login/login-page.tsx",
                    lineNumber: 72,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "flex items-center border-t border-slate-200 px-6 py-12 sm:px-10 lg:border-l lg:border-t-0 lg:px-16 lg:py-16",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full max-w-xl",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$authentication$2f$login$2f$login$2d$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LoginForm"], {
                            forgotPasswordHref: forgotPasswordHref,
                            onSuccess: handleLoginSuccess
                        }, void 0, false, {
                            fileName: "[project]/src/components/authentication/login/login-page.tsx",
                            lineNumber: 116,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/authentication/login/login-page.tsx",
                        lineNumber: 115,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/authentication/login/login-page.tsx",
                    lineNumber: 114,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/authentication/login/login-page.tsx",
            lineNumber: 67,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/authentication/login/login-page.tsx",
        lineNumber: 66,
        columnNumber: 5
    }, this);
}
_s(LoginPage, "fN7XvhJ+p5oE6+Xlo0NJmXpxjC8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = LoginPage;
const __TURBOPACK__default__export__ = LoginPage;
var _c;
__turbopack_context__.k.register(_c, "LoginPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/authentication/login/login-password-field.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LoginPasswordField",
    ()=>LoginPasswordField,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
// -----------------------------------------------------------------------------
// sisiMove — Login Password Field
// -----------------------------------------------------------------------------
//
// Presentation component for the login password field.
//
// Responsibilities:
// - Render the password input.
// - Display the field-level validation error.
// - Allow the user to show/hide the password.
// - Forward changes to the owning form.
//
// This component intentionally does NOT:
// - Validate the password.
// - Authenticate the user.
// - Call the login API.
// - Manage login state.
// - Persist credentials.
// - Reveal authentication failure details.
//
// Validation is owned by:
//
//     features/authentication/login/schemas
//
// Authentication is owned by:
//
//     features/authentication/login/hooks
//
// Password visibility is local presentation state and therefore belongs here.
//
// -----------------------------------------------------------------------------
'use client';
;
// -----------------------------------------------------------------------------
// Eye Icon
// -----------------------------------------------------------------------------
function EyeIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "1.8",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        "aria-hidden": "true",
        className: "h-5 w-5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
            }, void 0, false, {
                fileName: "[project]/src/components/authentication/login/login-password-field.tsx",
                lineNumber: 67,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "2.5"
            }, void 0, false, {
                fileName: "[project]/src/components/authentication/login/login-password-field.tsx",
                lineNumber: 68,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/authentication/login/login-password-field.tsx",
        lineNumber: 57,
        columnNumber: 5
    }, this);
}
_c = EyeIcon;
// -----------------------------------------------------------------------------
// Eye Off Icon
// -----------------------------------------------------------------------------
function EyeOffIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "1.8",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        "aria-hidden": "true",
        className: "h-5 w-5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M3 3l18 18"
            }, void 0, false, {
                fileName: "[project]/src/components/authentication/login/login-password-field.tsx",
                lineNumber: 89,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M10.6 10.6a2 2 0 0 0 2.8 2.8"
            }, void 0, false, {
                fileName: "[project]/src/components/authentication/login/login-password-field.tsx",
                lineNumber: 90,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M9.9 5.2A10.9 10.9 0 0 1 12 5c6 0 9.5 7 9.5 7a17.7 17.7 0 0 1-3.1 3.8"
            }, void 0, false, {
                fileName: "[project]/src/components/authentication/login/login-password-field.tsx",
                lineNumber: 91,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M6.6 6.6C3.9 8.4 2.5 12 2.5 12s3.5 7 9.5 7c1.7 0 3.2-.5 4.5-1.1"
            }, void 0, false, {
                fileName: "[project]/src/components/authentication/login/login-password-field.tsx",
                lineNumber: 92,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/authentication/login/login-password-field.tsx",
        lineNumber: 79,
        columnNumber: 5
    }, this);
}
_c1 = EyeOffIcon;
function LoginPasswordField({ value, onChange, error, disabled = false }) {
    _s();
    const [showPassword, setShowPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const errorId = 'login-password-error';
    const handleTogglePassword = ()=>{
        setShowPassword((current)=>!current);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                htmlFor: "login-password",
                className: "block text-sm font-medium text-slate-900",
                children: "Password"
            }, void 0, false, {
                fileName: "[project]/src/components/authentication/login/login-password-field.tsx",
                lineNumber: 117,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        id: "login-password",
                        name: "password",
                        type: showPassword ? 'text' : 'password',
                        value: value,
                        onChange: onChange,
                        disabled: disabled,
                        autoComplete: "current-password",
                        "aria-invalid": Boolean(error),
                        "aria-describedby": error ? errorId : undefined,
                        placeholder: "Your password",
                        className: [
                            'block w-full rounded-lg border bg-white px-4 py-3 pr-12 text-sm text-slate-950',
                            'outline-none transition',
                            'placeholder:text-slate-400',
                            'focus:ring-2 focus:ring-blue-500 focus:ring-offset-0',
                            'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500',
                            error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-blue-500'
                        ].join(' ')
                    }, void 0, false, {
                        fileName: "[project]/src/components/authentication/login/login-password-field.tsx",
                        lineNumber: 125,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: handleTogglePassword,
                        disabled: disabled,
                        "aria-label": showPassword ? 'Hide password' : 'Show password',
                        "aria-pressed": showPassword,
                        className: [
                            'absolute inset-y-0 right-0 flex items-center px-3',
                            'text-slate-400 transition-colors',
                            'hover:text-slate-700',
                            'focus:outline-none focus:text-blue-600',
                            'disabled:cursor-not-allowed disabled:text-slate-300'
                        ].join(' '),
                        children: showPassword ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EyeOffIcon, {}, void 0, false, {
                            fileName: "[project]/src/components/authentication/login/login-password-field.tsx",
                            lineNumber: 167,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EyeIcon, {}, void 0, false, {
                            fileName: "[project]/src/components/authentication/login/login-password-field.tsx",
                            lineNumber: 169,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/authentication/login/login-password-field.tsx",
                        lineNumber: 148,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/authentication/login/login-password-field.tsx",
                lineNumber: 124,
                columnNumber: 7
            }, this),
            error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                id: errorId,
                role: "alert",
                className: "text-sm text-red-600",
                children: error
            }, void 0, false, {
                fileName: "[project]/src/components/authentication/login/login-password-field.tsx",
                lineNumber: 175,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/authentication/login/login-password-field.tsx",
        lineNumber: 116,
        columnNumber: 5
    }, this);
}
_s(LoginPasswordField, "daguiRHWMFkqPgCh/ppD7CF5VuQ=");
_c2 = LoginPasswordField;
const __TURBOPACK__default__export__ = LoginPasswordField;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "EyeIcon");
__turbopack_context__.k.register(_c1, "EyeOffIcon");
__turbopack_context__.k.register(_c2, "LoginPasswordField");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/authentication/login/login-submit.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LoginSubmit",
    ()=>LoginSubmit,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// sisiMove — Login Submit
// -----------------------------------------------------------------------------
//
// Presentation component for the login form submission action.
//
// Responsibilities:
// - Render the login submit button.
// - Communicate the loading state to the user.
// - Prevent submission while authentication is in progress.
//
// This component intentionally does NOT:
// - Perform login.
// - Call the authentication API.
// - Validate credentials.
// - Manage authentication state.
// - Persist the authentication session.
// - Navigate after login.
//
// Those responsibilities belong to the login feature/form boundary.
//
// -----------------------------------------------------------------------------
'use client';
;
function LoginSubmit({ isLoading, disabled = false, label = 'Sign in', loadingLabel = 'Signing in...' }) {
    const isDisabled = disabled || isLoading;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "submit",
        disabled: isDisabled,
        "aria-busy": isLoading,
        className: "inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
        children: isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    "aria-hidden": "true",
                    className: "h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                }, void 0, false, {
                    fileName: "[project]/src/components/authentication/login/login-submit.tsx",
                    lineNumber: 73,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    children: loadingLabel
                }, void 0, false, {
                    fileName: "[project]/src/components/authentication/login/login-submit.tsx",
                    lineNumber: 78,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/authentication/login/login-submit.tsx",
            lineNumber: 72,
            columnNumber: 9
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            children: label
        }, void 0, false, {
            fileName: "[project]/src/components/authentication/login/login-submit.tsx",
            lineNumber: 81,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/authentication/login/login-submit.tsx",
        lineNumber: 65,
        columnNumber: 5
    }, this);
}
_c = LoginSubmit;
const __TURBOPACK__default__export__ = LoginSubmit;
var _c;
__turbopack_context__.k.register(_c, "LoginSubmit");
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
]);

//# sourceMappingURL=src_1u3v9p0._.js.map