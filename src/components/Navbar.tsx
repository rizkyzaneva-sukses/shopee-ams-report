import Link from 'next/link'

const links = [
  { href: '/', label: '📊 Dashboard', active: false },
  { href: '/product', label: '📦 Produk' },
  { href: '/campaign', label: '📣 Campaign' },
  { href: '/conversion', label: '🔄 Conversion' },
  { href: '/validation', label: '✅ Validation' },
  { href: '/shops', label: '🏪 Toko' },
]

export default function Navbar() {
  return (
    <nav className="bg-white border-b px-6 py-3 flex items-center gap-6">
      <span className="font-bold text-lg">Shopee AMS</span>
      <div className="flex gap-1">
        {links.map(l => (
          <Link key={l.href} href={l.href}
            className="px-3 py-1.5 rounded-lg text-sm hover:bg-gray-100 text-gray-700">
            {l.label}
          </Link>
        ))}
      </div>
      <div className="ml-auto">
        <a href="/api/report/export" className="bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-emerald-700">
          📥 Export Excel
        </a>
      </div>
    </nav>
  )
}
