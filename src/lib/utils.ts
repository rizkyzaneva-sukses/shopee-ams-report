export function formatNumber(n: number | bigint | null | undefined | any): string {
  if (n == null) return '0'
  const num = typeof n === 'object' && n?.toNumber ? n.toNumber() : typeof n === 'bigint' ? Number(n) : Number(n)
  return new Intl.NumberFormat('id-ID').format(num)
}

export function formatCurrency(n: number | bigint | null | undefined | any): string {
  if (n == null) return 'Rp 0'
  const num = typeof n === 'object' && n?.toNumber ? n.toNumber() : typeof n === 'bigint' ? Number(n) : Number(n)
  return `Rp ${new Intl.NumberFormat('id-ID').format(num)}`
}

export function formatPercent(n: number | null | undefined | any): string {
  if (n == null) return '0%'
  const num = typeof n === 'object' && n?.toNumber ? n.toNumber() : Number(n)
  return `${(num * 100).toFixed(2)}%`
}

export function formatDate(d: string | Date): string {
  const date = typeof d === 'string' ? new Date(d) : d
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function getDateRange(daysBack: number): { from: string; to: string } {
  const now = new Date()
  const from = new Date(now)
  from.setDate(from.getDate() - daysBack)
  return {
    from: from.toISOString().split('T')[0],
    to: now.toISOString().split('T')[0],
  }
}

export function dateChunks(start: string, end: string, chunkDays: number): { start: string; end: string }[] {
  const chunks: { start: string; end: string }[] = []
  let s = new Date(start)
  const e = new Date(end)
  while (s <= e) {
    const chunkEnd = new Date(s)
    chunkEnd.setDate(chunkEnd.getDate() + chunkDays - 1)
    if (chunkEnd > e) chunkEnd.setTime(e.getTime())
    chunks.push({ start: s.toISOString().split('T')[0], end: chunkEnd.toISOString().split('T')[0] })
    s = new Date(chunkEnd)
    s.setDate(s.getDate() + 1)
  }
  return chunks
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
