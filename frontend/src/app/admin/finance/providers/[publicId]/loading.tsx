
import { ProviderLoadingState } from "@/components/admin/finance/providers";

export default function ProviderDetailLoading() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">

        {/* Breadcrumb */}

        <ProviderLoadingState className="h-4 w-48" />

        {/* Page Header */}

        <div className="space-y-3">
          <ProviderLoadingState className="h-4 w-36" />
          <ProviderLoadingState className="h-8 w-64" />
          <ProviderLoadingState className="h-4 w-full max-w-xl" />
        </div>

        {/* Provider Summary */}

        <div className="rounded-xl border border-[var(--border)] bg-background p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-3">
              <ProviderLoadingState className="h-5 w-48" />
              <ProviderLoadingState className="h-4 w-32" />
            </div>

            <ProviderLoadingState className="h-9 w-28" />
          </div>
        </div>

        {/* Metrics */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="space-y-3 rounded-xl border border-[var(--border)] p-5"
            >
              <ProviderLoadingState className="h-4 w-28" />
              <ProviderLoadingState className="h-8 w-20" />
              <ProviderLoadingState className="h-3 w-36" />
            </div>
          ))}
        </div>

        {/* Detail Sections */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="space-y-5 rounded-xl border border-[var(--border)] p-6"
            >
              <ProviderLoadingState className="h-5 w-40" />

              {Array.from({ length: 4 }).map((_, rowIndex) => (
                <div
                  key={rowIndex}
                  className="flex items-center justify-between gap-4"
                >
                  <ProviderLoadingState className="h-4 w-28" />
                  <ProviderLoadingState className="h-4 w-36" />
                </div>
              ))}
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
