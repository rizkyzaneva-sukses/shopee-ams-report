import { db } from '@/lib/db'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function ValidationPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string; status?: string }>
}) {
  const params = await searchParams
  const from = params.from || new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0]
  const to = params.to || new Date().toISOString().split('T')[0]
  const status = params.status || 'all'

  const where: any = { validationTime: { gte: new Date(from), lte: new Date(to) } }
  if (status !== 'all') where.validationStatus = status

  const [records, summary] = await Promise.all([
    db.validationRecord.findMany({ where, orderBy: { validationTime: 'desc' }, take: 200 }),
    db.validationRecord.aggregate({ where, _sum: { originalCommission: true, adjustedCommission: true, commissionDiff: true }, _count: true }),
  ])

  const statusColors: Record<string, string> = {
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    pending: 'bg-yellow-100 text-yellow-700',
  }

  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-blue-600 hover:underline text-sm">← Dashboard</Link>
        <h1 className="text-2xl font-bold">✅ Validation Report</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <p className="text-sm text-gray-500">Komisi Asli Total</p>
          <p className="text-xl font-bold">{formatCurrency(Number(summary._sum.originalCommission || 0))}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <p className="text-sm text-gray-500">Komisi Final Total</p>
          <p className="text-xl font-bold text-green-600">{formatCurrency(Number(summary._sum.adjustedCommission || 0))}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <p className="text-sm text-gray-500">Komisi Hilang (Reject)</p>
          <p className="text-xl font-bold text-red-600">
            {formatCurrency(Number(summary._sum.commissionDiff || 0))}
            <span className="text-sm font-normal text-gray-500 ml-1">({summary._count} order)</span>
          </p>
        </div>
      </div>

      <div className="flex gap-2 text-sm">
        {['all', 'approved', 'rejected', 'pending'].map(s => (
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
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3 text-right">Komisi Asli</th>
              <th className="py-3 px-3 text-right">Komisi Final</th>
              <th className="py-3 px-3 text-right">Selisih</th>
              <th className="py-3 px-3">Alasan</th>
            </tr>
          </thead>
          <tbody>
            {records.map(r => (
              <tr key={r.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="py-2 px-3 font-mono text-xs">{r.orderId}</td>
                <td className="py-2 px-3 max-w-[150px] truncate">{r.productName}</td>
                <td className="py-2 px-3">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[r.validationStatus] || 'bg-gray-100'}`}>
                    {r.validationStatus}
                  </span>
                </td>
                <td className="py-2 px-3 text-right">{formatCurrency(Number(r.originalCommission))}</td>
                <td className="py-2 px-3 text-right">{formatCurrency(Number(r.adjustedCommission))}</td>
                <td className={`py-2 px-3 text-right font-medium ${Number(r.commissionDiff) > 0 ? 'text-red-600' : 'text-gray-500'}`}>
                  {Number(r.commissionDiff) > 0 ? '-' : ''}{formatCurrency(Number(r.commissionDiff))}
                </td>
                <td className="py-2 px-3 text-xs text-gray-500 max-w-[150px] truncate">{r.reason || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
