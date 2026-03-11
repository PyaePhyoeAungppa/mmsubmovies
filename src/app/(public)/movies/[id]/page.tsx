import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Movie, SERIES_TELEGRAM_LINK } from '@/lib/types'
import TrailerEmbed from '@/components/TrailerEmbed'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function MovieDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()
  const { data: movie, error } = await supabase
    .from('movies')
    .select('*')
    .eq('id', id)
    .eq('type', 'movie')
    .single()

  if (error || !movie) {
    notFound()
  }

  const m = movie as Movie

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Back button */}
      <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#d4a853] transition-colors mb-8 text-sm">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
        Back to Home
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up">
        {/* Poster */}
        <div className="lg:col-span-1">
          <div className="glass-card overflow-hidden sticky top-24">
            {m.poster_url ? (
              <img src={m.poster_url} alt={m.title} className="w-full aspect-[2/3] object-cover" />
            ) : (
              <div className="w-full aspect-[2/3] flex items-center justify-center" style={{ background: 'var(--dark-700)' }}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1">
                  <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
                  <line x1="7" y1="2" x2="7" y2="22" />
                  <line x1="17" y1="2" x2="17" y2="22" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="badge badge-movie">Movie</span>
              <span className="text-gray-500 text-sm">{m.release_year}</span>
              {m.rating > 0 && (
                <div className="flex items-center gap-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#d4a853" stroke="none">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  <span className="text-[#d4a853] text-sm font-semibold">{m.rating}/10</span>
                </div>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">{m.title}</h1>
            
            {/* Genres */}
            {m.genre && m.genre.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {m.genre.map((g) => (
                  <span key={g} className="badge badge-genre">{g}</span>
                ))}
              </div>
            )}
          </div>

          {/* Watch Button */}
          {m.telegram_link && (
            <a
              href={m.telegram_link}
              target="_blank"
              rel="noopener noreferrer"
              className="gold-button inline-flex items-center gap-3 text-lg"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              Watch on Telegram
            </a>
          )}

          {/* Description */}
          {m.description && (
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-white mb-3">Description</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">{m.description}</p>
            </div>
          )}

          {/* Trailer */}
          {m.trailer_url && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-3">Trailer</h2>
              <TrailerEmbed url={m.trailer_url} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
