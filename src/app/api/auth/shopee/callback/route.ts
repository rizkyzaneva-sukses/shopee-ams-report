import { NextRequest, NextResponse } from 'next/server'
import { exchangeAccessToken } from '@/lib/shopee-client'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

/**
 * GET /api/auth/shopee/callback
 * Shopee redirects here after user authorizes with ?code=xxx&shop_id=xxx
 * Exchange code for tokens and save to database
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const code = searchParams.get('code')
    const shopId = searchParams.get('shop_id')

    if (!code || !shopId) {
      return NextResponse.redirect(
        new URL('/shops?error=missing_params', req.url)
      )
    }

    // Exchange authorization code for access_token
    const tokenData = await exchangeAccessToken(code, Number(shopId))

    // Calculate token expiry
    const expireIn = tokenData.expire_in || 4 * 3600 // default 4 hours
    const tokenExpiry = new Date(Date.now() + expireIn * 1000)

    // Upsert shop credentials
    await db.shopCredential.upsert({
      where: { shopId: tokenData.shop_id || Number(shopId) },
      update: {
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        tokenExpiry,
        status: 'active',
        shopName: tokenData.shop_name || `Shop ${shopId}`,
      },
      create: {
        shopId: tokenData.shop_id || Number(shopId),
        shopName: tokenData.shop_name || `Shop ${shopId}`,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        tokenExpiry,
        status: 'active',
      },
    })

    // Redirect to shops page with success message
    return NextResponse.redirect(
      new URL(`/shops?success=shop_connected&shop_id=${shopId}`, req.url)
    )
  } catch (err: any) {
    console.error('OAuth callback error:', err)
    return NextResponse.redirect(
      new URL(`/shops?error=${encodeURIComponent(err.message)}`, req.url)
    )
  }
}
