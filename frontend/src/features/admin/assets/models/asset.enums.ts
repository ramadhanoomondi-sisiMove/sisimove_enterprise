
// -----------------------------------------------------------------------------
// sisiMove — Assets
// Asset Enums
// -----------------------------------------------------------------------------
//
// Mirrors the Asset enum values defined by the backend domain.
// Keep these values synchronized with the backend.
// -----------------------------------------------------------------------------

export enum AssetType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  DOCUMENT = 'DOCUMENT',
  OTHER = 'OTHER',
}

export enum AssetCategory {
  PROFILE_PHOTO = 'PROFILE_PHOTO',
  COVER_PHOTO = 'COVER_PHOTO',
  AVATAR = 'AVATAR',
  GOVERNMENT_ID = 'GOVERNMENT_ID',
  DRIVER_LICENSE = 'DRIVER_LICENSE',
  PASSPORT = 'PASSPORT',
  SELFIE = 'SELFIE',
  VEHICLE_PHOTO = 'VEHICLE_PHOTO',
  CHAT_ATTACHMENT = 'CHAT_ATTACHMENT',
  OTHER = 'OTHER',
}

export enum AssetStatus {
  UPLOADING = 'UPLOADING',
  UPLOADED = 'UPLOADED',
  READY = 'READY',
  ARCHIVED = 'ARCHIVED',
  DELETED = 'DELETED',
}

export enum AssetVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

export enum AssetStorageProvider {
  LOCAL = 'LOCAL',
  AWS_S3 = 'AWS_S3',
  GOOGLE_CLOUD_STORAGE = 'GOOGLE_CLOUD_STORAGE',
  AZURE_BLOB = 'AZURE_BLOB',
  CLOUDINARY = 'CLOUDINARY',
  BUNNY = 'BUNNY',
  OTHER = 'OTHER',
}
