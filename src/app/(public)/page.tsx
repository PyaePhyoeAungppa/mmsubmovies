'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import MovieCard from '@/components/MovieCard'
import { Movie } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'

function HomeContent() {
  const searchParams = useSearchParams()
  const typeFilter = searchParams.get('type')
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeGenre, setActiveGenre] = useState<string | null>(null)

  const fetchMovies = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    let query = supabase.from('movies').select('*').order('created_at', { ascending: false })

    if (typeFilter) {
      query = query.eq('type', typeFilter)
    }

    if (searchQuery.trim()) {
      query = query.ilike('title', `%${searchQuery.trim()}%`)
    }

    if (activeGenre) {
      query = query.contains('genre', [activeGenre])
    }

    const { data, error } = await query

    if (!error && data) {
      setMovies(data as Movie[])
    }
    setLoading(false)
  }, [typeFilter, searchQuery, activeGenre])

  useEffect(() => {
    fetchMovies()
  }, [fetchMovies])

  const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller', 'Animation']

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-gradient py-16 sm:py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-4">
              <span className="gold-text">Movies & Series</span>
              <br />
              <span className="text-white/90">with Myanmar Subtitles</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
              Browse our collection of the latest films and TV shows. Watch directly on Telegram with one click.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                placeholder="Search movies & series..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#d4a853]/30"
                style={{ background: 'rgba(26, 26, 46, 0.8)', border: '1px solid rgba(255,255,255,0.08)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-6">
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {/* Type filters */}
          <a href="/"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${!typeFilter ? 'bg-[#d4a853] text-[#0a0a0f]' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}>
            All
          </a>
          <a href="/?type=movie"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${typeFilter === 'movie' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}>
            🎬 Movies
          </a>
          <a href="/?type=series"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${typeFilter === 'series' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}>
            📺 Series
          </a>

          <div className="w-px h-6 bg-white/10 mx-2 hidden sm:block" />

          {/* Genre filters */}
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => setActiveGenre(activeGenre === genre ? null : genre)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${activeGenre === genre ? 'bg-[#d4a853]/20 text-[#d4a853] border border-[#d4a853]/30' : 'bg-white/5 text-gray-500 hover:text-gray-300 hover:bg-white/10'}`}>
              {genre}
            </button>
          ))}
        </div>
      </section>

      {/* Content Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="glass-card overflow-hidden">
                  <div className="aspect-[2/3] skeleton" />
                  <div className="p-4 space-y-2">
                    <div className="skeleton h-4 w-3/4" />
                    <div className="skeleton h-3 w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ background: 'var(--dark-700)' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5">
                <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
                <line x1="7" y1="2" x2="7" y2="22" />
                <line x1="17" y1="2" x2="17" y2="22" />
                <line x1="2" y1="12" x2="22" y2="12" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No content yet</h3>
            <p className="text-gray-500">Movies and series will appear here once added from the admin panel.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {movies.map((movie, index) => (
              <div key={movie.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#d4a853] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  )
}
