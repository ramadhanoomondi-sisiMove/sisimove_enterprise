// -----------------------------------------------------------------------------
// Assets — HTTP Request DTOs
// -----------------------------------------------------------------------------
//
// Public request DTO barrel for the Assets HTTP boundary.
//
// These DTOs expose only values that belong at the transport boundary.
// Technical/domain concerns remain inside the application and domain layers.
//
// -----------------------------------------------------------------------------

export { CreateAssetRequestDto } from './create-asset.request.dto';
export { UploadAssetRequestDto } from './upload-asset.request.dto';
export { ChangeAssetVisibilityRequestDto } from './change-asset-visibility.request.dto';
export { ArchiveAssetRequestDto } from './archive-asset.request.dto';
export { DeleteAssetRequestDto } from './delete-asset.request.dto';
