'use client'

import { trackClick } from '@/lib/analytics'

interface TelegramButtonProps {
  href: string
  id: string
  label?: string
  compact?: boolean
}

export default function TelegramButton({ href, id, label, compact }: TelegramButtonProps) {
  return (
    <div className={`group/btn relative inline-block transition-all duration-300 ${compact ? 'scale-90' : 'scale-100'}`}>
      <div className="absolute -inset-1 bg-gradient-to-r from-[#0088cc] to-[#00aaff] rounded-2xl blur opacity-30 group-hover/btn:opacity-60 transition duration-500" />
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackClick(id)}
        className={`relative flex items-center gap-2 bg-gradient-to-r from-[#0088cc] to-[#33b5f5] text-white rounded-2xl font-black shadow-xl hover:shadow-[#0088cc]/40 hover:-translate-y-1 transition-all active:scale-95 overflow-hidden
          ${compact ? 'px-4 py-2 text-xs' : 'px-5 py-3 text-sm'}
        `}
      >
        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000 skew-x-[-20deg]" />
        <svg width={compact ? "18" : "24"} height={compact ? "18" : "24"} viewBox="0 0 24 24" fill="currentColor" className="drop-shadow-lg">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
        <span>{label || 'Watch on Telegram'}</span>
      </a>
    </div>
  )
}
