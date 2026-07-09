import crypto from 'crypto'

const PARTNER_ID = process.env.SHOPEE_PARTNER_ID!
const PARTNER_KEY = process.env.SHOPEE_PARTNER_KEY!
const BASE_URL = 'https://partner.shopeemobile.com/api/v2'

function generateSign(path: string, timestamp: number, shopId: number, accessToken: string): string {
  const baseString = `${PARTNER_ID}${path}${timestamp}${accessToken}${shopId}`
  return crypto.createHmac('sha256', PARTNER_KEY).update(baseString).digest('hex')
}

export async function shopeeGet(endpoint: string, shopId: number, accessToken: string, params: Record<string, any> = {}) {
  const path = `/api/v2/ams/${endpoint}`
  const timestamp = Math.floor(Date.now() / 1000)
  const sign = generateSign(path, timestamp, shopId, accessToken)

  const url = new URL(`${BASE_URL}/ams/${endpoint}`)
  url.searchParams.set('partner_id', PARTNER_ID)
  url.searchParams.set('timestamp', String(timestamp))
  url.searchParams.set('access_token', accessToken)
  url.searchParams.set('shop_id', String(shopId))
  url.searchParams.set('sign', sign)

  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) url.searchParams.set(k, String(v))
  })

  const res = await fetch(url.toString(), {
    headers: { 'Content-Type': 'application/json' },
  })
  const data = await res.json()

  if (data.error) {
    throw new Error(`Shopee API [${endpoint}] error: ${data.error} - ${data.message}`)
  }
  return data.response
}

// ── Performance endpoints ──

export async function getShopPerformance(shopId: number, token: string, startDate: string, endDate: string, page = 1) {
  return shopeeGet('get_shop_performance', shopId, token, {
    start_date: startDate, end_date: endDate, page_size: 50, page_no: page,
  })
}

export async function getProductPerformance(shopId: number, token: string, startDate: string, endDate: string, page = 1) {
  return shopeeGet('get_product_performance', shopId, token, {
    start_date: startDate, end_date: endDate, page_size: 50, page_no: page,
  })
}

export async function getOpenCampaignPerformance(shopId: number, token: string, startDate: string, endDate: string, page = 1) {
  return shopeeGet('get_open_campaign_performance', shopId, token, {
    start_date: startDate, end_date: endDate, page_size: 50, page_no: page,
  })
}

export async function getTargetedCampaignPerformance(shopId: number, token: string, startDate: string, endDate: string, page = 1) {
  return shopeeGet('get_targeted_campaign_performance', shopId, token, {
    start_date: startDate, end_date: endDate, page_size: 50, page_no: page,
  })
}

export async function getConversionReport(shopId: number, token: string, startDate: string, endDate: string, page = 1) {
  return shopeeGet('get_conversion_report', shopId, token, {
    start_date: startDate, end_date: endDate, page_size: 50, page_no: page,
  })
}

export async function getValidationReport(shopId: number, token: string, startDate: string, endDate: string, page = 1) {
  return shopeeGet('get_validation_report', shopId, token, {
    start_date: startDate, end_date: endDate, page_size: 50, page_no: page,
  })
}

export async function getValidationList(shopId: number, token: string, page = 1) {
  return shopeeGet('get_validation_list', shopId, token, {
    page_size: 50, page_no: page,
  })
}

export async function refreshAccessToken(refreshToken: string, shopId: number) {
  const path = '/api/v2/auth/token/get_access_token'
  const timestamp = Math.floor(Date.now() / 1000)
  const sign = generateSign(path, timestamp, shopId, refreshToken)

  const url = new URL(`${BASE_URL}/auth/token/get_access_token`)
  url.searchParams.set('partner_id', PARTNER_ID)
  url.searchParams.set('timestamp', String(timestamp))
  url.searchParams.set('sign', sign)
  url.searchParams.set('shop_id', String(shopId))
  url.searchParams.set('refresh_token', refreshToken)

  const res = await fetch(url.toString())
  const data = await res.json()

  if (data.error) throw new Error(`Token refresh failed: ${data.error} - ${data.message}`)
  return data.response // { access_token, refresh_token, expire_in }
}

export async function fetchAllPages<T>(
  fetchFn: (page: number) => Promise<Record<string, any> & { more: boolean }>,
  listKey: string,
  maxPages = 20
): Promise<T[]> {
  const allItems: T[] = []
  for (let page = 1; page <= maxPages; page++) {
    const result = await fetchFn(page)
    allItems.push(...(result[listKey] || []))
    if (!result.more) break
  }
  return allItems
}
