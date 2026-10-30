
// -----------------------------------------------------------------------------
// Admin — Payment Provider Page Model
// -----------------------------------------------------------------------------

import type { AdminProvider } from './admin-provider.model';
import type { AdminProviderQuery } from './admin-provider-query.model';

// -----------------------------------------------------------------------------
// Provider Directory Result
// -----------------------------------------------------------------------------

export interface AdminProviderPage {
  providers: AdminProvider[];
  query: AdminProviderQuery;
}
