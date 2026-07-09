import { db } from '@/lib/db'
import { formatCurrency } from '@/lib/utils'

export default async function ValidationSummary({ from, to }: { from: string; to: string }) {
  const validations = await db.validationRecord.findMany({
    where: { validationTime: { gte: new Date(from), lte: new Date(to) } },
    orderBy: { validationTime: 'desc' },
    take: 10,
  })

  if (!validations.length) return null

  const statusColors: Record<string, string> = {
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    pending: 'bg-yellow-100 text-yellow-700',
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      <h2 className="text-lg font-semibold mb-4">✅ Validation Terakhir</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="py-2 px-3">Order ID</th>
              <th className="py-2 px-3">Produk</th>
              <th className="py-2 px-3">Status</th>
              <th className="py-2 px-3 text-right">Komisi Asli</th>
              <th className="py-2 px-3 text-right">Komisi Final</th>
              <th className="py-2 px-3 text-right">Selisih</th>
              <th className="py-2 px-3">Alasan</th>
            </tr>
          </thead>
          <tbody>
            {validations.map(v => (
              <tr key={v.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="py-2 px-3 font-mono text-xs">{v.orderId}</td>
                <td className="py-2 px-3 max-w-[150px] truncate">{v.productName}</td>
                <td className="py-2 px-3">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[v.validationStatus] || 'bg-gray-100'}`}>
                    {v.validationStatus}
                  </span>
                </td>
                <td className="py-2 px-3 text-right">{formatCurrency(Number(v.originalCommission))}</td>
                <td className="py-2 px-3 text-right">{formatCurrency(Number(v.adjustedCommission))}</td>
                <td className={`py-2 px-3 text-right font-medium ${Number(v.commissionDiff) > 0 ? 'text-red-600' : 'text-gray-500'}`}>
                  {Number(v.commissionDiff) > 0 ? '-' : ''}{formatCurrency(Number(v.commissionDiff))}
                </td>
                <td className="py-2 px-3 text-xs text-gray-500 max-w-[150px] truncate">{v.reason || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
