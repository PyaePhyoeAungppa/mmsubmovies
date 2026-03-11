'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Movie } from '@/lib/types'
import MovieForm from '@/components/MovieForm'

export default function EditMoviePage() {
  const params = useParams()
  const [movie, setMovie] = useState<Movie | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMovie() {
      const supabase = createClient()
      const { data } = await supabase
        .from('movies')
        .select('*')
        .eq('id', params.id)
        .single()
      if (data) setMovie(data as Movie)
      setLoading(false)
    }
    fetchMovie()
  }, [params.id])

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div className="skeleton h-8 w-48" />
        <div className="skeleton h-4 w-32" />
        <div className="space-y-4 mt-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-12 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="p-8 text-center text-gray-500">
        Movie not found.
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Edit Movie</h1>
        <p className="text-gray-500 text-sm mt-1">Update the details for &ldquo;{movie.title}&rdquo;</p>
      </div>
      <MovieForm initialData={movie} contentType="movie" />
    </div>
  )
}
