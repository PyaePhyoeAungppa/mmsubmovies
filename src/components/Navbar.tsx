'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (path: string) => pathname === path

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5"
      style={{ background: 'rgba(10, 10, 15, 0.85)', backdropFilter: 'blur(16px)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #d4a853, #b8922e)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0a0a0f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
            <span className="text-lg font-bold gold-text hidden sm:block">MMSubMovie</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive('/') ? 'text-[#d4a853] bg-[#d4a853]/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
              Home
            </Link>
            <Link href="/?type=movie"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all text-gray-400 hover:text-white hover:bg-white/5`}>
              Movies
            </Link>
            <Link href="/?type=series"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all text-gray-400 hover:text-white hover:bg-white/5`}>
              Series
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Link href="/admin"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-[#d4a853] hover:bg-[#d4a853]/5 transition-all border border-transparent hover:border-[#d4a853]/20">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
              Admin
            </Link>

            {/* Mobile menu button */}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/5 py-3 space-y-1">
            <Link href="/" onClick={() => setMobileOpen(false)}
              className="block px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5">
              Home
            </Link>
            <Link href="/?type=movie" onClick={() => setMobileOpen(false)}
              className="block px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5">
              Movies
            </Link>
            <Link href="/?type=series" onClick={() => setMobileOpen(false)}
              className="block px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5">
              Series
            </Link>
            <Link href="/admin" onClick={() => setMobileOpen(false)}
              className="block px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-[#d4a853]">
              Admin Panel
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
