'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Movie } from '@/lib/types'

export default function AdminSeriesPage() {
  const [series, setSeries] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchSeries()
  }, [])

  async function fetchSeries() {
    const supabase = createClient()
    const { data } = await supabase
      .from('movies')
      .select('*')
      .eq('type', 'series')
      .order('created_at', { ascending: false })
    if (data) setSeries(data as Movie[])
    setLoading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this series?')) return
    setDeleting(id)

    const res = await fetch(`/api/movies/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setSeries((prev) => prev.filter((m) => m.id !== id))
    }
    setDeleting(null)
  }

  const filtered = series.filter((m) =>
    m.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Series</h1>
          <p className="text-gray-500 text-sm mt-1">{series.length} total series</p>
        </div>
        <Link href="/admin/series/new"
          className="inline-flex items-center gap-2 text-sm px-5 py-3 rounded-xl font-semibold border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 transition-all">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Series
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search series..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-input max-w-sm"
        />
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="skeleton h-16 w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            {searchQuery ? 'No series match your search.' : 'No series yet. Add your first!'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Series</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Year</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Genre</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-12 rounded overflow-hidden flex-shrink-0" style={{ background: 'var(--dark-700)' }}>
                          {s.poster_url && (
                            <img src={s.poster_url} alt="" className="w-full h-full object-cover" />
                          )}
                        </div>
                        <span className="text-sm font-medium text-white truncate max-w-[200px]">{s.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">{s.release_year}</td>
                    <td className="px-6 py-4">
                      {s.rating > 0 && (
                        <span className="text-sm text-[#d4a853] font-medium">⭐ {s.rating}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {s.genre?.slice(0, 2).map((g) => (
                          <span key={g} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-500">{g}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/series/${s.id}/edit`}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#d4a853] bg-[#d4a853]/10 hover:bg-[#d4a853]/20 transition-all"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(s.id)}
                          disabled={deleting === s.id}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-all disabled:opacity-50"
                        >
                          {deleting === s.id ? '...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
