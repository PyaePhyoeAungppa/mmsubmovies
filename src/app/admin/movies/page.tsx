'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { GENRES, Movie } from '@/lib/types'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Pagination } from '@/components/ui/pagination'
import { Plus, Search, Edit2, Trash2, Film, SlidersHorizontal, LayoutGrid, List } from 'lucide-react'
import Image from 'next/image'

export default function AdminMoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [minYear, setMinYear] = useState<number | ''>('')
  const [maxYear, setMaxYear] = useState<number | ''>('')
  const [minRating, setMinRating] = useState<number | ''>('')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating' | 'title'>('newest')
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [deleting, setDeleting] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchMovies()
  }, [])

  async function fetchMovies() {
    const supabase = createClient()
    const { data } = await supabase
      .from('movies')
      .select('*')
      .eq('type', 'movie')
      .order('created_at', { ascending: false })
    if (data) setMovies(data as Movie[])
    setLoading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this movie?')) return
    setDeleting(id)

    const res = await fetch(`/api/movies/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setMovies((prev) => prev.filter((m) => m.id !== id))
    }
    setDeleting(null)
  }

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    )
  }

  const filtered = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()

    let result = movies.filter((m) => {
      const matchesQuery = query
        ? m.title.toLowerCase().includes(query) ||
          m.genre?.some((g) => g.toLowerCase().includes(query))
        : true

      const matchesGenres =
        selectedGenres.length === 0 ||
        m.genre?.some((g) => selectedGenres.includes(g))

      const matchesYear =
        (minYear === '' || m.release_year >= minYear) &&
        (maxYear === '' || m.release_year <= maxYear)

      const matchesRating = minRating === '' || m.rating >= minRating

      return matchesQuery && matchesGenres && matchesYear && matchesRating
    })

    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case 'rating':
          return (b.rating || 0) - (a.rating || 0)
        case 'title':
          return a.title.localeCompare(b.title)
        case 'newest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

    return result
  }, [movies, searchQuery, selectedGenres, minYear, maxYear, minRating, sortBy])

  // Reset to first page when filters/search change
  useEffect(() => {
    setPage(1)
  }, [searchQuery, selectedGenres, minYear, maxYear, minRating, sortBy])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const startIndex = (page - 1) * pageSize
  const pageItems = filtered.slice(startIndex, startIndex + pageSize)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Movies</h1>
          <p className="text-zinc-500 text-xs mt-0.5">Manage your collection ({movies.length})</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-1 bg-[#12121a] border border-white/10 rounded-xl p-1">
            <Button
              type="button"
              variant={viewMode === 'table' ? 'secondary' : 'ghost'}
              size="icon-sm"
              onClick={() => setViewMode('table')}
              className="h-8 w-8 text-zinc-300"
              aria-label="Table view"
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon-sm"
              onClick={() => setViewMode('grid')}
              className="h-8 w-8 text-zinc-300"
              aria-label="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
          </div>

          <Link href="/admin/movies/new">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 rounded-xl h-9 px-4 text-sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Movie
            </Button>
          </Link>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              type="text"
              placeholder="Search by title or genre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-[#12121a] border-white/10 text-white rounded-xl h-10 text-sm focus-visible:ring-indigo-500/50"
            />
          </div>

          <div className="flex flex-wrap gap-3 items-center text-xs text-zinc-500">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
              <span className="font-medium">
                {filtered.length} shown
                {movies.length > 0 && filtered.length !== movies.length
                  ? ` of ${movies.length}`
                  : ` total`}
              </span>
            </div>

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as 'newest' | 'oldest' | 'rating' | 'title')
              }
              className="h-9 rounded-lg bg-[#12121a] border border-white/10 text-xs text-zinc-300 px-3 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500/50"
            >
              <option value="newest">Sort: Newest first</option>
              <option value="oldest">Sort: Oldest first</option>
              <option value="rating">Sort: Highest rating</option>
              <option value="title">Sort: Title A–Z</option>
            </select>

            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Year from"
                value={minYear === '' ? '' : minYear}
                onChange={(e) =>
                  setMinYear(e.target.value ? parseInt(e.target.value, 10) || '' : '')
                }
                className="w-24 h-9 rounded-lg bg-[#12121a] border border-white/10 text-xs text-zinc-300 px-2"
              />
              <Input
                type="number"
                placeholder="to"
                value={maxYear === '' ? '' : maxYear}
                onChange={(e) =>
                  setMaxYear(e.target.value ? parseInt(e.target.value, 10) || '' : '')
                }
                className="w-20 h-9 rounded-lg bg-[#12121a] border border-white/10 text-xs text-zinc-300 px-2"
              />
              <Input
                type="number"
                placeholder="Min ★"
                value={minRating === '' ? '' : minRating}
                onChange={(e) =>
                  setMinRating(e.target.value ? parseFloat(e.target.value) || '' : '')
                }
                step="0.1"
                min="0"
                max="10"
                className="w-20 h-9 rounded-lg bg-[#12121a] border border-white/10 text-xs text-zinc-300 px-2"
              />
            </div>
          </div>
        </div>

        {/* Genre filters */}
        <div className="flex flex-wrap gap-2">
          {GENRES.map((genre) => {
            const isSelected = selectedGenres.includes(genre)
            return (
              <button
                key={genre}
                type="button"
                onClick={() => toggleGenre(genre)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all ${
                  isSelected
                    ? 'bg-[#d4a853] text-[#0a0a0f] shadow-md shadow-[#d4a853]/30'
                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
                }`}
              >
                {genre}
              </button>
            )
          })}
          {selectedGenres.length > 0 && (
            <button
              type="button"
              onClick={() => setSelectedGenres([])}
              className="ml-1 text-[11px] text-zinc-400 hover:text-zinc-200 underline underline-offset-4"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="rounded-xl border border-white/10 bg-[#12121a] overflow-hidden mb-8">
        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 w-full bg-white/5 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-zinc-500 flex flex-col items-center">
            <Film className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-lg font-medium">{searchQuery ? 'No movies match your search.' : 'No movies yet.'}</p>
            {!searchQuery && <p className="text-sm mt-1">Add your first movie to get started!</p>}
          </div>
        ) : (
          <>
            {viewMode === 'table' ? (
              <div className="flex-1 min-h-0 overflow-auto">
                <Table>
                  <TableHeader className="bg-black/20 hover:bg-black/20 border-b border-white/10">
                    <TableRow className="border-none hover:bg-transparent">
                      <TableHead className="text-zinc-400 font-semibold h-12">Movie</TableHead>
                      <TableHead className="hidden sm:table-cell text-zinc-400 font-semibold h-12">Year</TableHead>
                      <TableHead className="hidden lg:table-cell text-zinc-400 font-semibold h-12">Rating</TableHead>
                      <TableHead className="hidden md:table-cell text-zinc-400 font-semibold h-12">Genre</TableHead>
                      <TableHead className="hidden lg:table-cell text-zinc-400 font-semibold h-12 text-center">Views</TableHead>
                      <TableHead className="hidden lg:table-cell text-zinc-400 font-semibold h-12 text-center">Clicks</TableHead>
                      <TableHead className="text-right text-zinc-400 font-semibold h-12">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pageItems.map((movie) => (
                      <TableRow key={movie.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                        <TableCell className="py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-14 rounded-md overflow-hidden flex-shrink-0 bg-zinc-900 border border-white/5 shadow-sm relative">
                              {movie.poster_url ? (
                                <Image src={movie.poster_url} alt="" fill className="object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Film className="w-4 h-4 text-zinc-700" />
                                </div>
                              )}
                            </div>
                            <span className="font-semibold text-zinc-100 group-hover:text-indigo-400 transition-colors truncate max-w-[250px]">
                              {movie.title}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-zinc-400">{movie.release_year}</TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {movie.rating > 0 ? (
                            <div className="flex items-center gap-1 font-medium text-[#d4a853] bg-[#d4a853]/10 w-fit px-2 py-1 rounded-md">
                              ⭐ {movie.rating}
                            </div>
                          ) : (
                            <span className="text-zinc-600">—</span>
                          )}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex flex-wrap gap-1.5">
                            {movie.genre?.slice(0, 2).map((g) => (
                              <span
                                key={g}
                                className="text-xs px-2.5 py-1 rounded-md bg-zinc-800/50 text-zinc-400 font-medium"
                              >
                                {g}
                              </span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-center">
                          <span className="text-zinc-300 font-mono">{(movie.views_count || 0).toLocaleString()}</span>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-center">
                          <span className="text-zinc-300 font-mono">{(movie.clicks_count || 0).toLocaleString()}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/admin/movies/${movie.id}/edit`}>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-zinc-400 hover:text-indigo-400 hover:bg-indigo-400/10 h-8 w-8"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(movie.id)}
                              disabled={deleting === movie.id}
                              className="text-zinc-400 hover:text-red-400 hover:bg-red-400/10 h-8 w-8 disabled:opacity-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex-1 min-h-0 overflow-auto p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {pageItems.map((movie) => (
                    <div
                      key={movie.id}
                      className="rounded-xl border border-white/10 bg-[#0c0c12] overflow-hidden flex"
                    >
                      <div className="w-24 h-32 sm:w-28 sm:h-36 flex-shrink-0 bg-zinc-900 border-r border-white/10 relative">
                        {movie.poster_url ? (
                          <Image src={movie.poster_url} alt="" fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Film className="w-5 h-5 text-zinc-700" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between">
                        <div>
                          <p className="font-semibold text-sm sm:text-base text-zinc-100 line-clamp-2 mb-1">
                            {movie.title}
                          </p>
                          <p className="text-xs text-zinc-500 mb-2">
                            {movie.release_year}{' '}
                            {movie.genre && movie.genre.length > 0 && `• ${movie.genre.slice(0, 2).join(', ')}`}
                          </p>
                          <div className="flex items-center gap-2 text-xs">
                            {movie.rating > 0 ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#d4a853]/10 text-[#d4a853] font-medium">
                                ⭐ {movie.rating}
                              </span>
                            ) : (
                              <span className="text-zinc-600">No rating</span>
                            )}
                            <span className="text-zinc-600 ml-2">•</span>
                            <span className="text-zinc-500 ml-2">{(movie.views_count || 0).toLocaleString()} views</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-end gap-2 mt-3">
                          <Link href={`/admin/movies/${movie.id}/edit`}>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="text-zinc-400 hover:text-indigo-400 hover:bg-indigo-400/10 h-8 w-8"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleDelete(movie.id)}
                            disabled={deleting === movie.id}
                            className="text-zinc-400 hover:text-red-400 hover:bg-red-400/10 h-8 w-8 disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-white/10 px-4 py-3 bg-black/30 flex justify-end shrink-0">
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
