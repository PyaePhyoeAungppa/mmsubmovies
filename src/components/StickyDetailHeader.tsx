'use client'

import { useState, useEffect } from 'react'
import { Movie } from '@/lib/types'
import TelegramButton from '@/components/TelegramButton'
import ShareButtons from '@/components/ShareButtons'
import { Star } from 'lucide-react'

interface StickyDetailHeaderProps {
  item: Movie
  type: 'movie' | 'series'
}

export default function StickyDetailHeader({ item, type }: StickyDetailHeaderProps) {
  const [scrollY, setScrollY] = useState(0)
  const [isCompact, setIsCompact] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrollY(currentScrollY)
      // Transition point: 200px down
      setIsCompact(currentScrollY > 150)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Calculate scaling and opacity based on scroll
  // Progress goes from 0 to 1 between 0px and 200px scroll
  const progress = Math.min(Math.max(scrollY / 200, 0), 1)
  
  // Dynamic styles
  const headerPadding = isCompact ? 'py-3' : 'py-8'
  const titleSize = isCompact 
    ? 'text-xl md:text-2xl' 
    : 'text-4xl md:text-5xl lg:text-6xl'
  
  return (
    <div 
      className={`lg:sticky lg:top-16 z-30 transition-all duration-500 ease-in-out
        ${isCompact 
          ? 'bg-[#0a0a0f]/90 backdrop-blur-2xl border-b border-white/10 shadow-2xl -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8' 
          : 'bg-transparent border-b border-transparent -mx-0 px-0'
        }
      `}
    >
      <div className={`flex flex-col transition-all duration-500 ${headerPadding}`}>
        
        {/* Metadata Row - Fades out on scroll */}
        <div 
          className="flex flex-wrap items-center gap-3 transition-all duration-500 origin-left"
          style={{ 
            opacity: 1 - progress * 1.5,
            transform: `translateY(${-progress * 20}px) scale(${1 - progress * 0.2})`,
            height: isCompact ? '0' : 'auto',
            marginBottom: isCompact ? '0' : '1rem',
            overflow: 'hidden'
          }}
        >
          <span className={`px-3 py-1 rounded-full text-xs font-black tracking-widest border transition-all
            ${type === 'movie' 
              ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' 
              : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
            }
          `}>
            {type.toUpperCase()}
          </span>
          <span className="px-3 py-1 rounded-full bg-white/5 text-zinc-400 text-xs font-black tracking-widest border border-white/10">
            {item.release_year}
          </span>
          {item.rating > 0 && (
            <span className="px-3 py-1 rounded-full bg-[#d4a853]/10 text-[#d4a853] text-xs font-black tracking-widest border border-[#d4a853]/20 flex items-center gap-1.5">
              <Star className="w-3 h-3 fill-current" /> {item.rating}
            </span>
          )}
        </div>

        {/* Main Header Content */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className={`${titleSize} font-black text-white leading-tight tracking-tighter truncate transition-all duration-500 ease-in-out`}>
              {item.title}
              {isCompact && item.rating > 0 && (
                <span className="ml-3 inline-flex items-center gap-1 text-sm font-bold text-[#d4a853] bg-[#d4a853]/10 px-2 py-0.5 rounded-lg border border-[#d4a853]/20">
                  <Star className="w-3 h-3 fill-current" /> {item.rating}
                </span>
              )}
            </h1>
            
            {/* Genres - Fades out on scroll */}
            {!isCompact && (
              <div 
                className="flex flex-wrap gap-2 mt-4 transition-all duration-500 origin-left"
                style={{ 
                  opacity: 1 - progress * 2,
                  transform: `translateY(${progress * 10}px)`
                }}
              >
                {item.genre?.map((g) => (
                  <span key={g} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-zinc-300 text-sm font-bold hover:bg-white/10 hover:border-[#d4a853]/30 transition-all cursor-default">
                    {g}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action Area */}
          <div className="flex flex-wrap items-center gap-3 lg:gap-6 scale-90 lg:scale-100 origin-right transition-transform duration-500">
            <TelegramButton 
              href={item.telegram_link} 
              id={item.id} 
              label={isCompact ? "Open in Telegram" : "Watch on Telegram"}
              compact={isCompact}
            />
            <div 
              className="transition-all duration-500"
              style={{ 
                opacity: 1 - progress * 2,
                transform: `scale(${1 - progress * 0.5})`,
                width: isCompact ? '0' : 'auto',
                pointerEvents: isCompact ? 'none' : 'auto',
                overflow: 'hidden'
              }}
            >
              <ShareButtons title={item.title} id={item.id} type={type} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
