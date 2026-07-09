import { db } from '@/lib/db'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function ShopsPage() {
  const shops = await db.shopCredential.findMany({ orderBy: { shopId: 'asc' } })

  const statusBadge = (status: string) => {
    if (status === 'active') return '🟢 Connected'
    if (status === 'disconnected') return '🔴 Disconnected'
    return '⚪ Unknown'
  }

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-blue-600 hover:underline text-sm">← Dashboard</Link>
        <h1 className="text-2xl font-bold">🏪 Toko Saya</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500 bg-gray-50">
              <th className="py-3 px-3">Shop ID</th>
              <th className="py-3 px-3">Nama Toko</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Token Expiry</th>
              <th className="py-3 px-3">Terakhir Sync</th>
            </tr>
          </thead>
          <tbody>
            {shops.map(shop => (
              <tr key={shop.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="py-3 px-3 font-mono">{shop.shopId}</td>
                <td className="py-3 px-3 font-medium">{shop.shopName}</td>
                <td className="py-3 px-3">{statusBadge(shop.status)}</td>
                <td className="py-3 px-3 text-xs text-gray-500">
                  {new Date(shop.tokenExpiry).toLocaleDateString('id-ID')}
                  {new Date(shop.tokenExpiry).getTime() - Date.now() < 7 * 86400 * 1000 && (
                    <span className="text-yellow-600 ml-1">⚠️ expiring</span>
                  )}
                </td>
                <td className="py-3 px-3 text-xs text-gray-500">
                  {shop.lastSyncAt ? new Date(shop.lastSyncAt).toLocaleString('id-ID') : 'Belum sync'}
                </td>
              </tr>
            ))}
            {!shops.length && (
              <tr><td colSpan={5} className="py-6 text-center text-gray-400">Belum ada toko terdaftar</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm">
        <p className="font-medium text-yellow-800">ℹ️ Setup Toko</p>
        <p className="text-yellow-700 mt-1">
          Untuk menambah toko baru, jalankan script setup atau tambahkan data ke database:
        </p>
        <pre className="bg-white rounded p-2 mt-2 text-xs overflow-x-auto">
{`npx prisma db seed

// Atau tambah manual ke tabel ShopCredential
// dengan access_token, refresh_token, dll`}
        </pre>
      </div>
    </div>
  )
}
