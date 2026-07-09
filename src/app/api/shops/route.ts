import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const shops = await db.shopCredential.findMany({
      orderBy: { shopId: 'asc' },
      select: {
        id: true,
        shopId: true,
        shopName: true,
        status: true,
        lastSyncAt: true,
        tokenExpiry: true,
      },
    })
    return NextResponse.json({ shops })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
