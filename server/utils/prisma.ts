import { PrismaClient } from '@prisma/client'

let _prisma: PrismaClient | undefined

function getClient(): PrismaClient {
  if (!_prisma) {
    const url = process.env.DATABASE_URL
    if (!url) throw new Error('DATABASE_URL is not set in environment')
    _prisma = new PrismaClient({ datasourceUrl: url })
  }
  return _prisma
}

// Proxy defers instantiation until the first method call (inside an event handler,
// after Nitro has already loaded .env)
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop: string) {
    return (getClient() as any)[prop]
  },
})
