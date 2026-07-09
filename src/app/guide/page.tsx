import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function GuidePage() {
  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/" className="text-blue-600 hover:underline text-sm">← Dashboard</Link>
        <h1 className="text-2xl font-bold">📖 Panduan Penggunaan</h1>
      </div>

      <p className="text-gray-600 leading-relaxed">
        Shopee AMS Report adalah dashboard untuk memantau performa affiliate marketing di Shopee.
        Dashboard ini otomatis mengambil data dari Shopee API dan menampilkannya dalam format yang mudah dibaca.
      </p>

      {/* ═══════════ NAVIGASI ═══════════ */}
      <Section title="🗺️ Navigasi" icon="🗺️">
        <p>Gunakan menu di bagian atas halaman untuk berpindah antar halaman:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          <NavCard
            icon="📊"
            title="Dashboard"
            desc="Ringkasan performa semua toko — total GMV, order, komisi, dan grafik tren harian."
          />
          <NavCard
            icon="📦"
            title="Produk"
            desc="Detail performa per produk — klik, order, GMV, komisi, dan CVR. Bisa diurutkan."
          />
          <NavCard
            icon="📣"
            title="Campaign"
            desc="Performa campaign affiliate — Open Campaign vs Targeted Campaign."
          />
          <NavCard
            icon="🔄"
            title="Conversion"
            desc="Detail setiap order yang masuk via affiliate — status komisi (pending/confirmed/paid/cancelled)."
          />
          <NavCard
            icon="✅"
            title="Validation"
            desc="Laporan validasi komisi — komisi asli vs komisi final, berapa yang di-reject Shopee."
          />
          <NavCard
            icon="🏪"
            title="Toko"
            desc="Daftar toko yang terdaftar, status koneksi, dan masa aktif token."
          />
        </div>
      </Section>

      {/* ═══════════ DASHBOARD ═══════════ */}
      <Section title="📊 Dashboard (Halaman Utama)">
        <p>Halaman utama menampilkan ringkasan performa affiliate untuk semua toko dalam rentang waktu tertentu.</p>

        <SubTitle>Card Ringkasan</SubTitle>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MiniCard label="Total GMV" value="Rp xxx" color="text-emerald-600" />
          <MiniCard label="Total Order" value="xxx" color="text-gray-800" />
          <MiniCard label="Total Komisi" value="Rp xxx" color="text-blue-600" />
          <MiniCard label="Komisi Di-reject" value="Rp xxx" color="text-red-600" />
        </div>

        <SubTitle>Grafik Tren Harian</SubTitle>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
          <li><strong>GMV Harian</strong> — total nilai transaksi per hari (hijau)</li>
          <li><strong>Order Harian</strong> — jumlah order per hari (biru)</li>
          <li><strong>Komisi Harian</strong> — total komisi per hari (ungu)</li>
        </ul>

        <SubTitle>Top 10 Produk by GMV</SubTitle>
        <p className="text-sm text-gray-700">10 produk dengan GMV tertinggi. Klik nama produk untuk melihat detail.</p>

        <SubTitle>Campaign Breakdown</SubTitle>
        <p className="text-sm text-gray-700">Perbandingan performa Open Campaign vs Targeted Campaign berdasarkan GMV, order, dan komisi.</p>
      </Section>

      {/* ═══════════ PRODUK ═══════════ */}
      <Section title="📦 Produk">
        <p>Halaman detail performa per produk. Menampilkan hingga 100 produk teratas.</p>

        <SubTitle>Filter & Sorting</SubTitle>
        <p className="text-sm text-gray-700">Klik tombol di bawah judul untuk mengurutkan data:</p>
        <div className="flex gap-2 mt-2">
          <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs">GMV</span>
          <span className="px-3 py-1 rounded-full bg-gray-100 text-xs">Order</span>
          <span className="px-3 py-1 rounded-full bg-gray-100 text-xs">Komisi</span>
          <span className="px-3 py-1 rounded-full bg-gray-100 text-xs">Klik</span>
        </div>

        <SubTitle>Yang Ditampilkan</SubTitle>
        <table className="w-full text-sm mt-2">
          <thead>
            <tr className="border-b text-left text-gray-500 text-xs">
              <th className="py-1">Kolom</th><th className="py-1">Keterangan</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            <tr><td className="py-1 font-medium">Produk</td><td>Nama produk</td></tr>
            <tr><td className="py-1 font-medium">Shop ID</td><td>ID toko pemilik produk</td></tr>
            <tr><td className="py-1 font-medium">Klik</td><td>Jumlah klik dari affiliate</td></tr>
            <tr><td className="py-1 font-medium">Order</td><td>Jumlah order dari affiliate</td></tr>
            <tr><td className="py-1 font-medium">GMV</td><td>Total nilai transaksi (Rp)</td></tr>
            <tr><td className="py-1 font-medium">Komisi</td><td>Total komisi affiliate (Rp)</td></tr>
            <tr><td className="py-1 font-medium">CVR</td><td>Conversion Rate (klik → order)</td></tr>
          </tbody>
        </table>
      </Section>

      {/* ═══════════ CAMPAIGN ═══════════ */}
      <Section title="📣 Campaign">
        <p>Membandingkan performa antar campaign affiliate.</p>

        <SubTitle>Jenis Campaign</SubTitle>
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 mt-0.5">Open</span>
            <div>
              <p className="text-sm font-medium">Open Campaign</p>
              <p className="text-xs text-gray-500">Campaign terbuka — semua affiliate bisa join dan mempromosikan produk tanpa undangan.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 mt-0.5">Targeted</span>
            <div>
              <p className="text-sm font-medium">Targeted Campaign</p>
              <p className="text-xs text-gray-500">Campaign undangan — seller memilih affiliate tertentu untuk mempromosikan produk dengan komisi khusus.</p>
            </div>
          </div>
        </div>

        <SubTitle>Filter</SubTitle>
        <p className="text-sm text-gray-700">Gunakan tombol filter untuk menampilkan semua, hanya Open, atau hanya Targeted campaign.</p>
      </Section>

      {/* ═══════════ CONVERSION ═══════════ */}
      <Section title="🔄 Conversion Report">
        <p>Detail setiap order yang masuk melalui program affiliate.</p>

        <SubTitle>Status Komisi</SubTitle>
        <div className="space-y-1">
          <StatusBadge status="pending" label="Pending" desc="Order baru, menunggu konfirmasi dari Shopee" />
          <StatusBadge status="confirmed" label="Confirmed" desc="Order dikonfirmasi, komisi akan dibayarkan" />
          <StatusBadge status="paid" label="Paid" desc="Komisi sudah dibayarkan ke affiliate" />
          <StatusBadge status="cancelled" label="Cancelled" desc="Order dibatalkan/retur, komisi tidak berlaku" />
        </div>

        <SubTitle>Yang Ditampilkan</SubTitle>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
          <li><strong>Order ID</strong> — nomor order Shopee</li>
          <li><strong>Produk</strong> — nama produk yang dibeli</li>
          <li><strong>Toko</strong> — nama toko penjual</li>
          <li><strong>Nilai Order</strong> — total harga beli (Rp)</li>
          <li><strong>Komisi</strong> — komisi affiliate (Rp)</li>
          <li><strong>Status</strong> — status komisi (pending/confirmed/paid/cancelled)</li>
          <li><strong>Waktu</strong> — waktu konversi order</li>
        </ul>
      </Section>

      {/* ═══════════ VALIDATION ═══════════ */}
      <Section title="✅ Validation Report">
        <p>Laporan validasi komisi dari Shopee. Menunjukkan komisi yang disetujui vs yang di-reject.</p>

        <SubTitle>Card Summary</SubTitle>
        <div className="space-y-2">
          <MiniCard label="Komisi Asli Total" value="Rp xxx" />
          <MiniCard label="Komisi Final Total" value="Rp xxx" color="text-green-600" />
          <MiniCard label="Komisi Hilang (Reject)" value="Rp xxx" color="text-red-600" />
        </div>

        <SubTitle>Status Validasi</SubTitle>
        <div className="space-y-1">
          <StatusBadge status="approved" label="Approved" desc="Komisi disetujui sesuai perhitungan awal" />
          <StatusBadge status="rejected" label="Rejected" desc="Komisi ditolak — order terdeteksi invalid (fraud, retur, dll)" />
          <StatusBadge status="pending" label="Pending" desc="Masih dalam proses validasi oleh Shopee" />
        </div>

        <SubTitle>Alasan Reject</SubTitle>
        <p className="text-sm text-gray-700">
          Kolom &quot;Alasan&quot; menunjukkan mengapa komisi di-reject.
          Contoh: order dari bot, retur barang, pelanggaran kebijakan affiliate, dll.
        </p>
      </Section>

      {/* ═══════════ TOKO ═══════════ */}
      <Section title="🏪 Toko">
        <p>Daftar semua toko yang terdaftar di dashboard ini.</p>

        <SubTitle>Yang Ditampilkan</SubTitle>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
          <li><strong>Shop ID</strong> — nomor identifikasi toko di Shopee</li>
          <li><strong>Nama Toko</strong> — nama toko</li>
          <li><strong>Status</strong> — 🟢 Connected (aktif) atau 🔴 Disconnected (token expired)</li>
          <li><strong>Token Expiry</strong> — masa berlaku access token</li>
          <li><strong>Terakhir Sync</strong> — kapan data terakhir di-sync</li>
        </ul>

        <Callout type="warning">
          Jika token sudah expired (&lt;7 hari), akan muncul tanda ⚠️.
          Perlu refresh token melalui Shopee Open Platform untuk mengembalikan koneksi.
        </Callout>
      </Section>

      {/* ═══════════ SYNC ═══════════ */}
      <Section title="🔄 Sync Data">
        <p>Bagaimana data diperbarui di dashboard.</p>

        <SubTitle>Sync Otomatis (Cron)</SubTitle>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
          <li>Jadwal: <strong>jam 14:00 WIB</strong> setiap hari</li>
          <li>Retry otomatis: 16:00, 18:00, 20:00 WIB jika gagal</li>
          <li>Data yang di-sync: Shop Performance, Product Performance, Campaign, Conversion, Validation</li>
          <li>Cron hanya mengambil data <strong>H-1</strong> (kemarin) karena data Shopee update H+1</li>
        </ul>

        <SubTitle>Sync Manual</SubTitle>
        <p className="text-sm text-gray-700">
          Klik tombol <strong>🔄 Sync Sekarang</strong> di halaman Dashboard untuk memaksa sync data kemarin.
          Berguna jika cron gagal atau ingin data terbaru segera.
        </p>

        <Callout type="info">
          Data Shopee affiliate biasanya tersedia setelah jam 12:00 siang WIB.
          Jika sync dijalankan sebelum jam tersebut, data mungkin belum lengkap (H-1 atau H-2).
        </Callout>
      </Section>

      {/* ═══════════ EXPORT ═══════════ */}
      <Section title="📥 Export Excel">
        <p>Download laporan lengkap dalam format Excel (.xlsx).</p>

        <SubTitle>Isi File Excel</SubTitle>
        <table className="w-full text-sm mt-2">
          <thead>
            <tr className="border-b text-left text-gray-500 text-xs">
              <th className="py-1">Sheet</th><th className="py-1">Isi</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            <tr><td className="py-1 font-medium">Shop Performance</td><td>Data performa per toko per hari</td></tr>
            <tr><td className="py-1 font-medium">Product Performance</td><td>Data performa per produk per hari</td></tr>
            <tr><td className="py-1 font-medium">Conversion Detail</td><td>Detail setiap order affiliate</td></tr>
            <tr><td className="py-1 font-medium">Validation Report</td><td>Laporan validasi komisi</td></tr>
          </tbody>
        </table>

        <SubTitle>Cara Export</SubTitle>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
          <li>Klik tombol <strong>📥 Export Excel</strong> di pojok kanan atas navbar</li>
          <li>File akan terdownload otomatis dengan nama <code className="bg-gray-100 px-1 rounded text-xs">AMS_Report_[from]_[to].xlsx</code></li>
          <li>Default: data 30 hari terakhir. Bisa diganti via URL parameter <code className="bg-gray-100 px-1 rounded text-xs">?from=2026-06-01&to=2026-06-30</code></li>
        </ul>
      </Section>

      {/* ═══════════ URL PARAMETERS ═══════════ */}
      <Section title="🔧 URL Parameters">
        <p className="text-sm text-gray-600">Halaman dashboard mendukung parameter URL untuk filtering:</p>
        <table className="w-full text-sm mt-2">
          <thead>
            <tr className="border-b text-left text-gray-500 text-xs">
              <th className="py-1">Parameter</th><th className="py-1">Contoh</th><th className="py-1">Keterangan</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            <tr><td className="py-1 font-mono text-xs">from</td><td className="font-mono text-xs">2026-06-01</td><td>Tanggal awal (YYYY-MM-DD)</td></tr>
            <tr><td className="py-1 font-mono text-xs">to</td><td className="font-mono text-xs">2026-06-30</td><td>Tanggal akhir (YYYY-MM-DD)</td></tr>
            <tr><td className="py-1 font-mono text-xs">sort</td><td className="font-mono text-xs">commission</td><td>Urutan (produk: gmv/orderCount/commission/clickCount)</td></tr>
            <tr><td className="py-1 font-mono text-xs">type</td><td className="font-mono text-xs">open</td><td>Jenis campaign (campaign: all/open/targeted)</td></tr>
            <tr><td className="py-1 font-mono text-xs">status</td><td className="font-mono text-xs">rejected</td><td>Filter status (conversion/validation: all/pending/confirmed/paid/cancelled/rejected)</td></tr>
          </tbody>
        </table>

        <SubTitle>Contoh URL</SubTitle>
        <div className="space-y-1">
          <code className="block bg-gray-50 p-2 rounded text-xs text-gray-700 break-all">
            https://ams.maulanacorp.my.id/?from=2026-06-01&to=2026-06-30
          </code>
          <code className="block bg-gray-50 p-2 rounded text-xs text-gray-700 break-all">
            https://ams.maulanacorp.my.id/product?sort=commission&from=2026-06-01
          </code>
          <code className="block bg-gray-50 p-2 rounded text-xs text-gray-700 break-all">
            https://ams.maulanacorp.my.id/validation?status=rejected
          </code>
          <code className="block bg-gray-50 p-2 rounded text-xs text-gray-700 break-all">
            https://ams.maulanacorp.my.id/api/report/export?from=2026-06-01&to=2026-06-30
          </code>
        </div>
      </Section>

      {/* ═══════════ TIPS ═══════════ */}
      <Section title="💡 Tips">
        <div className="space-y-3">
          <TipCard
            icon="⏰"
            title="Cek data setelah jam 2 siang"
            desc="Data affiliate Shopee biasanya update setelah jam 12:00 WIB. Jika sync sebelum jam tersebut, data bisa belum lengkap."
          />
          <TipCard
            icon="📊"
            title="Export untuk presentasi"
            desc="Gunakan tombol Export Excel untuk membuat laporan bulanan yang bisa dipresentasikan ke tim."
          />
          <TipCard
            icon="🔍"
            title="Cek validation untuk audit"
            desc="Halaman Validation membantu melihat komisi yang di-reject. Cek alasan reject untuk memahami pola penolakan."
          />
          <TipCard
            icon="📈"
            title="Pantau tren harian"
            desc="Grafik di Dashboard membantu melihat tren GMV, order, dan komisi dari waktu ke waktu."
          />
          <TipCard
            icon="🔄"
            title="Sync manual jika perlu"
            desc="Jika cron gagal atau butuh data terbaru, klik 'Sync Sekarang' di Dashboard."
          />
        </div>
      </Section>

      {/* ═══════════ TROUBLESHOOTING ═══════════ */}
      <Section title="🛠️ Troubleshooting">
        <div className="space-y-4">
          <TroubleItem
            problem="Dashboard menampilkan Rp 0 untuk semua angka"
            solutions={[
              "Belum ada data yang di-sync. Klik '🔄 Sync Sekarang' di Dashboard.",
              "Pastikan credentials Shopee sudah diisi dengan benar di environment variables.",
              "Cek log aplikasi untuk melihat error yang mungkin terjadi.",
            ]}
          />
          <TroubleItem
            problem="Sync gagal / error"
            solutions={[
              "Token Shopee mungkin expired — refresh token melalui Shopee Open Platform.",
              "Pastikan Partner ID dan Partner Key benar.",
              "Cek rate limit — sync berjalan berurutan antar toko untuk menghindari limit.",
            ]}
          />
          <TroubleItem
            problem="Halaman tidak bisa diakses (502/500)"
            solutions={[
              "Container mungkin sedang restart — tunggu 10-30 detik.",
              "Cek status container: docker ps --filter name=shopee-ams-app",
              "Cek log container: docker logs zaneva_shopee-ams-app",
            ]}
          />
          <TroubleItem
            problem="Token expiry muncul tanda ⚠️"
            solutions={[
              "Token Shopee berlaku terbatas. Refresh token sebelum expired.",
              "Akses Shopee Open Platform → App → Access Token → Refresh.",
              "Update token di environment variables lalu restart container.",
            ]}
          />
        </div>
      </Section>

      {/* Footer */}
      <div className="text-center text-sm text-gray-400 py-8 border-t">
        Shopee AMS Report v1.0 — Dibuat untuk Zaneva Team
      </div>
    </div>
  )
}

