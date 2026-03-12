'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Search, Loader2, Star, PlayCircle } from 'lucide-react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { Movie } from '@/lib/types'

export default function SearchBar({ onResultClick }: { onResultClick?: () => void }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Movie[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const searchMovies = async () => {
      if (!query.trim()) {
        setResults([])
        setIsOpen(false)
        return
      }

      setIsSearching(true)
      setIsOpen(true)

      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .ilike('title', `%${query}%`)
        .order('created_at', { ascending: false })
        .limit(5)

      if (data && !error) {
        setResults(data as Movie[])
      }
      setIsSearching(false)
    }

    const debounceTimer = setTimeout(searchMovies, 300)
    return () => clearTimeout(debounceTimer)
  }, [query, supabase])

  return (
    <div ref={wrapperRef} className="relative w-full z-50 group">
      <div className="relative flex items-center">
        <div className="absolute left-4 z-10 text-zinc-400 group-focus-within:text-[#d4a853] transition-colors">
          <Search className="w-4 h-4" />
        </div>
        <Input 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (query.trim() !== '') setIsOpen(true) }}
          placeholder="Search for movies, series, or genres..." 
          className="pl-11 pr-10 w-full h-11 bg-[#12121a]/80 backdrop-blur-md border-white/5 hover:border-white/10 hover:bg-[#1a1a24]/80 focus-visible:bg-[#0a0a0f]/90 focus-visible:ring-1 focus-visible:ring-[#d4a853]/50 focus-visible:border-[#d4a853]/50 transition-all duration-300 rounded-2xl text-sm font-medium shadow-inner"
        />
        {isSearching && (
          <div className="absolute right-4 z-10">
            <Loader2 className="w-4 h-4 text-zinc-400 animate-spin" />
          </div>
        )}
      </div>

      {isOpen && query.trim() !== '' && (
        <div className="absolute top-[calc(100%+16px)] left-2 right-2 md:left-0 md:right-auto md:w-[400px] max-h-[60vh] md:max-h-[500px] overflow-y-auto bg-[#0f0f16]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl shadow-black/80 z-[100] overflow-hidden divide-y divide-white/5 animate-in fade-in slide-in-from-top-2 duration-200">
          {results.length > 0 ? (
            results.map((movie) => (
              <Link
                key={movie.id}
                href={movie.type === 'movie' ? `/movies/${movie.id}` : `/series/${movie.id}`}
                onClick={() => {
                  setIsOpen(false)
                  setQuery('')
                  onResultClick?.()
                }}
                className="flex items-start gap-4 p-3 hover:bg-white/5 transition-colors group"
              >
                <div className="relative w-12 h-16 rounded-md overflow-hidden bg-zinc-900 flex-shrink-0">
                  {movie.poster_url ? (
                    <Image 
                      src={movie.poster_url} 
                      alt={movie.title} 
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <PlayCircle className="w-4 h-4 text-zinc-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 py-1">
                  <h4 className="text-sm font-semibold text-zinc-100 line-clamp-1 group-hover:text-[#d4a853] transition-colors">{movie.title}</h4>
                  <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400">
                    <span className="capitalize text-zinc-300 bg-white/10 px-1.5 py-0.5 rounded-md">{movie.type}</span>
                    {movie.release_year && (
                      <>
                        <span>•</span>
                        <span>{movie.release_year}</span>
                      </>
                    )}
                    {movie.rating > 0 && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-0.5 text-[#d4a853] font-medium">
                          <Star className="w-3 h-3 fill-[#d4a853]" />
                          {movie.rating}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            ))
          ) : !isSearching ? (
            <div className="p-4 text-center text-sm text-zinc-400">
              No results found for &quot;{query}&quot;
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
