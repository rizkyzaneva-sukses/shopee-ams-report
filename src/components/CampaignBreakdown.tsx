import { formatCurrency, formatNumber } from '@/lib/utils'

type Campaign = { campaignId: number; campaignName: string; campaignType: string; gmv: number; orders: number; commission: number }

export default function CampaignBreakdown({ campaigns }: { campaigns: Campaign[] }) {
  if (!campaigns.length) return null

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      <h2 className="text-lg font-semibold mb-4">📣 Campaign Breakdown</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="py-2 px-3">Campaign</th>
              <th className="py-2 px-3">Tipe</th>
              <th className="py-2 px-3 text-right">Order</th>
              <th className="py-2 px-3 text-right">GMV</th>
              <th className="py-2 px-3 text-right">Komisi</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map(c => (
              <tr key={c.campaignId} className="border-b last:border-0 hover:bg-gray-50">
                <td className="py-2 px-3 max-w-[200px] truncate" title={c.campaignName}>{c.campaignName || `#${c.campaignId}`}</td>
                <td className="py-2 px-3">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                    c.campaignType === 'open' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {c.campaignType === 'open' ? 'Open' : 'Targeted'}
                  </span>
                </td>
                <td className="py-2 px-3 text-right">{formatNumber(c.orders)}</td>
                <td className="py-2 px-3 text-right font-medium">{formatCurrency(c.gmv)}</td>
                <td className="py-2 px-3 text-right text-blue-600">{formatCurrency(c.commission)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
