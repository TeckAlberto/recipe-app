export default function RecipeCardSkeleton() {
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden shadow-md animate-pulse w-full">
      {/* Skeleton de la Imagen */}
      <div className="h-52 w-full bg-slate-100 rounded-t-xl" />

      {/* Skeleton del Contenido */}
      <div className="p-5 bg-white rounded-b-xl">
        {/* Título */}
        <div className="h-6 w-3/4 rounded-md bg-slate-200 mb-2" />
        {/* Descripción */}
        <div className="h-[2.8em] w-full rounded-md bg-slate-200 mb-2" />
        {/* Indicador de acción */}
        <div className="h-6 w-24 rounded-full bg-blue-100" />
      </div>
    </div>
  )
}
