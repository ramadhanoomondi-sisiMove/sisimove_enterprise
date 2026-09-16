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

import Image, {
  type ImageProps,
} from 'next/image';

import type {
  PublicAsset,
} from '@/features/assets/models';


// =============================================================================
// Props
// =============================================================================

export interface PublicAssetImageProps
  extends Omit<ImageProps, 'src' | 'alt'> {
  /**
   * Public Asset read model.
   *
   * The Asset must already be resolved by the appropriate public read
   * boundary. This component does not fetch or resolve Asset data.
   */
  readonly asset: PublicAsset;

  /**
   * Optional context-specific alternative text.
   *
   * When supplied with a non-empty value, this takes precedence over
   * `asset.alt`.
   */
  readonly alt?: string;

  /**
   * Fallback alternative text when neither the explicit `alt` prop nor the
   * public Asset provides alternative text.
   *
   * Defaults to "Public asset".
   */
  readonly fallbackAlt?: string;
}


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
 */
function resolveAltText(
  asset: PublicAsset,
  alt: string | undefined,
  fallbackAlt: string,
): string {
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
 */
function resolveAssetUrl(
  asset: PublicAsset,
): string | null {
  const url = asset.url?.trim();

  return url || null;
}


// =============================================================================
// Component
// =============================================================================

/**
 * Render a public Asset using Next.js Image.
 *
 * This is a presentation-only component.
 *
 * It deliberately does not:
 *
 * - resolve Asset IDs;
 * - fetch Assets;
 * - inspect storage metadata;
 * - construct storage URLs;
 * - choose layout dimensions;
 * - choose cropping behavior.
 */
export function PublicAssetImage({
  asset,
  alt,
  fallbackAlt = 'Public asset',
  ...imageProps
}: PublicAssetImageProps) {
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
   */
  if (!resolvedUrl) {
    return null;
  }

  const resolvedAlt = resolveAltText(
    asset,
    alt,
    fallbackAlt,
  );

  return (
    <Image
      {...imageProps}
      src={resolvedUrl}
      alt={resolvedAlt}
    />
  );
}