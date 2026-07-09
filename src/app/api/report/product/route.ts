import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const shopId = searchParams.get('shop')
    const sortBy = searchParams.get('sort') || 'gmv'
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '50')

    const where: any = {}
    if (from || to) {
      where.date = {}
      if (from) where.date.gte = new Date(from)
      if (to) where.date.lte = new Date(to)
    }
    if (shopId && shopId !== 'all') where.shopId = parseInt(shopId)

    // Aggregate per product across date range
    const products = await db.productPerformanceSnapshot.groupBy({
      by: ['productId', 'productName', 'shopId'],
      where,
      _sum: { gmv: true, orderCount: true, commission: true, clickCount: true, unitSoldCount: true },
      _avg: { conversionRate: true },
      orderBy: { _sum: { [sortBy]: 'desc' } },
      skip: (page - 1) * pageSize,
      take: pageSize,
    })

    const total = await db.productPerformanceSnapshot.groupBy({
      by: ['productId'],
      where,
      _count: true,
    })

    return NextResponse.json({
      products: products.map(p => ({
        productId: p.productId,
        productName: p.productName,
        shopId: p.shopId,
        gmv: Number(p._sum.gmv || 0),
        orders: p._sum.orderCount || 0,
        commission: Number(p._sum.commission || 0),
        clicks: p._sum.clickCount || 0,
        units: p._sum.unitSoldCount || 0,
        avgCvr: Number(p._avg.conversionRate || 0),
      })),
      total: total.length,
      page,
      pageSize,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
