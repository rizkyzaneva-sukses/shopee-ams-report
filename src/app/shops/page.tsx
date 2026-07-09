import { db } from '@/lib/db'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function ShopsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string; shop_id?: string }>
}) {
  const params = await searchParams
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

      {/* Success/Error Messages */}
      {params.success === 'shop_connected' && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm">
          <p className="font-medium text-green-800">✅ Toko berhasil dihubungkan!</p>
          <p className="text-green-700 mt-1">
            Shop ID: {params.shop_id} sudah terdaftar dan siap digunakan.
          </p>
        </div>
      )}
      {params.error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm">
          <p className="font-medium text-red-800">❌ Gagal menghubungkan toko</p>
          <p className="text-red-700 mt-1">{decodeURIComponent(params.error)}</p>
        </div>
      )}

      {/* Login Button */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Tambah Toko Baru</h2>
            <p className="text-sm text-gray-500 mt-1">
              Login dengan akun Shopee seller untuk menghubungkan toko ke dashboard.
            </p>
          </div>
          <a
            href="/api/auth/shopee/authorize"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg text-sm font-medium inline-flex items-center gap-2 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
            Login Shopee
          </a>
        </div>
      </div>

      {/* Shop List */}
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
              <tr><td colSpan={5} className="py-6 text-center text-gray-400">Belum ada toko terdaftar. Klik &quot;Login Shopee&quot; untuk menambah toko.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm">
        <p className="font-medium text-blue-800">ℹ️ Cara Menghubungkan Toko</p>
        <ol className="text-blue-700 mt-2 space-y-1 list-decimal list-inside">
          <li>Klik tombol <strong>Login Shopee</strong> di atas</li>
          <li>Login ke akun Shopee seller kamu</li>
          <li>Klik <strong>Authorize</strong> untuk memberikan akses</li>
          <li>Toko akan otomatis terhubung ke dashboard</li>
          <li>Data performa akan sync otomatis setiap hari jam 14:00 WIB</li>
        </ol>
      </div>
    </div>
  )
}
