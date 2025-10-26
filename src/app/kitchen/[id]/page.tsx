import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import KitchenModeClient from '@/components/KitchenModeClient' // Crearemos este

// --- Definición de Tipos ---
// (Es una buena práctica moverlos a un archivo, ej. src/types.ts)
export type Step = {
  id: string
  step_number: number
  instructions: string
  video_clip_url: string
}

export type RecipeWithSteps = {
  id: string
  title: string
  description: string | null
  // ...otros campos de la receta que quieras mostrar
  steps: Step[]
}
// --- Fin de Tipos ---

// Esta función obtiene los datos directamente de Supabase
async function getRecipe(id: string): Promise<RecipeWithSteps | null> {
  const { data, error } = await supabase
    .from('recipes')
    .select(
      `
      id,
      title,
      description,
      steps (
        id,
        step_number,
        instructions,
        video_clip_url
      )
    `
    )
    .eq('id', id)
    .order('step_number', { referencedTable: 'steps', ascending: true })
    .single()

  if (error || !data) {
    console.error('Error fetching recipe:', error?.message)
    return null
  }

  // Aseguramos que los datos coincidan con nuestro tipo
  return data as RecipeWithSteps
}

// El componente de página ahora es 'async'
export default async function KitchenPage({ params }: { params: { id: string } }) {
  const { id } = await params
  const recipe = await getRecipe(id)

  if (!recipe) {
    notFound() // Esto mostrará una página 404 si la receta no existe
  }

  // Pasamos los datos del servidor (recipe) como prop
  // a un componente de cliente que manejará la interactividad.
  return <KitchenModeClient recipe={recipe} />
}
