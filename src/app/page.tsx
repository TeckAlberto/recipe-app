// Imports
import { supabase } from '@/lib/supabase'
import SearchBar from '@/components/SearchBar'
import RecipeCard from '@/components/RecipeCard'

type RecipePreview = {
  id: string
  title: string
  main_image_url: string | null
  description: string | null
}

async function getAllRecipes(query: string): Promise<RecipePreview[]> {
  let queryBuilder = supabase.from('recipes').select('id, title, main_image_url, description')

  if (query) {
    queryBuilder = queryBuilder.ilike('title', `%${query}%`)
  }

  const { data, error } = await queryBuilder.order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching recipes:', error.message)
    return []
  }

  return data
}

export default async function HomePage(props: { searchParams?: Promise<{ q?: string }> }) {
  const searchParams = await props.searchParams
  const query = searchParams?.q || ''
  const recipes = await getAllRecipes(query)

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-50 p-6 md:p-12">
      {/* Título */}
      <h1 className="mb-8 text-4xl font-extrabold text-slate-900 text-center">Recetas Virales</h1>

      {/* Barra de búsqueda “pro” */}
      <SearchBar />

      {/* Grid de recetas */}
      <div className="w-full max-w-6xl mt-8">
        {recipes.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe, index) => (
              <div
                key={recipe.id}
                className={'animate-fadeSlideUp'}
                style={{ animationDelay: `${index * 100}ms` }} // 100ms de retraso entre cada tarjeta
              >
                <RecipeCard recipe={recipe} />
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-8 text-center text-lg text-slate-500">
            {query ? 'No se encontraron recetas.' : 'No hay recetas disponibles.'}
          </p>
        )}
      </div>
    </main>
  )
}
