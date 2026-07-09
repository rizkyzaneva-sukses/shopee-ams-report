import { NextRequest, NextResponse } from 'next/server'
import ExcelJS from 'exceljs'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const from = searchParams.get('from') || new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0]
    const to = searchParams.get('to') || new Date().toISOString().split('T')[0]

    const workbook = new ExcelJS.Workbook()
    workbook.creator = 'Shopee AMS Report'

    // Sheet 1: Shop Performance
    const shopSheet = workbook.addWorksheet('Shop Performance')
    shopSheet.columns = [
      { header: 'Tanggal', key: 'date', width: 12 },
      { header: 'Shop ID', key: 'shopId', width: 12 },
      { header: 'Nama Toko', key: 'shopName', width: 25 },
      { header: 'Klik', key: 'clickCount', width: 10 },
      { header: 'Order', key: 'orderCount', width: 10 },
      { header: 'GMV (Rp)', key: 'gmv', width: 18 },
      { header: 'Komisi (Rp)', key: 'commission', width: 18 },
      { header: 'CVR', key: 'conversionRate', width: 10 },
      { header: 'Unit Terjual', key: 'unitSoldCount', width: 12 },
    ]
    const shopData = await db.shopPerformanceSnapshot.findMany({
      where: { date: { gte: new Date(from), lte: new Date(to) } },
      orderBy: [{ date: 'desc' }, { gmv: 'desc' }],
    })
    shopData.forEach(row => shopSheet.addRow({
      date: row.date, shopId: row.shopId, shopName: row.shopName,
      clickCount: row.clickCount, orderCount: row.orderCount,
      gmv: Number(row.gmv), commission: Number(row.commission),
      conversionRate: Number(row.conversionRate), unitSoldCount: row.unitSoldCount,
    }))

    // Sheet 2: Product Performance
    const prodSheet = workbook.addWorksheet('Product Performance')
    prodSheet.columns = [
      { header: 'Tanggal', key: 'date', width: 12 },
      { header: 'Product ID', key: 'productId', width: 12 },
      { header: 'Nama Produk', key: 'productName', width: 30 },
      { header: 'Klik', key: 'clickCount', width: 10 },
      { header: 'Order', key: 'orderCount', width: 10 },
      { header: 'GMV (Rp)', key: 'gmv', width: 18 },
      { header: 'Komisi (Rp)', key: 'commission', width: 18 },
      { header: 'CVR', key: 'conversionRate', width: 10 },
      { header: 'Rate Komisi', key: 'commissionRate', width: 12 },
    ]
    const prodData = await db.productPerformanceSnapshot.findMany({
      where: { date: { gte: new Date(from), lte: new Date(to) } },
      orderBy: [{ date: 'desc' }, { gmv: 'desc' }],
    })
    prodData.forEach(row => prodSheet.addRow({
      date: row.date, productId: row.productId, productName: row.productName,
      clickCount: row.clickCount, orderCount: row.orderCount,
      gmv: Number(row.gmv), commission: Number(row.commission),
      conversionRate: Number(row.conversionRate), commissionRate: Number(row.commissionRate),
    }))

    // Sheet 3: Conversion
    const convSheet = workbook.addWorksheet('Conversion Detail')
    convSheet.columns = [
      { header: 'Order ID', key: 'orderId', width: 18 },
      { header: 'Produk', key: 'productName', width: 30 },
      { header: 'Toko', key: 'shopName', width: 25 },
      { header: 'Nilai Order', key: 'orderAmount', width: 15 },
      { header: 'Komisi', key: 'commission', width: 15 },
      { header: 'Status Komisi', key: 'commissionStatus', width: 15 },
      { header: 'Waktu Konversi', key: 'conversionTime', width: 20 },
    ]
    const convData = await db.conversionRecord.findMany({
      where: { conversionTime: { gte: new Date(from), lte: new Date(to) } },
      orderBy: { conversionTime: 'desc' },
    })
    convData.forEach(row => convSheet.addRow({
      orderId: row.orderId, productName: row.productName, shopName: row.shopName,
      orderAmount: Number(row.orderAmount), commission: Number(row.commission),
      commissionStatus: row.commissionStatus, conversionTime: row.conversionTime,
    }))

    // Sheet 4: Validation
    const valSheet = workbook.addWorksheet('Validation Report')
    valSheet.columns = [
      { header: 'Order ID', key: 'orderId', width: 18 },
      { header: 'Produk', key: 'productName', width: 30 },
      { header: 'Status', key: 'validationStatus', width: 12 },
      { header: 'Komisi Asli', key: 'originalCommission', width: 15 },
      { header: 'Komisi Final', key: 'adjustedCommission', width: 15 },
      { header: 'Selisih', key: 'commissionDiff', width: 15 },
      { header: 'Alasan', key: 'reason', width: 30 },
      { header: 'Waktu', key: 'validationTime', width: 20 },
    ]
    const valData = await db.validationRecord.findMany({
      where: { validationTime: { gte: new Date(from), lte: new Date(to) } },
      orderBy: { validationTime: 'desc' },
    })
    valData.forEach(row => valSheet.addRow({
      orderId: row.orderId, productName: row.productName, validationStatus: row.validationStatus,
      originalCommission: Number(row.originalCommission), adjustedCommission: Number(row.adjustedCommission),
      commissionDiff: Number(row.commissionDiff), reason: row.reason || '', validationTime: row.validationTime,
    }))

    // Style headers
    ;[shopSheet, prodSheet, convSheet, valSheet].forEach(sheet => {
      const headerRow = sheet.getRow(1)
      headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } }
      headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } }
    })

    const buffer = await workbook.xlsx.writeBuffer()

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="AMS_Report_${from}_${to}.xlsx"`,
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
