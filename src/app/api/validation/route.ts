import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const status = searchParams.get('status')

    const where: any = {}
    if (from || to) {
      where.validationTime = {}
      if (from) where.validationTime.gte = new Date(from)
      if (to) where.validationTime.lte = new Date(to)
    }
    if (status && status !== 'all') where.validationStatus = status

    const [records, summary] = await Promise.all([
      db.validationRecord.findMany({
        where,
        orderBy: { validationTime: 'desc' },
        take: 200,
      }),
      db.validationRecord.aggregate({
        where,
        _sum: { originalCommission: true, adjustedCommission: true, commissionDiff: true },
        _count: true,
      }),
    ])

    return NextResponse.json({
      records: records.map(r => ({
        id: r.id,
        orderId: r.orderId,
        productId: r.productId,
        productName: r.productName,
        shopId: r.shopId,
        validationStatus: r.validationStatus,
        originalCommission: Number(r.originalCommission),
        adjustedCommission: Number(r.adjustedCommission),
        commissionDiff: Number(r.commissionDiff),
        reason: r.reason,
        validationTime: r.validationTime.toISOString(),
      })),
      summary: {
        totalOriginal: Number(summary._sum.originalCommission || 0),
        totalAdjusted: Number(summary._sum.adjustedCommission || 0),
        totalDiff: Number(summary._sum.commissionDiff || 0),
        totalCount: summary._count,
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
