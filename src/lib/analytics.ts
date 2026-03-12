'use client'

import { createClient } from '@/lib/supabase/client'

export async function trackView(id: string) {
  const supabase = createClient()
  
  // Custom RPC or direct increment if columns exist
  // For now, we'll try a direct update. 
  // Note: This requires the columns to exist in the database.
  try {
    const { data: current } = await supabase
      .from('movies')
      .select('views_count')
      .eq('id', id)
      .single()

    if (current) {
      await supabase
        .from('movies')
        .update({ views_count: (current.views_count || 0) + 1 })
        .eq('id', id)
    }
  } catch (error) {
    console.error('Error tracking view:', error)
  }
}

export async function trackClick(id: string) {
  const supabase = createClient()
  
  try {
    const { data: current } = await supabase
      .from('movies')
      .select('clicks_count')
      .eq('id', id)
      .single()

    if (current) {
      await supabase
        .from('movies')
        .update({ clicks_count: (current.clicks_count || 0) + 1 })
        .eq('id', id)
    }
  } catch (error) {
    console.error('Error tracking click:', error)
  }
}
