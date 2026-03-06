import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async () => {
  return prisma.faq.findMany({
    where: { published: true },
    orderBy: { sortOrder: 'asc' },
  })
})
