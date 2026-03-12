import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Movie, SERIES_TELEGRAM_LINK } from '@/lib/types'
import TrailerEmbed from '@/components/TrailerEmbed'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import AnalyticsTracker from '@/components/AnalyticsTracker'
import TelegramButton from '@/components/TelegramButton'
import ShareButtons from '@/components/ShareButtons'
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const supabase = await createServerSupabaseClient()
  const { data: s } = await supabase
    .from('movies')
    .select('*')
    .eq('id', id)
    .single()

  if (!s) return {}

  const fullTitle = `${s.title} (${s.release_year}) - Myanmar Subtitles`
  const description = s.description?.substring(0, 160) || `Watch ${s.title} with Myanmar subtitles on MMSubMovie.`

  return {
    title: s.title,
    description: description,
    openGraph: {
      title: fullTitle,
      description: description,
      images: [s.poster_url],
      type: 'video.tv_show',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: description,
      images: [s.poster_url],
    },
  }
}

export default async function SeriesDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()
  const { data: movie, error } = await supabase
    .from('movies')
    .select('*')
    .eq('id', id)
    .eq('type', 'series')
    .single()

  if (error || !movie) {
    notFound()
  }

  const s = movie as Movie

  // Structured Data (JSON-LD)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TVSeries',
    name: s.title,
    description: s.description,
    image: s.poster_url,
    datePublished: s.release_year.toString(),
    aggregateRating: s.rating > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: s.rating,
      bestRating: '10',
      worstRating: '1',
      ratingCount: '1' // Mock count
    } : undefined
  }

  return (
    <div className="relative min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AnalyticsTracker id={s.id} />
      {/* Cinematic Backdrop */}
      <div className="absolute inset-0 z-0 h-[70vh] w-full overflow-hidden pointer-events-none">
        {s.poster_url && (
          <>
            <img
              src={s.poster_url}
              alt=""
              className="w-full h-full object-cover opacity-20 blur-3xl scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/80 to-transparent" />
          </>
        )}
      </div>

      <div className="relative z-10 pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex mb-8 text-sm font-medium">
          <Link href="/" className="text-zinc-500 hover:text-[#d4a853] transition-colors">Home</Link>
          <span className="mx-2 text-zinc-700">/</span>
          <Link href="/?type=series" className="text-zinc-500 hover:text-[#d4a853] transition-colors">Series</Link>
          <span className="mx-2 text-zinc-700">/</span>
          <span className="text-zinc-300 truncate">{s.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Poster */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="relative aspect-[2/3] rounded-3xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10 group">
              {s.poster_url && (
                <img
                  src={s.poster_url}
                  alt={s.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Right Column: Info */}
          <div className="lg:col-span-8 xl:col-span-9 flex flex-col">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black tracking-widest border border-emerald-500/30">SERIES</span>
              <span className="px-3 py-1 rounded-full bg-white/5 text-zinc-400 text-xs font-black tracking-widest border border-white/10">{s.release_year}</span>
              {s.rating > 0 && (
                <span className="px-3 py-1 rounded-full bg-[#d4a853]/10 text-[#d4a853] text-xs font-black tracking-widest border border-[#d4a853]/20 flex items-center gap-1.5">
                  <span className="text-base leading-none pt-0.5">★</span> {s.rating}
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight tracking-tighter">
              {s.title}
            </h1>

            <div className="flex flex-wrap gap-2 mb-8">
              {s.genre?.map((g) => (
                <span key={g} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-zinc-300 text-sm font-bold hover:bg-white/10 hover:border-[#d4a853]/30 transition-all cursor-default">
                  {g}
                </span>
              ))}
            </div>

            <div className="flex flex-col gap-10 flex-1">
              {/* Action Buttons Hub */}
              <div className="flex flex-wrap items-center gap-6 lg:gap-10">
                {/* Watch Button Container */}
                <TelegramButton href={SERIES_TELEGRAM_LINK} id={s.id} />
                
                {/* Share Buttons */}
                <ShareButtons title={s.title} id={s.id} type="series" />
              </div>

              {/* Description */}
              {s.description && (
                <div className="relative">
                  <div className="glass-card p-8 rounded-3xl bg-white/[0.03] border-white/5 backdrop-blur-3xl shadow-2xl">
                    <p className="text-zinc-300 leading-relaxed lg:text-lg whitespace-pre-line font-medium drop-shadow-sm">
                      {s.description}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Trailer Section */}
              {s.trailer_url && (
                <div className="mt-4">
                  <h2 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                    <span className="w-1.5 h-6 bg-[#d4a853] rounded-full" />
                    Official Trailer
                  </h2>
                  <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black">
                    <TrailerEmbed url={s.trailer_url} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
