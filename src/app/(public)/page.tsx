'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import MovieCard from '@/components/MovieCard'
import { Movie } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { Search } from 'lucide-react'
import Image from 'next/image'

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
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-24 px-4 border-b border-white/5 bg-gradient-to-b from-[#d4a853]/5 to-transparent">
        {/* Background Decorative Blurs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#d4a853]/10 rounded-full blur-[128px] pointer-events-none -z-10" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[128px] pointer-events-none -z-10" />
        
        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <Carousel
            opts={{ loop: true }}
            plugins={[Autoplay({ delay: 5000 })]}
            className="w-full"
          >
            <CarouselContent>

              {/* Dynamic Slides - Featured Movies */}
              {movies.slice(0, 3).map((movie, index) => (
                <CarouselItem key={movie.id} className="relative">
                  <div className="py-8 sm:py-12 lg:py-20 relative w-full rounded-3xl overflow-hidden px-6 lg:px-16 flex flex-col md:flex-row items-center gap-8 lg:gap-16 border border-white/5 shadow-2xl">
                     <div className="absolute inset-0 z-0">
                       <Image 
                         src={movie.poster_url || ''} 
                         alt="Background Backdrop" 
                         fill
                         className="object-cover opacity-20 blur-xl scale-110" 
                         priority={index === 0}
                       />
                       <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-t md:from-black/90 md:to-black/40 from-[#0a0a0f] via-[#0a0a0f]/80 to-[#0a0a0f]/40" />
                     </div>

                     {/* Text Content */}
                     <div className="relative z-10 flex-1 animate-fade-in-up text-center md:text-left flex flex-col items-center md:items-start">
                       <div className="bg-[#d4a853] text-[#0a0a0f] text-[10px] sm:text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4 sm:mb-6 shadow-xl shadow-[#d4a853]/20">
                         Featured {movie.type === 'movie' ? 'Movie' : 'Series'}
                       </div>
                       <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-4 text-white drop-shadow-2xl line-clamp-2">
                          {movie.title}
                       </h1>
                       <p className="text-zinc-300 text-sm sm:text-base md:text-lg max-w-2xl mb-8 leading-relaxed drop-shadow-xl line-clamp-3">
                          {movie.description || "Watch directly on Telegram with one click."}
                       </p>
                       <div className="flex flex-wrap gap-4 items-center justify-center md:justify-start">
                         <a href={`/${movie.type === 'movie' ? 'movies' : 'series'}/${movie.id}`} className="bg-white text-black font-bold py-3 px-8 rounded-full hover:bg-zinc-200 transition-colors shadow-xl shadow-white/10 hover:shadow-white/20 active:scale-95 duration-200 flex items-center gap-2 text-sm sm:text-base">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                            Watch Now
                         </a>
                       </div>
                     </div>
                     
                      <div className="relative z-10 w-48 sm:w-60 md:w-72 lg:w-80 flex-shrink-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <div className="aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10 group relative">
                          <Image 
                            src={movie.poster_url || ''} 
                            alt={movie.title} 
                            fill
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>
                      </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto animate-fade-in-up relative z-30" style={{ animationDelay: '0.2s' }}>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#d4a853]/20 rounded-2xl blur-lg transition-opacity opacity-0 group-hover:opacity-100 duration-500" />
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#d4a853] transition-colors w-[22px] h-[22px]" />
                <input
                  type="text"
                  placeholder="Search movies & series..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-4 py-4 rounded-2xl bg-[#0a0a0f]/90 backdrop-blur-md text-white placeholder-zinc-500 border border-white/10 focus:border-[#d4a853]/50 focus:ring-1 focus:ring-[#d4a853]/50 transition-all outline-none shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-7 relative z-20">
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8 bg-[#12121a]/80 backdrop-blur-xl p-2 rounded-2xl border border-white/5 shadow-xl w-fit mx-auto">
          {/* Type filters */}
          <Link href="/"
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${!typeFilter ? 'bg-white text-zinc-900 shadow-md' : 'text-zinc-400 hover:bg-white/10 hover:text-white'}`}>
            All
          </Link>
          <Link href="/?type=movie"
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${typeFilter === 'movie' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'text-zinc-400 hover:bg-white/10 hover:text-white'}`}>
            🎬 Movies
          </Link>
          <Link href="/?type=series"
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${typeFilter === 'series' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-zinc-400 hover:bg-white/10 hover:text-white'}`}>
            📺 Series
          </Link>

          <div className="w-px h-6 bg-white/10 mx-2 hidden sm:block" />

          {/* Genre filters */}
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => setActiveGenre(activeGenre === genre ? null : genre)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${activeGenre === genre ? 'bg-[#d4a853]/20 text-[#d4a853] border border-[#d4a853]/30' : 'text-zinc-400 hover:bg-white/10 hover:text-white'}`}>
              {genre}
            </button>
          ))}
        </div>
      </section>

      {/* Content Grid */}
      <section className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-4 sm:gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow-lg h-full">
                  <div className="aspect-[2/3] bg-zinc-800/50 animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-zinc-800/80 rounded w-3/4 animate-pulse" />
                    <div className="h-3 bg-zinc-800/80 rounded w-1/2 animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-32 rounded-3xl border border-dashed border-white/10 bg-white/[0.02]">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center bg-zinc-900 border border-white/5 shadow-2xl shadow-black/50">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5">
                <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
                <line x1="7" y1="2" x2="7" y2="22" />
                <line x1="17" y1="2" x2="17" y2="22" />
                <line x1="2" y1="12" x2="22" y2="12" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-white mb-2">No content found</h3>
            <p className="text-zinc-500 text-lg max-w-md mx-auto">We couldn't find any movies or series matching your current filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 lg:gap-8">
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
