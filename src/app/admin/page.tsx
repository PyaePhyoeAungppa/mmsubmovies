'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Movie } from '@/lib/types'

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
      color: '#818cf8',
      bg: 'rgba(99,102,241,0.1)',
      border: 'rgba(99,102,241,0.2)',
      icon: '🎬',
    },
    {
      label: 'Total Series',
      value: seriesCount,
      color: '#34d399',
      bg: 'rgba(16,185,129,0.1)',
      border: 'rgba(16,185,129,0.2)',
      icon: '📺',
    },
    {
      label: 'Total Content',
      value: movies.length,
      color: '#d4a853',
      bg: 'rgba(212,168,83,0.1)',
      border: 'rgba(212,168,83,0.2)',
      icon: '📊',
    },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of your content</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="glass-card p-6 transition-all hover:scale-[1.02]"
            style={{ borderColor: stat.border }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <p className="text-3xl font-bold" style={{ color: stat.color }}>
              {loading ? '—' : stat.value}
            </p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Link href="/admin/movies/new" className="gold-button inline-flex items-center gap-2 text-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Movie
        </Link>
        <Link href="/admin/series/new"
          className="inline-flex items-center gap-2 text-sm px-5 py-3 rounded-xl font-semibold border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 transition-all">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Series
        </Link>
      </div>

      {/* Recent Additions */}
      <div className="glass-card overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5">
          <h2 className="text-lg font-semibold text-white">Recent Additions</h2>
        </div>
        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-12 w-full" />
            ))}
          </div>
        ) : recentItems.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No content added yet. Start by adding a movie or series.
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {recentItems.map((item) => (
              <div key={item.id} className="px-6 py-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
                <div className="w-10 h-14 rounded-lg overflow-hidden flex-shrink-0" style={{ background: 'var(--dark-700)' }}>
                  {item.poster_url && (
                    <img src={item.poster_url} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.release_year} • {item.genre?.join(', ') || 'No genre'}</p>
                </div>
                <span className={`badge ${item.type === 'movie' ? 'badge-movie' : 'badge-series'}`}>
                  {item.type}
                </span>
                <Link
                  href={`/admin/${item.type === 'movie' ? 'movies' : 'series'}/${item.id}/edit`}
                  className="text-xs text-gray-500 hover:text-[#d4a853] transition-colors"
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
