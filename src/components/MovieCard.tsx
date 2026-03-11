import Link from 'next/link'
import { Movie } from '@/lib/types'

interface MovieCardProps {
  movie: Movie
}

export default function MovieCard({ movie }: MovieCardProps) {
  const href = movie.type === 'movie' ? `/movies/${movie.id}` : `/series/${movie.id}`

  return (
    <Link href={href} className="group block">
      <div className="glass-card glass-card-hover overflow-hidden transition-all duration-300">
        {/* Poster */}
        <div className="relative aspect-[2/3] overflow-hidden">
          {movie.poster_url ? (
            <img
              src={movie.poster_url}
              alt={movie.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--dark-700)' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.5">
                <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
                <line x1="7" y1="2" x2="7" y2="22" />
                <line x1="17" y1="2" x2="17" y2="22" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <line x1="2" y1="7" x2="7" y2="7" />
                <line x1="2" y1="17" x2="7" y2="17" />
                <line x1="17" y1="7" x2="22" y2="7" />
                <line x1="17" y1="17" x2="22" y2="17" />
              </svg>
            </div>
          )}
          
          {/* Gradient overlay */}
          <div className="poster-overlay flex flex-col justify-end p-4">
            <p className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              View Details →
            </p>
          </div>

          {/* Type badge */}
          <div className="absolute top-3 left-3">
            <span className={`badge ${movie.type === 'movie' ? 'badge-movie' : 'badge-series'}`}>
              {movie.type}
            </span>
          </div>

          {/* Rating */}
          {movie.rating > 0 && (
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold"
              style={{ background: 'rgba(10,10,15,0.8)', backdropFilter: 'blur(4px)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#d4a853" stroke="none">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span className="text-[#d4a853]">{movie.rating}</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-semibold text-white text-sm leading-tight line-clamp-2 group-hover:text-[#d4a853] transition-colors">
            {movie.title}
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-gray-500">{movie.release_year}</span>
            {movie.genre && movie.genre.length > 0 && (
              <>
                <span className="text-gray-700">•</span>
                <span className="text-xs text-gray-500 truncate">{movie.genre[0]}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
