'use client'

import { useState, useEffect } from 'react'
import { Facebook, Twitter, Send, Link2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ShareButtonsProps {
  title: string
  id: string
  type: 'movie' | 'series'
}

export default function ShareButtons({ title, id, type }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Update with actual domain if necessary
  const shareUrl = mounted && typeof window !== 'undefined' 
    ? `${window.location.origin}/${type === 'movie' ? 'movies' : 'series'}/${id}`
    : ''
    
  const shareText = `Watch ${title} on MMSubMovie! 🍿`

  const shareLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-[#1877F2] text-white',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-[#1DA1F2] text-white',
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`
    },
    {
      name: 'Telegram',
      icon: Send,
      color: 'bg-[#0088cc] text-white',
      url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`
    }
  ]

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-zinc-400 text-sm font-bold uppercase tracking-wider mr-2">Share With Friends:</span>
      
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-center w-10 h-10 rounded-xl ${link.color} hover:scale-110 active:scale-95 transition-all shadow-lg shadow-black/20`}
          aria-label={`Share on ${link.name}`}
        >
          <link.icon className="w-5 h-5 fill-current" />
        </a>
      ))}
      
      <button
        onClick={copyToClipboard}
        className="flex items-center gap-2 h-10 px-4 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/10 hover:border-[#d4a853]/50 transition-all active:scale-95 shadow-lg shadow-black/20"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-bold">Copied!</span>
          </>
        ) : (
          <>
            <Link2 className="w-4 h-4" />
            <span className="text-sm font-bold">Copy Link</span>
          </>
        )}
      </button>
    </div>
  )
}
