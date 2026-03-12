'use client'

import { useEffect } from 'react'
import { trackView } from '@/lib/analytics'

export default function AnalyticsTracker({ id }: { id: string }) {
  useEffect(() => {
    trackView(id)
  }, [id])

  return null
}
