// -----------------------------------------------------------------------------
// sisiMove — Public Asset Image
// -----------------------------------------------------------------------------
//
// Reusable presentation component for rendering a public Asset.
//
// This component:
//
// - receives a resolved PublicAsset model;
// - renders only the safe public URL;
// - does not construct URLs from storage metadata;
// - does not fetch Asset data;
// - does not expose internal Asset information;
// - can be reused by Journey cards, Demand cards, trust badges, and detail
//   pages.
//
// The component uses next/image for optimized image delivery.
//
// -----------------------------------------------------------------------------

import Image, { type ImageProps } from "next/image";

import type { PublicAsset } from "@/features/assets/models";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface PublicAssetImageProps
  extends Omit<ImageProps, "src" | "alt"> {
  /**
   * Public Asset read model.
   */
  asset: PublicAsset;

  /**
   * Optional alternative text override.
   *
   * When omitted, the value from asset.alt is used.
   */
  alt?: string;

  /**
   * Fallback alternative text when the asset does not provide alt text.
   *
   * Defaults to "Public asset".
   */
  fallbackAlt?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function PublicAssetImage({
  asset,
  alt,
  fallbackAlt = "Public asset",
  ...imageProps
}: PublicAssetImageProps) {
  const resolvedAlt = alt ?? asset.alt ?? fallbackAlt;

  return (
    <Image
      {...imageProps}
      src={asset.url}
      alt={resolvedAlt}
    />
  );
}