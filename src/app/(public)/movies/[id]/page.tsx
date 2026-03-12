import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Movie } from '@/lib/types'
import TrailerEmbed from '@/components/TrailerEmbed'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import AnalyticsTracker from '@/components/AnalyticsTracker'
import TelegramButton from '@/components/TelegramButton'
import ShareButtons from '@/components/ShareButtons'
import StickyDetailHeader from '@/components/StickyDetailHeader'
import { Metadata } from 'next'
import Image from 'next/image'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const supabase = await createServerSupabaseClient()
  const { data: m } = await supabase
    .from('movies')
    .select('*')
    .eq('id', id)
    .single()

  if (!m) return {}

  const fullTitle = `${m.title} (${m.release_year}) - Myanmar Subtitles`
  const description = m.description?.substring(0, 160) || `Watch ${m.title} with Myanmar subtitles on MMSubMovie.`

  return {
    title: m.title,
    description: description,
    openGraph: {
      title: fullTitle,
      description: description,
      images: [m.poster_url],
      type: 'video.movie',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: description,
      images: [m.poster_url],
    },
  }
}

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

  // Structured Data (JSON-LD)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: m.title,
    description: m.description,
    image: m.poster_url,
    datePublished: m.release_year.toString(),
    aggregateRating: m.rating > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: m.rating,
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
      <AnalyticsTracker id={m.id} />
      <div className="absolute inset-0 z-0 h-[70vh] w-full overflow-hidden pointer-events-none">
        {m.poster_url && (
          <>
            <Image
              src={m.poster_url}
              alt=""
              fill
              className="object-cover opacity-20 blur-3xl scale-110"
              priority
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
          <Link href="/?type=movie" className="text-zinc-500 hover:text-[#d4a853] transition-colors">Movies</Link>
          <span className="mx-2 text-zinc-700">/</span>
          <span className="text-zinc-300 truncate">{m.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Poster - Sticky on Desktop */}
          <div className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-24 self-start">
            <div className="relative aspect-[2/3] rounded-3xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10 group">
              {m.poster_url && (
                <Image
                  src={m.poster_url}
                  alt={m.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Right Column: Info */}
          <div className="lg:col-span-8 xl:col-span-9 flex flex-col">
            <StickyDetailHeader item={m} type="movie" />

            <div className="flex flex-col gap-10 flex-1">
              {/* Description */}
              {m.description && (
                <div className="relative">
                  <div className="glass-card p-8 rounded-3xl bg-white/[0.03] border-white/5 backdrop-blur-3xl shadow-2xl">
                    <p className="text-zinc-300 leading-relaxed lg:text-lg whitespace-pre-line font-medium drop-shadow-sm">
                      {m.description}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Trailer Section */}
              {m.trailer_url && (
                <div className="mt-4">
                  <h2 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                    <span className="w-1.5 h-6 bg-[#d4a853] rounded-full" />
                    Official Trailer
                  </h2>
                  <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black">
                    <TrailerEmbed url={m.trailer_url} />
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
