
export default function JourneyCompletionDetailLoading() {
  return (
    <main className="page-shell">
      <div className="page-container space-y-6">
        {/* Detail header skeleton */}
        <section className="space-y-4">
          <div className="h-4 w-36 animate-pulse rounded bg-[var(--background-subtle)]" />

          <div className="h-8 w-72 max-w-full animate-pulse rounded-lg bg-[var(--background-subtle)]" />

          <div className="h-4 w-full max-w-xl animate-pulse rounded bg-[var(--background-subtle)]" />

          <div className="flex flex-wrap gap-3">
            <div className="h-8 w-32 animate-pulse rounded-lg bg-[var(--background-subtle)]" />
            <div className="h-8 w-32 animate-pulse rounded-lg bg-[var(--background-subtle)]" />
          </div>
        </section>

        {/* Completion summary skeleton */}
        <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <div className="space-y-4">
            <div className="h-5 w-48 animate-pulse rounded bg-[var(--background-subtle)]" />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="space-y-2 rounded-lg border border-[var(--border)] p-4"
                >
                  <div className="h-3 w-24 animate-pulse rounded bg-[var(--background-subtle)]" />
                  <div className="h-6 w-32 animate-pulse rounded bg-[var(--background-subtle)]" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Detail sections skeleton */}
        <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="space-y-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5"
            >
              <div className="h-5 w-40 animate-pulse rounded bg-[var(--background-subtle)]" />

              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="h-4 w-full animate-pulse rounded bg-[var(--background-subtle)]"
                  />
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
