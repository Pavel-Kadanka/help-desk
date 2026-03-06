import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const categorySlug = query.category as string | undefined

  return prisma.topic.findMany({
    where: {
      published: true,
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
    },
    orderBy: { sortOrder: 'asc' },
    select: {
      id: true,
      title: true,
      slug: true,
      summary: true,
      sortOrder: true,
      category: { select: { id: true, name: true, slug: true } },
    },
  })
})
