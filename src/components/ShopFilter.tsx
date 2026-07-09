'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useCallback } from 'react'

function ShopFilterContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const currentShop = searchParams.get('shop') || 'all'

  const handleChange = useCallback((shopId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (shopId === 'all') params.delete('shop')
    else params.set('shop', shopId)
    router.push(`?${params.toString()}`)
  }, [router, searchParams])

  return (
    <select
      value={currentShop}
      onChange={e => handleChange(e.target.value)}
      className="border rounded px-3 py-1.5 text-sm"
    >
      <option value="all">Semua Toko</option>
    </select>
  )
}

export default function ShopFilter() {
  return (
    <Suspense fallback={null}>
      <ShopFilterContent />
    </Suspense>
  )
}
