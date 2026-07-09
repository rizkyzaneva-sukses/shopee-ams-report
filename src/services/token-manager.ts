import { db } from '@/lib/db'
import { refreshAccessToken } from '@/lib/shopee-client'

export async function ensureToken(shopId: number) {
  const shop = await db.shopCredential.findUnique({ where: { shopId } })
  if (!shop) throw new Error(`No credentials for shop ${shopId}`)

  // Refresh if expiring within 7 days
  const sevenDays = 7 * 86400 * 1000
  if (shop.tokenExpiry.getTime() - Date.now() < sevenDays) {
    try {
      const newToken = await refreshAccessToken(shop.refreshToken, shopId)
      await db.shopCredential.update({
        where: { shopId },
        data: {
          accessToken: newToken.access_token,
          refreshToken: newToken.refresh_token,
          tokenExpiry: new Date(Date.now() + newToken.expire_in * 1000),
          status: 'active',
        },
      })
      return newToken.access_token
    } catch (err) {
      await db.shopCredential.update({
        where: { shopId },
        data: { status: 'disconnected' },
      })
      throw new Error(`Token refresh failed for shop ${shopId}: ${err}`)
    }
  }

  if (shop.status === 'disconnected') {
    throw new Error(`Shop ${shopId} is disconnected — token expired, re-authorization needed`)
  }

  return shop.accessToken
}

export async function getTokenStatus(shopId: number) {
  const shop = await db.shopCredential.findUnique({ where: { shopId } })
  if (!shop) return 'not_found'

  if (shop.status === 'disconnected') return 'disconnected'

  const daysUntilExpiry = (shop.tokenExpiry.getTime() - Date.now()) / 86400000
  if (daysUntilExpiry < 7) return 'expiring'
  return 'active'
}

export async function getAllShops() {
  return db.shopCredential.findMany({ orderBy: { shopId: 'asc' } })
}
