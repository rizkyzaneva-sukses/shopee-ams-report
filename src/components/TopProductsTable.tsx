import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils'

type Product = { productId: number; productName: string; gmv: number; orders: number; commission: number }

export default function TopProductsTable({ products }: { products: Product[] }) {
  if (!products.length) return null

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      <h2 className="text-lg font-semibold mb-4">🏆 Top 10 Produk by GMV</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="py-2 px-3">#</th>
              <th className="py-2 px-3">Produk</th>
              <th className="py-2 px-3 text-right">Order</th>
              <th className="py-2 px-3 text-right">GMV</th>
              <th className="py-2 px-3 text-right">Komisi</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr key={p.productId} className="border-b last:border-0 hover:bg-gray-50">
                <td className="py-2 px-3 text-gray-400">{i + 1}</td>
                <td className="py-2 px-3 max-w-[250px] truncate" title={p.productName}>{p.productName}</td>
                <td className="py-2 px-3 text-right">{formatNumber(p.orders)}</td>
                <td className="py-2 px-3 text-right font-medium">{formatCurrency(p.gmv)}</td>
                <td className="py-2 px-3 text-right text-blue-600">{formatCurrency(p.commission)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
