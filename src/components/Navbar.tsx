'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { Menu, Search, Clapperboard, Tv } from 'lucide-react'
import { useState, useEffect, useId } from 'react'
import SearchBar from '@/components/SearchBar'

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const searchId = useId()
  const menuId = useId()


  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#d4a853] to-[#b8922e] flex items-center justify-center text-[#0a0a0f] font-black shadow-lg shadow-[#d4a853]/20 group-hover:shadow-[#d4a853]/40 transition-all">
                M
              </div>
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-[#d4a853] transition-colors">
                MSub<span className="text-white/70">Movie</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex flex-1 items-center justify-center px-8">
            <div className="flex shadow-sm rounded-full bg-white/5 p-1 border border-white/10 items-center justify-center space-x-1">

              <Link href="/?type=movie">
                <Button variant="ghost" size="sm" className="rounded-full text-zinc-300 hover:text-white hover:bg-white/10">
                  <Clapperboard className="w-4 h-4 mr-2" />
                  Movies
                </Button>
              </Link>
              <Link href="/?type=series">
                <Button variant="ghost" size="sm" className="rounded-full text-zinc-300 hover:text-white hover:bg-white/10">
                  <Tv className="w-4 h-4 mr-2" />
                  Series
                </Button>
              </Link>
            </div>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center gap-4">
            <div className="w-80">
              <SearchBar />
            </div>
          </div>

          {/* Mobile Search & Menu */}
          <div className="flex md:hidden items-center gap-2">
            <Sheet open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <SheetTrigger
                render={
                  <button 
                    id={searchId}
                    type="button"
                    aria-label="Search" 
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-400 hover:text-[#d4a853] hover:bg-[#d4a853]/10 active:scale-95 transition-all outline-none"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                }
              />
              <SheetContent side="top" className="h-fit bg-[#0a0a0f]/95 backdrop-blur-2xl border-white/10 px-0">
                <SheetTitle className="sr-only">Search</SheetTitle>
                <div className="pt-14 pb-6 px-4">
                  <SearchBar onResultClick={() => setIsSearchOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>

            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger
                render={
                  <button 
                    id={menuId}
                    type="button"
                    aria-label="Menu" 
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-300 hover:text-[#d4a853] hover:bg-[#d4a853]/10 active:scale-95 transition-all outline-none"
                  >
                    <Menu className="w-6 h-6" />
                  </button>
                }
              />
              <SheetContent side="right" className="w-[300px] bg-[#0a0a0f]/95 backdrop-blur-2xl border-white/10 flex flex-col px-0">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <div className="flex items-center gap-2 mb-8 mt-6 px-6">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#d4a853] to-[#b8922e] flex items-center justify-center text-[#0a0a0f] font-black shadow-lg shadow-[#d4a853]/20">
                    M
                  </div>
                  <span className="text-2xl font-bold tracking-tight text-white focus:outline-none">MSubMovie</span>
                </div>
                
                <div className="mb-8 px-6">
                  <SearchBar onResultClick={() => setIsMenuOpen(false)} />
                </div>
                
                <div className="flex flex-col gap-2 flex-1 px-4 overflow-y-auto">

                  <Link href="/?type=movie">
                    <Button variant="ghost" className="w-full justify-start text-zinc-300 hover:text-white hover:bg-white/10 text-base h-12">
                      <Clapperboard className="w-5 h-5 mr-3" />
                      Movies
                    </Button>
                  </Link>
                  <Link href="/?type=series">
                    <Button variant="ghost" className="w-full justify-start text-zinc-300 hover:text-white hover:bg-white/10 text-base h-12">
                      <Tv className="w-5 h-5 mr-3" />
                      Series
                    </Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>

        </div>
      </div>
    </nav>
  )
}
