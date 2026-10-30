
import { ProviderLoadingState } from "@/components/admin/finance/providers";

export default function ProvidersLoading() {
  return (
    <div
      className="space-y-6 p-6"
      aria-label="Loading payment providers page"
      aria-busy="true"
    >
      {/* Page heading */}
      <div className="space-y-2">
        <ProviderLoadingState className="h-7 w-64" />
        <ProviderLoadingState className="h-4 w-96 max-w-full" />
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="space-y-3 rounded-xl border border-slate-200 bg-white p-5"
          >
            <ProviderLoadingState className="h-4 w-28" />
            <ProviderLoadingState className="h-8 w-20" />
            <ProviderLoadingState className="h-3 w-36" />
          </div>
        ))}
      </div>

      {/* Provider directory */}
      <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="space-y-2">
            <ProviderLoadingState className="h-5 w-44" />
            <ProviderLoadingState className="h-4 w-64 max-w-full" />
          </div>

          <ProviderLoadingState className="h-10 w-36" />
        </div>

        {/* Search and filters */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <ProviderLoadingState className="h-10 flex-1" />
          <ProviderLoadingState className="h-10 w-full sm:w-40" />
          <ProviderLoadingState className="h-10 w-full sm:w-40" />
        </div>

        {/* Table header */}
        <div className="hidden grid-cols-6 gap-4 border-b border-slate-100 py-3 md:grid">
          {Array.from({ length: 6 }).map((_, index) => (
            <ProviderLoadingState
              key={index}
              className="h-3 w-20"
            />
          ))}
        </div>

        {/* Table rows */}
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-2 gap-4 border-b border-slate-100 py-4 last:border-0 md:grid-cols-6"
            >
              <ProviderLoadingState className="h-5 w-28" />
              <ProviderLoadingState className="h-5 w-24" />
              <ProviderLoadingState className="h-5 w-20" />
              <ProviderLoadingState className="h-5 w-24" />
              <ProviderLoadingState className="h-5 w-20" />
              <ProviderLoadingState className="h-8 w-8 justify-self-end" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
