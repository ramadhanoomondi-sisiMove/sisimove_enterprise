(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/assets/asset-upload-dialog.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AssetUploadDialog",
    ()=>AssetUploadDialog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/ui/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$assets$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/assets/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$assets$2f$hooks$2f$use$2d$asset$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/assets/hooks/use-asset.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
// -----------------------------------------------------------------------------
// sisiMove — Asset Upload Dialog
// -----------------------------------------------------------------------------
//
// Reusable dialog for uploading an Asset.
//
// Responsibilities:
// - Select a physical file
// - Validate basic file constraints
// - Upload through the Asset capability
// - Present upload/loading/error states
// - Return the created Asset to the consuming workflow
// - Await completion of the consuming workflow before closing
//
// The component intentionally contains no business/domain meaning.
// Verification, Profile, Vehicle, Journey, and other features decide what the
// uploaded Asset means after receiving it through onUploaded().
//
// -----------------------------------------------------------------------------
'use client';
;
;
;
// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------
const DEFAULT_MAX_SIZE_BYTES = 10 * 1024 * 1024;
const DEFAULT_ACCEPT = 'image/*,application/pdf';
// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------
function formatFileSize(sizeBytes) {
    if (sizeBytes < 1024) {
        return `${sizeBytes} B`;
    }
    if (sizeBytes < 1024 * 1024) {
        return `${(sizeBytes / 1024).toFixed(1)} KB`;
    }
    if (sizeBytes < 1024 * 1024 * 1024) {
        return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    return `${(sizeBytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}
function getFileValidationError(file, maxSizeBytes) {
    if (file.size === 0) {
        return 'The selected file is empty.';
    }
    if (file.size > maxSizeBytes) {
        return `The selected file is too large. Maximum size is ${formatFileSize(maxSizeBytes)}.`;
    }
    return null;
}
function toUploadError(error) {
    if (error instanceof Error && error.message) {
        return error.message;
    }
    return 'The file could not be uploaded. Please try again.';
}
function AssetUploadDialog({ open, onOpenChange, category, type, title = 'Upload file', description = 'Choose a file to upload.', accept = DEFAULT_ACCEPT, maxSizeBytes = DEFAULT_MAX_SIZE_BYTES, onUploaded }) {
    _s();
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const { upload, clearError } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$assets$2f$hooks$2f$use$2d$asset$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAsset"])();
    const [selectedFile, setSelectedFile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [validationError, setValidationError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [uploadError, setUploadError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isUploading, setIsUploading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // ---------------------------------------------------------------------------
    // Reset
    // ---------------------------------------------------------------------------
    function resetState() {
        setSelectedFile(null);
        setValidationError(null);
        setUploadError(null);
        setIsUploading(false);
        clearError();
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }
    // ---------------------------------------------------------------------------
    // Dialog state
    // ---------------------------------------------------------------------------
    function handleOpenChange(nextOpen) {
        if (!nextOpen) {
            resetState();
        }
        onOpenChange(nextOpen);
    }
    // ---------------------------------------------------------------------------
    // File selection
    // ---------------------------------------------------------------------------
    function handleFileChange(event) {
        const file = event.target.files?.[0] ?? null;
        setUploadError(null);
        clearError();
        if (!file) {
            setSelectedFile(null);
            setValidationError(null);
            return;
        }
        const error = getFileValidationError(file, maxSizeBytes);
        if (error) {
            setSelectedFile(null);
            setValidationError(error);
            return;
        }
        setSelectedFile(file);
        setValidationError(null);
    }
    // ---------------------------------------------------------------------------
    // Upload
    // ---------------------------------------------------------------------------
    async function handleUpload() {
        if (!selectedFile || isUploading) {
            return;
        }
        const error = getFileValidationError(selectedFile, maxSizeBytes);
        if (error) {
            setValidationError(error);
            return;
        }
        setValidationError(null);
        setUploadError(null);
        clearError();
        setIsUploading(true);
        try {
            const asset = await upload({
                file: selectedFile,
                type,
                category
            });
            // -----------------------------------------------------------------------
            // Important:
            //
            // The Asset now exists, but the consuming feature may still need to
            // associate it with its business object.
            //
            // For example:
            //
            // Asset
            //   │
            //   └── TravellerProfile avatar association
            //
            // Awaiting onUploaded() means the dialog remains open and loading until
            // the complete consuming workflow succeeds.
            // -----------------------------------------------------------------------
            await onUploaded(asset);
            handleOpenChange(false);
        } catch (error) {
            setUploadError(toUploadError(error));
            setIsUploading(false);
        }
    }
    // ---------------------------------------------------------------------------
    // Remove selection
    // ---------------------------------------------------------------------------
    function handleRemoveSelection() {
        if (isUploading) {
            return;
        }
        setSelectedFile(null);
        setValidationError(null);
        setUploadError(null);
        clearError();
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }
    // ---------------------------------------------------------------------------
    // Render
    // ---------------------------------------------------------------------------
    const error = validationError ?? uploadError;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
        open: open,
        onOpenChange: handleOpenChange,
        title: title,
        description: description,
        size: "md",
        footer: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    variant: "ghost",
                    onClick: ()=>handleOpenChange(false),
                    disabled: isUploading,
                    children: "Cancel"
                }, void 0, false, {
                    fileName: "[project]/src/components/assets/asset-upload-dialog.tsx",
                    lineNumber: 331,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    variant: "primary",
                    loading: isUploading,
                    disabled: !selectedFile || Boolean(validationError),
                    onClick: handleUpload,
                    children: "Upload"
                }, void 0, false, {
                    fileName: "[project]/src/components/assets/asset-upload-dialog.tsx",
                    lineNumber: 339,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/assets/asset-upload-dialog.tsx",
            lineNumber: 330,
            columnNumber: 9
        }, this),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col gap-5",
            children: [
                !selectedFile && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                    className: [
                        'flex',
                        'min-h-40',
                        'cursor-pointer',
                        'flex-col',
                        'items-center',
                        'justify-center',
                        'gap-2',
                        'rounded-[var(--radius-lg)]',
                        'border-2',
                        'border-dashed',
                        'border-[var(--border-strong)]',
                        'bg-[var(--background-subtle)]',
                        'px-6',
                        'py-8',
                        'text-center',
                        'transition-colors',
                        'duration-150',
                        'ease-out',
                        'hover:border-[var(--brand)]',
                        'hover:bg-[var(--brand-soft)]'
                    ].join(' '),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: [
                                'flex',
                                'h-10',
                                'w-10',
                                'items-center',
                                'justify-center',
                                'rounded-[var(--radius-full)]',
                                'bg-[var(--brand-soft)]',
                                'text-[var(--brand)]'
                            ].join(' '),
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                viewBox: "0 0 20 20",
                                fill: "none",
                                stroke: "currentColor",
                                strokeWidth: "1.75",
                                className: "h-5 w-5",
                                "aria-hidden": "true",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M10 13V4m0 0L6.5 7.5M10 4l3.5 3.5",
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/assets/asset-upload-dialog.tsx",
                                        lineNumber: 400,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M4.5 11.5v3A1.5 1.5 0 0 0 6 16h8a1.5 1.5 0 0 0 1.5-1.5v-3",
                                        strokeLinecap: "round"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/assets/asset-upload-dialog.tsx",
                                        lineNumber: 406,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/assets/asset-upload-dialog.tsx",
                                lineNumber: 392,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/assets/asset-upload-dialog.tsx",
                            lineNumber: 380,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-sm font-medium text-[var(--foreground)]",
                            children: "Choose a file"
                        }, void 0, false, {
                            fileName: "[project]/src/components/assets/asset-upload-dialog.tsx",
                            lineNumber: 413,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-xs text-[var(--foreground-muted)]",
                            children: [
                                "Maximum size: ",
                                formatFileSize(maxSizeBytes)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/assets/asset-upload-dialog.tsx",
                            lineNumber: 417,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            ref: fileInputRef,
                            type: "file",
                            accept: accept,
                            onChange: handleFileChange,
                            className: "sr-only",
                            "aria-label": "Choose file"
                        }, void 0, false, {
                            fileName: "[project]/src/components/assets/asset-upload-dialog.tsx",
                            lineNumber: 421,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/assets/asset-upload-dialog.tsx",
                    lineNumber: 356,
                    columnNumber: 11
                }, this),
                selectedFile && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: [
                        'rounded-[var(--radius-lg)]',
                        'border',
                        'border-[var(--border)]',
                        'bg-[var(--background-subtle)]',
                        'p-4'
                    ].join(' '),
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: [
                                    'flex',
                                    'h-10',
                                    'w-10',
                                    'shrink-0',
                                    'items-center',
                                    'justify-center',
                                    'rounded-[var(--radius-md)]',
                                    'bg-[var(--brand-soft)]',
                                    'text-[var(--brand)]'
                                ].join(' '),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    viewBox: "0 0 20 20",
                                    fill: "none",
                                    stroke: "currentColor",
                                    strokeWidth: "1.75",
                                    className: "h-5 w-5",
                                    "aria-hidden": "true",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M5.5 3.5h6l3 3V16a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5V3.5Z",
                                            strokeLinejoin: "round"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/assets/asset-upload-dialog.tsx",
                                            lineNumber: 468,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M11.5 3.5V7h3",
                                            strokeLinejoin: "round"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/assets/asset-upload-dialog.tsx",
                                            lineNumber: 473,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/assets/asset-upload-dialog.tsx",
                                    lineNumber: 460,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/assets/asset-upload-dialog.tsx",
                                lineNumber: 447,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "min-w-0 flex-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "truncate text-sm font-medium text-[var(--foreground)]",
                                        children: selectedFile.name
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/assets/asset-upload-dialog.tsx",
                                        lineNumber: 481,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-1 text-xs text-[var(--foreground-muted)]",
                                        children: formatFileSize(selectedFile.size)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/assets/asset-upload-dialog.tsx",
                                        lineNumber: 485,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/assets/asset-upload-dialog.tsx",
                                lineNumber: 480,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "ghost",
                                size: "sm",
                                onClick: handleRemoveSelection,
                                disabled: isUploading,
                                children: "Remove"
                            }, void 0, false, {
                                fileName: "[project]/src/components/assets/asset-upload-dialog.tsx",
                                lineNumber: 490,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/assets/asset-upload-dialog.tsx",
                        lineNumber: 446,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/assets/asset-upload-dialog.tsx",
                    lineNumber: 437,
                    columnNumber: 11
                }, this),
                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    role: "alert",
                    className: [
                        'rounded-[var(--radius-md)]',
                        'border',
                        'border-[var(--danger)]',
                        'bg-[var(--danger-soft)]',
                        'px-3',
                        'py-2.5',
                        'text-sm',
                        'text-[var(--danger)]'
                    ].join(' '),
                    children: error
                }, void 0, false, {
                    fileName: "[project]/src/components/assets/asset-upload-dialog.tsx",
                    lineNumber: 507,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/assets/asset-upload-dialog.tsx",
            lineNumber: 350,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/assets/asset-upload-dialog.tsx",
        lineNumber: 323,
        columnNumber: 5
    }, this);
}
_s(AssetUploadDialog, "Tu6qj4HJQc9UA7nVZdahugSIbNM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$assets$2f$hooks$2f$use$2d$asset$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAsset"]
    ];
});
_c = AssetUploadDialog;
var _c;
__turbopack_context__.k.register(_c, "AssetUploadDialog");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/profile/about/about-section.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AboutSection",
    ()=>AboutSection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// sisiMove — About Section
// -----------------------------------------------------------------------------
//
// Authenticated profile section for basic Traveller Profile information.
//
// Responsibilities:
// - Receive the already-resolved authenticated Traveller Profile.
// - Present the current handle, biography, and country.
// - Own the profile-details update workflow.
// - Expose mutation feedback at the section boundary.
// - Delegate field rendering to ProfileDetailsForm.
//
// Non-responsibilities:
// - Fetching the current Traveller Profile.
// - Direct HTTP requests.
// - Authentication/token handling.
// - Profile/domain validation.
// - Profile visibility.
// - Travel preferences.
// - Verification.
// - Travel corridors.
// - Navigation.
//
// Data ownership:
//
//     ProfilePageContainer
//         │
//         └── useCurrentTravellerProfile()
//                 └── TravellerProfile
//                         │
//                         ▼
//                    AboutSection
//                         │
//                         └── useUpdateTravellerProfile()
//                                 └── update(profile.publicId, input)
//
// Architectural reason:
//
// The authenticated profile page has one authoritative TravellerProfile read.
// AboutSection must not independently call useCurrentTravellerProfile(), because
// ProfilePageContainer already owns that read for the profile composition.
//
// This prevents:
// - duplicate profile requests;
// - multiple profile read states;
// - competing sources of truth;
// - unnecessary network traffic;
// - stale values between ProfileHeader and AboutSection.
//
// The section still owns its mutation workflow because updating profile details
// is an interaction specific to this section.
//
// -----------------------------------------------------------------------------
//
// Field mapping:
//
//     TravellerProfile.handle
//         → ProfileDetailsForm.handle
//
//     TravellerProfile.bio
//         → ProfileDetailsForm.bio
//
//     TravellerProfile.countryCode
//         → ProfileDetailsForm.country
//
//     ProfileDetailsForm.country
//         → UpdateTravellerProfileInput.countryCode
//
// The form intentionally uses `country` as a human-facing field name while
// the API write contract uses the domain-specific `countryCode` name.
//
// -----------------------------------------------------------------------------
//
// Visual language:
// - Compact mobile-first profile section.
// - sisiMove blue accent for section identity.
// - Mutation feedback remains close to the form.
// - Saving state is informational and non-alarming.
// - Errors use the profile's semantic danger treatment.
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// Traveller Profile feature
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/traveller-profile/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$hooks$2f$use$2d$update$2d$traveller$2d$profile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/traveller-profile/hooks/use-update-traveller-profile.ts [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// Presentation
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$about$2f$profile$2d$details$2d$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/profile/about/profile-details-form.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function AboutSection({ profile }) {
    _s();
    const { update, isUpdating, error: updateError } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$hooks$2f$use$2d$update$2d$traveller$2d$profile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUpdateTravellerProfile"])();
    // ---------------------------------------------------------------------------
    // Save
    // ---------------------------------------------------------------------------
    //
    // The form emits presentation-oriented values.
    //
    // The feature mutation expects the domain/API field `countryCode`.
    //
    // That translation belongs here at the feature/presentation boundary.
    //
    const handleSave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AboutSection.useCallback[handleSave]": async (values)=>{
            await update(profile.publicId, {
                handle: values.handle,
                bio: values.bio,
                countryCode: values.country
            });
        }
    }["AboutSection.useCallback[handleSave]"], [
        profile.publicId,
        update
    ]);
    // ---------------------------------------------------------------------------
    // Render
    // ---------------------------------------------------------------------------
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "space-y-5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                "aria-hidden": "true",
                                className: "h-2 w-2 shrink-0 rounded-full bg-[var(--brand)]"
                            }, void 0, false, {
                                fileName: "[project]/src/components/profile/about/about-section.tsx",
                                lineNumber: 181,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-xs font-semibold uppercase tracking-[0.12em] text-[var(--foreground-secondary)]",
                                children: "About You"
                            }, void 0, false, {
                                fileName: "[project]/src/components/profile/about/about-section.tsx",
                                lineNumber: 186,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/profile/about/about-section.tsx",
                        lineNumber: 180,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1.5 max-w-2xl text-sm leading-5 text-[var(--foreground-muted)]",
                        children: "Keep your traveller profile information up to date."
                    }, void 0, false, {
                        fileName: "[project]/src/components/profile/about/about-section.tsx",
                        lineNumber: 191,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/profile/about/about-section.tsx",
                lineNumber: 179,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$about$2f$profile$2d$details$2d$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ProfileDetailsForm"], {
                initialValues: {
                    handle: profile.handle,
                    bio: profile.bio ?? '',
                    country: profile.countryCode
                },
                onSave: handleSave
            }, void 0, false, {
                fileName: "[project]/src/components/profile/about/about-section.tsx",
                lineNumber: 199,
                columnNumber: 7
            }, this),
            isUpdating ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--background-subtle)] px-3.5 py-3",
                role: "status",
                "aria-live": "polite",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        "aria-hidden": "true",
                        className: "h-2 w-2 shrink-0 animate-pulse rounded-full bg-[var(--brand)]"
                    }, void 0, false, {
                        fileName: "[project]/src/components/profile/about/about-section.tsx",
                        lineNumber: 218,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-[var(--foreground-secondary)]",
                        children: "Saving your profile…"
                    }, void 0, false, {
                        fileName: "[project]/src/components/profile/about/about-section.tsx",
                        lineNumber: 223,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/profile/about/about-section.tsx",
                lineNumber: 213,
                columnNumber: 9
            }, this) : null,
            updateError !== null ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-[var(--radius-lg)] border border-[var(--danger-border)] bg-[var(--danger-soft)] px-3.5 py-3",
                role: "alert",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm font-medium text-[var(--danger)]",
                        children: "We couldn’t save your profile."
                    }, void 0, false, {
                        fileName: "[project]/src/components/profile/about/about-section.tsx",
                        lineNumber: 234,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1 text-sm leading-5 text-[var(--danger)]",
                        children: updateError.message
                    }, void 0, false, {
                        fileName: "[project]/src/components/profile/about/about-section.tsx",
                        lineNumber: 238,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/profile/about/about-section.tsx",
                lineNumber: 230,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/profile/about/about-section.tsx",
        lineNumber: 175,
        columnNumber: 5
    }, this);
}
_s(AboutSection, "DD1y5snt3iSG6ZIrj1S/VH7K4Qg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$hooks$2f$use$2d$update$2d$traveller$2d$profile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUpdateTravellerProfile"]
    ];
});
_c = AboutSection;
var _c;
__turbopack_context__.k.register(_c, "AboutSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/profile/about/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// -----------------------------------------------------------------------------
// sisiMove — Profile About Components
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$about$2f$about$2d$section$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/profile/about/about-section.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$about$2f$profile$2d$details$2d$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/profile/about/profile-details-form.tsx [app-client] (ecmascript)");
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/profile/about/profile-details-form.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProfileDetailsForm",
    ()=>ProfileDetailsForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
// -----------------------------------------------------------------------------
// sisiMove — Profile Details Form
// -----------------------------------------------------------------------------
//
// Authenticated profile form for editing basic traveller profile information.
//
// Responsibilities:
// - Present editable profile details.
// - Maintain local draft form state.
// - Submit the draft through the parent callback.
//
// Non-responsibilities:
// - Fetching profile data.
// - Persisting profile changes.
// - Validating domain rules.
// - Performing API requests.
//
// The parent/profile workflow owns persistence and supplies the initial values.
//
// Architectural note:
// - The form owns only temporary UI draft state.
// - `initialValues` are presentation inputs supplied by the parent.
// - Trimming is presentation-level input normalization immediately before
//   submission; domain validation remains the responsibility of the parent
//   workflow/backend.
// - No API client, mutation hook, or domain command is introduced here.
//
// Visual language:
// - Compact mobile-first profile surface.
// - Clear field hierarchy and restrained borders.
// - sisiMove blue focus treatment.
// - Primary save action uses the shared brand language.
// -----------------------------------------------------------------------------
'use client';
;
function ProfileDetailsForm({ initialValues, onSave }) {
    _s();
    const [handle, setHandle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialValues.handle);
    const [bio, setBio] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialValues.bio);
    const [country, setCountry] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialValues.country);
    function handleSubmit(event) {
        event.preventDefault();
        onSave?.({
            handle: handle.trim(),
            bio: bio.trim(),
            country: country.trim()
        });
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
        onSubmit: handleSubmit,
        className: "overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-5 p-4 sm:p-5",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            htmlFor: "profile-handle",
                            className: "block text-sm font-medium text-[var(--foreground)]",
                            children: "Handle"
                        }, void 0, false, {
                            fileName: "[project]/src/components/profile/about/profile-details-form.tsx",
                            lineNumber: 78,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            id: "profile-handle",
                            name: "handle",
                            type: "text",
                            value: handle,
                            onChange: (event)=>setHandle(event.target.value),
                            autoComplete: "username",
                            className: "w-full rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--foreground)] outline-none transition-shadow placeholder:text-[var(--foreground-subtle)] focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20"
                        }, void 0, false, {
                            fileName: "[project]/src/components/profile/about/profile-details-form.tsx",
                            lineNumber: 85,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/profile/about/profile-details-form.tsx",
                    lineNumber: 77,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            htmlFor: "profile-bio",
                            className: "block text-sm font-medium text-[var(--foreground)]",
                            children: "Bio"
                        }, void 0, false, {
                            fileName: "[project]/src/components/profile/about/profile-details-form.tsx",
                            lineNumber: 100,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                            id: "profile-bio",
                            name: "bio",
                            value: bio,
                            onChange: (event)=>setBio(event.target.value),
                            rows: 4,
                            className: "w-full resize-y rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[var(--surface)] px-3.5 py-2.5 text-sm leading-5 text-[var(--foreground)] outline-none transition-shadow placeholder:text-[var(--foreground-subtle)] focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20"
                        }, void 0, false, {
                            fileName: "[project]/src/components/profile/about/profile-details-form.tsx",
                            lineNumber: 107,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/profile/about/profile-details-form.tsx",
                    lineNumber: 99,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            htmlFor: "profile-country",
                            className: "block text-sm font-medium text-[var(--foreground)]",
                            children: "Country"
                        }, void 0, false, {
                            fileName: "[project]/src/components/profile/about/profile-details-form.tsx",
                            lineNumber: 121,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            id: "profile-country",
                            name: "country",
                            type: "text",
                            value: country,
                            onChange: (event)=>setCountry(event.target.value),
                            autoComplete: "country-name",
                            className: "w-full rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--foreground)] outline-none transition-shadow placeholder:text-[var(--foreground-subtle)] focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20"
                        }, void 0, false, {
                            fileName: "[project]/src/components/profile/about/profile-details-form.tsx",
                            lineNumber: 128,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/profile/about/profile-details-form.tsx",
                    lineNumber: 120,
                    columnNumber: 9
                }, this),
                onSave !== undefined ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col gap-2 border-t border-[var(--border-subtle)] pt-4 sm:flex-row sm:justify-end",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "submit",
                        className: "inline-flex min-h-10 w-full items-center justify-center rounded-[var(--radius-md)] bg-[var(--brand)] px-4 py-2.5 text-sm font-medium text-[var(--brand-foreground)] transition-colors hover:bg-[var(--brand-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)] sm:w-auto",
                        children: "Save profile"
                    }, void 0, false, {
                        fileName: "[project]/src/components/profile/about/profile-details-form.tsx",
                        lineNumber: 146,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/profile/about/profile-details-form.tsx",
                    lineNumber: 145,
                    columnNumber: 11
                }, this) : null
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/profile/about/profile-details-form.tsx",
            lineNumber: 73,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/profile/about/profile-details-form.tsx",
        lineNumber: 69,
        columnNumber: 5
    }, this);
}
_s(ProfileDetailsForm, "NSllScpNAZ0tWwfw227YkMCjRlc=");
_c = ProfileDetailsForm;
var _c;
__turbopack_context__.k.register(_c, "ProfileDetailsForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/profile/account/account-section.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AccountSection",
    ()=>AccountSection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$account$2f$account$2d$summary$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/profile/account/account-summary.tsx [app-client] (ecmascript)");
'use client';
;
;
function AccountSection({ email, phoneNumber, status, onSettings }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "space-y-5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-start justify-between gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        "aria-hidden": "true",
                                        className: "h-2 w-2 shrink-0 rounded-full bg-[var(--brand)]"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/profile/account/account-section.tsx",
                                        lineNumber: 58,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-xs font-semibold uppercase tracking-[0.12em] text-[var(--foreground-secondary)]",
                                        children: "Account"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/profile/account/account-section.tsx",
                                        lineNumber: 63,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/profile/account/account-section.tsx",
                                lineNumber: 57,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1.5 max-w-2xl text-sm leading-5 text-[var(--foreground-muted)]",
                                children: "Your account contact information and account status."
                            }, void 0, false, {
                                fileName: "[project]/src/components/profile/account/account-section.tsx",
                                lineNumber: 68,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/profile/account/account-section.tsx",
                        lineNumber: 56,
                        columnNumber: 9
                    }, this),
                    onSettings !== undefined ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: onSettings,
                        className: "shrink-0 rounded-[var(--radius-md)] px-2 py-1 text-sm font-medium text-[var(--brand)] transition-colors hover:bg-[var(--brand-soft)] hover:text-[var(--brand-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]",
                        children: "Settings"
                    }, void 0, false, {
                        fileName: "[project]/src/components/profile/account/account-section.tsx",
                        lineNumber: 79,
                        columnNumber: 11
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/profile/account/account-section.tsx",
                lineNumber: 55,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$account$2f$account$2d$summary$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AccountSummary"], {
                email: email,
                phoneNumber: phoneNumber,
                status: status
            }, void 0, false, {
                fileName: "[project]/src/components/profile/account/account-section.tsx",
                lineNumber: 92,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/profile/account/account-section.tsx",
        lineNumber: 51,
        columnNumber: 5
    }, this);
}
_c = AccountSection;
var _c;
__turbopack_context__.k.register(_c, "AccountSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/profile/account/account-summary.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Account Summary
// -----------------------------------------------------------------------------
//
// Presentation-only summary of the authenticated traveller's account.
//
// Responsibilities:
// - Display account contact/status information.
// - Keep sensitive account details visually concise.
//
// Non-responsibilities:
// - Fetching account data.
// - Editing contact information.
// - Managing sessions, security, or account settings.
//
// Architectural note:
// - Account values are supplied by the parent/account boundary.
// - This component does not interpret, validate, or mutate account state.
// - Account status is displayed exactly as supplied.
//
// Visual language:
// - Compact profile surface.
// - Clear label/value hierarchy.
// - Subtle separators between account attributes.
// - Status receives restrained semantic emphasis.
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "AccountSummary",
    ()=>AccountSummary
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function AccountSummary({ email, phoneNumber, status }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "px-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col gap-1.5 border-b border-[var(--border-subtle)] py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-sm font-medium text-[var(--foreground)]",
                            children: "Email"
                        }, void 0, false, {
                            fileName: "[project]/src/components/profile/account/account-summary.tsx",
                            lineNumber: 48,
                            columnNumber: 12
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "min-w-0 truncate text-sm text-[var(--foreground-muted)] sm:max-w-[65%] sm:text-right",
                            children: email
                        }, void 0, false, {
                            fileName: "[project]/src/components/profile/account/account-summary.tsx",
                            lineNumber: 52,
                            columnNumber: 12
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/profile/account/account-summary.tsx",
                    lineNumber: 47,
                    columnNumber: 10
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col gap-1.5 border-b border-[var(--border-subtle)] py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-sm font-medium text-[var(--foreground)]",
                            children: "Phone"
                        }, void 0, false, {
                            fileName: "[project]/src/components/profile/account/account-summary.tsx",
                            lineNumber: 61,
                            columnNumber: 12
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "min-w-0 truncate text-sm text-[var(--foreground-muted)] sm:max-w-[65%] sm:text-right",
                            children: phoneNumber
                        }, void 0, false, {
                            fileName: "[project]/src/components/profile/account/account-summary.tsx",
                            lineNumber: 65,
                            columnNumber: 12
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/profile/account/account-summary.tsx",
                    lineNumber: 60,
                    columnNumber: 10
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-sm font-medium text-[var(--foreground)]",
                            children: "Account status"
                        }, void 0, false, {
                            fileName: "[project]/src/components/profile/account/account-summary.tsx",
                            lineNumber: 74,
                            columnNumber: 12
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "inline-flex w-fit items-center rounded-full border border-[var(--border)] bg-[var(--background-subtle)] px-2.5 py-1 text-xs font-medium leading-none text-[var(--foreground-secondary)] sm:ml-auto",
                            children: status
                        }, void 0, false, {
                            fileName: "[project]/src/components/profile/account/account-summary.tsx",
                            lineNumber: 78,
                            columnNumber: 12
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/profile/account/account-summary.tsx",
                    lineNumber: 73,
                    columnNumber: 10
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/profile/account/account-summary.tsx",
            lineNumber: 43,
            columnNumber: 8
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/profile/account/account-summary.tsx",
        lineNumber: 42,
        columnNumber: 6
    }, this);
}
_c = AccountSummary;
var _c;
__turbopack_context__.k.register(_c, "AccountSummary");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/profile/account/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// -----------------------------------------------------------------------------
// sisiMove — Account Components
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$account$2f$account$2d$section$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/profile/account/account-section.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$account$2f$account$2d$summary$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/profile/account/account-summary.tsx [app-client] (ecmascript)");
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/profile/activity/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// -----------------------------------------------------------------------------
// sisiMove — Travel Activity Components
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$activity$2f$travel$2d$activity$2d$section$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/profile/activity/travel-activity-section.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$activity$2f$travel$2d$activity$2d$stat$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/profile/activity/travel-activity-stat.tsx [app-client] (ecmascript)");
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/profile/activity/travel-activity-section.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TravelActivitySection",
    ()=>TravelActivitySection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$activity$2f$travel$2d$activity$2d$stat$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/profile/activity/travel-activity-stat.tsx [app-client] (ecmascript)");
'use client';
;
;
function TravelActivitySection({ totalJourneys, completedJourneys, providerJourneys, passengerJourneys, completedProviderJourneys, completedPassengerJourneys }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "space-y-5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                "aria-hidden": "true",
                                className: "h-2 w-2 shrink-0 rounded-full bg-[var(--brand)]"
                            }, void 0, false, {
                                fileName: "[project]/src/components/profile/activity/travel-activity-section.tsx",
                                lineNumber: 63,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-xs font-semibold uppercase tracking-[0.12em] text-[var(--foreground-secondary)]",
                                children: "Travel Activity"
                            }, void 0, false, {
                                fileName: "[project]/src/components/profile/activity/travel-activity-section.tsx",
                                lineNumber: 68,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/profile/activity/travel-activity-section.tsx",
                        lineNumber: 62,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1.5 max-w-2xl text-sm leading-5 text-[var(--foreground-muted)]",
                        children: "Your journey history across sisiMove."
                    }, void 0, false, {
                        fileName: "[project]/src/components/profile/activity/travel-activity-section.tsx",
                        lineNumber: 73,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/profile/activity/travel-activity-section.tsx",
                lineNumber: 61,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-2.5 text-xs font-medium text-[var(--foreground-muted)]",
                        children: "Overview"
                    }, void 0, false, {
                        fileName: "[project]/src/components/profile/activity/travel-activity-section.tsx",
                        lineNumber: 82,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 gap-2.5 sm:grid-cols-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$activity$2f$travel$2d$activity$2d$stat$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TravelActivityStat"], {
                                label: "Total journeys",
                                value: totalJourneys,
                                description: "Journeys associated with your profile"
                            }, void 0, false, {
                                fileName: "[project]/src/components/profile/activity/travel-activity-section.tsx",
                                lineNumber: 87,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$activity$2f$travel$2d$activity$2d$stat$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TravelActivityStat"], {
                                label: "Completed journeys",
                                value: completedJourneys,
                                description: "Journeys completed on sisiMove"
                            }, void 0, false, {
                                fileName: "[project]/src/components/profile/activity/travel-activity-section.tsx",
                                lineNumber: 93,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/profile/activity/travel-activity-section.tsx",
                        lineNumber: 86,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/profile/activity/travel-activity-section.tsx",
                lineNumber: 81,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-2.5 text-xs font-medium text-[var(--foreground-muted)]",
                        children: "Journey roles"
                    }, void 0, false, {
                        fileName: "[project]/src/components/profile/activity/travel-activity-section.tsx",
                        lineNumber: 105,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 gap-2.5 sm:grid-cols-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$activity$2f$travel$2d$activity$2d$stat$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TravelActivityStat"], {
                                label: "Provider journeys",
                                value: providerJourneys,
                                description: "Journeys where you provided the travel"
                            }, void 0, false, {
                                fileName: "[project]/src/components/profile/activity/travel-activity-section.tsx",
                                lineNumber: 110,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$activity$2f$travel$2d$activity$2d$stat$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TravelActivityStat"], {
                                label: "Passenger journeys",
                                value: passengerJourneys,
                                description: "Journeys where you travelled as a passenger"
                            }, void 0, false, {
                                fileName: "[project]/src/components/profile/activity/travel-activity-section.tsx",
                                lineNumber: 116,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/profile/activity/travel-activity-section.tsx",
                        lineNumber: 109,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/profile/activity/travel-activity-section.tsx",
                lineNumber: 104,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-2.5 text-xs font-medium text-[var(--foreground-muted)]",
                        children: "Completed by role"
                    }, void 0, false, {
                        fileName: "[project]/src/components/profile/activity/travel-activity-section.tsx",
                        lineNumber: 128,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 gap-2.5 sm:grid-cols-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$activity$2f$travel$2d$activity$2d$stat$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TravelActivityStat"], {
                                label: "Completed provider journeys",
                                value: completedProviderJourneys
                            }, void 0, false, {
                                fileName: "[project]/src/components/profile/activity/travel-activity-section.tsx",
                                lineNumber: 133,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$activity$2f$travel$2d$activity$2d$stat$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TravelActivityStat"], {
                                label: "Completed passenger journeys",
                                value: completedPassengerJourneys
                            }, void 0, false, {
                                fileName: "[project]/src/components/profile/activity/travel-activity-section.tsx",
                                lineNumber: 138,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/profile/activity/travel-activity-section.tsx",
                        lineNumber: 132,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/profile/activity/travel-activity-section.tsx",
                lineNumber: 127,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/profile/activity/travel-activity-section.tsx",
        lineNumber: 57,
        columnNumber: 5
    }, this);
}
_c = TravelActivitySection;
var _c;
__turbopack_context__.k.register(_c, "TravelActivitySection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/profile/activity/travel-activity-stat.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Travel Activity Stat
// -----------------------------------------------------------------------------
//
// Presentation-only statistic used by the authenticated profile's
// Travel Activity section.
//
// Responsibilities:
// - Display one travel activity metric.
// - Keep formatting consistent across the profile.
// - Remain independent of API/data-fetching concerns.
//
// Non-responsibilities:
// - Fetching activity data.
// - Calculating activity statistics.
// - Mutating travel history.
//
// Architectural note:
// - `value` is already the authoritative activity metric supplied by the
//   parent/feature model.
// - `toLocaleString()` is presentation formatting only; this component does
//   not calculate or interpret the underlying statistic.
//
// Visual language:
// - Compact metric panel.
// - Subtle background and border.
// - Clear value hierarchy.
// - Consistent spacing with TrustStatistics and other profile metrics.
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "TravelActivityStat",
    ()=>TravelActivityStat
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function TravelActivityStat({ label, value, description }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--background-subtle)] px-4 py-3.5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-xs font-medium text-[var(--foreground-muted)]",
                children: label
            }, void 0, false, {
                fileName: "[project]/src/components/profile/activity/travel-activity-stat.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-1.5 text-2xl font-semibold tracking-tight text-[var(--foreground)]",
                children: value.toLocaleString()
            }, void 0, false, {
                fileName: "[project]/src/components/profile/activity/travel-activity-stat.tsx",
                lineNumber: 50,
                columnNumber: 7
            }, this),
            description !== undefined ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-1 text-xs leading-5 text-[var(--foreground-muted)]",
                children: description
            }, void 0, false, {
                fileName: "[project]/src/components/profile/activity/travel-activity-stat.tsx",
                lineNumber: 55,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/profile/activity/travel-activity-stat.tsx",
        lineNumber: 45,
        columnNumber: 5
    }, this);
}
_c = TravelActivityStat;
var _c;
__turbopack_context__.k.register(_c, "TravelActivityStat");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/profile/corridors/corridor-item.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Corridor Item
// -----------------------------------------------------------------------------
//
// Presentation-only representation of one frequently travelled corridor.
//
// A corridor is a reusable Traveller Profile preference/reference such as:
//
//     Nairobi → Mombasa
//     Nairobi → Kisumu
//
// Responsibilities:
// - Display one Traveller Profile corridor.
// - Display its human-readable origin and destination names.
// - Clearly identify whether the corridor is primary.
//
// Non-responsibilities:
// - Fetching corridor data.
// - Creating or editing corridors.
// - Determining corridor frequency.
// - Resolving Journey relationships.
// - Interpreting corridorKey.
// - Using geographic coordinates for presentation.
//
// Architectural note:
// - TravellerProfileCorridor is accepted directly as the component contract.
// - originName, destinationName, and isPrimary are already the appropriate
//   presentation values supplied by the Traveller Profile feature.
// - Coordinates and corridorKey remain part of the model for discovery,
//   matching, and management workflows but are intentionally unused here.
//
// Visual language:
// - Compact mobile-first route presentation.
// - Subtle inner surface rather than a heavy card treatment.
// - Clear origin → destination hierarchy.
// - sisiMove blue accent identifies the primary corridor.
// - No geographic interpretation or route-specific business logic.
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "CorridorItem",
    ()=>CorridorItem
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function CorridorItem({ corridor }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--background-subtle)] px-4 py-3.5",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-w-0 items-start gap-3",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    "aria-hidden": "true",
                    className: "mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--brand)]"
                }, void 0, false, {
                    fileName: "[project]/src/components/profile/corridors/corridor-item.tsx",
                    lineNumber: 60,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "min-w-0 flex-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex min-w-0 items-center gap-2 text-sm font-medium text-[var(--foreground)]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "min-w-0 truncate",
                                    children: corridor.originName
                                }, void 0, false, {
                                    fileName: "[project]/src/components/profile/corridors/corridor-item.tsx",
                                    lineNumber: 67,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    "aria-hidden": "true",
                                    className: "shrink-0 text-[var(--foreground-subtle)]",
                                    children: "→"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/profile/corridors/corridor-item.tsx",
                                    lineNumber: 71,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "min-w-0 truncate",
                                    children: corridor.destinationName
                                }, void 0, false, {
                                    fileName: "[project]/src/components/profile/corridors/corridor-item.tsx",
                                    lineNumber: 78,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/profile/corridors/corridor-item.tsx",
                            lineNumber: 66,
                            columnNumber: 11
                        }, this),
                        corridor.isPrimary ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-1.5",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "inline-flex items-center rounded-full border border-[var(--brand)] bg-[var(--brand-soft)] px-2 py-0.5 text-[11px] font-medium leading-4 text-[var(--brand)]",
                                children: "Primary corridor"
                            }, void 0, false, {
                                fileName: "[project]/src/components/profile/corridors/corridor-item.tsx",
                                lineNumber: 85,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/profile/corridors/corridor-item.tsx",
                            lineNumber: 84,
                            columnNumber: 13
                        }, this) : null
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/profile/corridors/corridor-item.tsx",
                    lineNumber: 65,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/profile/corridors/corridor-item.tsx",
            lineNumber: 53,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/profile/corridors/corridor-item.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
}
_c = CorridorItem;
var _c;
__turbopack_context__.k.register(_c, "CorridorItem");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/profile/corridors/corridor-list.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Corridor List
// -----------------------------------------------------------------------------
//
// Presentation-only list of the traveller's frequent travel corridors.
//
// Responsibilities:
// - Render corridor items.
// - Preserve the order supplied by the parent.
//
// Non-responsibilities:
// - Fetching corridors.
// - Sorting or ranking corridors.
// - Creating, editing, or deleting corridors.
// - Translating corridor data into another presentation model.
//
// Architectural note:
// - TravellerProfileCorridor is the authoritative frontend representation of
//   a Traveller Profile corridor.
// - This component intentionally consumes that feature model directly rather
//   than introducing a duplicate local Corridor interface.
//
// Visual language:
// - Compact mobile-first list.
// - Consistent spacing with other profile sections.
// - Empty state uses a restrained dashed surface.
// - No ranking, sorting, or corridor interpretation is performed here.
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "CorridorList",
    ()=>CorridorList
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$corridors$2f$corridor$2d$item$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/profile/corridors/corridor-item.tsx [app-client] (ecmascript)");
;
;
function CorridorList({ corridors }) {
    if (corridors.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-[var(--radius-lg)] border border-dashed border-[var(--border-strong)] bg-[var(--background-subtle)] px-4 py-5 text-center sm:px-5",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm font-medium text-[var(--foreground-secondary)]",
                    children: "No travel corridors yet"
                }, void 0, false, {
                    fileName: "[project]/src/components/profile/corridors/corridor-list.tsx",
                    lineNumber: 46,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "mt-1 text-xs leading-5 text-[var(--foreground-muted)]",
                    children: "Add your frequently travelled routes to make your profile more informative to other travellers."
                }, void 0, false, {
                    fileName: "[project]/src/components/profile/corridors/corridor-list.tsx",
                    lineNumber: 50,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/profile/corridors/corridor-list.tsx",
            lineNumber: 45,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-2.5",
        "aria-label": "Travel corridors",
        children: corridors.map((corridor)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$corridors$2f$corridor$2d$item$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CorridorItem"], {
                corridor: corridor
            }, corridor.publicId, false, {
                fileName: "[project]/src/components/profile/corridors/corridor-list.tsx",
                lineNumber: 64,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/src/components/profile/corridors/corridor-list.tsx",
        lineNumber: 59,
        columnNumber: 5
    }, this);
}
_c = CorridorList;
var _c;
__turbopack_context__.k.register(_c, "CorridorList");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/profile/corridors/corridors-section.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CorridorsSection",
    ()=>CorridorsSection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$corridors$2f$corridor$2d$list$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/profile/corridors/corridor-list.tsx [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// sisiMove — Frequent Travel Corridors Section
// -----------------------------------------------------------------------------
//
// Authenticated profile section displaying the traveller's frequently used
// travel corridors.
//
// Responsibilities:
// - Present the traveller's corridor list.
// - Provide the presentation-level Manage action.
// - Delegate list rendering to CorridorList.
//
// Non-responsibilities:
// - Fetching corridor data.
// - Creating or editing corridors.
// - Persisting corridor changes.
// - Determining which corridors are frequent.
//
// Architectural note:
// - TravellerProfileCorridor is the authoritative frontend model for a
//   Traveller Profile corridor.
// - This section does not introduce or transform that model into a duplicate
//   presentation type.
// - Corridor management remains a separate workflow from profile display.
// -----------------------------------------------------------------------------
'use client';
;
;
function CorridorsSection({ corridors, onManage }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-start justify-between gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-sm font-semibold uppercase tracking-wide",
                                children: "Frequent Travel Corridors"
                            }, void 0, false, {
                                fileName: "[project]/src/components/profile/corridors/corridors-section.tsx",
                                lineNumber: 48,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-sm text-muted-foreground",
                                children: "Routes you travel regularly."
                            }, void 0, false, {
                                fileName: "[project]/src/components/profile/corridors/corridors-section.tsx",
                                lineNumber: 52,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/profile/corridors/corridors-section.tsx",
                        lineNumber: 47,
                        columnNumber: 9
                    }, this),
                    onManage !== undefined ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: onManage,
                        className: "shrink-0 text-sm font-medium text-foreground underline-offset-4 hover:underline",
                        children: "Manage"
                    }, void 0, false, {
                        fileName: "[project]/src/components/profile/corridors/corridors-section.tsx",
                        lineNumber: 58,
                        columnNumber: 11
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/profile/corridors/corridors-section.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$corridors$2f$corridor$2d$list$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CorridorList"], {
                corridors: corridors
            }, void 0, false, {
                fileName: "[project]/src/components/profile/corridors/corridors-section.tsx",
                lineNumber: 68,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/profile/corridors/corridors-section.tsx",
        lineNumber: 45,
        columnNumber: 5
    }, this);
}
_c = CorridorsSection;
var _c;
__turbopack_context__.k.register(_c, "CorridorsSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/profile/corridors/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// -----------------------------------------------------------------------------
// sisiMove — Profile Corridors Barrel
// -----------------------------------------------------------------------------
//
// Public exports for the authenticated profile corridor presentation
// components.
//
// Architecture:
//
//     Profile
//        │
//        ▼
//     CorridorsSection
//        │
//        ▼
//     CorridorList
//        │
//        ▼
//     CorridorItem
//
// Data ownership:
//
//     Traveller Profile feature
//              │
//              ▼
//     TravellerProfileCorridor
//              │
//              ▼
//     Presentation components
//
// IMPORTANT:
// - TravellerProfileCorridor is owned by the Traveller Profile feature.
// - This barrel must not define or re-export an obsolete local `Corridor`
//   presentation model.
// - Corridor components consume TravellerProfileCorridor directly.
// - No API, fetching, mutation, or domain logic belongs here.
//
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$corridors$2f$corridors$2d$section$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/profile/corridors/corridors-section.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$corridors$2f$corridor$2d$list$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/profile/corridors/corridor-list.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$corridors$2f$corridor$2d$item$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/profile/corridors/corridor-item.tsx [app-client] (ecmascript)");
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/profile/header/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// -----------------------------------------------------------------------------
// sisiMove — Profile Header Components
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$header$2f$profile$2d$header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/profile/header/profile-header.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$header$2f$profile$2d$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/profile/header/profile-avatar.tsx [app-client] (ecmascript)");
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/profile/header/profile-avatar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Profile Avatar
// -----------------------------------------------------------------------------
//
// Profile-specific avatar presentation for the authenticated traveller profile.
//
// Responsibilities:
// - Adapt profile identity data to the shared Avatar primitive.
// - Provide profile-specific fallback information.
// - Keep profile presentation independent from image-fetching concerns.
//
// Non-responsibilities:
// - Fetching profile data.
// - Uploading/changing profile photos.
// - Resolving asset URLs.
// - Managing avatar state.
//
// Architecture:
// - This component is a profile-specific presentation adapter.
// - The shared Avatar primitive owns image rendering, sizing, shape, and
//   fallback behavior.
// - ProfileAvatar does not introduce profile-specific image state.
// - The profile feature supplies already-resolved `src`, `alt`, and fallback
//   values.
//
// Visual language:
// - Delegates sizing, shape, image treatment, and fallback styling entirely
//   to the shared Avatar primitive.
// - Supports the large `2xl` identity size used by primary profile headers.
// - Allows profile compositions to provide local layout classes through
//   `className` without coupling this adapter to a specific profile layout.
//
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "ProfileAvatar",
    ()=>ProfileAvatar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/avatar.tsx [app-client] (ecmascript)");
;
;
function ProfileAvatar({ src, alt = '', fallback, size = 'xl', className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Avatar"], {
        src: src,
        alt: alt,
        fallback: fallback,
        size: size,
        className: className
    }, void 0, false, {
        fileName: "[project]/src/components/profile/header/profile-avatar.tsx",
        lineNumber: 93,
        columnNumber: 5
    }, this);
}
_c = ProfileAvatar;
var _c;
__turbopack_context__.k.register(_c, "ProfileAvatar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/profile/header/profile-header.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProfileHeader",
    ()=>ProfileHeader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$header$2f$profile$2d$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/profile/header/profile-avatar.tsx [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// sisiMove — Profile Header
// -----------------------------------------------------------------------------
//
// Authenticated profile identity header.
//
// Responsibilities:
// - Display the traveller avatar.
// - Display the public handle beneath the avatar.
// - Display the traveller's country.
// - Display account/profile status.
// - Display the optional profile visibility description.
// - Provide the presentation-level avatar photo action.
//
// Non-responsibilities:
// - Fetching traveller data.
// - Uploading profile photos.
// - Persisting profile changes.
// - Determining verification or account status.
//
// The parent/profile workflow owns those concerns.
//
// Visual language:
// - Compact mobile-first identity layout.
// - Large avatar establishes a strong primary identity anchor.
// - Camera action sits outside the avatar edge rather than covering the photo.
// - Public handle sits directly beneath the avatar.
// - Active status uses the semantic success treatment.
// - Supporting identity information remains secondary and restrained.
// - White surface with subtle border and restrained shadow.
//
// Architectural boundary:
//
// ProfileHeader
//     │
//     ├── ProfileAvatar
//     │
//     └── traveller identity presentation
//
// The component receives already-resolved display values from its parent.
// It does not fetch profile data, resolve asset URLs, or determine status.
//
// -----------------------------------------------------------------------------
'use client';
;
;
// -----------------------------------------------------------------------------
// Icons
// -----------------------------------------------------------------------------
function CameraIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        "aria-hidden": "true",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "1.8",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className: "size-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M14.5 4.5h-5L8 7H5.5A2.5 2.5 0 0 0 3 9.5v8A2.5 2.5 0 0 0 5.5 20h13a2.5 2.5 0 0 0 2.5-2.5v-8A2.5 2.5 0 0 0 18.5 7H16l-1.5-2.5Z"
            }, void 0, false, {
                fileName: "[project]/src/components/profile/header/profile-header.tsx",
                lineNumber: 82,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "13.5",
                r: "3.25"
            }, void 0, false, {
                fileName: "[project]/src/components/profile/header/profile-header.tsx",
                lineNumber: 83,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/profile/header/profile-header.tsx",
        lineNumber: 72,
        columnNumber: 5
    }, this);
}
_c = CameraIcon;
function ProfileHeader({ handle, country, status, avatarUrl, avatarAlt = '', avatarFallback, visibilityDescription, onChangePhoto }) {
    const isActive = status.trim().toUpperCase() === 'ACTIVE';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-4 sm:p-5",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex shrink-0 flex-col items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$header$2f$profile$2d$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ProfileAvatar"], {
                                        src: avatarUrl,
                                        alt: avatarAlt,
                                        fallback: avatarFallback ?? handle,
                                        size: "2xl"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/profile/header/profile-header.tsx",
                                        lineNumber: 121,
                                        columnNumber: 15
                                    }, this),
                                    onChangePhoto !== undefined ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: onChangePhoto,
                                        "aria-label": "Change profile photo",
                                        title: "Change profile photo",
                                        className: "\r\n\n                    absolute\r\n\n                    -bottom-2\r\n\n                    -right-2\r\n\n                    inline-flex\r\n\n                    size-9\r\n\n                    items-center\r\n\n                    justify-center\r\n\n                    rounded-full\r\n\n                    border\r\n\n                    border-[var(--border)]\r\n\n                    bg-[var(--surface)]\r\n\n                    text-[var(--foreground-secondary)]\r\n\n                    shadow-[var(--shadow-md)]\r\n\n                    transition-colors\r\n\n                    hover:border-[var(--brand)]\r\n\n                    hover:bg-[var(--brand-soft)]\r\n\n                    hover:text-[var(--brand)]\r\n\n                    focus-visible:outline-none\r\n\n                    focus-visible:ring-2\r\n\n                    focus-visible:ring-[var(--brand)]\r\n\n                    focus-visible:ring-offset-2\r\n\n                    focus-visible:ring-offset-[var(--surface)]\r\n\n                  ",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CameraIcon, {}, void 0, false, {
                                            fileName: "[project]/src/components/profile/header/profile-header.tsx",
                                            lineNumber: 159,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/profile/header/profile-header.tsx",
                                        lineNumber: 129,
                                        columnNumber: 17
                                    }, this) : null
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/profile/header/profile-header.tsx",
                                lineNumber: 120,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-3 flex max-w-full items-center gap-1.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        "aria-hidden": "true",
                                        className: [
                                            'size-2 shrink-0 rounded-full',
                                            isActive ? 'bg-[var(--success)]' : 'bg-[var(--foreground-subtle)]'
                                        ].join(' ')
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/profile/header/profile-header.tsx",
                                        lineNumber: 172,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "max-w-[16rem] truncate text-base font-semibold tracking-tight text-[var(--foreground)] sm:text-lg",
                                        children: [
                                            "@",
                                            handle
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/profile/header/profile-header.tsx",
                                        lineNumber: 182,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/profile/header/profile-header.tsx",
                                lineNumber: 171,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/profile/header/profile-header.tsx",
                        lineNumber: 112,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-0 flex-1 text-center sm:text-left",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap items-center justify-center gap-2 sm:justify-start",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: [
                                        'inline-flex items-center gap-1.5',
                                        'rounded-full border px-2.5 py-1',
                                        'text-xs font-medium leading-none whitespace-nowrap',
                                        isActive ? 'border-[var(--success-border)] bg-[var(--success-soft)] text-[var(--success)]' : 'border-[var(--border)] bg-[var(--background-subtle)] text-[var(--foreground-secondary)]'
                                    ].join(' '),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            "aria-hidden": "true",
                                            className: [
                                                'size-1.5 shrink-0 rounded-full',
                                                isActive ? 'bg-[var(--success)]' : 'bg-[var(--foreground-subtle)]'
                                            ].join(' ')
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/profile/header/profile-header.tsx",
                                            lineNumber: 208,
                                            columnNumber: 17
                                        }, this),
                                        status
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/profile/header/profile-header.tsx",
                                    lineNumber: 198,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/profile/header/profile-header.tsx",
                                lineNumber: 193,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1.5 text-sm text-[var(--foreground-muted)]",
                                children: country
                            }, void 0, false, {
                                fileName: "[project]/src/components/profile/header/profile-header.tsx",
                                lineNumber: 226,
                                columnNumber: 13
                            }, this),
                            visibilityDescription !== undefined ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mx-auto mt-2.5 max-w-2xl text-sm leading-5 text-[var(--foreground-muted)] sm:mx-0",
                                children: visibilityDescription
                            }, void 0, false, {
                                fileName: "[project]/src/components/profile/header/profile-header.tsx",
                                lineNumber: 235,
                                columnNumber: 15
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/profile/header/profile-header.tsx",
                        lineNumber: 192,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/profile/header/profile-header.tsx",
                lineNumber: 107,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/profile/header/profile-header.tsx",
            lineNumber: 106,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/profile/header/profile-header.tsx",
        lineNumber: 105,
        columnNumber: 5
    }, this);
}
_c1 = ProfileHeader;
var _c, _c1;
__turbopack_context__.k.register(_c, "CameraIcon");
__turbopack_context__.k.register(_c1, "ProfileHeader");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/profile/preferences/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// -----------------------------------------------------------------------------
// sisiMove — Travel Preference Components
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$preferences$2f$travel$2d$preferences$2d$section$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/profile/preferences/travel-preferences-section.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$preferences$2f$preference$2d$row$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/profile/preferences/preference-row.tsx [app-client] (ecmascript)");
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/profile/preferences/preference-row.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Travel Preference Row
// -----------------------------------------------------------------------------
//
// Presentation-only row used by the authenticated profile's
// Travel Preferences section.
//
// Responsibilities:
// - Display one preference label and its current value.
// - Keep preference presentation consistent.
//
// Non-responsibilities:
// - Fetching preferences.
// - Editing or persisting preferences.
// - Interpreting domain-specific preference values.
//
// Visual language:
// - Compact profile-settings row.
// - Clear label/value hierarchy.
// - Value presented as a subtle semantic pill.
// - Responsive layout for narrow mobile screens.
// - Uses sisiMove design tokens instead of generic shadcn colors.
//
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "PreferenceRow",
    ()=>PreferenceRow
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function PreferenceRow({ label, value, description }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: [
            'flex flex-col gap-2',
            'border-b border-[var(--border-subtle)]',
            'py-4 last:border-b-0',
            'sm:flex-row sm:items-center sm:justify-between sm:gap-6'
        ].join(' '),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-w-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-sm font-medium text-[var(--foreground)]",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/src/components/profile/preferences/preference-row.tsx",
                        lineNumber: 61,
                        columnNumber: 9
                    }, this),
                    description !== undefined ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1 text-xs leading-5 text-[var(--foreground-muted)]",
                        children: description
                    }, void 0, false, {
                        fileName: "[project]/src/components/profile/preferences/preference-row.tsx",
                        lineNumber: 66,
                        columnNumber: 11
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/profile/preferences/preference-row.tsx",
                lineNumber: 60,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "shrink-0 sm:text-right",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: [
                        'inline-flex max-w-full items-center',
                        'rounded-[var(--radius-full)]',
                        'border border-[var(--border)]',
                        'bg-[var(--background-subtle)]',
                        'px-2.5 py-1',
                        'text-xs font-medium',
                        'text-[var(--foreground-secondary)]'
                    ].join(' '),
                    children: value
                }, void 0, false, {
                    fileName: "[project]/src/components/profile/preferences/preference-row.tsx",
                    lineNumber: 77,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/profile/preferences/preference-row.tsx",
                lineNumber: 76,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/profile/preferences/preference-row.tsx",
        lineNumber: 48,
        columnNumber: 5
    }, this);
}
_c = PreferenceRow;
var _c;
__turbopack_context__.k.register(_c, "PreferenceRow");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/profile/preferences/travel-preferences-section.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TravelPreferencesSection",
    ()=>TravelPreferencesSection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$preferences$2f$preference$2d$row$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/profile/preferences/preference-row.tsx [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// sisiMove — Travel Preferences Section
// -----------------------------------------------------------------------------
//
// Authenticated profile section displaying the traveller's travel preferences.
//
// Responsibilities:
// - Present the configured Traveller Profile preferences.
// - Provide the presentation-level Edit action.
// - Delegate individual preference rendering to PreferenceRow.
//
// Non-responsibilities:
// - Fetching preferences.
// - Editing preferences.
// - Persisting preference changes.
// - Applying preferences to Journey matching.
//
// Architectural note:
// - TravellerProfilePreferences is the authoritative frontend model.
// - Preferences have their own API lifecycle and therefore remain a dedicated
//   feature model rather than being flattened into TravellerProfile.
// - The management workflow owns the publicId/profileId required for mutations.
//
// Visual language:
// - Compact authenticated-profile section.
// - sisiMove blue accent for section identity.
// - Edit remains a lightweight secondary action.
// - Preference rows provide the detailed presentation.
// - Empty state uses the same surface language as the rest of the profile.
//
// -----------------------------------------------------------------------------
'use client';
;
;
// -----------------------------------------------------------------------------
// Presentation Helpers
// -----------------------------------------------------------------------------
function getBooleanValue(value) {
    return value ? 'Enabled' : 'Disabled';
}
function TravelPreferencesSection({ preferences, onEdit }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "space-y-5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        "aria-hidden": "true",
                                        className: "size-2 shrink-0 rounded-full bg-[var(--brand)]"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/profile/preferences/travel-preferences-section.tsx",
                                        lineNumber: 75,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-sm font-semibold uppercase tracking-[0.08em] text-[var(--foreground)]",
                                        children: "Travel Preferences"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/profile/preferences/travel-preferences-section.tsx",
                                        lineNumber: 80,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/profile/preferences/travel-preferences-section.tsx",
                                lineNumber: 74,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1.5 max-w-2xl text-sm leading-6 text-[var(--foreground-muted)]",
                                children: "Choose how you prefer to travel and how your profile information may be shared on sisiMove."
                            }, void 0, false, {
                                fileName: "[project]/src/components/profile/preferences/travel-preferences-section.tsx",
                                lineNumber: 85,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/profile/preferences/travel-preferences-section.tsx",
                        lineNumber: 73,
                        columnNumber: 9
                    }, this),
                    onEdit !== undefined ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: onEdit,
                        className: [
                            'self-start shrink-0 rounded-[var(--radius-md)]',
                            'px-2.5 py-1.5',
                            'text-sm font-medium',
                            'text-[var(--brand)]',
                            'transition-colors',
                            'hover:bg-[var(--brand-soft)]',
                            'hover:text-[var(--brand-hover)]',
                            'focus-visible:outline-none',
                            'focus-visible:ring-2',
                            'focus-visible:ring-[var(--brand)]',
                            'focus-visible:ring-offset-2'
                        ].join(' '),
                        children: "Edit preferences"
                    }, void 0, false, {
                        fileName: "[project]/src/components/profile/preferences/travel-preferences-section.tsx",
                        lineNumber: 92,
                        columnNumber: 11
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/profile/preferences/travel-preferences-section.tsx",
                lineNumber: 72,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: [
                    'overflow-hidden rounded-[var(--radius-2xl)]',
                    'border border-[var(--border)]',
                    'bg-[var(--surface)]',
                    'px-4',
                    'shadow-[var(--shadow-sm)]'
                ].join(' '),
                children: preferences === null ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "px-1 py-6 sm:px-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm font-medium text-[var(--foreground)]",
                            children: "No travel preferences set"
                        }, void 0, false, {
                            fileName: "[project]/src/components/profile/preferences/travel-preferences-section.tsx",
                            lineNumber: 129,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-1 text-sm leading-6 text-[var(--foreground-muted)]",
                            children: "Set your preferences to control how your profile information is presented and how other travellers may interact with you."
                        }, void 0, false, {
                            fileName: "[project]/src/components/profile/preferences/travel-preferences-section.tsx",
                            lineNumber: 133,
                            columnNumber: 13
                        }, this),
                        onEdit !== undefined ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: onEdit,
                            className: [
                                'mt-4 inline-flex items-center rounded-[var(--radius-md)]',
                                'bg-[var(--brand)] px-3 py-2',
                                'text-sm font-medium text-[var(--brand-foreground)]',
                                'transition-colors',
                                'hover:bg-[var(--brand-hover)]',
                                'focus-visible:outline-none',
                                'focus-visible:ring-2',
                                'focus-visible:ring-[var(--brand)]',
                                'focus-visible:ring-offset-2'
                            ].join(' '),
                            children: "Set preferences"
                        }, void 0, false, {
                            fileName: "[project]/src/components/profile/preferences/travel-preferences-section.tsx",
                            lineNumber: 139,
                            columnNumber: 15
                        }, this) : null
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/profile/preferences/travel-preferences-section.tsx",
                    lineNumber: 128,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$preferences$2f$preference$2d$row$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PreferenceRow"], {
                            label: "Journey history",
                            value: getBooleanValue(preferences.showJourneyHistory),
                            description: "Whether your journey history may be displayed on your traveller profile."
                        }, void 0, false, {
                            fileName: "[project]/src/components/profile/preferences/travel-preferences-section.tsx",
                            lineNumber: 160,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$preferences$2f$preference$2d$row$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PreferenceRow"], {
                            label: "Journey statistics",
                            value: getBooleanValue(preferences.showJourneyStatistics),
                            description: "Whether your journey statistics may be displayed on your traveller profile."
                        }, void 0, false, {
                            fileName: "[project]/src/components/profile/preferences/travel-preferences-section.tsx",
                            lineNumber: 166,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$preferences$2f$preference$2d$row$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PreferenceRow"], {
                            label: "Journey invites",
                            value: getBooleanValue(preferences.allowJourneyInvites),
                            description: "Whether you may receive journey invitations from other travellers."
                        }, void 0, false, {
                            fileName: "[project]/src/components/profile/preferences/travel-preferences-section.tsx",
                            lineNumber: 172,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/profile/preferences/travel-preferences-section.tsx",
                    lineNumber: 159,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/profile/preferences/travel-preferences-section.tsx",
                lineNumber: 118,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/profile/preferences/travel-preferences-section.tsx",
        lineNumber: 67,
        columnNumber: 5
    }, this);
}
_c = TravelPreferencesSection;
var _c;
__turbopack_context__.k.register(_c, "TravelPreferencesSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/profile/profile-page-container.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProfilePageContainer",
    ()=>ProfilePageContainer,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// Next.js
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// UI
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$container$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/container.tsx [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// Profile Presentation
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$profile$2d$page$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/profile/profile-page.tsx [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// Traveller Profile
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$hooks$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/traveller-profile/hooks/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$hooks$2f$use$2d$current$2d$traveller$2d$profile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/traveller-profile/hooks/use-current-traveller-profile.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$hooks$2f$use$2d$traveller$2d$profile$2d$avatar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/traveller-profile/hooks/use-traveller-profile-avatar.ts [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// Verification
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$verification$2f$hooks$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/verification/hooks/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$verification$2f$hooks$2f$use$2d$verification$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/verification/hooks/use-verification.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$verification$2f$hooks$2f$use$2d$verification$2d$requests$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/verification/hooks/use-verification-requests.ts [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// Assets
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$assets$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/assets/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$assets$2f$hooks$2f$use$2d$public$2d$asset$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/assets/hooks/use-public-asset.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$assets$2f$asset$2d$upload$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/assets/asset-upload-dialog.tsx [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// Identity
// -----------------------------------------------------------------------------
//
// IMPORTANT:
//
// Identity is NOT owned by Authentication.
//
// Authentication owns:
// - authentication state;
// - login;
// - logout;
// - authenticated session;
// - authentication storage.
//
// Identity owns:
// - Identity profile;
// - account contact information;
// - account lifecycle state;
// - authenticated self Identity query.
//
// Therefore the authenticated Identity query belongs to:
//
//     @/features/identity
//
// and ultimately calls:
//
//     GET /identities/me
//
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$identity$2f$hooks$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/identity/hooks/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$identity$2f$hooks$2f$use$2d$current$2d$identity$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/identity/hooks/use-current-identity.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
// -----------------------------------------------------------------------------
// sisiMove — Profile Page Container
// -----------------------------------------------------------------------------
//
// Authenticated traveller profile data composition boundary.
//
// Responsibilities:
// - Resolve the authenticated TravellerProfile.
// - Resolve the authenticated Verification aggregate.
// - Resolve verification request state.
// - Project verification request state into VerificationRequirement[].
// - Resolve the public avatar asset referenced by TravellerProfile.
// - Resolve authenticated Identity/account data required by AccountSection.
// - Compose presentation-level navigation callbacks.
// - Orchestrate the profile-photo upload workflow.
// - Associate an uploaded Asset with the TravellerProfile as its avatar.
// - Refresh TravellerProfile state after a successful avatar change.
// - Pass the complete composition into ProfilePage.
//
// Non-responsibilities:
// - Rendering profile sections.
// - Owning profile presentation.
// - Implementing profile business rules.
// - Implementing verification policy.
// - Performing Trust queries.
// - Performing Trust persistence.
// - Calculating Traveller Profile statistics.
// - Implementing account persistence.
// - Performing HTTP requests directly.
// - Uploading physical files directly.
// - Resolving public Asset URLs directly.
// - Owning Asset lifecycle rules.
//
// Architecture:
//
//     Authenticated Route
//            │
//            ▼
//     ProfilePageContainer
//            │
//       ┌────┼──────────────────────────────┐
//       │    │            │                 │
//       ▼    ▼            ▼                 ▼
//    Profile Verification Identity       Avatar
//       │    │            │                 │
//       │    └─ Requests   │                 │
//       │                 │                 │
//       └─────────────────┴─────────────────┘
//                         │
//                         ▼
//                    ProfilePage
//
// Profile photo workflow:
//
//     ProfileHeader
//          │
//          │ onChangePhoto
//          ▼
//     ProfilePageContainer
//          │
//          ▼
//     AssetUploadDialog
//          │
//          │ Asset
//          ▼
//     useTravellerProfileAvatar
//          │
//          ▼
//     TravellerProfile avatar association
//          │
//          ▼
//     refetch TravellerProfile
//          │
//          ▼
//     usePublicAsset
//
// Important:
//
// ProfilePage remains a presentation composition boundary.
//
// Trust is deliberately NOT loaded here. TrustSection owns its own Trust
// feature read because Trust is an independent bounded context.
//
// Traveller Profile remains authoritative for:
// - handle;
// - bio;
// - country;
// - status;
// - visibility;
// - memberPublicId;
// - avatarAssetPublicId;
// - journey statistics;
// - corridors;
// - preferences.
//
// Verification remains authoritative for verification state.
//
// Identity remains authoritative for account contact information and
// account lifecycle status.
//
// Asset remains authoritative for physical file storage and Asset lifecycle.
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
;
// =============================================================================
// Helpers
// =============================================================================
/**
 * Normalizes an absent account phone number for presentation.
 *
 * AccountSection expects a string, while the Identity boundary may legitimately
 * contain no phone number.
 */ function resolvePhoneNumber(phoneNumber) {
    if (phoneNumber === null || phoneNumber === undefined || phoneNumber.trim().length === 0) {
        return 'Not provided';
    }
    return phoneNumber;
}
/**
 * Resolves the current presentation status for one verification requirement.
 *
 * This function deliberately does not determine whether a requirement is
 * required.
 *
 * Verification policy remains a backend concern.
 */ function resolveRequirementStatus(verification, type, request) {
    switch(type){
        case 'PROFILE_PHOTO':
            if (verification.profilePhotoVerified) {
                return 'APPROVED';
            }
            break;
        case 'GOVERNMENT_ID':
            if (verification.governmentIdVerified) {
                return 'APPROVED';
            }
            break;
        case 'DRIVER_LICENSE':
            if (verification.driverLicenseVerified) {
                return 'APPROVED';
            }
            break;
        default:
            break;
    }
    if (request !== undefined) {
        switch(request.status){
            case 'PENDING':
                return 'PENDING';
            case 'APPROVED':
                return 'APPROVED';
            case 'REJECTED':
                return 'REJECTED';
            case 'CANCELLED':
                return 'CANCELLED';
            default:
                break;
        }
    }
    return 'NOT_STARTED';
}
/**
 * Finds the most recent request for each verification request type.
 *
 * VerificationRequest.createdAt is used only to select the latest request
 * for presentation. It is not used to derive verification policy.
 */ function getLatestRequestsByType(requests) {
    const latest = new Map();
    for (const request of requests){
        const current = latest.get(request.type);
        if (current === undefined || new Date(request.createdAt).getTime() > new Date(current.createdAt).getTime()) {
            latest.set(request.type, request);
        }
    }
    return latest;
}
/**
 * Projects Verification + VerificationRequest state into the presentation
 * model consumed by VerificationSection.
 *
 * IMPORTANT:
 *
 * `required` is deliberately not inferred here.
 *
 * MEMBER verification uses an OR relationship between profile photo and
 * government ID. Marking both fields as required in the frontend would
 * incorrectly duplicate backend verification policy.
 *
 * Backend verification policy remains authoritative.
 */ function buildVerificationRequirements(verification, requests) {
    const latestRequests = getLatestRequestsByType(requests);
    const types = [
        'PROFILE_PHOTO',
        'GOVERNMENT_ID',
        'DRIVER_LICENSE'
    ];
    return types.map((type)=>{
        const request = latestRequests.get(type);
        return {
            type,
            // -----------------------------------------------------------------------
            // Requirement policy
            // -----------------------------------------------------------------------
            //
            // The current verification read model does not expose an explicit
            // requirement projection.
            //
            // Therefore the frontend must not invent one.
            //
            // `required` remains false until the backend exposes an authoritative
            // requirement projection.
            //
            // -----------------------------------------------------------------------
            required: false,
            status: resolveRequirementStatus(verification, type, request),
            requestPublicId: request?.publicId ?? null,
            assetPublicId: request?.assetPublicId ?? null,
            submittedAt: request?.submittedAt ?? null,
            reviewedAt: request?.reviewedAt ?? null,
            rejectionReason: request?.rejectionReason ?? null
        };
    });
}
// =============================================================================
// Loading State
// =============================================================================
function ProfileLoadingState() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "min-h-screen bg-[var(--background-brand)]",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$container$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Container"], {
            size: "lg",
            padded: true,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "py-6 sm:py-8 lg:py-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-7 space-y-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-7 w-28 animate-pulse rounded-lg bg-[var(--border-subtle)] sm:h-8"
                            }, void 0, false, {
                                fileName: "[project]/src/components/profile/profile-page-container.tsx",
                                lineNumber: 410,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-4 w-64 animate-pulse rounded-md bg-[var(--border-subtle)]"
                            }, void 0, false, {
                                fileName: "[project]/src/components/profile/profile-page-container.tsx",
                                lineNumber: 412,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/profile/profile-page-container.tsx",
                        lineNumber: 409,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "\r\n\n                overflow-hidden\r\n\n                rounded-[var(--radius-2xl)]\r\n\n                border\r\n\n                border-[var(--border)]\r\n\n                bg-[var(--surface)]\r\n\n                shadow-[var(--shadow-sm)]\r\n\n              ",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-32 animate-pulse bg-[var(--background-subtle)] sm:h-40"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/profile/profile-page-container.tsx",
                                        lineNumber: 430,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-4 p-5 sm:p-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-7 w-40 animate-pulse rounded-lg bg-[var(--border-subtle)]"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/profile/profile-page-container.tsx",
                                                lineNumber: 433,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-4 w-72 max-w-full animate-pulse rounded-md bg-[var(--border-subtle)]"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/profile/profile-page-container.tsx",
                                                lineNumber: 435,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-10 w-32 animate-pulse rounded-lg bg-[var(--border-subtle)]"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/profile/profile-page-container.tsx",
                                                lineNumber: 437,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/profile/profile-page-container.tsx",
                                        lineNumber: 432,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/profile/profile-page-container.tsx",
                                lineNumber: 420,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "\r\n\n                h-44\r\n\n                animate-pulse\r\n\n                rounded-[var(--radius-2xl)]\r\n\n                border\r\n\n                border-[var(--border)]\r\n\n                bg-[var(--surface)]\r\n\n                shadow-[var(--shadow-sm)]\r\n\n              "
                            }, void 0, false, {
                                fileName: "[project]/src/components/profile/profile-page-container.tsx",
                                lineNumber: 441,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "\r\n\n                h-44\r\n\n                animate-pulse\r\n\n                rounded-[var(--radius-2xl)]\r\n\n                border\r\n\n                border-[var(--border)]\r\n\n                bg-[var(--surface)]\r\n\n                shadow-[var(--shadow-sm)]\r\n\n              "
                            }, void 0, false, {
                                fileName: "[project]/src/components/profile/profile-page-container.tsx",
                                lineNumber: 453,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/profile/profile-page-container.tsx",
                        lineNumber: 419,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/profile/profile-page-container.tsx",
                lineNumber: 404,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/profile/profile-page-container.tsx",
            lineNumber: 403,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/profile/profile-page-container.tsx",
        lineNumber: 402,
        columnNumber: 5
    }, this);
}
_c = ProfileLoadingState;
function ProfileState({ message, onRetry }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "min-h-screen bg-[var(--background-brand)]",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$container$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Container"], {
            size: "lg",
            padded: true,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "py-6 sm:py-8 lg:py-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-7",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand)]",
                                children: "sisiMove"
                            }, void 0, false, {
                                fileName: "[project]/src/components/profile/profile-page-container.tsx",
                                lineNumber: 493,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "mt-2 text-2xl font-semibold tracking-[-0.025em] text-[var(--foreground)] sm:text-3xl",
                                children: "Profile"
                            }, void 0, false, {
                                fileName: "[project]/src/components/profile/profile-page-container.tsx",
                                lineNumber: 497,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/profile/profile-page-container.tsx",
                        lineNumber: 492,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "\r\n\n              overflow-hidden\r\n\n              rounded-[var(--radius-2xl)]\r\n\n              border\r\n\n              border-[var(--border)]\r\n\n              bg-[var(--surface)]\r\n\n              shadow-[var(--shadow-sm)]\r\n\n            ",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "border-b border-[var(--border-subtle)] bg-[var(--background-subtle)] px-5 py-4 sm:px-6",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "\r\n\n                    flex\r\n\n                    h-9\r\n\n                    w-9\r\n\n                    shrink-0\r\n\n                    items-center\r\n\n                    justify-center\r\n\n                    rounded-full\r\n\n                    bg-[var(--danger-soft)]\r\n\n                    text-sm\r\n\n                    font-semibold\r\n\n                    text-[var(--danger)]\r\n\n                  ",
                                            "aria-hidden": "true",
                                            children: "!"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/profile/profile-page-container.tsx",
                                            lineNumber: 518,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm font-semibold text-[var(--foreground)]",
                                                    children: "We couldn't load your profile"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/profile/profile-page-container.tsx",
                                                    lineNumber: 538,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "mt-0.5 text-xs text-[var(--foreground-muted)]",
                                                    children: "Something prevented the profile data from loading."
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/profile/profile-page-container.tsx",
                                                    lineNumber: 542,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/profile/profile-page-container.tsx",
                                            lineNumber: 537,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/profile/profile-page-container.tsx",
                                    lineNumber: 517,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/profile/profile-page-container.tsx",
                                lineNumber: 516,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-5 sm:p-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "max-w-2xl text-sm leading-6 text-[var(--foreground-secondary)]",
                                        children: message
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/profile/profile-page-container.tsx",
                                        lineNumber: 550,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: onRetry,
                                        className: "\r\n\n                  mt-5\r\n\n                  inline-flex\r\n\n                  min-h-10\r\n\n                  items-center\r\n\n                  justify-center\r\n\n                  rounded-[var(--radius-md)]\r\n\n                  bg-[var(--brand)]\r\n\n                  px-4\r\n\n                  text-sm\r\n\n                  font-semibold\r\n\n                  text-[var(--brand-foreground)]\r\n\n                  shadow-[var(--shadow-sm)]\r\n\n                  transition\r\n\n                  hover:bg-[var(--brand-hover)]\r\n\n                  active:translate-y-px\r\n\n                ",
                                        children: "Try again"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/profile/profile-page-container.tsx",
                                        lineNumber: 554,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/profile/profile-page-container.tsx",
                                lineNumber: 549,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/profile/profile-page-container.tsx",
                        lineNumber: 506,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/profile/profile-page-container.tsx",
                lineNumber: 487,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/profile/profile-page-container.tsx",
            lineNumber: 486,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/profile/profile-page-container.tsx",
        lineNumber: 485,
        columnNumber: 5
    }, this);
}
_c1 = ProfileState;
function ProfilePageContainer() {
    _s();
    // ---------------------------------------------------------------------------
    // Routing
    // ---------------------------------------------------------------------------
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    // ---------------------------------------------------------------------------
    // Traveller Profile
    // ---------------------------------------------------------------------------
    const { data: profile, isLoading: profileLoading, isError: profileIsError, error: profileError, refetch: refetchProfile } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$hooks$2f$use$2d$current$2d$traveller$2d$profile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCurrentTravellerProfile"])();
    // ---------------------------------------------------------------------------
    // Verification
    // ---------------------------------------------------------------------------
    const { verification, isLoading: verificationLoading, error: verificationError, reload: reloadVerification } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$verification$2f$hooks$2f$use$2d$verification$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useVerification"])();
    // ---------------------------------------------------------------------------
    // Verification Requests
    // ---------------------------------------------------------------------------
    const { requests, isLoading: requestsLoading, error: requestsError, reload: reloadVerificationRequests } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$verification$2f$hooks$2f$use$2d$verification$2d$requests$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useVerificationRequests"])(verification?.publicId ?? null);
    // ---------------------------------------------------------------------------
    // Identity / Account
    // ---------------------------------------------------------------------------
    const { data: identity, isLoading: identityLoading, isError: identityIsError, error: identityError, refetch: refetchIdentity } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$identity$2f$hooks$2f$use$2d$current$2d$identity$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCurrentIdentity"])();
    // ---------------------------------------------------------------------------
    // Avatar Asset
    // ---------------------------------------------------------------------------
    const avatarAssetPublicId = profile?.avatarAssetPublicId ?? null;
    const { asset: avatarAsset, isLoading: avatarLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$assets$2f$hooks$2f$use$2d$public$2d$asset$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePublicAsset"])(avatarAssetPublicId);
    // ---------------------------------------------------------------------------
    // Profile Photo Dialog
    // ---------------------------------------------------------------------------
    const [isPhotoUploadOpen, setIsPhotoUploadOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // ---------------------------------------------------------------------------
    // Traveller Profile Avatar Mutation
    // ---------------------------------------------------------------------------
    const { changeAvatar, clearError: clearAvatarChangeError } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$hooks$2f$use$2d$traveller$2d$profile$2d$avatar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTravellerProfileAvatar"])();
    // ---------------------------------------------------------------------------
    // Verification Requirement Projection
    // ---------------------------------------------------------------------------
    const verificationRequirements = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ProfilePageContainer.useMemo[verificationRequirements]": ()=>{
            if (verification === null || verification === undefined) {
                return [];
            }
            return buildVerificationRequirements(verification, requests ?? []);
        }
    }["ProfilePageContainer.useMemo[verificationRequirements]"], [
        verification,
        requests
    ]);
    // ---------------------------------------------------------------------------
    // Loading
    // ---------------------------------------------------------------------------
    const isLoading = profileLoading || verificationLoading || requestsLoading || identityLoading || avatarLoading;
    // ---------------------------------------------------------------------------
    // Error
    // ---------------------------------------------------------------------------
    const error = profileIsError ? profileError : identityIsError ? identityError : verificationError ?? requestsError;
    // ---------------------------------------------------------------------------
    // Retry
    // ---------------------------------------------------------------------------
    const handleRetry = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProfilePageContainer.useCallback[handleRetry]": ()=>{
            void refetchProfile();
            void refetchIdentity();
            reloadVerification();
            if (verification?.publicId != null) {
                reloadVerificationRequests();
            }
        }
    }["ProfilePageContainer.useCallback[handleRetry]"], [
        refetchProfile,
        refetchIdentity,
        reloadVerification,
        reloadVerificationRequests,
        verification?.publicId
    ]);
    // ---------------------------------------------------------------------------
    // Profile Photo — Open
    // ---------------------------------------------------------------------------
    const handleChangePhoto = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProfilePageContainer.useCallback[handleChangePhoto]": ()=>{
            clearAvatarChangeError();
            setIsPhotoUploadOpen(true);
        }
    }["ProfilePageContainer.useCallback[handleChangePhoto]"], [
        clearAvatarChangeError
    ]);
    // ---------------------------------------------------------------------------
    // Profile Photo — Uploaded Asset
    // ---------------------------------------------------------------------------
    //
    // AssetUploadDialog owns the physical upload.
    //
    // Once the Asset exists, this container gives its public ID meaning in the
    // Traveller Profile bounded context by associating it as the avatar.
    //
    // The Asset itself remains generic and does not know that it is a profile
    // avatar.
    //
    // IMPORTANT:
    //
    // This callback deliberately does NOT close the upload dialog.
    //
    // AssetUploadDialog awaits this callback and closes itself only after this
    // complete workflow succeeds.
    //
    // If the TravellerProfile association fails, the callback throws and the
    // AssetUploadDialog remains open so the user can see the error.
    //
    // ---------------------------------------------------------------------------
    const handleProfilePhotoUploaded = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProfilePageContainer.useCallback[handleProfilePhotoUploaded]": async (asset)=>{
            if (profile === null || profile === undefined) {
                throw new Error('Your traveller profile could not be loaded. Please try again.');
            }
            await changeAvatar(profile.publicId, {
                avatarAssetPublicId: asset.publicId
            });
            await refetchProfile();
        }
    }["ProfilePageContainer.useCallback[handleProfilePhotoUploaded]"], [
        profile,
        changeAvatar,
        refetchProfile
    ]);
    // ---------------------------------------------------------------------------
    // Presentation Actions
    // ---------------------------------------------------------------------------
    const handleManageVerification = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProfilePageContainer.useCallback[handleManageVerification]": ()=>{
            router.push('/profile/verification');
        }
    }["ProfilePageContainer.useCallback[handleManageVerification]"], [
        router
    ]);
    const handleManageMemberVerification = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProfilePageContainer.useCallback[handleManageMemberVerification]": ()=>{
            router.push('/profile/verification');
        }
    }["ProfilePageContainer.useCallback[handleManageMemberVerification]"], [
        router
    ]);
    const handleManageDriverVerification = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProfilePageContainer.useCallback[handleManageDriverVerification]": ()=>{
            router.push('/profile/verification');
        }
    }["ProfilePageContainer.useCallback[handleManageDriverVerification]"], [
        router
    ]);
    const handleViewReputation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProfilePageContainer.useCallback[handleViewReputation]": ()=>{
        // Trust/reputation owns its own feature route and query boundary.
        }
    }["ProfilePageContainer.useCallback[handleViewReputation]"], []);
    const handleManageCorridors = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProfilePageContainer.useCallback[handleManageCorridors]": ()=>{
        // No dedicated corridor-management route is established here.
        }
    }["ProfilePageContainer.useCallback[handleManageCorridors]"], []);
    const handleEditPreferences = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProfilePageContainer.useCallback[handleEditPreferences]": ()=>{
        // No dedicated preferences route is established here.
        }
    }["ProfilePageContainer.useCallback[handleEditPreferences]"], []);
    const handleAccountSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProfilePageContainer.useCallback[handleAccountSettings]": ()=>{
        // No account-settings route is invented here.
        }
    }["ProfilePageContainer.useCallback[handleAccountSettings]"], []);
    // ---------------------------------------------------------------------------
    // Loading State
    // ---------------------------------------------------------------------------
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProfileLoadingState, {}, void 0, false, {
            fileName: "[project]/src/components/profile/profile-page-container.tsx",
            lineNumber: 851,
            columnNumber: 12
        }, this);
    }
    // ---------------------------------------------------------------------------
    // Error State
    // ---------------------------------------------------------------------------
    if (error !== null && error !== undefined) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProfileState, {
            message: error.message,
            onRetry: handleRetry
        }, void 0, false, {
            fileName: "[project]/src/components/profile/profile-page-container.tsx",
            lineNumber: 860,
            columnNumber: 7
        }, this);
    }
    // ---------------------------------------------------------------------------
    // Missing Profile
    // ---------------------------------------------------------------------------
    if (profile === null || profile === undefined) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProfileState, {
            message: "Your traveller profile could not be found. Please try again.",
            onRetry: handleRetry
        }, void 0, false, {
            fileName: "[project]/src/components/profile/profile-page-container.tsx",
            lineNumber: 873,
            columnNumber: 7
        }, this);
    }
    // ---------------------------------------------------------------------------
    // Missing Verification
    // ---------------------------------------------------------------------------
    if (verification === null || verification === undefined) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProfileState, {
            message: "Your verification profile could not be loaded.",
            onRetry: handleRetry
        }, void 0, false, {
            fileName: "[project]/src/components/profile/profile-page-container.tsx",
            lineNumber: 889,
            columnNumber: 7
        }, this);
    }
    // ---------------------------------------------------------------------------
    // Missing Identity
    // ---------------------------------------------------------------------------
    if (identity === null || identity === undefined) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProfileState, {
            message: "Your account information could not be loaded.",
            onRetry: handleRetry
        }, void 0, false, {
            fileName: "[project]/src/components/profile/profile-page-container.tsx",
            lineNumber: 902,
            columnNumber: 7
        }, this);
    }
    // =============================================================================
    // Presentation Composition
    // =============================================================================
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$profile$2d$page$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ProfilePage"], {
                profile: profile,
                verification: verification,
                verificationRequirements: verificationRequirements,
                avatarUrl: avatarAsset?.url ?? null,
                avatarAlt: avatarAsset?.alt ?? `@${profile.handle}`,
                avatarFallback: profile.handle.charAt(0).toUpperCase(),
                visibilityDescription: profile.visibility === 'PUBLIC' ? 'Your public traveller profile is visible according to your visibility settings.' : profile.visibility === 'LIMITED' ? 'Your profile is visible in a limited way according to your visibility settings.' : 'Your profile is currently private.',
                email: identity.email,
                phoneNumber: resolvePhoneNumber(identity.phoneNumber),
                accountStatus: identity.status,
                onChangePhoto: handleChangePhoto,
                onManageVerification: handleManageVerification,
                onManageMemberVerification: handleManageMemberVerification,
                onManageDriverVerification: handleManageDriverVerification,
                onViewReputation: handleViewReputation,
                onManageCorridors: handleManageCorridors,
                onEditPreferences: handleEditPreferences,
                onAccountSettings: handleAccountSettings
            }, void 0, false, {
                fileName: "[project]/src/components/profile/profile-page-container.tsx",
                lineNumber: 915,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$assets$2f$asset$2d$upload$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AssetUploadDialog"], {
                open: isPhotoUploadOpen,
                onOpenChange: setIsPhotoUploadOpen,
                category: "PROFILE_PHOTO",
                type: "IMAGE",
                title: "Change profile photo",
                description: "Choose a clear photo that represents you on your traveller profile.",
                accept: "image/*",
                onUploaded: handleProfilePhotoUploaded
            }, void 0, false, {
                fileName: "[project]/src/components/profile/profile-page-container.tsx",
                lineNumber: 1004,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/profile/profile-page-container.tsx",
        lineNumber: 914,
        columnNumber: 5
    }, this);
}
_s(ProfilePageContainer, "o9TgNTH/44nIC/e+cFwFmYEfZCo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$hooks$2f$use$2d$current$2d$traveller$2d$profile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCurrentTravellerProfile"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$verification$2f$hooks$2f$use$2d$verification$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useVerification"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$verification$2f$hooks$2f$use$2d$verification$2d$requests$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useVerificationRequests"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$identity$2f$hooks$2f$use$2d$current$2d$identity$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCurrentIdentity"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$assets$2f$hooks$2f$use$2d$public$2d$asset$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePublicAsset"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$traveller$2d$profile$2f$hooks$2f$use$2d$traveller$2d$profile$2d$avatar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTravellerProfileAvatar"]
    ];
});
_c2 = ProfilePageContainer;
const __TURBOPACK__default__export__ = ProfilePageContainer;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "ProfileLoadingState");
__turbopack_context__.k.register(_c1, "ProfileState");
__turbopack_context__.k.register(_c2, "ProfilePageContainer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/profile/profile-page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProfilePage",
    ()=>ProfilePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// UI
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$container$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/container.tsx [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// Profile Sections
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$about$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/profile/about/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$about$2f$about$2d$section$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/profile/about/about-section.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$header$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/profile/header/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$header$2f$profile$2d$header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/profile/header/profile-header.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$visibility$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/profile/visibility/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$visibility$2f$profile$2d$visibility$2d$section$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/profile/visibility/profile-visibility-section.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$verification$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/profile/verification/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$verification$2f$verification$2d$section$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/profile/verification/verification-section.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$trust$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/profile/trust/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$trust$2f$trust$2d$section$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/profile/trust/trust-section.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$activity$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/profile/activity/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$activity$2f$travel$2d$activity$2d$section$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/profile/activity/travel-activity-section.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$corridors$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/profile/corridors/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$corridors$2f$corridors$2d$section$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/profile/corridors/corridors-section.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$preferences$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/profile/preferences/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$preferences$2f$travel$2d$preferences$2d$section$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/profile/preferences/travel-preferences-section.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$account$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/profile/account/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$account$2f$account$2d$section$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/profile/account/account-section.tsx [app-client] (ecmascript)");
'use client';
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
function ProfilePage({ profile, verification, verificationRequirements, avatarUrl, avatarAlt, avatarFallback, visibilityDescription, email, phoneNumber, accountStatus, onChangePhoto, onSaveVisibility, onManageVerification, onManageMemberVerification, onManageDriverVerification, onViewReputation, onManageCorridors, onEditPreferences, onAccountSettings }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "min-h-screen bg-[var(--background-brand)]",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$container$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Container"], {
            size: "lg",
            padded: true,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "py-6 sm:py-8 lg:py-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        className: "mb-6 sm:mb-7",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "max-w-2xl",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs font-semibold uppercase tracking-[0.16em]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[var(--foreground)]",
                                            children: "sisi"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/profile/profile-page.tsx",
                                            lineNumber: 307,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[var(--brand)]",
                                            children: "Move"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/profile/profile-page.tsx",
                                            lineNumber: 308,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/profile/profile-page.tsx",
                                    lineNumber: 306,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "mt-2 text-2xl font-semibold tracking-[-0.025em] text-[var(--foreground)] sm:text-3xl",
                                    children: "Your profile"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/profile/profile-page.tsx",
                                    lineNumber: 311,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-2 max-w-xl text-sm leading-6 text-[var(--foreground-secondary)]",
                                    children: "Manage your traveller identity, verification, travel preferences and account information."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/profile/profile-page.tsx",
                                    lineNumber: 315,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/profile/profile-page.tsx",
                            lineNumber: 305,
                            columnNumber: 17
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/profile/profile-page.tsx",
                        lineNumber: 304,
                        columnNumber: 15
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$header$2f$profile$2d$header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ProfileHeader"], {
                        handle: profile.handle,
                        country: profile.countryCode,
                        status: profile.status,
                        avatarUrl: avatarUrl,
                        avatarAlt: avatarAlt,
                        avatarFallback: avatarFallback,
                        visibilityDescription: visibilityDescription,
                        onChangePhoto: onChangePhoto
                    }, void 0, false, {
                        fileName: "[project]/src/components/profile/profile-page.tsx",
                        lineNumber: 329,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-4 space-y-4 sm:mt-5 sm:space-y-5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$about$2f$about$2d$section$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AboutSection"], {
                                profile: profile
                            }, void 0, false, {
                                fileName: "[project]/src/components/profile/profile-page.tsx",
                                lineNumber: 352,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$visibility$2f$profile$2d$visibility$2d$section$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ProfileVisibilitySection"], {
                                value: profile.visibility,
                                onSave: onSaveVisibility
                            }, void 0, false, {
                                fileName: "[project]/src/components/profile/profile-page.tsx",
                                lineNumber: 360,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$verification$2f$verification$2d$section$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VerificationSection"], {
                                verification: verification,
                                requirements: verificationRequirements,
                                onManage: onManageVerification,
                                onManageMember: onManageMemberVerification,
                                onManageDriver: onManageDriverVerification
                            }, void 0, false, {
                                fileName: "[project]/src/components/profile/profile-page.tsx",
                                lineNumber: 369,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$trust$2f$trust$2d$section$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TrustSection"], {
                                memberPublicId: profile.memberPublicId,
                                onViewReputation: onViewReputation
                            }, void 0, false, {
                                fileName: "[project]/src/components/profile/profile-page.tsx",
                                lineNumber: 381,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$activity$2f$travel$2d$activity$2d$section$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TravelActivitySection"], {
                                totalJourneys: profile.totalJourneys,
                                completedJourneys: profile.completedJourneys,
                                providerJourneys: profile.providerJourneys,
                                passengerJourneys: profile.passengerJourneys,
                                completedProviderJourneys: profile.completedProviderJourneys,
                                completedPassengerJourneys: profile.completedPassengerJourneys
                            }, void 0, false, {
                                fileName: "[project]/src/components/profile/profile-page.tsx",
                                lineNumber: 390,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$corridors$2f$corridors$2d$section$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CorridorsSection"], {
                                corridors: profile.corridors,
                                onManage: onManageCorridors
                            }, void 0, false, {
                                fileName: "[project]/src/components/profile/profile-page.tsx",
                                lineNumber: 407,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$preferences$2f$travel$2d$preferences$2d$section$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TravelPreferencesSection"], {
                                preferences: profile.preferences,
                                onEdit: onEditPreferences
                            }, void 0, false, {
                                fileName: "[project]/src/components/profile/profile-page.tsx",
                                lineNumber: 416,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$account$2f$account$2d$section$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AccountSection"], {
                                email: email,
                                phoneNumber: phoneNumber,
                                status: accountStatus,
                                onSettings: onAccountSettings
                            }, void 0, false, {
                                fileName: "[project]/src/components/profile/profile-page.tsx",
                                lineNumber: 425,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/profile/profile-page.tsx",
                        lineNumber: 346,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-4 sm:h-6"
                    }, void 0, false, {
                        fileName: "[project]/src/components/profile/profile-page.tsx",
                        lineNumber: 437,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/profile/profile-page.tsx",
                lineNumber: 298,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/profile/profile-page.tsx",
            lineNumber: 297,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/profile/profile-page.tsx",
        lineNumber: 296,
        columnNumber: 5
    }, this);
}
_c = ProfilePage;
var _c;
__turbopack_context__.k.register(_c, "ProfilePage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/profile/trust/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// -----------------------------------------------------------------------------
// sisiMove — Profile Trust Component Exports
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$trust$2f$trust$2d$section$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/profile/trust/trust-section.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$trust$2f$trust$2d$summary$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/profile/trust/trust-summary.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$trust$2f$trust$2d$statistics$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/profile/trust/trust-statistics.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$trust$2f$trust$2d$badge$2d$list$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/profile/trust/trust-badge-list.tsx [app-client] (ecmascript)");
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/profile/trust/trust-badge-list.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TrustBadgeList",
    ()=>TrustBadgeList
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// sisiMove — Trust Badge List
// -----------------------------------------------------------------------------
//
// Presentational list of active Trust badges awarded to the traveller.
//
// Responsibilities:
// - Render the supplied public badge information.
// - Render badge name and optional description.
// - Render badge artwork when the frontend model provides it.
//
// Non-responsibilities:
// - Fetching badges.
// - Determining whether a badge is active.
// - Joining TrustBadge and TrustProfileBadge.
// - Constructing asset URLs.
// - Applying Trust business rules.
//
// Those concerns belong to the Trust API/domain boundary.
//
// Architectural note:
// - The authenticated profile consumes TravellerTrust.
// - TravellerTrust embeds the safe PublicTrustBadge representation.
// - Internal Trust badge-definition and badge-assignment models remain behind
//   the Trust boundary.
//
// Visual language:
// - Compact badge collection.
// - White badge surfaces with subtle borders.
// - Brand-accented artwork container.
// - Suitable for both mobile wrapping and desktop presentation.
// - Badge content remains presentation-only.
//
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
;
;
function TrustBadgeList({ badges }) {
    if (badges.length === 0) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-wrap gap-2",
        "aria-label": "Trust badges",
        children: badges.map((badge)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: [
                    'inline-flex min-w-0 items-center gap-2',
                    'rounded-[var(--radius-full)]',
                    'border border-[var(--border)]',
                    'bg-[var(--surface)]',
                    'px-3 py-2',
                    'shadow-[var(--shadow-sm)]'
                ].join(' '),
                title: badge.description ?? undefined,
                children: [
                    badge.asset !== null ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        "aria-hidden": "true",
                        className: [
                            'relative size-6 shrink-0 overflow-hidden',
                            'rounded-full',
                            'border border-[var(--border-subtle)]',
                            'bg-[var(--brand-soft)]'
                        ].join(' '),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            src: badge.asset.url,
                            alt: badge.asset.alt ?? '',
                            fill: true,
                            sizes: "24px",
                            className: "object-cover"
                        }, void 0, false, {
                            fileName: "[project]/src/components/profile/trust/trust-badge-list.tsx",
                            lineNumber: 92,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/profile/trust/trust-badge-list.tsx",
                        lineNumber: 83,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        "aria-hidden": "true",
                        className: [
                            'flex size-6 shrink-0 items-center justify-center',
                            'rounded-full',
                            'bg-[var(--brand-soft)]',
                            'text-xs font-semibold text-[var(--brand)]'
                        ].join(' '),
                        children: "✓"
                    }, void 0, false, {
                        fileName: "[project]/src/components/profile/trust/trust-badge-list.tsx",
                        lineNumber: 101,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "min-w-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "block truncate text-sm font-medium text-[var(--foreground)]",
                                children: badge.name
                            }, void 0, false, {
                                fileName: "[project]/src/components/profile/trust/trust-badge-list.tsx",
                                lineNumber: 119,
                                columnNumber: 13
                            }, this),
                            badge.description ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "block max-w-[18rem] truncate text-xs text-[var(--foreground-muted)]",
                                children: badge.description
                            }, void 0, false, {
                                fileName: "[project]/src/components/profile/trust/trust-badge-list.tsx",
                                lineNumber: 124,
                                columnNumber: 15
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/profile/trust/trust-badge-list.tsx",
                        lineNumber: 118,
                        columnNumber: 11
                    }, this)
                ]
            }, badge.publicId, true, {
                fileName: "[project]/src/components/profile/trust/trust-badge-list.tsx",
                lineNumber: 66,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/src/components/profile/trust/trust-badge-list.tsx",
        lineNumber: 61,
        columnNumber: 5
    }, this);
}
_c = TrustBadgeList;
var _c;
__turbopack_context__.k.register(_c, "TrustBadgeList");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/profile/trust/trust-section.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TrustSection",
    ()=>TrustSection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$trust$2f$hooks$2f$use$2d$my$2d$trust$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/trust/hooks/use-my-trust.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$trust$2f$trust$2d$summary$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/profile/trust/trust-summary.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
// -----------------------------------------------------------------------------
// sisiMove — Trust Section
// -----------------------------------------------------------------------------
//
// Authenticated traveller profile Trust section.
//
// Data boundary:
//
//   useMyTrust(memberPublicId)
//        ↓
//   TravellerTrust | null | undefined
//        ↓
//   TrustSummary
//        ├── TrustStatistics
//        └── TrustBadgeList
//
// The section owns Trust loading/error/empty states.
// Child components remain presentational.
//
// Architectural note:
// - memberPublicId is an opaque cross-feature identifier.
// - The section does not construct or infer Trust relationships.
// - TrustSummary receives the authenticated TravellerTrust model directly.
//
// Visual language:
// - Compact authenticated-profile section.
// - sisiMove blue accent for section identity.
// - Consistent surface treatment for transient states.
// - TrustSummary owns the detailed Trust presentation.
//
// -----------------------------------------------------------------------------
'use client';
;
;
// -----------------------------------------------------------------------------
// Loading State
// -----------------------------------------------------------------------------
function TrustLoadingState() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        role: "status",
        "aria-label": "Loading Trust information",
        className: [
            'overflow-hidden rounded-[var(--radius-2xl)]',
            'border border-[var(--border)]',
            'bg-[var(--surface)]',
            'p-5',
            'shadow-[var(--shadow-sm)]'
        ].join(' '),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "animate-pulse space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start justify-between gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-3 w-28 rounded-full bg-[var(--background-muted)]"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/profile/trust/trust-section.tsx",
                                        lineNumber: 70,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-5 w-36 rounded bg-[var(--background-muted)]"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/profile/trust/trust-section.tsx",
                                        lineNumber: 71,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/profile/trust/trust-section.tsx",
                                lineNumber: 69,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-7 w-16 rounded-full bg-[var(--background-muted)]"
                            }, void 0, false, {
                                fileName: "[project]/src/components/profile/trust/trust-section.tsx",
                                lineNumber: 74,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/profile/trust/trust-section.tsx",
                        lineNumber: 68,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 gap-2.5 sm:grid-cols-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-20 rounded-[var(--radius-lg)] bg-[var(--background-subtle)]"
                            }, void 0, false, {
                                fileName: "[project]/src/components/profile/trust/trust-section.tsx",
                                lineNumber: 78,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-20 rounded-[var(--radius-lg)] bg-[var(--background-subtle)]"
                            }, void 0, false, {
                                fileName: "[project]/src/components/profile/trust/trust-section.tsx",
                                lineNumber: 79,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-20 rounded-[var(--radius-lg)] bg-[var(--background-subtle)]"
                            }, void 0, false, {
                                fileName: "[project]/src/components/profile/trust/trust-section.tsx",
                                lineNumber: 80,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/profile/trust/trust-section.tsx",
                        lineNumber: 77,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/profile/trust/trust-section.tsx",
                lineNumber: 67,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "sr-only",
                children: "Loading Trust information…"
            }, void 0, false, {
                fileName: "[project]/src/components/profile/trust/trust-section.tsx",
                lineNumber: 84,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/profile/trust/trust-section.tsx",
        lineNumber: 56,
        columnNumber: 5
    }, this);
}
_c = TrustLoadingState;
// -----------------------------------------------------------------------------
// Informational State
// -----------------------------------------------------------------------------
function TrustMessageState({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        role: "status",
        className: [
            'rounded-[var(--radius-2xl)]',
            'border border-[var(--border)]',
            'bg-[var(--surface)]',
            'px-5 py-5',
            'shadow-[var(--shadow-sm)]'
        ].join(' '),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-sm leading-6 text-[var(--foreground-muted)]",
            children: children
        }, void 0, false, {
            fileName: "[project]/src/components/profile/trust/trust-section.tsx",
            lineNumber: 109,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/profile/trust/trust-section.tsx",
        lineNumber: 99,
        columnNumber: 5
    }, this);
}
_c1 = TrustMessageState;
function TrustSection({ memberPublicId, onViewReputation }) {
    _s();
    const { data: trust, isLoading, isError } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$trust$2f$hooks$2f$use$2d$my$2d$trust$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMyTrust"])(memberPublicId);
    const hasTrust = trust !== null && trust !== undefined;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "space-y-5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-start gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        "aria-hidden": "true",
                        className: "mt-1.5 size-2 shrink-0 rounded-full bg-[var(--brand)]"
                    }, void 0, false, {
                        fileName: "[project]/src/components/profile/trust/trust-section.tsx",
                        lineNumber: 139,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-sm font-semibold uppercase tracking-[0.08em] text-[var(--foreground)]",
                                children: "Trust & Reputation"
                            }, void 0, false, {
                                fileName: "[project]/src/components/profile/trust/trust-section.tsx",
                                lineNumber: 145,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1.5 max-w-2xl text-sm leading-6 text-[var(--foreground-muted)]",
                                children: "Your reputation, verification status, and travel reliability on sisiMove."
                            }, void 0, false, {
                                fileName: "[project]/src/components/profile/trust/trust-section.tsx",
                                lineNumber: 149,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/profile/trust/trust-section.tsx",
                        lineNumber: 144,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/profile/trust/trust-section.tsx",
                lineNumber: 138,
                columnNumber: 7
            }, this),
            isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TrustLoadingState, {}, void 0, false, {
                fileName: "[project]/src/components/profile/trust/trust-section.tsx",
                lineNumber: 160,
                columnNumber: 20
            }, this) : null,
            !isLoading && isError ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TrustMessageState, {
                children: "Trust information is temporarily unavailable. Please try again later."
            }, void 0, false, {
                fileName: "[project]/src/components/profile/trust/trust-section.tsx",
                lineNumber: 167,
                columnNumber: 9
            }, this) : null,
            !isLoading && !isError && !hasTrust ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TrustMessageState, {
                children: "Trust information is not available yet."
            }, void 0, false, {
                fileName: "[project]/src/components/profile/trust/trust-section.tsx",
                lineNumber: 178,
                columnNumber: 9
            }, this) : null,
            !isLoading && !isError && hasTrust ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$trust$2f$trust$2d$summary$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TrustSummary"], {
                trust: trust,
                onViewReputation: onViewReputation
            }, void 0, false, {
                fileName: "[project]/src/components/profile/trust/trust-section.tsx",
                lineNumber: 188,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/profile/trust/trust-section.tsx",
        lineNumber: 133,
        columnNumber: 5
    }, this);
}
_s(TrustSection, "g47+uhPatNXGecT0K8scxGNPR/s=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$trust$2f$hooks$2f$use$2d$my$2d$trust$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMyTrust"]
    ];
});
_c2 = TrustSection;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "TrustLoadingState");
__turbopack_context__.k.register(_c1, "TrustMessageState");
__turbopack_context__.k.register(_c2, "TrustSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/profile/trust/trust-statistics.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Trust Statistics
// -----------------------------------------------------------------------------
//
// Presentational component for the quantitative Trust/reputation statistics
// displayed on the authenticated traveller profile.
//
// Responsibilities:
// - Display rating summary.
// - Display completion rate.
// - Display cancellation rate.
//
// Non-responsibilities:
// - Fetching Trust data.
// - Loading state management.
// - Trust business rules.
// - Calculating rates.
// - Formatting backend responses.
//
// The parent Trust section owns data loading and passes presentation-ready
// values into this component.
//
// Visual language:
// - Compact metric strip.
// - Uses sisiMove design tokens rather than generic utility colors.
// - Rating receives a subtle semantic emphasis.
// - Metrics remain visually consistent and easy to scan on mobile and desktop.
//
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "TrustStatistics",
    ()=>TrustStatistics
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function TrustStatistics({ ratingAverage, ratingCount, completionRate, cancellationRate }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "grid grid-cols-1 gap-2.5 sm:grid-cols-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--background-subtle)] px-4 py-3.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs font-medium text-[var(--foreground-muted)]",
                        children: "Rating"
                    }, void 0, false, {
                        fileName: "[project]/src/components/profile/trust/trust-statistics.tsx",
                        lineNumber: 61,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-1.5 flex items-baseline gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xl font-semibold tracking-tight text-[var(--foreground)]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        "aria-hidden": "true",
                                        className: "mr-1 text-[var(--warning)]",
                                        children: "★"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/profile/trust/trust-statistics.tsx",
                                        lineNumber: 67,
                                        columnNumber: 13
                                    }, this),
                                    ratingAverage.toFixed(1)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/profile/trust/trust-statistics.tsx",
                                lineNumber: 66,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-[var(--foreground-muted)]",
                                children: [
                                    ratingCount.toLocaleString(),
                                    " ratings"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/profile/trust/trust-statistics.tsx",
                                lineNumber: 76,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/profile/trust/trust-statistics.tsx",
                        lineNumber: 65,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/profile/trust/trust-statistics.tsx",
                lineNumber: 60,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--background-subtle)] px-4 py-3.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs font-medium text-[var(--foreground-muted)]",
                        children: "Completion rate"
                    }, void 0, false, {
                        fileName: "[project]/src/components/profile/trust/trust-statistics.tsx",
                        lineNumber: 87,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-1.5 flex items-baseline gap-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xl font-semibold tracking-tight text-[var(--foreground)]",
                                children: completionRate.toFixed(1)
                            }, void 0, false, {
                                fileName: "[project]/src/components/profile/trust/trust-statistics.tsx",
                                lineNumber: 92,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm font-medium text-[var(--foreground-muted)]",
                                children: "%"
                            }, void 0, false, {
                                fileName: "[project]/src/components/profile/trust/trust-statistics.tsx",
                                lineNumber: 96,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/profile/trust/trust-statistics.tsx",
                        lineNumber: 91,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/profile/trust/trust-statistics.tsx",
                lineNumber: 86,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--background-subtle)] px-4 py-3.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs font-medium text-[var(--foreground-muted)]",
                        children: "Cancellation rate"
                    }, void 0, false, {
                        fileName: "[project]/src/components/profile/trust/trust-statistics.tsx",
                        lineNumber: 107,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-1.5 flex items-baseline gap-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xl font-semibold tracking-tight text-[var(--foreground)]",
                                children: cancellationRate.toFixed(1)
                            }, void 0, false, {
                                fileName: "[project]/src/components/profile/trust/trust-statistics.tsx",
                                lineNumber: 112,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm font-medium text-[var(--foreground-muted)]",
                                children: "%"
                            }, void 0, false, {
                                fileName: "[project]/src/components/profile/trust/trust-statistics.tsx",
                                lineNumber: 116,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/profile/trust/trust-statistics.tsx",
                        lineNumber: 111,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/profile/trust/trust-statistics.tsx",
                lineNumber: 106,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/profile/trust/trust-statistics.tsx",
        lineNumber: 55,
        columnNumber: 5
    }, this);
}
_c = TrustStatistics;
var _c;
__turbopack_context__.k.register(_c, "TrustStatistics");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/profile/trust/trust-summary.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Trust Summary
// -----------------------------------------------------------------------------
//
// Authenticated traveller Trust summary card.
//
// Presentation:
//
//   TRUST VERIFICATION                         MEMBER VERIFIED
//
//   ★ 4.9                                      128 ratings
//
//   Completion rate                            96.5%
//   Cancellation rate                           2.1%
//
//   [ Identity verified ] [ Reliable traveller ] [ Highly rated ]
//
// The component receives the already-loaded TravellerTrust model.
//
// It does not perform API calls.
//
// Architectural note:
// - TravellerTrust is the authenticated Trust model.
// - TrustSummary presents the model but does not calculate or interpret
//   Trust-domain statistics.
// - Trust status is surfaced separately from verification level because
//   verification and profile lifecycle are distinct Trust concepts.
//
// Visual language:
// - Compact sisiMove profile surface.
// - Blue accent for Trust identity.
// - Semantic status treatment.
// - Rating remains the visual focal point.
// - Statistics and badges remain delegated to their presentation components.
//
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "TrustSummary",
    ()=>TrustSummary
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$trust$2f$trust$2d$badge$2d$list$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/profile/trust/trust-badge-list.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$trust$2f$trust$2d$statistics$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/profile/trust/trust-statistics.tsx [app-client] (ecmascript)");
;
;
;
// -----------------------------------------------------------------------------
// Verification Label
// -----------------------------------------------------------------------------
function getVerificationLabel(level) {
    switch(level){
        case 'DRIVER':
            return 'Driver verified';
        case 'MEMBER':
            return 'Member verified';
        case 'NONE':
        default:
            return 'Not verified';
    }
}
function getTrustStatusPresentation(status) {
    switch(status){
        case 'ACTIVE':
            return {
                label: 'Active',
                className: 'border-[var(--success-border)] bg-[var(--success-soft)] text-[var(--success)]',
                dotClassName: 'bg-[var(--success)]'
            };
        case 'SUSPENDED':
            return {
                label: 'Suspended',
                className: 'border-[var(--warning-border)] bg-[var(--warning-soft)] text-[var(--warning)]',
                dotClassName: 'bg-[var(--warning)]'
            };
        case 'REVOKED':
            return {
                label: 'Revoked',
                className: 'border-[var(--danger-border)] bg-[var(--danger-soft)] text-[var(--danger)]',
                dotClassName: 'bg-[var(--danger)]'
            };
        default:
            return {
                label: 'Unknown',
                className: 'border-[var(--border)] bg-[var(--background-subtle)] text-[var(--foreground-muted)]',
                dotClassName: 'bg-[var(--foreground-subtle)]'
            };
    }
}
function TrustSummary({ trust, onViewReputation }) {
    const status = getTrustStatusPresentation(trust.status);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-4 border-b border-[var(--border-subtle)] px-5 py-5 sm:flex-row sm:items-start sm:justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        "aria-hidden": "true",
                                        className: "size-2 shrink-0 rounded-full bg-[var(--brand)]"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/profile/trust/trust-summary.tsx",
                                        lineNumber: 141,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs font-semibold uppercase tracking-[0.08em] text-[var(--foreground-muted)]",
                                        children: "Trust verification"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/profile/trust/trust-summary.tsx",
                                        lineNumber: 146,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/profile/trust/trust-summary.tsx",
                                lineNumber: 140,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1.5 text-base font-semibold text-[var(--foreground)]",
                                children: getVerificationLabel(trust.verificationLevel)
                            }, void 0, false, {
                                fileName: "[project]/src/components/profile/trust/trust-summary.tsx",
                                lineNumber: 151,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/profile/trust/trust-summary.tsx",
                        lineNumber: 139,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: [
                            'inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full',
                            'border px-2.5 py-1 text-xs font-medium',
                            status.className
                        ].join(' '),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                "aria-hidden": "true",
                                className: [
                                    'size-1.5 rounded-full',
                                    status.dotClassName
                                ].join(' ')
                            }, void 0, false, {
                                fileName: "[project]/src/components/profile/trust/trust-summary.tsx",
                                lineNumber: 163,
                                columnNumber: 11
                            }, this),
                            status.label
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/profile/trust/trust-summary.tsx",
                        lineNumber: 156,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/profile/trust/trust-summary.tsx",
                lineNumber: 138,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-5 py-5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-end justify-between gap-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "min-w-0",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-baseline gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            "aria-hidden": "true",
                                            className: "text-xl leading-none text-[var(--warning)]",
                                            children: "★"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/profile/trust/trust-summary.tsx",
                                            lineNumber: 182,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-3xl font-semibold tracking-tight text-[var(--foreground)]",
                                            children: trust.ratingAverage
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/profile/trust/trust-summary.tsx",
                                            lineNumber: 189,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/profile/trust/trust-summary.tsx",
                                    lineNumber: 181,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-1 text-sm text-[var(--foreground-muted)]",
                                    children: [
                                        trust.ratingCount.toLocaleString(),
                                        " ratings"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/profile/trust/trust-summary.tsx",
                                    lineNumber: 194,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/profile/trust/trust-summary.tsx",
                            lineNumber: 180,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/profile/trust/trust-summary.tsx",
                        lineNumber: 179,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-5 border-t border-[var(--border-subtle)] pt-5",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$trust$2f$trust$2d$statistics$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TrustStatistics"], {
                            ratingAverage: trust.ratingAverage,
                            ratingCount: trust.ratingCount,
                            completionRate: trust.completionRate,
                            cancellationRate: trust.cancellationRate
                        }, void 0, false, {
                            fileName: "[project]/src/components/profile/trust/trust-summary.tsx",
                            lineNumber: 205,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/profile/trust/trust-summary.tsx",
                        lineNumber: 204,
                        columnNumber: 9
                    }, this),
                    trust.badges.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-5 border-t border-[var(--border-subtle)] pt-5",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$trust$2f$trust$2d$badge$2d$list$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TrustBadgeList"], {
                            badges: trust.badges
                        }, void 0, false, {
                            fileName: "[project]/src/components/profile/trust/trust-summary.tsx",
                            lineNumber: 219,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/profile/trust/trust-summary.tsx",
                        lineNumber: 218,
                        columnNumber: 11
                    }, this) : null,
                    onViewReputation !== undefined ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-5 flex justify-end border-t border-[var(--border-subtle)] pt-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: onViewReputation,
                            className: [
                                'inline-flex items-center gap-1 rounded-[var(--radius-md)]',
                                'px-2 py-1.5 text-sm font-medium',
                                'text-[var(--brand)]',
                                'transition-colors',
                                'hover:bg-[var(--brand-soft)] hover:text-[var(--brand-hover)]',
                                'focus-visible:outline-none',
                                'focus-visible:ring-2 focus-visible:ring-[var(--brand)]',
                                'focus-visible:ring-offset-2'
                            ].join(' '),
                            children: [
                                "View reputation",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    "aria-hidden": "true",
                                    children: "→"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/profile/trust/trust-summary.tsx",
                                    lineNumber: 244,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/profile/trust/trust-summary.tsx",
                            lineNumber: 229,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/profile/trust/trust-summary.tsx",
                        lineNumber: 228,
                        columnNumber: 11
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/profile/trust/trust-summary.tsx",
                lineNumber: 178,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/profile/trust/trust-summary.tsx",
        lineNumber: 133,
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
"[project]/src/components/profile/verification/driver-verification-card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Driver Verification Card
// -----------------------------------------------------------------------------
//
// Presentation-only driver verification surface.
//
// Driver verification currently consists of:
// - Driver license
//
// Responsibilities:
// - Present driver verification state.
// - Render the driver verification requirement.
// - Expose a presentation-level action for managing verification.
//
// Non-responsibilities:
// - Fetching verification data.
// - Submitting verification requests.
// - Cancelling requests.
// - Determining driver eligibility.
// - Granting or rejecting verification.
//
// Architecture:
// - Consumes the VerificationRequirement application/presentation model.
// - Uses shared Card and Button primitives.
// - Does not access verification APIs or hooks.
// - Does not construct Asset URLs from assetPublicId.
// - Does not inspect VerificationRequest directly.
// - The `verified` state is supplied by the parent from the Verification
//   aggregate's verification level.
//
// Visual language:
// - Driver verification heading remains outside the requirement card.
// - The requirement list is the only card/surface owned here.
// - Visually aligned with MemberVerificationCard.
// - SisiMove blue identifies the driver verification pathway.
// - Semantic success state is used only when driver verification is granted.
// - Requirement rows remain responsible for their own status presentation.
// - Mobile-first layout keeps the state and management action easy to scan.
//
// -----------------------------------------------------------------------------
//
// Layout:
//
//     Driver verification
//     Verify your driver credentials...
//     [Not verified] [Manage]
//
//     ┌──────────────────────────────────────────────────────────────┐
//     │ Driver license                         Not started            │
//     │ Valid driver licensing                                      │
//     └──────────────────────────────────────────────────────────────┘
//
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "DriverVerificationCard",
    ()=>DriverVerificationCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$verification$2f$verification$2d$requirement$2d$row$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/profile/verification/verification-requirement-row.tsx [app-client] (ecmascript)");
;
;
;
;
function DriverVerificationCard({ requirements, verified, onManage }) {
    // ---------------------------------------------------------------------------
    // Driver Requirements
    // ---------------------------------------------------------------------------
    //
    // This presentation pathway owns only DRIVER_LICENSE.
    //
    // Filtering here is strictly a presentation concern. It does not determine
    // whether the traveller is eligible for driver verification.
    //
    // VerificationRequirement does not have its own publicId. The requirement
    // type is therefore the stable identity within this presentation model.
    // requestPublicId remains opaque and belongs to the verification workflow.
    //
    const driverRequirements = requirements.filter((requirement)=>requirement.type === 'DRIVER_LICENSE');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "\r\n\n          flex\r\n\n          flex-col\r\n\n          gap-4\r\n\n          sm:flex-row\r\n\n          sm:items-center\r\n\n          sm:justify-between\r\n\n        ",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        "aria-hidden": "true",
                                        className: [
                                            'size-2 shrink-0 rounded-full',
                                            verified ? 'bg-[var(--success)]' : 'bg-[var(--brand)]'
                                        ].join(' ')
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/profile/verification/driver-verification-card.tsx",
                                        lineNumber: 137,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-base font-semibold tracking-[-0.01em] text-[var(--foreground)]",
                                        children: "Driver verification"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/profile/verification/driver-verification-card.tsx",
                                        lineNumber: 147,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/profile/verification/driver-verification-card.tsx",
                                lineNumber: 136,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1.5 max-w-xl text-sm leading-5 text-[var(--foreground-secondary)]",
                                children: "Verify your driver credentials before publishing journeys as a provider."
                            }, void 0, false, {
                                fileName: "[project]/src/components/profile/verification/driver-verification-card.tsx",
                                lineNumber: 152,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/profile/verification/driver-verification-card.tsx",
                        lineNumber: 135,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "\r\n\n            flex\r\n\n            shrink-0\r\n\n            items-center\r\n\n            justify-between\r\n\n            gap-3\r\n\n            sm:justify-end\r\n\n          ",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                "aria-label": verified ? 'Driver verification: Verified' : 'Driver verification: Not verified',
                                className: [
                                    'inline-flex items-center gap-1.5',
                                    'rounded-full border px-2.5 py-1',
                                    'text-xs font-medium leading-none whitespace-nowrap',
                                    verified ? 'border-[var(--success-border)] bg-[var(--success-soft)] text-[var(--success)]' : 'border-[var(--border)] bg-[var(--background-subtle)] text-[var(--foreground-muted)]'
                                ].join(' '),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        "aria-hidden": "true",
                                        className: [
                                            'size-1.5 shrink-0 rounded-full',
                                            verified ? 'bg-[var(--success)]' : 'bg-[var(--foreground-subtle)]'
                                        ].join(' ')
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/profile/verification/driver-verification-card.tsx",
                                        lineNumber: 187,
                                        columnNumber: 13
                                    }, this),
                                    verified ? 'Verified' : 'Not verified'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/profile/verification/driver-verification-card.tsx",
                                lineNumber: 172,
                                columnNumber: 11
                            }, this),
                            onManage !== undefined ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                type: "button",
                                variant: "primary",
                                size: "sm",
                                onClick: onManage,
                                children: "Manage"
                            }, void 0, false, {
                                fileName: "[project]/src/components/profile/verification/driver-verification-card.tsx",
                                lineNumber: 201,
                                columnNumber: 13
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/profile/verification/driver-verification-card.tsx",
                        lineNumber: 162,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/profile/verification/driver-verification-card.tsx",
                lineNumber: 125,
                columnNumber: 7
            }, this),
            driverRequirements.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                variant: "default",
                padding: "none",
                className: "\r\n\n            overflow-hidden\r\n\n            rounded-[var(--radius-2xl)]\r\n\n            border-[var(--border)]\r\n\n            bg-[var(--surface)]\r\n\n            shadow-[var(--shadow-sm)]\r\n\n          ",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "px-4 sm:px-5",
                    children: driverRequirements.map((requirement)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$verification$2f$verification$2d$requirement$2d$row$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VerificationRequirementRow"], {
                            requirement: requirement
                        }, requirement.type, false, {
                            fileName: "[project]/src/components/profile/verification/driver-verification-card.tsx",
                            lineNumber: 236,
                            columnNumber: 15
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/components/profile/verification/driver-verification-card.tsx",
                    lineNumber: 234,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/profile/verification/driver-verification-card.tsx",
                lineNumber: 223,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "\r\n\n            rounded-[var(--radius-2xl)]\r\n\n            border\r\n\n            border-dashed\r\n\n            border-[var(--border-strong)]\r\n\n            bg-[var(--background-subtle)]\r\n\n            px-4\r\n\n            py-5\r\n\n            text-sm\r\n\n            leading-5\r\n\n            text-[var(--foreground-muted)]\r\n\n          ",
                children: "No driver verification requirements are currently available."
            }, void 0, false, {
                fileName: "[project]/src/components/profile/verification/driver-verification-card.tsx",
                lineNumber: 244,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/profile/verification/driver-verification-card.tsx",
        lineNumber: 120,
        columnNumber: 5
    }, this);
}
_c = DriverVerificationCard;
var _c;
__turbopack_context__.k.register(_c, "DriverVerificationCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/profile/verification/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// -----------------------------------------------------------------------------
// sisiMove — Verification Profile Components
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$verification$2f$verification$2d$section$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/profile/verification/verification-section.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$verification$2f$verification$2d$summary$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/profile/verification/verification-summary.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$verification$2f$member$2d$verification$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/profile/verification/member-verification-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$verification$2f$driver$2d$verification$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/profile/verification/driver-verification-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$verification$2f$verification$2d$requirement$2d$row$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/profile/verification/verification-requirement-row.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$verification$2f$verification$2d$requirement$2d$status$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/profile/verification/verification-requirement-status.tsx [app-client] (ecmascript)");
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
"[project]/src/components/profile/verification/member-verification-card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Member Verification Card
// -----------------------------------------------------------------------------
//
// Presentation-only member verification surface.
//
// Member verification currently consists of:
// - Profile photo
// - Government ID
//
// Responsibilities:
// - Present member verification state.
// - Render the relevant verification requirement rows.
// - Expose a presentation-level action for managing verification.
//
// Non-responsibilities:
// - Fetching verification data.
// - Submitting verification requests.
// - Cancelling verification requests.
// - Determining verification eligibility.
//
// Architecture:
// - Consumes the VerificationRequirement presentation model.
// - Uses shared Card and Button primitives.
// - Does not access verification APIs or hooks.
// - Does not inspect VerificationRequest directly.
// - Does not construct Asset URLs.
// - `verified` is supplied by the parent from the Verification aggregate's
//   verification level.
//
// Visual language:
// - The member verification heading remains outside the requirement card.
// - The requirement list is the only card/surface owned here.
// - SisiMove blue identifies the member verification pathway.
// - Semantic success state is used only when verification is granted.
// - Requirement rows remain responsible for their own status presentation.
// - Mobile-first layout keeps the state and action easy to scan and reach.
//
// -----------------------------------------------------------------------------
//
// Layout:
//
//     Member verification
//     Verify your identity...
//     [Not verified] [Manage]
//
//     ┌──────────────────────────────────────────────────────────────┐
//     │ Profile photo                         Not started             │
//     │ A clear photo of you                                      │
//     ├──────────────────────────────────────────────────────────────┤
//     │ Government ID                         Not started             │
//     │ Government-issued identification                         │
//     └──────────────────────────────────────────────────────────────┘
//
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "MemberVerificationCard",
    ()=>MemberVerificationCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$verification$2f$verification$2d$requirement$2d$row$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/profile/verification/verification-requirement-row.tsx [app-client] (ecmascript)");
;
;
;
;
function MemberVerificationCard({ requirements, verified, onManage }) {
    // ---------------------------------------------------------------------------
    // Member Requirements
    // ---------------------------------------------------------------------------
    //
    // Member verification currently presents only the requirements belonging
    // to the member verification pathway.
    //
    // This is a presentation filter, not an eligibility calculation.
    //
    // VerificationRequirement does not expose a separate public requirement ID,
    // so the requirement type is the stable identity within this presentation
    // collection.
    //
    const memberRequirements = requirements.filter((requirement)=>requirement.type === 'PROFILE_PHOTO' || requirement.type === 'GOVERNMENT_ID');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "\r\n\n          flex\r\n\n          flex-col\r\n\n          gap-4\r\n\n          sm:flex-row\r\n\n          sm:items-center\r\n\n          sm:justify-between\r\n\n        ",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        "aria-hidden": "true",
                                        className: [
                                            'size-2 shrink-0 rounded-full',
                                            verified ? 'bg-[var(--success)]' : 'bg-[var(--brand)]'
                                        ].join(' ')
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/profile/verification/member-verification-card.tsx",
                                        lineNumber: 141,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-base font-semibold tracking-[-0.01em] text-[var(--foreground)]",
                                        children: "Member verification"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/profile/verification/member-verification-card.tsx",
                                        lineNumber: 151,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/profile/verification/member-verification-card.tsx",
                                lineNumber: 140,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1.5 max-w-xl text-sm leading-5 text-[var(--foreground-secondary)]",
                                children: "Verify your identity to build trust and unlock protected sisiMove marketplace actions."
                            }, void 0, false, {
                                fileName: "[project]/src/components/profile/verification/member-verification-card.tsx",
                                lineNumber: 156,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/profile/verification/member-verification-card.tsx",
                        lineNumber: 139,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "\r\n\n            flex\r\n\n            shrink-0\r\n\n            items-center\r\n\n            justify-between\r\n\n            gap-3\r\n\n            sm:justify-end\r\n\n          ",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                "aria-label": verified ? 'Member verification: Verified' : 'Member verification: Not verified',
                                className: [
                                    'inline-flex items-center gap-1.5',
                                    'rounded-full border px-2.5 py-1',
                                    'text-xs font-medium leading-none whitespace-nowrap',
                                    verified ? 'border-[var(--success-border)] bg-[var(--success-soft)] text-[var(--success)]' : 'border-[var(--border)] bg-[var(--background-subtle)] text-[var(--foreground-muted)]'
                                ].join(' '),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        "aria-hidden": "true",
                                        className: [
                                            'size-1.5 shrink-0 rounded-full',
                                            verified ? 'bg-[var(--success)]' : 'bg-[var(--foreground-subtle)]'
                                        ].join(' ')
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/profile/verification/member-verification-card.tsx",
                                        lineNumber: 191,
                                        columnNumber: 13
                                    }, this),
                                    verified ? 'Verified' : 'Not verified'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/profile/verification/member-verification-card.tsx",
                                lineNumber: 176,
                                columnNumber: 11
                            }, this),
                            onManage !== undefined ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                type: "button",
                                variant: "primary",
                                size: "sm",
                                onClick: onManage,
                                children: "Manage"
                            }, void 0, false, {
                                fileName: "[project]/src/components/profile/verification/member-verification-card.tsx",
                                lineNumber: 205,
                                columnNumber: 13
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/profile/verification/member-verification-card.tsx",
                        lineNumber: 166,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/profile/verification/member-verification-card.tsx",
                lineNumber: 129,
                columnNumber: 7
            }, this),
            memberRequirements.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                variant: "default",
                padding: "none",
                className: "\r\n\n            overflow-hidden\r\n\n            rounded-[var(--radius-2xl)]\r\n\n            border-[var(--border)]\r\n\n            bg-[var(--surface)]\r\n\n            shadow-[var(--shadow-sm)]\r\n\n          ",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "px-4 sm:px-5",
                    children: memberRequirements.map((requirement)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$verification$2f$verification$2d$requirement$2d$row$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VerificationRequirementRow"], {
                            requirement: requirement
                        }, requirement.type, false, {
                            fileName: "[project]/src/components/profile/verification/member-verification-card.tsx",
                            lineNumber: 240,
                            columnNumber: 15
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/components/profile/verification/member-verification-card.tsx",
                    lineNumber: 238,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/profile/verification/member-verification-card.tsx",
                lineNumber: 227,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "\r\n\n            rounded-[var(--radius-2xl)]\r\n\n            border\r\n\n            border-dashed\r\n\n            border-[var(--border-strong)]\r\n\n            bg-[var(--background-subtle)]\r\n\n            px-4\r\n\n            py-5\r\n\n            text-sm\r\n\n            leading-5\r\n\n            text-[var(--foreground-muted)]\r\n\n          ",
                children: "No member verification requirements are currently available."
            }, void 0, false, {
                fileName: "[project]/src/components/profile/verification/member-verification-card.tsx",
                lineNumber: 248,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/profile/verification/member-verification-card.tsx",
        lineNumber: 124,
        columnNumber: 5
    }, this);
}
_c = MemberVerificationCard;
var _c;
__turbopack_context__.k.register(_c, "MemberVerificationCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/profile/verification/verification-requirement-row.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Verification Requirement Row
// -----------------------------------------------------------------------------
//
// Presentation-only row for one verification requirement.
//
// Responsibilities:
// - Display the requirement name.
// - Display its current status.
// - Optionally display the rejection reason.
//
// Non-responsibilities:
// - Fetching verification data.
// - Submitting or cancelling requests.
// - Determining requirement status.
// - Performing verification.
// - Accessing VerificationRequest directly.
//
// Architecture:
// - Consumes the VerificationRequirement application/presentation model.
// - The requirement type identifies the requirement within this
//   presentation model.
// - requestPublicId and assetPublicId remain opaque and are not used to
//   construct links or asset URLs here.
// - Status presentation is delegated to VerificationRequirementStatus.
//
// Visual language:
// - Compact and highly scannable.
// - Uses sisiMove foreground and border tokens.
// - Status remains the primary state indicator.
// - Requirement identity is visually stronger than its description.
// - Mobile layouts allow the status to move below the requirement content.
// - Rejection details use the semantic danger palette without overpowering
//   the requirement itself.
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "VerificationRequirementRow",
    ()=>VerificationRequirementRow
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$verification$2f$verification$2d$requirement$2d$status$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/profile/verification/verification-requirement-status.tsx [app-client] (ecmascript)");
;
;
// -----------------------------------------------------------------------------
// Requirement Label
// -----------------------------------------------------------------------------
function getRequirementLabel(type) {
    switch(type){
        case 'PROFILE_PHOTO':
            return 'Profile photo';
        case 'GOVERNMENT_ID':
            return 'Government ID';
        case 'DRIVER_LICENSE':
            return 'Driver license';
        default:
            return 'Verification requirement';
    }
}
// -----------------------------------------------------------------------------
// Requirement Description
// -----------------------------------------------------------------------------
function getRequirementDescription(type) {
    switch(type){
        case 'PROFILE_PHOTO':
            return 'A clear photo of you';
        case 'GOVERNMENT_ID':
            return 'Government-issued identification';
        case 'DRIVER_LICENSE':
            return 'Valid driver licensing';
        default:
            return 'Verification information';
    }
}
function VerificationRequirementRow({ requirement }) {
    const label = getRequirementLabel(requirement.type);
    const description = getRequirementDescription(requirement.type);
    const hasRejection = requirement.rejectionReason !== null && requirement.rejectionReason.trim().length > 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "\r\n\n        border-b\r\n\n        border-[var(--border-subtle)]\r\n\n        py-4\r\n\n        last:border-b-0\r\n\n      ",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "\r\n\n          flex\r\n\n          flex-col\r\n\n          gap-3\r\n\n          sm:flex-row\r\n\n          sm:items-start\r\n\n          sm:justify-between\r\n\n          sm:gap-4\r\n\n        ",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-0 flex-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex min-w-0 items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        "aria-hidden": "true",
                                        className: "\r\n\n                h-1.5\r\n\n                w-1.5\r\n\n                shrink-0\r\n\n                rounded-full\r\n\n                bg-[var(--border-strong)]\r\n\n              "
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/profile/verification/verification-requirement-row.tsx",
                                        lineNumber: 149,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "truncate text-sm font-semibold text-[var(--foreground)]",
                                        children: label
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/profile/verification/verification-requirement-row.tsx",
                                        lineNumber: 160,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/profile/verification/verification-requirement-row.tsx",
                                lineNumber: 147,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "\r\n\n              mt-1\r\n\n              pl-3.5\r\n\n              text-xs\r\n\n              leading-5\r\n\n              text-[var(--foreground-muted)]\r\n\n            ",
                                children: description
                            }, void 0, false, {
                                fileName: "[project]/src/components/profile/verification/verification-requirement-row.tsx",
                                lineNumber: 166,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/profile/verification/verification-requirement-row.tsx",
                        lineNumber: 145,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "shrink-0 sm:pt-0.5",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$verification$2f$verification$2d$requirement$2d$status$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VerificationRequirementStatus"], {
                            status: requirement.status
                        }, void 0, false, {
                            fileName: "[project]/src/components/profile/verification/verification-requirement-row.tsx",
                            lineNumber: 185,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/profile/verification/verification-requirement-row.tsx",
                        lineNumber: 184,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/profile/verification/verification-requirement-row.tsx",
                lineNumber: 130,
                columnNumber: 7
            }, this),
            hasRejection ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "\r\n\n            ml-3.5\r\n\n            mt-3\r\n\n            rounded-[var(--radius-md)]\r\n\n            border\r\n\n            border-[var(--danger-border)]\r\n\n            bg-[var(--danger-soft)]\r\n\n            px-3\r\n\n            py-2.5\r\n\n          ",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "\r\n\n              text-xs\r\n\n              font-semibold\r\n\n              uppercase\r\n\n              tracking-[0.08em]\r\n\n              text-[var(--danger)]\r\n\n            ",
                        children: "Review note"
                    }, void 0, false, {
                        fileName: "[project]/src/components/profile/verification/verification-requirement-row.tsx",
                        lineNumber: 209,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "\r\n\n              mt-0.5\r\n\n              text-xs\r\n\n              leading-5\r\n\n              text-[var(--foreground-secondary)]\r\n\n            ",
                        children: requirement.rejectionReason
                    }, void 0, false, {
                        fileName: "[project]/src/components/profile/verification/verification-requirement-row.tsx",
                        lineNumber: 221,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/profile/verification/verification-requirement-row.tsx",
                lineNumber: 197,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/profile/verification/verification-requirement-row.tsx",
        lineNumber: 118,
        columnNumber: 5
    }, this);
}
_c = VerificationRequirementRow;
var _c;
__turbopack_context__.k.register(_c, "VerificationRequirementRow");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/profile/verification/verification-requirement-status.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Verification Requirement Status
// -----------------------------------------------------------------------------
//
// Presentation-only status indicator for one verification requirement.
//
// Responsibilities:
// - Display the current verification requirement status.
// - Provide consistent semantic visual treatment for each known status.
// - Keep status presentation compact and suitable for requirement rows.
//
// Non-responsibilities:
// - Determining verification status.
// - Submitting verification requests.
// - Fetching verification data.
// - Performing verification actions.
//
// Architecture:
// - Consumes the VerificationRequirementStatus presentation model.
// - Maps domain/application status values to human-readable UI labels.
// - Contains no API, hook, mutation, or verification workflow logic.
//
// Visual language:
// - Compact pill suitable for dense verification requirement lists.
// - Uses sisiMove semantic design tokens.
// - Status color communicates meaning through both text and a status dot.
// - Neutral states remain visually quiet.
// - Semantic states use success, warning, and danger tokens only where
//   they communicate meaningful verification lifecycle information.
// - No generic shadcn muted/destructive utility classes.
//
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "VerificationRequirementStatus",
    ()=>VerificationRequirementStatus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function getStatusPresentation(status) {
    switch(status){
        // -------------------------------------------------------------------------
        // Requirement has not yet entered the verification workflow.
        // -------------------------------------------------------------------------
        case 'NOT_STARTED':
            return {
                label: 'Not started',
                className: 'border-[var(--border)] bg-[var(--background-subtle)] text-[var(--foreground-muted)]',
                dotClassName: 'bg-[var(--foreground-subtle)]'
            };
        // -------------------------------------------------------------------------
        // Requirement has been submitted and is awaiting review.
        // -------------------------------------------------------------------------
        case 'PENDING':
            return {
                label: 'Pending review',
                className: 'border-[var(--warning-border)] bg-[var(--warning-soft)] text-[var(--warning)]',
                dotClassName: 'bg-[var(--warning)]'
            };
        // -------------------------------------------------------------------------
        // Requirement has been approved.
        // -------------------------------------------------------------------------
        case 'APPROVED':
            return {
                label: 'Verified',
                className: 'border-[var(--success-border)] bg-[var(--success-soft)] text-[var(--success)]',
                dotClassName: 'bg-[var(--success)]'
            };
        // -------------------------------------------------------------------------
        // Requirement was rejected and may require attention.
        // -------------------------------------------------------------------------
        case 'REJECTED':
            return {
                label: 'Rejected',
                className: 'border-[var(--danger-border)] bg-[var(--danger-soft)] text-[var(--danger)]',
                dotClassName: 'bg-[var(--danger)]'
            };
        // -------------------------------------------------------------------------
        // Requirement was cancelled.
        // -------------------------------------------------------------------------
        case 'CANCELLED':
            return {
                label: 'Cancelled',
                className: 'border-[var(--border)] bg-[var(--background-muted)] text-[var(--foreground-muted)]',
                dotClassName: 'bg-[var(--foreground-subtle)]'
            };
        // -------------------------------------------------------------------------
        // Defensive presentation fallback.
        //
        // The backend/application model remains authoritative. This fallback
        // prevents an unexpected value from producing an unstyled UI state.
        // -------------------------------------------------------------------------
        default:
            return {
                label: 'Unknown',
                className: 'border-[var(--border)] bg-[var(--background-subtle)] text-[var(--foreground-muted)]',
                dotClassName: 'bg-[var(--foreground-subtle)]'
            };
    }
}
function VerificationRequirementStatus({ status }) {
    const presentation = getStatusPresentation(status);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        "aria-label": `Verification status: ${presentation.label}`,
        className: [
            'inline-flex shrink-0 items-center gap-1.5',
            'rounded-full border px-2.5 py-1',
            'text-xs font-medium leading-none',
            'whitespace-nowrap',
            presentation.className
        ].join(' '),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                "aria-hidden": "true",
                className: [
                    'size-1.5 shrink-0 rounded-full',
                    presentation.dotClassName
                ].join(' ')
            }, void 0, false, {
                fileName: "[project]/src/components/profile/verification/verification-requirement-status.tsx",
                lineNumber: 171,
                columnNumber: 7
            }, this),
            presentation.label
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/profile/verification/verification-requirement-status.tsx",
        lineNumber: 161,
        columnNumber: 5
    }, this);
}
_c = VerificationRequirementStatus;
var _c;
__turbopack_context__.k.register(_c, "VerificationRequirementStatus");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/profile/verification/verification-section.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "VerificationSection",
    ()=>VerificationSection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$verification$2f$verification$2d$summary$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/profile/verification/verification-summary.tsx [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// sisiMove — Verification Section
// -----------------------------------------------------------------------------
//
// Authenticated profile section for managing traveller verification.
//
// Responsibilities:
// - Present the traveller's verification summary.
// - Provide the primary section-level Manage action.
// - Delegate detailed presentation to VerificationSummary.
//
// Non-responsibilities:
// - Fetching verification data.
// - Submitting verification requests.
// - Cancelling verification requests.
// - Reviewing verification requests.
// - Granting or rejecting verification.
//
// Those concerns belong to the verification feature's API/application layer.
//
// Architecture:
// - Presentation-only profile section.
// - Receives Verification and VerificationRequirement data from its parent.
// - Uses the shared Button primitive for section-level interaction.
// - Delegates verification-state presentation to VerificationSummary.
// - Does not access verification hooks or APIs.
// - Does not determine verification eligibility.
//
// Visual language:
// - Compact authenticated-profile section.
// - SisiMove blue identifies the section.
// - Section-level action remains lightweight and secondary.
// - Detailed verification actions remain delegated to VerificationSummary.
// - No additional card wrapper is introduced here; child surfaces own their
//   presentation treatment.
// -----------------------------------------------------------------------------
'use client';
;
;
;
function VerificationSection({ verification, requirements, onManage, onManageMember, onManageDriver }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "space-y-5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "\r\n\n          flex\r\n\n          flex-col\r\n\n          gap-3\r\n\n          sm:flex-row\r\n\n          sm:items-start\r\n\n          sm:justify-between\r\n\n        ",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        "aria-hidden": "true",
                                        className: "\r\n\n                size-2\r\n\n                shrink-0\r\n\n                rounded-full\r\n\n                bg-[var(--brand)]\r\n\n              "
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/profile/verification/verification-section.tsx",
                                        lineNumber: 116,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "\r\n\n                text-sm\r\n\n                font-semibold\r\n\n                uppercase\r\n\n                tracking-[0.08em]\r\n\n                text-[var(--foreground)]\r\n\n              ",
                                        children: "Verification"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/profile/verification/verification-section.tsx",
                                        lineNumber: 126,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/profile/verification/verification-section.tsx",
                                lineNumber: 114,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "\r\n\n              mt-1.5\r\n\n              max-w-2xl\r\n\n              text-sm\r\n\n              leading-5\r\n\n              text-[var(--foreground-secondary)]\r\n\n            ",
                                children: "Verify your identity and driving credentials for protected sisiMove actions."
                            }, void 0, false, {
                                fileName: "[project]/src/components/profile/verification/verification-section.tsx",
                                lineNumber: 140,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/profile/verification/verification-section.tsx",
                        lineNumber: 112,
                        columnNumber: 9
                    }, this),
                    onManage !== undefined ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        type: "button",
                        variant: "ghost",
                        size: "sm",
                        onClick: onManage,
                        className: "\r\n\n              self-start\r\n\n              shrink-0\r\n\n              text-[var(--brand)]\r\n\n              hover:bg-[var(--brand-soft)]\r\n\n              hover:text-[var(--brand-hover)]\r\n\n              focus-visible:ring-[var(--brand)]\r\n\n            ",
                        children: "Manage verification"
                    }, void 0, false, {
                        fileName: "[project]/src/components/profile/verification/verification-section.tsx",
                        lineNumber: 160,
                        columnNumber: 11
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/profile/verification/verification-section.tsx",
                lineNumber: 102,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$verification$2f$verification$2d$summary$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VerificationSummary"], {
                verification: verification,
                requirements: requirements,
                onManageMember: onManageMember,
                onManageDriver: onManageDriver
            }, void 0, false, {
                fileName: "[project]/src/components/profile/verification/verification-section.tsx",
                lineNumber: 183,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/profile/verification/verification-section.tsx",
        lineNumber: 97,
        columnNumber: 5
    }, this);
}
_c = VerificationSection;
var _c;
__turbopack_context__.k.register(_c, "VerificationSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/profile/verification/verification-summary.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Verification Summary
// -----------------------------------------------------------------------------
//
// Presentation-only summary of the traveller's verification state.
//
// Responsibilities:
// - Display the overall verification level/status.
// - Display member and driver verification cards.
// - Keep verification presentation grouped in one reusable component.
//
// Non-responsibilities:
// - Fetching verification data.
// - Determining verification state.
// - Submitting or cancelling verification requests.
// - Granting or rejecting verification.
//
// Architecture:
// - Consumes the Verification aggregate result and
//   VerificationRequirement presentation models.
// - Uses the shared Card primitive for the aggregate-level status surface.
// - Delegates requirement presentation to the member and driver cards.
// - Does not inspect VerificationRequest directly.
// - Does not derive verification from individual requirement statuses.
// - Verification.level is the authoritative source for the granted
//   verification level.
//
// Visual language:
// - Verification is presented as a compact trust/status surface.
// - SisiMove blue identifies granted verification.
// - Semantic colors are used only for meaningful verification states.
// - The summary remains compact, calm, and mobile-first.
// - Member and driver detail surfaces remain delegated to their own cards.
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "VerificationSummary",
    ()=>VerificationSummary
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$verification$2f$driver$2d$verification$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/profile/verification/driver-verification-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$verification$2f$member$2d$verification$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/profile/verification/member-verification-card.tsx [app-client] (ecmascript)");
;
;
;
;
// -----------------------------------------------------------------------------
// Verification Level Label
// -----------------------------------------------------------------------------
function getVerificationLabel(level) {
    switch(level){
        case 'DRIVER':
            return 'Driver verified';
        case 'MEMBER':
            return 'Member verified';
        case 'NONE':
        default:
            return 'Not verified';
    }
}
// -----------------------------------------------------------------------------
// Verification Status Description
// -----------------------------------------------------------------------------
function getVerificationDescription(level) {
    switch(level){
        case 'DRIVER':
            return 'Your identity is verified for member and driver participation.';
        case 'MEMBER':
            return 'Your identity is verified for member participation on sisiMove.';
        case 'NONE':
        default:
            return 'Complete verification to build trust and unlock verified participation.';
    }
}
// -----------------------------------------------------------------------------
// Verification Status Indicator
// -----------------------------------------------------------------------------
//
// This is intentionally presentation-only.
//
// The indicator does not determine verification. It receives the authoritative
// aggregate level and renders the corresponding visual state.
//
function VerificationStatusIndicator({ level }) {
    const verified = level === 'MEMBER' || level === 'DRIVER';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        "aria-hidden": "true",
        className: [
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-full',
            verified ? 'bg-[var(--brand-soft)]' : 'bg-[var(--background-muted)]'
        ].join(' '),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: [
                'flex h-6 w-6 items-center justify-center rounded-full',
                verified ? 'bg-[var(--brand)] text-[var(--brand-foreground)]' : 'bg-[var(--border-strong)] text-[var(--surface)]'
            ].join(' '),
            children: verified ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                viewBox: "0 0 20 20",
                fill: "none",
                className: "h-3.5 w-3.5",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "m5 10 3 3 7-7",
                    stroke: "currentColor",
                    strokeWidth: "2",
                    strokeLinecap: "round",
                    strokeLinejoin: "round"
                }, void 0, false, {
                    fileName: "[project]/src/components/profile/verification/verification-summary.tsx",
                    lineNumber: 161,
                    columnNumber: 13
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/profile/verification/verification-summary.tsx",
                lineNumber: 156,
                columnNumber: 11
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "h-2 w-2 rounded-full bg-current"
            }, void 0, false, {
                fileName: "[project]/src/components/profile/verification/verification-summary.tsx",
                lineNumber: 170,
                columnNumber: 11
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/profile/verification/verification-summary.tsx",
            lineNumber: 147,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/profile/verification/verification-summary.tsx",
        lineNumber: 138,
        columnNumber: 5
    }, this);
}
_c = VerificationStatusIndicator;
function VerificationSummary({ verification, requirements, onManageMember, onManageDriver }) {
    // ---------------------------------------------------------------------------
    // Aggregate verification state
    // ---------------------------------------------------------------------------
    //
    // IMPORTANT:
    // These values are derived only from Verification.level.
    //
    // Individual requirement statuses must never be used to infer whether
    // verification has been granted. The Verification aggregate remains the
    // authoritative source.
    //
    // DRIVER verification implies MEMBER verification.
    //
    const memberVerified = verification.level === 'MEMBER' || verification.level === 'DRIVER';
    const driverVerified = verification.level === 'DRIVER';
    const verified = verification.level === 'MEMBER' || verification.level === 'DRIVER';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                variant: "default",
                padding: "md",
                className: "\r\n\n          overflow-hidden\r\n\n          rounded-[var(--radius-2xl)]\r\n\n          border-[var(--border)]\r\n\n          bg-[var(--surface)]\r\n\n          shadow-[var(--shadow-sm)]\r\n\n        ",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-start gap-3.5 sm:gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(VerificationStatusIndicator, {
                            level: verification.level
                        }, void 0, false, {
                            fileName: "[project]/src/components/profile/verification/verification-summary.tsx",
                            lineNumber: 232,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "min-w-0 flex-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-wrap items-center gap-x-2 gap-y-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs font-semibold uppercase tracking-[0.12em] text-[var(--foreground-muted)]",
                                            children: "Verification status"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/profile/verification/verification-summary.tsx",
                                            lineNumber: 241,
                                            columnNumber: 15
                                        }, this),
                                        verified ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "\r\n\n                    inline-flex\r\n\n                    items-center\r\n\n                    gap-1.5\r\n\n                    rounded-full\r\n\n                    border\r\n\n                    border-[var(--success-border)]\r\n\n                    bg-[var(--success-soft)]\r\n\n                    px-2\r\n\n                    py-0.5\r\n\n                    text-[0.6875rem]\r\n\n                    font-semibold\r\n\n                    uppercase\r\n\n                    tracking-[0.08em]\r\n\n                    text-[var(--success)]\r\n\n                  ",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    "aria-hidden": "true",
                                                    className: "h-1.5 w-1.5 rounded-full bg-current"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/profile/verification/verification-summary.tsx",
                                                    lineNumber: 264,
                                                    columnNumber: 19
                                                }, this),
                                                "Verified"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/profile/verification/verification-summary.tsx",
                                            lineNumber: 246,
                                            columnNumber: 17
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "\r\n\n                    inline-flex\r\n\n                    items-center\r\n\n                    gap-1.5\r\n\n                    rounded-full\r\n\n                    border\r\n\n                    border-[var(--border)]\r\n\n                    bg-[var(--background-subtle)]\r\n\n                    px-2\r\n\n                    py-0.5\r\n\n                    text-[0.6875rem]\r\n\n                    font-semibold\r\n\n                    uppercase\r\n\n                    tracking-[0.08em]\r\n\n                    text-[var(--foreground-muted)]\r\n\n                  ",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    "aria-hidden": "true",
                                                    className: "h-1.5 w-1.5 rounded-full bg-[var(--foreground-subtle)]"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/profile/verification/verification-summary.tsx",
                                                    lineNumber: 290,
                                                    columnNumber: 19
                                                }, this),
                                                "Not verified"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/profile/verification/verification-summary.tsx",
                                            lineNumber: 272,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/profile/verification/verification-summary.tsx",
                                    lineNumber: 239,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-1.5 text-lg font-semibold tracking-[-0.015em] text-[var(--foreground)]",
                                    children: getVerificationLabel(verification.level)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/profile/verification/verification-summary.tsx",
                                    lineNumber: 301,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-1 text-sm leading-5 text-[var(--foreground-secondary)]",
                                    children: getVerificationDescription(verification.level)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/profile/verification/verification-summary.tsx",
                                    lineNumber: 305,
                                    columnNumber: 13
                                }, this),
                                verification.rejectionReason !== null ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    role: "alert",
                                    className: "\r\n\n                  mt-4\r\n\n                  rounded-[var(--radius-md)]\r\n\n                  border\r\n\n                  border-[var(--danger-border)]\r\n\n                  bg-[var(--danger-soft)]\r\n\n                  px-3.5\r\n\n                  py-3\r\n\n                ",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs font-semibold uppercase tracking-[0.1em] text-[var(--danger)]",
                                            children: "Review note"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/profile/verification/verification-summary.tsx",
                                            lineNumber: 326,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-1 text-sm leading-5 text-[var(--foreground-secondary)]",
                                            children: verification.rejectionReason
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/profile/verification/verification-summary.tsx",
                                            lineNumber: 330,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/profile/verification/verification-summary.tsx",
                                    lineNumber: 314,
                                    columnNumber: 15
                                }, this) : null
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/profile/verification/verification-summary.tsx",
                            lineNumber: 236,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/profile/verification/verification-summary.tsx",
                    lineNumber: 230,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/profile/verification/verification-summary.tsx",
                lineNumber: 219,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$verification$2f$member$2d$verification$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MemberVerificationCard"], {
                requirements: requirements,
                verified: memberVerified,
                onManage: onManageMember
            }, void 0, false, {
                fileName: "[project]/src/components/profile/verification/verification-summary.tsx",
                lineNumber: 344,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$verification$2f$driver$2d$verification$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DriverVerificationCard"], {
                requirements: requirements,
                verified: driverVerified,
                onManage: onManageDriver
            }, void 0, false, {
                fileName: "[project]/src/components/profile/verification/verification-summary.tsx",
                lineNumber: 354,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/profile/verification/verification-summary.tsx",
        lineNumber: 213,
        columnNumber: 5
    }, this);
}
_c1 = VerificationSummary;
var _c, _c1;
__turbopack_context__.k.register(_c, "VerificationStatusIndicator");
__turbopack_context__.k.register(_c1, "VerificationSummary");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/profile/visibility/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// -----------------------------------------------------------------------------
// sisiMove — Profile Visibility Components
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$visibility$2f$profile$2d$visibility$2d$section$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/profile/visibility/profile-visibility-section.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$visibility$2f$visibility$2d$option$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/profile/visibility/visibility-option.tsx [app-client] (ecmascript)");
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/profile/visibility/profile-visibility-section.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProfileVisibilitySection",
    ()=>ProfileVisibilitySection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$visibility$2f$visibility$2d$option$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/profile/visibility/visibility-option.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
// -----------------------------------------------------------------------------
// sisiMove — Profile Visibility Section
// -----------------------------------------------------------------------------
//
// Authenticated profile section for controlling traveller profile visibility.
//
// Responsibilities:
// - Present the available visibility options.
// - Maintain the currently selected value while editing.
// - Expose the Save action to the parent.
//
// Non-responsibilities:
// - Fetching the persisted visibility setting.
// - Persisting changes.
// - Enforcing visibility at the API/domain level.
// - Determining what information is exposed for each visibility level.
//
// The parent/profile workflow owns persistence and supplies the initial value.
//
// Architecture:
// - Local editing state belongs to this interactive presentation component.
// - Persistence remains outside this component.
// - The visibility value uses the same closed contract as VisibilityOption.
// - No useEffect is required to synchronize the initial value; the parent
//   owns the persisted value and this component represents the current edit
//   session.
//
// Visual language:
// - Compact authenticated-product section.
// - SisiMove blue is reserved for active interaction and the save action.
// - Unsaved changes are made visually obvious without becoming intrusive.
// - No additional visual tokens are introduced.
// -----------------------------------------------------------------------------
'use client';
;
;
;
// -----------------------------------------------------------------------------
// Visibility Options
// -----------------------------------------------------------------------------
const VISIBILITY_OPTIONS = [
    {
        value: 'PUBLIC',
        label: 'Public',
        description: 'Anyone can view your public traveller profile and trust information.'
    },
    {
        value: 'LIMITED',
        label: 'Limited',
        description: 'Only selected profile information is visible to other travellers.'
    },
    {
        value: 'PRIVATE',
        label: 'Private',
        description: 'Your traveller profile is not publicly discoverable.'
    }
];
function ProfileVisibilitySection({ value, onSave }) {
    _s();
    const [selectedVisibility, setSelectedVisibility] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(value);
    const hasChanges = selectedVisibility !== value;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        "aria-labelledby": "profile-visibility-title",
        className: "p-5 sm:p-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-2xl",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                "aria-hidden": "true",
                                className: "\r\n\n              h-2\r\n\n              w-2\r\n\n              shrink-0\r\n\n              rounded-full\r\n\n              bg-[var(--brand)]\r\n\n            "
                            }, void 0, false, {
                                fileName: "[project]/src/components/profile/visibility/profile-visibility-section.tsx",
                                lineNumber: 128,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                id: "profile-visibility-title",
                                className: "\r\n\n              text-base\r\n\n              font-semibold\r\n\n              tracking-[-0.01em]\r\n\n              text-[var(--foreground)]\r\n\n            ",
                                children: "Profile visibility"
                            }, void 0, false, {
                                fileName: "[project]/src/components/profile/visibility/profile-visibility-section.tsx",
                                lineNumber: 139,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/profile/visibility/profile-visibility-section.tsx",
                        lineNumber: 127,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1.5 text-sm leading-6 text-[var(--foreground-secondary)]",
                        children: "Choose how your traveller profile appears to other people on sisiMove."
                    }, void 0, false, {
                        fileName: "[project]/src/components/profile/visibility/profile-visibility-section.tsx",
                        lineNumber: 152,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/profile/visibility/profile-visibility-section.tsx",
                lineNumber: 126,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-5 space-y-2.5",
                role: "radiogroup",
                "aria-labelledby": "profile-visibility-title",
                children: VISIBILITY_OPTIONS.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$profile$2f$visibility$2f$visibility$2d$option$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VisibilityOption"], {
                        value: option.value,
                        label: option.label,
                        description: option.description,
                        selected: selectedVisibility === option.value,
                        onSelect: setSelectedVisibility
                    }, option.value, false, {
                        fileName: "[project]/src/components/profile/visibility/profile-visibility-section.tsx",
                        lineNumber: 168,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/profile/visibility/profile-visibility-section.tsx",
                lineNumber: 162,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: [
                    'mt-5 flex flex-col gap-3 border-t pt-4',
                    'sm:flex-row sm:items-center sm:justify-between',
                    'border-[var(--border-subtle)]'
                ].join(' '),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-h-5",
                        children: hasChanges ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs font-medium text-[var(--foreground-muted)]",
                            children: "You have unsaved changes."
                        }, void 0, false, {
                            fileName: "[project]/src/components/profile/visibility/profile-visibility-section.tsx",
                            lineNumber: 194,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-[var(--foreground-subtle)]",
                            children: "Your current visibility is saved."
                        }, void 0, false, {
                            fileName: "[project]/src/components/profile/visibility/profile-visibility-section.tsx",
                            lineNumber: 198,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/profile/visibility/profile-visibility-section.tsx",
                        lineNumber: 192,
                        columnNumber: 9
                    }, this),
                    onSave !== undefined ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        type: "button",
                        variant: "primary",
                        size: "md",
                        onClick: ()=>onSave(selectedVisibility),
                        disabled: !hasChanges,
                        className: "\r\n\n              w-full\r\n\n              sm:w-auto\r\n\n            ",
                        children: "Save visibility"
                    }, void 0, false, {
                        fileName: "[project]/src/components/profile/visibility/profile-visibility-section.tsx",
                        lineNumber: 205,
                        columnNumber: 11
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/profile/visibility/profile-visibility-section.tsx",
                lineNumber: 185,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/profile/visibility/profile-visibility-section.tsx",
        lineNumber: 118,
        columnNumber: 5
    }, this);
}
_s(ProfileVisibilitySection, "GdsjFNrQAxzvmOF1Iat76P/MiqM=");
_c = ProfileVisibilitySection;
var _c;
__turbopack_context__.k.register(_c, "ProfileVisibilitySection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/profile/visibility/visibility-option.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// -----------------------------------------------------------------------------
// sisiMove — Profile Visibility Option
// -----------------------------------------------------------------------------
//
// Presentation-only option used by the authenticated profile's
// Profile Visibility section.
//
// Responsibilities:
// - Present one visibility choice.
// - Indicate whether the option is currently selected.
// - Notify the parent when the option is selected.
//
// Non-responsibilities:
// - Persisting visibility changes.
// - Fetching the current visibility.
// - Performing authorization or privacy enforcement.
//
// Architecture:
// - Pure presentation component.
// - Does not import the Traveller Profile model because the option only needs
//   a value, label, and description for rendering.
// - Persistence remains the responsibility of ProfileVisibilitySection and
//   the profile visibility mutation boundary.
//
// Visual language:
// - SisiMove blue identifies the active selection.
// - White surfaces preserve the clean authenticated-product feel.
// - Subtle borders and restrained shadows provide hierarchy.
// - The entire option remains a comfortable mobile touch target.
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "VisibilityOption",
    ()=>VisibilityOption
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function VisibilityOption({ value, label, description, selected, onSelect }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
        className: [
            'group relative flex min-h-16 cursor-pointer items-start gap-3.5',
            'rounded-[var(--radius-lg)] border p-4',
            'transition-[border-color,background-color,box-shadow]',
            'duration-150',
            'focus-within:outline-none',
            'focus-within:ring-2',
            'focus-within:ring-[var(--brand)]',
            'focus-within:ring-offset-2',
            'focus-within:ring-offset-[var(--surface)]',
            selected ? [
                'border-[var(--brand)]',
                'bg-[var(--brand-soft)]',
                'shadow-[var(--shadow-sm)]'
            ].join(' ') : [
                'border-[var(--border)]',
                'bg-[var(--surface)]',
                'hover:border-[var(--border-strong)]',
                'hover:bg-[var(--background-subtle)]'
            ].join(' ')
        ].join(' '),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: [
                    'relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center',
                    'rounded-full border transition-colors',
                    selected ? 'border-[var(--brand)]' : [
                        'border-[var(--border-strong)]',
                        'group-hover:border-[var(--foreground-muted)]'
                    ].join(' ')
                ].join(' '),
                "aria-hidden": "true",
                children: selected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "\r\n\n              h-2.5\r\n\n              w-2.5\r\n\n              rounded-full\r\n\n              bg-[var(--brand)]\r\n\n            "
                }, void 0, false, {
                    fileName: "[project]/src/components/profile/visibility/visibility-option.tsx",
                    lineNumber: 127,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/profile/visibility/visibility-option.tsx",
                lineNumber: 113,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: "radio",
                name: "profile-visibility",
                value: value,
                checked: selected,
                onChange: ()=>onSelect(value),
                className: "sr-only"
            }, void 0, false, {
                fileName: "[project]/src/components/profile/visibility/visibility-option.tsx",
                lineNumber: 138,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "min-w-0 flex-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: [
                            'block text-sm font-semibold leading-5',
                            selected ? 'text-[var(--foreground)]' : 'text-[var(--foreground)]'
                        ].join(' '),
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/src/components/profile/visibility/visibility-option.tsx",
                        lineNumber: 152,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "mt-1 block max-w-2xl text-sm leading-5 text-[var(--foreground-secondary)]",
                        children: description
                    }, void 0, false, {
                        fileName: "[project]/src/components/profile/visibility/visibility-option.tsx",
                        lineNumber: 163,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/profile/visibility/visibility-option.tsx",
                lineNumber: 151,
                columnNumber: 7
            }, this),
            selected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "\r\n\n            hidden\r\n\n            shrink-0\r\n\n            rounded-full\r\n\n            bg-[var(--brand)]\r\n\n            px-2.5\r\n\n            py-1\r\n\n            text-[0.6875rem]\r\n\n            font-semibold\r\n\n            uppercase\r\n\n            tracking-[0.08em]\r\n\n            text-[var(--brand-foreground)]\r\n\n            sm:inline-flex\r\n\n          ",
                children: "Selected"
            }, void 0, false, {
                fileName: "[project]/src/components/profile/visibility/visibility-option.tsx",
                lineNumber: 173,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/profile/visibility/visibility-option.tsx",
        lineNumber: 84,
        columnNumber: 5
    }, this);
}
_c = VisibilityOption;
var _c;
__turbopack_context__.k.register(_c, "VisibilityOption");
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
"[project]/src/features/assets/api/assets.api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "archiveAsset",
    ()=>archiveAsset,
    "changeAssetVisibility",
    ()=>changeAssetVisibility,
    "deleteAsset",
    ()=>deleteAsset,
    "getMyAssets",
    ()=>getMyAssets,
    "uploadAsset",
    ()=>uploadAsset
]);
// -----------------------------------------------------------------------------
// sisiMove — My Assets API
// -----------------------------------------------------------------------------
//
// Authenticated HTTP operations for Assets belonging to the currently
// authenticated Identity.
//
// Backend routes:
//
//   GET    /assets/owner
//   POST   /assets
//   PATCH  /assets/:assetPublicId/archive
//   DELETE /assets/:assetPublicId
//   PATCH  /assets/:assetPublicId/visibility
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
 * Base route for the Asset HTTP controller.
 *
 * NestJS:
 *
 *     @Controller('assets')
 */ const ASSETS_PATH = '/assets';
async function getMyAssets() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$http$2f$authenticated$2d$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authenticatedApiClient"].get(`${ASSETS_PATH}/owner`);
}
async function uploadAsset(input) {
    const formData = new FormData();
    formData.append('file', input.file);
    formData.append('type', input.type);
    formData.append('category', input.category);
    if (input.visibility !== undefined) {
        formData.append('visibility', input.visibility);
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$http$2f$authenticated$2d$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authenticatedApiClient"].post(ASSETS_PATH, formData);
}
async function archiveAsset(assetPublicId) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$http$2f$authenticated$2d$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authenticatedApiClient"].patch(`${ASSETS_PATH}/${encodeURIComponent(assetPublicId)}/archive`);
}
async function deleteAsset(assetPublicId) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$http$2f$authenticated$2d$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authenticatedApiClient"].delete(`${ASSETS_PATH}/${encodeURIComponent(assetPublicId)}`);
}
async function changeAssetVisibility(assetPublicId, input) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$http$2f$authenticated$2d$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authenticatedApiClient"].patch(`${ASSETS_PATH}/${encodeURIComponent(assetPublicId)}/visibility`, input);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/assets/api/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// -----------------------------------------------------------------------------
// sisiMove — Asset API
// -----------------------------------------------------------------------------
//
// Public export surface for Asset HTTP operations.
//
// Consumers should import Asset API functions through:
//
//     import {
//       getMyAssets,
//       uploadAsset,
//       archiveAsset,
//       deleteAsset,
//       changeAssetVisibility,
//     } from "@/features/assets/api";
//
// Public Asset delivery remains separately exposed through:
//
//     getPublicAsset
//
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// Public Asset API
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$assets$2f$api$2f$public$2d$assets$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/assets/api/public-assets.api.ts [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// Authenticated Asset API
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$assets$2f$api$2f$assets$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/assets/api/assets.api.ts [app-client] (ecmascript)");
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/assets/api/public-assets.api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getPublicAsset",
    ()=>getPublicAsset
]);
// -----------------------------------------------------------------------------
// sisiMove — Public Asset API
// -----------------------------------------------------------------------------
//
// Frontend adapter for the public Asset reference boundary.
//
// The frontend does not mirror the Asset aggregate. Public experiences consume
// only the reduced representation required for rendering:
//
//     PublicAsset
//     ├── publicId
//     ├── url
//     └── alt
//
// The public Asset reference endpoint is responsible for resolving the
// browser-facing delivery URL:
//
//     GET /assets/public/:assetPublicId/reference
//
// The returned URL is then used by the browser to retrieve the actual Asset:
//
//     GET /assets/public/:assetPublicId
//
// -----------------------------------------------------------------------------
//
// ARCHITECTURE
// -----------------------------------------------------------------------------
//
// Public Journey / Traveller / Trust read model
//       │
//       │ Asset public ID
//       ▼
// getPublicAsset()
//       │
//       ▼
// GET /assets/public/:assetPublicId/reference
//       │
//       ▼
// AssetsController
//       │
//       ▼
// GetPublicAssetReferenceQueryHandler
//       │
//       ├── AssetRepository
//       │
//       └── AssetDeliveryPort
//                  │
//                  ▼
//             public HTTP URL
//                  │
//                  ▼
//             PublicAsset
//                  │
//                  └── url
//                       │
//                       ▼
//             GET /assets/public/:assetPublicId
//                       │
//                       ▼
//             GetPublicAssetContentHandler
//                       │
//                       ▼
//                 AssetStoragePort
//                       │
//                       ▼
//                 physical storage
//
// -----------------------------------------------------------------------------
//
// IMPORTANT
// -----------------------------------------------------------------------------
//
// There are two separate public Asset operations.
//
// 1. PUBLIC ASSET REFERENCE
//
//     GET /assets/public/:assetPublicId/reference
//
// This is a JSON API operation.
//
// It resolves a public Asset into a reduced public reference:
//
//     {
//       publicId,
//       url
//     }
//
// The backend AssetDeliveryPort owns URL resolution.
//
// The frontend does not know whether the resulting URL points to:
//
// - the backend API;
// - a CDN;
// - Bunny;
// - S3;
// - another delivery infrastructure.
//
//
//
// 2. PUBLIC ASSET CONTENT
//
//     GET /assets/public/:assetPublicId
//
// This is the actual binary delivery endpoint.
//
// The browser uses the URL returned by the reference operation to retrieve
// the Asset content.
//
// The backend remains responsible for:
//
// - resolving the Asset;
// - checking public visibility;
// - checking Asset lifecycle state;
// - retrieving physical content;
// - streaming the content.
//
// -----------------------------------------------------------------------------
//
// AUTHENTICATED ASSET MANAGEMENT
// -----------------------------------------------------------------------------
//
// The authenticated Asset-domain endpoint:
//
//     GET /assets/:assetPublicId
//
// is NOT used here.
//
// That endpoint belongs to the authenticated Asset management boundary.
//
// Public Asset consumption is deliberately separated from authenticated Asset
// management.
//
// -----------------------------------------------------------------------------
//
// PUBLIC ASSET REPRESENTATION
// -----------------------------------------------------------------------------
//
// PublicAsset is a frontend render model:
//
//     PublicAsset
//     ├── publicId
//     ├── url
//     └── alt
//
// The backend public reference response may only contain:
//
//     publicId
//     url
//
// `alt` is presentation metadata owned by the consuming public read model.
//
// For example, a Journey read model may provide:
//
//     asset: {
//       publicId: "...",
//       url: "...",
//       alt: "Vehicle exterior"
//     }
//
// The Asset reference endpoint therefore does not need to invent semantic
// alternative text from an opaque Asset identifier.
//
// -----------------------------------------------------------------------------
//
// NO LOCAL URL CONSTRUCTION
// -----------------------------------------------------------------------------
//
// This adapter deliberately does NOT construct:
//
//     /assets/public/:assetPublicId
//
// from `apiConfig.baseUrl`.
//
// The backend now owns public Asset URL resolution through:
//
//     AssetDeliveryPort
//
// This is important because the physical delivery location may change without
// requiring frontend knowledge of the storage implementation.
//
// The frontend consumes the URL returned by the public reference endpoint.
//
// -----------------------------------------------------------------------------
//
// NO BINARY REQUEST HERE
// -----------------------------------------------------------------------------
//
// `getPublicAsset()` does not retrieve the Asset binary.
//
// It performs only the public reference request:
//
//     GET /assets/public/:assetPublicId/reference
//
// The returned `url` is subsequently consumed by the browser:
//
//     <img src={asset.url} />
//
//     <Image src={asset.url} ... />
//
//     background-image: url(...)
//
// The browser therefore performs the actual binary request independently.
//
// -----------------------------------------------------------------------------
//
// MULTIPLE PUBLIC ASSETS
// -----------------------------------------------------------------------------
//
// A public Journey may contain multiple Asset references:
//
//     Journey
//     ├── provider.avatar
//     ├── trust.badges[].asset
//     ├── vehicle.asset
//     └── journey.assets[]
//
// The public Journey read boundary should normally provide the complete
// reduced PublicAsset representation for these references.
//
// This adapter exists for cases where a public Asset reference genuinely needs
// to be resolved independently.
//
// It must NOT become an N+1 Asset-discovery mechanism for Journey cards.
//
// For example, a Journey listing containing 20 cards with provider avatars
// should not perform 20 independent Asset reference requests when the Journey
// public read model can already provide the required PublicAsset objects.
//
// -----------------------------------------------------------------------------
//
// TRUST USE CASE
// -----------------------------------------------------------------------------
//
// Trust badges are an important consumer of this boundary.
//
// Trust may store only:
//
//     assetPublicId
//
// as an opaque reference.
//
// When a public Trust representation needs to resolve that Asset independently,
// this adapter can consume:
//
//     GET /assets/public/:assetPublicId/reference
//
// and obtain the public delivery URL.
//
// The frontend Trust model should ultimately consume:
//
//     PublicAsset
//
// rather than exposing the internal Trust Badge asset reference mechanics to
// presentation components.
//
// -----------------------------------------------------------------------------
//
// API BASE URL
// -----------------------------------------------------------------------------
//
// The reference request uses the same configured API base URL as the rest of
// the frontend application.
//
// This prevents the frontend from assuming:
//
//     frontend origin === backend origin
//
// For example:
//
//     frontend → localhost:3000
//     backend  → localhost:3001/api/v1
//
// The shared API client remains responsible for applying the configured API
// base URL and HTTP behavior.
//
// -----------------------------------------------------------------------------
//
// HTTP CLIENT
// -----------------------------------------------------------------------------
//
// Unlike the previous URL-builder implementation, this adapter DOES use the
// shared `apiClient`.
//
// That is intentional.
//
// The public Asset reference endpoint is a genuine JSON API operation:
//
//     GET /assets/public/:assetPublicId/reference
//
// Therefore it belongs behind the shared frontend HTTP transport.
//
// The adapter does not instantiate its own fetch client.
//
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$http$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/http/api-client.ts [app-client] (ecmascript)");
;
// =============================================================================
// Public Asset Reference Route
// =============================================================================
//
// This route matches the backend AssetsController:
//
//     GET /assets/public/:assetPublicId/reference
//
// `apiClient` is responsible for combining this path with the configured API
// base URL.
//
// =============================================================================
const PUBLIC_ASSET_REFERENCE_API_PATH = '/assets/public';
async function getPublicAsset(publicId, alt = '') {
    const normalizedPublicId = publicId.trim();
    if (normalizedPublicId.length === 0) {
        throw new Error('Asset public ID is required.');
    }
    const reference = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$http$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].get(`${PUBLIC_ASSET_REFERENCE_API_PATH}/${encodeURIComponent(normalizedPublicId)}/reference`);
    return {
        publicId: reference.publicId,
        url: reference.url,
        alt
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/assets/hooks/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// -----------------------------------------------------------------------------
// sisiMove — Asset Hook Exports
// -----------------------------------------------------------------------------
//
// Public export surface for Asset hooks.
//
// Consumers should import Asset hooks through:
//
//     import {
//       useAsset,
//       usePublicAsset,
//     } from '@/features/assets/hooks';
//
// The hooks represent two distinct boundaries:
//
//     useAsset()
//         ↓
//     Authenticated Asset management
//
//     usePublicAsset()
//         ↓
//     Public Asset delivery
//
// -----------------------------------------------------------------------------
// =============================================================================
// Authenticated Asset
// =============================================================================
//
// Manages Assets belonging to the currently authenticated Identity.
//
// Includes:
//
//     - loadAssets()
//     - upload()
//     - archive()
//     - remove()
//     - changeVisibility()
//     - clearError()
//
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$assets$2f$hooks$2f$use$2d$asset$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/assets/hooks/use-asset.ts [app-client] (ecmascript)");
// =============================================================================
// Public Asset
// =============================================================================
//
// Provides access to the public Asset delivery boundary.
//
// Public Asset delivery is intentionally separate from authenticated Asset
// management.
//
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$assets$2f$hooks$2f$use$2d$public$2d$asset$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/assets/hooks/use-public-asset.ts [app-client] (ecmascript)");
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/assets/hooks/use-asset.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAsset",
    ()=>useAsset
]);
// -----------------------------------------------------------------------------
// sisiMove — Asset Hook
// -----------------------------------------------------------------------------
//
// React hook for authenticated Asset operations.
//
// This hook provides the presentation layer with access to the current
// identity's Assets without exposing HTTP-client details.
//
// Architecture:
//
//     Component
//        │
//        ▼
//     useAsset()
//        │
//        ▼
//     Asset API
//        │
//        ▼
//     authenticatedApiClient
//        │
//        ▼
//     AssetController
//
// -----------------------------------------------------------------------------
//
// SECURITY
//
// Ownership is never supplied by the component.
//
// The authenticated backend derives ownership from:
//
//     access token
//          ↓
//     JwtAuthGuard
//          ↓
//     CurrentIdentity
//          ↓
//     authenticated identity
//
// The frontend therefore never sends:
//
//     ownerIdentityId
//     ownerPublicId
//
// for owner-scoped operations.
//
// -----------------------------------------------------------------------------
//
// AVAILABLE OPERATIONS
//
//     getMyAssets()
//     uploadAsset()
//     archiveAsset()
//     deleteAsset()
//     changeAssetVisibility()
//
// Public Asset delivery is intentionally NOT included here.
//
// Public Asset reads belong to:
//
//     public-assets.api.ts
//
// and use the public Asset delivery boundary.
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$assets$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/assets/api/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$assets$2f$api$2f$assets$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/assets/api/assets.api.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
// =============================================================================
// Error Normalization
// =============================================================================
function toAssetError(error) {
    if (error instanceof Error) {
        return error;
    }
    if (typeof error === 'string') {
        return new Error(error);
    }
    return new Error('An Asset operation failed.');
}
function useAsset() {
    _s();
    const [assets, setAssets] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // ---------------------------------------------------------------------------
    // Error
    // ---------------------------------------------------------------------------
    const clearError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAsset.useCallback[clearError]": ()=>{
            setError(null);
        }
    }["useAsset.useCallback[clearError]"], []);
    // ---------------------------------------------------------------------------
    // Load Assets
    // ---------------------------------------------------------------------------
    const loadAssets = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAsset.useCallback[loadAssets]": async ()=>{
            setIsLoading(true);
            setError(null);
            try {
                const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$assets$2f$api$2f$assets$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMyAssets"])();
                setAssets(result);
                return result;
            } catch (cause) {
                const assetError = toAssetError(cause);
                setError(assetError);
                throw assetError;
            } finally{
                setIsLoading(false);
            }
        }
    }["useAsset.useCallback[loadAssets]"], []);
    // ---------------------------------------------------------------------------
    // Upload
    // ---------------------------------------------------------------------------
    const upload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAsset.useCallback[upload]": async (input)=>{
            setIsLoading(true);
            setError(null);
            try {
                const asset = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$assets$2f$api$2f$assets$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["uploadAsset"])(input);
                setAssets({
                    "useAsset.useCallback[upload]": (currentAssets)=>[
                            ...currentAssets,
                            asset
                        ]
                }["useAsset.useCallback[upload]"]);
                return asset;
            } catch (cause) {
                const assetError = toAssetError(cause);
                setError(assetError);
                throw assetError;
            } finally{
                setIsLoading(false);
            }
        }
    }["useAsset.useCallback[upload]"], []);
    // ---------------------------------------------------------------------------
    // Archive
    // ---------------------------------------------------------------------------
    const archive = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAsset.useCallback[archive]": async (assetPublicId)=>{
            setIsLoading(true);
            setError(null);
            try {
                const asset = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$assets$2f$api$2f$assets$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["archiveAsset"])(assetPublicId);
                setAssets({
                    "useAsset.useCallback[archive]": (currentAssets)=>currentAssets.map({
                            "useAsset.useCallback[archive]": (currentAsset)=>currentAsset.publicId === asset.publicId ? asset : currentAsset
                        }["useAsset.useCallback[archive]"])
                }["useAsset.useCallback[archive]"]);
                return asset;
            } catch (cause) {
                const assetError = toAssetError(cause);
                setError(assetError);
                throw assetError;
            } finally{
                setIsLoading(false);
            }
        }
    }["useAsset.useCallback[archive]"], []);
    // ---------------------------------------------------------------------------
    // Delete
    // ---------------------------------------------------------------------------
    const remove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAsset.useCallback[remove]": async (assetPublicId)=>{
            setIsLoading(true);
            setError(null);
            try {
                const asset = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$assets$2f$api$2f$assets$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteAsset"])(assetPublicId);
                setAssets({
                    "useAsset.useCallback[remove]": (currentAssets)=>currentAssets.map({
                            "useAsset.useCallback[remove]": (currentAsset)=>currentAsset.publicId === asset.publicId ? asset : currentAsset
                        }["useAsset.useCallback[remove]"])
                }["useAsset.useCallback[remove]"]);
                return asset;
            } catch (cause) {
                const assetError = toAssetError(cause);
                setError(assetError);
                throw assetError;
            } finally{
                setIsLoading(false);
            }
        }
    }["useAsset.useCallback[remove]"], []);
    // ---------------------------------------------------------------------------
    // Change Visibility
    // ---------------------------------------------------------------------------
    const changeVisibility = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAsset.useCallback[changeVisibility]": async (assetPublicId, input)=>{
            setIsLoading(true);
            setError(null);
            try {
                const asset = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$assets$2f$api$2f$assets$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["changeAssetVisibility"])(assetPublicId, input);
                setAssets({
                    "useAsset.useCallback[changeVisibility]": (currentAssets)=>currentAssets.map({
                            "useAsset.useCallback[changeVisibility]": (currentAsset)=>currentAsset.publicId === asset.publicId ? asset : currentAsset
                        }["useAsset.useCallback[changeVisibility]"])
                }["useAsset.useCallback[changeVisibility]"]);
                return asset;
            } catch (cause) {
                const assetError = toAssetError(cause);
                setError(assetError);
                throw assetError;
            } finally{
                setIsLoading(false);
            }
        }
    }["useAsset.useCallback[changeVisibility]"], []);
    // ---------------------------------------------------------------------------
    // Result
    // ---------------------------------------------------------------------------
    return {
        assets,
        isLoading,
        error,
        loadAssets,
        upload,
        archive,
        remove,
        changeVisibility,
        clearError
    };
}
_s(useAsset, "pDrnzyUp87dxDa75rueZGOFCTc8=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/assets/hooks/use-public-asset.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePublicAsset",
    ()=>usePublicAsset
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$assets$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/assets/api/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$assets$2f$api$2f$public$2d$assets$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/assets/api/public-assets.api.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
// -----------------------------------------------------------------------------
// sisiMove — Public Asset Hook
// -----------------------------------------------------------------------------
//
// React hook for resolving one publicly renderable Asset.
//
// The hook owns only the small amount of frontend composition required to
// expose a PublicAsset to a React component.
//
// The actual public Asset reference is resolved through:
//
//     getPublicAsset()
//           │
//           ▼
//     GET /assets/public/:assetPublicId/reference
//
// The hook does NOT:
//
// - call fetch directly;
// - construct storage URLs;
// - resolve storage infrastructure;
// - access Asset infrastructure;
// - mirror Asset domain state;
// - perform Asset authorization;
// - transform storage metadata;
// - duplicate API transport logic.
//
// The actual Asset binary is requested independently by the browser through
// `PublicAsset.url`.
//
// -----------------------------------------------------------------------------
//
// ARCHITECTURE
// -----------------------------------------------------------------------------
//
// React component
//       │
//       ▼
// usePublicAsset()
//       │
//       ▼
// getPublicAsset()
//       │
//       ▼
// Public Asset reference API
//       │
//       ▼
// PublicAsset
//       │
//       └── url
//             │
//             ▼
//       Browser requests Asset content
//
// -----------------------------------------------------------------------------
//
// IMPORTANT
// -----------------------------------------------------------------------------
//
// `getPublicAsset()` is an asynchronous API adapter.
//
// It performs:
//
//     GET /assets/public/:assetPublicId/reference
//
// Therefore this hook must not attempt to synchronously return the Promise
// produced by `getPublicAsset()`.
//
// The hook owns the asynchronous lifecycle:
//
//     idle/loading
//          │
//          ▼
//       success
//          │
//          └── PublicAsset
//
// or:
//
//     loading
//          │
//          ▼
//        error
//
// The effect itself does not synchronously call setState. State changes occur
// only when the asynchronous Asset resolution succeeds or fails.
//
// -----------------------------------------------------------------------------
//
// MULTIPLE PUBLIC ASSETS
// -----------------------------------------------------------------------------
//
// A public Journey can contain multiple Assets:
//
//     Journey
//     ├── provider.avatar
//     ├── trust.badges[].asset
//     ├── vehicle.asset
//     └── journey.assets[]
//
// The preferred architecture is for the public Journey read model to provide
// these PublicAsset objects directly.
//
// This hook is therefore a convenience for independently resolving a single
// public Asset representation, not a replacement for the Journey read model
// composition boundary.
//
// -----------------------------------------------------------------------------
//
// OPTIONAL ASSET REFERENCES
// -----------------------------------------------------------------------------
//
// When the reference is absent:
//
//     usePublicAsset(undefined)
//
// the hook returns:
//
//     {
//       asset: null,
//       isLoading: false,
//       error: null,
//     }
//
// No HTTP request is made.
//
// -----------------------------------------------------------------------------
'use client';
;
;
function usePublicAsset(publicId) {
    _s();
    const normalizedPublicId = publicId?.trim() ?? '';
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "usePublicAsset.useState": ()=>({
                publicId: normalizedPublicId,
                asset: null,
                error: null
            })
    }["usePublicAsset.useState"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "usePublicAsset.useEffect": ()=>{
            if (normalizedPublicId.length === 0) {
                return;
            }
            let cancelled = false;
            void (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$assets$2f$api$2f$public$2d$assets$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPublicAsset"])(normalizedPublicId).then({
                "usePublicAsset.useEffect": (resolvedAsset)=>{
                    if (cancelled) {
                        return;
                    }
                    setState({
                        publicId: normalizedPublicId,
                        asset: resolvedAsset,
                        error: null
                    });
                }
            }["usePublicAsset.useEffect"]).catch({
                "usePublicAsset.useEffect": (cause)=>{
                    if (cancelled) {
                        return;
                    }
                    const resolvedError = cause instanceof Error ? cause : new Error('Failed to resolve public Asset.');
                    setState({
                        publicId: normalizedPublicId,
                        asset: null,
                        error: resolvedError
                    });
                }
            }["usePublicAsset.useEffect"]);
            return ({
                "usePublicAsset.useEffect": ()=>{
                    cancelled = true;
                }
            })["usePublicAsset.useEffect"];
        }
    }["usePublicAsset.useEffect"], [
        normalizedPublicId
    ]);
    // ---------------------------------------------------------------------------
    // No Asset reference
    // ---------------------------------------------------------------------------
    //
    // This is derived directly from the input rather than being represented by
    // another state update inside the effect.
    //
    if (normalizedPublicId.length === 0) {
        return {
            asset: null,
            isLoading: false,
            error: null
        };
    }
    // ---------------------------------------------------------------------------
    // Current request has not completed
    // ---------------------------------------------------------------------------
    //
    // When the requested publicId changes, the previous state may still contain
    // the previous Asset. Do not expose that stale Asset as the result for the
    // new publicId.
    //
    // Instead, the current input itself determines that the new request is
    // loading until the asynchronous operation commits matching state.
    //
    if (state.publicId !== normalizedPublicId) {
        return {
            asset: null,
            isLoading: true,
            error: null
        };
    }
    // ---------------------------------------------------------------------------
    // Current request has completed
    // ---------------------------------------------------------------------------
    return {
        asset: state.asset,
        isLoading: false,
        error: state.error
    };
}
_s(usePublicAsset, "NMQtt6smGQQyOJ1X9WbzbPYJDHI=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/assets/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// -----------------------------------------------------------------------------
// sisiMove — Assets Feature Public API
// -----------------------------------------------------------------------------
//
// Public feature boundary for Asset consumption.
//
// Consumers should import Asset functionality from:
//
//     @/features/assets
//
// rather than reaching into:
//
//     @/features/assets/api/...
//     @/features/assets/models/...
//     @/features/assets/hooks/...
//
// This keeps the internal Assets feature structure private and allows the
// implementation to evolve without forcing changes throughout the application.
//
// -----------------------------------------------------------------------------
//
// INTERNAL FEATURE STRUCTURE
// -----------------------------------------------------------------------------
//
//     assets/
//     ├── api/
//     │   ├── assets.api.ts
//     │   └── public-assets.api.ts
//     │
//     ├── models/
//     │   ├── asset.ts
//     │   └── public-asset.ts
//     │
//     ├── hooks/
//     │   ├── use-asset.ts
//     │   └── use-public-asset.ts
//     │
//     └── index.ts
//
// -----------------------------------------------------------------------------
//
// PUBLIC FEATURE CONTRACT
// -----------------------------------------------------------------------------
//
// AUTHENTICATED ASSET MANAGEMENT
//
// API
//     getMyAssets()
//     uploadAsset()
//     archiveAsset()
//     deleteAsset()
//     changeAssetVisibility()
//
// Models
//     Asset
//
// Hooks
//     useAsset()
//
// -----------------------------------------------------------------------------
//
// PUBLIC ASSET DELIVERY
//
// API
//     getPublicAsset()
//
// Models
//     PublicAsset
//
// Hooks
//     usePublicAsset()
//
// -----------------------------------------------------------------------------
//
// SECURITY BOUNDARIES
// -----------------------------------------------------------------------------
//
// Authenticated Asset operations use:
//
//     authenticatedApiClient
//
// and operate against the current authenticated Identity.
//
// The frontend does not provide ownership information for owner-scoped
// operations.
//
// Public Asset delivery uses:
//
//     apiClient
//
// and exposes only the reduced PublicAsset representation.
//
// -----------------------------------------------------------------------------
//
// MODEL BOUNDARIES
// -----------------------------------------------------------------------------
//
// Asset
//
//     Authenticated Asset-management representation.
//
// PublicAsset
//
//     Safe public rendering representation.
//
// These models intentionally remain separate.
//
// `PublicAsset` does not expose internal Asset-management metadata such as:
//
//     ownerPublicId
//     status
//     visibility
//     storageProvider
//     bucket
//     objectKey
//
// -----------------------------------------------------------------------------
//
// INTERNAL TYPES
// -----------------------------------------------------------------------------
//
// The feature intentionally does not expose internal transport, persistence,
// or implementation-specific types unless they are explicitly part of the
// frontend feature contract.
//
// -----------------------------------------------------------------------------
// =============================================================================
// Authenticated Asset API
// =============================================================================
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$assets$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/assets/api/index.ts [app-client] (ecmascript) <locals>");
// =============================================================================
// Asset Hooks
// =============================================================================
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$assets$2f$hooks$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/assets/hooks/index.ts [app-client] (ecmascript) <locals>");
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/identity/api/identity.api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getCurrentIdentity",
    ()=>getCurrentIdentity
]);
// -----------------------------------------------------------------------------
// sisiMove — Identity API
// -----------------------------------------------------------------------------
//
// HTTP adapter for the Identity feature.
//
// Responsibilities:
//
// - call Identity HTTP endpoints;
// - use the authenticated HTTP boundary for protected Identity operations;
// - translate transport responses into frontend Identity models.
//
// Non-responsibilities:
//
// - authentication;
// - session management;
// - token storage;
// - authorization;
// - Identity business rules;
// - direct Prisma access.
//
// Authentication owns the authenticated transport:
//
//     authenticatedApiClient
//
// Identity owns the endpoint:
//
//     GET /identities/me
//
// This separation is intentional:
//
//     Identity
//         │
//         └── uses ──► Authentication transport
//
// Authentication does NOT need to know anything about the Identity domain.
//
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/authentication/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$http$2f$authenticated$2d$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/authentication/http/authenticated-api-client.ts [app-client] (ecmascript)");
;
// =============================================================================
// API Path
// =============================================================================
const IDENTITIES_API_PATH = '/identities';
// =============================================================================
// Status Mapping
// =============================================================================
function mapIdentityStatus(status) {
    switch(status){
        case 'PENDING':
        case 'ACTIVE':
        case 'SUSPENDED':
        case 'CLOSED':
            return status;
        default:
            throw new Error(`Unsupported Identity status: ${status}`);
    }
}
// =============================================================================
// Response Mapper
// =============================================================================
function mapIdentityResponse(response) {
    return {
        publicId: response.publicId,
        email: response.email,
        phoneNumber: response.phoneNumber,
        status: mapIdentityStatus(response.status),
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
        activatedAt: response.activatedAt,
        suspendedAt: response.suspendedAt,
        closedAt: response.closedAt
    };
}
async function getCurrentIdentity() {
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$http$2f$authenticated$2d$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authenticatedApiClient"].get(`${IDENTITIES_API_PATH}/me`);
    if (response === null) {
        return null;
    }
    return mapIdentityResponse(response);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/identity/api/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// -----------------------------------------------------------------------------
// sisiMove — Identity API Barrel
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$identity$2f$api$2f$identity$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/identity/api/identity.api.ts [app-client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/identity/hooks/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// -----------------------------------------------------------------------------
// sisiMove — Identity Hooks Barrel
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$identity$2f$hooks$2f$use$2d$current$2d$identity$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/identity/hooks/use-current-identity.ts [app-client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/identity/hooks/use-current-identity.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "useCurrentIdentity",
    ()=>useCurrentIdentity
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$identity$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/identity/api/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$identity$2f$api$2f$identity$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/identity/api/identity.api.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
// -----------------------------------------------------------------------------
// sisiMove — Current Identity Hook
// -----------------------------------------------------------------------------
//
// React Query boundary for the authenticated user's Identity.
//
// Responsibilities:
//
// - load the current Identity;
// - expose loading/error state;
// - provide explicit refetch support;
// - cache the current Identity independently from Authentication state.
//
// Non-responsibilities:
//
// - authentication;
// - session restoration;
// - login;
// - logout;
// - token management;
// - Identity mutations.
//
// Authentication answers:
//
//     "Is this client authenticated?"
//
// Identity answers:
//
//     "Who is the authenticated Identity?"
//
// These are deliberately separate concerns.
//
// -----------------------------------------------------------------------------
'use client';
;
;
// =============================================================================
// Query Key
// =============================================================================
const CURRENT_IDENTITY_QUERY_KEY = 'current-identity';
function useCurrentIdentity() {
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            CURRENT_IDENTITY_QUERY_KEY
        ],
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$identity$2f$api$2f$identity$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentIdentity"],
        // Identity changes relatively infrequently compared with ordinary
        // application data. A short stale period avoids unnecessary requests
        // while still allowing account changes to become visible promptly.
        staleTime: 5 * 60 * 1000
    });
}
_s(useCurrentIdentity, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
const __TURBOPACK__default__export__ = useCurrentIdentity;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/trust/api/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// -----------------------------------------------------------------------------
// sisiMove — Trust API Exports
// -----------------------------------------------------------------------------
//
// Public API boundary for the Trust feature's HTTP adapters.
//
// Public marketplace reads:
//   getPublicTravellerTrust()
//   getPublicTrustProfile()
//
// Authenticated Trust reads:
//   getTravellerTrust()
//
// Keeping these exports explicit prevents consumers from importing individual
// API implementation files and makes the public/authenticated boundary clear.
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$trust$2f$api$2f$public$2d$trust$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/trust/api/public-trust.api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$trust$2f$api$2f$trust$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/trust/api/trust.api.ts [app-client] (ecmascript)");
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/trust/api/public-trust.api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getPublicTrustProfile",
    ()=>getPublicTrustProfile,
    "getTravellerTrust",
    ()=>getTravellerTrust
]);
// -----------------------------------------------------------------------------
// sisiMove — Public Trust API
// -----------------------------------------------------------------------------
//
// Frontend API adapter for the public Trust read boundary.
//
// The Trust backend exposes two different kinds of representations:
//
// 1. Operational TrustProfileResponse
//    - rich internal representation;
//    - contains profile metadata, ratings, reviews, events, badge catalogue
//      entries, profile-badge assignments, lifecycle fields, and internal IDs;
//    - intended for the Trust domain's broader presentation/API surface.
//
// 2. PublicTrustProfileResponse
//    - deliberately reduced marketplace representation;
//    - contains only information that is safe and useful for public traveller
//      discovery;
//    - already combines active profile badges with their badge definitions;
//    - already resolves public badge asset metadata.
//
// The public marketplace MUST consume the second representation.
//
// Architectural boundary:
//
//   Backend Trust domain
//          |
//          v
//   PublicTrustProfileResponse
//          |
//          v
//   this API adapter
//          |
//          v
//   PublicTravellerTrust
//          |
//          v
//   marketplace UI
//
// The frontend therefore does NOT:
//
// - consume TrustProfile internals;
// - join badge definitions with profile assignments;
// - inspect TrustProfileBadge records;
// - construct asset URLs;
// - expose backend database IDs;
// - reproduce backend Trust-domain business rules.
//
// Those responsibilities belong to the backend Trust public read boundary.
//
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$http$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/foundation/http/api-client.ts [app-client] (ecmascript)");
;
// -----------------------------------------------------------------------------
// API Paths
// -----------------------------------------------------------------------------
const TRUST_PROFILE_API_PATH = '/trust-profiles';
async function getTravellerTrust(memberPublicId) {
    const normalizedMemberPublicId = memberPublicId.trim();
    if (normalizedMemberPublicId.length === 0) {
        throw new Error('Member public ID is required.');
    }
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$http$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].get(`${TRUST_PROFILE_API_PATH}/public/member/${encodeURIComponent(normalizedMemberPublicId)}`);
    return mapPublicTrustProfileResponse(response);
}
async function getPublicTrustProfile(trustProfilePublicId) {
    const normalizedTrustProfilePublicId = trustProfilePublicId.trim();
    if (normalizedTrustProfilePublicId.length === 0) {
        throw new Error('Trust profile public ID is required.');
    }
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$foundation$2f$http$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].get(`${TRUST_PROFILE_API_PATH}/public/${encodeURIComponent(normalizedTrustProfilePublicId)}`);
    return mapLegacyTrustProfileResponse(response);
}
// -----------------------------------------------------------------------------
// Public Trust Mapper
// -----------------------------------------------------------------------------
/**
 * Map the dedicated backend public Trust representation into the frontend
 * marketplace model.
 *
 * There is intentionally very little transformation here.
 *
 * The backend public query has already performed the domain-level composition
 * required to determine:
 *
 * - the public Trust summary;
 * - which badges are actually awarded;
 * - which badge assets are publicly usable.
 *
 * The frontend therefore performs only transport-to-frontend-model mapping.
 */ function mapPublicTrustProfileResponse(response) {
    return {
        verificationLevel: mapVerificationLevel(response.verificationLevel),
        ratingAverage: response.ratingAverage,
        ratingCount: response.ratingCount,
        completedJourneys: response.completedJourneys,
        badges: response.badges.map(mapPublicTrustBadgeResponse)
    };
}
// -----------------------------------------------------------------------------
// Public Trust Badge Mapper
// -----------------------------------------------------------------------------
/**
 * Map a backend public Trust badge into the frontend badge model.
 *
 * The backend has already resolved the public asset reference when one exists.
 *
 * Therefore:
 *
 *   response.asset.url
 *
 * is a genuine backend-provided delivery URL.
 *
 * The frontend does not derive or modify that URL.
 */ function mapPublicTrustBadgeResponse(response) {
    return {
        publicId: response.publicId,
        type: mapTrustBadgeType(response.type),
        name: response.name,
        description: response.description,
        asset: response.asset === null ? null : mapPublicTrustBadgeAssetResponse(response.asset)
    };
}
// -----------------------------------------------------------------------------
// Public Trust Badge Asset Mapper
// -----------------------------------------------------------------------------
/**
 * Map backend public badge asset metadata into the frontend asset model.
 *
 * Asset delivery remains owned by the backend Asset domain.
 *
 * The frontend deliberately does NOT construct:
 *
 *   /assets/public/:assetPublicId
 *
 * or any other URL from the opaque asset public ID.
 */ function mapPublicTrustBadgeAssetResponse(response) {
    return {
        publicId: response.publicId,
        url: response.url,
        alt: response.alt
    };
}
// -----------------------------------------------------------------------------
// Verification Level
// -----------------------------------------------------------------------------
/**
 * Map the backend verification string into the finite frontend union.
 *
 * Unknown backend values intentionally degrade to NONE rather than allowing
 * an unexpected value to leak into the public UI model.
 */ function mapVerificationLevel(value) {
    switch(value){
        case 'BASIC':
            return 'BASIC';
        case 'VERIFIED':
            return 'VERIFIED';
        case 'HIGHLY_VERIFIED':
            return 'HIGHLY_VERIFIED';
        case 'NONE':
        default:
            return 'NONE';
    }
}
// -----------------------------------------------------------------------------
// Trust Badge Type
// -----------------------------------------------------------------------------
/**
 * Keep the frontend Trust model closed over the badge types it understands.
 *
 * Unknown backend badge types intentionally degrade to the existing neutral
 * frontend fallback rather than leaking arbitrary backend strings into the UI.
 */ function mapTrustBadgeType(value) {
    switch(value){
        case 'IDENTITY_VERIFIED':
            return 'IDENTITY_VERIFIED';
        case 'PHONE_VERIFIED':
            return 'PHONE_VERIFIED';
        case 'EXPERIENCED_PROVIDER':
            return 'EXPERIENCED_PROVIDER';
        case 'EXPERIENCED_TRAVELLER':
            return 'EXPERIENCED_TRAVELLER';
        case 'RELIABLE_PROVIDER':
            return 'RELIABLE_PROVIDER';
        case 'RELIABLE_TRAVELLER':
            return 'RELIABLE_TRAVELLER';
        case 'HIGHLY_RATED':
            return 'HIGHLY_RATED';
        default:
            return 'HIGHLY_RATED';
    }
}
// -----------------------------------------------------------------------------
// Legacy Trust Profile Mapper
// -----------------------------------------------------------------------------
//
// This mapper exists only to preserve the existing `getPublicTrustProfile()`
// function while its backend endpoint still returns the broad operational
// TrustProfileResponse.
//
// It should NOT be used by the public marketplace Journey/Demand enrichment
// path.
//
// Unlike the new public endpoint, this legacy response does not provide a
// genuine public badge asset URL. Consequently badge assets remain null here.
// -----------------------------------------------------------------------------
function mapLegacyTrustProfileResponse(response) {
    return {
        verificationLevel: mapVerificationLevel(response.verificationLevel),
        ratingAverage: response.ratingAverage,
        ratingCount: response.ratingCount,
        completedJourneys: response.completedJourneys,
        badges: mapLegacyProfileBadges(response.badges, response.profileBadges)
    };
}
/**
 * Join legacy Trust badge definitions with profile assignments.
 *
 * This logic exists only because the legacy Trust endpoint exposes the two
 * collections separately.
 *
 * The dedicated public endpoint performs this composition on the backend and
 * therefore does not require this logic.
 */ function mapLegacyProfileBadges(badges, profileBadges) {
    const badgeById = new Map();
    for (const badge of badges){
        badgeById.set(badge.id, badge);
    }
    const mappedBadges = [];
    for (const profileBadge of profileBadges){
        if (!profileBadge.active || profileBadge.revokedAt !== null) {
            continue;
        }
        const badge = badgeById.get(profileBadge.badgeId);
        if (badge === undefined || !badge.active) {
            continue;
        }
        mappedBadges.push({
            publicId: badge.publicId,
            type: mapTrustBadgeType(badge.type),
            name: badge.name,
            description: badge.description,
            // The legacy endpoint exposes only assetPublicId. It does not provide
            // public delivery metadata, so the frontend must not fabricate a URL.
            asset: null
        });
    }
    return mappedBadges;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/trust/api/trust.api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getTravellerTrust",
    ()=>getTravellerTrust
]);
// -----------------------------------------------------------------------------
// sisiMove — Trust API
// -----------------------------------------------------------------------------
//
// Frontend API adapter for the authenticated / operational Trust read boundary.
//
// Architectural boundary:
//
//   Authenticated UI
//          |
//          v
//   getTravellerTrust()
//          |
//          v
//   authenticatedApiClient
//          |
//          v
//   GET /trust-profiles/member/:memberPublicId
//          |
//          v
//   TrustProfileResponse
//          |
//          v
//   TravellerTrust
//
// This adapter intentionally consumes the broader TrustProfileResponse because
// the authenticated Trust surface may require information that is deliberately
// excluded from the public marketplace representation.
//
// Public marketplace consumers MUST use:
//
//   getPublicTravellerTrust()
//
// from `public-trust.api.ts` instead.
//
// This file therefore owns:
//
// - authenticated Trust profile reads;
// - transport-to-frontend Trust mapping;
// - conversion of backend Trust response values into frontend values;
// - isolation of backend TrustProfileResponse details from UI components.
//
// This file does NOT:
//
// - create or mutate Trust profiles;
// - submit ratings;
// - create reviews;
// - manage badges;
// - expose Prisma/database IDs to UI models;
// - construct asset URLs;
// - implement Trust business rules.
//
// IMPORTANT:
//
// The frontend TravellerTrust model intentionally exposes:
//
//     badges: readonly PublicTrustBadge[]
//
// The readonly collection is part of the application-model contract.
//
// This adapter may construct that collection using a mutable local
// `PublicTrustBadge[]`, but it must never weaken the frontend model simply to
// make the mapper convenient to implement.
//
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/authentication/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$http$2f$authenticated$2d$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/authentication/http/authenticated-api-client.ts [app-client] (ecmascript)");
;
// -----------------------------------------------------------------------------
// API Paths
// -----------------------------------------------------------------------------
const TRUST_PROFILE_API_PATH = '/trust-profiles';
async function getTravellerTrust(memberPublicId) {
    const normalizedMemberPublicId = memberPublicId.trim();
    if (normalizedMemberPublicId.length === 0) {
        throw new Error('Member public ID is required.');
    }
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$http$2f$authenticated$2d$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authenticatedApiClient"].get(`${TRUST_PROFILE_API_PATH}/member/${encodeURIComponent(normalizedMemberPublicId)}`);
    if (response === null) {
        return null;
    }
    return mapTrustProfileResponse(response);
}
// -----------------------------------------------------------------------------
// Trust Profile Mapper
// -----------------------------------------------------------------------------
/**
 * Map the authenticated backend TrustProfileResponse into the frontend
 * TravellerTrust application model.
 *
 * The frontend model deliberately excludes internal Trust-domain collections
 * such as:
 *
 * - ratings;
 * - reviews;
 * - events;
 * - badge assignments.
 *
 * Those are backend/domain representations.
 *
 * The frontend summary model only receives the badge definitions that are
 * currently active and actually awarded to this traveller.
 */ function mapTrustProfileResponse(response) {
    return {
        publicId: response.publicId,
        status: mapTravellerTrustStatus(response.status),
        verificationLevel: mapTravellerTrustVerificationLevel(response.verificationLevel),
        // -------------------------------------------------------------------------
        // Rating statistics
        // -------------------------------------------------------------------------
        ratingAverage: response.ratingAverage,
        ratingCount: response.ratingCount,
        // -------------------------------------------------------------------------
        // Journey statistics
        // -------------------------------------------------------------------------
        completedJourneys: response.completedJourneys,
        providerJourneys: response.providerJourneys,
        passengerJourneys: response.passengerJourneys,
        completedProviderJourneys: response.completedProviderJourneys,
        completedPassengerJourneys: response.completedPassengerJourneys,
        // -------------------------------------------------------------------------
        // Cancellation statistics
        // -------------------------------------------------------------------------
        cancelledJourneys: response.cancelledJourneys,
        providerCancellations: response.providerCancellations,
        passengerCancellations: response.passengerCancellations,
        // -------------------------------------------------------------------------
        // Trust statistics
        // -------------------------------------------------------------------------
        completionRate: response.completionRate,
        cancellationRate: response.cancellationRate,
        // -------------------------------------------------------------------------
        // Badges
        // -------------------------------------------------------------------------
        badges: mapActiveProfileBadges(response.badges, response.profileBadges),
        // -------------------------------------------------------------------------
        // Lifecycle
        // -------------------------------------------------------------------------
        createdAt: response.createdAt,
        updatedAt: response.updatedAt
    };
}
// -----------------------------------------------------------------------------
// Trust Status Mapper
// -----------------------------------------------------------------------------
/**
 * Map the backend TrustProfile status into the finite frontend model.
 *
 * Unknown values intentionally degrade to ACTIVE rather than allowing an
 * arbitrary backend string to escape into the application model.
 */ function mapTravellerTrustStatus(value) {
    switch(value){
        case 'ACTIVE':
            return 'ACTIVE';
        case 'SUSPENDED':
            return 'SUSPENDED';
        case 'REVOKED':
            return 'REVOKED';
        default:
            return 'ACTIVE';
    }
}
// -----------------------------------------------------------------------------
// Verification Level Mapper
// -----------------------------------------------------------------------------
/**
 * Map the backend Trust verification level into the frontend model.
 *
 * Supported frontend values:
 *
 *   NONE
 *   MEMBER
 *   DRIVER
 *
 * Unknown values intentionally degrade to NONE.
 */ function mapTravellerTrustVerificationLevel(value) {
    switch(value){
        case 'MEMBER':
            return 'MEMBER';
        case 'DRIVER':
            return 'DRIVER';
        case 'NONE':
        default:
            return 'NONE';
    }
}
// -----------------------------------------------------------------------------
// Active Profile Badge Mapper
// -----------------------------------------------------------------------------
/**
 * Convert the backend's separate badge-definition and profile-assignment
 * collections into the frontend TravellerTrust badge collection.
 *
 * Backend:
 *
 *     badges
 *         +
 *     profileBadges
 *
 * Frontend:
 *
 *     TravellerTrust.badges
 *
 * A badge is included only when:
 *
 * 1. the profile assignment is active;
 * 2. the profile assignment has not been revoked;
 * 3. the referenced badge definition exists;
 * 4. the badge definition itself is active.
 *
 * -----------------------------------------------------------------------------
 *
 * READONLY MODEL BOUNDARY
 *
 * TravellerTrust declares:
 *
 *     badges: readonly PublicTrustBadge[]
 *
 * That readonly declaration is intentional.
 *
 * We therefore do NOT write:
 *
 *     const mappedBadges: TravellerTrust['badges'] = [];
 *
 * followed by:
 *
 *     mappedBadges.push(...)
 *
 * because TravellerTrust['badges'] is readonly.
 *
 * Instead, this mapper uses the concrete mutable construction type:
 *
 *     PublicTrustBadge[]
 *
 * Once construction is complete, the array is returned through the readonly
 * TravellerTrust contract.
 *
 * No cast is required.
 *
 * -----------------------------------------------------------------------------
 */ function mapActiveProfileBadges(badges, profileBadges) {
    // ---------------------------------------------------------------------------
    // Build an efficient lookup table for badge definitions.
    //
    // The profile assignment references the badge by backend badge ID.
    // ---------------------------------------------------------------------------
    const badgeById = new Map();
    for (const badge of badges){
        badgeById.set(badge.id, badge);
    }
    // ---------------------------------------------------------------------------
    // Mutable construction collection.
    //
    // This is deliberately NOT typed as TravellerTrust['badges'], because that
    // application-model type is readonly.
    // ---------------------------------------------------------------------------
    const mappedBadges = [];
    // ---------------------------------------------------------------------------
    // Resolve active profile assignments.
    // ---------------------------------------------------------------------------
    for (const profileBadge of profileBadges){
        // An inactive assignment is not a currently awarded badge.
        if (!profileBadge.active) {
            continue;
        }
        // A revoked assignment is no longer an awarded badge.
        if (profileBadge.revokedAt !== null) {
            continue;
        }
        // Resolve the badge definition.
        const badge = badgeById.get(profileBadge.badgeId);
        // A missing definition cannot be safely exposed to the UI.
        if (badge === undefined) {
            continue;
        }
        // Inactive badge definitions are not publicly represented as active
        // traveller badges.
        if (!badge.active) {
            continue;
        }
        mappedBadges.push({
            publicId: badge.publicId,
            type: mapTrustBadgeType(badge.type),
            name: badge.name,
            description: badge.description,
            // -----------------------------------------------------------------------
            // Asset resolution deliberately remains outside this adapter.
            //
            // The Trust API only gives us assetPublicId. Constructing delivery URLs
            // belongs to the Assets feature, not the Trust feature.
            // -----------------------------------------------------------------------
            asset: null
        });
    }
    return mappedBadges;
}
// -----------------------------------------------------------------------------
// Trust Badge Type Mapper
// -----------------------------------------------------------------------------
/**
 * Map backend badge types into the closed frontend Trust badge union.
 *
 * Unknown backend values intentionally fall back to a neutral known value
 * rather than leaking arbitrary backend strings into the UI model.
 */ function mapTrustBadgeType(value) {
    switch(value){
        case 'IDENTITY_VERIFIED':
            return 'IDENTITY_VERIFIED';
        case 'PHONE_VERIFIED':
            return 'PHONE_VERIFIED';
        case 'EXPERIENCED_PROVIDER':
            return 'EXPERIENCED_PROVIDER';
        case 'EXPERIENCED_TRAVELLER':
            return 'EXPERIENCED_TRAVELLER';
        case 'RELIABLE_PROVIDER':
            return 'RELIABLE_PROVIDER';
        case 'RELIABLE_TRAVELLER':
            return 'RELIABLE_TRAVELLER';
        case 'HIGHLY_RATED':
            return 'HIGHLY_RATED';
        default:
            return 'HIGHLY_RATED';
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/trust/hooks/use-my-trust.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "myTrustQueryKeys",
    ()=>myTrustQueryKeys,
    "useMyTrust",
    ()=>useMyTrust
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$trust$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/trust/api/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$trust$2f$api$2f$trust$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/trust/api/trust.api.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
// -----------------------------------------------------------------------------
// sisiMove — My Trust Hook
// -----------------------------------------------------------------------------
//
// TanStack Query hook for loading the authenticated traveller's Trust profile.
//
// Architectural boundary:
//
//   Authenticated Component
//          ↓
//   useMyTrust(memberPublicId)
//          ↓
//   getTravellerTrust()
//          ↓
//   authenticatedApiClient
//          ↓
//   GET /trust-profiles/member/:memberPublicId
//          ↓
//   TravellerTrust
//
// This hook consumes the authenticated / operational Trust representation.
//
// It is intentionally different from:
//
//   useTravellerTrust()
//       ↓
//   getPublicTravellerTrust()
//       ↓
//   PublicTravellerTrust
//
// The public hook is for marketplace discovery.
// This hook is for the authenticated traveller's own Trust surface.
//
// IMPORTANT:
//
// The current backend does not expose:
//
//   GET /trust-profiles/me
//
// Therefore this hook requires the authenticated traveller's member public ID.
// Once a dedicated `/trust-profiles/me` backend query exists, this hook can be
// changed to remove the memberPublicId argument without changing its role in
// the frontend architecture.
//
// -----------------------------------------------------------------------------
'use client';
;
;
const myTrustQueryKeys = {
    all: [
        'my-trust'
    ],
    byMemberPublicId: (memberPublicId)=>[
            'my-trust',
            memberPublicId
        ]
};
function useMyTrust(memberPublicId) {
    _s();
    const normalizedMemberPublicId = memberPublicId?.trim() ?? '';
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: myTrustQueryKeys.byMemberPublicId(normalizedMemberPublicId),
        queryFn: {
            "useMyTrust.useQuery": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$trust$2f$api$2f$trust$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTravellerTrust"])(normalizedMemberPublicId)
        }["useMyTrust.useQuery"],
        enabled: normalizedMemberPublicId.length > 0
    });
}
_s(useMyTrust, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/verification/api/cancel-verification-request.api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cancelVerificationRequest",
    ()=>cancelVerificationRequest
]);
// -----------------------------------------------------------------------------
// sisiMove — Cancel Verification Request API
// -----------------------------------------------------------------------------
//
// Authenticated HTTP operation for cancelling a Verification Request.
//
// Backend route:
//
//   PATCH /verifications/:verificationPublicId/requests/
//         :verificationRequestPublicId/cancel
//
// Authentication:
//
//   JwtAuthGuard
//
// Permission:
//
//   None
//
// IMPORTANT
// -----------------------------------------------------------------------------
//
// Cancellation is an applicant/service operation.
//
// The authenticated identity is derived by the backend from the access token.
//
// The frontend therefore MUST NOT:
//
// - provide an identityPublicId;
// - determine request ownership;
// - determine whether cancellation is allowed;
// - recreate Verification Request lifecycle rules.
//
// The backend remains the source of truth for all cancellation rules.
//
// The verificationPublicId exists in the HTTP resource hierarchy, but the
// backend CancelVerificationRequestCommand intentionally receives only:
//
//   IdentityPublicId
//   VerificationRequestPublicId
//   correlation ID
//
// Therefore the parent Verification ID is not sent in a request body.
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
 * Base route for the Verification HTTP controller.
 *
 * NestJS:
 *
 *     @Controller('verifications')
 */ const VERIFICATIONS_PATH = '/verifications';
async function cancelVerificationRequest(verificationPublicId, verificationRequestPublicId) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$http$2f$authenticated$2d$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authenticatedApiClient"].patch(`${VERIFICATIONS_PATH}/${encodeURIComponent(verificationPublicId)}/requests/${encodeURIComponent(verificationRequestPublicId)}/cancel`);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/verification/api/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// -----------------------------------------------------------------------------
// sisiMove — Verification API Barrel
// -----------------------------------------------------------------------------
//
// Public exports for the Verification feature's HTTP API operations.
//
// API boundaries:
//
// - Current authenticated Verification
// - Explicit Verification resource
// - Verification Requests
// - Verification Request submission
// - Verification Request cancellation
//
// Consumers should import Verification API operations from this barrel rather
// than reaching into individual API modules.
//
// -----------------------------------------------------------------------------
// =============================================================================
// Verification
// =============================================================================
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$verification$2f$api$2f$verification$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/verification/api/verification.api.ts [app-client] (ecmascript)");
// =============================================================================
// Verification Requests
// =============================================================================
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$verification$2f$api$2f$verification$2d$requests$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/verification/api/verification-requests.api.ts [app-client] (ecmascript)");
// =============================================================================
// Submit Verification Request
// =============================================================================
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$verification$2f$api$2f$submit$2d$verification$2d$request$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/verification/api/submit-verification-request.api.ts [app-client] (ecmascript)");
// =============================================================================
// Cancel Verification Request
// =============================================================================
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$verification$2f$api$2f$cancel$2d$verification$2d$request$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/verification/api/cancel-verification-request.api.ts [app-client] (ecmascript)");
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/verification/api/submit-verification-request.api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "submitVerificationRequest",
    ()=>submitVerificationRequest
]);
// -----------------------------------------------------------------------------
// sisiMove — Submit Verification Request API
// -----------------------------------------------------------------------------
//
// Authenticated HTTP operation for submitting verification evidence.
//
// Backend route:
//
//   POST /verifications/requests
//
// Request:
//
//   multipart/form-data
//
// Fields:
//
//   type
//   file
//
// Backend workflow:
//
//   authenticated identity
//          ↓
//   SubmitVerificationRequestCommand
//          ↓
//   upload Asset
//          ↓
//   resolve/create Verification
//          ↓
//   create VerificationRequest
//
// IMPORTANT
// -----------------------------------------------------------------------------
//
// The frontend MUST NOT:
//
// - create the Asset;
// - provide an identityPublicId;
// - create the Verification;
// - create the VerificationRequest directly;
// - determine whether the evidence is required;
// - determine whether another request is pending.
//
// The backend orchestrator owns that workflow.
//
// The authenticated API client supplies:
//
//   Authorization: Bearer <accessToken>
//
// The request therefore contains only the verification evidence type and
// browser file.
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
 * Base route for the Verification HTTP controller.
 */ const VERIFICATIONS_PATH = '/verifications';
async function submitVerificationRequest(input, file) {
    const formData = new FormData();
    formData.append('type', input.type);
    formData.append('file', file);
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$http$2f$authenticated$2d$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authenticatedApiClient"].post(`${VERIFICATIONS_PATH}/requests`, formData);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/verification/api/verification-requests.api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getVerificationRequest",
    ()=>getVerificationRequest,
    "getVerificationRequests",
    ()=>getVerificationRequests
]);
// -----------------------------------------------------------------------------
// sisiMove — Verification Requests API
// -----------------------------------------------------------------------------
//
// Authenticated HTTP operations for Verification Requests.
//
// Backend routes:
//
//   GET /verifications/:verificationPublicId/requests
//
//   GET /verifications/:verificationPublicId/requests/:verificationRequestPublicId
//
// IMPORTANT
// -----------------------------------------------------------------------------
//
// Verification Requests are children of the Verification aggregate.
//
// REST hierarchy:
//
//   Verification
//       └── Verification Request
//
// Therefore the frontend supplies:
//
//   verificationPublicId
//
// and, for a single request:
//
//   verificationRequestPublicId
//
// The frontend does NOT:
//
// - determine verification ownership;
// - determine authorization;
// - recreate Verification Request lifecycle rules;
// - inspect internal database IDs;
// - determine whether a request belongs to the authenticated identity.
//
// The backend remains the source of truth.
//
// The current backend controller protects both query operations with:
//
//   JwtAuthGuard
//   PermissionsGuard
//
// and the following permissions:
//
//   verification-request:read
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
 * Base route for the Verification HTTP controller.
 *
 * NestJS:
 *
 *     @Controller('verifications')
 */ const VERIFICATIONS_PATH = '/verifications';
async function getVerificationRequests(verificationPublicId) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$http$2f$authenticated$2d$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authenticatedApiClient"].get(`${VERIFICATIONS_PATH}/${encodeURIComponent(verificationPublicId)}/requests`);
}
async function getVerificationRequest(verificationPublicId, verificationRequestPublicId) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$http$2f$authenticated$2d$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authenticatedApiClient"].get(`${VERIFICATIONS_PATH}/${encodeURIComponent(verificationPublicId)}/requests/${encodeURIComponent(verificationRequestPublicId)}`);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/verification/api/verification.api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createVerification",
    ()=>createVerification,
    "getMyVerification",
    ()=>getMyVerification,
    "getVerification",
    ()=>getVerification
]);
// -----------------------------------------------------------------------------
// sisiMove — Verification API
// -----------------------------------------------------------------------------
//
// Authenticated HTTP operations for the Verification aggregate belonging to
// the currently authenticated identity.
//
// Backend applicant routes:
//
//   POST /verifications
//       Start verification for the authenticated identity.
//
//   GET /verifications/me
//       Retrieve the verification belonging to the authenticated identity.
//
// Backend reviewer/query route:
//
//   GET /verifications/:verificationPublicId
//       Retrieve a verification by its public ID.
//
// IMPORTANT
// -----------------------------------------------------------------------------
//
// The authenticated identity is determined by the backend from the access
// token.
//
// The frontend MUST NOT:
//
// - provide an identityPublicId;
// - determine the current identity;
// - determine verification ownership;
// - determine verification authorization;
// - recreate Verification domain rules.
//
// Authentication and authorization remain backend responsibilities.
//
// Applicant operations:
//
//   POST /verifications
//       → authenticatedApiClient
//
//   GET /verifications/me
//       → authenticatedApiClient
//
// Reviewer/query operation:
//
//   GET /verifications/:verificationPublicId
//       → authenticatedApiClient
//
// The backend remains the source of truth for:
//
// - identity;
// - verification ownership;
// - verification existence;
// - verification lifecycle;
// - authorization;
// - domain rules.
//
// -----------------------------------------------------------------------------
//
// Verification query boundaries:
//
//   GET /verifications/me
//       ↓
//   GetVerificationQuery
//       ↓
//   IdentityPublicId
//       ↓
//   current identity's Verification
//
//   GET /verifications/:verificationPublicId
//       ↓
//   GetVerificationByPublicIdQuery
//       ↓
//   VerificationPublicId
//       ↓
//   explicit Verification resource
//
// These are intentionally different HTTP/application boundaries.
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
 * Base route for the Verification HTTP controller.
 *
 * NestJS:
 *
 *     @Controller('verifications')
 */ const VERIFICATIONS_PATH = '/verifications';
async function createVerification() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$http$2f$authenticated$2d$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authenticatedApiClient"].post(VERIFICATIONS_PATH);
}
async function getMyVerification() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$http$2f$authenticated$2d$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authenticatedApiClient"].get(`${VERIFICATIONS_PATH}/me`);
}
async function getVerification(verificationPublicId) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$authentication$2f$http$2f$authenticated$2d$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authenticatedApiClient"].get(`${VERIFICATIONS_PATH}/${encodeURIComponent(verificationPublicId)}`);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/verification/hooks/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// -----------------------------------------------------------------------------
// sisiMove — Verification Hooks
// -----------------------------------------------------------------------------
//
// Public export surface for Verification feature hooks.
//
// Hooks are grouped by responsibility:
//
// - Verification aggregate
// - Verification Requests
// - Verification Request detail
// - Verification Request submission
// - Verification Request cancellation
//
// Consumers should import Verification hooks and their public types from this
// barrel rather than reaching into individual hook files.
//
// -----------------------------------------------------------------------------
// =============================================================================
// Verification
// =============================================================================
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$verification$2f$hooks$2f$use$2d$verification$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/verification/hooks/use-verification.ts [app-client] (ecmascript)");
// =============================================================================
// Verification Requests
// =============================================================================
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$verification$2f$hooks$2f$use$2d$verification$2d$requests$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/verification/hooks/use-verification-requests.ts [app-client] (ecmascript)");
// =============================================================================
// Verification Request
// =============================================================================
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$verification$2f$hooks$2f$use$2d$verification$2d$request$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/verification/hooks/use-verification-request.ts [app-client] (ecmascript)");
// =============================================================================
// Submit Verification Request
// =============================================================================
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$verification$2f$hooks$2f$use$2d$submit$2d$verification$2d$request$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/verification/hooks/use-submit-verification-request.ts [app-client] (ecmascript)");
// =============================================================================
// Cancel Verification Request
// =============================================================================
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$verification$2f$hooks$2f$use$2d$cancel$2d$verification$2d$request$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/verification/hooks/use-cancel-verification-request.ts [app-client] (ecmascript)");
;
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/verification/hooks/use-cancel-verification-request.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCancelVerificationRequest",
    ()=>useCancelVerificationRequest
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$verification$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/verification/api/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$verification$2f$api$2f$cancel$2d$verification$2d$request$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/verification/api/cancel-verification-request.api.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
// -----------------------------------------------------------------------------
// sisiMove — Cancel Verification Request Hook
// -----------------------------------------------------------------------------
//
// Client-side application hook for cancelling a verification request.
//
// Responsibilities:
// - Cancel a verification request through the verification API.
// - Expose cancellation/loading state.
// - Expose the updated verification request.
// - Normalize transport/application errors for UI consumption.
//
// Non-responsibilities:
// - HTTP transport.
// - Authentication.
// - Verification business rules.
// - Request eligibility decisions.
//
// -----------------------------------------------------------------------------
'use client';
;
;
function normalizeError(cause) {
    if (cause instanceof Error) return cause;
    if (typeof cause === 'string') return new Error(cause);
    return new Error('Unable to cancel verification request.');
}
function useCancelVerificationRequest() {
    _s();
    const [request, setRequest] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isCancelling, setIsCancelling] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const cancel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useCancelVerificationRequest.useCallback[cancel]": async (verificationPublicId, verificationRequestPublicId)=>{
            setIsCancelling(true);
            setError(null);
            try {
                const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$verification$2f$api$2f$cancel$2d$verification$2d$request$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cancelVerificationRequest"])(verificationPublicId, verificationRequestPublicId);
                setRequest(result);
                return result;
            } catch (cause) {
                const normalizedError = normalizeError(cause);
                setError(normalizedError);
                throw normalizedError;
            } finally{
                setIsCancelling(false);
            }
        }
    }["useCancelVerificationRequest.useCallback[cancel]"], []);
    const reset = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useCancelVerificationRequest.useCallback[reset]": ()=>{
            setRequest(null);
            setError(null);
        }
    }["useCancelVerificationRequest.useCallback[reset]"], []);
    return {
        request,
        isCancelling,
        error,
        cancel,
        reset
    };
}
_s(useCancelVerificationRequest, "NtaTaJZ6CACnDKRo6nyVOJfGF2Q=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/verification/hooks/use-submit-verification-request.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSubmitVerificationRequest",
    ()=>useSubmitVerificationRequest
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$verification$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/verification/api/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$verification$2f$api$2f$submit$2d$verification$2d$request$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/verification/api/submit-verification-request.api.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
// -----------------------------------------------------------------------------
// sisiMove — Submit Verification Request Hook
// -----------------------------------------------------------------------------
//
// Client-side application hook for submitting a verification request.
//
// Responsibilities:
// - Submit a verification request with its verification type and file.
// - Expose submission/loading state.
// - Expose the submitted verification result.
// - Normalize transport/application errors for UI consumption.
//
// Non-responsibilities:
// - File validation rules owned by the backend.
// - Asset creation/upload orchestration.
// - Verification business rules.
// - HTTP transport.
//
// -----------------------------------------------------------------------------
'use client';
;
;
function normalizeError(cause) {
    if (cause instanceof Error) return cause;
    if (typeof cause === 'string') return new Error(cause);
    return new Error('Unable to submit verification request.');
}
function useSubmitVerificationRequest() {
    _s();
    const [verification, setVerification] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isSubmitting, setIsSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const submit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSubmitVerificationRequest.useCallback[submit]": async (input, file)=>{
            setIsSubmitting(true);
            setError(null);
            try {
                const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$verification$2f$api$2f$submit$2d$verification$2d$request$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["submitVerificationRequest"])(input, file);
                setVerification(result);
                return result;
            } catch (cause) {
                const normalizedError = normalizeError(cause);
                setError(normalizedError);
                throw normalizedError;
            } finally{
                setIsSubmitting(false);
            }
        }
    }["useSubmitVerificationRequest.useCallback[submit]"], []);
    const reset = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSubmitVerificationRequest.useCallback[reset]": ()=>{
            setVerification(null);
            setError(null);
        }
    }["useSubmitVerificationRequest.useCallback[reset]"], []);
    return {
        verification,
        isSubmitting,
        error,
        submit,
        reset
    };
}
_s(useSubmitVerificationRequest, "HzUiqzgjF7jdNDHIta603qUxWzw=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/verification/hooks/use-verification-request.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useVerificationRequest",
    ()=>useVerificationRequest
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$verification$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/verification/api/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$verification$2f$api$2f$verification$2d$requests$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/verification/api/verification-requests.api.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
// -----------------------------------------------------------------------------
// sisiMove — Verification Request Hook
// -----------------------------------------------------------------------------
//
// Client-side application hook for loading one verification request.
//
// Responsibilities:
// - Load a verification request by its parent verification public ID.
// - Expose loading and error state.
// - Support explicit reloads.
// - Prevent stale asynchronous responses from updating state.
//
// Non-responsibilities:
// - HTTP transport.
// - Authentication.
// - Request submission.
// - Request cancellation.
// - Verification business rules.
//
// -----------------------------------------------------------------------------
'use client';
;
;
function normalizeError(cause) {
    if (cause instanceof Error) return cause;
    if (typeof cause === 'string') return new Error(cause);
    return new Error('Unable to load verification request.');
}
function useVerificationRequest(verificationPublicId, verificationRequestPublicId) {
    _s();
    const [request, setRequest] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(verificationPublicId !== null && verificationRequestPublicId !== null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const loadRequest = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useVerificationRequest.useCallback[loadRequest]": async ()=>{
            if (verificationPublicId === null || verificationRequestPublicId === null) {
                return;
            }
            setIsLoading(true);
            setError(null);
            try {
                const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$verification$2f$api$2f$verification$2d$requests$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getVerificationRequest"])(verificationPublicId, verificationRequestPublicId);
                setRequest(result);
            } catch (cause) {
                setError(normalizeError(cause));
            } finally{
                setIsLoading(false);
            }
        }
    }["useVerificationRequest.useCallback[loadRequest]"], [
        verificationPublicId,
        verificationRequestPublicId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useVerificationRequest.useEffect": ()=>{
            if (verificationPublicId === null || verificationRequestPublicId === null) {
                return;
            }
            let cancelled = false;
            const load = {
                "useVerificationRequest.useEffect.load": async ()=>{
                    setIsLoading(true);
                    setError(null);
                    try {
                        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$verification$2f$api$2f$verification$2d$requests$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getVerificationRequest"])(verificationPublicId, verificationRequestPublicId);
                        if (cancelled) return;
                        setRequest(result);
                    } catch (cause) {
                        if (cancelled) return;
                        setError(normalizeError(cause));
                    } finally{
                        if (!cancelled) {
                            setIsLoading(false);
                        }
                    }
                }
            }["useVerificationRequest.useEffect.load"];
            void load();
            return ({
                "useVerificationRequest.useEffect": ()=>{
                    cancelled = true;
                }
            })["useVerificationRequest.useEffect"];
        }
    }["useVerificationRequest.useEffect"], [
        verificationPublicId,
        verificationRequestPublicId
    ]);
    return {
        request,
        isLoading,
        error,
        reload: loadRequest
    };
}
_s(useVerificationRequest, "aJXP+A8UKAgmJ918TSOHHQlE9P4=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/verification/hooks/use-verification-requests.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useVerificationRequests",
    ()=>useVerificationRequests
]);
// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// Verification — API
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$verification$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/verification/api/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$verification$2f$api$2f$verification$2d$requests$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/verification/api/verification-requests.api.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
// -----------------------------------------------------------------------------
// sisiMove — useVerificationRequests
// -----------------------------------------------------------------------------
//
// React hook for retrieving Verification Requests belonging to a Verification
// aggregate.
//
// Responsibilities:
// - load Verification Requests;
// - expose loading/error state;
// - expose reload capability.
//
// Non-responsibilities:
// - authentication/session management;
// - authorization;
// - Verification Request lifecycle rules;
// - HTTP transport;
// - submission or cancellation of requests.
//
// Those responsibilities remain inside their respective feature boundaries.
//
// -----------------------------------------------------------------------------
'use client';
;
;
// =============================================================================
// Error Normalization
// =============================================================================
function normalizeError(cause) {
    if (cause instanceof Error) {
        return cause;
    }
    if (typeof cause === 'string') {
        return new Error(cause);
    }
    return new Error('Unable to load verification requests.');
}
function useVerificationRequests(verificationPublicId) {
    _s();
    // ===========================================================================
    // State
    // ===========================================================================
    const [requests, setRequests] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(verificationPublicId !== null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // ===========================================================================
    // Load Requests
    // ===========================================================================
    const loadRequests = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useVerificationRequests.useCallback[loadRequests]": async ()=>{
            if (verificationPublicId === null) {
                return;
            }
            setIsLoading(true);
            setError(null);
            try {
                const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$verification$2f$api$2f$verification$2d$requests$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getVerificationRequests"])(verificationPublicId);
                setRequests(result);
            } catch (cause) {
                setError(normalizeError(cause));
            } finally{
                setIsLoading(false);
            }
        }
    }["useVerificationRequests.useCallback[loadRequests]"], [
        verificationPublicId
    ]);
    // ===========================================================================
    // Initial / Identifier Change Load
    // ===========================================================================
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useVerificationRequests.useEffect": ()=>{
            if (verificationPublicId === null) {
                return;
            }
            let cancelled = false;
            const load = {
                "useVerificationRequests.useEffect.load": async ()=>{
                    setIsLoading(true);
                    setError(null);
                    try {
                        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$verification$2f$api$2f$verification$2d$requests$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getVerificationRequests"])(verificationPublicId);
                        if (cancelled) {
                            return;
                        }
                        setRequests(result);
                    } catch (cause) {
                        if (cancelled) {
                            return;
                        }
                        setError(normalizeError(cause));
                    } finally{
                        if (!cancelled) {
                            setIsLoading(false);
                        }
                    }
                }
            }["useVerificationRequests.useEffect.load"];
            void load();
            return ({
                "useVerificationRequests.useEffect": ()=>{
                    cancelled = true;
                }
            })["useVerificationRequests.useEffect"];
        }
    }["useVerificationRequests.useEffect"], [
        verificationPublicId
    ]);
    // ===========================================================================
    // Result
    // ===========================================================================
    return {
        requests,
        isLoading,
        error,
        reload: loadRequests
    };
}
_s(useVerificationRequests, "9AlKfRyfsQG7Mcw+FhO2yA4v4Vg=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/verification/hooks/use-verification.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useVerification",
    ()=>useVerification
]);
// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
// -----------------------------------------------------------------------------
// Verification — API
// -----------------------------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$verification$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/verification/api/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$verification$2f$api$2f$verification$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/verification/api/verification.api.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
// -----------------------------------------------------------------------------
// sisiMove — useVerification
// -----------------------------------------------------------------------------
//
// React hook for retrieving and creating a Verification aggregate.
//
// Responsibilities:
// - load the current authenticated identity's Verification;
// - load a Verification by public ID when explicitly requested;
// - expose loading/error state;
// - expose reload capability;
// - start Verification for the authenticated identity.
//
// Non-responsibilities:
// - authentication/session management;
// - verification business rules;
// - authorization;
// - HTTP transport;
// - file upload;
// - Verification Request lifecycle.
//
// Those responsibilities remain inside their respective feature boundaries.
//
// -----------------------------------------------------------------------------
//
// Verification read boundaries:
//
// Current authenticated identity:
//
//     GET /verifications/me
//          ↓
//     getMyVerification()
//
// Explicit Verification resource:
//
//     GET /verifications/:verificationPublicId
//          ↓
//     getVerification(verificationPublicId)
//
// Registration creates a Verification aggregate, so `null` does NOT mean that
// the authenticated identity has no Verification. A current-user lookup should
// therefore use GET /verifications/me.
//
// -----------------------------------------------------------------------------
'use client';
;
;
// =============================================================================
// Error Normalization
// =============================================================================
function normalizeError(cause) {
    if (cause instanceof Error) {
        return cause;
    }
    if (typeof cause === 'string') {
        return new Error(cause);
    }
    return new Error('Unable to load verification.');
}
function useVerification(options = {}) {
    _s();
    // =========================================================================== 
    // Options
    // ===========================================================================
    const { verificationPublicId = null } = options;
    const hasExplicitVerification = verificationPublicId !== null;
    // =========================================================================== 
    // State
    // ===========================================================================
    const [verification, setVerification] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [isCreating, setIsCreating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // =========================================================================== 
    // Load Verification
    // ===========================================================================
    const loadVerification = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useVerification.useCallback[loadVerification]": async ()=>{
            setIsLoading(true);
            setError(null);
            try {
                const result = hasExplicitVerification ? await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$verification$2f$api$2f$verification$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getVerification"])(verificationPublicId) : await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$verification$2f$api$2f$verification$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMyVerification"])();
                setVerification(result);
            } catch (cause) {
                setError(normalizeError(cause));
            } finally{
                setIsLoading(false);
            }
        }
    }["useVerification.useCallback[loadVerification]"], [
        hasExplicitVerification,
        verificationPublicId
    ]);
    // =========================================================================== 
    // Initial / Identifier Change Load
    // ===========================================================================
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useVerification.useEffect": ()=>{
            let cancelled = false;
            const load = {
                "useVerification.useEffect.load": async ()=>{
                    setIsLoading(true);
                    setError(null);
                    try {
                        const result = hasExplicitVerification ? await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$verification$2f$api$2f$verification$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getVerification"])(verificationPublicId) : await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$verification$2f$api$2f$verification$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMyVerification"])();
                        if (cancelled) {
                            return;
                        }
                        setVerification(result);
                    } catch (cause) {
                        if (cancelled) {
                            return;
                        }
                        setError(normalizeError(cause));
                    } finally{
                        if (!cancelled) {
                            setIsLoading(false);
                        }
                    }
                }
            }["useVerification.useEffect.load"];
            void load();
            return ({
                "useVerification.useEffect": ()=>{
                    cancelled = true;
                }
            })["useVerification.useEffect"];
        }
    }["useVerification.useEffect"], [
        hasExplicitVerification,
        verificationPublicId
    ]);
    // =========================================================================== 
    // Start Verification
    // ===========================================================================
    const startVerification = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useVerification.useCallback[startVerification]": async ()=>{
            setIsCreating(true);
            setError(null);
            try {
                const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$verification$2f$api$2f$verification$2e$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createVerification"])();
                setVerification(result);
                return result;
            } catch (cause) {
                const normalizedError = normalizeError(cause);
                setError(normalizedError);
                throw normalizedError;
            } finally{
                setIsCreating(false);
            }
        }
    }["useVerification.useCallback[startVerification]"], []);
    // =========================================================================== 
    // Result
    // ===========================================================================
    return {
        verification,
        isLoading,
        isCreating,
        error,
        reload: loadVerification,
        startVerification
    };
}
_s(useVerification, "RtVGTjUXthuGW2l7Io9kne3Y8sY=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_13qtiiz._.js.map