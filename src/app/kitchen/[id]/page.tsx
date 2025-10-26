import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import KitchenModeClient from '@/components/KitchenModeClient'

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
  steps: Step[]
}

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

  return data as RecipeWithSteps
}

export default async function KitchenPage({ params }: { params: { id: string } }) {
  const { id } = await params
  const recipe = await getRecipe(id)

  if (!recipe) {
    notFound()
  }

  return <KitchenModeClient recipe={recipe} />
}
