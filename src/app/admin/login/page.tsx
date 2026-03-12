'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, Play } from 'lucide-react'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 hero-gradient relative">
      <div className="absolute inset-0 bg-black/40" />

      <div className="w-full max-w-md animate-fade-in-up relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-gradient-to-br from-[#d4a853] to-[#b8922e] shadow-xl shadow-[#d4a853]/20">
            <Play className="w-8 h-8 text-[#0a0a0f] fill-[#0a0a0f]" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Admin Access</h1>
          <p className="text-zinc-400 mt-2">Sign in to manage the platform</p>
        </div>

        {/* Login Form */}
        <Card className="bg-[#12121a]/95 backdrop-blur-xl border-white/10 shadow-2xl">
          <CardContent className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-zinc-300 font-semibold ml-1">Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#0a0a0f] border-white/10 text-white h-12 rounded-xl focus-visible:ring-indigo-500/50"
                  placeholder="admin@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-zinc-300 font-semibold ml-1">Password</Label>
                </div>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-[#0a0a0f] border-white/10 text-white h-12 rounded-xl focus-visible:ring-indigo-500/50"
                  placeholder="••••••••"
                  required
                />
              </div>

              {error && (
                <div className="px-5 py-4 rounded-xl text-sm font-medium text-red-400 bg-red-400/10 border border-red-400/20 shadow-lg">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 text-base mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-zinc-500 text-sm mt-8 font-medium">
          <Link href="/" className="hover:text-indigo-400 transition-colors flex items-center justify-center gap-2">
            ← Back to website
          </Link>
        </p>
      </div>
    </div>
  )
}
