import Link from 'next/link'
import { Movie } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, Play } from 'lucide-react'

interface MovieCardProps {
  movie: Movie
}

export default function MovieCard({ movie }: MovieCardProps) {
  const href = movie.type === 'movie' ? `/movies/${movie.id}` : `/series/${movie.id}`

  return (
    <Link href={href} className="group block h-full w-full">
      <Card className="relative overflow-hidden aspect-[2/3] w-full bg-[#12121a] border border-white/10 hover:border-[#d4a853]/50 transition-all duration-500 hover:shadow-[0_8px_30px_rgb(212,168,83,0.25)] hover:-translate-y-1.5 rounded-2xl">
        
        {/* Full Image Background */}
        {movie.poster_url ? (
          <img
            src={movie.poster_url}
            alt={movie.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-zinc-700 bg-zinc-900">
             <Play className="w-12 h-12 mb-2 opacity-50" />
            <span className="text-xs uppercase tracking-widest font-bold opacity-50">No Poster</span>
          </div>
        )}
        
        {/* Persistent Bottom Gradient for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/50 to-transparent opacity-90 pointer-events-none" />

        {/* Hover Gradient Overlay with Play Button */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-center items-center pointer-events-none z-10 p-4">
           <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
             <span className="inline-flex items-center gap-2 text-sm font-bold text-[#0a0a0f] bg-[#d4a853] hover:bg-[#b8922e] transition-colors px-6 py-2.5 rounded-full justify-center shadow-[0_0_20px_rgba(212,168,83,0.4)]">
               <Play className="w-5 h-5 fill-current" /> Watch Now
             </span>
           </div>
        </div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 pointer-events-none z-20">
          <Badge variant="secondary" className={`shadow-lg backdrop-blur-md font-bold px-2.5 py-0.5 rounded-md ${movie.type === 'movie' ? 'bg-indigo-500/90 text-white' : 'bg-emerald-500/90 text-white'}`}>
            {movie.type.toUpperCase()}
          </Badge>
        </div>
        
        {/* Top Right Rating */}
        {movie.rating > 0 && (
          <div className="absolute top-3 right-3 pointer-events-none z-20">
             <Badge variant="outline" className="bg-[#0a0a0f]/80 backdrop-blur-md border-[#d4a853]/30 text-[#d4a853] font-bold shadow-lg gap-1.5 px-2 py-0.5 rounded-md">
               <Star className="w-3.5 h-3.5 fill-[#d4a853]" /> {movie.rating}
             </Badge>
          </div>
        )}

        {/* Floating Content at Bottom */}
        <CardContent className="absolute bottom-0 left-0 right-0 p-4 z-20 border-none bg-transparent">
          <h3 className="font-bold text-white text-base md:text-lg leading-tight line-clamp-2 group-hover:text-[#d4a853] transition-colors duration-300 drop-shadow-md">
            {movie.title}
          </h3>
          <div className="flex flex-wrap items-center gap-2 mt-2.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-white/20 text-white shadow-sm border border-white/10 backdrop-blur-sm">
              {movie.release_year}
            </span>
            {movie.genre && movie.genre.length > 0 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-[#d4a853] text-[#0a0a0f] shadow-sm truncate">
                {movie.genre[0]}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
