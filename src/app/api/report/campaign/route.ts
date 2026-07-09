import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const type = searchParams.get('type') // open, targeted, or all

    const where: any = {}
    if (from || to) {
      where.date = {}
      if (from) where.date.gte = new Date(from)
      if (to) where.date.lte = new Date(to)
    }
    if (type && type !== 'all') where.campaignType = type

    const campaigns = await db.campaignPerformance.groupBy({
      by: ['campaignId', 'campaignName', 'campaignType', 'shopId'],
      where,
      _sum: { gmv: true, orderCount: true, commission: true, clickCount: true },
      _avg: { conversionRate: true },
      orderBy: { _sum: { gmv: 'desc' } },
    })

    return NextResponse.json({
      campaigns: campaigns.map(c => ({
        campaignId: c.campaignId,
        campaignName: c.campaignName,
        campaignType: c.campaignType,
        shopId: c.shopId,
        gmv: Number(c._sum.gmv || 0),
        orders: c._sum.orderCount || 0,
        commission: Number(c._sum.commission || 0),
        clicks: c._sum.clickCount || 0,
        avgCvr: Number(c._avg.conversionRate || 0),
      })),
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
