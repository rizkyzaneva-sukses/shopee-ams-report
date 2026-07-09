import { NextRequest, NextResponse } from 'next/server'
import { getShopeeAuthUrl } from '@/lib/shopee-client'

export const dynamic = 'force-dynamic'

/**
 * GET /api/auth/shopee/authorize
 * Generates the Shopee OAuth URL and redirects user to Shopee login page
 */
export async function GET(req: NextRequest) {
  try {
    // Use the actual domain, not the container's internal address
    const origin = 'https://ams.maulanacorp.my.id'

    // The callback URL where Shopee will redirect after authorization
    const redirectUri = `${origin}/api/auth/shopee/callback`

    // Generate Shopee auth URL
    const authUrl = getShopeeAuthUrl(redirectUri)

    // Redirect user to Shopee login page
    return NextResponse.redirect(authUrl)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
