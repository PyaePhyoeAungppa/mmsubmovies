'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Movie } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Clapperboard, Tv, LayoutDashboard, Edit } from 'lucide-react'
import Image from 'next/image'

export default function AdminDashboard() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAll() {
      const supabase = createClient()
      const { data } = await supabase.from('movies').select('*').order('created_at', { ascending: false })
      if (data) setMovies(data as Movie[])
      setLoading(false)
    }
    fetchAll()
  }, [])

  const movieCount = movies.filter((m) => m.type === 'movie').length
  const seriesCount = movies.filter((m) => m.type === 'series').length
  const recentItems = movies.slice(0, 5)

  const stats = [
    {
      label: 'Total Movies',
      value: movieCount,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20',
      icon: <Clapperboard className="w-5 h-5 text-indigo-400" />,
    },
    {
      label: 'Total Series',
      value: seriesCount,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      icon: <Tv className="w-5 h-5 text-emerald-400" />,
    },
    {
      label: 'Total Content',
      value: movies.length,
      color: 'text-[#d4a853]',
      bg: 'bg-[#d4a853]/10',
      border: 'border-[#d4a853]/20',
      icon: <LayoutDashboard className="w-5 h-5 text-[#d4a853]" />,
    },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of your content</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className={`transition-all hover:scale-[1.02] bg-[#12121a] ${stat.border}`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  {stat.icon}
                </div>
              </div>
              <p className={`text-4xl font-bold ${stat.color}`}>
                {loading ? '—' : stat.value}
              </p>
              <p className="text-sm text-zinc-500 mt-2 font-medium">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4 mb-10">
        <Link href="/admin/movies/new" className="inline-flex items-center justify-center gap-2 text-sm px-6 py-3 rounded-xl font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-lg shadow-indigo-600/20">
          <Plus className="w-4 h-4" />
          Add Movie
        </Link>
        <Link href="/admin/series/new"
          className="inline-flex items-center justify-center gap-2 text-sm px-6 py-3 rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-lg shadow-emerald-600/20">
          <Plus className="w-4 h-4" />
          Add Series
        </Link>
      </div>

      {/* Recent Additions */}
      {/* Recent Additions */}
      <Card className="bg-[#12121a] border-white/5 overflow-hidden">
        <CardHeader className="px-6 py-5 border-b border-white/5">
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-[#d4a853]" />
            Recent Additions
          </CardTitle>
        </CardHeader>
        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 w-full bg-white/5 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : recentItems.length === 0 ? (
          <div className="p-10 text-center text-zinc-500 flex flex-col items-center">
            <Clapperboard className="w-12 h-12 mb-3 opacity-20" />
            <p>No content added yet. Start by adding a movie or series.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {recentItems.map((item) => (
              <div key={item.id} className="px-6 py-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors group">
                <div className="w-12 h-16 rounded-md overflow-hidden flex-shrink-0 bg-zinc-900 border border-white/10 shadow-sm relative">
                  {item.poster_url ? (
                    <Image src={item.poster_url} alt="" fill className="object-cover" />
                  ) : (
                     <div className="w-full h-full flex flex-col items-center justify-center text-zinc-700">
                        <Clapperboard className="w-4 h-4" />
                     </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-zinc-100 truncate group-hover:text-[#d4a853] transition-colors">{item.title}</p>
                  <p className="text-xs text-zinc-500 mt-1">{item.release_year} • {item.genre?.join(', ') || 'No genre'}</p>
                </div>
                
                <Badge variant="secondary" className={`${item.type === 'movie' ? 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'} border-transparent`}>
                  {item.type.toUpperCase()}
                </Badge>
                
                <Link
                  href={`/admin/${item.type === 'movie' ? 'movies' : 'series'}/${item.id}/edit`}
                  className="ml-4 p-2 text-zinc-500 hover:text-[#d4a853] hover:bg-[#d4a853]/10 rounded-md transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
