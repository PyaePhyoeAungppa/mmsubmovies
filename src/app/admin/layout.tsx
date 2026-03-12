'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LayoutDashboard, Film, Tv, LogOut, PlayCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  // Don't show admin layout for login page
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const navItems = [
    {
      href: '/admin',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5 mr-3" />,
      mobileIcon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      href: '/admin/movies',
      label: 'Movies',
      icon: <Film className="w-5 h-5 mr-3" />,
      mobileIcon: <Film className="w-5 h-5" />,
    },
    {
      href: '/admin/series',
      label: 'Series',
      icon: <Tv className="w-5 h-5 mr-3" />,
      mobileIcon: <Tv className="w-5 h-5" />,
    },
  ]

  return (
    <div className="min-h-screen flex bg-[#0a0a0f]">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-shrink-0 flex-col fixed inset-y-0 left-0 z-50 bg-[#12121a] border-r border-white/5">
        
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-white/5 bg-[#12121a]">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#d4a853] to-[#b8922e] flex items-center justify-center text-[#0a0a0f] shadow-lg group-hover:shadow-[#d4a853]/20 transition-all">
              <PlayCircle className="w-5 h-5 fill-current" />
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight text-white group-hover:text-[#d4a853] transition-colors">MMSubMovie</span>
              <span className="block text-[10px] uppercase tracking-widest text-zinc-500 font-medium mt-0.5">Admin Panel</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <Button 
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start h-11 px-4 ${isActive ? 'bg-[#d4a853]/10 text-[#d4a853] hover:bg-[#d4a853]/20' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                >
                  {item.icon}
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 bg-[#12121a]">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start h-11 px-4 text-red-400/80 hover:text-red-400 hover:bg-red-400/10"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-h-screen bg-[#0a0a0f] md:pl-64">
        <main className="p-4 sm:p-6 md:p-8 pb-24 md:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile Tabs */}
      <div className="md:hidden fixed inset-x-0 bottom-0 z-50">
        <div className="border-t border-white/10 bg-[#0f0f16]/95 backdrop-blur-xl">
          <div className="grid grid-cols-4 gap-1 px-2 py-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href} className="min-w-0">
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    className={`w-full h-12 flex flex-col items-center justify-center gap-1 rounded-xl ${
                      isActive
                        ? 'bg-[#d4a853]/10 text-[#d4a853] hover:bg-[#d4a853]/20'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.mobileIcon}
                    <span className="text-[11px] font-semibold leading-none truncate">{item.label}</span>
                  </Button>
                </Link>
              )
            })}

            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full h-12 flex flex-col items-center justify-center gap-1 rounded-xl text-red-400/80 hover:text-red-400 hover:bg-red-400/10"
              aria-label="Logout"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-[11px] font-semibold leading-none">Logout</span>
            </Button>
          </div>
        </div>
        <div className="h-[env(safe-area-inset-bottom)] bg-[#0f0f16]/95" />
      </div>
    </div>
  )
}
