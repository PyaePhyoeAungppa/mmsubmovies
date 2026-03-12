'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Movie, MovieFormData, GENRES, SERIES_TELEGRAM_LINK } from '@/lib/types'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ImageIcon, Link2, Loader2, PlayCircle, Save } from 'lucide-react'

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
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
      {error && (
        <div className="px-5 py-4 rounded-xl text-sm font-medium text-red-400 bg-red-400/10 border border-red-400/20 shadow-lg">
          {error}
        </div>
      )}

      <Card className="bg-[#12121a] border-white/5 shadow-xl">
        <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Title */}
          <div className="md:col-span-2 space-y-2">
            <Label className="text-zinc-300 font-semibold ml-1">Title <span className="text-red-400">*</span></Label>
            <Input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
              placeholder="e.g. Inception"
              className="bg-[#0a0a0f] border-white/10 text-white h-12 rounded-xl focus-visible:ring-indigo-500/50"
              required
            />
          </div>

          {/* Release Year */}
          <div className="space-y-2">
            <Label className="text-zinc-300 font-semibold ml-1">Release Year</Label>
            <Input
              type="number"
              value={formData.release_year}
              onChange={(e) => setFormData((p) => ({ ...p, release_year: parseInt(e.target.value) || 2024 }))}
              min="1900"
              max="2030"
              className="bg-[#0a0a0f] border-white/10 text-white h-12 rounded-xl focus-visible:ring-indigo-500/50"
            />
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <Label className="text-zinc-300 font-semibold ml-1">Rating (0-10)</Label>
            <Input
              type="number"
              value={formData.rating}
              onChange={(e) => setFormData((p) => ({ ...p, rating: parseFloat(e.target.value) || 0 }))}
              min="0"
              max="10"
              step="0.1"
              className="bg-[#0a0a0f] border-white/10 text-white h-12 rounded-xl focus-visible:ring-indigo-500/50"
            />
          </div>

          {/* Poster Upload */}
          <div className="md:col-span-2 space-y-3">
            <Label className="text-zinc-300 font-semibold ml-1 text-base">Poster Image</Label>
            <div className="flex flex-col sm:flex-row items-start gap-6 bg-[#0a0a0f] p-5 rounded-2xl border border-white/5">
              {/* Preview */}
              <div className="w-32 h-44 rounded-xl overflow-hidden flex-shrink-0 bg-zinc-900 border border-white/10 shadow-lg relative group">
                {formData.poster_url ? (
                  <Image 
                    src={formData.poster_url} 
                    alt="Poster preview" 
                    fill
                    className="object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600 space-y-2">
                    <ImageIcon className="w-8 h-8 opacity-50" />
                    <span className="text-xs font-semibold uppercase tracking-wider">No Image</span>
                  </div>
                )}
              </div>
              
              <div className="flex-1 space-y-5 w-full">
                <div className="space-y-2">
                    <Label className="text-zinc-400 text-xs uppercase tracking-wider font-bold">Upload File</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="bg-[#12121a] border-white/10 text-zinc-300 h-11 pt-2.5 file:mr-4 file:py-1 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#d4a853]/10 file:text-[#d4a853] hover:file:bg-[#d4a853]/20 transition-all cursor-pointer"
                    />
                    {uploading && <p className="text-xs font-medium text-[#d4a853] flex items-center gap-1.5"><Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading image...</p>}
                </div>
                
                <div className="relative">
                   <div className="absolute inset-0 flex items-center">
                     <span className="w-full border-t border-white/5" />
                   </div>
                   <div className="relative flex justify-center text-xs uppercase">
                     <span className="bg-[#0a0a0f] px-2 text-zinc-500 font-bold tracking-widest">Or</span>
                   </div>
                </div>

                <div className="space-y-2 relative">
                  <Label className="text-zinc-400 text-xs uppercase tracking-wider font-bold">Image URL</Label>
                  <div className="relative">
                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <Input
                      type="url"
                      value={formData.poster_url}
                      onChange={(e) => setFormData((p) => ({ ...p, poster_url: e.target.value }))}
                      className="pl-10 bg-[#12121a] border-white/10 text-white h-11 rounded-xl focus-visible:ring-indigo-500/50"
                      placeholder="https://example.com/poster.jpg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* YouTube Trailer URL */}
          <div className="md:col-span-2 space-y-2">
            <Label className="text-zinc-300 font-semibold ml-1">YouTube Trailer URL</Label>
            <div className="relative">
                <PlayCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500/70" />
                <Input
                  type="url"
                  value={formData.trailer_url}
                  onChange={(e) => setFormData((p) => ({ ...p, trailer_url: e.target.value }))}
                  className="pl-10 bg-[#0a0a0f] border-white/10 text-white h-12 rounded-xl focus-visible:ring-indigo-500/50"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
            </div>
          </div>

          {/* Telegram Link */}
          {contentType === 'movie' ? (
            <div className="md:col-span-2 space-y-2">
              <Label className="text-zinc-300 font-semibold ml-1">Telegram Watch Link <span className="text-red-400">*</span></Label>
              <Input
                type="url"
                value={formData.telegram_link}
                onChange={(e) => setFormData((p) => ({ ...p, telegram_link: e.target.value }))}
                className="bg-[#0a0a0f] border-indigo-500/30 text-white h-12 rounded-xl focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500"
                placeholder="https://t.me/..."
                required
              />
            </div>
          ) : (
            <div className="md:col-span-2 space-y-2 p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-xl">
              <Label className="text-indigo-300 font-semibold ml-1">Telegram Watch Link</Label>
              <Input
                disabled
                value={SERIES_TELEGRAM_LINK}
                className="bg-[#0a0a0f]/50 border-white/5 text-zinc-500 h-10 rounded-lg cursor-not-allowed opacity-70"
              />
              <p className="text-zinc-500 text-xs ml-1 font-medium">Series always point to the main Telegram channel.</p>
            </div>
          )}

          {/* Genres */}
          <div className="md:col-span-2 space-y-3">
            <Label className="text-zinc-300 font-semibold ml-1">Genres</Label>
            <div className="flex flex-wrap gap-2.5 p-5 bg-[#0a0a0f] border border-white/5 rounded-2xl">
              {GENRES.map((g) => {
                const isSelected = formData.genre.includes(g)
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => toggleGenre(g)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                      isSelected
                        ? 'bg-[#d4a853] text-[#0a0a0f] shadow-lg shadow-[#d4a853]/20 hover:bg-[#b8922e] hover:shadow-[#b8922e]/30 scale-105'
                        : 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/80 border border-transparent hover:border-white/10'
                    }`}
                  >
                    {g}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Description */}
          <div className="md:col-span-2 space-y-2">
            <Label className="text-zinc-300 font-semibold ml-1">Description</Label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
              className="w-full bg-[#0a0a0f] border border-white/10 text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 p-4 min-h-[160px] resize-y placeholder:text-zinc-600 transition-all"
              placeholder="Write a compelling description..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-2 pb-6">
        <Button
          type="submit"
          disabled={saving}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-12 px-8 rounded-xl shadow-lg shadow-indigo-600/20"
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-5 w-5" />
              {isEdit ? 'Update' : 'Create'} {contentType === 'movie' ? 'Movie' : 'Series'}
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          className="h-12 px-6 rounded-xl font-medium text-zinc-400 hover:text-white hover:bg-white/5"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
