import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Run: npx prisma db seed
// Seed shop credentials — edit the data below before running

const SHOPS = [
  {
    shopId: 111111,
    shopName: 'Toko 1',
    accessToken: 'YOUR_ACCESS_TOKEN_HERE',
    refreshToken: 'YOUR_REFRESH_TOKEN_HERE',
    tokenExpiry: new Date('2027-01-01'),
    status: 'active',
  },
  {
    shopId: 222222,
    shopName: 'Toko 2',
    accessToken: 'YOUR_ACCESS_TOKEN_HERE',
    refreshToken: 'YOUR_REFRESH_TOKEN_HERE',
    tokenExpiry: new Date('2027-01-01'),
    status: 'active',
  },
  {
    shopId: 333333,
    shopName: 'Toko 3 (Belum Aktif)',
    accessToken: 'YOUR_ACCESS_TOKEN_HERE',
    refreshToken: 'YOUR_REFRESH_TOKEN_HERE',
    tokenExpiry: new Date('2027-01-01'),
    status: 'active',
  },
  {
    shopId: 444444,
    shopName: 'Toko 4 (Belum Aktif)',
    accessToken: 'YOUR_ACCESS_TOKEN_HERE',
    refreshToken: 'YOUR_REFRESH_TOKEN_HERE',
    tokenExpiry: new Date('2027-01-01'),
    status: 'active',
  },
]

async function main() {
  for (const shop of SHOPS) {
    await prisma.shopCredential.upsert({
      where: { shopId: shop.shopId },
      update: shop,
      create: shop,
    })
    console.log(`✅ Upserted shop ${shop.shopId}: ${shop.shopName}`)
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
