export function getShopeeConfig() {
  const shopIds = (process.env.SHOPEE_SHOP_IDS || '').split(',').map(Number).filter(Boolean)
  return {
    partnerId: parseInt(process.env.SHOPEE_PARTNER_ID || '0'),
    partnerKey: process.env.SHOPEE_PARTNER_KEY || '',
    shopIds,
  }
}
