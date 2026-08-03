// src/domains/assets/domain/exceptions/index.ts

// Base
export * from './asset-domain.exception';

// Asset
export * from './asset/asset-already-archived.exception';
export * from './asset/asset-already-deleted.exception';
export * from './asset/asset-already-uploaded.exception';
export * from './asset/invalid-asset-state-transition.exception';
export * from './asset/asset-not-ready.exception';
export * from './asset/asset-object-key-already-exists.exception';
export * from './asset/asset-checksum-already-exists.exception';
export * from './asset/asset-not-found.exception';
export * from './asset/asset-processing-not-found.exception';
export * from './asset/asset-processing-not-started.exception';

// Storage
export * from './storage/invalid-bucket.exception';
export * from './storage/invalid-object-key.exception';

// File
export * from './file/invalid-asset-size.exception';
export * from './file/invalid-file-name.exception';
export * from './file/invalid-mime-type.exception';

// Checksum
export * from './checksum/checksum-algorithm-mismatch.exception';
export * from './checksum/invalid-checksum.exception';

// Image
export * from './image/invalid-color-depth.exception';
export * from './image/invalid-image-height.exception';
export * from './image/invalid-image-width.exception';

// Media
export * from './media/invalid-duration.exception';

//scan

export * from './scan/invalid-asset-threat-name.exception';
export * from './scan/asset-scan-already-completed.exception';
export * from './scan/asset-scan-not-found.exception';

//moderation

export * from './moderation/asset-moderation-already-completed.exception';
export * from './moderation/invalid-moderation-confidence.exception';
export * from './moderation/invalid-moderation-reason.exception';
export * from './moderation/asset-moderation-not-found.exception';

export * from './asset-reference/duplicate-asset-reference.exception';

export * from './asset-variant/duplicate-asset-variant.exception';
