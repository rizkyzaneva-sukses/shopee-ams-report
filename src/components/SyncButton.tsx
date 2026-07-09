'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SyncButton() {
  const [syncing, setSyncing] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const router = useRouter()

  const handleSync = async () => {
    setSyncing(true)
    setResult(null)
    try {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const dateStr = yesterday.toISOString().split('T')[0]

      const res = await fetch('/api/cron/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: dateStr }),
      })
      const data = await res.json()
      if (data.error) {
        setResult(`❌ ${data.error}`)
      } else {
        const ok = data.results?.filter((r: any) => r.status === 'ok').length || 0
        const fail = data.results?.filter((r: any) => r.status === 'error').length || 0
        setResult(`✅ Sync selesai: ${ok} toko OK, ${fail} gagal`)
      }
      router.refresh()
    } catch (err: any) {
      setResult(`❌ ${err.message}`)
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div className="text-right">
      <button
        onClick={handleSync}
        disabled={syncing}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {syncing ? '⏳ Syncing...' : '🔄 Sync Sekarang'}
      </button>
      {result && <p className="text-xs mt-1 text-gray-600">{result}</p>}
    </div>
  )
}
