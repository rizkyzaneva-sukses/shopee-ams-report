import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '50')

    const where: any = {}
    if (from || to) {
      where.conversionTime = {}
      if (from) where.conversionTime.gte = new Date(from)
      if (to) where.conversionTime.lte = new Date(to)
    }
    if (status && status !== 'all') where.commissionStatus = status

    const [records, total] = await Promise.all([
      db.conversionRecord.findMany({
        where,
        orderBy: { conversionTime: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      db.conversionRecord.count({ where }),
    ])

    return NextResponse.json({
      records: records.map(r => ({
        orderId: r.orderId,
        productId: r.productId,
        productName: r.productName,
        shopId: r.shopId,
        shopName: r.shopName,
        orderAmount: Number(r.orderAmount),
        commission: Number(r.commission),
        commissionRate: Number(r.commissionRate),
        conversionTime: r.conversionTime.toISOString(),
        orderStatus: r.orderStatus,
        commissionStatus: r.commissionStatus,
        campaignId: r.campaignId,
        unitSold: r.unitSold,
      })),
      total,
      page,
      pageSize,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
