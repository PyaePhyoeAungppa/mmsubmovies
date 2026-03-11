'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Movie, MovieFormData, GENRES, SERIES_TELEGRAM_LINK } from '@/lib/types'

interface MovieFormProps {
  initialData?: Movie
  contentType: 'movie' | 'series'
}

export default function MovieForm({ initialData, contentType }: MovieFormProps) {
  const router = useRouter()
  const isEdit = !!initialData

  const [formData, setFormData] = useState<MovieFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    poster_url: initialData?.poster_url || '',
    trailer_url: initialData?.trailer_url || '',
    telegram_link: contentType === 'series'
      ? SERIES_TELEGRAM_LINK
      : (initialData?.telegram_link || ''),
    genre: initialData?.genre || [],
    release_year: initialData?.release_year || new Date().getFullYear(),
    rating: initialData?.rating || 0,
    type: contentType,
  })

  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const form = new FormData()
    form.append('file', file)

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: form })
      const data = await res.json()
      if (data.url) {
        setFormData((prev) => ({ ...prev, poster_url: data.url }))
      } else {
        setError(data.error || 'Upload failed')
      }
    } catch {
      setError('Upload failed')
    }
    setUploading(false)
  }

  const toggleGenre = (g: string) => {
    setFormData((prev) => ({
      ...prev,
      genre: prev.genre.includes(g)
        ? prev.genre.filter((x) => x !== g)
        : [...prev.genre, g],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const url = isEdit ? `/api/movies/${initialData.id}` : '/api/movies'
      const method = isEdit ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to save')
        setSaving(false)
        return
      }

      router.push(`/admin/${contentType === 'movie' ? 'movies' : 'series'}`)
      router.refresh()
    } catch {
      setError('Failed to save')
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {error && (
        <div className="px-4 py-3 rounded-lg text-sm text-red-400 bg-red-500/10 border border-red-500/20">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="md:col-span-2">
          <label className="form-label">Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
            className="form-input"
            placeholder="Enter movie title"
            required
          />
        </div>

        {/* Release Year */}
        <div>
          <label className="form-label">Release Year</label>
          <input
            type="number"
            value={formData.release_year}
            onChange={(e) => setFormData((p) => ({ ...p, release_year: parseInt(e.target.value) || 2024 }))}
            className="form-input"
            min="1900"
            max="2030"
          />
        </div>

        {/* Rating */}
        <div>
          <label className="form-label">Rating (0-10)</label>
          <input
            type="number"
            value={formData.rating}
            onChange={(e) => setFormData((p) => ({ ...p, rating: parseFloat(e.target.value) || 0 }))}
            className="form-input"
            min="0"
            max="10"
            step="0.1"
          />
        </div>

        {/* Poster Upload */}
        <div className="md:col-span-2">
          <label className="form-label">Poster Image</label>
          <div className="flex items-start gap-4">
            {/* Preview */}
            <div className="w-24 h-36 rounded-lg overflow-hidden flex-shrink-0 border border-white/10"
              style={{ background: 'var(--dark-700)' }}>
              {formData.poster_url ? (
                <img src={formData.poster_url} alt="Poster" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">
                  No image
                </div>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="form-input text-sm file:mr-4 file:py-1 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#d4a853]/10 file:text-[#d4a853]"
              />
              {uploading && <p className="text-xs text-[#d4a853]">Uploading...</p>}
              <p className="text-xs text-gray-600">Or paste a URL:</p>
              <input
                type="url"
                value={formData.poster_url}
                onChange={(e) => setFormData((p) => ({ ...p, poster_url: e.target.value }))}
                className="form-input text-sm"
                placeholder="https://example.com/poster.jpg"
              />
            </div>
          </div>
        </div>

        {/* YouTube Trailer URL */}
        <div className="md:col-span-2">
          <label className="form-label">YouTube Trailer URL</label>
          <input
            type="url"
            value={formData.trailer_url}
            onChange={(e) => setFormData((p) => ({ ...p, trailer_url: e.target.value }))}
            className="form-input"
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>

        {/* Telegram Link (only for movies) */}
        {contentType === 'movie' && (
          <div className="md:col-span-2">
            <label className="form-label">Telegram Watch Link *</label>
            <input
              type="url"
              value={formData.telegram_link}
              onChange={(e) => setFormData((p) => ({ ...p, telegram_link: e.target.value }))}
              className="form-input"
              placeholder="https://t.me/..."
              required
            />
          </div>
        )}

        {contentType === 'series' && (
          <div className="md:col-span-2">
            <label className="form-label">Telegram Watch Link</label>
            <div className="form-input bg-opacity-50 text-gray-500 cursor-not-allowed">
              {SERIES_TELEGRAM_LINK}
            </div>
            <p className="text-xs text-gray-600 mt-1">Series always link to the Telegram channel.</p>
          </div>
        )}

        {/* Genres */}
        <div className="md:col-span-2">
          <label className="form-label">Genres</label>
          <div className="flex flex-wrap gap-2">
            {GENRES.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => toggleGenre(g)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                  formData.genre.includes(g)
                    ? 'bg-[#d4a853]/20 text-[#d4a853] border-[#d4a853]/30'
                    : 'bg-white/5 text-gray-500 border-transparent hover:bg-white/10'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="form-label">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
            className="form-input min-h-[150px] resize-y"
            placeholder="Write a description..."
            rows={6}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-white/5">
        <button
          type="submit"
          disabled={saving}
          className="gold-button inline-flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" className="opacity-75" />
              </svg>
              Saving...
            </>
          ) : (
            <>{isEdit ? 'Update' : 'Create'} {contentType === 'movie' ? 'Movie' : 'Series'}</>
          )}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
