import { db } from '@/lib/db'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function ProductPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string; sort?: string }>
}) {
  const params = await searchParams
  const from = params.from || new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0]
  const to = params.to || new Date().toISOString().split('T')[0]
  const sortBy = params.sort || 'gmv'

  const products = await db.productPerformanceSnapshot.groupBy({
    by: ['productId', 'productName', 'shopId'],
    where: { date: { gte: new Date(from), lte: new Date(to) } },
    _sum: { gmv: true, orderCount: true, commission: true, clickCount: true },
    _avg: { conversionRate: true },
    orderBy: { _sum: { [sortBy]: 'desc' } },
    take: 100,
  })

  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-blue-600 hover:underline text-sm">← Dashboard</Link>
        <h1 className="text-2xl font-bold">📦 Product Performance</h1>
      </div>

      <div className="flex gap-2 text-sm">
        <span className="text-gray-500">Urutkan:</span>
        {['gmv', 'orderCount', 'commission', 'clickCount'].map(s => (
          <Link key={s} href={`?from=${from}&to=${to}&sort=${s}`}
            className={`px-3 py-1 rounded-full ${sortBy === s ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
            {s === 'gmv' ? 'GMV' : s === 'orderCount' ? 'Order' : s === 'commission' ? 'Komisi' : 'Klik'}
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500 bg-gray-50">
              <th className="py-3 px-3">#</th>
              <th className="py-3 px-3">Produk</th>
              <th className="py-3 px-3">Shop ID</th>
              <th className="py-3 px-3 text-right">Klik</th>
              <th className="py-3 px-3 text-right">Order</th>
              <th className="py-3 px-3 text-right">GMV</th>
              <th className="py-3 px-3 text-right">Komisi</th>
              <th className="py-3 px-3 text-right">CVR</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr key={p.productId} className="border-b last:border-0 hover:bg-gray-50">
                <td className="py-2 px-3 text-gray-400">{i + 1}</td>
                <td className="py-2 px-3 max-w-[250px] truncate" title={p.productName}>{p.productName}</td>
                <td className="py-2 px-3">{p.shopId}</td>
                <td className="py-2 px-3 text-right">{formatNumber(Number(p._sum.clickCount))}</td>
                <td className="py-2 px-3 text-right">{formatNumber(Number(p._sum.orderCount))}</td>
                <td className="py-2 px-3 text-right font-medium">{formatCurrency(p._sum.gmv)}</td>
                <td className="py-2 px-3 text-right text-blue-600">{formatCurrency(p._sum.commission)}</td>
                <td className="py-2 px-3 text-right">{formatPercent(p._avg.conversionRate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