// ═══════════ COMPONENTS ═══════════

function Section({ title, children, icon }: { title: string; children: React.ReactNode; icon?: string }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border space-y-3">
      <h2 className="text-lg font-bold">{title}</h2>
      <div className="text-sm text-gray-700 leading-relaxed space-y-2">{children}</div>
    </div>
  )
}

function SubTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-semibold text-gray-800 mt-4">{children}</h3>
}

function NavCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border">
      <span className="text-xl">{icon}</span>
      <div>
        <p className="font-medium text-sm">{title}</p>
        <p className="text-xs text-gray-500">{desc}</p>
      </div>
    </div>
  )
}

function MiniCard({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="p-2 rounded-lg bg-gray-50 border">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-sm font-bold ${color || ''}`}>{value}</p>
    </div>
  )
}

function StatusBadge({ status, label, desc }: { status: string; label: string; desc: string }) {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-green-100 text-green-700',
    paid: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-red-100 text-red-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  }
  return (
    <div className="flex items-center gap-2">
      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100'}`}>
        {label}
      </span>
      <span className="text-xs text-gray-500">{desc}</span>
    </div>
  )
}

function Callout({ type, children }: { type: 'info' | 'warning'; children: React.ReactNode }) {
  const colors = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  }
  const icons = { info: 'ℹ️', warning: '⚠️' }
  return (
    <div className={`rounded-lg border p-3 text-sm ${colors[type]}`}>
      <span className="mr-1">{icons[type]}</span>{children}
    </div>
  )
}

function TipCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
      <span className="text-lg">{icon}</span>
      <div>
        <p className="font-medium text-sm text-emerald-800">{title}</p>
        <p className="text-xs text-emerald-700">{desc}</p>
      </div>
    </div>
  )
}

function TroubleItem({ problem, solutions }: { problem: string; solutions: string[] }) {
  return (
    <div className="border rounded-lg p-4">
      <p className="font-medium text-sm text-red-700 mb-2">❌ {problem}</p>
      <ul className="list-disc list-inside space-y-1 text-xs text-gray-600">
        {solutions.map((s, i) => <li key={i}>{s}</li>)}
      </ul>
    </div>
  )
}
