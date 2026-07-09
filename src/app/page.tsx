import { db } from '@/lib/db'
import { getDateRange, formatCurrency, formatNumber, formatPercent } from '@/lib/utils'
import SyncButton from '@/components/SyncButton'
import DashboardCharts from '@/components/DashboardCharts'
import TopProductsTable from '@/components/TopProductsTable'
import CampaignBreakdown from '@/components/CampaignBreakdown'
import ValidationSummary from '@/components/ValidationSummary'

export const dynamic = 'force-dynamic'

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>
}) {
  const params = await searchParams
  const defaultRange = getDateRange(30)
  const from = params.from || defaultRange.from
  const to = params.to || defaultRange.to

  const [shopSummary, topProducts, campaignBreakdown, validationSummary, latestSync] =
    await Promise.all([
      db.shopPerformanceSnapshot.aggregate({
        where: { date: { gte: new Date(from), lte: new Date(to) } },
        _sum: { gmv: true, orderCount: true, commission: true, clickCount: true, unitSoldCount: true },
        _count: true,
      }),
      db.productPerformanceSnapshot.groupBy({
        by: ['productId', 'productName'],
        where: { date: { gte: new Date(from), lte: new Date(to) } },
        _sum: { gmv: true, orderCount: true, commission: true },
        orderBy: { _sum: { gmv: 'desc' } },
        take: 10,
      }),
      db.campaignPerformance.groupBy({
        by: ['campaignId', 'campaignName', 'campaignType'],
        where: { date: { gte: new Date(from), lte: new Date(to) } },
        _sum: { gmv: true, orderCount: true, commission: true },
        orderBy: { _sum: { gmv: 'desc' } },
      }),
      db.validationRecord.aggregate({
        where: { validationTime: { gte: new Date(from), lte: new Date(to) }, validationStatus: 'rejected' },
        _sum: { commissionDiff: true },
        _count: true,
      }),
      db.shopCredential.findFirst({ orderBy: { lastSyncAt: 'desc' }, select: { lastSyncAt: true } }),
    ])

  // Daily chart data
  const dailyData = await db.shopPerformanceSnapshot.groupBy({
    by: ['date'],
    where: { date: { gte: new Date(from), lte: new Date(to) } },
    _sum: { gmv: true, orderCount: true, commission: true },
    orderBy: { date: 'asc' },
  })

  const chartData = dailyData.map(d => ({
    date: d.date.toISOString().split('T')[0],
    gmv: Number(d._sum.gmv || 0),
    orders: d._sum.orderCount || 0,
    commission: Number(d._sum.commission || 0),
  }))

  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">📊 Shopee AMS Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Data: {from} s/d {to}
            {latestSync?.lastSyncAt && (
              <span className="ml-2">• Sync terakhir: {new Date(latestSync.lastSyncAt).toLocaleString('id-ID')}</span>
            )}
          </p>
        </div>
        <SyncButton />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <p className="text-sm text-gray-500">Total GMV</p>
          <p className="text-2xl font-bold text-emerald-600">{formatCurrency(shopSummary._sum.gmv)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <p className="text-sm text-gray-500">Total Order</p>
          <p className="text-2xl font-bold">{formatNumber(shopSummary._sum.orderCount)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <p className="text-sm text-gray-500">Total Komisi</p>
          <p className="text-2xl font-bold text-blue-600">{formatCurrency(shopSummary._sum.commission)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <p className="text-sm text-gray-500">Komisi Di-reject</p>
          <p className="text-2xl font-bold text-red-600">
            {formatCurrency(validationSummary._sum.commissionDiff)}
            <span className="text-sm font-normal text-gray-500 ml-1">({validationSummary._count} order)</span>
          </p>
        </div>
      </div>

      {/* Charts */}
      <DashboardCharts data={chartData} />

      {/* Top Products */}
      <TopProductsTable products={topProducts.map(p => ({
        productId: p.productId,
        productName: p.productName,
        gmv: Number(p._sum.gmv || 0),
        orders: p._sum.orderCount || 0,
        commission: Number(p._sum.commission || 0),
      }))} />

      {/* Campaign Breakdown */}
      <CampaignBreakdown campaigns={campaignBreakdown.map(c => ({
        campaignId: c.campaignId,
        campaignName: c.campaignName,
        campaignType: c.campaignType,
        gmv: Number(c._sum.gmv || 0),
        orders: c._sum.orderCount || 0,
        commission: Number(c._sum.commission || 0),
      }))} />

      {/* Validation */}
      <ValidationSummary from={from} to={to} />
    </div>
  )
}
