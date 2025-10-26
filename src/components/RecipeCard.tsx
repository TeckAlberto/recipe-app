'use client'

import Link from 'next/link'
import { CldImage } from 'next-cloudinary'

type RecipePreview = {
  id: string
  title: string
  main_image_url: string | null
  description: string | null
}

export default function RecipeCard({ recipe }: { recipe: RecipePreview }) {
  const publicId = recipe.main_image_url || 'recipes/placeholder'

  return (
    <Link
      href={`/kitchen/${recipe.id}`}
      className="group block overflow-hidden rounded-xl border border-slate-200 shadow-md transition-all duration-300 hover:scale-[1.04] hover:shadow-xl hover:shadow-blue-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
    >
      {/* Imagen con overlay de gradiente */}
      <div className="relative h-52 w-full overflow-hidden rounded-t-xl">
        <CldImage
          src={publicId}
          alt={`Imagen de ${recipe.title}`}
          fill
          crop="fill"
          gravity="auto"
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
      </div>

      {/* Contenido de texto */}
      <div className="p-5 bg-white rounded-b-xl">
        <h2
          className="truncate text-xl font-semibold text-slate-900 group-hover:text-blue-600 transition-colors duration-300"
          title={recipe.title}
        >
          {recipe.title}
        </h2>
        <p className="mt-2 line-clamp-2 text-slate-500 h-[2.8em]">
          {recipe.description || 'Una deliciosa receta para probar hoy.'}
        </p>
        {/* Indicador visual de acción */}
        <span className="mt-3 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600 transition-all duration-300 group-hover:bg-blue-200">
          Ver receta
        </span>
      </div>
    </Link>
  )
}
