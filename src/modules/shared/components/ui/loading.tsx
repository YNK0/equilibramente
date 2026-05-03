export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8" role="status" aria-label="Cargando">
      <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
    </div>
  );
}

export function PageLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
      <LoadingSpinner />
      <p className="text-sm text-gray-400">Cargando...</p>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="p-4 rounded-2xl border border-gray-100 bg-white shadow-sm animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
      <div className="h-3 bg-gray-100 rounded w-1/2 mb-2" />
      <div className="h-3 bg-gray-100 rounded w-1/3" />
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
