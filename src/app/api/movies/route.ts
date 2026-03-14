import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')
  const search = searchParams.get('search')
  const genre = searchParams.get('genre')

  let query = supabase.from('movies').select('*').order('created_at', { ascending: false })

  if (type) {
    query = query.eq('type', type)
  }
  if (search) {
    query = query.ilike('title', `%${search}%`)
  }
  if (genre) {
    query = query.contains('genre', [genre])
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const isArray = Array.isArray(body)
  
  let query = supabase.from('movies').insert(isArray ? body : [body]).select()
  
  if (!isArray) {
    // @ts-expect-error - single() changes the return type complexity, simpler to ignore for now than to reconstruct the type
    query = query.single()
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
