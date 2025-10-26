import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params

  if (!id) {
    return NextResponse.json({ error: 'Recipe ID is required' }, { status: 400 })
  }

  try {
    const { data, error } = await supabase
      .from('recipes')
      .select(
        `
        *,
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

    if (error) {
      console.error('Supabase error:', error.message)
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Recipe not found' }, { status: 404 })
      }
      throw error
    }

    if (!data) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Internal server error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
