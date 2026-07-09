import { db } from '@/lib/db'
import { ensureToken } from './token-manager'
import { getShopPerformance, getProductPerformance, getOpenCampaignPerformance, getConversionReport, getValidationReport, fetchAllPages } from '@/lib/shopee-client'
import { sleep } from '@/lib/utils'

export async function syncShopPerformance(shopId: number, startDate: string, endDate: string) {
  const token = await ensureToken(shopId)
  const items = await fetchAllPages(
    (page) => getShopPerformance(shopId, token, startDate, endDate, page),
    'shop_performance_list'
  )
  for (const item of items) {
    await db.shopPerformanceSnapshot.upsert({
      where: { shopId_date: { shopId: item.shop_id, date: new Date(startDate) } },
      update: {
        shopName: item.shop_name || '',
        clickCount: item.click_count,
        orderCount: item.order_count,
        gmv: item.gmv,
        commission: item.commission,
        conversionRate: item.conversion_rate,
        unitSoldCount: item.unit_sold_count,
      },
      create: {
        shopId: item.shop_id,
        shopName: item.shop_name || '',
        date: new Date(startDate),
        clickCount: item.click_count,
        orderCount: item.order_count,
        gmv: item.gmv,
        commission: item.commission,
        conversionRate: item.conversion_rate,
        unitSoldCount: item.unit_sold_count,
      },
    })
  }
  return items.length
}

export async function syncProductPerformance(shopId: number, startDate: string, endDate: string) {
  const token = await ensureToken(shopId)
  const items = await fetchAllPages(
    (page) => getProductPerformance(shopId, token, startDate, endDate, page),
    'product_performance_list'
  )
  for (const item of items) {
    await db.productPerformanceSnapshot.upsert({
      where: { productId_date: { productId: item.product_id, date: new Date(startDate) } },
      update: {
        productName: item.product_name,
        shopId: item.shop_id,
        clickCount: item.click_count,
        orderCount: item.order_count,
        gmv: item.gmv,
        commission: item.commission,
        conversionRate: item.conversion_rate,
        unitSoldCount: item.unit_sold_count,
        commissionRate: item.affiliate_commission_rate,
      },
      create: {
        productId: item.product_id,
        productName: item.product_name,
        shopId: item.shop_id,
        date: new Date(startDate),
        clickCount: item.click_count,
        orderCount: item.order_count,
        gmv: item.gmv,
        commission: item.commission,
        conversionRate: item.conversion_rate,
        unitSoldCount: item.unit_sold_count,
        commissionRate: item.affiliate_commission_rate,
      },
    })
  }
  return items.length
}

export async function syncCampaignPerformance(shopId: number, startDate: string, endDate: string) {
  const token = await ensureToken(shopId)
  const openItems = await fetchAllPages(
    (page) => getOpenCampaignPerformance(shopId, token, startDate, endDate, page),
    'open_campaign_performance_list'
  )
  for (const item of openItems) {
    await db.campaignPerformance.upsert({
      where: { campaignId_date: { campaignId: item.campaign_id, date: new Date(startDate) } },
      update: {
        campaignName: item.campaign_name, campaignType: 'open', shopId: item.shop_id,
        clickCount: item.click_count, orderCount: item.order_count, gmv: item.gmv,
        commission: item.commission, conversionRate: item.conversion_rate, unitSoldCount: item.unit_sold_count,
      },
      create: {
        campaignId: item.campaign_id, campaignName: item.campaign_name, campaignType: 'open',
        shopId: item.shop_id, date: new Date(startDate),
        clickCount: item.click_count, orderCount: item.order_count, gmv: item.gmv,
        commission: item.commission, conversionRate: item.conversion_rate, unitSoldCount: item.unit_sold_count,
      },
    })
  }
  await sleep(300)

  const targetedItems = await fetchAllPages(
    (page) => getOpenCampaignPerformance(shopId, token, startDate, endDate, page),
    'open_campaign_performance_list'
  )
  for (const item of targetedItems) {
    await db.campaignPerformance.upsert({
      where: { campaignId_date: { campaignId: item.campaign_id, date: new Date(startDate) } },
      update: {
        campaignName: item.campaign_name, campaignType: 'targeted', shopId: item.shop_id,
        clickCount: item.click_count, orderCount: item.order_count, gmv: item.gmv,
        commission: item.commission, conversionRate: item.conversion_rate, unitSoldCount: item.unit_sold_count,
      },
      create: {
        campaignId: item.campaign_id, campaignName: item.campaign_name, campaignType: 'targeted',
        shopId: item.shop_id, date: new Date(startDate),
        clickCount: item.click_count, orderCount: item.order_count, gmv: item.gmv,
        commission: item.commission, conversionRate: item.conversion_rate, unitSoldCount: item.unit_sold_count,
      },
    })
  }
  return openItems.length + targetedItems.length
}

