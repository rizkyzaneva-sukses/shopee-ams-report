import { db } from '@/lib/db'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function CampaignPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string; type?: string }>
}) {
  const params = await searchParams
  const from = params.from || new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0]
  const to = params.to || new Date().toISOString().split('T')[0]
  const type = params.type || 'all'

  const where: any = { date: { gte: new Date(from), lte: new Date(to) } }
  if (type !== 'all') where.campaignType = type

  const campaigns = await db.campaignPerformance.groupBy({
    by: ['campaignId', 'campaignName', 'campaignType', 'shopId'],
    where,
    _sum: { gmv: true, orderCount: true, commission: true, clickCount: true },
    _avg: { conversionRate: true },
    orderBy: { _sum: { gmv: 'desc' } },
  })

  const statusColors: Record<string, string> = {
    open: 'bg-green-100 text-green-700',
    targeted: 'bg-purple-100 text-purple-700',
  }

  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-blue-600 hover:underline text-sm">← Dashboard</Link>
        <h1 className="text-2xl font-bold">📣 Campaign Performance</h1>
      </div>

      <div className="flex gap-2 text-sm">
        <Link href={`?from=${from}&to=${to}&type=all`}
          className={`px-3 py-1 rounded-full ${type === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
          Semua
        </Link>
        <Link href={`?from=${from}&to=${to}&type=open`}
          className={`px-3 py-1 rounded-full ${type === 'open' ? 'bg-green-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
          Open Campaign
        </Link>
        <Link href={`?from=${from}&to=${to}&type=targeted`}
          className={`px-3 py-1 rounded-full ${type === 'targeted' ? 'bg-purple-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
          Targeted Campaign
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500 bg-gray-50">
              <th className="py-3 px-3">Campaign</th>
              <th className="py-3 px-3">Tipe</th>
              <th className="py-3 px-3">Shop ID</th>
              <th className="py-3 px-3 text-right">Klik</th>
              <th className="py-3 px-3 text-right">Order</th>
              <th className="py-3 px-3 text-right">GMV</th>
              <th className="py-3 px-3 text-right">Komisi</th>
              <th className="py-3 px-3 text-right">CVR</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map(c => (
              <tr key={c.campaignId} className="border-b last:border-0 hover:bg-gray-50">
                <td className="py-2 px-3 max-w-[200px] truncate" title={c.campaignName}>{c.campaignName || `#${c.campaignId}`}</td>
                <td className="py-2 px-3">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[c.campaignType] || ''}`}>
                    {c.campaignType}
                  </span>
                </td>
                <td className="py-2 px-3">{c.shopId}</td>
                <td className="py-2 px-3 text-right">{formatNumber(c._sum.clickCount)}</td>
                <td className="py-2 px-3 text-right">{formatNumber(c._sum.orderCount)}</td>
                <td className="py-2 px-3 text-right font-medium">{formatCurrency(c._sum.gmv)}</td>
                <td className="py-2 px-3 text-right text-blue-600">{formatCurrency(c._sum.commission)}</td>
                <td className="py-2 px-3 text-right">{formatPercent(c._avg.conversionRate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
