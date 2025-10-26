import RecipeCardSkeleton from '@/components/RecipeCardSkeleton'

export default function HomeLoading() {
  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-12 bg-slate-50">
      {/* Skeleton del Título */}
      <div className="h-10 w-64 rounded-md bg-slate-300 animate-pulse mb-8" />

      {/* Skeleton de la Barra de Búsqueda */}
      <div className="relative w-full max-w-md mb-8">
        <div className="w-full h-12 rounded-lg bg-white border border-slate-300 animate-pulse" />
      </div>

      {/* Skeleton del Grid de Recetas */}
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <RecipeCardSkeleton />
          <RecipeCardSkeleton />
          <RecipeCardSkeleton />
          <RecipeCardSkeleton />
          <RecipeCardSkeleton />
          <RecipeCardSkeleton />
        </div>
      </div>
    </main>
  )
}
