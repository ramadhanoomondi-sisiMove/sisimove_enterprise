// -----------------------------------------------------------------------------
// sisiMove — Assets Page
// -----------------------------------------------------------------------------
//
// Authenticated Asset management destination.
//
// The page is intentionally thin:
// - Route responsibility stays here
// - Asset management UI belongs to AssetManager
// - Asset operations are performed through Asset dialogs
//
// -----------------------------------------------------------------------------

import { AssetManager } from '@/components/assets';

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default function AssetsPage() {
  return <AssetManager />;
}