export async function syncConversions(shopId: number, startDate: string, endDate: string) {
  const token = await ensureToken(shopId)
  const items = await fetchAllPages(
    (page) => getConversionReport(shopId, token, startDate, endDate, page),
    'conversion_list'
  )
  for (const item of items) {
    await db.conversionRecord.upsert({
      where: { orderId: String(item.order_id) },
      update: {
        productId: item.product_id, productName: item.product_name, shopId: item.shop_id,
        shopName: item.shop_name, orderAmount: item.order_amount, commission: item.commission,
        commissionRate: item.affiliate_commission_rate, conversionTime: new Date(item.conversion_time),
        orderStatus: item.order_status, commissionStatus: item.commission_status,
        campaignId: item.campaign_id || null, unitSold: item.unit_sold || 1,
      },
      create: {
        orderId: String(item.order_id), productId: item.product_id, productName: item.product_name,
        shopId: item.shop_id, shopName: item.shop_name, orderAmount: item.order_amount,
        commission: item.commission, commissionRate: item.affiliate_commission_rate,
        conversionTime: new Date(item.conversion_time), orderStatus: item.order_status,
        commissionStatus: item.commission_status, campaignId: item.campaign_id || null,
        unitSold: item.unit_sold || 1,
      },
    })
  }
  return items.length
}

export async function syncValidations(shopId: number, startDate: string, endDate: string) {
  const token = await ensureToken(shopId)
  const items = await fetchAllPages(
    (page) => getValidationReport(shopId, token, startDate, endDate, page),
    'validation_report_list'
  )
  for (const item of items) {
    const diff = (Number(item.original_commission) || 0) - (Number(item.adjusted_commission) || 0)
    await db.validationRecord.upsert({
      where: { validationId: String(item.validation_id) },
      update: {
        orderId: String(item.order_id), productId: item.product_id, productName: item.product_name,
        shopId: item.shop_id, validationStatus: item.validation_status,
        originalCommission: item.original_commission, adjustedCommission: item.adjusted_commission,
        commissionDiff: diff, reason: item.reason || null, validationTime: new Date(item.validation_time),
      },
      create: {
        validationId: String(item.validation_id), orderId: String(item.order_id),
        productId: item.product_id, productName: item.product_name, shopId: item.shop_id,
        validationStatus: item.validation_status, originalCommission: item.original_commission,
        adjustedCommission: item.adjusted_commission, commissionDiff: diff,
        reason: item.reason || null, validationTime: new Date(item.validation_time),
      },
    })
  }
  return items.length
}

export async function fullSync(shopIds: number[], date: string) {
  const results: { shopId: number; status: string; counts: Record<string, number>; error?: string }[] = []

  for (const shopId of shopIds) {
    const counts: Record<string, number> = {}
    try {
      counts.shop = await syncShopPerformance(shopId, date, date)
      await sleep(500)
      counts.product = await syncProductPerformance(shopId, date, date)
      await sleep(500)
      counts.campaign = await syncCampaignPerformance(shopId, date, date)
      await sleep(500)
      counts.conversion = await syncConversions(shopId, date, date)
      await sleep(500)
      counts.validation = await syncValidations(shopId, date, date)

      await db.shopCredential.update({
        where: { shopId },
        data: { lastSyncAt: new Date() },
      })
      results.push({ shopId, status: 'ok', counts })
    } catch (err: any) {
      results.push({ shopId, status: 'error', counts, error: err.message })
    }
    await sleep(1000) // jeda antar toko
  }

  return results
}
