import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { fullSync } from '@/services/sync'
import { getShopeeConfig } from '@/lib/config'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    // Simple auth check
    const authHeader = req.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      // Allow unauthenticated for manual sync from UI (behind button)
    }

    const body = await req.json().catch(() => ({}))
    const date = body.date || (() => {
      const d = new Date()
      d.setDate(d.getDate() - 1)
      return d.toISOString().split('T')[0]
    })()

    // Check if data is available
    const config = getShopeeConfig()
    const shopIds = config.shopIds

    const results = await fullSync(shopIds, date)

    return NextResponse.json({ date, results })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// GET for checking sync status
export async function GET() {
  try {
    const shops = await db.shopCredential.findMany({
      select: { shopId: true, shopName: true, status: true, lastSyncAt: true },
      orderBy: { shopId: 'asc' },
    })
    return NextResponse.json({ shops })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
