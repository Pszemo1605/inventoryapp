import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  console.log(process.env.POSTGRES_PRISMA_URL)
  return new PrismaClient()
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma

const db =  prisma;

export default db
