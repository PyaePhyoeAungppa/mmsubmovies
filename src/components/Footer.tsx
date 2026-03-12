import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-20" style={{ background: 'var(--dark-800)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #d4a853, #b8922e)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0a0a0f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
              <span className="text-lg font-bold gold-text">MMSubMovie</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Watch the latest movies and series with Myanmar subtitles. Your favorite entertainment, one click away.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Link href="/" className="block text-sm text-gray-500 hover:text-[#d4a853] transition-colors">Home</Link>
              <Link href="/?type=movie" className="block text-sm text-gray-500 hover:text-[#d4a853] transition-colors">Movies</Link>
              <Link href="/?type=series" className="block text-sm text-gray-500 hover:text-[#d4a853] transition-colors">Series</Link>
              <Link href="/admin/login" className="block text-sm text-gray-500 hover:text-[#d4a853] transition-colors mt-4 pt-4 border-t border-white/5 w-max">Admin Login</Link>
            </div>
          </div>

          {/* Telegram */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Join Us</h4>
            <a href="https://t.me/mmsubmoviesvip/3" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[#2AABEE]/10 text-[#2AABEE] border border-[#2AABEE]/20 hover:bg-[#2AABEE]/20 transition-all">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              Telegram Channel
            </a>
          </div>
        </div>

        <div className="border-t border-white/5 mt-8 pt-8 text-center">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} MMSubMovie. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
