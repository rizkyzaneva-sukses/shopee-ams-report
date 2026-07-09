import { db } from '@/lib/db'
import { formatCurrency, formatNumber } from '@/lib/utils'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function ConversionPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string; status?: string }>
}) {
  const params = await searchParams
  const from = params.from || new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0]
  const to = params.to || new Date().toISOString().split('T')[0]
  const status = params.status || 'all'

  const where: any = { conversionTime: { gte: new Date(from), lte: new Date(to) } }
  if (status !== 'all') where.commissionStatus = status

  const [records, total] = await Promise.all([
    db.conversionRecord.findMany({ where, orderBy: { conversionTime: 'desc' }, take: 200 }),
    db.conversionRecord.count({ where }),
  ])

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-green-100 text-green-700',
    paid: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-red-100 text-red-700',
  }

  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-blue-600 hover:underline text-sm">← Dashboard</Link>
          <h1 className="text-2xl font-bold">🔄 Conversion Report</h1>
        </div>
        <span className="text-sm text-gray-500">{formatNumber(total)} total order</span>
      </div>

      <div className="flex gap-2 text-sm flex-wrap">
        {['all', 'pending', 'confirmed', 'paid', 'cancelled'].map(s => (
          <Link key={s} href={`?from=${from}&to=${to}&status=${s}`}
            className={`px-3 py-1 rounded-full capitalize ${status === s ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
            {s}
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500 bg-gray-50">
              <th className="py-3 px-3">Order ID</th>
              <th className="py-3 px-3">Produk</th>
              <th className="py-3 px-3">Toko</th>
              <th className="py-3 px-3 text-right">Nilai Order</th>
              <th className="py-3 px-3 text-right">Komisi</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Waktu</th>
            </tr>
          </thead>
          <tbody>
            {records.map(r => (
              <tr key={r.orderId} className="border-b last:border-0 hover:bg-gray-50">
                <td className="py-2 px-3 font-mono text-xs">{r.orderId}</td>
                <td className="py-2 px-3 max-w-[200px] truncate">{r.productName}</td>
                <td className="py-2 px-3">{r.shopName}</td>
                <td className="py-2 px-3 text-right">{formatCurrency(r.orderAmount)}</td>
                <td className="py-2 px-3 text-right text-blue-600">{formatCurrency(r.commission)}</td>
                <td className="py-2 px-3">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[r.commissionStatus] || 'bg-gray-100'}`}>
                    {r.commissionStatus}
                  </span>
                </td>
                <td className="py-2 px-3 text-xs text-gray-500">{new Date(r.conversionTime).toLocaleDateString('id-ID')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
